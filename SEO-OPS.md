# BrewControl SEO Ops

Sistema operacional de SEO pós-lançamento da Landing V5.

## Objetivo

Aumentar descoberta orgânica e autoridade do BrewControl por meio de melhoria contínua baseada em dados reais. SEO Ops não tenta manipular ranking com tráfego falso, backlinks artificiais ou conteúdo em massa.

## Componentes

### 1. SEO Sentinel técnico

Workflow: `.github/workflows/seo-sentinel.yml`

Executa diariamente e também pode ser disparado manualmente. Não exige secrets externos.

Valida:

- HTTP 200 da Home e dos 9 módulos críticos;
- canonical exato no host `www.brewcontrol.app.br`;
- ausência de `noindex` acidental;
- `robots.txt` acessível e apontando para o sitemap correto;
- ausência de bloqueio genérico `User-agent: * / Disallow: /`;
- sitemap contendo todas as URLs críticas;
- `llms.txt` acessível e consistente com o host canônico.

Em falha, abre ou atualiza uma única Issue chamada `[SEO Sentinel] Regressão técnica`. Quando tudo volta a PASS, fecha o alerta automaticamente.

### 2. SEO Sentinel de dados

Rotina recorrente no ChatGPT usando os conectores já configurados:

- Google Search Console / GSC Wizard;
- Bing Webmaster Tools;
- Google Analytics 4.

O Sentinel de dados deve alertar apenas quando houver evidência acionável. Não interpretar amostra mínima como regressão.

Sinais principais:

- indexação/cobertura de páginas críticas;
- sitemap/crawl;
- queda material de impressões ou cliques;
- CTR anormal para a posição;
- mudança relevante de posição;
- erro de crawl no Bing;
- tráfego orgânico e conversões no GA4.

### 3. Opportunity Agent

Rotina semanal que prioriza no máximo cinco oportunidades por ciclo.

Analisa:

- queries em posições 4–30;
- queries com impressões e CTR abaixo do potencial;
- page poaching / oportunidades próximas do topo;
- ranking changes;
- conteúdo em queda;
- canibalização;
- Search Console + GA4 por landing page;
- Bing queries/pages;
- clusters temáticos.

A saída canônica é a Issue `SEO Opportunities — fila contínua`.

O agente NÃO publica conteúdo automaticamente.

### 4. Content Agent

Só entra depois de uma oportunidade aprovada.

Fluxo:

1. oportunidade com evidência;
2. intenção de busca;
3. fontes e conhecimento operacional;
4. briefing;
5. rascunho;
6. validação factual e de produto;
7. branch/PR;
8. publicação;
9. sitemap/IndexNow;
10. medição.

### 5. Authority Agent

Busca oportunidades legítimas de menções e links editoriais em entidades, fornecedores, escolas, eventos, podcasts, blogs e parceiros do setor.

O agente pode pesquisar e preparar outreach, mas envio deve ser revisado/autorizado. Compra de links, diretórios em massa, comentários automáticos e redes artificiais são proibidos.

### 6. AI Visibility

Acompanhar, quando identificável, sessões e páginas referidas por ChatGPT, Perplexity, Copilot, Gemini, Claude e outros assistentes. Ausência de referrer não significa ausência de uso em IA.

## Clusters canônicos

Configurados no GSC Wizard em 07/09/2026:

1. ERP e sistema para cervejaria;
2. Produção e rastreabilidade;
3. Barris, chopeiras e ativos;
4. Estoque e insumos;
5. Comercial e logística de chope;
6. Brewpub e gestão financeira;
7. Cervejaria cigana e terceirização.

## Política de decisão

Os thresholds iniciais estão em `seo-ops.config.json` e são heurísticos.

Evitar mudanças por ranking quando:

- a query tem amostra mínima;
- a página acabou de ser publicada/indexada;
- os dados ainda não estão consolidados;
- a variação é pequena e não se repete.

Priorizar quando houver volume e intenção suficientes, especialmente queries entre posições 4–30, CTR abaixo do potencial, queda material ou canibalização consistente.

## Guardrails

Nunca executar:

- bots de clique ou buscas artificiais;
- tráfego falso para CTR;
- compra/criação automática de backlinks;
- keyword stuffing;
- páginas em massa com conteúdo raso;
- reviews, clientes, números ou cases inventados;
- publicação automática de conteúdo sem revisão factual;
- secrets de Google/Bing versionados no repositório.

## Baseline

A Landing V5 foi publicada em 06/09/2026. Em 07/09, Search Console ainda tinha dados consolidados majoritariamente anteriores ao lançamento. A primeira comparação forte deve usar uma janela pós-V5 inteiramente consolidada.

GA4 já confirmou em Tempo Real os eventos `module_open` e `app_open` após a instrumentação da V5.

## Issues canônicas

- `#13` — arquitetura SEO Ops;
- `#14` — fila de oportunidades;
- `#15` — fila de conteúdo;
- `#16` — autoridade/backlinks reais;
- `#17` — AI Visibility;
- `#18` — baseline inicial.

## Operação recomendada

- diário: Sentinel técnico + Sentinel de dados;
- semanal: Opportunity Agent;
- mensal: revisão de clusters, conteúdo, autoridade e IA;
- após qualquer mudança SEO relevante: registrar PR/data e aguardar janela suficiente antes de atribuir resultado.
