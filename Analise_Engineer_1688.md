# Análise Engineer 1688 — Engenharia Reversa

Analisei a pasta `1668` no branch `main`. O conteúdo é uma **extensão Chrome Manifest V3 para 1688**, versão `1.1.4`, com foco em:

```text
busca por imagem
busca de fornecedor similar
assistente flutuante
painel lateral
ações em página de detalhe 1688
logística de pedidos
integração com seller centers
atalhos de screenshot
tradução / seleção de texto
AI para imagem
```

A extensão é claramente construída com bundle/minificação Parcel/Plasmo, então a leitura é por engenharia reversa de código empacotado.

---

## 1. Arquitetura geral

O `manifest.json` mostra que a extensão usa:

```text
Manifest V3
background service worker
content scripts em várias páginas
side panel
popup
storage
webRequest
cookies
scripting
contextMenus
declarativeNetRequest
alarms
```

O service worker está definido em `static/background/index.js`, e a extensão injeta vários content scripts em URLs específicas e também em `<all_urls>`.

Fluxo macro:

```text
manifest.json
  ↓
injeta scripts por tipo de página
  ↓
content script detecta contexto da página
  ↓
lê opções salvas no chrome.storage.local
  ↓
injeta botões / painéis / popovers
  ↓
captura imagem, título, preço, pedido ou produto
  ↓
envia mensagens ao background
  ↓
background resolve busca, logística, permissões, logs e APIs
  ↓
UI recebe resultado e abre painel, nova aba ou modal
```

---

## 2. Scripts principais mapeados

Pelo `manifest.json`, os principais scripts são:

```text
aiFindInMainSearch.d85bc82a.js
allWebsite.e084e880.js
bindShop.bf8ce889.js
content-script.49c7f7ee.js
content-scripts-of-pick.7776a3b9.js
content.0f069321.js
detailPanel.ba624b85.js
findSameGoodsBtn.3ed716dc.js
getWWUnRead.21bf76f1.js
installationChecker.1c3dad9b.js
orderLogistics.f491b9f7.js
pagePilot.f212008d.js
wordsQuickCopy.f8d2e6a5.js
wordsSelection.08ebf15a.js
FloatingAssistant.d52f9211.js
detailPanelPopUp.b5961dc1.js
```

Eles são carregados conforme o tipo de página:

```text
s.1688.com/selloffer/offer_search.htm
detail.1688.com
work.1688.com/home/buyer.htm
trade.1688.com/order/*
seller.shopee.cn
seller.ozon.ru
AliExpress CSP
TikTok Shop
Temu/KuaJing seller
<all_urls>
```

Isso indica que a extensão não é só 1688 puro. Ela atua como **assistente cross-marketplace**, com 1688 como núcleo de sourcing.

---

# Funcionamento por módulo

## 3. Módulo “Find Same Goods” / encontrar fornecedor similar

Arquivo analisado: `findSameGoodsBtn.3ed716dc.js`.

Esse é um dos módulos mais importantes para o ApexSeller.

A classe central é `FindSameGoodsBtnManager`. O fluxo é:

```text
run()
  ↓
prepare()
  ↓
lê opções do storage
  ↓
verifica se INSERT_DOM_VISIBLE está ativo
  ↓
lê configuração findSameGoodsBtn
  ↓
verifica se a URL atual bate com algum regex suportado
  ↓
busca configs remotas do botão
  ↓
startBuilding()
  ↓
varre DOM atual
  ↓
observa mutações futuras com MutationObserver
  ↓
injeta botão em cards de produto
```

O método `prepare()` carrega opções com `getCachedOptions()`, verifica `INSERT_DOM_VISIBLE`, lê `findSameGoodsBtn.supportedList` do storage e procura um regex compatível com `location.href`.

### Ponto-chave

A extensão é **config-driven**. Ela não tem seletor fixo único para cada site. Ela busca uma configuração remota/local com:

```text
website
regex
container.selector
offerInformation.image
offerInformation.price
offerInformation.title
offerInformation.url
btn.insertRelativePath
mountChecker
styleSheet
```

Isso permite que a mesma lógica funcione em Shopee, Amazon, AliExpress, Ozon, TikTok Shop ou outros sites, desde que exista uma configuração de seletor.

---

## 4. Como o botão é inserido

O fluxo de construção é:

```text
startBuilding()
  ↓
batchBuild(document.body)
  ↓
observe()
  ↓
MutationObserver detecta novos cards
  ↓
build(container, config)
  ↓
cria instância do botão
  ↓
buildBtn()
  ↓
appendChild no container certo
```

O script evita duplicidade procurando se o botão já existe dentro do container. Também suporta inserir o botão em uma posição relativa dentro do card usando `insertRelativePath`.

