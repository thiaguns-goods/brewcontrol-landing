# BrewControl Remotion tooling

Remotion is isolated under `tools/remotion`; Playwright remains the real-app capture harness. This package only post-processes approved RAW WebM and never changes landing runtime or public manifest.

RAW and outputs default to `public/raw/` and `output/`, but can live entirely outside the repository: `npm run render -- --demo production --format webm --raw-dir C:\\captures --output-dir C:\\renders`. Each catalog source is a filename such as `production.webm`, resolved relative to `--raw-dir`. Use `--trim-start-frame` and `--trim-end-frame` for an explicit local proof or approved trim. The bundle uses Remotion's temporary directory, outputs never overwrite RAW, and no cache binary is written to the worktree. Defaults are 1440x810, 30 fps, muted, neutral 1:1 presentation, no effects or transitions. WebM uses VP8 and MP4 H.264; prioritize legibility (targets <=1.5 MB / <=2 MB).

All catalog entries (production, assets, commercial, logistics, brewpub, finance, dashboard, inventory) are disabled until approved timings exist. No RAW contains real data and no video is published automatically.

Remotion has its own license; see https://www.remotion.dev/license

To prepare local agent skills (never versioned):

```sh
cd tools/remotion
npx remotion skills add
```
