# ApexSeller AI — Engenharia Reversa da Extensão Avantpro SHP 7.5.0

**Versão:** 1.0  
**Status:** Documento de engenharia reversa  
**Base analisada:** pacote `7.5.0_0` / extensão Chrome Manifest V3 `Avantpro SHP`  
**Objetivo:** Documentar, sem resumo, a análise feita sobre a arquitetura da extensão e os aprendizados aplicáveis ao ApexSeller AI.

---

# Engenharia reversa — extensão `7.5.0_0`

## 1. Resumo executivo

A extensão analisada confirma uma direção importante para o ApexSeller:

> **capturar payloads da página é melhor do que raspar DOM.**

A Avantpro SHP usa uma arquitetura muito próxima da que discutimos para o MX Miner:

```text
preload.js
    ↓
injeta interceptor.js no contexto da página
    ↓
interceptor.js sobrescreve window.fetch e XMLHttpRequest
    ↓
captura respostas JSON específicas da Shopee
    ↓
salva dados em localStorage/sessionStorage/DOM oculto
    ↓
index.js/common.js consomem esses dados
    ↓
envia dados processados ao backend Avantpro
```

O ponto mais importante: ela **não depende apenas de scraping de DOM**. Ela usa DOM para interface, posicionamento de botões e fallback, mas o dado de produto, busca e avaliações vem principalmente de payloads de rede.

Isso valida a tese central para o ApexSeller:

```text
Playwright deve orquestrar navegação.
A extensão deve capturar payload.
O backend deve preservar raw payload.
DOM scraping deve ser fallback.
```

---

# 2. Estrutura da extensão

Arquivos principais encontrados:

```text
manifest.json
background.js
common.js
index.js
preload.js
interceptor.js
```

Também há muitos arquivos `.woff`/`.woff2`, ícones, imagens e metadata.

## `manifest.json`

A extensão é Manifest V3.

Pontos relevantes:

```json
{
  "manifest_version": 3,
  "name": "Avantpro SHP",
  "version": "7.5.0",
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [
    {
      "js": ["common.js", "index.js"],
      "matches": [
        "http://*.shopee.com.br/*",
        "https://*.shopee.com.br/*"
      ],
      "run_at": "document_idle"
    },
    {
      "js": ["preload.js"],
      "matches": [
        "http://*.shopee.com.br/*",
        "https://*.shopee.com.br/*"
      ],
      "run_at": "document_start"
    }
  ]
}
```

## Interpretação

A extensão separa bem dois papéis:

```text
preload.js
    → roda cedo, em document_start
    → injeta o interceptor

index.js/common.js
    → rodam depois
    → renderizam UI, leem dados e integram com backend
```

Isso é exatamente o padrão que o ApexSeller deveria usar.

---

# 3. Como a extensão intercepta dados

## `preload.js`

O `preload.js` injeta `interceptor.js` diretamente na página:

```js
const t = chrome.runtime.getURL("interceptor.js");
const e = document.createElement("script");
e.src = t;
e.type = "text/javascript";
(document.head || document.documentElement).appendChild(e);
```

## Por que isso é importante?

Content scripts de extensão rodam em um “mundo isolado” do Chrome. Para sobrescrever `window.fetch` real da página, o script precisa ser injetado no contexto da página.

A Avantpro faz isso corretamente.

Para o ApexSeller:

```text
MX Miner preload
    ↓
injeta interceptor no Main World
    ↓
intercepta fetch/XHR reais do marketplace
```

Essa é uma decisão arquitetural correta.

---

# 4. O `interceptor.js`

O `interceptor.js` é o núcleo mais relevante da extensão.

Ele intercepta:

```text
window.fetch
XMLHttpRequest
```

E monitora URLs da Shopee como:

```text
/pdp/get_pc
/item/get_ratings
recommend/recommend_v2
recommend/recommend
rcmd_items
```

## Fluxo simplificado

```text
resposta JSON da Shopee
    ↓
interceptor analisa URL
    ↓
se for produto, busca ou avaliações:
        salva dados em localStorage/sessionStorage/DOM oculto
```

## Principais caches

```text
avantpro_search_cache
avantpro_ratings_cache
avantpro-item-data
```

### `avantpro_search_cache`

Guarda itens vindos de busca/recomendação.

### `avantpro_ratings_cache`

Guarda avaliações capturadas de `/item/get_ratings`.

### `avantpro-item-data`

É um elemento DOM oculto usado para transportar dados de produto do interceptor para o content script.

