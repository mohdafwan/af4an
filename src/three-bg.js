// three-bg.js — floating "finger-guns" mascot with a glowing halo
import * as THREE from "three";

const canvas = document.getElementById("bg-canvas");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const hidden = canvas && getComputedStyle(canvas).display === "none";

if (canvas && !hidden) {
  init(canvas).catch((err) => {
    console.warn("3D background failed to start:", err);
    canvas.style.display = "none";
  });
}

async function init(canvas) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.z = 6.5;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const isMobile = window.innerWidth < 768;
  const glowBase = isMobile ? 0.4 : 0.7;
  const haloSize = isMobile ? 5.5 : 8;
  const group = new THREE.Group();
  group.position.x = isMobile ? 0 : 2.9;
  group.position.y = isMobile ? 2.3 : -0.6;
  scene.add(group);

  // ---- Glowing halo behind the model ----
  const glow = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: glowTexture(),
      transparent: true,
      opacity: glowBase,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  );
  glow.scale.set(haloSize, haloSize, 1);
  glow.position.z = -1.2;
  group.add(glow);

  // ---- The mascot (textured plane) ----
  const tex = await new THREE.TextureLoader().loadAsync(
    "./public/image/gunfinger.png"
  );
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();

  const aspect = 359 / 328;
  const h = isMobile ? 2.2 : 4.0;
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(h * aspect, h),
    new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      opacity: isMobile ? 0.42 : 1,
      depthWrite: false,
      alphaTest: 0.02,
    })
  );
  group.add(plane);

  // ---- Sparkle dust ----
  const N = isMobile ? 300 : 700;
  const pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const r = 2.8 + Math.random() * 3.2;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
    pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
    pos[i * 3 + 2] = r * Math.cos(ph) - 1.0;
  }
  const pg = new THREE.BufferGeometry();
  pg.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const dust = new THREE.Points(
    pg,
    new THREE.PointsMaterial({
      size: 0.03,
      map: dotTexture(),
      color: new THREE.Color("#cfe8c4"),
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  );
  group.add(dust);

  // ---- Interaction ----
  const targ = { x: 0, y: 0 };
  const cur = { x: 0, y: 0 };
  window.addEventListener("pointermove", (e) => {
    targ.x = e.clientX / window.innerWidth - 0.5;
    targ.y = e.clientY / window.innerHeight - 0.5;
  });

  let scrollY = 0;
  window.addEventListener("scroll", () => (scrollY = window.scrollY || 0), {
    passive: true,
  });

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  const baseX = group.position.x;
  const baseY = group.position.y;

  // reduced motion: render a single static frame
  if (reduceMotion) {
    renderer.render(scene, camera);
    return;
  }

  let running = true;
  document.addEventListener("visibilitychange", () => {
    running = !document.hidden;
    if (running) clock.start();
  });

  const clock = new THREE.Clock();
  function loop() {
    requestAnimationFrame(loop);
    if (!running) return;
    const t = clock.getElapsedTime();

    cur.x += (targ.x - cur.x) * 0.05;
    cur.y += (targ.y - cur.y) * 0.05;

    // gentle float + sway
    group.position.y = baseY + Math.sin(t * 0.9) * 0.16 - scrollY * 0.0022;
    group.position.x = baseX + cur.x * 0.5;
    plane.rotation.z = Math.sin(t * 0.6) * 0.04 + cur.x * 0.06;

    // pseudo-3D tilt toward cursor
    plane.rotation.y = cur.x * 0.5;
    plane.rotation.x = -cur.y * 0.35;

    // halo breathing
    const s = haloSize + Math.sin(t * 1.1) * 0.35;
    glow.scale.set(s, s, 1);
    glow.material.opacity = glowBase + Math.sin(t * 1.1) * 0.12;

    dust.rotation.y = t * 0.04;
    dust.rotation.x = -t * 0.02;

    renderer.render(scene, camera);
  }
  loop();
}

// soft lime→teal radial glow
function glowTexture() {
  const s = 256;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const x = c.getContext("2d");
  const g = x.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, "rgba(200,242,94,0.55)");
  g.addColorStop(0.4, "rgba(95,224,192,0.30)");
  g.addColorStop(0.75, "rgba(60,120,150,0.10)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  x.fillStyle = g;
  x.fillRect(0, 0, s, s);
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

// soft round particle
function dotTexture() {
  const s = 64;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const x = c.getContext("2d");
  const g = x.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.4, "rgba(255,255,255,0.5)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  x.fillStyle = g;
  x.fillRect(0, 0, s, s);
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}
