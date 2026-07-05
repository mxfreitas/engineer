# Análise Engineer AiPrice — Engenharia Reversa

A pasta `AiPrice` contém uma extensão Chrome Manifest V3 chamada **AiPrice(AliPrice) Search by Image for China Import**, versão `4.0.5`. O objetivo declarado é permitir busca por imagem para encontrar a fonte/origem de produtos em sites de e-commerce, especialmente no contexto de importação da China.

## 1. Natureza da extensão

O `manifest.json` mostra uma extensão voltada para:

```text
busca por imagem
captura de tela para busca visual
tradução de página
tradução por screenshot
popup operacional
página de opções
content script global
host permissions amplas
integração com aliprice.com
```

O nome em português confirma o posicionamento:

```text
AiPrice(AliPrice) — pesquisa por imagem para importação da China
```

E a descrição diz:

```text
A busca por imagem do AiPrice permite encontrar facilmente fontes de produtos.
```

A proposta é muito próxima do que interessa ao ApexSeller: transformar uma imagem de produto vista em qualquer marketplace em uma busca por fornecedor/origem.

---

# 2. Arquitetura geral

## 2.1 Manifest V3

A extensão usa Manifest V3:

```json
"manifest_version": 3
```

com background service worker:

```json
"background": {
  "service_worker": "assets/js/background.js"
}
```

O ponto importante: o arquivo `assets/js/background.js` existe, mas no snapshot analisado ele veio sem conteúdo útil. O mesmo ocorreu com `assets/js/content-script.js` e alguns chunks comuns. Isso indica uma destas possibilidades:

```text
1. o pacote no repositório está parcialmente incompleto;
2. alguns arquivos foram esvaziados no dump;
3. a lógica real está concentrada nos chunks Webpack/Vue carregados pelo popup/options;
4. a extensão original foi exportada de forma parcial.
```

Então a engenharia reversa precisa separar:

```text
o que o manifest declara que a extensão deveria fazer
versus
o que os bundles disponíveis permitem confirmar diretamente
```

---

## 2.2 Content script global

O manifest injeta content script em praticamente qualquer página:

```json
"matches": [ "http://*/*", "https://*/*" ]
```

com:

```json
"all_frames": true
"match_about_blank": true
```

E CSS/JS:

```text
assets/css/content-script.css
assets/js/chunk-common-5c551db8.js
assets/js/chunk-common-e3b6d224.js
assets/js/chunk-vendors-6185be05.js
assets/js/chunk-vendors-aacc2dbb.js
assets/js/content-script.js
```

Isso mostra que a extensão foi desenhada para atuar como camada universal sobre páginas web, não apenas dentro do 1688 ou Alibaba.

Fluxo arquitetural esperado:

```text
usuário navega em qualquer e-commerce
  ↓
content script é injetado
  ↓
extensão detecta imagem/produto/contexto
  ↓
usuário pode acionar busca por imagem ou captura
  ↓
background/popup/options coordenam ação
  ↓
abre resultado no AiPrice/AliPrice
```

---

## 2.3 Permissões

O manifest pede permissões relevantes:

```text
activeTab
alarms
contextMenus
cookies
declarativeNetRequest
declarativeNetRequestFeedback
notifications
scripting
storage
```

E host permissions:

```text
*://*.aliprice.com/*
<all_urls>
http://*/*
https://*/*
```

Interpretação:

```text
activeTab / scripting
  → atuar na aba atual

contextMenus
  → criar menu de clique direito para busca/tradução

cookies
  → manter sessão/usuário com aliprice.com

storage
  → salvar configurações, idioma, país, consentimento, preferências

declarativeNetRequest
  → possível manipulação/observação de requisições

notifications
  → alertas para usuário

alarms
  → tarefas periódicas, checagens ou manutenção de estado
```

---

# 3. Comandos e atalhos

A extensão define três comandos principais:

```text
screenshotToImageSearch
screenshotToTranslate
translateWebpage
```

com atalhos:

```text
Ctrl+Shift+1 → captura para busca por imagem
Ctrl+Shift+3 → tradução por screenshot
Ctrl+Shift+2 → traduzir/restaurar página
```

No macOS:

```text
Command+Shift+1
Command+Shift+3
Command+Shift+2
```

Os arquivos de idioma confirmam os textos dessas funções:

```text
Capture to search by image
Screenshot translate
Translate webpage/Restore original
```

Em português:

```text
Pesquisa de captura de tela para o mesmo estilo
Traduzir captura
Traduzir página
Pesquisa rápida
```

## Leitura da lógica

A extensão trabalha com dois caminhos de entrada:

```text
1. imagem existente na página
2. screenshot/captura feita pelo usuário
```

Fluxo provável:

```text
usuário vê produto
  ↓
aciona clique direito / atalho / popup
  ↓
captura imagem ou região da tela
  ↓
envia para endpoint de busca visual
  ↓
abre resultado em AiPrice/AliPrice
```

---

# 4. Popup

O `popup.html` carrega:

```text
chunk-vendors-aacc2dbb.js
chunk-vendors-6185be05.js
chunk-common-e3b6d224.js
chunk-common-5c551db8.js
popup.js
popup.css
```

E monta o app em:

```html
<div id="ap-root-1077master4053"></div>
```

O `popup.js` revela uma aplicação Vue/Webpack. O bundle mostra componentes como:

```text
PopupPageWrapper
PopupShortcuts
CountryLanguageQuickSettingModal
AppPopupContainer
```

E usa o identificador de plataforma:

```text
alibaba_search_by_image
```

## Lógica do popup

O popup não parece ser apenas uma tela informativa. Ele funciona como painel operacional para:

```text
selecionar país
selecionar idioma
exibir atalhos
abrir busca
gerar endpoint de busca
abrir homepage da plataforma
```

No código do popup aparece:

```text
platform-name: "alibaba_search_by_image"
getSearchEndpoint()
getSearchUrl()
homePage
popup_search
popup_logo
```

Fluxo inferido:

```text
abrir popup
  ↓
carregar configuração da plataforma alibaba_search_by_image
  ↓
validar país/idioma do usuário
  ↓
mostrar atalhos de busca
  ↓
quando usuário busca, montar URL de busca visual
  ↓
adicionar parâmetros de tracking/origem
  ↓
abrir AiPrice/AliPrice
```

---

# 5. Configuração de país e idioma

O popup contém um modal chamado:

```text
CountryLanguageQuickSettingModal
```

Ele trabalha com:

```text
countryLanguageType
countryLanguageData
country
language
selected.country
selected.language
```

A lógica permite dois modelos:

```text
country,language
country|languages
```

Ou seja:

```text
modelo 1:
  país escolhido → idioma escolhido

modelo 2:
  país escolhido → lista de idiomas relacionados
```

O modal salva as escolhas em configurações da plataforma:

```text
updatePlatformSettingCountry
updatePlatformSettingLanguage
setCountrySettingUpdated
setLanguageSettingUpdated
```

## Importância para ApexSeller

Esse padrão é relevante porque o ApexSeller também terá marketplaces e fornecedores com variação regional:

```text
Shopee Brasil
Shopee China/Seller
Mercado Livre Brasil
1688 China
Alibaba Global
Pindau/Rakumart
Amazon Brasil/EUA
```

Para o ApexSeller, a modelagem correta seria:

```text
platform
country
language
currency
searchEndpoint
supportedFeatures
```

---

# 6. Página de opções

O `options.html` carrega os mesmos chunks base e monta `options.js`:

```text
chunk-vendors-aacc2dbb.js
chunk-vendors-6185be05.js
chunk-common-e3b6d224.js
chunk-common-5c551db8.js
options.js
options.css
```

O `options.js` mostra uma página de configuração com abas:

```text
general
shortcuts
searchByImage
others
statement
```

Também aparecem componentes:

```text
FormGeneral
FormShortcuts
FormSearchByImage
FormOthers
PrivacyConsentModal
OptionsForm
```

## Lógica da tela de opções

A tela de opções administra:

```text
configurações gerais
atalhos
busca por imagem
outras opções
termos/statement
privacidade
login/logout
link para conta AiPrice
```

O bundle mostra ainda:

```text
signIn
signOut
signUp
getAliPriceSettingsUrl
go2AlipricePrivacyPage
```

Isso indica que a extensão tem camada de conta/usuário e provavelmente diferencia usuários logados de não logados.

Fluxo:

```text
usuário abre opções
  ↓
app carrega estado local/global
  ↓
exibe abas de configuração
  ↓
permite ajustar busca por imagem, atalhos, idioma, país, privacidade
  ↓
salva em storage/state
  ↓
content script/background passam a usar essas preferências
```

---

# 7. Privacidade e consentimento

O `options.js` tem um `PrivacyConsentModal`.

Ele controla estados como:

```text
privacyStatus
privacyItemCookiesStatus
privacyItemFunctionalStatus
hasPrivacyPromptShowedOnInstall
privacyConsentRequired
```

O modal permite:

```text
Enable all
Disable all
Required Cookies
Functional and Analytics Cookies
Read more
```

Também emite eventos:

```text
settingsSaved
openPrivacyPromtModal
```

## Interpretação

A extensão possui um modelo de consentimento:

```text
cookies obrigatórios
cookies funcionais/analíticos
status geral de privacidade
prompt no primeiro uso/instalação
```

Para o ApexSeller, isso é um ponto importante porque uma extensão que lê páginas de marketplace precisa de uma política clara:

```text
o que é coletado
quando é coletado
se envia para backend
se salva localmente
se há modo privado/desligado
retenção dos dados
```

---

# 8. Rede, API e fallback

Dentro do bundle aparecem funções e constantes ligadas a HTTP/API:

```text
getCommonHttpParams
DEFAULT_HEADERS
TIMEOUT
apiHost
apiHostCN
checkInterval
timeoutThreshold
checkAPIError
initializeFailoverCheck
captcha
cloudflare
timeout
abort
network
Failed to fetch
```

Também aparecem referências a:

```text
ext-id
uid
aliprice
```

## Lógica inferida

A extensão possui uma camada HTTP com:

```text
parâmetros comuns por request
identificação da extensão
identificação de usuário
host principal
host alternativo CN
tratamento de timeout
detecção de captcha
detecção de Cloudflare
failover de API
logs de erro
```

Fluxo provável:

```text
content/popup/options chama serviço
  ↓
monta parâmetros comuns
  ↓
seleciona apiHost
  ↓
executa request com timeout
  ↓
se erro:
      classifica erro
      captcha / cloudflare / timeout / network
      registra log
      pode acionar failover
```

Esse padrão é mais maduro do que uma extensão simples, porque ela trata instabilidade real de scraping/API.

---

# 9. Busca por imagem

A função central da extensão é busca visual.

Os arquivos de idioma mostram:

```text
Search by image on $storeName$
Capture to $storeName$
Quick search same items
```

O manifest adiciona atalhos para:

```text
Capture to search by image
```

E a homepage aponta para:

```text
aiprice.com
platform=alibaba_search_by_image
version=4.0.5
```

## Fluxo lógico

```text
produto ou imagem em qualquer página
  ↓
usuário aciona busca por imagem
  ↓
extensão captura a imagem ou screenshot
  ↓
monta endpoint de busca
  ↓
envia/abre no AiPrice/AliPrice
  ↓
resultado aponta para produtos similares/origem
```

## Papel no sourcing

A lógica é:

```text
imagem de um produto vendido em marketplace
  ↓
busca visual em base chinesa/fornecedor
  ↓
encontra fonte do produto
  ↓
usuário compara preço/origem
```

Para o ApexSeller, isso é diretamente aplicável ao pipeline:

```text
produto vencedor na Shopee/Mercado Livre/Amazon
  ↓
imagem principal
  ↓
busca visual 1688/AliPrice
  ↓
candidato fornecedor
  ↓
custo estimado
  ↓
margem e viabilidade
```

---

# 10. Tradução

