# Central de Ajuda BrewControl — Fundação V1

Issue de execução: `brewcontrol-landing#47`.

Esta pasta contém a fundação pública e estática da Central de Ajuda. O objetivo desta etapa é validar arquitetura, busca, navegação, templates, responsividade e linguagem visual sem publicar procedimentos operacionais do BrewControl que ainda dependam da auditoria documental `studio#257`.

## Arquitetura

- `index.html` — home da Central e busca.
- `search-data.js` — índice editorial separado da camada visual.
- `help.js` — busca, aliases, teclado, menu mobile e hub dinâmico.
- `help.css` — sistema visual Read derivado da identidade V5.
- `modulo.html` — template de hub de módulo.
- `artigo.html` — template de artigo.
- `troubleshooting.html` — template de diagnóstico.
- `conceitos.html` — conceitos de documentação e governança.
- `novidades.html` — histórico da própria Central.

## Estado editorial

A fundação usa `noindex,follow` enquanto o corpus operacional não estiver auditado. Nenhum procedimento de pedido, entrega, produção, inventário, financeiro, PDV, permissões ou outro fluxo dependente da #257 deve ser publicado como verdade operacional nesta fase.

## `guia.html`

O arquivo legado permanece intacto e sem redirect. Quando a Central assumir oficialmente, a migração deve: (1) auditar tráfego/links; (2) mapear seções antigas para artigos equivalentes VERIFIED; (3) redirecionar apenas onde houver paridade de conteúdo; (4) preservar URLs sem equivalente até existir destino seguro.
