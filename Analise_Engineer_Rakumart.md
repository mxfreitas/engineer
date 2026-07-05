# Engenharia reversa — Rakumart

A pasta `rakumart` contém uma extensão Chrome Manifest V3 chamada **“Pesquisa o mesmo produto em Rakumart.br”**, versão `0.1.4`. O objetivo declarado no `manifest.json` é selecionar imagens em outros sites de compras e pesquisá-las no Rakumart.br para comprar diretamente de fabricantes na China.

# Engenharia reversa — Rakumart

## 1. Natureza da extensão

A extensão é bem diferente da `AiPrice` e da `1668`.

Ela é menos “frameworkizada” e mais direta:

```text
jQuery procedural
injeção global em todas as páginas
muitos plugins JS locais
UI flutuante própria
busca por imagem
login Rakumart
carrinho/pedido Rakumart
comparação de produtos
price tracking
gráficos de tendência
tradução
otimização de conteúdo por IA
exportação Excel/TXT
```

O `manifest.json` injeta uma lista grande de scripts diretamente em qualquer página:

```text
jquery-3.5.1.min.js
layui.js
jquery-ui.min.js
hoverintent.min.js
layer.js
lq-score.min.js
public.js
event.js
function.js
message.js
pluginDomLoading.js
globalLoading.js
aiDialogLoading.js
translate.js
xlsx.js
ExportExcelWithPic.js
echarts.min.js
jszip.min.js
FileSaver.js
md5.js
Blob.js
webui-popover.js
```

Essa lista mostra que a extensão não depende de React/Vue. Ela injeta uma aplicação inteira em jQuery + bibliotecas auxiliares diretamente no DOM da página.

---

# 2. Arquitetura geral

## 2.1 Manifest V3 simples

O `manifest.json` define:

```json
"manifest_version": 3
```

com:

```json
"background": {
  "service_worker": "background.js"
}
```

E popup:

```json
"action": {
  "default_popup": "popup.html"
}
```

Mas, na prática, o `background.js` é quase vazio:

```js
console.log('插件JS加载成功');
```

Ou seja, o background só registra que o JS carregou; a lógica real está nos content scripts.

O `popup.html` também está vazio no snapshot analisado.

## Interpretação

A arquitetura real é:

```text
manifest.json
  ↓
injeta muitos scripts em qualquer página
  ↓
public.js cria estado global + UI flutuante
  ↓
event.js registra eventos de clique, filtros e ações
  ↓
function.js executa chamadas Rakumart/API
  ↓
translate.js fornece textos multilíngues
  ↓
bibliotecas auxiliares cuidam de loading, toast, Excel, gráfico, zip, etc.
```

Fluxo macro:

```text
usuário acessa marketplace externo
  ↓
content script Rakumart é injetado
  ↓
extensão carrega componente flutuante
  ↓
verifica login/token no chrome.storage.local
  ↓
detecta contexto da página/produto
  ↓
permite busca por imagem no Rakumart/1688
  ↓
mostra resultados em painel próprio
  ↓
permite comparar, favoritar, rastrear preço, adicionar ao carrinho ou comprar
```

---

# 3. Permissões e escopo

O `manifest.json` declara:

```json
"matches": [ "*://*/*" ]
```

Isso significa que a extensão roda em todas as páginas HTTP/HTTPS.

Mas as permissões declaradas são mínimas:

```json
"permissions": [ "storage" ]
```

E host permissions só para Rakumart:

```json
"host_permissions": [
  "https://www.rakumart.com/",
  "http://www.rakumart.com/"
]
```

## Leitura técnica

Apesar de rodar em qualquer site, a extensão evita um background complexo e faz quase tudo diretamente no content script.

Ela usa `chrome.storage.local` para persistir:

```text
user_token
userInfo
commercialMatchList
aiToken
```

Isso aparece no início de `event.js`, onde a extensão lê `user_token`, depois `userInfo`, valida login, atualiza UI e carrega dados auxiliares.

---

# 4. Estado global da extensão

O arquivo `public.js` define praticamente todo o estado operacional em variáveis globais.

Principais endpoints:

```js
let axiosUrl = 'https://api.rakumart.com.br/index.php';
let axiosLavelUrl = 'https://lavel.rakumart.com.br/api/';
let axiosAiUrl = 'https://aiapibr.rakumart.cn/api/';
```

