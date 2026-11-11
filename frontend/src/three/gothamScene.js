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
  varying vec3 vLocal; varying vec3 vNormal; varying vec3 vScale; varying float vSeed; varying float vDepth; varying vec3 vWorld;
  void main() {
    vLocal = position; vNormal = normal; vScale = aScale; vSeed = aSeed;
    vec4 world = modelMatrix * instanceMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    vec4 mv = viewMatrix * world;
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const cityFragment = /* glsl */ `
  uniform float uTime; uniform vec3 uSky; uniform float uIntro;
  uniform vec3 uPointer; uniform float uPointerOn;
  // up to 8 ripples at once (clicks and music hits): xy = origin, z = start time, w = strength
  uniform vec4 uRipples[8];
  uniform float uFlood; uniform float uBlackout;
  varying vec3 vLocal; varying vec3 vNormal; varying vec3 vScale; varying float vSeed; varying float vDepth; varying vec3 vWorld;
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
      // interaction: windows near the pointer switch on; a click sends a lime ring outwards
      vec2 dp = (vWorld.xy - uPointer.xy) * vec2(1.0, 1.3);
      float near = exp(-dot(dp, dp) / 220.0) * uPointerOn;
      float lit = step(0.87 - near * 0.7, h);
      float on = smoothstep(0.0, 1.0, uIntro * 1.5 - (vLocal.y + 0.5) * 0.5 - h * 0.4);
      float breathe = 0.8 + 0.2 * sin(uTime * (0.3 + h) + h * 40.0);
      vec3 w = mix(vec3(1.0, 0.93, 0.8), vec3(0.85, 0.92, 1.0), step(0.95, hash(cell * 3.1 + vSeed)));
      col += win * lit * w * (0.75 + near * 0.6) * on * breathe;
      // easter egg: the whole skyline floods with lime from the ground up
      float rise = smoothstep(vWorld.y - 6.0, vWorld.y, uFlood * 70.0) * smoothstep(0.0, 0.25, uFlood) * smoothstep(1.0, 0.7, uFlood);
      col += win * step(0.3, h) * rise * vec3(0.93, 1.0, 0.4) * 0.9;
      // 404 blackout: everything dark except a couple of flickering windows
      float flicker = step(0.6, fract(sin(floor(uTime * 9.0 + h * 50.0)) * 43758.5)) * (0.6 + 0.4 * sin(uTime * 23.0));
      col += win * step(0.9992, hash(cell * 1.7 + vSeed * 3.0)) * flicker * uBlackout * vec3(1.0, 0.93, 0.8) * 0.8;
      // lime rings of windows rolling outwards
      float ring = 0.0;
      for (int i = 0; i < 8; i++) {
        vec4 r = uRipples[i];
        float age = uTime - r.z;
        float rd = length((vWorld.xy - r.xy) * vec2(1.0, 1.3));
        ring += r.w * exp(-pow(rd - age * 38.0, 2.0) / 30.0) * smoothstep(2.2, 0.0, age) * step(0.0, age);
      }
      col += win * step(0.45, h) * min(ring, 1.4) * vec3(0.93, 1.0, 0.4);
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

/**
 * options: reducedMotion; onReady(); getBeat() → 0…1 pulse on each bass hit of the music
 * (each hit sends a ripple from a random spot);
 * blackout → start with the power out (404 page) until start() is called.
 */
export function createGothamScene(canvas, { reducedMotion = false, onReady, getBeat, blackout = false } = {}) {
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
    uniforms: {
      uTime: { value: 0 },
      uSky: { value: SKY },
      uIntro: { value: reducedMotion ? 1 : 0 },
      uPointer: { value: new THREE.Vector3() },
      uPointerOn: { value: 0 },
      uRipples: { value: Array.from({ length: 8 }, () => new THREE.Vector4(0, 0, -100, 0)) },
      uFlood: { value: 0 },
      uBlackout: { value: blackout ? 1 : 0 },
    },
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

  // thin clouds drifting across the moon
  const wispMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uMoon: { value: moonPos }, uStrength: { value: reducedMotion ? 1 : 0 } },
    vertexShader: skyVertex,
    fragmentShader: /* glsl */ `
      uniform float uTime; uniform vec3 uMoon; uniform float uStrength;
      varying vec3 vWorld;
      ${noise}
      void main() {
        vec2 p = vWorld.xy * vec2(0.02, 0.05) + vec2(uTime * 0.012, 0.0);
        float c = smoothstep(0.5, 0.8, fbm(p * 2.0));
        float d = length(vWorld.xy - uMoon.xy);
        float lit = exp(-d * d / 900.0);
        vec3 col = mix(vec3(0.03, 0.03, 0.036), vec3(0.55, 0.55, 0.52), lit);
        gl_FragColor = vec4(col, c * (0.25 + lit * 0.5) * uStrength);
      }`,
    transparent: true,
    depthWrite: false,
  });
  const wisps = new THREE.Mesh(new THREE.PlaneGeometry(900, 160), wispMat);
  wisps.position.set(0, moonPos.y, skyZ + 3);
  scene.add(wisps);

  // slow red aviation lights on the tallest towers
  const beaconPos = [];
  const beaconSeed = [];
  for (let i = 0; i < count; i++) {
    if (scales[i * 3 + 1] < 22) continue;
    city.getMatrixAt(i, m);
    const p = new THREE.Vector3().setFromMatrixPosition(m);
    beaconPos.push(p.x, scales[i * 3 + 1] + 0.6, p.z);
    beaconSeed.push(seeds[i]);
  }
  const beaconGeo = new THREE.BufferGeometry();
  beaconGeo.setAttribute("position", new THREE.Float32BufferAttribute(beaconPos, 3));
  beaconGeo.setAttribute("aSeed", new THREE.Float32BufferAttribute(beaconSeed, 1));
  const beaconMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uStrength: { value: reducedMotion ? 1 : 0 }, uPixelRatio: { value: renderer.getPixelRatio() } },
    vertexShader: /* glsl */ `
      uniform float uTime; uniform float uPixelRatio; attribute float aSeed; varying float vOn;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        float ph = fract(uTime * 0.45 + aSeed);
        vOn = smoothstep(0.0, 0.08, ph) * smoothstep(0.35, 0.18, ph);
        gl_PointSize = 9.0 * uPixelRatio * (40.0 / -mv.z);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform float uStrength; varying float vOn;
      void main() { float d = length(gl_PointCoord - 0.5); gl_FragColor = vec4(1.0, 0.18, 0.12, smoothstep(0.5, 0.0, d) * vOn * uStrength); }`,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  scene.add(new THREE.Points(beaconGeo, beaconMat));

  let scroll = 0;

  // pointer → a point on a plane through the middle of the city
  const ray = new THREE.Raycaster();
  const cityPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 40);
  const toCity = (nx, ny, out) => {
    ray.setFromCamera({ x: nx, y: ny }, camera);
    return ray.ray.intersectPlane(cityPlane, out);
  };
  const pointerTarget = new THREE.Vector3();
  let pointerWanted = 0;
  let nextRipple = 0;
  const spot = new THREE.Vector3();
  const addRipple = (nx, ny, strength) => {
    if (!toCity(nx, ny, spot)) return;
    cityMat.uniforms.uRipples.value[nextRipple].set(spot.x, spot.y, clock.elapsedTime, strength);
    nextRipple = (nextRipple + 1) % 8;
  };
  let lastBeat = 0;
  let floodAt = -10;

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
  let intro = reducedMotion && !blackout ? 1 : 0;
  let ready = false;
  let started = reducedMotion && !blackout;
  let startAt = 0;

  const frame = () => {
    raf = requestAnimationFrame(frame);
    if (!visible || document.hidden) return;
    clock.getDelta();
    const t = clock.elapsedTime;
    // driven by wall-clock time so slow GPUs still finish the intro
    intro = started ? (reducedMotion ? 1 : Math.min(1, (t - startAt) * 0.4)) : 0;
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
    // the glow trails the pointer and fades slowly, so the city "settles" behind you
    cityMat.uniforms.uPointer.value.lerp(pointerTarget, 0.08);
    cityMat.uniforms.uPointerOn.value += (pointerWanted * moonOn - cityMat.uniforms.uPointerOn.value) * 0.05;
    // each bass hit of the music sends a softer wave from a random spot in the skyline
    if (getBeat && !reducedMotion && moonOn > 0.9) {
      const b = getBeat();
      if (b > 0.9 && lastBeat <= 0.9) addRipple(Math.random() * 1.8 - 0.9, Math.random() * 0.6 - 0.55, 0.7);
      lastBeat = b;
    }
    cityMat.uniforms.uFlood.value = Math.min(1, Math.max(0, (t - floodAt) / 4));
    if (t - floodAt > 4) cityMat.uniforms.uFlood.value = 0;
    cityMat.uniforms.uBlackout.value = blackout ? 1 - ease : 0;
    cityMat.uniforms.uIntro.value = ease;
    skyMat.uniforms.uTime.value = t;
    skyMat.uniforms.uStrength.value = moonOn;
    wispMat.uniforms.uTime.value = t;
    wispMat.uniforms.uStrength.value = moonOn;
    beaconMat.uniforms.uTime.value = t;
    beaconMat.uniforms.uStrength.value = moonOn;

    renderer.render(scene, camera);
    if (!ready) {
      ready = true;
      onReady?.();
    }
  };

  // reduced motion: draw single still frames instead of animating
  const still = () => {
    frame();
    cancelAnimationFrame(raf);
  };
  if (reducedMotion) still();
  else frame();

  return {
    /** begin the entrance once the intro has closed */
    start() {
      if (started) return;
      started = true;
      startAt = clock.elapsedTime;
      if (reducedMotion) still();
    },
    setScroll(v) {
      scroll = v;
    },
    /** pointer position in normalised device coords (-1..1), or null when it leaves */
    setPointer(nx, ny) {
      if (nx === null) {
        pointerWanted = 0;
        return;
      }
      if (toCity(nx, ny, pointerTarget)) pointerWanted = 1;
    },
    /** easter egg: flood the skyline with lime windows for a few seconds */
    flood() {
      if (!reducedMotion) floodAt = clock.elapsedTime;
    },
    /** a lime ring of windows spreading from the given point */
    pulse(nx, ny) {
      if (!reducedMotion) addRipple(nx, ny, 1.1);
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