---

# 5. Conhecimento extraído: a extensão já é payload-first

A extensão não faz algo como:

```text
ler texto do HTML
    ↓
tentar descobrir preço
```

Ela faz:

```text
interceptar payload JSON
    ↓
extrair itemid, shopid, preço, vendas, avaliações etc.
```

Isso confirma uma hipótese importante:

> Para o ApexSeller, a arquitetura mais robusta é interceptar payloads e preservar a resposta bruta.

A Avantpro usa o payload, mas não parece preservar tudo como raw event estruturado. Ela armazena caches locais e depois envia payloads processados ao backend.

O ApexSeller pode ir além.

---

# 6. O que o ApexSeller deve copiar da arquitetura

Não copiar código proprietário. Copiar o padrão arquitetural.

## Padrão recomendado

```text
preload.ts
    ↓
injeta interceptor.ts
    ↓
interceptor captura fetch/XHR
    ↓
envia mensagem para content.ts
    ↓
content.ts adiciona contexto
    ↓
background.ts envia para backend
    ↓
backend salva raw_payload_events
```

## Diferença importante

A Avantpro usa bastante:

```text
localStorage
sessionStorage
DOM oculto
```

O ApexSeller deveria usar isso apenas como fallback local.

A estratégia mais forte seria:

```text
payload capturado
    ↓
postMessage para content script
    ↓
chrome.runtime.sendMessage para background
    ↓
POST /api/ingest/raw-payload
```

Assim o dado não fica preso em cache local.

---

# 7. API/backend da Avantpro

A extensão envia dados ao backend Avantpro usando endpoints como:

```text
/search/items
/sellers
/alibaba/url
/items/{id}/price-history
/items/{id}/rating-history
/items/{id}/search-position-history
/api-authorization/shop-account/{shopId}
```

## Endpoint mais importante

```text
POST /search/items
```

A extensão envia dois tipos de dados:

```js
{
  metricsOnlyItems: [...],
  items: [...],
  keyword: "..."
}
```

## Interpretação

A Avantpro separa:

### `metricsOnlyItems`

Itens que já existem no backend e só precisam atualizar métricas leves.

### `items`

Itens que precisam enviar payload completo.

Isso é uma boa decisão.

Para ApexSeller, o equivalente seria:

```text
listing_metric_observations
raw_payload_events
marketplace_listings
```

---

# 8. Modelo de dados inferido

A extensão trabalha com um modelo de produto parecido com:

```json
{
  "id": "...",
  "itemid": "...",
  "shopId": "...",
  "name": "...",
  "image": "...",
  "price_min": 0,
  "price_max": 0,
  "sales": 0,
  "monthly_sales": 0,
  "rating": {},
  "likes": 0,
  "stock": 0,
  "discount": 0,
  "location": "...",
  "pictures": [],
  "hasVideo": false,
  "video": {},
  "official_shop": false,
  "verified_seller": false,
  "createdAt": "...",
  "categoryId": 0
}
```

## Conhecimento extraível para ApexSeller

Esse modelo é bastante útil como referência para um `NormalizedMarketplaceListing`.

Sugestão:

```ts
type NormalizedMarketplaceListing = {
  marketplace: "SHP" | "MLB" | "AMZ" | "1688" | "PINDAU" | "RAKUMART";
  itemId: string;
  sellerId?: string;
  title: string;
  imageUrl?: string;
  imageUrls?: string[];
  priceMin?: number;
  priceMax?: number;
  salesTotal?: number;
  salesMonthly?: number;
  ratingAverage?: number;
  ratingCount?: number;
  likes?: number;
  stock?: number;
  discount?: number;
  location?: string;
  categoryId?: string;
  officialStore?: boolean;
  verifiedSeller?: boolean;
  hasVideo?: boolean;
  createdAt?: string;
  capturedAt: string;
  sourceMethod: string;
  rawPayloadEventId?: string;
};
```

---

# 9. Extração de vendas e vendas mensais

A extensão procura sinais como:

```text
display_sold_count
historical_sold_count
historical_sold_count_text
monthly_sold_count
monthly_sold_count_text
rounded_local_monthly_sold_count
local_monthly_sold_count_text
```

Ela também tem fallback para estimar venda mensal com base em venda histórica e data de criação.

## Interpretação

A lógica é:

```text
se payload traz venda mensal:
    usa valor direto
senão:
    estima venda mensal = vendas históricas / idade do anúncio
```