Principais variáveis:

```text
userlogininfo
aiToken
aiUserInfo
exchangeRate
userInfo
order_by
goodsArr
regionOpp
goodsInfo
goodsListCount
screenShotWidthAndHeightIsLegal
typeValue
isNewVersion
region
imgUrlList
imageId
searchData
commercialMatchList
iid
echartsShow
priceTrackingStatus
priceTrackingList
goodsTrackingStatus
notificationStatus
detailImageList
jobDetails
job_id
aiJobInfo
aiBillInfo
aiJobDetail
```

## Interpretação

O design é **stateful e procedural**:

```text
variáveis globais
  ↓
eventos jQuery alteram estado
  ↓
funções fazem AJAX
  ↓
DOM é atualizado manualmente
```

Não há separação clara entre:

```text
estado
UI
serviço HTTP
regra de negócio
renderização
```

Para uma extensão simples isso funciona; para ApexSeller, esse padrão deveria ser evitado.

---

# 5. Login e sessão Rakumart

O `event.js` inicia verificando se a página atual não é chat Rakumart/Chatwork:

```js
if (
  location.host != 'rakuchat1.rakumart.com' &&
  location.host != 'rakuchat.rakumart.com' &&
  location.host != 'www.chatwork.com' &&
  location.host != 'chatwork.com' &&
  location.host != 'www.appdata.chatwork.com'
) { ... }
```

Depois lê o token:

```js
chrome.storage.local.get(["user_token"], ...)
```

Se existir token, salva em `userlogininfo` e tenta ler `userInfo`. Se não houver `userInfo`, faz AJAX para:

```text
api.rakumart.com.br/index.php?mod=inc&act=ordersysPc&str=getUserInfo&token=...
```

Se a API retornar erro, remove o token:

```js
chrome.storage.local.remove('user_token')
```

Se estiver logado, atualiza:

```text
foto do usuário
nome
botão de logout
container de usuário
```

## Fluxo

```text
content script inicia
  ↓
lê user_token no chrome.storage.local
  ↓
se existe token:
      tenta usar userInfo salvo
      senão chama getUserInfo na API
  ↓
se token inválido:
      limpa storage
      muda UI para login
  ↓
se token válido:
      mostra usuário
      habilita funções protegidas
```

---

# 6. Detecção de página de produto

O `event.js` trata páginas de produto específicas:

```text
detail.1688.com
detail.tmall.com
chaoshi.detail.tmall.com
detail.tmall.hk
item.taobao.com
```

Quando está logado ou não logado, ele chama:

```js
getGoodsId(true)
```

ou:

```js
getGoodsId(false)
```

Também detecta Alibaba:

```js
if (window.location.href.indexOf('alibaba.com/product-detail') != -1) {
  const pathname = new URL(window.location.href).pathname;
  const fileName = pathname.split('/').pop();
  const idSegment = fileName.match(/_(\d+)\.html/);
  let newIdSegment = fileName.match(/-(\d+)\.html/);
  idSegment == null ? iid = newIdSegment[1] : iid = idSegment[1]
}
```

## Interpretação

A extensão reconhece marketplaces/fontes chinesas:

```text
1688
Tmall
Taobao
Alibaba
```

E extrai `iid`, o ID do item/produto.

Fluxo:

```text
usuário abre página de produto
  ↓
extensão detecta host conhecido
  ↓
extrai ID do produto
  ↓
usa esse ID para buscar dados, adicionar carrinho ou iniciar sourcing
```

---

# 7. Componente flutuante

O `public.js` define `loadFloatingComponent()`.

Esse método injeta CSS e cria um componente fixo no canto da página:

```css
#jp-rakumart-plugin-dom {
  position: fixed;
  top: 50%;
  display: none;
  left: 0;
  width: 64px;
  height: 50px;
  background: #1A1A1A;
  z-index: 999999999;
}
```

Também define elementos como:

```text
miniGoodsImage
imgSearchContainer
logoSearchIconContainer
webText
loginAlertContainer
commercialMatchAlertContainer
searchRightContainer
closeSearchContainer
pluginShareContainer
```

## Interpretação

A extensão injeta um painel lateral/flutuante próprio:

```text
botão lateral
  ↓
imagem miniatura
  ↓
ação de busca visual
  ↓
painel de resultados
  ↓
login
  ↓
comparação
  ↓
price tracking
  ↓
AI tools
```