### Interpretação

Esse padrão é muito útil para o ApexSeller:

```text
não acoplar regra de DOM diretamente no código
usar configuração por marketplace/site
permitir hotfix de seletor sem redeploy da extensão
```

---

## 5. Busca por imagem / fornecedor similar

Quando o usuário clica no botão:

```text
handleBtnClick()
  ↓
envia log de clique
  ↓
se action == "jump", abre URL configurada
  ↓
senão chama findSameGoods()
```

A função `findSameGoods()` faz:

```text
lê imagem do produto
lê preço
lê título
chama searchByImage(image, { searchMode, filterData, price, title })
recebe URL de resultado
adiciona priceEnd se houver preço
adiciona hash #sm-filtbar
abre nova aba
```

O código mostra que a busca usa `offerImage`, `offerPrice` e `offerTitle`, e chama `searchByImage()` com esses dados.

### Engenharia reversa da lógica

```text
produto em marketplace externo
  ↓
extrai imagem/título/preço do card
  ↓
envia imagem para motor de busca 1688
  ↓
recebe URL de busca visual
  ↓
aplica filtro de preço
  ↓
abre resultado para sourcing
```

Isso é exatamente o núcleo de um fluxo de **produto vencedor → fornecedor similar**.

---

## 6. Popover de recomendações e menor preço

O botão também tem um modo avançado:

```text
preloadImageSearch()
  ↓
verifica se popover está habilitado
  ↓
verifica se container tem largura suficiente
  ↓
se houver imagem:
      chama getSameGoodsList()
      busca lista de produtos similares
      calcula menor preço
      renderiza popover
      mostra preço baixo no botão
```

A lógica calcula o menor preço lendo:

```text
tradePrice.offerPrice.priceInfo.price
```

Depois adiciona um texto de menor preço no botão.

### O que isso ensina

O módulo não só redireciona para busca visual. Ele também faz uma pré-consulta para exibir:

```text
menor preço encontrado
lista de candidatos similares
botão “mais”
botão refresh
cards de ofertas no popover
```

Para ApexSeller, isso vira:

```text
Supplier Candidate Preview
  ↓
menor preço fornecedor
  ↓
similaridade visual
  ↓
margem estimada
  ↓
ação: abrir / salvar / comparar
```

---

## 7. Módulo global de imagem em qualquer site

Arquivo analisado: `allWebsite.e084e880.js`.

Esse script roda em `<all_urls>`, exceto domínios internos Alibaba/DingTalk. Ele implementa um botão flutuante de busca por imagem quando o mouse passa sobre imagens.

Fluxo principal:

```text
init()
  ↓
lê opções do usuário
  ↓
verifica IMAGE_SEARCH_VISIBLE
  ↓
verifica permissão de AI
  ↓
cria botão flutuante
  ↓
escuta mousemove
  ↓
identifica imagem sob cursor
  ↓
posiciona botão sobre a imagem
  ↓
usuário clica
  ↓
abre busca por imagem / painel / AI tools
```

O script usa throttling para não processar todos os movimentos do mouse:

```text
throttleMouseMoveDuration = 50ms
throttleCheckPositionDuration = 1000ms
```

Também verifica se há outros modais/painéis visíveis antes de mostrar o botão.

---

## 8. AI para imagens

O mesmo módulo global inclui menu de AI para imagem:

```text
AI White Background
AI Remove Watermark
AI Change Background
AI Resize
```

O menu é renderizado quando o usuário expande o botão. As ações chamam algo equivalente a:

```text
openAiIframe("WHITE_BACKGROUND")
openAiIframe("REMOVE_WATERMARK")
openAiIframe("CHANGE_BACKGROUND")
openAiIframe("RESIZE")
```

O código cria elementos visuais para essas opções e registra log de visualização `ai-image-enhancer`.

### Interpretação

A extensão não é apenas “buscar similar”. Ela adiciona uma camada de **operação criativa**:

```text
imagem encontrada
  ↓
buscar similar
ou
melhorar imagem com AI
  ↓
usar em anúncio / sourcing / comparação
```

Para ApexSeller, isso sugere um módulo futuro:

```text
Product Image Intelligence
  - buscar fornecedor por imagem
  - remover fundo
  - detectar watermark
  - gerar imagem limpa
  - padronizar thumbnail
```

---

## 9. Comunicação content script → background

O bundle expõe uma função `sendMessageToBackground()` que encapsula:

```text
chrome.runtime.sendMessage()
timeout de 30s
retry até 3 vezes
tratamento de contexto inválido
toast de erro opcional
```

Ela é usada para eventos como:

