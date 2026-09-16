/**
 * Encodes the use-case scene photographs for the web.
 *
 *   node scripts/optimize-scenes.mjs
 *
 * The source PNGs are 1916x821 (2.33:1) and total ~6.1 MB, which is far too
 * much for a landing page that already ships a frame sequence and a GLB.
 *
 * Two problems are solved here at once:
 *
 * 1. Weight. Each scene is re-encoded to AVIF and WebP at two widths. These
 *    frames are almost entirely smooth gradients in deep shadow, which is the
 *    case AVIF wins hardest — expect ~90% off the PNGs.
 *
 * 2. Aspect. 2.33:1 collapses to ~167px tall on a 390px phone, which turns
 *    three of the four scenes into empty black bands. Every scene therefore
 *    also gets a 4:5 portrait crop, centred on the point of interest rather
 *    than on the middle of the frame — in `carro` the subject sits at 65% of
 *    the width, so a centre crop would cut him out entirely. `<picture>` in
 *    SceneCard picks the crop per viewport, so only one is ever downloaded.
 *
 * Quality was picked per format on the darkest scene (`carro`), comparing
 * banding in the fog gradient at 1x and 2x:
 *
 *   avif q40   62 KB   visible banding in the sky
 *   avif q52   98 KB   clean                       <- chosen
 *   avif q65  186 KB   no visible difference from q52
 *
 * WebP only exists as the fallback for older Safari, so it runs a little
 * cheaper; browsers that get it are the ones least likely to be on Retina.
 */
import { mkdir, readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const SRC = "public/ia-img";
const OUT = "public/scenes";

const WIDE = [1920, 1280];
const PORTRAIT = [900, 640];
const PORTRAIT_RATIO = 4 / 5;

const AVIF = { quality: 52, effort: 6 };
const WEBP = { quality: 78, effort: 5 };

/**
 * `focus` is where the eye lands, as a fraction of the source width. It only
 * steers the portrait crop; the wide crop is the untouched frame.
 *
 * `gamma` lifts shadows without crushing black to grey. Only `carro` needs it:
 * it is legible on a calibrated display but reads as a solid black rectangle
 * on a phone at half brightness outdoors. Set it to 1 to ship the original.
 */
const SCENES = [
  { file: "carro.png", name: "road", focus: 0.65, gamma: 1.12 },
  { file: "sismo.png", name: "quake", focus: 0.37, gamma: 1 },
  { file: "bateriaBaja.png", name: "battery", focus: 0.46, gamma: 1 },
  { file: "anciana.png", name: "care", focus: 0.59, gamma: 1 },
];

const kb = (bytes) => `${Math.round(bytes / 1024)} KB`;

/** Encodes one prepared pipeline to both formats at every width. */
async function emit(pipeline, name, variant, widths) {
  const written = [];
  for (const width of widths) {
    for (const [ext, opts] of [
      ["avif", AVIF],
      ["webp", WEBP],
    ]) {
      const path = join(OUT, `${name}-${variant}-${width}.${ext}`);
      await pipeline
        .clone()
        .resize({ width, withoutEnlargement: true })
        [ext](opts)
        .toFile(path);
      written.push(path);
    }
  }
  return written;
}

async function main() {
  await mkdir(OUT, { recursive: true });

  let before = 0;
  let after = 0;

  for (const scene of SCENES) {
    const src = join(SRC, scene.file);
    before += (await stat(src)).size;

    // Gamma is applied once, before either crop, so the two variants of a
    // scene stay tonally identical where they overlap.
    const base = sharp(src);
    const graded = scene.gamma === 1 ? base : base.gamma(scene.gamma);
    const { width, height } = await graded.metadata();

    const wide = await emit(graded, scene.name, "wide", WIDE);

    // Tallest 4:5 window the source can give us, slid to the focal point and
    // then clamped so it cannot run off either edge.
    const cropWidth = Math.round(height * PORTRAIT_RATIO);
    const left = Math.max(
      0,
      Math.min(width - cropWidth, Math.round(scene.focus * width - cropWidth / 2)),
    );
    const portrait = await emit(
      graded.clone().extract({ left, top: 0, width: cropWidth, height }),
      scene.name,
      "portrait",
      PORTRAIT,
    );

    for (const path of [...wide, ...portrait]) after += (await stat(path)).size;
    console.log(`${scene.name.padEnd(8)} ${wide.length + portrait.length} files`);
  }

  console.log(`\n${kb(before)} PNG -> ${kb(after)} across every variant`);
  console.log(`largest single file: ${kb(await largest())}`);
}

async function largest() {
  const sizes = await Promise.all(
    (await readdir(OUT)).map(async (f) => (await stat(join(OUT, f))).size),
  );
  return Math.max(...sizes);
}

await main();
