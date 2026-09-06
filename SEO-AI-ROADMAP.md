# BrewControl — Search & AI Discoverability Roadmap

Updated: 2026-09-06

## Goal

Make BrewControl easy to discover, understand, verify, and cite across traditional search engines and AI-assisted search experiences, without relying on unsupported AEO/GEO hacks.

## Implemented in Landing V5

- canonical URL on Home;
- search-oriented title and meta description;
- `robots` and `googlebot` directives allowing large previews and snippets;
- explicit `robots.txt` allowances for OAI-SearchBot, ChatGPT-User, GPTBot, Googlebot, Bingbot and other crawlers;
- refreshed XML sitemap;
- Schema.org JSON-LD `@graph` with Organization, Person, WebSite, WebPage, SoftwareApplication and FAQPage entities;
- public pricing represented as Offer entities;
- Open Graph and Twitter metadata;
- SVG favicon;
- semantic, visible definition of what BrewControl is and who it is for;
- direct-answer section for common product questions;
- crawlable HTML links to all public module pages;
- descriptive image alt text;
- hero image preload and font preconnects;
- `llms.txt` as optional compatibility metadata for systems that choose to consume it;
- public IndexNow key file prepared for future notification workflow;
- mobile-first semantic navigation;
- `prefers-reduced-motion` support;
- documented rule that product truth in HTML must match visual/media claims;
- expensive scroll-linked parallax removed from V5;
- continuous hero animation paused offscreen;
- below-the-fold sections use rendering containment/content visibility where appropriate;
- progressive real-video runtime prepared through `media/demos/manifest.json`;
- screenshots remain the authoritative fallback until a real demo is explicitly enabled;
- real videos are designed to pause outside the viewport and load only after the page is idle.

## Activation required after production merge

### Google Search Console

1. Verify `brewcontrol.app.br` as a domain property, preferably via DNS.
2. Submit `https://brewcontrol.app.br/sitemap.xml`.
3. Inspect Home and every module page.
4. Request indexing after major releases where appropriate.
5. Monitor Core Web Vitals, indexing, rich-result eligibility and Generative AI performance reports.

### Bing Webmaster Tools

1. Verify `brewcontrol.app.br`.
2. Submit the sitemap.
3. Enable / confirm IndexNow.
4. Monitor Site Explorer, Index Coverage and AI Performance.
5. Review grounding queries and pages cited in Copilot / AI answers.

### IndexNow

Public key file is prepared. After production release, configure a deployment or CI action to notify IndexNow when canonical HTML, sitemap, important media, or public product documentation changes.

Do not notify preview URLs; notify only canonical production URLs.

## High-impact content backlog

Create expert-led evergreen pages targeting actual brewery decisions, with real examples and product evidence where applicable:

- melhor sistema / ERP para cervejaria artesanal;
- sistema de controle de produção de cerveja;
- controle de barris e chopeiras;
- gestão de estoque de insumos para cervejaria;
- como substituir planilhas em uma cervejaria;
- software para brewpub e bar com produção própria;
- gestão de cervejaria cigana;
- rastreabilidade de lotes de cerveja;
- gestão comercial e logística de chope;
- custos e CMV em cervejarias;
- comparação entre BrewControl e processos manuais / planilhas, usando critérios factuais e verificáveis.

Each page should answer a distinct intent, link naturally to the relevant module, include original domain expertise, and avoid mass-produced keyword pages.

## Media pipeline

Runtime infrastructure is ready. See `DEMO-CAPTURE-PLAN.md` and `media/demos/manifest.json`.

Capture real 6–10 second loops with WebM + MP4 + poster image, in this order:

1. Production;
2. Assets / kegs;
3. Commercial + logistics;
4. Brewpub + finance.

Each workflow can be released independently. Keep its manifest entry `available: false` until both encodes are present and the Preview is validated.

When a real video becomes publicly watchable on a canonical page, add `VideoObject` structured data with factual name, description, thumbnail/poster, upload date and content URL. Do not publish `VideoObject` for placeholder or unavailable media.

## Module-page backlog

The module pages already have useful product-specific copy and canonical URLs, but they still use the older Landing V2 visual system. Before production rollout, reconcile them with Landing V5 without erasing their domain-specific content.

Priorities:

1. fix navigation anchors so they point to current V5 Home sections;
2. align brand/header/CTA language with the V5 Home;
3. add consistent crawler directives and complete Open Graph/Twitter metadata;
4. add WebPage/BreadcrumbList/SoftwareApplication relationships where factually appropriate;
5. remove or verify quantitative claims that depend on a specific tenant/demo state;
6. reuse the V5 materials/colors/motion discipline rather than rebuilding nine unrelated pages;
7. keep each module page focused on a distinct search intent.

## Authority / entity consistency

Keep these facts consistent across the official website, social profiles, app stores, GitHub public metadata, press mentions, directory profiles, interviews, and partner pages:

- Brand: BrewControl
- Category: ERP / system for craft brewery management
- Market: Brazil / Portuguese-speaking brewery operations
- Website: https://brewcontrol.app.br/
- Founder: Thiago Schneider
- Core areas: production, inventory, assets/kegs, commercial, logistics, finance, fiscal, PDV, brewpub

Prioritize authentic editorial mentions, customer cases, partnerships, useful tools, and industry references. Do not buy or manufacture artificial mentions/backlinks.

## Performance targets

Measure production pages using field data when available. Prioritize:

- LCP under 2.5 s at the 75th percentile;
- INP under 200 ms at the 75th percentile;
- CLS under 0.1 at the 75th percentile;
- responsive image sizing and modern formats;
- minimal render-blocking third-party assets;
- no heavy animation that delays or destabilizes meaningful content.

## Measurement

Use:

- Google Search Console — Search + Generative AI performance;
- Bing Webmaster Tools — traditional search + AI Performance citations / grounding queries;
- GA4 — organic landing sessions and conversions;
- Vercel Web Analytics / Speed Insights if enabled;
- periodic manual tests in Google, Bing/Copilot and ChatGPT Search for representative queries.

No search engine or AI provider guarantees ranking, indexing, citation, or placement. The strategy is to maximize technical eligibility, factual clarity, freshness, usefulness, authority, and real-world evidence.
