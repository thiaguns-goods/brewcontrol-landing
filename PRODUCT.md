# Product

## Register

brand

## Users

Donos e mestres cervejeiros de cervejarias artesanais (bares, ciganos, produtores, brewpubs) avaliando ou adotando o BrewControl, um ERP feito especificamente para a operação de cerveja artesanal. Geralmente não são pessoas de TI — decidem sozinhos, sem departamento técnico, e chegam à página vindos de indicação, redes sociais ou busca. O trabalho a ser feito: entender rápido se o sistema cobre a operação deles (produção, estoque, comercial, financeiro, fiscal, ativos, bar/brewpub, PDV) e decidir se vale contatar via WhatsApp, entrar na waitlist ou se candidatar ao Programa Cervejaria Fundadora.

## Product Purpose

Atrair e converter cervejarias artesanais para o BrewControl — site institucional/marketing, sem lógica de negócio do ERP em si (isso vive no app real, outro repositório). Sucesso é medido em contatos via WhatsApp, cadastros na waitlist e candidaturas ao Programa Cervejaria Fundadora (5 vagas, 6 meses grátis). O site está migrando de uma Home única para um modelo hub + páginas satélite: uma página dedicada por módulo do sistema, cada uma com hero, benefícios, passo a passo, números e cross-sell para o módulo relacionado.

## Brand Personality

Industrial cinematográfico: escuro, metálico, técnico, confiante — a estética de uma sala de controle de fábrica de verdade, não de um SaaS genérico. Motion pesado e deliberado (parallax, reveals dramáticos ao rolar, glow reativo ao cursor), nunca discreto ou tímido. Um único acento de cor (cobre) contra fundo escuro — sem gradiente arco-íris, sem paleta multicolorida. A peça central da marca é uma ilustração SVG animada de uma mini fábrica ("Planta 01": tanques, vapor, bolhas de fermentação, ponteiro de pressão, engrenagens) que nunca deve virar captura de tela estática.

## Anti-references

- Landing pages de SaaS genérico com gradiente roxo/azul arco-íris e ilustrações fofas de personagem 3D.
- Paletas creme/pastel/bege "quentes por padrão" — não combina com a identidade industrial escura já aprovada.
- Foto de banco de imagens genérica de "empresário sorrindo" — o site usa prints reais do próprio sistema e foto real do fundador.
- Qualquer coisa que pareça template replicável — a cena "Planta 01" e o motion cinematográfico existem exatamente para evitar essa leitura.
- Inventar funcionalidade que o sistema não tem, ou reintroduzir textos já corrigidos (ex: "ainda não temos clientes" — versão atual fala em "plataforma em desenvolvimento contínuo").

## Design Principles

1. **A cena "Planta 01" nunca vira imagem estática** — toda página de módulo reaproveita/adapta a ilustração SVG animada e o card flutuante do app, nunca substitui por print.
2. **Motion é parte do produto, não decoração** — cinematográfico e deliberado (`.cine-reveal`, parallax, glow), na mesma intensidade em toda página nova.
3. **Conteúdo bate com o sistema real** — nomes, descrições e features de cada módulo vêm de `index.html#modules`, fonte da verdade; nunca inventar.
4. **Fala para o cervejeiro, não para o TI** — linguagem simples, sem jargão técnico desnecessário, mesmo descrevendo recursos técnicos (fiscal, custo médio ponderado, etc).
5. **Um acento só** — cobre como única cor de destaque sobre a paleta escura; disciplina de cor é parte da identidade, não limitação.

## Accessibility & Inclusion

Padrão razoável: contraste de texto em nível WCAG AA (corpo de texto ≥4.5:1, texto grande ≥3:1) e toda animação com alternativa via `@media (prefers-reduced-motion: reduce)`. Sem requisitos de acessibilidade adicionais documentados além disso.
