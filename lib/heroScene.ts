import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

const MODEL_URL = "/models/survivor-case.glb";

/** Three-quarter view of the case's back — the pose the film opens on. */
const POSE_X = 0.06;
const POSE_Y = Math.PI - 0.42;

const ROUGHNESS = 0.85;
const EXPOSURE = 1.1;
const ENV_INTENSITY = 0.75;

/** How far the pointer can push the case, in radians. */
const PARALLAX_YAW = 0.26;
const PARALLAX_PITCH = 0.14;

/** Idle sway: the case breathes rather than drifting away from its pose. */
const SWAY_YAW = 0.1;
const SWAY_PITCH = 0.035;

const DAMPING = 0.08;
const DRAG_FRICTION = 0.94;
const DRAG_RETURN = 0.965;
const MAX_PIXEL_RATIO = 1.75;
/** Share of the visible frame height the case fills. */
const FIT = 0.78;
/**
 * Pushed right of centre so the bottom-left copy sits on clear white, and
 * sized to clear the nav — the links are unreadable over the black case.
 */
const OFFSET_X = 0.11;
const OFFSET_Y = -0.02;

export type HeroScene = {
  /** Pointer position over the hero, each axis in -1…1. */
  setPointer: (x: number, y: number) => void;
  startDrag: (clientX: number) => void;
  drag: (clientX: number) => void;
  endDrag: () => void;
  /** Stops the render loop when the hero scrolls away or the tab hides. */
  setActive: (active: boolean) => void;
  dispose: () => void;
};

export async function createHeroScene(
  canvas: HTMLCanvasElement,
  options: { reducedMotion: boolean; onReady: () => void },
): Promise<HeroScene> {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = EXPOSURE;

  const scene = new THREE.Scene();

  // RoomEnvironment is generated in-engine, so the studio reflections cost no
  // download at all — the alternative would be shipping an HDRI.
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = environment.texture;
  scene.environmentIntensity = ENV_INTENSITY;
  pmrem.dispose();

  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
  camera.position.set(0, 0, 6);

  const key = new THREE.DirectionalLight(0xffffff, 2.1);
  key.position.set(-2.4, 3.2, 3.6);
  scene.add(key);

  const rim = new THREE.DirectionalLight(0xffffff, 0.75);
  rim.position.set(3.2, 1.2, -2.4);
  scene.add(rim);

  const shadow = createGroundShadow();
  scene.add(shadow.mesh);
  const shadowBase = shadow.mesh.scale.clone();

  const holder = new THREE.Group();
  holder.rotation.set(POSE_X, POSE_Y, 0);
  scene.add(holder);

  const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
  const gltf = await loader.loadAsync(MODEL_URL);
  const model = gltf.scene;

  const disposables: Array<{ dispose: () => void }> = [];
  model.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    // The GLB ships without normals so it can stay welded and small; smoothing
    // them here is what removes the faceting left by simplification.
    object.geometry.computeVertexNormals();
    const material = object.material as THREE.MeshStandardMaterial;
    material.roughness = ROUGHNESS;
    material.metalness = 0;
    disposables.push(object.geometry, material);
  });

  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  model.position.sub(center);

  /**
   * Fits the case to whatever slice of the hero the canvas ends up with, so it
   * is never cropped by the fold on a short viewport.
   */
  const fit = () => {
    const visibleHeight =
      2 * camera.position.z * Math.tan((camera.fov / 2) * THREE.MathUtils.DEG2RAD);
    const visibleWidth = visibleHeight * camera.aspect;
    const scale = (visibleHeight * FIT) / size.y;
    holder.scale.setScalar(scale);

    const x = visibleWidth * OFFSET_X;
    const y = visibleHeight * OFFSET_Y;
    holder.position.set(x, y, 0);

    const bottom = y + (-size.y / 2) * scale;
    shadow.mesh.position.set(x, bottom - 0.04, 0);
    shadow.mesh.scale.copy(shadowBase).multiplyScalar(scale * size.y);
  };

  const clock = new THREE.Clock();
  const pointer = { x: 0, y: 0 };
  let dragging = false;
  let dragLastX = 0;
  let dragOffset = 0;
  let dragVelocity = 0;
  let frame = 0;
  let active = false;
  let disposed = false;

  const resize = () => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    fit();
  };
  resize();
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);

  const tick = () => {
    if (disposed) return;
    frame = requestAnimationFrame(tick);

    if (!dragging) {
      dragOffset += dragVelocity;
      dragVelocity *= DRAG_FRICTION;
      if (Math.abs(dragVelocity) < 0.0008) {
        dragVelocity = 0;
        // Once the throw has run out, ease back to the composed pose.
        dragOffset *= DRAG_RETURN;
      }
    }

    const time = clock.getElapsedTime();
    const swayYaw = options.reducedMotion ? 0 : Math.sin(time * 0.22) * SWAY_YAW;
    const swayPitch = options.reducedMotion ? 0 : Math.sin(time * 0.17) * SWAY_PITCH;

    const targetY = POSE_Y + dragOffset + swayYaw + pointer.x * PARALLAX_YAW;
    const targetX = POSE_X + swayPitch - pointer.y * PARALLAX_PITCH;

    holder.rotation.y += (targetY - holder.rotation.y) * DAMPING;
    holder.rotation.x += (targetX - holder.rotation.x) * DAMPING;

    renderer.render(scene, camera);
  };

  holder.add(model);
  resize();
  renderer.render(scene, camera);
  options.onReady();

  return {
    setPointer(x, y) {
      pointer.x = x;
      pointer.y = y;
    },
    startDrag(clientX) {
      dragging = true;
      dragLastX = clientX;
      dragVelocity = 0;
    },
    drag(clientX) {
      if (!dragging) return;
      const delta = (clientX - dragLastX) / 220;
      dragLastX = clientX;
      dragOffset += delta;
      dragVelocity = delta;
    },
    endDrag() {
      dragging = false;
    },
    setActive(next) {
      if (next === active || disposed) return;
      active = next;
      if (next) {
        clock.getDelta();
        frame = requestAnimationFrame(tick);
      } else {
        cancelAnimationFrame(frame);
      }
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      for (const item of disposables) item.dispose();
      shadow.dispose();
      environment.texture.dispose();
      renderer.dispose();
    },
  };
}

/**
 * A soft gradient blob standing in for a contact shadow. A real shadow map
 * would cost an extra render pass per frame and, with PCF, still look harder
 * than this.
 */
function createGroundShadow() {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d")!;
  const gradient = context.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );
  gradient.addColorStop(0, "rgba(0,0,0,0.34)");
  gradient.addColorStop(0.45, "rgba(0,0,0,0.14)");
  gradient.addColorStop(1, "rgba(0,0,0,0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const geometry = new THREE.PlaneGeometry(0.72, 0.46);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2;
  mesh.renderOrder = -1;

  return {
    mesh,
    dispose() {
      geometry.dispose();
      material.dispose();
      texture.dispose();
    },
  };
}