```text
search-image-fetch-data
search-image-process-ui
fetch-image
send-log
query-order-logistics-info
check-user-permission
open-bulk-inquiry-modal
enqueue-sidepanel-message
```

A função também detecta erro de extensão inválida e orienta refresh da página.

### Ponto de engenharia

O padrão é correto:

```text
content script não faz tudo sozinho
content script coleta contexto e aciona background
background resolve APIs, permissões, cookies e chamadas sensíveis
```

Para ApexSeller:

```text
content.ts
  ↓
chrome.runtime.sendMessage()
  ↓
background.ts
  ↓
API ApexSeller
  ↓
raw events + normalized data
```

---

## 10. Storage e feature flags

A extensão usa muitos `chrome.storage.local` keys, incluindo:

```text
_1688_EXTENSION_OPTIONS
_1688_EXTENSION_UUID
_1688_EXTENSION_USER_ID
_1688_EXTENSION_IS_LOGIN
_1688_EXTENSION_CONFIGURATION
_1688_EXTENSION_ORDER_LOGISTICS_SWITCH
_1688_EXTENSION_DRAWER_FIND_GOODS_SETTINGS
_1688_EXTENSION_AI_CHATBOT_CONFIG
_1688_EXTENSION_REMOTE_SETTINGS
findSameGoodsBtn
```

As opções padrão incluem:

```text
INSERT_DOM_VISIBLE
IMAGE_SEARCH_VISIBLE
SHOW_DRAWER_FIND_GOODS
SHORTCUT_SCREENSHOT
SHOW_POPOVER_FIND_GOODS
LIST_SHOW_POPOVER_FIND_GOODS
SHOW_GLOBAL_ENTRY
SHOW_PIC_PREVIEW
GOODS_OPERATION_AREA
TRANSLATION_BUBBLE
IMAGE_SEARCH_DEFAULT_CHANNEL
SHOW_SEARCH_MEMORY_GLOBAL_ENTRY
```

Essas chaves aparecem no bundle de constantes.

### Interpretação

A extensão é fortemente controlada por:

```text
configuração remota
storage local
permissão do usuário
feature flags
AB tests
estado de login
```

Isso é bom para produto maduro, porque permite ativar/desativar funcionalidades sem alterar o core.

---

## 11. Módulo de logística de pedidos

Arquivo analisado: `orderLogistics.f491b9f7.js`.

Esse script roda em páginas de pedidos:

```text
work.1688.com/home/buyer.htm
trade.1688.com/order/*
*.1688.com/app/ctf-page/trade-order-list/buyer-order-list.html
```

Ele suporta páginas antigas e novas. Se encontra `#mod-batch-bar` e `#listBox`, usa `OrderLogisticsInformation`; senão usa `NewOrderLogisticsInformation`.

### Fluxo da página antiga

```text
init()
  ↓
matchNode(batchBar, listBox)
  ↓
lê switch _1688_EXTENSION_ORDER_LOGISTICS_SWITCH
  ↓
coleta .order-item
  ↓
cria switch "mostrar logística"
  ↓
extrai orderIds de .order-id
  ↓
sendMessageToBackground("query-order-logistics-info")
  ↓
recebe dados logísticos
  ↓
injeta bloco de logística dentro de cada pedido
```

O script extrai IDs com regex numérica, consulta o background com `query-order-logistics-info` e depois renderiza rastreios por pedido.

### Lógica de agrupamento logístico

A função `handleLogisticsList()` ignora eventos de status:

```text
CREATE
CONSIGN
```

E agrupa eventos por data:

```text
actionTime → separa data e hora
data igual → adiciona filho
data nova → cria grupo
```

Renderização:

```text
transportadora + tracking number
  ↓
timeline agrupada por dia
  ↓
eventos filhos com hora, área e observação
  ↓
ícone para expandir/recolher
```

### Batch inquiry

O módulo também cria botão de **consulta em lote** quando:

```text
trade_status em ["waitbuyerpay", "waitsellersend"]
usuário tem permissão "BulkInquiry"
```

Regras:

```text
precisa selecionar pedidos
máximo 10 pedidos por lote
se válido: open-bulk-inquiry-modal
```

Isso é um padrão interessante para ApexSeller: operação em lote com validação local + permissão no background.

---

# Principais pontos da lógica

## 12. A extensão é DOM-first + backend-assisted

Diferente da engenharia reversa anterior da Shopee/Avantpro, aqui o foco não parece ser interceptar `fetch/XHR` da página. O padrão dominante é:

```text
ler DOM
extrair imagem / preço / título / pedido
enviar para background/API
renderizar UI adicional
abrir URL/painel/modal
```