É uma UI pesada dentro de qualquer site, construída diretamente via string HTML/CSS.

---

# 8. Busca por imagem

O núcleo da extensão está em `function.js`, na função:

```js
function figureSearch()
```

Comentário original:

```js
// 插件图搜
```

ou seja, “busca por imagem do plugin”.

## 8.1 Entrada da busca

A função começa validando:

```js
if (searchData.picUrl === '') {
    return
}
```

E garante câmbio:

```js
if (exchangeRate === '') {
    getExchangeRate();
}
```

O objeto global `searchData` nasce assim:

```js
let searchData = {
  source_type: '1688',
  picUrl: '',
  page: 1,
  priceMin: '',
  priceMax: '',
};
```

## 8.2 Plataformas/fonte

A busca muda conforme `source_type`.

Se não for `1688`, envia:

```js
datas = {
  picUrl: searchData.picUrl,
  imageId: imageId,
  page: searchData.page,
}
```

Se for `1688`, monta filtros mais ricos:

```text
keyword
priceMin
priceMax
order_by
filter
regionOpp
region
imageId
```

## 8.3 Filtros da busca

Para 1688, a extensão coleta filtros da UI:

```text
shipInToday
jxhy
certifiedFactory
storeRating
shipln24Hours
shipln48Hours
noReason7DReturn
isOnePsale
```

Também usa filtros regionais:

```text
jpOpp
krOpp
```

O `event.js` mostra que ao selecionar Japão ou Coreia, ele seta `regionOpp` e chama nova busca.

## 8.4 Chamada à API

A busca chama:

```js
$.ajax({
  url: axiosLavelUrl + "plugin/pluginSearch",
  type: 'post',
  data: datas,
  dataType: 'json'
})
```

Endpoint real:

```text
https://lavel.rakumart.com.br/api/plugin/pluginSearch
```

## Fluxo

```text
imagem selecionada/capturada
  ↓
searchData.picUrl preenchido
  ↓
usuário aplica filtros
  ↓
figureSearch()
  ↓
POST plugin/pluginSearch
  ↓
API Rakumart retorna candidatos
  ↓
extensão renderiza lista
```

---

# 9. Renderização dos resultados

Depois de receber `pluginSearch`, a função trata erros:

```text
login inválido
erro interno
res.code != 0
```

Se houver resultado, ela:

```text
atualiza searchData.picUrl com link retornado
pede recortes/regiões da imagem com getImageSliceList(res.data.region)
normaliza tradeScore
extrai shopName de shopInfo
acumula goodsId
acumula goodsArr
```

Depois chama:

```js
plugin/isCollect
```

para saber quais produtos já estão favoritados pelo usuário:

```js
url: axiosLavelUrl + "plugin/isCollect",
data: {
  user_id: userInfo.id,
  goods_id: goods_id_arr.toString()
}
```

A UI renderiza cada item com:

```text
goodsId
mi_id
websiteUrl
imgUrl
titleT
goodsPrice
monthSold
sellerIdentities
shopName
tradeScore
```

O trecho mostra preço em duas moedas:

```js
'$' + EURNumSegmentation(ceil(arr[index].goodsPrice * exchangeRate)) + '&nbsp;¥' + arr[index].goodsPrice
```

## Interpretação

A extensão transforma resultado bruto de busca visual em uma lista operacional:

```text
imagem
título traduzido
preço em BRL/real aproximado
preço em yuan
vendas dos últimos 30 dias
identidades do vendedor
loja
score de negociação
favorito/coletado
```

Esse é um ponto muito forte para o ApexSeller.

---

# 10. Adicionar ao carrinho / pedido Rakumart

A função `addCartWithCookie(info, status, type)` mostra que a extensão consegue criar pedido/carrinho no Rakumart.

Primeiro traduz o título:

```js
url: axiosLavelUrl + "plugin/goodsTitleTranslate",
data: {
  goods_title: info.title
}
```

Depois, se `status == true`, chama:

```js
plugin/pluginOrderSave
```

com:

```text
iid
mi_id
company
title traduzido
pic
trace
type
goods
user_id
```

Se salvar com sucesso, abre a página de detalhes do pedido:

