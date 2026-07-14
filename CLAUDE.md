# CLAUDE.md — Landing Page BrewControl

> Arquivo de memória para Claude/Cowork. Leia isto COMPLETO antes de qualquer tarefa nesta pasta.
> Projeto: Landing page pública do BrewControl (marketing) — **não confundir com o app "studio"**, que é outro repositório/projeto.
> Dono: Thiago Santana Schneider — não é programador. Explicação em linguagem simples, sem jargão técnico desnecessário. Ele aprova mudanças de conteúdo antes da execução.

---

## 🌐 O que é este projeto

Site institucional/marketing do BrewControl, publicado em **brewcontrol.app.br** e **www.brewcontrol.app.br**. É o site que atrai e converte cervejarias — não tem nenhuma lógica de negócio do ERP em si (isso vive no app real, em `app.brewcontrol.app.br`, outro repositório).

---

## ⚙️ Stack técnica (importante: NÃO é React/Next)

| Camada | Tecnologia |
|---|---|
| Estrutura | HTML estático puro — **sem build step, sem framework, sem package.json** |
| Estilo | CSS puro em `landing-v2.css` (variáveis CSS, sem Tailwind/Sass) |
| Comportamento | JS vanilla em `landing-v2.js`, mais scripts inline por página |
| Hospedagem | Vercel, projeto `brewcontrol-landing` (team `thiaguns-goods-projects`) |
| Repositório | GitHub `thiaguns-goods/brewcontrol-landing`, branch `main` |
| Deploy | Automático a cada push na `main` (git integration da Vercel) |

**Nunca introduzir React, Next.js, Vue ou qualquer bundler aqui** sem alinhar antes com o Thiago — seria uma migração grande, não uma tarefa pontual.

---

## 📁 Estrutura de arquivos

```
index.html                  ← Home (hub) — hero, módulos, novidades, Cervejaria Fundadora, planos, fundador, contato
guia.html                   ← Guia do usuário (documentação, seções numeradas 1-17)
modulo-producao.html        ← Página de módulo APROVADA — molde de referência para as próximas
blog/
  index.html                 ← Listagem do blog
  planilha-vs-sistema-cervejaria.html
  controle-estoque-cervejaria.html
  tour-modulos-brewcontrol.html
landing-v2.css              ← Design system + todos os componentes (site inteiro usa este arquivo)
landing-v2.js                ← Reveal on scroll, contadores, bolhas/grãos animados, tabs de demo, waitlist, painel de tweaks
main.js / waitlist.js        ← Scripts legados (v1), pouco usados na v2
robots.txt / sitemap.xml    ← SEO técnico — TODA página nova precisa entrar no sitemap.xml
screenshots/                 ← Prints reais do sistema, usados em toda parte (site + blog + páginas de módulo)
```

---

## 🚦 Deploy — leia antes de tentar publicar

1. **Este ambiente (Cowork) normalmente NÃO consegue dar `git push` sozinho aqui.** Historicamente o repositório teve arquivos de lock presos (`.git/index.lock`, `.git/ORIG_HEAD.lock`) que o sandbox não consegue apagar (erro "Operation not permitted" — permissão do mount Windows→Linux). Não insista tentando `git commit`/`git push` direto por várias tentativas; se a primeira tentativa falhar por lock, assuma que precisa da máquina real do Thiago.
2. **A ferramenta `deploy_to_vercel` (MCP da Vercel) não publica nada sozinha** — ela só devolve instrução de rodar `vercel deploy` ou fazer push. Não há `vercel` CLI nem token no sandbox. Não prometer "deploy feito" com base nessa tool.
3. **Fluxo que funciona de verdade:** editar os arquivos aqui normalmente (Edit/Write funcionam sem problema, é só o Git que trava) → ao final da sessão, gerar um **prompt para o Antigravity** (ambiente do Thiago com Git configurado de verdade) ou os comandos `git add -A && git commit -m "..." && git push origin main` para ele rodar. Marcar claramente como passo manual dele.
4. Depois do push, a Vercel publica sozinha em ~1 min. Verificar em `brewcontrol.app.br`.
5. Toda página nova (módulo, artigo de blog) **precisa ser adicionada ao `sitemap.xml`**.

---