## Relevância para ApexSeller

Esse é um ponto excelente.

Para o ApexSeller, toda métrica de venda deveria ter:

```text
value
source
confidence
```

Exemplo:

```json
{
  "monthlySales": 120,
  "monthlySalesSource": "payload_direct",
  "confidence": 0.95
}
```

ou:

```json
{
  "monthlySales": 85,
  "monthlySalesSource": "estimated_from_historical_sales",
  "confidence": 0.55
}
```

Isso evita tratar estimativa como dado observado.

---

# 10. Search Intelligence

A extensão captura produtos de busca/recomendação e associa:

```text
keyword
page
position
timestamp
countryId
marketplace
```

Exemplo inferido:

```js
{
  itemId,
  sellerId,
  keyword,
  position,
  timestamp,
  countryId: "BR",
  marketplace: "SHP",
  page
}
```

## Por que isso é importante?

Esse é o embrião de três módulos que discutimos:

```text
Search Intelligence
Keyword Intelligence
Advertising Intelligence
```

O ApexSeller deve armazenar toda aparição em busca como evento.

Sugestão:

```ts
type SearchObservation = {
  marketplace: string;
  keyword: string;
  page: number;
  position: number;
  itemId: string;
  sellerId?: string;
  capturedAt: string;
  sourceMethod: "extension_user" | "extension_orchestrated" | "official_api" | "dom_scraper";
  rawPayloadEventId?: string;
};
```

## Resolve qual problema?

Permite responder:

```text
este produto aparece bem em busca?
aparece organicamente?
aparece só com mídia paga?
quais palavras posicionam melhor?
quem domina a categoria?
```

---

# 11. Advertising Intelligence

A extensão possui um recurso chamado algo como `boostAds` e trabalha com dados de impulsionamento da conta conectada do seller.

Também existe lógica para `auto_boosted`, variações, métricas e integração de conta.

Mas, na parte analisada, não encontrei uma prova clara de que a extensão captura diretamente uma flag pública de anúncio patrocinado na busca da Shopee. Pode existir no payload, mas não ficou explícito nas partes principais.

## Ponto crítico

Não confundir:

```text
boost/auto_boosted da conta do seller
```

com:

```text
produto patrocinado observado na busca pública
```

São coisas diferentes.

## Para o ApexSeller

Advertising Intelligence deveria ter duas classes de dado:

### 1. Ads próprio / conta conectada

Quando o usuário conecta sua conta.

```text
campanha
boost
ads
views
cliques
vendas
gasto
```

### 2. Ads observado em marketplace

Quando a extensão detecta se o produto concorrente aparece como patrocinado.

```text
is_sponsored_observed
ads_signal_field
ads_confidence
keyword
position
```

## Pergunta técnica para próxima investigação

Dentro do raw payload da busca Shopee, procurar campos como:

```text
ads_id
campaign_id
sponsored
promotion
tracking
ads_keyword
is_ads
```

Se existirem, o ApexSeller pode armazenar isso diretamente.

Se não existirem, usar inferência probabilística com baixa/média confiança.

---

# 12. Reviews / Voice of Customer

A extensão captura avaliações com `/item/get_ratings`.

Ela guarda dados em `sessionStorage` e também tem fallback via DOM.

Campos de review extraídos:

```text
data
usuário
estrelas
comentário
variação
curtidas
fotos
```

Ela exporta isso para Excel.

## Isso é extremamente relevante

Esse é praticamente o módulo **Voice of Customer Intelligence** que discutimos, mas em formato operacional simples.

Para ApexSeller, o fluxo deveria evoluir assim:

```text
captura reviews
    ↓
raw review payload
    ↓
normalização
    ↓
sentimento
    ↓
tópicos
    ↓
aspectos
    ↓
risco de produto
    ↓
Viability Score
```

## Modelo sugerido

```ts
type ReviewObservation = {
  marketplace: string;
  itemId: string;
  sellerId?: string;
  ratingId?: string;
  userName?: string;
  ratingStar: number;
  comment: string;
  variation?: string;
  likes?: number;
  imageCount?: number;
  createdAt?: string;
  capturedAt: string;
  sourceMethod: string;
  rawPayloadEventId?: string;
};
```

## Conhecimento extraível

A extensão mostra que reviews podem ser coletados não só por scraping visual, mas por payload:

```text
/item/get_ratings
```

Isso reduz muito a dificuldade inicial do VoC.

---

