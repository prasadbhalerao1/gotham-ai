// "Gotham moon" — a quiet night skyline under a moon that carries the Gotham AI
// mark, lighting the clouds around it. Nothing follows the pointer; the moon
// rises once on load and the camera eases up as you scroll.
// Plain three.js, mounted client-side only.
import * as THREE from "three";
import { MARK_DOT, MARK_PATH, MARK_STROKE } from "../lib/mark.js";

const SKY = new THREE.Color("#09090b");
const LIGHT = new THREE.Color("#f4f3ea");

function mulberry32(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Bright disc with the αi mark knocked out — the moon. */
function moonTexture() {
  const size = 512;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d");
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.62, "rgba(255,255,255,0.92)");
  grad.addColorStop(0.72, "rgba(255,255,255,0.35)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  // knock the mark out of the disc
  g.globalCompositeOperation = "destination-out";
  const s = (size * 0.5) / 740; // logo viewBox is 740 wide
  g.save();
  g.translate(size / 2, size / 2);
  g.scale(s, s);
  g.translate(-510, -490); // centre of the mark in logo coordinates
  g.lineCap = "round";
  g.lineJoin = "round";
  g.lineWidth = MARK_STROKE;
  g.stroke(new Path2D(MARK_PATH));
  g.fillStyle = "#000"; // any opaque colour — it only drives the knock-out
  g.beginPath();
  g.arc(MARK_DOT.cx, MARK_DOT.cy, MARK_DOT.r, 0, Math.PI * 2);
  g.fill();
  g.restore();
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const noise = /* glsl */ `
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float vnoise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }
  float fbm(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { v += a * vnoise(p); p *= 2.03; a *= 0.5; } return v; }
`;

const cityVertex = /* glsl */ `
  attribute vec3 aScale;
  attribute float aSeed;
  varying vec3 vLocal; varying vec3 vNormal; varying vec3 vScale; varying float vSeed; varying float vDepth;
  void main() {
    vLocal = position; vNormal = normal; vScale = aScale; vSeed = aSeed;
    vec4 mv = viewMatrix * modelMatrix * instanceMatrix * vec4(position, 1.0);
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const cityFragment = /* glsl */ `
  uniform float uTime; uniform vec3 uSky; uniform float uIntro;
  varying vec3 vLocal; varying vec3 vNormal; varying vec3 vScale; varying float vSeed; varying float vDepth;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  void main() {
    vec3 col = vec3(0.035, 0.036, 0.042);
    if (abs(vNormal.y) < 0.5) {
      float u = abs(vNormal.x) > 0.5 ? vLocal.z * vScale.z : vLocal.x * vScale.x;
      float v = (vLocal.y + 0.5) * vScale.y;
      vec2 cell = vec2(floor(u / 0.26), floor(v / 0.36));
      vec2 f = vec2(fract(u / 0.26), fract(v / 0.36));
      float win = step(0.3, f.x) * step(f.x, 0.7) * step(0.3, f.y) * step(f.y, 0.7);
      float h = hash(cell + vSeed * 17.0 + vNormal.xz * 3.0);
      float lit = step(0.87, h);
      float on = smoothstep(0.0, 1.0, uIntro * 1.5 - (vLocal.y + 0.5) * 0.5 - h * 0.4);
      float breathe = 0.8 + 0.2 * sin(uTime * (0.3 + h) + h * 40.0);
      vec3 w = mix(vec3(1.0, 0.93, 0.8), vec3(0.85, 0.92, 1.0), step(0.95, hash(cell * 3.1 + vSeed)));
      col += win * lit * w * 0.75 * on * breathe;
      // subtle top-down gradient on facades
      col *= 0.75 + 0.35 * (vLocal.y + 0.5);
    } else if (vNormal.y > 0.5) {
      col = vec3(0.05, 0.05, 0.058);
    }
    col = mix(col, uSky, smoothstep(30.0, 150.0, vDepth));
    gl_FragColor = vec4(col, 1.0);
  }
`;

const skyVertex = /* glsl */ `
  varying vec3 vWorld;
  void main() { vec4 w = modelMatrix * vec4(position, 1.0); vWorld = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }
`;

const skyFragment = /* glsl */ `
  uniform float uTime; uniform vec3 uSky; uniform vec3 uLight; uniform vec3 uHit; uniform float uStrength;
  varying vec3 vWorld;
  ${noise}
  void main() {
    vec2 p = vWorld.xy * 0.012 + vec2(uTime * 0.006, 0.0);
    float clouds = fbm(p * 1.6);
    clouds = smoothstep(0.35, 0.85, clouds);
    float horizon = smoothstep(120.0, -10.0, vWorld.y);
    vec3 col = uSky + vec3(0.025, 0.026, 0.03) * horizon + clouds * 0.03;
    // light pooling on the cloud deck around the projected signal
    float d = length(vWorld.xy - uHit.xy);
    float pool = exp(-d * d / 1400.0);
    col += uLight * pool * (0.08 + clouds * 0.32) * uStrength;
    gl_FragColor = vec4(col, 1.0);
  }
`;

export function createGothamScene(canvas, { reducedMotion = false, onReady } = {}) {
  const small = window.innerWidth < 768;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setClearColor(SKY, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 600);
  const camBase = new THREE.Vector3(0, 9, 46);
  const rand = mulberry32(1939);

  // ---- skyline ----------------------------------------------------------
  const cols = small ? 28 : 46;
  const rows = small ? 12 : 16;
  const lot = 3.4;
  const count = cols * rows;
  const geo = new THREE.BoxGeometry(1, 1, 1);
  const scales = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  const cityMat = new THREE.ShaderMaterial({
    vertexShader: cityVertex,
    fragmentShader: cityFragment,
    uniforms: { uTime: { value: 0 }, uSky: { value: SKY }, uIntro: { value: reducedMotion ? 1 : 0 } },
  });
  const city = new THREE.InstancedMesh(geo, cityMat, count);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  let k = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = (c - cols / 2) * lot + (rand() - 0.5) * 0.8;
      const z = -18 - r * lot + (rand() - 0.5) * 0.8;
      const edge = Math.abs(x) / (cols * lot * 0.5);
      let h = 2 + Math.pow(rand(), 3) * 26 * (1 - edge * 0.55) * (0.5 + Math.min(1, r / 5) * 0.5);
      // a few towers define the silhouette
      if (rand() > 0.985) h += 18;
      const w = lot * (0.6 + rand() * 0.28);
      const d = lot * (0.6 + rand() * 0.28);
      m.compose(new THREE.Vector3(x, h / 2, z), q, new THREE.Vector3(w, h, d));
      city.setMatrixAt(k, m);
      scales.set([w, h, d], k * 3);
      seeds[k] = rand();
      k++;
    }
  }
  geo.setAttribute("aScale", new THREE.InstancedBufferAttribute(scales, 3));
  geo.setAttribute("aSeed", new THREE.InstancedBufferAttribute(seeds, 1));
  city.frustumCulled = false;
  scene.add(city);

  // ---- cloud deck + moon ------------------------------------
  const skyZ = -170;
  // moon sits upper-right on wide screens, centred on phones
  const moonPos = new THREE.Vector3(small ? 0 : 52, 88, skyZ);
  const skyMat = new THREE.ShaderMaterial({
    vertexShader: skyVertex,
    fragmentShader: skyFragment,
    uniforms: {
      uTime: { value: 0 },
      uSky: { value: SKY },
      uLight: { value: LIGHT },
      uHit: { value: moonPos },
      uStrength: { value: reducedMotion ? 1 : 0 },
    },
    depthWrite: false,
  });
  const sky = new THREE.Mesh(new THREE.PlaneGeometry(900, 420), skyMat);
  sky.position.set(0, 120, skyZ);
  scene.add(sky);

  const moonMat = new THREE.MeshBasicMaterial({
    map: moonTexture(),
    color: LIGHT,
    transparent: true,
    opacity: reducedMotion ? 0.55 : 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const moon = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), moonMat);
  scene.add(moon);

  let scroll = 0;

  const resize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = camera.aspect < 0.8 ? 66 : 48;
    camera.updateProjectionMatrix();
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  let visible = true;
  const io = new IntersectionObserver(([en]) => (visible = en.isIntersecting));
  io.observe(canvas);

  const clock = new THREE.Clock();
  let raf = 0;
  let intro = reducedMotion ? 1 : 0;
  let ready = false;
  let started = reducedMotion;
  let startAt = 0;

  const frame = () => {
    raf = requestAnimationFrame(frame);
    if (!visible || document.hidden) return;
    clock.getDelta();
    const t = clock.elapsedTime;
    // driven by wall-clock time so slow GPUs still finish the intro
    intro = reducedMotion ? 1 : started ? Math.min(1, (t - startAt) * 0.4) : 0;
    const ease = 1 - Math.pow(1 - intro, 3);
    const moonOn = THREE.MathUtils.smoothstep(intro, 0.3, 1);

    camera.position.set(camBase.x, camBase.y + scroll * 8 - (1 - ease) * 2, camBase.z + (1 - ease) * 8);
    camera.lookAt(0, 22 + scroll * 6, -80);

    // the moon rises a little as the scene fades in, then holds still
    const r = 34;
    moon.position.set(moonPos.x, moonPos.y - (1 - moonOn) * 14, skyZ + 1);
    moon.scale.set(r * 2, r * 2, 1);
    moonMat.opacity = 0.45 * moonOn;

    cityMat.uniforms.uTime.value = t;
    cityMat.uniforms.uIntro.value = ease;
    skyMat.uniforms.uTime.value = t;
    skyMat.uniforms.uStrength.value = moonOn;

    renderer.render(scene, camera);
    if (!ready) {
      ready = true;
      onReady?.();
    }
  };

  if (reducedMotion) {
    intro = 1;
    frame();
    cancelAnimationFrame(raf);
  } else frame();

  return {
    /** begin the entrance once the intro has closed */
    start() {
      if (started) return;
      started = true;
      startAt = clock.elapsedTime;
    },
    setScroll(v) {
      scroll = v;
    },
    dispose() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      scene.traverse((o) => {
        o.geometry?.dispose();
        o.material?.map?.dispose();
        o.material?.dispose();
      });
      renderer.dispose();
    },
  };
}
