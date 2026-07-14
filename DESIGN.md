# Design

## Theme

Industrial cinematográfico — escuro por padrão, metálico, um único acento de cor (cobre). Não é dark mode "por segurança": é a estética deliberada de uma sala de controle de fábrica. Nunca migrar para claro ou para paleta multicolorida.

## Color

Tudo em `landing-v2.css` `:root`. OKLCH para a rampa de cobre e status; hex para a base neutra (já fixada, não reconverter).

| Papel | Token | Valor |
|---|---|---|
| Fundo mais escuro | `--ink-000` | `#050508` |
| Fundo de seção / card | `--ink-050` a `--ink-100` | `#0A0A10` / `#0E0E16` |
| Bordas / divisores sutis | `--ink-300`..`--ink-600` | `#1A1A26`..`#3C3C50` |
| Texto principal | `--fog-100` | `#E8E8EE` |
| Texto secundário | `--fog-200` | `#C9C9D4` |
| Texto apagado / legendas | `--fog-400` | `#8A8A9A` |
| Texto muito apagado | `--fog-600` | `#5A5A6A` |
| Acento único (cobre) | `--copper-50`..`--copper-600` | `oklch(0.92 0.04 55)` .. `oklch(0.50 0.14 48)` |
| Glow do acento | `--copper-glow` | `oklch(0.68 0.14 55 / 0.35)` |
| Âmbar (ponte com o app, uso pontual) | `--amber-400/500` | `#FBBF24` / `#F59E0B` |
| Status ok/warn/hot/cool | `--status-*` | oklch, uso restrito a HUD/telemetria |

Regra dura: **um acento só** (cobre). Âmbar é herdado da marca do app e usado com moderação (ex: LED de gauge). Nunca introduzir uma segunda cor de destaque, gradiente arco-íris ou paleta pastel/creme.

Superfícies metálicas via gradients reutilizáveis: `--metal-brushed`, `--metal-brushed-soft`, `--metal-light`. Glow volumétrico via `--vol-copper` / `--vol-amber` (radial-gradient).

## Typography

- Display / títulos: `--f-display` = Cabinet Grotesk (carregada via Fontshare), peso 700-900, `letter-spacing: -0.02em`.
- Corpo: `--f-body` = Satoshi, peso 400-700.
- Dados técnicos / HUD / mono: `--f-mono` = JetBrains Mono.
- Escala fluida via `clamp()`: `--text-xs` (0.72-0.82rem) até `--text-3xl` (2.8-6.6rem) — nunca usar `px` fixo para tamanho de fonte em título.
- `.accent` (itálico + cobre) marca a palavra-chave dentro de um título — usado com moderação, uma vez por título.

## Spacing & Layout

- Escala de espaçamento: `--s-1` (0.25rem) até `--s-32` (8rem). Não usar valores px soltos onde já existe variável.
- Larguras de conteúdo: `--w-narrow` 680px (blog/artigos), `--w-default` 1080px, `--w-wide` 1280px (grid principal, classe `.wrap`).
- Raios: `--r-sm` 6px, `--r-md` 10px, `--r-lg` 16px, `--r-xl` 22px.
- Grid é o padrão para seções 2D (hero, benefícios, steps, stats); flexbox para barras 1D (header, footer, HUD).

## Motion

- Easing padrão: `--ease: cubic-bezier(0.2, 0.8, 0.2, 1)` (ease-out). Durações: `--dur-1` 180ms (micro), `--dur-2` 380ms (padrão), `--dur-3` 700ms (dramático).
- `--fx-intensity` controla intensidade global via painel de tweaks — não hardcodar valores que ignorem essa variável em novas animações.
- **`.cine-reveal`** (+ `.cine-left` / `.cine-right`): entrada cinematográfica — opacity + translateY/X + scale, ativada via `IntersectionObserver` (`threshold: 0.2`) em script inline por página. É o padrão de reveal das páginas de módulo (mais dramático que `.fade-up-item`, que é o reveal simples usado no blog).
- **`.reveal-mask`**: título com máscara (`overflow:hidden` no contêiner + `translateY` no `<span>` interno).
- **`.mod-benefit-card .glow`**: brilho seguindo o cursor, calculado via `mousemove` por card.
- **`data-count` / `data-suffix`** em `.num`: contador que sobe ao entrar na tela — lógica centralizada em `landing-v2.js`, nunca duplicar.
- **`.sticky-cta-bar`**: barra fixa de CTA que sobe após ~20% de rolagem da página.
- Toda animação precisa de alternativa em `@media (prefers-reduced-motion: reduce)`.
- Reveals nunca escondem conteúdo por padrão sem fallback visível — motion melhora um estado já visível, não substitui o carregamento do conteúdo.

## Components

- **`.hero-canvas` / "Planta 01"**: ilustração SVG animada de mini fábrica (tanques, vapor, bolhas de fermentação, ponteiro de pressão, engrenagens girando, jato enchendo copo) + `.hero-app-float` (card flutuante simulando a tela real do app, com mouse-parallax leve via `rotateY/rotateX`). Peça central da marca — **nunca substituir por print estático**; adaptar a cena (elementos, HUD, labels) ao tema de cada módulo mantendo a mesma anatomia técnica.
- **`.mod-hero` / `.mod-benefit-card` / `.mod-steps` / `.mod-stat` / `.mod-crosssell`**: anatomia padrão de página de módulo (ver `modulo-producao.html`, molde aprovado): hero com Planta 01 → benefícios em cards com glow → "como funciona" em 3 passos → números com count-up → cross-sell pro módulo relacionado → bloco do fundador → `.sticky-cta-bar`.
- **Bloco do fundador**: `founder-grid` / `founder-photo-wrap` (foto real `screenshots/thiago-v2.jpg`) / `founder-name-block` / `founder-story`. Composição fixa em toda página; só o texto de transição entre módulo e fundador muda.
- **`.section-label` / `.section-title` / `.section-sub`**: cabeçalho de seção padrão (label mono uppercase + título display + subtítulo).
- Cards são aceitos aqui (`.mod-benefit-card`, `.mod-step`) mas sempre com propósito visual (glow, numeração) — não empilhar cards genéricos sem função.

## Anti-patterns (specific to this project)

- Não introduzir Tailwind, Sass, ou qualquer pré-processador — só CSS puro com variáveis nativas.
- Não usar `px` fixo em títulos onde há `--text-*` com `clamp()`.
- Não criar uma segunda cor de acento nem gradiente multicolorido.
- Não trocar a cena SVG animada por captura de tela do app.
