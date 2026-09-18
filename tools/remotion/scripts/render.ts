import {bundle} from '@remotion/bundler';
import {renderMedia, renderStill, selectComposition} from '@remotion/renderer';
import {existsSync} from 'node:fs';
import {mkdir} from 'node:fs/promises';
import path from 'node:path';
import {demos, DemoId} from '../src/config/demos';

const args = process.argv.slice(2);
const option = (name: string) => {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
};
const integer = (name: string, fallback: number | undefined) => {
  const value = option(name);
  if (value === undefined) return fallback;
  if (!/^\d+$/.test(value)) throw new Error(`${name} must be a non-negative integer`);
  return Number(value);
};

const main = async () => {
  const root = process.cwd();
  const demo = (option('--demo') ?? 'production') as DemoId;
  const format = option('--format') ?? 'webm';
  const config = demos[demo];
  if (!config) throw new Error(`Unknown demo: ${demo}`);
  if (!['webm', 'mp4', 'poster'].includes(format)) throw new Error(`Invalid format: ${format}`);

  const rawDir = path.resolve(root, option('--raw-dir') ?? 'public/raw');
  const outputDir = path.resolve(root, option('--output-dir') ?? 'output');
  if (!existsSync(rawDir)) throw new Error(`RAW directory does not exist: ${rawDir}`);
  const source = path.join(rawDir, config.source);
  if (!existsSync(source)) throw new Error(`RAW source does not exist: ${source}`);
  await mkdir(outputDir, {recursive: true});

  const trimStartFrame = integer('--trim-start-frame', config.trimStartFrame ?? 0)!;
  const trimEndFrame = integer('--trim-end-frame', config.trimEndFrame ?? config.durationInFrames);
  if (trimStartFrame < 0) throw new Error('trimStartFrame must be >= 0');
  if (trimEndFrame === undefined || trimEndFrame <= trimStartFrame) throw new Error('trimEndFrame must be greater than trimStartFrame');
  const durationInFrames = trimEndFrame - trimStartFrame;

  const serveUrl = await bundle({entryPoint: path.join(root, 'src/index.ts'), publicDir: rawDir});
  const inputProps = {source: config.source, trimStartFrame, trimEndFrame};
  const composition = await selectComposition({serveUrl, id: `BrewControlDemo-${demo}`, inputProps});
  const base = path.join(outputDir, demo);

  if (format === 'poster') {
    const posterFrame = integer('--poster-frame', config.posterFrame ?? 0)!;
    if (posterFrame < 0 || posterFrame >= durationInFrames) {
      throw new Error(`posterFrame must be between 0 and ${durationInFrames - 1} (relative to composition)`);
    }
    await renderStill({composition, serveUrl, output: `${base}-poster.webp`, frame: posterFrame, imageFormat: 'webp', inputProps});
  } else {
    const crfOption = integer('--crf', config.crf);
    const formatCrf = format === 'webm'
      ? integer('--webm-crf', config.webmCrf ?? crfOption)
      : integer('--mp4-crf', config.mp4Crf ?? crfOption);

    await renderMedia({
      composition,
      serveUrl,
      codec: format === 'webm' ? 'vp8' : 'h264',
      outputLocation: `${base}.${format}`,
      audioCodec: null,
      crf: formatCrf,
      inputProps,
      frameRange: [0, durationInFrames - 1],
    });
  }
};

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