A extensão também possui comandos de tradução:

```text
translateWebpage
screenshotToTranslate
```

Textos:

```text
Translate webpage/Restore original
Screenshot translate
```

## Interpretação

A tradução existe porque o fluxo de importação geralmente exige navegar em páginas chinesas.

A lógica esperada:

```text
usuário acessa página chinesa
  ↓
aciona tradução de página
  ↓
extensão traduz conteúdo ou injeta camada de tradução
```

E para screenshot:

```text
usuário seleciona/captura região
  ↓
extensão envia imagem para OCR/tradução
  ↓
retorna texto traduzido
```

Para ApexSeller, isso pode virar:

```text
Supplier Page Translator
  - traduz título
  - traduz atributos
  - traduz MOQ
  - traduz variações
  - traduz condições de envio
```

---

# 11. Context menu

O manifest pede `contextMenus`, e os arquivos de idioma trazem textos para menus:

```text
Search by image on $storeName$
Capture to $storeName$
Capture to search by image
Screenshot translate
Translate webpage
```

A lógica esperada:

```text
clique direito em imagem
  ↓
menu: Search by image on AiPrice/AliPrice
  ↓
pega src da imagem ou captura região
  ↓
abre busca visual
```

Ou:

```text
clique direito na página
  ↓
menu: Translate webpage
  ↓
injeta tradução/restaura original
```

---

# 12. Modelo de aplicação

Os bundles mostram uma aplicação Vue/Webpack.

Evidências:

```text
componentes Vue
render functions
computed
watch
beforeMount
mounted
methods
Vuex-like helpers
```

Exemplos visíveis:

```text
computed
watch
beforeMount
mounted
methods
components
```

O app global usa:

```text
globalThis.Wext
globalThis.Wext.platforms
globalThis.Wext.config.platformList
globalThis.Wext.router
globalThis.Wext.scriptType
```

## Interpretação

A extensão tem uma camada própria chamada `Wext`, provavelmente um framework interno da AliPrice/AiPrice para múltiplas extensões/plataformas.

Modelo provável:

```text
Wext.config
  ↓
define plataformas, idiomas, países, endpoints

Wext.platforms
  ↓
define sites e funções por plataforma

Wext.router
  ↓
event bus interno

Wext.scriptType
  ↓
popup / options / contentScript

Vue app
  ↓
renderiza popup/options/content UI
```

---

# 13. Diferença em relação à extensão 1688 analisada antes

A extensão `1668` analisada antes era mais operacional e DOM-first:

```text
detectava cards
injetava botões
lia imagem/título/preço
buscava similares
renderizava popover
tratava logística de pedidos
```

A `AiPrice` parece mais focada em:

```text
busca visual universal
atalhos
context menu
popup de busca
configuração de idioma/país
tradução
privacidade
integração com serviço AiPrice/AliPrice
```

## Comparação

```text
1668:
  foco em assistência dentro do ecossistema 1688
  DOM operacional
  pedidos/logística
  botão “find same goods”
  popover de preço/similares

AiPrice:
  foco em search by image global
  qualquer site
  screenshot search
  tradução
  popup/options maduros
  país/idioma/consentimento
  integração forte com aliprice.com
```

Para o ApexSeller:

```text
1668 ensina a lógica operacional no DOM
AiPrice ensina a lógica de produto/plataforma extensível
```

---

# 14. Principais pontos da lógica

## 14.1 Entrada universal

A extensão atua em qualquer URL HTTP/HTTPS:

```text
matches: http://*/*, https://*/*
```

Isso significa que a extensão quer estar disponível em qualquer marketplace.

Para ApexSeller:

```text
não criar uma extensão só para Shopee
criar uma extensão com plataforma plugável:
  Shopee
  Mercado Livre
  Amazon
  1688
  Alibaba
  Pindau
  Rakumart
```

---

## 14.2 Imagem como chave universal

O produto pode mudar de título, idioma, marketplace e moeda, mas a imagem costuma permanecer parecida.

A lógica da extensão é:

```text
imagem → busca visual → fonte provável
```

