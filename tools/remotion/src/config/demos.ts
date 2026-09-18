export type DemoId =
  | 'production'
  | 'assets'
  | 'commercial'
  | 'logistics'
  | 'brewpub'
  | 'finance'
  | 'dashboard'
  | 'inventory';

export type DemoConfig = {
  id: DemoId;
  source: string;
  width: number;
  height: number;
  fps: number;
  trimStartFrame?: number;
  trimEndFrame?: number;
  durationInFrames?: number;
  /** Frame index relative to composition (0 to durationInFrames - 1) for poster extraction */
  posterFrame?: number;
  crf?: number;
  webmCrf?: number;
  mp4Crf?: number;
  enabled: boolean;
};

const make = (id: DemoId): DemoConfig => ({
  id,
  source: `${id}.webm`,
  width: 1440,
  height: 810,
  fps: 30,
  durationInFrames: 300,
  enabled: false,
});

const defaultDemos = Object.fromEntries(
  (['production', 'commercial', 'logistics', 'brewpub', 'finance', 'dashboard', 'inventory'] as DemoId[]).map(
    id => [id, make(id)]
  )
) as Record<DemoId, DemoConfig>;

export const demos: Record<DemoId, DemoConfig> = {
  ...defaultDemos,
  assets: {
    id: 'assets',
    source: 'assets.webm',
    width: 1440,
    height: 810,
    fps: 25,
    trimStartFrame: 275,
    trimEndFrame: 485,
    posterFrame: 175,
    enabled: true,
  },
};