# 13. Visual Intelligence / busca de fornecedor

A extensão tem uma função relevante:

```text
productToAlibabaUrl
```

Ela:

```text
resolve imagem do produto
    ↓
envia imageUrl + title para backend
    ↓
POST /alibaba/url
    ↓
recebe uma URL
    ↓
abre Alibaba em nova aba
```

## Interpretação

A Avantpro não faz busca vetorial local no browser. Ela envia imagem/título para o backend, e o backend resolve a URL Alibaba.

Isso se conecta diretamente com sua ideia:

```text
Shopee produto vencedor
    ↓
imagem
    ↓
buscar similar no 1688/Pindau/Rakumart
    ↓
avaliar custo
    ↓
decidir viabilidade
```

## O que o ApexSeller pode fazer melhor

Em vez de apenas abrir Alibaba, o ApexSeller pode estruturar o resultado:

```text
produto Shopee
    ↓
imagem
    ↓
CLIP / busca visual / matching híbrido
    ↓
candidatos 1688/Pindau/Rakumart
    ↓
similarity score
    ↓
landed cost
    ↓
margem
    ↓
viability score
```

## Modelo sugerido

```ts
type SupplierMatchCandidate = {
  sourceMarketplace: "SHP";
  sourceItemId: string;
  targetSource: "1688" | "PINDAU" | "RAKUMART" | "ALIBABA";
  targetUrl: string;
  imageSimilarity?: number;
  textSimilarity?: number;
  finalSimilarity: number;
  matchConfidence: number;
  status: "candidate" | "confirmed" | "rejected";
};
```

---

# 14. Cost Intelligence / calculadora

A extensão possui seletores e recursos relacionados a:

```text
calculadora
margem
custo do produto
custo extra
taxa
preço
contribuição
ROI
planilha de lucratividade
```

Ela não parece ter integração direta com Pindau/Rakumart no pacote analisado, mas contém uma lógica de produto para:

```text
custo
preço
taxa
ROI
margem
```

## Conhecimento extraível

A Avantpro trata cálculo de rentabilidade como ferramenta de produto, não como pipeline de dados.

O ApexSeller deveria ir além:

```text
upload CSV Pindau/Rakumart
    ↓
parser
    ↓
LandedCostQuote
    ↓
margem e ROI
    ↓
Viability Score
```

## Modelo sugerido

```ts
type LandedCostQuote = {
  source: "PINDAU" | "RAKUMART" | "MANUAL" | "CSV";
  sourceDocumentId?: string;
  supplierProductUrl?: string;
  currency: string;
  exchangeRate?: number;
  factoryPrice?: number;
  freight?: number;
  insurance?: number;
  taxesTotal?: number;
  serviceFee?: number;
  domesticShipping?: number;
  landedCostTotal: number;
  capturedAt: string;
  validUntil?: string;
  parserVersion: string;
};
```

---

# 15. Keyword Intelligence

A extensão possui módulo de “keywords” em páginas de busca.

Não analisei toda a UI desse módulo, mas a presença dele reforça que existe valor em:

```text
termos de busca
posição
produtos retornados
performance dos produtos
```

## Para ApexSeller

A abordagem correta é:

```text
não afirmar volume real de busca
```

e sim:

```text
medir associação observada entre palavras e performance.
```

## Pipeline recomendado

```text
capturar busca por keyword
    ↓
armazenar top N produtos
    ↓
extrair títulos
    ↓
normalizar tokens
    ↓
ponderar por vendas, preço, posição, ads
    ↓
classificar palavras em premium / commodity / genéricas
```

A extensão mostra que a coleta de `keyword`, `position`, `page` e `payload` já é suficiente para iniciar esse módulo.

---

# 16. Data freshness

A extensão usa lógica de atualização aproximada de 24 horas para evitar repostar dados completos ao backend quando o item já foi atualizado recentemente.

Exemplo inferido:

```text
se item updated_at < 24h:
    envia só métrica leve
senão:
    envia payload completo
```

## Conhecimento extraível

Isso é bom, mas para o ApexSeller precisa ser mais explícito.

Sugestão:

```text
hot       até 2h
warm      até 24h
cold      histórico
stale     vencido para decisão crítica
```

E cada dado deveria carregar:

```ts
capturedAt
validUntil
sourceMethod
freshnessTier
stalenessHours
```

---

# 17. Backend-first ou extension-first?

A Avantpro tem muita inteligência no frontend/extensão:

