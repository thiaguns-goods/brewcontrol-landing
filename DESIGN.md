# Design

## Landing V4 — direção visual canônica

A Home do BrewControl usa uma linguagem **industrial editorial**, não uma tela escura contínua.

### Princípio central

O produto real é o protagonista. O visitante deve entender rapidamente que o BrewControl é um ERP / sistema de gestão específico para cervejarias artesanais e, em seguida, ver a operação conectada acontecendo por meio de interfaces reais.

### Ritmo de superfícies

A Home alterna deliberadamente entre superfícies escuras e claras:

1. **Hero — carvão escuro + cobre**: impacto, identidade e interface real do sistema.
2. **Definição do produto — papel/aço claro**: máxima legibilidade e resposta direta para humanos, mecanismos de busca e agentes.
3. **Product Story — claro**: screenshots reais, narrativa operacional e leitura longa confortável.
4. **Integração — escuro**: momento técnico de contraste, mostrando como uma ação repercute na operação.
5. **Módulos — aço claro**: catálogo leve e navegável, sem efeito de parede de cards pretos.
6. **Fundador — claro quente**: prova humana e autoridade de domínio.
7. **Planos — escuro**: bloco comercial com contraste forte.
8. **Respostas diretas + CTA — claro/quente**: fechamento legível, citável e orientado à ação.

A página nunca deve virar um light mode genérico, nem voltar a ser um túnel preto contínuo. O contraste entre zonas é parte da identidade.

## Paleta

- Carvão principal: `#0b0c0f`
- Carvão secundário: `#111318`
- Papel quente: `#f0ece6`
- Papel claro: `#f7f3ed`
- Aço claro: `#e5e0d8`
- Texto escuro: `#171616`
- Texto claro: `#f6f2ed`
- Cobre principal: `#c9793c`
- Cobre claro: `#e5a05f`

Cobre continua sendo o único acento de marca dominante. Verde é reservado a status operacional pontual.

## Tipografia

- Display: Cabinet Grotesk
- Corpo: Satoshi
- Dados / HUD: JetBrains Mono
- Títulos usam escala fluida com `clamp()`.
- Headings precisam permanecer semanticamente estruturados (`h1`, `h2`, `h3`) e legíveis fora do contexto visual.

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
- nunca expor dados sensíveis de tenant;
- respeitar `prefers-reduced-motion`.

## Search / AI readability

Design e conteúdo não podem depender de elementos puramente visuais para comunicar o produto.

- O que é o BrewControl deve existir como texto HTML visível.
- Links principais devem ser `<a>` reais.
- Ações devem usar `<button>` ou `<a>` semanticamente adequados.
- Imagens devem ter `alt` factual.
- Headings devem representar a hierarquia real da página.
- Conteúdo essencial não pode ficar escondido apenas em animações, canvas ou imagens.
- Layout deve ser estável para leitores de tela e agentes de navegador.

## Motion

Motion continua sendo parte da identidade, mas é subordinado ao produto:

- reveals leves;
- parallax discreto no frame principal;
- crossfade de screenshots como fallback temporário;
- nenhuma animação deve impedir leitura ou interação;
- `prefers-reduced-motion` é obrigatório.

## Anti-padrões

- página inteira preta sem zonas de descanso;
- estética cyberpunk/neon;
- gradientes multicoloridos;
- excesso de glow;
- mockups genéricos de SaaS;
- texto importante preso dentro de SVG/canvas/imagem;
- grids intermináveis de cards escuros;
- inventar funcionalidades;
- efeitos que prejudiquem Core Web Vitals, acessibilidade ou rastreabilidade.
