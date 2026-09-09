# Survivor Case — landing

A scroll-driven product page for the Survivor Case: an integrated power bank
case with a dedicated battery reserved solely for its distress alarm.

Next.js (App Router) + Tailwind v4, no animation library. Content is bilingual
(EN/ES) via a client-side dictionary; the toggle in the nav switches in place.

## The hero model

On screens 820px and wider the hero is the model: `public/models/survivor-case.glb`
rendered full-bleed in three.js, right of centre, with the copy anchored
bottom-left and the call to action bottom-right — the composition Apple uses on
its iPhone pages. The case follows the pointer, can be dragged and thrown, and
eases back to its pose.

Phones get a different hero: copy on top, the film's opening still beneath, and
no three.js or model download at all. That still is **not** a loading
placeholder on desktop — showing it there flashed a different image on every
reload. It appears on a wide screen only after the model has actually failed,
which is also the WebGL-missing path.

```
npm run model    # Meshy export → public/models/survivor-case.glb
```

The raw Meshy export is 70 MB. `scripts/optimize-model.mjs` brings it to
**441 KB**:

| | before | after |
|---|---|---|
| file | 67.4 MB | 0.43 MB |
| triangles | 1,945,426 | 58,360 |
| textures | 4 | 1 |

Three of the four textures were measured to carry no information — emissive is
solid black, normal is flat, and the metallic-roughness map renders the matte
case as polished chrome — so only base colour survives, with constant material
factors in its place. The GLB also ships **without normals**: simplification
leaves the surface faceted, and the loader's `computeVertexNormals()` smooths
it over the welded mesh for free, where baking normals into the file would have
unwelded every vertex and quadrupled its size.

Studio lighting comes from three's procedural `RoomEnvironment`, so the
reflections cost no download, and the contact shadow is a gradient sprite
rather than a shadow map. Framing is recomputed on every resize so the case
always clears the nav — its links are unreadable over the black case — and
leaves the bottom-left corner on clear white.

Measured on the production build: desktop loads 1129 KB of JS uncompressed
(~157 KB gzipped of that is three.js) plus the 441 KB model; a phone loads
493 KB of JS and no model. The render loop stops whenever the hero scrolls away
or the tab goes to the background.

## The film

The centrepiece is `components/ScrollStage.tsx`: a tall sticky section that
scrubs `survivor.mp4` frame by frame as you scroll, the way Apple's product
pages do. The video is never played — it is decoded ahead of time into a JPEG
sequence and painted to a canvas.

```
npm run frames   # ffmpeg + sharp → public/frames/{hd,sm} + lib/frames.ts
npm run dev
```

`npm run frames` must be run once before the first `dev`/`build`, and again
whenever `survivor.mp4` changes. It regenerates `lib/frames.ts` with the frame
count, aspect ratio and file extension.

Frames are WebP at the video's **native** width:

| tier | size | weight | used by |
|---|---|---|---|
| `hd` | 1924px q85, unsharp σ1.0 | 9.5 MB | desktop |
| `sm` | 1080px q78, unsharp σ0.8 | 3.6 MB | phones, save-data |

The first pipeline wrote 1440px JPEGs, which the canvas then upscaled about
2.2x on a Retina display. Extracting at native width and switching to WebP
removed that self-inflicted loss for the same weight.

What remained was not self-inflicted. The render itself is soft — it carries
baked-in depth of field and motion blur, measuring a Laplacian variance of
10-23 where a crisp photo sits above 100 — and a 1440x900 Retina viewport still
stretches a native frame ~1.67x to cover the canvas (1924 source pixels across
3219 device pixels). No encoding setting recovers detail that was never
rendered.

Output sharpening does not add detail either, but it restores the edge acutance
that survives that stretch, which is what actually reads as "sharp". Settings
were chosen by drawing one frame through Chrome's own canvas at device
resolution and measuring both acutance and the overshoot just outside the
product's silhouette, where haloes appear first:

| unsharp | acutance | overshoot | weight |
|---|---|---|---|
| none | 7.3 | 12/255 | 8.4 MB |
| σ0.8 m2 2.2 | 11.7 | 15/255 | 8.4 MB |
| **σ1.0 m2 3.0** | **21.8** | 32/255 | **9.5 MB** |
| σ1.3 m2 2.5 | 24.4 | 33/255 | 9.9 MB |

σ1.3 buys almost no acutance for the same overshoot, so σ1.0 is the knee of the
curve. `m1` stays at 0 so the plain studio backdrop is left alone rather than
having its noise amplified.

Pre-upscaling frames above native width was tried and **rejected**: at 2400px
with Lanczos plus sharpening it measured *worse* than native (acutance 7.8) and
cost ~1 MB more, because Chrome's own high-quality upscale — the canvas sets
`imageSmoothingQuality = "high"` — beats the resampling that would have
replaced it. An offline simulation had suggested the opposite; the real browser
settled it.

The remaining ceiling is the source. A genuinely sharper film needs a
re-export from the 3D scene at higher resolution with less depth of field and
motion blur; nothing in this pipeline can substitute for that.

## Notes

- `lib/useFrameSequence.ts` preloads with bounded concurrency, caps the canvas
  at 2x DPR, and reframes for portrait screens (cover would crop the product
  down to a sliver, so phones get a banded render with the copy beneath it).
- Under `prefers-reduced-motion` the film stops scrubbing and shows one still
  per copy block.
- Hotspot coordinates in `lib/dictionary.ts` are percentages calibrated against
  `public/frames/hd/201.jpg`. Change the still and they need recalibrating.
- Committed source material: `survivor.mp4` and `referenceLanding/` (Apple
  AirPods screenshots used as the visual reference). The Meshy `.glb` and the
  product PDF are gitignored, as above.
