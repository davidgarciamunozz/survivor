/**
 * Turns the raw Meshy export into a web-sized GLB.
 *
 *   node scripts/optimize-model.mjs <source.glb>
 *
 * The source is a photogrammetry-style mesh: ~1.9M triangles and four 2–4K
 * textures, 70 MB in total. Three of those textures go away entirely:
 *
 *   - emissive is solid black (measured max luminance 1/255),
 *   - normal is flat (luminance spans 134–148 around the neutral 128),
 *   - metallic-roughness is baked noise that renders the matte case as
 *     polished chrome; constant factors look far better and cost nothing.
 *
 * Only the base colour survives.
 *
 * The mesh ships WITHOUT a NORMAL attribute on purpose. Simplifying leaves the
 * surface faceted, and glTF-Transform's normals() writes per-face normals that
 * unweld every vertex (172k verts for 58k triangles, tripling the file). The
 * loader calls computeVertexNormals() instead, which smooths across the welded
 * mesh and restores the moulded look for free. SurvivorCaseModel.tsx depends
 * on this — do not add normals back without updating it.
 */
import { readdirSync } from "node:fs";
import { stat } from "node:fs/promises";
import { basename } from "node:path";
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import {
  dedup,
  flatten,
  join,
  meshopt,
  prune,
  quantize,
  simplify,
  textureCompress,
  weld,
} from "@gltf-transform/functions";
import { MeshoptSimplifier, MeshoptEncoder, MeshoptDecoder } from "meshoptimizer";
import sharp from "sharp";

const OUT = "public/models/survivor-case.glb";
/** Keeps the silhouette's rounded corners clean at hero size. */
const TARGET_RATIO = 0.03;
const SIMPLIFY_ERROR = 0.0004;

const source =
  process.argv[2] ??
  readdirSync(".").find((f) => f.endsWith(".glb") && f.startsWith("Meshy"));

if (!source) {
  console.error("No source .glb given and no Meshy export found.");
  process.exit(1);
}

await MeshoptSimplifier.ready;
await MeshoptEncoder.ready;
await MeshoptDecoder.ready;

const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({
    "meshopt.encoder": MeshoptEncoder,
    "meshopt.decoder": MeshoptDecoder,
  });
const document = await io.read(source);
const root = document.getRoot();

const before = {
  bytes: (await stat(source)).size,
  triangles: countTriangles(root),
  textures: root.listTextures().length,
};

for (const material of root.listMaterials()) {
  material.setNormalTexture(null);
  material.setEmissiveTexture(null);
  material.setEmissiveFactor([0, 0, 0]);
  material.setMetallicRoughnessTexture(null);
  material.setMetallicFactor(0);
  material.setRoughnessFactor(0.6);
  // Single-sided halves the fragment work and cleans up the shadow.
  material.setDoubleSided(false);
}

await document.transform(
  dedup(),
  flatten(),
  join(),
  weld(),
  simplify({ simplifier: MeshoptSimplifier, ratio: TARGET_RATIO, error: SIMPLIFY_ERROR }),
  prune({ keepAttributes: false }),
  stripNormals(),
  // Welds on position and UV alone now that per-face normals are gone.
  weld(),
  textureCompress({
    encoder: sharp,
    targetFormat: "webp",
    slots: /baseColorTexture/,
    resize: [2048, 2048],
    quality: 88,
  }),
  // Quantize before encoding so normals keep 12 bits — at meshopt's default
  // 8 the recomputed smoothing bands visibly across the flat back.
  quantize(),
  meshopt({ encoder: MeshoptEncoder, level: "medium" }),
);

await io.write(OUT, document);

const after = {
  bytes: (await stat(OUT)).size,
  triangles: countTriangles(document.getRoot()),
  textures: document.getRoot().listTextures().length,
};

const mb = (n) => `${(n / 1024 / 1024).toFixed(2)} MB`;
console.log(`${basename(source)} → ${OUT}`);
console.log(`  size      ${mb(before.bytes)} → ${mb(after.bytes)}`);
console.log(`  triangles ${before.triangles.toLocaleString()} → ${after.triangles.toLocaleString()}`);
console.log(`  textures  ${before.textures} → ${after.textures}`);

/** Drops NORMAL so the loader can compute smooth normals over welded verts. */
function stripNormals() {
  return (doc) => {
    for (const mesh of doc.getRoot().listMeshes()) {
      for (const primitive of mesh.listPrimitives()) {
        primitive.setAttribute("NORMAL", null);
      }
    }
  };
}

function countTriangles(root) {
  let total = 0;
  for (const mesh of root.listMeshes()) {
    for (const primitive of mesh.listPrimitives()) {
      const indices = primitive.getIndices();
      const position = primitive.getAttribute("POSITION");
      total += (indices ? indices.getCount() : position.getCount()) / 3;
    }
  }
  return Math.round(total);
}