## 🎨 Design system (não trocar sem alinhar)

- **Paleta**: `--ink-000..600` (fundo escuro), `--fog-100..600` (texto), `--copper-50..600` (cor de destaque único — cobre), `--amber-400/500` (herdado da marca do app). Ver `:root` no topo de `landing-v2.css`.
- **Tipografia**: `--f-display` (Cabinet Grotesk, títulos), `--f-body` (Satoshi, texto), `--f-mono` (JetBrains Mono, dados técnicos/HUD).
- **Espaçamento**: `--s-1` a `--s-32` (não usar valores px soltos onde já existe variável).
- **Largo de conteúdo**: `--w-narrow` (680px, usado no blog/artigos), `--w-default` (1080px), `--w-wide` (1280px).
- Filosofia visual: "industrial cinematográfico" — escuro, metálico, um único acento de cor (cobre), sem gradiente arco-íris, sem excesso de cor.

### Peça central da marca — cena "Planta 01" (⚠️ regra mudou em Jul/2026 — leia com atenção)
O hero da Home tem uma **ilustração SVG animada de uma mini fábrica** (`.hero-canvas`): tanques com vapor, bolhas de fermentação, ponteiro de pressão, engrenagens girando, jato de cerveja enchendo um copo, mais um card flutuante (`.hero-app-float`) simulando a tela real do app. **Isso é aprovado e é EXCLUSIVO da Home — não deve ser substituído por print estático, mas também não deve ser copiado/reaproveitado nas páginas de módulo.**

**Cada página de módulo tem sua PRÓPRIA cena, sob medida pra função daquele módulo** — mesma linguagem visual (SVG animado, paleta escura + cobre, `.hero-canvas`/`.hud-bar`/`.hero-app-float`/`.hud-footer` como "moldura"), mas o conteúdo da cena é específico. Conceitos já definidos e aprovados pelo Thiago:

| Módulo | Cena do hero | Status |
|---|---|---|
| Produção | "Mostura 01" — panela de mostura em close, pá girando, vapor, janela mostrando o mosto, e uma linha do tempo horizontal do Brew Day (Mostura → Fervura → Whirlpool → Transferência) com a etapa atual destacada | ✅ feito em `modulo-producao.html` |
| Almoxarifado | "Estoque 01" — prateleiras com 2 níveis (sacos entrando pela direita/ENTRADA, saindo pela esquerda/SAÍDA), balança com ponteiro oscilando, caixa com feixe de leitura de código de barras, painel de saldo em tempo real (JS, conta pra baixo e reabastece) | ✅ feito em `modulo-almoxarifado.html`, aprovado pelo Thiago |
| Comercial | "Esteira 01" — pedido (ícone de nota) andando por esteira em 3 estações (Pedido → Aprovado → Faturado), caixas empilhando ao final, etiqueta de preço trocando de valor por canal (Delivery/Distribuidor/Varejo) | ✅ feito em `modulo-comercial.html`, aprovado pelo Thiago |
| Logística | "Rota 01" — van seguindo uma rota pontilhada (`animateMotion`) por 3 paradas com pins, barril cheio saindo/vazio voltando na parada atual, GPS piscando, contador de KM rodado subindo (JS) | ✅ feito em `modulo-logistica.html`, aprovado pelo Thiago |
| Financeiro | "Fluxo 01" — balança entre "A PAGAR"/"A RECEBER" se equilibrando (rotate oscilante), moedas caindo num pote com nível subindo, barras de DRE ao fundo (mudas, atrás da balança), ponteiro de fluxo de caixa oscilando (`gauge-needle`) | ✅ feito em `modulo-financeiro.html`, aprovado pelo Thiago |
| Fiscal | "Fiscal 01" — documento em branco entra numa máquina de validação, carimbo desce, LED verde "SEFAZ" pisca, documento sai com QR code e "AUTORIZADA"; impressora térmica separada imprime cupom NFC-e crescendo | ✅ feito em `modulo-fiscal.html`, aprovado pelo Thiago |
| Ativos & Barris | "Ativos 01" — 3 barris fixos numa esteira circular (CHEIO copper no topo, EM CAMPO cinza à direita, RETORNADO verde à esquerda) com indicador de fluxo orbitando via `animateMotion`, feixe lendo a etiqueta do barril retornado, cilindro de CO₂ com nível preenchido + ponteiro de pressão (`gauge-needle`) | ✅ feito em `modulo-ativos.html`, aprovado pelo Thiago |
| Brewpub & Bar | "Brewpub 01" — torneira + jato + copo enchendo em destaque (versão ~1.6x maior do efeito da Home, mesma técnica `.stream`/clipPath), comanda voando da mesa pro KDS (`animateTransform` com arco), vapor de cozinha (`.steam`) ao fundo | ✅ feito em `modulo-brewpub.html`, aprovado pelo Thiago |
| PDV Mobile | "PDV 01" — tablet num pedestal com botão grande "+1 COPO", dedo tocando com ripple a cada ciclo, barril conectado por um tubo (`animateMotion` levando o pulso do débito) com nível de líquido caindo, resumo de sessão (copos + total) contando no rodapé | ✅ feito em `modulo-pdv-mobile.html`, aguardando revisão do Thiago |

