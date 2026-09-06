# BrewControl — Plano de captura dos mini-demos

Updated: 2026-09-06

## Objetivo

Substituir progressivamente os crossfades de screenshots da Landing V5 por loops reais do BrewControl em funcionamento, sem transformar a Home em tutorial e sem prejudicar Core Web Vitals.

## Regra editorial

Cada vídeo deve mostrar **uma ação operacional clara**. O visitante precisa entender o valor em poucos segundos mesmo sem áudio.

- duração alvo: 6–10 s;
- sem narração obrigatória;
- sem abertura ou encerramento;
- cursor deliberado e lento;
- evitar menus desnecessários;
- zoom apenas quando ajuda a leitura;
- loop visualmente suave;
- nenhuma informação sensível de tenant, cliente, telefone, e-mail ou valor real não autorizado;
- usar dados de demonstração coerentes com cervejaria;
- exportar WebM + MP4;
- manter poster estático real;
- autoplay apenas `muted` + `playsinline`;
- vídeo pausa fora da viewport;
- `prefers-reduced-motion` mantém poster/crossfade, sem autoplay.

## 01 — Produção

**Arquivos**

- `media/demos/production.webm`
- `media/demos/production.mp4`
- poster: `screenshots/producao.png`

**Duração alvo:** 8 s

**História:** um lote avança de planejamento/Brew Day para acompanhamento de produção.

**Roteiro sugerido**

1. entrar no lote/produção;
2. destacar rapidamente a etapa atual;
3. registrar ou avançar uma etapa operacional real;
4. mostrar a interface refletindo a mudança;
5. terminar em enquadramento próximo ao inicial para facilitar o loop.

**Mensagem que o visitante deve entender:** “o chão de fábrica acompanha o lote dentro do mesmo sistema.”

## 02 — Ativos & Barris

**Arquivos**

- `media/demos/assets.webm`
- `media/demos/assets.mp4`
- poster: `screenshots/ativos-barris.png`

**Duração alvo:** 7 s

**História:** localizar um barril/ativo e mostrar seu status/contexto operacional.

**Roteiro sugerido**

1. abrir a lista ou busca de ativos;
2. localizar um barril;
3. abrir detalhe/status/histórico;
4. mostrar informação de localização ou estado;
5. retornar ao enquadramento inicial.

**Mensagem:** “cada barril continua tendo história e contexto.”

## 03 — Comercial + Logística

**Arquivos**

- `media/demos/commercial-logistics.webm`
- `media/demos/commercial-logistics.mp4`
- poster: `screenshots/comercial.png`

**Duração alvo:** 8 s

**História:** um pedido comercial aparece no fluxo que seguirá para entrega.

**Roteiro sugerido**

1. mostrar pedido/lista comercial;
2. abrir um pedido de demonstração;
3. evidenciar status/destino/entrega;
4. transicionar para contexto logístico relacionado quando possível;
5. fechar com a conexão venda → entrega evidente.

**Mensagem:** “o pedido não termina quando é salvo.”

## 04 — Brewpub + Financeiro

**Arquivos**

- `media/demos/brewpub-finance.webm`
- `media/demos/brewpub-finance.mp4`
- poster: `screenshots/brewpub.png`

**Duração alvo:** 8 s

**História:** uma venda/comanda do brewpub concluída e seu reflexo operacional/financeiro.

**Roteiro sugerido**

1. abrir venda rápida/comanda;
2. incluir item ou concluir ação curta;
3. mostrar fechamento da venda;
4. mostrar resultado/caixa/financeiro relacionado se a navegação real permitir sem artificialidade;
5. encerrar em estado limpo.

**Mensagem:** “o brewpub faz parte da mesma operação da fábrica e da gestão.”

## Captura

Preferência de captura:

- desktop em 1440×900 ou 1600×1000;
- navegador sem barra de favoritos e sem notificações;
- zoom do navegador em 100%;
- tenant de demonstração;
- dados visualmente plausíveis, mas não reais/sensíveis;
- gravar 30 fps; 60 fps não é necessário para esses loops;
- capturar alguns segundos extras antes/depois e cortar depois.

## Compressão

Meta por loop:

- WebM: idealmente <= 1.5 MB;
- MP4: idealmente <= 2 MB;
- sem áudio;
- resolução final suficiente para o container, sem exportar 4K;
- testar legibilidade do texto depois da compressão.

## Publicação progressiva

A Landing V5 usa `media/demos/manifest.json`.

Enquanto `available` estiver `false`, a página mantém os screenshots/crossfades atuais. Quando os dois arquivos de vídeo estiverem presentes e validados:

1. adicionar WebM e MP4;
2. alterar `available` para `true` naquele demo;
3. validar Preview desktop e mobile;
4. confirmar que autoplay funciona apenas sem áudio;
5. confirmar pause fora da viewport;
6. somente então adicionar `VideoObject` estruturado à página canônica correspondente.

## Ordem de produção

1. Produção;
2. Ativos & Barris;
3. Comercial + Logística;
4. Brewpub + Financeiro.

Essa ordem acompanha a narrativa principal da Landing e permite publicar os vídeos individualmente, sem esperar os quatro ficarem prontos.
