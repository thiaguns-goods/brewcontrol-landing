# BrewControl Remotion tooling

Remotion is isolated under `tools/remotion`; Playwright remains the real-app capture harness. This package only post-processes approved RAW WebM and never changes landing runtime or public manifest.

Copy approved RAW to `public/raw/`, configure trims in `src/config/demos.ts`, inspect with `npm run studio`, render WebM/MP4 and poster, then review before controlled publication. Outputs go to `output/`; RAW is never overwritten. Defaults are 1440x810, 30 fps, muted, neutral 1:1 presentation, no effects or transitions. WebM uses VP8 and MP4 H.264; prioritize legibility (targets <=1.5 MB / <=2 MB).

All catalog entries (production, assets, commercial, logistics, brewpub, finance, dashboard, inventory) are disabled until approved timings exist. No RAW contains real data and no video is published automatically.

Remotion has its own license; see https://www.remotion.dev/license