- normaliza produto;
- calcula métricas;
- decide quando postar;
- enriquece vendas;
- renderiza painéis;
- baixa avaliações;
- gera Excel.

Para ApexSeller, eu tomaria cuidado.

## Recomendação

Deixar a extensão mais “burra” e o backend mais inteligente.

### Extensão

Responsável por:

```text
capturar
identificar fonte
enviar raw payload
exibir UI básica
```

### Backend

Responsável por:

```text
normalizar
versionar parser
validar
deduplicar
calcular score
enviar ao BigQuery
rodar ML
```

## Por quê?

Se muita regra ficar na extensão:

- deploy é mais difícil;
- versionamento é mais lento;
- usuário pode estar com versão antiga;
- parsers ficam espalhados;
- auditoria fica fraca.

A extensão deve ser o sensor.  
O backend deve ser o cérebro.

---

# 18. O que isso ensina para o MX Miner

## Melhorias recomendadas

### 1. Criar `raw_payload_events`

A Avantpro guarda caches locais. O ApexSeller deveria armazenar evento bruto no backend.

```ts
type RawPayloadEvent = {
  id: string;
  marketplace: string;
  payloadType: string;
  url: string;
  method: "fetch" | "xhr";
  capturedAt: string;
  sourceMethod: "extension_user" | "extension_orchestrated";
  rawPayloadHash: string;
  rawPayloadLocation?: string;
  parserVersion?: string;
  jobId?: string;
};
```

### 2. Versionar parsers

Cada parser precisa ter versão:

```text
shopee_search_v1
shopee_product_v1
shopee_reviews_v1
pindau_quote_csv_v1
rakumart_quote_csv_v1
```

### 3. Separar payload bruto de payload normalizado

```text
raw_payload
normalized_listing
normalized_seller
normalized_review
normalized_cost_quote
```

### 4. Adicionar `source_method`

Valores:

```text
extension_user
extension_orchestrated
csv_upload
official_api
dom_fallback
manual
```

### 5. Adicionar `confidence`

Toda métrica inferida precisa de confiança:

```text
salesTotalSource
monthlySalesSource
adsSignalSource
costSource
matchConfidence
```

---

# 19. Playwright + extensão: viabilidade

A extensão analisada é compatível conceitualmente com Playwright porque:

- é Manifest V3;
- usa content scripts;
- injeta script via `chrome.runtime.getURL`;
- depende de páginas Shopee reais;
- intercepta `fetch`/XHR no contexto da página.

## POC recomendada

```text
1. iniciar Chromium com a extensão MX Miner
2. configurar baseUrl/API key/job_id
3. abrir busca Shopee
4. aguardar payload de busca
5. abrir top 10 produtos
6. capturar detalhes e reviews
7. validar chegada no backend
8. comparar com navegação manual
```

## Questões técnicas

1. O service worker MV3 permanece ativo durante a navegação?
2. A extensão consegue receber `job_id` via storage?
3. O payload de Playwright é igual ao payload de navegação manual?
4. A Shopee carrega os mesmos endpoints?
5. Como vincular uma resposta de `fetch` ao termo pesquisado?
6. O backend deve aceitar `extension_orchestrated` separado de `extension_user`?
7. Qual limite de coleta para não criar ruído ou risco operacional?

---

# 20. Pontos de atenção

## 20.1 Chaves e tokens no bundle

O pacote contém configurações, URLs e chaves/tokens embutidos no JavaScript final.

Não vou reproduzir esses valores aqui, mas isso é um alerta arquitetural.

Para o ApexSeller:

```text
não embutir segredos reais na extensão
```

Tudo que está em extensão deve ser tratado como público.

A extensão pode armazenar API key do usuário, mas não deve conter segredos de backend com privilégio amplo.

## 20.2 `localStorage` como transporte de dados

A Avantpro usa `localStorage`, `sessionStorage` e DOM oculto.

Funciona, mas tem limitações:

- dados podem expirar;
- dados podem ser perdidos;
- difícil auditar;
- difícil associar a job;
- risco de colisão entre abas.

Para ApexSeller, melhor:

```text
postMessage
    ↓
content script
    ↓
background
    ↓
backend
```

## 20.3 DOM ainda é usado

A extensão usa DOM para:

- posicionar UI;
- detectar botões;
- fallback de reviews;
- capturar imagens;
- inserir painéis.

Isso é normal.

Mas a regra deveria ser:

```text
DOM para UX e fallback.
Payload para dado principal.
```

---