Para ApexSeller:

```text
imagem → fingerprint visual → candidatos fornecedores → score de similaridade
```

---

## 14.3 Screenshot como fallback

Nem toda imagem está acessível por `src`.

Pode haver:

```text
canvas
lazy loading
background-image
bloqueio CORS
imagem protegida
DOM complexo
```

Por isso a extensão oferece:

```text
Capture to search by image
```

Para ApexSeller:

```text
se não conseguir capturar imagem original:
  usar screenshot de região
  cortar card/produto
  enviar imagem gerada ao backend
```

---

## 14.4 País, idioma e endpoint

A extensão não trata busca como algo fixo. Ela considera:

```text
country
language
homePage
platform settings
```

Para ApexSeller, isso é essencial:

```text
marketplace_country
marketplace_language
supplier_country
currency
locale
```

---

## 14.5 Privacidade como parte da arquitetura

A extensão possui modal de consentimento, cookies e analytics.

Para ApexSeller, isso deve entrar desde o começo:

```text
privacy_mode
collect_images_enabled
collect_product_data_enabled
send_to_backend_enabled
analytics_enabled
retention_days
```

---

## 14.6 API com failover

O bundle indica tratamento para:

```text
timeout
network error
captcha
cloudflare
apiHost
apiHostCN
```

Para ApexSeller:

```text
API principal
API fallback
fila local
retry
status de coleta
erro classificado
```

---

# 15. O que copiar para o ApexSeller

## Padrão 1 — Extensão universal por plataforma

Modelo recomendado:

```text
platform registry
  ↓
cada marketplace declara:
  - nome
  - domínio
  - país
  - idioma
  - seletores
  - recursos disponíveis
  - modo de captura
  - endpoint backend
```

Exemplo:

```ts
type MarketplacePlatform = {
  id: 'shopee' | 'mercadolivre' | 'amazon' | '1688' | 'alibaba';
  country: 'BR' | 'CN' | 'US';
  language: 'pt-BR' | 'zh-CN' | 'en-US';
  features: {
    imageSearch: boolean;
    productCapture: boolean;
    reviewCapture: boolean;
    priceHistory: boolean;
    translation: boolean;
  };
};
```

---

## Padrão 2 — Busca por imagem em qualquer site

Fluxo ApexSeller:

```text
imagem detectada
  ↓
usuário clica em “Buscar fornecedor”
  ↓
extensão captura src/base64/screenshot
  ↓
backend cria visual_search_job
  ↓
consulta motores:
    1688
    Alibaba
    AliPrice
    Pindau/Rakumart, se aplicável
  ↓
normaliza candidatos
  ↓
retorna Supplier Candidate Preview
```

---

## Padrão 3 — Atalhos e context menu

Copiar a ideia de atalhos:

```text
Ctrl+Shift+1 → buscar fornecedor por screenshot
Ctrl+Shift+2 → traduzir página
Ctrl+Shift+3 → traduzir captura
```

No ApexSeller:

```text
Ctrl+Shift+1 → enviar produto para análise
Ctrl+Shift+2 → buscar fornecedor visual
Ctrl+Shift+3 → capturar reviews/demanda
```

---

## Padrão 4 — Configurações maduras

A página de opções da AiPrice mostra que a extensão não deve depender de hardcode.

ApexSeller deveria ter:

```text
Geral
  - país padrão
  - idioma
  - moeda
  - marketplace preferido

Busca por imagem
  - ativar/desativar botão flutuante
  - provedor padrão
  - abrir em nova aba ou painel
  - salvar automaticamente candidatos

Atalhos
  - capturar produto
  - buscar fornecedor
  - traduzir página

Privacidade
  - coleta local/backend
  - logs
  - cookies/analytics
```

---

## Padrão 5 — Tratamento de erro

Usar classificação de erro:

```text
timeout
network
captcha
cloudflare
unauthorized
rate_limited
unsupported_site
image_not_found
```

Isso vira diagnóstico de coleta no dashboard.

---

# 16. O que não copiar

## Não copiar uma extensão só de redirecionamento

