# Design

## Landing V5 — direção visual canônica

A Home do BrewControl deve parecer **uma cervejaria em movimento transformada em software**. A referência não é um SaaS genérico claro ou escuro: é aço, vapor, cerveja, pressão, fluxo, entrega, velocidade e dados convivendo na mesma cena.

### Princípio central

O produto real continua sendo o protagonista, mas agora vive dentro de um **ambiente cenográfico industrial**. O visitante precisa sentir o universo da cervejaria antes mesmo de ler todos os detalhes e, ao mesmo tempo, entender claramente que o BrewControl é um ERP / sistema de gestão específico para cervejarias artesanais.

A página não deve depender de uma divisão extrema entre preto e branco. As superfícies devem fluir entre:

- grafite profundo;
- azul-petróleo / teal esfumaçado;
- cobre e âmbar;
- aço escovado;
- creme quente / malte;
- tons orgânicos de cerveja e espuma.

## Hero — fábrica viva

O Hero representa a cervejaria operando.

Elementos permitidos e desejados:
- silhuetas abstratas de tanques;
- tubulações e aço;
- vapor / steam;
- bolhas de fermentação / carbonatação;
- linhas de fluxo e velocidade;
- cerveja âmbar e espuma como matéria visual;
- reflexos de cobre e luz industrial;
- profundidade e glassmorphism controlado;
- interface real do BrewControl em primeiro plano;
- cards flutuantes mostrando módulos reais.

Esses elementos devem apoiar o produto, nunca virar cenário de videogame ou cyberpunk.

## Ritmo de superfícies

1. **Hero — fábrica cinematográfica**: azul-petróleo, grafite, aço, cobre, vapor e cerveja.
2. **Plataforma — malte / aço claro**: creme quente + steel + teal suave, com textura e espuma abstrata.
3. **Fluxo operacional — teal / cobre escuro**: sensação de energia, pressão e movimento entre áreas.
4. **Product Story — aço / malte claro**: telas reais em frames escuros com fundos orgânicos e profundidade.
5. **Módulos — deep teal / umber**: cards translúcidos e colorização estratégica, sem parede preta uniforme.
6. **Fundador — malte / steel**: superfície humana e editorial.
7. **Planos — teal / cobre escuro**: comercial, premium e com brilho âmbar controlado.
8. **Respostas — creme / teal claro**: alta legibilidade e conteúdo citável.
9. **CTA final — fábrica noturna**: encerra com energia e não com branco puro.

## Paleta

- Night: `#071116`
- Night secondary: `#0b1d22`
- Deep teal: `#10272a`
- Teal: `#4aa4a1`
- Teal soft: `#8cc5bd`
- Copper: `#b9652e`
- Amber: `#f0a844`
- Amber light: `#ffc66b`
- Cream / malt: `#f1e6d5`
- Cream secondary: `#e6d8c4`
- Steel: `#c6cfca`
- Dark ink: `#171817`

Âmbar/cobre representam cerveja, calor, energia e marca. Teal representa tecnologia, aço e ambiente operacional. Verde permanece reservado a status operacional.

## Tipografia

- Display: Cabinet Grotesk
- Corpo: Satoshi
- Dados / HUD: JetBrains Mono
- Títulos usam escala fluida com `clamp()`.
- Headings permanecem semanticamente corretos e legíveis sem decoração.

## Produto real como mídia

Screenshots e futuros mini vídeos devem mostrar o BrewControl real.

Prioridade de loops:
1. Produção
2. Ativos / Barris
3. Comercial + Logística
4. Brewpub + Financeiro

Padrão dos loops:
- 6–10 segundos;
- uma ação principal por vídeo;
- sem áudio obrigatório;
- cursor deliberado;
- WebM + MP4;
- poster estático real;
- nenhum dado sensível de tenant;
- `prefers-reduced-motion` obrigatório.

Até os vídeos existirem, o fallback é crossfade de screenshots reais — nunca mockup fictício apresentado como funcionalidade real.

## Atmosfera e motion

Motion representa processos físicos da cervejaria:
- vapor sobe lentamente;
- bolhas sobem como fermentação / carbonatação;
- linhas fluem como pressão, gás, rota e dados;
- reflexos atravessam o frame do produto;
- cards ganham profundidade leve com ponteiro;
- seções entram com reveals curtos;
- parallax é discreto e limitado a elementos decorativos.

Não usar partículas aleatórias sem significado.

## Search / AI readability

A riqueza visual nunca pode esconder a verdade do produto.

- definição do BrewControl em HTML visível;
- links principais como `<a>` reais;
- ações semanticamente corretas;
- imagens com `alt` factual;
- headings com hierarquia real;
- conteúdo essencial fora de canvas, SVG decorativo e imagens;
- JSON-LD e metadados devem refletir apenas funcionalidades e ofertas verdadeiras;
- layout estável para leitores de tela e agentes de navegador.

## Performance

A atmosfera visual deve ser construída prioritariamente com CSS e assets já existentes.

- sem biblioteca pesada de animação se CSS/JS nativo resolver;
- evitar vídeos no Hero antes de ter poster e formatos otimizados;
- pausar/evitar efeitos desnecessários fora da viewport;
- respeitar `prefers-reduced-motion`;
- não sacrificar Core Web Vitals para efeitos decorativos.

## Anti-padrões

- preto puro por páginas inteiras;
- branco puro como única alternativa;
- alternância binária preto/branco;
- estética cyberpunk/neon;
- gradiente arco-íris;
- glows sem hierarquia;
- mockups de SaaS genéricos;
- efeitos de partículas sem relação com cervejaria;
- números de clientes, volume ou uptime sem evidência real;
- logos de clientes não autorizados;
- texto importante dentro de imagens;
- animações que prejudiquem leitura, acessibilidade ou performance.