# 21. Arquitetura recomendada para ApexSeller após a engenharia reversa

```text
Shopee / Marketplace / Fornecedor
        ↓
MX Miner preload
        ↓
interceptor no Main World
        ↓
fetch/XHR captured
        ↓
content script
        ↓
background worker
        ↓
POST /api/ingest/raw-payload
        ↓
raw_payload_events
        ↓
parser registry
        ↓
normalized tables
        ↓
Postgres operacional
        ↓
Data Lake bruto
        ↓
BigQuery analítico
        ↓
BI / ML / Viability Score
```

---

# 22. Entidades prioritárias para implementar

## 1. `raw_payload_events`

A base de tudo.

## 2. `marketplace_search_observations`

Para Keyword e Advertising Intelligence.

## 3. `marketplace_listing_snapshots`

Para preço, estoque, vendas, ranking e histórico.

## 4. `review_observations`

Para Voice of Customer.

## 5. `supplier_match_candidates`

Para Visual Intelligence e sourcing.

## 6. `landed_cost_quotes`

Para Cost Intelligence.

## 7. `viability_score_runs`

Para rastrear decisões e explicar recomendações.

---

# 23. O que podemos extrair como conhecimento estratégico

## 1. Payload-first é viável

A Avantpro já usa esse padrão em produção.

## 2. Shopee expõe muitos dados úteis em payload

Incluindo produto, busca, vendas, avaliações, imagens, seller e métricas.

## 3. Reviews são uma fonte valiosa e capturável

Isso acelera o módulo Voice of Customer.

## 4. Search observations são essenciais

Keyword, página e posição são fundamentais para inteligência competitiva.

## 5. Visual sourcing pode começar simples

Enviar imagem para backend e retornar URL de fornecedor já é uma primeira versão funcional.

Depois evolui para matching híbrido com CLIP/pgvector.

## 6. Backend deve preservar o bruto

A Avantpro processa muito na extensão. O ApexSeller deveria centralizar inteligência no backend.

## 7. Métrica precisa de origem e confiança

Vendas mensais observadas e vendas mensais estimadas não podem ser tratadas igual.

---

# 24. Roadmap prático recomendado

## Fase 1 — MX Miner payload-first

Implementar:

```text
preload.ts
interceptor.ts
raw_payload_events
source_method
payload_type
raw_payload_hash
```

## Fase 2 — Shopee search/detail/reviews

Capturar:

```text
search results
product detail
ratings
seller
```

## Fase 3 — Playwright + MX Miner

Validar:

```text
extension_orchestrated
collector_jobs
job_id
keyword
page
position
```

## Fase 4 — BI mínimo

Criar:

```text
price history
sales history
search position history
rating history
```

## Fase 5 — Intelligence modules

Criar:

```text
Keyword Intelligence
Advertising Intelligence
Voice of Customer
Visual Supplier Matching
Cost Intelligence
```

## Fase 6 — Viability Score

Unificar:

```text
demanda
margem
custo
reviews
risco
concorrência
ads
match confidence
```

---

# 25. Conclusão

A engenharia reversa da extensão Avantpro SHP reforça quase todas as decisões que discutimos.

A principal conclusão é:

> O ApexSeller deve tratar a extensão como um sensor de dados estruturados, não como uma ferramenta de scraping visual.

A Avantpro já demonstra que é possível interceptar payloads da Shopee via `fetch`/XHR, enriquecer produtos, capturar avaliações, associar buscas a posições, enviar dados ao backend e criar ferramentas de análise dentro da página.

O ApexSeller pode usar essa aprendizagem, mas com uma arquitetura mais preparada para inteligência preditiva:

```text
capturar payload bruto
preservar origem
versionar parser
calcular confiança
armazenar histórico
analisar em BigQuery
aplicar ML
gerar decisão
```

O maior ganho para o ApexSeller não é replicar as funcionalidades da Avantpro. É transformar esse padrão de coleta em uma plataforma de decisão:

```text
produto vende?
existe fornecedor?
o custo nacionalizado fecha?
as avaliações indicam risco?
o anúncio depende de ads?
as palavras do título comunicam valor?
vale importar?
```

Minha recomendação imediata: implementar um POC do **MX Miner payload-first** com três payloads da Shopee:

```text
1. search results
2. product detail
3. item ratings
```

A partir disso, você já consegue alimentar BI, Keyword Intelligence, Voice of Customer e o primeiro esqueleto do Apex Viability Score.