Reaproveitar as animações CSS/keyframes já existentes em vez de duplicar: `.steam`, `.bubbles`, `.stream`, `.grains`, `@keyframes gauge-needle`, `@keyframes gear-rotate`. Cada cena nova só precisa desenhar os elementos SVG específicos e usar essas classes/keyframes prontas pra vapor, bolhas, líquido escorrendo, partículas e ponteiros.

### Bloco do fundador
Layout fixo: foto real (`screenshots/thiago-v2.jpg`) + texto ao lado, classes `founder-grid` / `founder-photo-wrap` / `founder-name-block` / `founder-story`. Mesma composição em toda página — só o texto de transição entre módulo e fundador pode variar.

### Sistema de animação ao rolar (Jul/2026)
- `.fade-up-item` — entrada simples (usado no blog).
- `.cine-reveal` (+ modificadores `.cine-left` / `.cine-right`) — entrada cinematográfica mais dramática (opacity + translateY/X + scale), usada nas páginas de módulo. Ativada via `IntersectionObserver` em script inline por página.
- `.reveal-mask` — efeito de máscara em título (`overflow:hidden` + `translateY` do `<span>` interno).
- `.mod-benefit-card .glow` — brilho seguindo o cursor (calculado via `mousemove` por card).
- `data-count` / `data-suffix` em elementos `.num` — contador que sobe até o valor quando entra na tela (lógica já em `landing-v2.js`, reaproveitar em vez de duplicar).
- `.sticky-cta-bar` — barra fixa de CTA que aparece depois de ~20% de rolagem.

---

## 🔒 Regras de conteúdo (não reverter)

- **Programa Cervejaria Fundadora** (`index.html#fundadora`): 5 vagas, acesso grátis por 6 meses, a cervejaria paga só custo de terceiro (IA/Gemini e emissão de nota via Focus NFe). Contrapartida: uso real + autorização para citar como case + divulgação nas redes da cervejaria.
- **Nunca escrever que "ainda não temos clientes"** — o texto atual e aprovado fala em "plataforma em desenvolvimento contínuo" como vantagem (dá pra moldar o sistema ao propósito de cada cervejaria). Isso foi corrigido a pedido explícito do Thiago em Jul/2026.
- Módulos e descrições devem bater com os já existentes em `index.html#modules` (ver lista abaixo) — não inventar funcionalidade que o sistema não tem.
- Contato oficial: WhatsApp `(27) 98184-8184` (wa.me/5527981848184), e-mail `thiaguns@gmail.com`.

---

## 🧩 Lista real de módulos (fonte da verdade: `index.html#modules`)

| Módulo | Página dedicada |
|---|---|
| Hub de Produção (featured) | `modulo-producao.html` ✅ pronta, aprovada (cena "Mostura 01") |
| Almoxarifado | `modulo-almoxarifado.html` ✅ pronta, aprovada (cena "Estoque 01") |
| Comercial | `modulo-comercial.html` ✅ pronta, aprovada (cena "Esteira 01") |
| Logística | `modulo-logistica.html` ✅ pronta, aprovada (cena "Rota 01") |
| Financeiro | `modulo-financeiro.html` ✅ pronta, aprovada (cena "Fluxo 01") |
| Fiscal | `modulo-fiscal.html` ✅ pronta, aprovada (cena "Fiscal 01") |
| Ativos & Barris | `modulo-ativos.html` ✅ pronta, aprovada (cena "Ativos 01") |
| Brewpub & Bar | `modulo-brewpub.html` ✅ pronta, aprovada (cena "Brewpub 01") |
| PDV Mobile | `modulo-pdv-mobile.html` ✅ pronta, aguardando revisão (cena "PDV 01") |