```js
window.open(`https://rakumart.com.br/orderDetails?orderSn=${res.data}&isPlugin=true`)
```

Se `status != true`, chama:

```text
/client/newAddCart?token=...
```

## Fluxo

```text
usuário escolhe fornecedor/produto
  ↓
extensão traduz título
  ↓
envia item para Rakumart
  ↓
cria carrinho ou pedido
  ↓
abre página Rakumart
```

## Interpretação

A extensão não é só “search by image”. Ela fecha o ciclo operacional:

```text
descobrir fornecedor
  ↓
avaliar produto
  ↓
adicionar ao carrinho
  ↓
comprar via Rakumart
```

Para o ApexSeller, isso é equivalente a:

```text
Supplier Candidate
  ↓
Cost Quote
  ↓
Decision
  ↓
Purchase Workflow
```

---

# 11. Comparação de produtos

O estado global tem:

```js
let commercialMatchList = [];
```

Na inicialização, o `event.js` carrega `commercialMatchList` do storage:

```js
chrome.storage.local.get(["commercialMatchList"], ...)
```

E normaliza campos:

```text
repurchaseRate
shopName
monthSold
```

A UI possui modal de comparação:

```text
commercialMatchAlertContainer
goodsCommercialMatchListContainer
commercialMatchTableContainer
commercialMatchTableLabelListContainer
commercialMatchTableContentListContainer
```

Campos comparados:

```text
preço
nome do produto
vendas mensais
taxa de recompra
link do produto
URL da imagem
nome da loja
```

Isso aparece nas classes da tabela:

```text
commercialMatchPriceLabelContainer
commercialMatchGoodsNameLabelContainer
commercialMatchRepurchaseRateLabelContainer
commercialMatchMonthSoldLabelContainer
commercialMatchGoodsLinkLabelContainer
commercialMatchGoodsImageLinkLabelContainer
commercialMatchShopNameLabelContainer
```

## 11.1 Ocultar igualdades

A função de comparação consegue esconder campos iguais entre produtos. O trecho mostra que, quando todos os valores de um campo são iguais, a respectiva linha/label é escondida:

```text
se todos os preços são iguais → esconde campo de preço
se todos os nomes são iguais → esconde campo de nome
se todas as vendas são iguais → esconde campo de vendas
...
```

## 11.2 Destacar diferenças

A função `setHighlightDifferenceFun()` destaca campos divergentes com background `#FAF2F2`.

Ela compara arrays de:

```text
price
title
monthSold
repurchaseRate
link
imgUrl
shopName
```

E se houver mais de um valor distinto, pinta o campo.

## Interpretação

Essa é uma função muito importante para produto:

```text
o usuário compara vários fornecedores similares
  ↓
extensão mostra lado a lado
  ↓
oculta o que é igual
  ↓
destaca diferenças
  ↓
permite decidir fornecedor melhor
```

Para ApexSeller, isso deve virar um módulo formal:

```text
Supplier Comparison Matrix
  - preço
  - MOQ
  - vendas 30 dias
  - recompra
  - rating
  - loja
  - atributos
  - imagem
  - custo nacionalizado
  - margem estimada
```

---

# 12. Price tracking e tendência de preço

O estado global contém:

```text
priceTrackingStatus
priceTrackingList
goodsTrackingStatus
notificationStatus
echartsShow
```

O `event.js` tem eventos para:

```text
priceTrackingContentContainer
goodsPriceTrendContentContainer
```

No clique de price tracking, exige login e chama:

```js
checkPluginVersion(handlePriceTrackingDisplay())
```

No clique de tendência de preço:

```js
getPriceTrackingList();
getPriceTrackingCount();
```

O manifest injeta `echarts.min.js`, indicando gráficos de tendência.

## Interpretação

O módulo de price tracking provavelmente faz:

```text
usuário seleciona produto
  ↓
ativa monitoramento
  ↓
extensão/API salva produto monitorado
  ↓
API retorna histórico
  ↓
echarts renderiza tendência
  ↓
usuário vê alta/queda
```

Para ApexSeller, isso se conecta diretamente com:

```text
supplier_price_snapshots
supplier_price_history
price_alerts
margin_recalculation
```

---

# 13. Exportação

O manifest injeta:

```text
xlsx.js
ExportExcelWithPic.js
jszip.min.js
FileSaver.js
Blob.js
```

A UI de comparação tem botões:

```text
exportAsTxt
exportAsExcel
downloadResults
```

Nos textos de tradução aparecem:

```text
txt导出
excel导出
下载结果
```

E em português:

```text
exportar como TXT
exportar como Excel
baixar resultados
```

## Interpretação

A extensão não apenas mostra dados; ela permite exportar:

```text
comparação de fornecedores
lista de produtos similares
imagens
dados tabulares
```

Para ApexSeller, isso deve virar:

```text
export CSV/XLSX
relatório de oportunidade
dossiê de fornecedor
comparativo de custo
```

---

# 14. Tradução e internacionalização

O arquivo `translate.js` define `window.global_lan = 'es'`, mas o conteúdo inclui traduções em chinês e português.

A tabela de tradução cobre:

```text
login
buscar
produto
carrinho
pedido
armazém
price tracking
comparação
AI optimization
wallet
pagamento
saldo
CPF/CNPJ
descrição
keywords
download
edição de imagem
```

## Interpretação

A extensão foi feita para operação cross-border:

```text
origem chinesa
usuário brasileiro/japonês/espanhol
Rakumart como intermediador
tradução de produto
tradução de imagem
geração de conteúdo de anúncio
```

Para ApexSeller:

```text
tradução não é só UI
é parte do pipeline de produto:
  título
  SKU
  atributos
  descrição
  texto em imagem
  keywords
```

---

# 15. IA e otimização de material

O estado `jobDetails` mostra uma estrutura rica para otimização por IA:

```js
let jobDetails = {
  target_platform: 'Amazon',
  target_lang: 'pt',
  title_from: {
    replace: true,
    translate: true,
  },
  image_from_checked: true,
  image_from: [],
  image_from_switch: {
    remove: false,
    cut_out: false,
    translate: true,
  },
  sku_from: {
    translate: true
  },
  prop_from: {
    translate: true,
    five_desc: true,
    desc: true,
    keywords: true,
  },
  desc_image_from_checked: true,
  desc_image_from: [],
  desc_image_from_switch: {
    remove: false,
    cut_out: false,
    translate: true,
  },
};
```

Também há:

```text
aiToken
axiosAiUrl
aiJobInfo
aiBillInfo
aiJobDetail
aiEditImageInfo
rakuAiAutoLoginToken
```

Os textos de tradução indicam funções:

```text
AI素材优化
título tradução
título rewrite
imagem principal
remoção inteligente
recorte inteligente
tradução de texto na imagem
tradução de especificação
tradução de atributos
gerar keywords
gerar descrição de produto
gerar five points
imagem de detalhe
antes/depois
download
editar
```

## Interpretação

A extensão inclui um módulo de **AI Listing Optimization**.

Fluxo provável:

```text
produto capturado
  ↓
extrai título, imagens, SKU, atributos, descrição
  ↓
usuário escolhe plataforma alvo
  ↓
usuário escolhe idioma alvo
  ↓
IA traduz/recria título
  ↓
IA traduz atributos/SKU
  ↓
IA gera keywords
  ↓
IA gera descrição e bullets
  ↓
IA edita imagens
  ↓
usuário baixa ou usa resultado
```

Isso é muito forte para ApexSeller porque conecta sourcing com listing.

---

# 16. Loading, toast e UX operacional

A extensão tem três módulos de loading:

```text
pluginDomLoading.js
globalLoading.js
aiDialogLoading.js
```

Eles criam overlays com GIF base64 e bloqueiam a tela durante processamento.

O `message.js` implementa `$.message()` com tipos:

```text
success
warning
info
error
```

E injeta CSS para toast.

## Interpretação

Como a extensão executa ações pesadas:

```text
busca visual
consulta API
adicionar carrinho
gerar IA
exportar arquivo
baixar imagens
```

ela precisa de feedback visual forte:

```text
loading
toast de sucesso
toast de erro
alertas de login
modais
```

---

# 17. Ajustes específicos para Mercado Livre

O `event.js` tem regras específicas para Mercado Livre:

```js
if (location.host == 'www.mercadolivre.com.br') {
    $('.poly-component__title').addClass('no-before');
}
if (location.host == 'lista.mercadolivre.com.br') {
    $('.ui-search-link').addClass('no-before');
}
```

## Interpretação

Mesmo sendo uma extensão Rakumart, ela já tem ajustes para o Mercado Livre Brasil.

