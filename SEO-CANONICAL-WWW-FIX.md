# Canonical host fix — www

## Finding

O Search Console conectado reconhece a propriedade `https://www.brewcontrol.app.br/`, enquanto a Landing V5 publica canonicals, Schema/OG e URLs do sitemap em `https://brewcontrol.app.br/` (sem `www`). O host sem `www` redireciona para `www` em produção.

## Impact

Isso cria sinais mistos para mecanismos de busca. O caso já aparece na inspeção do módulo Fiscal como `Alternate page with proper canonical tag`, e as novas páginas de módulos ainda estão `URL is unknown to Google`.

## Required fix before resubmission

- padronizar canonical para `https://www.brewcontrol.app.br/...`;
- padronizar `og:url`, imagens absolutas e JSON-LD para o host `www`;
- atualizar `sitemap.xml` para URLs `www`;
- atualizar `robots.txt` para apontar ao sitemap `www`;
- atualizar `llms.txt` e documentos públicos que declaram o site oficial;
- manter `app.brewcontrol.app.br` inalterado;
- depois republicar, reenviar sitemap, executar URL Inspection novamente e submeter IndexNow.

## URLs prioritárias após o fix

- `/`
- `/modulo-producao.html`
- `/modulo-almoxarifado.html`
- `/modulo-ativos.html`
- `/modulo-comercial.html`
- `/modulo-logistica.html`
- `/modulo-financeiro.html`
- `/modulo-brewpub.html`
- `/modulo-fiscal.html`
- `/modulo-pdv-mobile.html`
