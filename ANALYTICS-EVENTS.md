# Landing V5 — GA4 conversion event spec

Related: #2, #3

## Privacy rule

Do not send PII in analytics events. Never include name, e-mail, phone, WhatsApp number, brewery name, document numbers, free-text form content, tokens or internal IDs.

## Events

### `app_open`
Triggered when a visitor clicks a CTA that opens `app.brewcontrol.app.br`.

Parameters:
- `cta_location`: `header`, `pricing`, `module_page`, `other`;
- `cta_label`: visible CTA label, normalized;
- `plan`: optional public plan name when the click comes from pricing.

### `pricing_cta_click`
Triggered by CTA clicks inside `.price` cards.

Parameters:
- `plan`: `Bar`, `Cigano`, `Produtor`, `Brewery`;
- `cta_label`.

### `module_open`
Triggered when a visitor navigates from Home to a module detail page.

Parameters:
- `module`: production, warehouse, assets, commercial, logistics, finance, brewpub, fiscal, pdv_mobile;
- `source`: `module_grid` or `story`.

### `founder_program_click`
Triggered by the CTA to the Programa Cervejaria Fundadora / WhatsApp.

Parameters:
- `cta_location`;
- `cta_label`.

### `demo_video_view`
Only enabled after a real mini-demo is public and validated.

Parameters:
- `demo`: production, assets, commercial, brewpub;
- `duration_bucket`: optional non-PII bucket;
- `source`: `home_story`.

## Suggested conversion setup

Primary conversions:
- `founder_program_click`;
- `app_open` when the source is pricing or a high-intent CTA.

Secondary diagnostic events:
- `pricing_cta_click`;
- `module_open`;
- `demo_video_view`.

Do not mark every click as a conversion. Keep conversion semantics tied to business intent.

## Validation gate

Before merge:
- no layout change;
- no PII parameters;
- events degrade safely when `gtag` is unavailable;
- no event prevents navigation.

After production:
- verify Realtime/DebugView;
- test desktop and mobile;
- record one week of baseline before changing CTA copy or placement.
