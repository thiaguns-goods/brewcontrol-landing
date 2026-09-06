# BrewControl Landing V5 — Post-launch runbook

## Objetivo

Operar a V5 publicada com disciplina: primeiro medir, depois adicionar prova visual real, ativar descoberta e só então otimizar conversão a partir de dados.

## Ordem recomendada

### 1. Search Console / Bing — hoje

Google Search Console:
1. adicionar/verificar `brewcontrol.app.br`;
2. abrir **Sitemaps**;
3. enviar `https://brewcontrol.app.br/sitemap.xml`;
4. abrir **Inspeção de URL**;
5. testar a Home publicada;
6. solicitar indexação;
7. repetir para as páginas de Produção, Ativos, Comercial, Logística, Brewpub, Financeiro, Almoxarifado, Fiscal e PDV Mobile.

Bing Webmaster Tools:
1. adicionar/verificar o domínio ou importar do Search Console;
2. enviar o mesmo sitemap;
3. confirmar a key pública de IndexNow;
4. enviar as URLs modificadas da V5;
5. acompanhar IndexNow / URL Submission / AI Performance quando houver dados.

Observação: a busca pode continuar mostrando a landing antiga por algum tempo até novo rastreamento. IndexNow e solicitação de indexação sinalizam a atualização, mas não garantem indexação imediata.

### 2. GA4 — baseline de conversão

O site já carrega GA4. A próxima etapa é medir as ações que importam, sem PII.

Eventos propostos:
- `app_open` — clique em “Entrar no app” / “Começar”;
- `pricing_cta_click` — clique em CTA de um plano, com o nome do plano;
- `module_open` — clique em página de módulo;
- `founder_program_click` — clique no Programa Cervejaria Fundadora / WhatsApp;
- `demo_video_view` — somente quando um mini-demo real estiver publicado.

Depois da instrumentação:
1. validar os eventos em Realtime/DebugView;
2. marcar como conversão somente ações que representem intenção comercial real;
3. registrar uma semana de baseline antes de mudar texto/posição dos CTAs.

### 3. Mini-demo de Produção — primeiro vídeo

Duração alvo: 7–10 segundos.

Roteiro:
1. abrir Produção em um lote demonstrativo;
2. entrar no lote / Brew Day;
3. executar uma ação visual curta e segura;
4. mostrar a mudança refletindo na tela;
5. encerrar em um estado limpo que permita loop.

Regras:
- sem dados de clientes reais;
- sem e-mails, telefones, documentos, tokens ou IDs sensíveis;
- cursor lento e deliberado;
- sem narração;
- gravar 1440p ou 1080p;
- exportar WebM e MP4;
- criar poster estático;
- manter o vídeo curto e leve.

Publicação:
1. adicionar os arquivos em `media/demos/`;
2. testar carregamento e fallback;
3. alterar apenas o item correspondente em `media/demos/manifest.json` para `available=true`;
4. validar performance;
5. adicionar Schema `VideoObject` somente depois de a URL pública existir.

### 4. Captura real do PDV Mobile

Hoje a página está explicitamente marcada como representação de fluxo.

Capturar:
1. tela de PIN;
2. pedidos pendentes;
3. barris no ponto;
4. confirmação de recebimento.

Depois substituir a representação atual pela captura real, sem mudar o posicionamento funcional da página.

### 5. Próximos mini-demos

Depois de Produção:
1. Ativos & Barris — 6–8 s;
2. Comercial + Logística — 6–8 s;
3. Brewpub + Financeiro — 7–10 s.

Publicar um por vez. Não esperar todos ficarem prontos.

### 6. Conteúdo orgânico

Prioridade editorial inicial:
1. sistema / ERP para cervejaria artesanal;
2. controle de produção de cerveja;
3. controle de barris e chopeiras;
4. estoque de insumos e ruptura;
5. planilha vs sistema para cervejaria;
6. gestão de cervejaria cigana;
7. rastreabilidade de lote;
8. comercial e logística de chope;
9. custos / CMV;
10. brewpub com produção integrada.

Cada artigo deve responder uma pergunta real do setor e apontar para uma página canônica do produto.

## Gate de performance

Após qualquer mídia nova, checar:
- LCP;
- INP;
- CLS;
- peso inicial da página;
- comportamento no celular;
- fallback sem vídeo.

Metas operacionais:
- LCP < 2,5 s no p75;
- INP < 200 ms no p75;
- CLS < 0,1 no p75.

## Sequência curta para o proprietário

**Hoje:** Search Console + Bing + sitemap + solicitar indexação.

**Depois:** gravar o demo de Produção e a tela real do PDV Mobile.

**Em seguida:** validar GA4/conversões e publicar os vídeos um por vez.

**Após 7–14 dias:** analisar consultas, páginas, CTR e conversões antes de alterar CTA/copy.