Isso é relevante para ApexSeller porque confirma que Rakumart enxerga o fluxo:

```text
produto visto no Mercado Livre
  ↓
imagem do produto
  ↓
buscar equivalente na China/Rakumart
```

---

# 18. Principais pontos da lógica

## 18.1 Extensão global, mas produto Rakumart-first

A extensão roda em qualquer site:

```text
matches: *://*/*
```

mas o backend e as ações são centrados em Rakumart:

```text
api.rakumart.com.br
lavel.rakumart.com.br/api
aiapibr.rakumart.cn/api
rakumart.com.br/orderDetails
rakumart.com/pluginSettings
```

## 18.2 Busca visual é o motor principal

A função `figureSearch()` é o coração:

```text
picUrl
imageId
page
keyword
priceMin
priceMax
order_by
filter
regionOpp
region
```

## 18.3 Resultado vira operação

Após encontrar produtos, o usuário pode:

```text
favoritar/coletar
comparar fornecedores
ver preço em BRL/Yuan
ver vendas 30 dias
ver score
adicionar carrinho
criar pedido
monitorar preço
exportar resultado
otimizar listing com IA
```

## 18.4 Login é obrigatório para funções avançadas

Eventos como price tracking e configurações exigem `userlogininfo`. Se não houver login, chama `showLoginAlert()`.

## 18.5 A extensão tem lógica de comparação superior às anteriores

O módulo de comparação com:

```text
ocultar iguais
destacar diferenças
fixar item à esquerda
exportar
```

é um diferencial importante.

---

# 19. Comparação com AiPrice e 1668

```text
AiPrice:
  busca visual universal
  popup/options mais estruturados
  tradução e privacidade
  forte integração com AiPrice/AliPrice

1668:
  DOM operacional em cards
  botão find same goods
  popover de similares
  logística de pedidos
  melhor padrão de injeção contextual

Rakumart:
  fluxo comercial mais completo
  busca visual + filtros 1688
  carrinho/pedido
  comparação de fornecedores
  price tracking
  exportação
  AI listing optimization
```

## Leitura estratégica

A `Rakumart` é a mais próxima de um **workflow comercial completo**:

```text
descobrir produto
  ↓
buscar fornecedor
  ↓
comparar opções
  ↓
monitorar preço
  ↓
otimizar material do anúncio
  ↓
comprar/importar
```

---

# 20. O que copiar para o ApexSeller

## Padrão 1 — Busca visual com filtros comerciais

A Rakumart não busca apenas por imagem. Ela combina:

```text
imagem
keyword
preço mínimo
preço máximo
ordenação
região
filtros de fornecedor
filtros de entrega
filtros de devolução
MOQ/compra unitária
```

Para ApexSeller:

```text
visual_search_jobs
  image_url
  keyword
  price_min
  price_max
  supplier_filters
  region_filters
  sort
```

---

## Padrão 2 — Resultado com dados de decisão

Cada candidato deve trazer:

```text
imagem
título
preço CNY
preço BRL estimado
vendas 30 dias
score
identidade do vendedor
loja
link
favorito
```

A Rakumart já faz parte disso ao renderizar preço, vendas mensais, seller identities e score.

---

## Padrão 3 — Matriz de comparação

ApexSeller deve copiar o conceito, não o código:

```text
Supplier Comparison Matrix
  - ocultar campos iguais
  - destacar diferenças
  - fixar candidato principal
  - exportar
  - comparar custo nacionalizado
  - comparar risco
  - comparar margem
```

---

## Padrão 4 — Price tracking de fornecedor

Rakumart tem price tracking e price trend. Para ApexSeller:

```text
supplier_price_snapshots
supplier_price_alerts
supplier_margin_recalculation
supplier_trend_chart
```

---

## Padrão 5 — AI Listing Optimization

A estrutura `jobDetails` é extremamente útil.

ApexSeller poderia ter:

```text
AI Listing Job
  target_marketplace: Mercado Livre / Shopee / Amazon
  target_language: pt-BR
  source_title
  source_images
  source_sku
  source_attributes
  source_description
  output_title
  output_bullets
  output_keywords
  output_description
  output_images
```

---

# 21. O que não copiar

## Não copiar o padrão de variáveis globais

A Rakumart usa muitos estados globais em `public.js`. Para ApexSeller, isso vira dívida técnica.