Ou seja:

```text
DOM como fonte de contexto
background como executor
backend/1688 como motor de busca e dados
```

Para o ApexSeller, isso é útil especialmente para **sourcing em 1688 e fornecedores**, mas não substitui uma arquitetura payload-first para marketplaces como Shopee/Mercado Livre.

---

## 13. Padrão de produto: imagem é a chave

A extensão gira em torno de imagem:

```text
imagem do card
imagem sob mouse
imagem do produto
screenshot
upload de imagem
base64 comprimido
busca visual
AI image enhancer
```

Há funções para:

```text
converter imagem em base64
comprimir até ~512KB
buscar via background
usar canvas como fallback
fetch de imagem pelo background
```

Esse desenho mostra uma estratégia clara: **imagem é o identificador universal entre marketplaces**.

Para ApexSeller:

```text
Shopee winner
  ↓
image fingerprint
  ↓
1688 visual search
  ↓
supplier candidates
  ↓
price / MOQ / similarity
  ↓
viability score
```

---

## 14. O que copiar para o ApexSeller

Não copiar código. Copiar os padrões.

### Padrão 1 — Configuração por site

```text
supportedList
regex por site
container.selector
paths de imagem/título/preço/url
mountChecker
styleSheet
```

Isso permite suportar Shopee, Mercado Livre, Amazon, 1688, Pindau, Rakumart etc. sem reescrever a extensão inteira.

### Padrão 2 — MutationObserver

A extensão entende que páginas modernas carregam cards dinamicamente.

```text
varre DOM inicial
observa novos nós
injeta botão em cards novos
evita duplicidade
```

Esse padrão é obrigatório para marketplaces SPA/infinite scroll.

### Padrão 3 — Busca visual com contexto

Não envia só imagem. Envia também:

```text
price
title
searchMode
searchFilterData
```

Para ApexSeller, a busca visual deve ser híbrida:

```text
imagem + título + preço + categoria + marketplace origem
```

### Padrão 4 — Preview antes do clique

A extensão pré-carrega similares e mostra menor preço.

Para ApexSeller, isso pode virar:

```text
menor custo encontrado
margem estimada
candidato mais similar
alerta de risco
botão "salvar oportunidade"
```

### Padrão 5 — Background como camada de integração

O content script fica leve; o background centraliza:

```text
fetch de imagem
busca visual
logs
permissões
modal
sidepanel
APIs
```

---

## 15. O que melhorar no ApexSeller em relação a essa extensão

A extensão analisada é operacionalmente forte, mas não parece ser orientada a dados históricos estruturados.

Para o ApexSeller, eu faria diferente:

```text
Extensão 1688/Sourcing
  ↓
captura contexto visual
  ↓
envia evento bruto
  ↓
backend salva raw_sourcing_events
  ↓
normaliza supplier_candidates
  ↓
calcula similarity_score
  ↓
calcula landed_cost
  ↓
calcula opportunity_score / viability_score
```

Entidades recomendadas:

```text
raw_extension_events
visual_search_jobs
visual_search_candidates
supplier_product_snapshots
supplier_price_snapshots
supplier_match_candidates
sourcing_decision_runs
landed_cost_quotes
```

---

# Resumo final da engenharia reversa

A pasta `1668` contém uma extensão madura de sourcing/assistência para compras no ecossistema 1688.

A lógica principal é:

```text
1. Detectar imagens, cards, produtos ou pedidos no DOM
2. Injetar botões e painéis contextuais
3. Extrair imagem, título, preço, URL ou orderId
4. Consultar background/service worker
5. Buscar similares, logística, permissões ou recursos AI
6. Renderizar resultado como popover, painel, modal ou nova aba
7. Registrar logs de exposição/clique
8. Controlar tudo por storage, opções e configuração remota
```

Para o ApexSeller, o maior aprendizado é:

```text
A extensão deve virar uma camada sensorial de sourcing.
O backend deve transformar eventos visuais em inteligência de produto.
```

A estratégia ideal é combinar dois modelos:

```text
Marketplaces de venda:
  payload-first
  captura search/product/reviews

1688 / fornecedores:
  visual-first + DOM-context
  captura imagem/título/preço/candidato fornecedor
```

Essa combinação cria o pipeline completo:

```text
produto vencedor no marketplace
  ↓
captura de demanda e concorrência
  ↓
busca visual no 1688
  ↓
candidatos fornecedores
  ↓
custo nacionalizado
  ↓
margem
  ↓
risco por reviews
  ↓
Viability Score
```

Esse é o caminho mais forte para transformar o ApexSeller em uma ferramenta de decisão de produto, não apenas uma extensão de coleta.