A AiPrice parece fortemente orientada a abrir/consultar serviço externo.

Para ApexSeller, o objetivo deve ser maior:

```text
não apenas abrir busca visual
mas salvar resultado
normalizar fornecedor
comparar custo
calcular margem
gerar oportunidade
```

## Não depender apenas de popup

O popup é útil, mas o ApexSeller precisa de captura passiva/assistida:

```text
content script coleta contexto
background coordena
backend persiste
dashboard analisa
```

## Não deixar dados sem histórico

A AiPrice resolve a ação imediata. O ApexSeller precisa histórico:

```text
buscas realizadas
candidatos encontrados
preços do fornecedor
variação cambial
custo nacionalizado
decisões do usuário
score recalculado
```

---

# 17. Entidades recomendadas para ApexSeller

Com base na engenharia reversa, eu adicionaria:

```text
extension_platform_settings
visual_search_jobs
visual_search_assets
visual_search_candidates
supplier_product_snapshots
supplier_image_matches
translation_jobs
extension_user_preferences
extension_privacy_settings
extension_command_events
extension_error_events
```

Modelo lógico:

```text
visual_search_jobs
  id
  user_id
  marketplace_origin
  source_url
  image_url
  image_hash
  screenshot_asset_id
  search_provider
  status
  created_at

visual_search_candidates
  id
  job_id
  provider
  supplier_url
  title_original
  title_translated
  image_url
  price
  currency
  moq
  similarity_score
  supplier_name
  captured_at

supplier_product_snapshots
  id
  candidate_id
  price
  moq
  variations
  shipping_info
  translated_payload
  raw_payload
  captured_at
```

---

# 18. Pipeline recomendado para ApexSeller

```text
Produto observado em marketplace
  ↓
Extensão detecta imagem/card
  ↓
Usuário aciona busca visual
  ↓
Extensão captura imagem ou screenshot
  ↓
Background envia ao backend
  ↓
Backend cria visual_search_job
  ↓
Busca fornecedores em 1688/AliPrice/Alibaba
  ↓
Normaliza candidatos
  ↓
Calcula similaridade
  ↓
Busca custo estimado
  ↓
Aplica câmbio/impostos/frete
  ↓
Calcula margem
  ↓
Gera Viability Score
  ↓
Mostra oportunidade no dashboard
```

---

# 19. Resumo da engenharia reversa

A pasta `AiPrice` representa uma extensão de **busca por imagem para importação da China**, usando Manifest V3, popup/options Vue/Webpack, permissões amplas, content script global, atalhos de captura, context menus, tradução, país/idioma, privacidade e integração com `aliprice.com`.

A lógica principal é:

```text
1. Rodar em qualquer site HTTP/HTTPS
2. Permitir busca por imagem via popup, atalho ou menu de contexto
3. Permitir captura de tela para busca visual
4. Permitir tradução de página ou screenshot
5. Configurar país e idioma do usuário
6. Gerenciar consentimento de privacidade
7. Montar endpoint de busca para plataforma alibaba_search_by_image
8. Integrar com backend AiPrice/AliPrice
9. Tratar falhas de API, timeout, captcha e Cloudflare
```

Para o ApexSeller, o principal aprendizado é:

```text
imagem é a ponte entre marketplace de venda e fornecedor
```

A estratégia correta é combinar:

```text
AiPrice:
  busca visual universal
  screenshot
  tradução
  país/idioma
  privacidade

1668:
  DOM operacional
  botão em cards
  popover de similares
  preço fornecedor
  logística/pedidos

ApexSeller:
  captura + normalização + histórico + score de oportunidade
```

O caminho mais forte é transformar a extensão em uma camada de inteligência:

```text
não apenas “buscar por imagem”
mas “converter imagem em oportunidade validada”
```

Resultado final desejado:

```text
produto visto no marketplace
  ↓
fornecedor provável encontrado
  ↓
custo estimado calculado
  ↓
risco avaliado
  ↓
margem estimada
  ↓
Viability Score
  ↓
decisão de compra/importação
```