Melhor:

```text
extension state store
services
platform adapters
message bus
typed API client
componentized UI
```

## Não misturar UI, API e regra de negócio

A Rakumart monta HTML em strings dentro das funções. Para ApexSeller:

```text
React/Vue/Svelte ou Web Components
render separado da regra
API client separado
normalização separada
```

## Não depender só de DOM procedural

A extensão é eficiente, mas frágil para manutenção.

ApexSeller deve usar:

```text
payload-first quando possível
DOM-context quando necessário
screenshot fallback
visual search como ponte
```

---

# 22. Entidades recomendadas para ApexSeller

```text
visual_search_jobs
visual_search_candidates
supplier_product_snapshots
supplier_comparison_sessions
supplier_comparison_items
supplier_price_tracking
supplier_price_snapshots
supplier_favorites
supplier_purchase_intents
listing_optimization_jobs
listing_optimization_outputs
extension_user_sessions
extension_error_events
```

Modelo lógico:

```text
visual_search_jobs
  id
  user_id
  source_marketplace
  source_url
  image_url
  image_hash
  keyword
  price_min
  price_max
  filters
  status
  created_at

visual_search_candidates
  id
  job_id
  supplier_platform
  supplier_url
  goods_id
  mi_id
  title_original
  title_translated
  image_url
  price_cny
  price_brl_estimated
  month_sold
  repurchase_rate
  shop_name
  trade_score
  seller_identities
  is_favorited
  raw_payload
  captured_at

supplier_comparison_sessions
  id
  user_id
  name
  source_job_id
  created_at

supplier_comparison_items
  id
  comparison_id
  candidate_id
  fixed_left
  notes
  selected

supplier_price_tracking
  id
  user_id
  candidate_id
  status
  notification_enabled
  created_at

listing_optimization_jobs
  id
  user_id
  candidate_id
  target_platform
  target_language
  options
  status
  estimated_cost
  created_at
```

---

# 23. Pipeline recomendado para ApexSeller

```text
Produto observado em marketplace brasileiro
  ↓
Extensão captura imagem/card
  ↓
Cria visual_search_job
  ↓
Busca fornecedores em 1688/Rakumart/AliPrice
  ↓
Normaliza candidatos
  ↓
Mostra lista com preço, vendas, score e loja
  ↓
Usuário adiciona candidatos à comparação
  ↓
ApexSeller destaca diferenças e calcula custo nacionalizado
  ↓
Usuário ativa monitoramento de preço
  ↓
ApexSeller calcula margem e Viability Score
  ↓
IA gera título, descrição, keywords e imagens otimizadas
  ↓
Usuário decide importar/anunciar
```

---

# 24. Resumo final

A extensão `rakumart` é uma ferramenta operacional de sourcing e compra cross-border.

A lógica principal é:

```text
1. Rodar em qualquer página
2. Carregar UI flutuante Rakumart
3. Verificar login/token no chrome.storage.local
4. Detectar páginas de produto em 1688/Tmall/Taobao/Alibaba
5. Permitir busca por imagem
6. Enviar imagem/filtros para plugin/pluginSearch
7. Renderizar candidatos com preço, vendas, score e loja
8. Verificar favoritos/coletas do usuário
9. Permitir comparação de fornecedores
10. Ocultar semelhanças e destacar diferenças
11. Permitir price tracking e tendência com gráfico
12. Traduzir título e adicionar ao carrinho/pedido Rakumart
13. Exportar resultados
14. Otimizar título, atributos, descrição, keywords e imagens com IA
```

Para ApexSeller, o maior aprendizado é:

```text
Rakumart não para na busca.
Ela transforma busca visual em fluxo comercial.
```

A estratégia correta para o ApexSeller é combinar:

```text
AiPrice:
  busca visual universal
  screenshot
  tradução

1668:
  DOM operacional
  botão em cards
  similares em popover
  logística

Rakumart:
  comparação comercial
  carrinho/pedido
  price tracking
  IA para listing
  exportação
```

O caminho mais forte:

```text
imagem do produto
  ↓
fornecedor provável
  ↓
comparação de fornecedores
  ↓
custo nacionalizado
  ↓
monitoramento de preço
  ↓
IA de anúncio
  ↓
Viability Score
  ↓
decisão de produto/importação
```
