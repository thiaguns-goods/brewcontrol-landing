# Design

## Status

A Home está em redesign V3 na branch `landing-v3-preview`. As páginas satélite de módulo permanecem na linguagem V2 até uma migração específica; não devem ser alteradas por efeito colateral desta Home.

## Direction — Living Brewery

A Home V3 é **product-led, industrial e cinematográfica**. O visitante deve perceber primeiro o BrewControl real operando e só depois ler a explicação. A estética continua escura, metálica, técnica e confiante, mas reduz decoração que compete com o produto.

A pergunta de cada seção é: **isso ajuda a mostrar a cervejaria funcionando?** Motion, profundidade e HUDs só entram quando reforçam produto, fluxo ou integração.

## Product as Hero

Na Home V3, a interface real do BrewControl é a principal evidência visual. Screenshots e, progressivamente, loops curtos de vídeo do sistema substituem a antiga dependência da ilustração "Planta 01" no hero.

- Nunca inventar dashboards, números ou funcionalidades para marketing.
- Preferir captura do produto real a mockup redesenhado.
- Vídeos de módulo devem ser curtos, silenciosos, em loop e demonstrar uma ação completa.
- Enquanto o vídeo real não estiver disponível, usar transições controladas entre screenshots reais como fallback.
- `Planta 01` continua válida nas páginas V2 de módulo existentes, mas não é requisito da Home V3.

## Narrative

A Home não apresenta módulos como nove produtos independentes. Ela conta uma operação conectada:

1. Produção — receita, lote, Brew Day e tanque.
2. Estoque + Ativos — insumos, envase e barris.
3. Comercial + Logística — pedido, separação e entrega.
4. Brewpub + Financeiro — venda, operação de bar e visão gerencial.

Depois dessa história, a seção "Uma ação. Toda a operação reage." explica integração como comportamento do sistema, não como lista de integrações.

## Color

Paleta escura com um único acento quente.

| Papel | Valor V3 |
|---|---|
| Fundo | `#050507` |
| Superfície | `#0D0D12` / `#121219` |
| Texto principal | `#F5F2ED` |
| Texto secundário | `#AAA5A0` |
| Cobre | `#D78646` |
| Cobre claro | `#F1B06F` |
| Status positivo | `#61D28A` — somente telemetria/estado |

Cobre é a cor de identidade. Verde/vermelho são cores semânticas de status, nunca acentos decorativos.

## Typography

- Display: Cabinet Grotesk, 700–900.
- Corpo: Satoshi, 400–700.
- Telemetria/HUD: JetBrains Mono.
- Títulos usam escala fluida com `clamp()` e tracking negativo controlado.
- Labels técnicos são pequenos, mono e uppercase; não usar mono para texto corrido.

## Layout

- Largura máxima: 1240px.
- Hero dividido entre tese e produto real.
- Seções longas alternam copy e mídia para criar ritmo editorial.
- Cards só quando representam uma unidade real de decisão ou navegação.
- Espaço vazio é parte da hierarquia; evitar paredes de features.
- Mobile reorganiza a narrativa em coluna única sem remover conteúdo essencial.

## Motion

Motion deve explicar, não distrair.

- Hero: tilt leve apenas em dispositivos com ponteiro fino.
- Produto: zoom lento e brilho discreto.
- Story: crossfade entre telas reais como fallback de vídeo.
- Scroll reveal: uma entrada simples por bloco, sem cascatas excessivas.
- Toda animação respeita `prefers-reduced-motion`.
- Quando loops reais forem adicionados, usar `autoplay muted loop playsinline`, poster estático e carregamento preguiçoso quando possível.

## Video Capture Standard

Objetivo futuro da V3: trocar os fallbacks por loops reais do app.

- 6–10 segundos por loop.
- Uma ação principal por vídeo.
- Sem narração e sem áudio obrigatório.
- Cursor deliberado; sem movimentos de procura.
- Preferir 16:10 ou 16:9 e enquadramento consistente.
- Exportar WebM + MP4 de fallback.
- Não expor dados sensíveis de clientes ou tenants.
- Produção, Ativos/Barris, Comercial/Logística e Brewpub/Financeiro são os quatro primeiros loops prioritários.

## Accessibility

- Contraste mínimo WCAG AA para texto.
- Navegação por teclado preservada.
- Menu mobile expõe `aria-expanded`.
- Imagens de produto têm `alt` descritivo.
- `prefers-reduced-motion` desativa animações não essenciais.

## Anti-patterns

- Não retornar ao grid massivo de feature cards na Home.
- Não colocar painel de tweaks/dev em produção.
- Não criar gradientes roxo/azul ou estética SaaS genérica.
- Não usar stock photography.
- Não inventar métricas de uptime, volume, clientes ou eficiência.
- Não falsificar vídeo do produto com uma animação que pareça interação real.
- Não remover links legais, contato, analytics ou SEO durante refinamentos visuais.