Ver tabela completa de conceitos de cena por módulo na seção "Peça central da marca" acima.

---

## 🗺️ Direção em andamento (Jul/2026) — arquitetura de páginas por módulo

Objetivo: sair de uma Home única e ir para um modelo hub + páginas satélite (uma por módulo), com mega menu no header linkando direto pra cada uma. `modulo-producao.html` é o molde aprovado de **anatomia** (hero com cena própria + benefícios em cards com glow + "como funciona" em 3 passos + números com count-up + cross-sell pro módulo relacionado + bloco do fundador + barra fixa de CTA) e de **nível de movimento** (motion pesado, não discreto) — mas a cena do hero NUNCA se repete entre páginas de módulo (ver tabela de conceitos acima). A única coisa idêntica em todas é a "moldura" (HUD bar, hud-footer, hero-app-float) e o bloco do fundador no final.

**Antes de replicar para todos os módulos de uma vez, revisar UM novo (ex: Almoxarifado) e confirmar com o Thiago.**

**Status:** as 9 páginas de módulo estão prontas (ver tabela acima). Mega menu no header já implementado (ver seção abaixo). Cards da Home (`#modules`) já viraram teaser: cada `.mod-card` é agora um `<a href="modulo-x.html">` (antes eram `<div>` sem link nenhum — clicar não fazia nada), com 1 frase curta + "Saiba mais →" (`.mod-more`) no lugar da lista completa de features (`.mod-list`, removida). Arquitetura "hub + páginas satélite" concluída.

### Mega menu "Módulos" (implementado Jul/2026)

O link simples `Módulos` do header virou um dropdown (`.nav-item.has-mega` → `.nav-mega-trigger` + `.mega-menu`) com grid 3x3 dos 9 módulos (ícone + nome + 1 linha, reaproveita os mesmos SVGs dos `mod-card` da Home) e um rodapé "Ver todos os módulos →" pro `#modules` da Home. CSS em `landing-v2.css` (busque `.mega-menu`), comportamento (abre no hover via CSS + toggle por clique/teclado, fecha ao clicar fora ou Esc) em `landing-v2.js` (`.nav-item.has-mega`). Presente nas 14 páginas com header compartilhado: `index.html`, as 9 `modulo-*.html` e as 4 páginas de `blog/*.html` — **`guia.html` não tem** (é standalone, com CSS inline próprio, fora do design system v2).

⚠️ **Armadilha já resolvida, não reintroduzir:** o `.mega-menu` precisa de `left: 0` (ancorado à esquerda do botão-gatilho), nunca `left: 50%; transform: translateX(-50%)` — como "Módulos" é o primeiro item do nav, centralizar o menu nele faz a primeira coluna estourar pra fora da viewport à esquerda (ficava invisível, sem erro nenhum no console). Ao adicionar novo item de mega menu no header, ancorar sempre pela esquerda.

Toda página nova (módulo ou blog) que reutilizar o header **precisa incluir o mesmo bloco `.nav-item.has-mega`** (copiar de qualquer `modulo-*.html` existente, ajustando o prefixo dos `href` — vazio se for arquivo na raiz, `../` se for dentro de `blog/`).

---

## 📞 Referência rápida

- Site: https://brewcontrol.app.br
- App real (outro projeto): https://app.brewcontrol.app.br
- Repositório: github.com/thiaguns-goods/brewcontrol-landing (público)
- Vercel: projeto `brewcontrol-landing`, team `thiaguns-goods-projects`
- Guia do usuário publicado: `guia.html` (conteúdo é sobre o app, não sobre o site)

---

*Atualize este arquivo quando a arquitetura de páginas mudar, novos módulos forem publicados, ou decisões de conteúdo/design forem revertidas ou confirmadas.*
