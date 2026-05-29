// scenes.jsx — "The Tiny Backpack" pixel animation.
//
// Canvas 480x270 · 24fps · 9.0s · 216 frames (exact loop).
//   Frame 1 (Leaving Room)     0.0–2.0s   48 frames   (1a idle | 1b pickup | 1c walk)
//   Frame 2 (Platformer City)  2.0–6.0s   96 frames   (run + jump, collect 6 assets)
//   Frame 3 (Stuffing/Bubble)  6.0–9.0s   72 frames   (items burst, "These don't fit!")
//
// Globals from animations.jsx: clamp, lerp, easeInOut, easeOutCubic,
// easeOutBack, rnd, drawRect.

const FPS = 24;
const FR = {
  S1: 0, S1B: 12, S1C: 24,    // Frame 1 sub-beats
  S2: 48,                      // Frame 2 start (2.0s)
  S3: 144,                     // Frame 3 start (6.0s)
  S4: 216,                     // Frame 4 start (9.0s)
  RESET: 280,                  // white-fade reset (~11.67s)
  TOTAL: 288,                  // 12.0s
};

// ── Palette ───────────────────────────────────────────────────────────────────
const C = {
  pack: "#3a2010", packDk: "#2a1608", packStrap: "#5a3a20", packLabel: "#ffcc66",
  glow: "#44aaff", circuit: "#ffaa44", node: "#ffdd44",
  bubble: "#fffef5", bubbleBorder: "#3a2010", textDk: "#3a2010",
  gold: "#ffdd57",
};

// ── Tiny 3x5 pixel font (digits, '.', 'M', 'B') ──────────────────────────────
const GLYPHS = {
  "0": ["###", "# #", "# #", "# #", "###"], "1": [" # ", "## ", " # ", " # ", "###"],
  "2": ["###", "  #", "###", "#  ", "###"], "3": ["###", "  #", "###", "  #", "###"],
  "4": ["# #", "# #", "###", "  #", "  #"], "5": ["###", "#  ", "###", "  #", "###"],
  "6": ["###", "#  ", "###", "# #", "###"], "7": ["###", "  #", "  #", " # ", " # "],
  "8": ["###", "# #", "###", "# #", "###"], "9": ["###", "# #", "###", "  #", "###"],
  ".": ["   ", "   ", "   ", "   ", " # "], "M": ["# #", "###", "###", "# #", "# #"],
  "B": ["## ", "# #", "## ", "# #", "## "],
};
function pixelText(ctx, x, y, str, ps, color) {
  ctx.fillStyle = color;
  let cx = x;
  for (const ch of String(str)) {
    const g = GLYPHS[ch];
    if (g) for (let r = 0; r < 5; r++) for (let c = 0; c < 3; c++)
      if (g[r][c] === "#") ctx.fillRect(cx + c * ps, y + r * ps, ps, ps);
    cx += 4 * ps;
  }
}

// ── Shared effects ────────────────────────────────────────────────────────────
function glowHalo(ctx, x, y, w, h, color, intensity) {
  if (intensity <= 0) return;
  ctx.save();
  ctx.globalAlpha = clamp(intensity * 0.5, 0, 1);
  drawRect(ctx, x - 4, y - 4, w + 8, h + 8, color);
  ctx.globalAlpha = clamp(intensity * 0.28, 0, 1);
  drawRect(ctx, x - 7, y - 7, w + 14, h + 14, color);
  ctx.restore();
}
function sparkles(ctx, cx, cy, prog, seed, color) {
  if (prog < 0 || prog > 1) return;
  ctx.fillStyle = color || "#ffffff";
  for (let i = 0; i < 5; i++) {
    const a = rnd(seed + i) * Math.PI * 2;
    const rr = 4 + prog * 16 + rnd(seed + i + 9) * 4;
    ctx.globalAlpha = clamp(1 - prog, 0, 1);
    ctx.fillRect(Math.round(cx + Math.cos(a) * rr), Math.round(cy + Math.sin(a) * rr), 2, 2);
  }
  ctx.globalAlpha = 1;
}
function dustCloud(ctx, cx, cy, lf, n) {
  n = n || 10;
  for (let i = 0; i < n; i++) {
    const life = ((lf + i * 3) % 14) / 14;
    const a = rnd(i * 3.1 + Math.floor((lf + i * 3) / 14)) * Math.PI * 2;
    const rr = 6 + life * 26;
    ctx.globalAlpha = (1 - life) * 0.4;
    const sz = 3 + Math.floor((1 - life) * 3);
    drawRect(ctx, cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.6 - life * 8, sz, sz, "#8a6040");
  }
  ctx.globalAlpha = 1;
}
function boing(ctx, x, y, k) {
  const s = easeOutBack(clamp(k / 6, 0, 1));
  const fade = clamp(1 - k / 8, 0, 1);
  ctx.save();
  ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha = fade;
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2, rr = 7;
    drawRect(ctx, Math.cos(a) * rr - 1, Math.sin(a) * rr - 1, 2, 2, C.circuit);
  }
  drawRect(ctx, -6, -1, 12, 2, C.node); drawRect(ctx, -1, -6, 2, 12, C.node);
  ctx.globalAlpha = 1; ctx.restore();
}
function whiteFlash(ctx, alpha) {
  ctx.globalAlpha = clamp(alpha, 0, 1);
  drawRect(ctx, 0, 0, W, H, "#ffffff");
  ctx.globalAlpha = 1;
}
function bounceTrajectory(sx, sy, ex, ey, t, dur, bounces, peak) {
  const p = clamp(t / dur, 0, 1);
  return { x: lerp(sx, ex, p), y: lerp(sy, ey, p) - Math.abs(Math.sin(p * Math.PI * bounces)) * peak * (1 - p) };
}

// ── Game asset icons (16x16) ─────────────────────────────────────────────────
function iconCamera(ctx, x, y, col) {
  drawRect(ctx, x + 1, y + 4, 14, 9, col);
  drawRect(ctx, x + 4, y + 2, 5, 2, col);
  drawRect(ctx, x + 5, y + 6, 5, 5, "#2a1a0a");
  drawRect(ctx, x + 6, y + 7, 3, 3, "#cdeaf0");
  drawRect(ctx, x + 12, y + 5, 2, 2, "#fff");
}
function iconFilm(ctx, x, y, col) {
  drawRect(ctx, x + 1, y + 2, 14, 12, col);
  drawRect(ctx, x + 3, y + 4, 8, 8, "#2a1a0a");
  drawRect(ctx, x + 5, y + 5, 6, 6, col);
  drawRect(ctx, x + 6, y + 6, 4, 4, "#2a1a0a"); // play triangle area
  drawRect(ctx, x + 7, y + 6, 1, 4, "#fff");
  drawRect(ctx, x + 8, y + 7, 1, 2, "#fff");
}
function iconSpeaker(ctx, x, y, col) {
  drawRect(ctx, x + 2, y + 5, 3, 6, col);
  drawRect(ctx, x + 5, y + 3, 4, 10, col);
  drawRect(ctx, x + 10, y + 4, 1, 8, col);
  drawRect(ctx, x + 12, y + 2, 1, 12, col);
  drawRect(ctx, x + 11, y + 6, 1, 4, col);
}
function iconPhoto(ctx, x, y, col) {
  drawRect(ctx, x, y + 2, 18, 12, col);
  drawRect(ctx, x + 2, y + 4, 14, 8, "#cdeaf0");
  drawRect(ctx, x + 2, y + 9, 14, 3, "#7fae6b");
  drawRect(ctx, x + 5, y + 6, 4, 3, "#6fb6d6");
  drawRect(ctx, x + 12, y + 5, 2, 2, "#ffe066");
}
function iconCircuit(ctx, x, y, col) {
  drawRect(ctx, x + 1, y + 1, 14, 14, "#15321f");
  for (let i = 0; i < 3; i++) drawRect(ctx, x + 2, y + 3 + i * 4, 12, 1, col);
  for (let i = 0; i < 3; i++) drawRect(ctx, x + 4 + i * 4, y + 2, 1, 12, col);
  for (let i = 0; i < 2; i++) drawRect(ctx, x + 5 + i * 5, y + 6, 2, 2, "#ffee88");
}
function iconFolder(ctx, x, y, col) {
  drawRect(ctx, x + 1, y + 3, 14, 10, col);
  drawRect(ctx, x + 1, y + 2, 6, 2, col);
  drawRect(ctx, x + 2, y + 5, 12, 1, "#fff8");
  drawRect(ctx, x + 3, y + 8, 8, 1, "#2a1a0a");
}
const ICON = { camera: iconCamera, film: iconFilm, speaker: iconSpeaker, photo: iconPhoto, circuit: iconCircuit, folder: iconFolder };

function drawGameAsset(ctx, x, y, asset, glow, scale) {
  scale = scale == null ? 1 : scale;
  glowHalo(ctx, x, y, 16 * scale, 16 * scale, asset.color, glow);
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  (ICON[asset.icon] || iconCircuit)(ctx, 0, 0, asset.color);
  ctx.restore();
}

// ── Level layout (world coords) ───────────────────────────────────────────────
const PLATS = [
  { x: 0,   y: 215, w: 80,  t: "g" },
  { x: 100, y: 190, w: 60,  t: "f" },   // asset 0
  { x: 170, y: 200, w: 70,  t: "g" },   // asset 1
  { x: 260, y: 170, w: 50,  t: "f" },   // asset 2
  { x: 330, y: 210, w: 80,  t: "g" },   // asset 3
  { x: 420, y: 185, w: 60,  t: "f" },   // asset 4
  { x: 500, y: 160, w: 70,  t: "f" },   // asset 5
  { x: 600, y: 220, w: 100, t: "g" },
];
const GASSETS = [
  { plat: 1, color: "#ffaa44", icon: "camera",  label: "IMAGE" },
  { plat: 2, color: "#ff6644", icon: "film",    label: "VIDEO" },
  { plat: 3, color: "#44ffaa", icon: "speaker", label: "SOUND" },
  { plat: 4, color: "#ffaa44", icon: "photo",   label: "HI-RES" },
  { plat: 5, color: "#ffdd44", icon: "circuit", label: "GPU" },
  { plat: 6, color: "#44aaff", icon: "folder",  label: "STORAGE" },
];
GASSETS.forEach((a) => { const p = PLATS[a.plat]; a.wx = p.x + p.w / 2 - 8; a.wy = p.y - 18; });

// Samad's feet height across the level (runs on platforms, arcs over gaps).
function feetYAt(x) {
  for (const p of PLATS) if (x >= p.x && x <= p.x + p.w) return { y: p.y, air: false };
  for (let i = 0; i < PLATS.length - 1; i++) {
    const a = PLATS[i], b = PLATS[i + 1], aEnd = a.x + a.w;
    if (x > aEnd && x < b.x) {
      const u = (x - aEnd) / (b.x - aEnd);
      const jh = Math.max(40, Math.abs(a.y - b.y) + 32);
      return { y: lerp(a.y, b.y, u) - Math.sin(u * Math.PI) * jh, air: true };
    }
  }
  if (x < PLATS[0].x) return { y: PLATS[0].y, air: false };
  return { y: PLATS[PLATS.length - 1].y, air: false };
}

// ═════════════════════════════════════════════════════════════════════════════
//  SAMAD — clean blocky front character (coffee-shop style) with poses.
// ═════════════════════════════════════════════════════════════════════════════
const SK = {
  skin: "#e8a878", skinSh: "#b8784a", skinHi: "#ffd8a8",
  beard: "#3a2818", beardHi: "#5a3a28", beardDk: "#2a1810",
  tank: "#1a1410", tankHi: "#2a2418",
  pants: "#3a2a1a", pantsHi: "#4a3a2a", knee: "#2a1a0a", cuff: "#1a0a04",
  shoe: "#0a0808", shoeHi: "#2a1818", sole: "#f0ebe2",
  watch: "#3a8a8a", watchBand: "#1a1a1a", watchGlow: "#88e8e8",
  brBlack: "#2a2a2a", brBlackHi: "#5a5a5a", brBrown: "#6a4a2a", brBrownHi: "#8a6a3a",
  tattoo: "#1a3a4a",
  pack: "#3a2010", packDk: "#2a1608", strap: "#5a3a20", strapHi: "#7a5230", label: "#ffcc66",
  strain: "#ff6644",
};

function drawSamad(ctx, ox, oy, u, pose, frame, opts) {
  opts = opts || {};
  const showPack = opts.showPack !== false;
  const strain = opts.strain || 0;
  const r = (gx, gy, w, h, color) => drawRect(ctx, ox + gx * u, oy + gy * u, w * u, h * u, color);

  const watch = (wx, wy) => { r(wx, wy + 1, 3, 1, SK.watchBand); r(wx, wy, 3, 2, SK.watch); r(wx + 1, wy, 1, 1, SK.watchGlow); r(wx + 1, wy, 1, 1, "#fff"); };
  const bracelets = (wx, wy) => { r(wx, wy, 3, 1, SK.brBlack); r(wx, wy, 1, 1, SK.brBlackHi); r(wx + 2, wy, 1, 1, SK.brBlackHi); r(wx, wy + 1, 3, 1, SK.brBrown); r(wx + 1, wy + 1, 1, 1, SK.brBrownHi); };
  const tattoo = (tx, ty) => { r(tx, ty, 3, 1, SK.tattoo); r(tx, ty - 1, 1, 1, SK.tattoo); r(tx + 1, ty - 1, 1, 1, SK.tattoo); };

  const f4 = frame % 4;
  let bob = 0, expr = "calm", mouth = "calm", gazeX = 0;
  let footL = 7, footR = 14, liftL = 0, liftR = 0;
  let armMode = "down", sw = 0, armUp = 0, armOut = 0, sf = 0;

  if (pose === "idle") {
    bob = (Math.floor(frame / 8) % 2 === 0) ? 0 : -1;
    gazeX = (Math.floor(frame / 7) % 3) - 1;
  } else if (pose === "walk") {
    bob = (f4 === 1 || f4 === 3) ? -1 : 0; armMode = "walk"; sw = [2, 0, -2, 0][f4];
    footL = 7 + [-1.4, 0, 1.6, 0][f4]; footR = 14 + [1.6, 0, -1.4, 0][f4];
    liftL = [0, 0, 1, 0][f4]; liftR = [1, 0, 0, 0][f4];
  } else if (pose === "jump") {
    armMode = "jump"; expr = "surprise"; mouth = "open";
    footL = 8; footR = 13; liftL = 5; liftR = 5;
  } else if (pose === "pickup") {
    bob = 1; expr = "calm"; mouth = "calm"; armMode = "reach";
    footL = 6; footR = 15;
  } else if (pose === "look") {
    bob = -1; expr = "surprise"; mouth = "open";
  } else if (pose === "panic") {
    bob = [0, -1, 0, -1][f4]; expr = "panic"; mouth = "open";
    armMode = "panic"; armUp = [0, -3, -1, -4][f4]; armOut = [0, 1, 2, 1][f4];
    footL = 5; footR = 16;
  } else if (pose === "stuff") {
    sf = Math.floor(frame / 5) % 4; armMode = "stuff";
    bob = (sf === 2) ? -2 : 0;
    expr = sf === 2 ? "panic" : (sf === 1 ? "panic" : "calm");
    mouth = sf === 2 ? "open" : "calm";
    footL = 6; footR = 15;
  } else if (pose === "coffee") {
    bob = (Math.floor(frame / 14) % 2 === 0) ? 0 : -1;   // calm breathing
    expr = "calm"; mouth = "wry"; armMode = "coffee";
  } else if (pose === "defeat") {
    bob = (Math.floor(frame / 12) % 2 === 0) ? 0 : -1;
    expr = "wry"; mouth = "wry"; armMode = "cross";
  } else if (pose === "think") {
    bob = (Math.floor(frame / 12) % 2 === 0) ? -1 : 0;
    expr = "up"; mouth = "wry"; armMode = "think";
  }
  oy += bob;

  // (0) backpack bulk behind body
  if (showPack) {
    const bw = 4 + strain * 2;
    r(1 - strain, 21, bw, 9, SK.pack);
    r(1 - strain, 21, bw, 1, SK.packDk);
    r(1 - strain, 29, bw, 1, SK.packDk);
    r(2, 24, 2, 1, SK.label);
    r(5, 19, 1, 15, SK.strap);
    if (strain > 0.3) { r(0 - strain, 22, 1, 1, SK.strain); r(0 - strain, 26, 1, 1, SK.strain); r(5 + bw - 4, 23, 1, 1, SK.strain); }
  }

  // (1) legs / pants / shoes
  r(7, 33, 12, 5, SK.pants);
  const leg = (lx, lift) => {
    r(lx, 38, 5, 16 - lift, SK.pants);
    r(lx, 38, 1, 16 - lift, SK.pantsHi);
    r(lx, 46, 5, 1, SK.knee);
    r(lx, 53 - lift, 5, 1, SK.cuff);
    r(lx - 1, 54 - lift, 7, 3, SK.shoe);
    r(lx - 1, 54 - lift, 7, 1, SK.shoeHi);
    r(lx - 1, 56 - lift, 7, 1, SK.sole);
  };
  leg(footL, liftL); leg(footR, liftR);
  ctx.globalAlpha = 0.3; r(5, 57, 16, 1, "#000"); ctx.globalAlpha = 1;

  // (2) arms + accessories
  const armDown = (sx, acc) => { r(sx, 23, 3, 6, SK.skin); r(sx, 29, 3, 4, SK.skin); r(sx, 33, 3, 2, SK.skin); acc(sx, 31); };
  if (armMode === "cross") {
    r(5, 24, 13, 2, SK.skin); r(5, 26, 13, 2, SK.skinSh);
    r(4, 23, 3, 3, SK.skin); r(17, 23, 3, 3, SK.skin);
    bracelets(4, 24); tattoo(7, 23); watch(17, 24);
  } else if (armMode === "panic") {
    r(4, 16 + armUp, 3, 5, SK.skin); r(4 - armOut, 11 + armUp, 3, 5, SK.skin); r(4 - armOut, 9 + armUp, 3, 2, SK.skin);
    bracelets(4 - armOut, 9 + armUp); tattoo(4 - armOut, 8 + armUp);
    r(17, 16 + armUp, 3, 5, SK.skin); r(17 + armOut, 11 + armUp, 3, 5, SK.skin); r(17 + armOut, 9 + armUp, 3, 2, SK.skin);
    watch(17 + armOut, 9 + armUp);
  } else if (armMode === "jump") {
    r(4, 20, 3, 4, SK.skin); r(2, 16, 3, 4, SK.skin); r(2, 14, 3, 2, SK.skin);
    bracelets(2, 14); tattoo(2, 13);
    r(17, 20, 3, 4, SK.skin); r(19, 16, 3, 4, SK.skin); r(19, 14, 3, 2, SK.skin);
    watch(19, 14);
  } else if (armMode === "coffee") {
    r(4, 23, 3, 4, SK.skin); r(5, 26, 3, 4, SK.skin); r(7, 29, 3, 2, SK.skin);
    bracelets(7, 31); tattoo(7, 30);
    r(17, 23, 3, 4, SK.skin); r(16, 26, 3, 4, SK.skin); r(14, 29, 3, 2, SK.skin);
    watch(14, 31);
  } else if (armMode === "reach") {
    r(4, 23, 3, 5, SK.skin); r(4, 28, 3, 4, SK.skin); r(3, 31, 3, 3, SK.skin);
    bracelets(3, 32); tattoo(3, 31);
    r(17, 23, 3, 5, SK.skin); r(17, 28, 3, 4, SK.skin); r(18, 31, 3, 3, SK.skin);
    watch(18, 32);
  } else if (armMode === "think") {
    armDown(4, (wx, wy) => { bracelets(wx, wy); tattoo(wx, wy - 1); });
    r(17, 23, 3, 4, SK.skin); r(15, 18, 3, 5, SK.skin); r(14, 15, 3, 3, SK.skin); watch(15, 18);
  } else if (armMode === "walk") {
    const dx = sw;
    r(4, 23, 3, 4, SK.skin); r(4 + dx, 27, 3, 4, SK.skin); r(4 + dx, 31, 3, 2, SK.skin);
    bracelets(4 + dx, 30); tattoo(4 + dx, 29);
    r(17, 23, 3, 4, SK.skin); r(17 - dx, 27, 3, 4, SK.skin); r(17 - dx, 31, 3, 2, SK.skin);
    watch(17 - dx, 30);
  } else if (armMode === "stuff") {
    const cfg = [
      { l: [6, 22, 10, 25], r: [13, 22, 11, 25] },   // 3a reach in
      { l: [2, 22, 1, 26], r: [19, 22, 20, 26] },    // 3b stretch out
      { l: [2, 16, 0, 13], r: [19, 16, 21, 13] },    // 3c explode up
      { l: [6, 23, 9, 26], r: [13, 23, 12, 26] },    // 3d gather
    ][sf];
    r(cfg.l[0], 22, 3, 5, SK.skin); r(cfg.l[2], cfg.l[3], 3, 3, SK.skin);
    r(cfg.r[0], 22, 3, 5, SK.skin); r(cfg.r[2], cfg.r[3], 3, 3, SK.skin);
    bracelets(cfg.l[2], cfg.l[3] + 1); tattoo(cfg.l[2], cfg.l[3]);
    watch(cfg.r[2], cfg.r[3] + 1);
  } else {
    armDown(4, (wx, wy) => { bracelets(wx, wy); tattoo(wx, wy - 1); });
    armDown(17, watch);
  }

  // (3) torso (tank)
  r(4, 19, 4, 4, SK.skin); r(18, 19, 4, 4, SK.skin);
  r(7, 19, 12, 14, SK.tank);
  r(7, 19, 1, 14, SK.tankHi); r(8, 19, 11, 1, SK.tankHi);
  r(8, 18, 2, 1, SK.tank); r(16, 18, 2, 1, SK.tank);
  r(12, 20, 2, 1, SK.skinSh);
  if (armMode === "stuff" && sf === 1) { r(9, 22, 1, 6, "#000"); r(15, 22, 1, 6, "#000"); } // flexed
  if (showPack) {
    r(9, 19, 1, 14, SK.strap); r(16, 19, 1, 14, SK.strap); r(9, 19, 1, 14, SK.strapHi);
    r(9, 28, 5, 3, SK.pack);
    if (u >= 2) pixelText(ctx, ox + 9.4 * u, oy + 28.6 * u, "5MB", Math.max(1, Math.round(u * 0.6)), SK.label);
  }

  // (4) head + beard
  r(10, 17, 6, 2, SK.skinSh);
  r(6, 0, 14, 12, SK.skin); r(4, 4, 18, 6, SK.skin);
  r(9, 1, 3, 2, SK.skinHi); r(12, 1, 1, 1, SK.skinHi);
  r(3, 6, 1, 3, SK.skinSh); r(22, 6, 1, 3, SK.skinSh);
  r(8, 4, 4, 1, SK.beard); r(14, 4, 4, 1, SK.beard);
  r(5, 9, 16, 6, SK.beard); r(7, 15, 12, 2, SK.beard);
  r(4, 10, 1, 4, SK.beard); r(21, 10, 1, 4, SK.beard);
  r(6, 11, 1, 2, SK.beardHi); r(19, 11, 1, 2, SK.beardHi);
  r(10, 9, 6, 1, SK.beardDk);

  // (5) face
  r(9, 6, 2, 2, "#1a1010"); r(15, 6, 2, 2, "#1a1010");
  r(10 + gazeX, 6, 1, 1, "#fff"); r(16 + gazeX, 6, 1, 1, "#fff");
  if (expr === "panic") { r(9, 5, 3, 1, SK.beard); r(9, 4, 1, 1, SK.beard); r(14, 5, 3, 1, SK.beard); r(17, 4, 1, 1, SK.beard); }
  else if (expr === "up" || expr === "surprise") { r(9, 3, 3, 1, SK.beard); r(15, 3, 3, 1, SK.beard); }
  if (mouth === "open") { r(11, 12, 4, 2, "#5a1810"); r(11, 12, 4, 1, "#e8d8c0"); }
  else if (mouth === "wry") { r(11, 12, 4, 1, "#3a1a18"); r(14, 11, 1, 1, "#8a4a3a"); }
  else { r(11, 12, 4, 1, "#3a1a18"); r(12, 13, 2, 1, "#8a4a3a"); }

  // (6) coffee mug held in both hands (drawn on top)
  if (armMode === "coffee") {
    r(8, 29, 8, 5, "#efe9dd"); r(8, 29, 8, 1, "#fffaf0"); r(8, 33, 8, 1, "#c8c0b0");
    r(9, 30, 6, 2, "#4a2a14");                 // coffee surface
    r(16, 30, 2, 3, "#c8c0b0");                // handle
    r(11, 31, 2, 1, "#a8744a");                // tiny logo
    r(7, 30, 1, 3, SK.skin); r(15, 30, 1, 3, SK.skin);   // thumbs gripping
  }
}

// ── Layout ─────────────────────────────────────────────────────────────────────
const W = 480, H = 270, GROUND_Y = 212;
const SAMAD_S = 2;
const SAMAD_W = 24 * SAMAD_S;            // 48
const SAMAD_FEET = 58 * SAMAD_S;         // 116
const SAMAD_TOP = GROUND_Y - SAMAD_FEET; // room floor stance
const SAMAD_CENTER_X = W / 2 - SAMAD_W / 2;
const RUN_SCREEN_X = 150 - SAMAD_W / 2;  // pinned screen x while running
const CITY_FLOOR = 224;                  // ground-plane top in Frame 2 (below all platforms)
const CITY_S = 1;                        // Samad is rendered smaller in the platformer for scale
const CITY_FEET = 58 * CITY_S;
const CITY_W = 24 * CITY_S;

// ── Backgrounds ────────────────────────────────────────────────────────────────
function drawSmallPack(ctx, x, y) {
  drawRect(ctx, x + 3, y - 3, 2, 3, C.packStrap);
  drawRect(ctx, x + 13, y - 3, 2, 3, C.packStrap);
  drawRect(ctx, x, y, 18, 15, C.pack);
  drawRect(ctx, x, y, 18, 2, C.packDk);
  drawRect(ctx, x, y + 13, 18, 2, C.packDk);
  drawRect(ctx, x + 3, y + 5, 12, 6, C.packLabel);
  pixelText(ctx, x + 4, y + 6, "5MB", 2, C.textDk);
}

function drawHeart(ctx, cx, cy, s, color, alpha) {
  ctx.globalAlpha = clamp(alpha, 0, 1);
  const rows = [" # # ", "#####", "#####", " ### ", "  #  "];
  for (let r = 0; r < rows.length; r++)
    for (let c = 0; c < 5; c++)
      if (rows[r][c] === "#") drawRect(ctx, cx + (c - 2.5) * s, cy + r * s, s, s, color);
  ctx.globalAlpha = 1;
}

function drawCoffeeShop(ctx, t) {
  // warm wall + subtle dotted texture
  drawRect(ctx, 0, 0, W, GROUND_Y, "#4a2c1a");
  drawRect(ctx, 0, 0, W, 70, "#553320");
  ctx.globalAlpha = 0.5;
  for (let y = 14; y < GROUND_Y - 6; y += 20)
    for (let x = 12 + ((y / 20) % 2) * 14; x < W; x += 28) drawRect(ctx, x, y, 2, 2, "#3a2212");
  ctx.globalAlpha = 1;

  // string lights across the top
  for (let x = -10; x < W; x += 4) {
    const sag = Math.sin((x + 40) * 0.018) * 6 + 8;
    drawRect(ctx, x, sag, 2, 1, "#2a1a0e");
  }
  for (let i = 0, x = 16; x < W; x += 60, i++) {
    const sag = Math.sin((x + 40) * 0.018) * 6 + 10;
    const tw = 0.55 + Math.sin(t * 3 + i) * 0.45;
    const col = ["#ffd27a", "#ff9a5a", "#ffe6a0", "#ffb070"][i % 4];
    ctx.globalAlpha = tw; drawRect(ctx, x - 2, sag, 5, 5, col); ctx.globalAlpha = tw * 0.4; drawRect(ctx, x - 3, sag - 1, 7, 7, col); ctx.globalAlpha = 1;
    drawRect(ctx, x, sag - 2, 1, 2, "#2a1a0e");
  }

  // window with sea + sun (left)
  drawRect(ctx, 70, 50, 110, 96, "#2a1810");
  drawRect(ctx, 74, 54, 102, 88, "#9fd0e8");
  const wg = ctx.createLinearGradient(0, 54, 0, 142);
  wg.addColorStop(0, "#bfe2f0"); wg.addColorStop(0.5, "#dfeef2"); wg.addColorStop(0.55, "#6fa9c8"); wg.addColorStop(1, "#3f7ba0");
  ctx.fillStyle = wg; ctx.fillRect(74, 54, 102, 88);
  drawRect(ctx, 142, 64, 16, 16, "#fdf3c8");                 // sun
  ctx.globalAlpha = 0.4; drawRect(ctx, 139, 61, 22, 22, "#fdf3c8"); ctx.globalAlpha = 1;
  for (let i = 0; i < 4; i++) { ctx.globalAlpha = 0.4; drawRect(ctx, 80 + i * 22, 112 + (i % 2) * 4, 14, 3, "#dfeef2"); ctx.globalAlpha = 1; }  // waves
  drawRect(ctx, 86, 124, 18, 8, "#5a8a4a");                  // little island
  drawRect(ctx, 122, 50, 4, 92, "#2a1810"); drawRect(ctx, 74, 96, 102, 4, "#2a1810");

  // hanging lamp (center) with glow
  drawRect(ctx, W / 2 - 1, 0, 2, 30, "#2a1a0e");
  drawRect(ctx, W / 2 - 12, 30, 24, 18, "#3a2412");
  drawRect(ctx, W / 2 - 9, 33, 18, 12, "#ffcf86");
  drawRect(ctx, W / 2 - 5, 36, 10, 8, "#fff0c8");
  ctx.globalAlpha = 0.16; drawRect(ctx, W / 2 - 26, 46, 52, 70, "#ffdd99"); ctx.globalAlpha = 1;

  // chalkboard with a pipeline diagram (right)
  const bx = 300, by = 56, bw = 150, bh = 78;
  drawRect(ctx, bx - 4, by - 4, bw + 8, bh + 8, "#3a2412");
  drawRect(ctx, bx, by, bw, bh, "#1d3a2c");
  ctx.globalAlpha = 0.18; for (let y = by + 8; y < by + bh; y += 9) drawRect(ctx, bx + 4, y, bw - 8, 1, "#8fc0a8"); ctx.globalAlpha = 1;
  const boxes = [{ x: 18, y: 26, w: 26, h: 16 }, { x: 58, y: 22, w: 34, h: 22 }, { x: 106, y: 26, w: 28, h: 16 }];
  boxes.forEach((b, i) => {
    drawRect(ctx, bx + b.x, by + b.y, b.w, b.h, "#214a36");
    drawRect(ctx, bx + b.x, by + b.y, b.w, b.h, ["#8fc0a8", "#cfe9da", "#8fc0a8"][i]);
    drawRect(ctx, bx + b.x + 2, by + b.y + 2, b.w - 4, b.h - 4, "#1d3a2c");
  });
  drawRect(ctx, bx + 44, by + 33, 14, 2, "#cfe9da"); drawRect(ctx, bx + 56, by + 31, 2, 2, "#cfe9da"); drawRect(ctx, bx + 56, by + 35, 2, 2, "#cfe9da");
  drawRect(ctx, bx + 92, by + 33, 14, 2, "#cfe9da"); drawRect(ctx, bx + 104, by + 31, 2, 2, "#cfe9da"); drawRect(ctx, bx + 104, by + 35, 2, 2, "#cfe9da");
  for (let i = 0; i < 3; i++) drawRect(ctx, bx + 70 + i * 6, by + 52, 3, 3, "#cfe9da");

  // floor (wooden planks)
  drawRect(ctx, 0, GROUND_Y, W, H - GROUND_Y, "#7a4f2c");
  drawRect(ctx, 0, GROUND_Y, W, 3, "#9a6a3a");
  for (let x = 0; x < W; x += 30) drawRect(ctx, x, GROUND_Y, 1, H - GROUND_Y, "#5a3a20");
  for (let y = GROUND_Y + 12; y < H; y += 14) { ctx.globalAlpha = 0.4; drawRect(ctx, 0, y, W, 1, "#5a3a20"); ctx.globalAlpha = 1; }

  // small table + cup (left foreground)
  drawRect(ctx, 60, 188, 56, 6, "#5a3a20"); drawRect(ctx, 60, 188, 56, 2, "#7a5230");
  drawRect(ctx, 66, 194, 4, 18, "#4a2e18"); drawRect(ctx, 106, 194, 4, 18, "#4a2e18");
  drawRect(ctx, 80, 180, 10, 8, "#efe9dd"); drawRect(ctx, 81, 181, 8, 2, "#4a2a14"); drawRect(ctx, 90, 182, 2, 3, "#c8c0b0");
  ctx.globalAlpha = 0.5; drawRect(ctx, 84, 176, 1, 4, "#cfc7b6"); ctx.globalAlpha = 1;   // steam

  // stool (right foreground)
  drawRect(ctx, 410, 184, 22, 5, "#5a3a20"); drawRect(ctx, 414, 189, 3, 23, "#4a2e18"); drawRect(ctx, 425, 189, 3, 23, "#4a2e18");
}

function drawRoom(ctx, t, withDoor) {
  drawRect(ctx, 0, 0, W, GROUND_Y, "#6a4632");
  drawRect(ctx, 0, 0, W, 64, "#5e3d2a");
  drawRect(ctx, 0, GROUND_Y - 4, W, 4, "#4a2e1c");
  drawRect(ctx, 0, GROUND_Y, W, H - GROUND_Y, "#8a6040");
  for (let x = 0; x < W; x += 26) drawRect(ctx, x, GROUND_Y, 1, H - GROUND_Y, "#6a4528");
  for (let y = GROUND_Y + 8; y < H; y += 10) { ctx.globalAlpha = 0.4; drawRect(ctx, 0, y, W, 1, "#6a4528"); ctx.globalAlpha = 1; }
  // window + light
  drawRect(ctx, 34, 46, 74, 70, "#3a2418");
  drawRect(ctx, 38, 50, 66, 62, "#bcd8ee");
  drawRect(ctx, 38, 86, 66, 26, "#ffe2ad");
  drawRect(ctx, 86, 56, 10, 10, "#fff6d8");
  drawRect(ctx, 68, 50, 2, 62, "#3a2418"); drawRect(ctx, 38, 80, 66, 2, "#3a2418");
  ctx.globalAlpha = 0.1; drawRect(ctx, 60, GROUND_Y, 120, 6, "#fff2c8"); drawRect(ctx, 80, GROUND_Y + 6, 90, 8, "#fff2c8"); ctx.globalAlpha = 1;
  // faded furniture silhouettes
  ctx.globalAlpha = 0.35;
  drawRect(ctx, 150, 150, 40, 62, "#3a2418"); drawRect(ctx, 150, 150, 40, 4, "#2a1810");
  ctx.globalAlpha = 1;
  if (withDoor) {
    const dx = 384, dy = 60, dw = 64;
    drawRect(ctx, dx - 6, dy - 6, dw + 12, GROUND_Y - dy + 6, "#2a1810");
    drawRect(ctx, dx, dy, dw, GROUND_Y - dy, "#2a1a0a");
    const pulse = 0.55 + Math.sin(t * 2) * 0.25;
    ctx.globalAlpha = pulse * 0.5; drawRect(ctx, dx + dw / 2 - 12, 150, 24, 50, "#ffdd99");
    ctx.globalAlpha = pulse; drawRect(ctx, dx + dw / 2 - 5, 158, 10, 34, "#ffe9bb"); ctx.globalAlpha = 1;
    drawRect(ctx, dx, GROUND_Y - 3, dw, 3, "#4a3320");
  }
}

function drawSignalTower(ctx, x, baseY, h, t) {
  drawRect(ctx, x, baseY - h, 4, h, "#808080");
  drawRect(ctx, x + 1, baseY - h, 1, h, "#9a9a9a");
  for (let i = 0; i < 4; i++) drawRect(ctx, x - 2, baseY - h + 10 + i * Math.floor(h / 5), 8, 1, "#606060"); // cross-bracing
  const topY = baseY - h;
  drawRect(ctx, x - 6, topY, 16, 1, "#808080");   // antenna arm
  const pulse = 0.3 + (Math.sin(t * (2 * Math.PI / 1.5)) * 0.5 + 0.5) * 0.5;
  for (let i = 0; i < 3; i++) {
    ctx.globalAlpha = clamp(pulse - i * 0.12, 0, 1);
    const rw = 6 + i * 5;
    drawRect(ctx, x + 2 - rw / 2, topY - 5 - i * 3, rw, 1, "#ff6644");
  }
  ctx.globalAlpha = 1;
}
function drawBillboard(ctx, x, y, bg, text, groundY) {
  const w = 56, h = 24;
  // support pole down to the ground plane
  drawRect(ctx, x + w / 2 - 2, y + h, 4, groundY - (y + h), "#4a3320");
  drawRect(ctx, x + w / 2 - 1, y + h, 1, groundY - (y + h), "#6a4a30");
  drawRect(ctx, x + w / 2 - 4, groundY - 2, 8, 2, "#3a2410");
  ctx.globalAlpha = 0.4; drawRect(ctx, x + 3, y + 3, w, h, "#2a1a0a"); ctx.globalAlpha = 1; // shadow
  drawRect(ctx, x - 2, y - 2, w + 4, h + 4, "#5a3a18");      // wood frame
  drawRect(ctx, x, y, w, h, bg);
  drawRect(ctx, x, y + h - 2, w, 2, "#2a1a0a");              // bottom edge
  ctx.fillStyle = "#ffffff";
  ctx.font = '6px "Press Start 2P", monospace';
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText(text, x + w / 2, y + h / 2);
  ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
}

// Mid-layer fixtures (world x). Parallax 0.5, planted on the ground plane.
const TOWERS = [{ x: 40, h: 64 }, { x: 250, h: 74 }, { x: 460, h: 60 }, { x: 660, h: 70 }];
const BILLBOARDS = [
  { x: 130, y: 92,  bg: "#ff6644", t: "PLAYABLE" },
  { x: 330, y: 78,  bg: "#44aaff", t: "GAME" },
  { x: 540, y: 96,  bg: "#44ffaa", t: "ASSETS" },
  { x: 740, y: 82,  bg: "#ffaa44", t: "COLLECT" },
];

function drawCity(ctx, camX, t) {
  // Layer 1 — far sky (gradient to a hazy horizon)
  const g = ctx.createLinearGradient(0, 0, 0, CITY_FLOOR + 10);
  g.addColorStop(0, "#87ceeb"); g.addColorStop(0.65, "#b8c6c2"); g.addColorStop(1, "#d8c8ac");
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

  // Layer 1b — distant skyline (parallax 0.3): evenly spaced, hazy, on the horizon
  const sx3 = camX * 0.3, span = 56;
  ctx.globalAlpha = 0.4;
  const start = Math.floor(sx3 / span) - 1;
  for (let i = start; i < start + W / span + 3; i++) {
    const bx = i * span - sx3;
    const h = 34 + Math.abs(Math.sin(i * 1.7)) * 44;
    const bw = 40 + Math.abs(Math.cos(i * 2.1)) * 8;
    drawRect(ctx, bx, CITY_FLOOR - h, bw, h, "#7e8a90");
    drawRect(ctx, bx, CITY_FLOOR - h, bw, 2, "#9aa6ac");
    for (let wy = CITY_FLOOR - h + 6; wy < CITY_FLOOR - 6; wy += 9)
      for (let wx = bx + 5; wx < bx + bw - 4; wx += 9) drawRect(ctx, wx, wy, 3, 4, "#5a666c");
  }
  ctx.globalAlpha = 1;

  // Ground plane (the floor everything stands on)
  const gp = ctx.createLinearGradient(0, CITY_FLOOR, 0, H);
  gp.addColorStop(0, "#9a6a3a"); gp.addColorStop(0.28, "#6a4520"); gp.addColorStop(1, "#3a2410");
  ctx.fillStyle = gp; ctx.fillRect(0, CITY_FLOOR, W, H - CITY_FLOOR);
  drawRect(ctx, 0, CITY_FLOOR, W, 2, "#b88a52");            // lit ground edge
  const tile = 18, tx = -((((camX) % tile) + tile) % tile);
  ctx.globalAlpha = 0.5;
  for (let i = -1; i < W / tile + 2; i++) drawRect(ctx, tx + i * tile, CITY_FLOOR + 4, 1, H - CITY_FLOOR, "#2a1808");
  ctx.globalAlpha = 1;

  // Layer 2 — towers & billboards (parallax 0.5), planted on the ground plane
  const mx = camX * 0.5;
  for (const tw of TOWERS) { const sx = tw.x - mx; if (sx > -20 && sx < W + 20) drawSignalTower(ctx, sx, CITY_FLOOR, tw.h, t); }
  for (const bb of BILLBOARDS) { const sx = bb.x - mx; if (sx > -70 && sx < W + 20) drawBillboard(ctx, sx, bb.y, bb.bg, bb.t, CITY_FLOOR); }

  // Layer 3 — platforms (parallax 1.0), raised above the ground plane
  for (let pi = 0; pi < PLATS.length; pi++) {
    const p = PLATS[pi];
    let sx = p.x - camX;
    let sy = p.y;
    if (p.t === "f") sy += Math.sin(t * 2 + pi) * 2;        // floating bob
    if (sx + p.w < -10 || sx > W + 10) continue;
    if (p.t === "g") {
      drawRect(ctx, sx, sy + 8, p.w, CITY_FLOOR - sy - 4, "#4a2a10");  // support pillar to ground
      drawRect(ctx, sx, sy + 8, 2, CITY_FLOOR - sy - 4, "#5a3a1c");
      drawRect(ctx, sx, sy, p.w, 8, "#5a3a18");
      drawRect(ctx, sx, sy, p.w, 2, "#7a5a38");
      drawRect(ctx, sx, sy + 7, p.w, 1, "#2a1a0a");
    } else {
      ctx.globalAlpha = 0.25; drawRect(ctx, sx + 3, sy + 9, p.w, 2, "#000"); ctx.globalAlpha = 1;
      drawRect(ctx, sx, sy, p.w, 6, "#4a6a8a");
      drawRect(ctx, sx, sy, p.w, 2, "#6a8aaa");
      drawRect(ctx, sx, sy + 5, p.w, 1, "#2a3a4a");
    }
  }
}

function drawCounter(ctx, n) {
  ctx.fillStyle = C.gold;
  ctx.font = '8px "Press Start 2P", monospace';
  ctx.textAlign = "right"; ctx.textBaseline = "top";
  ctx.fillText("COLLECTED:" + n, W - 8, 8);
  ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
}

function speechBubble(ctx, anchorX, anchorY, lf, line) {
  const grow = easeOutBack(clamp(lf / 5, 0, 1));
  const wob = Math.sin(lf * 0.35) * 1.5;
  const fontPx = 8;
  ctx.font = fontPx + 'px "Press Start 2P", monospace';
  const bw = Math.ceil(ctx.measureText(line).width) + 20;
  const bh = 28, by = anchorY - bh - 16;
  let bx = anchorX - bw / 2 + wob;
  bx = clamp(bx, 4, W - bw - 4);
  for (let i = 0; i < 3; i++) {
    const rr = 4 - i, px = anchorX - 4 + i * 4 + wob * 0.5, py = by + bh + 2 + i * 6;
    drawRect(ctx, px - rr, py - rr, rr * 2, rr * 2, C.bubbleBorder);
    drawRect(ctx, px - rr + 1, py - rr + 1, rr * 2 - 2, rr * 2 - 2, C.bubble);
  }
  ctx.save();
  ctx.translate(bx + bw / 2, by + bh / 2); ctx.scale(grow, grow); ctx.translate(-(bx + bw / 2), -(by + bh / 2));
  drawRect(ctx, bx - 2, by - 2, bw + 4, bh + 4, C.bubbleBorder);
  drawRect(ctx, bx, by, bw, bh, C.bubble);
  ctx.fillStyle = C.textDk; ctx.font = fontPx + 'px "Press Start 2P", monospace';
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText(line, bx + bw / 2, by + bh / 2);
  ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
  ctx.restore();
}

// ── Frame 3 burst configs ──────────────────────────────────────────────────────
const BURSTS = [
  { i: 0, launch: 0.3, dur: 0.7, ex: 92,  ey: 200, peak: 40, b: 3 },
  { i: 1, launch: 0.6, dur: 0.7, ex: 430, ey: 188, peak: 36, b: 3 },
  { i: 2, launch: 0.9, dur: 0.8, ex: 238, ey: 205, peak: 55, b: 2 },
  { i: 3, launch: 1.2, dur: 0.7, ex: 120, ey: 208, peak: 26, b: 3 },
  { i: 4, launch: 1.0, dur: 0.7, ex: 396, ey: 205, peak: 30, b: 3 },
  { i: 5, launch: 1.4, dur: 0.7, ex: 150, ey: 198, peak: 46, b: 2 },
];
const BURST_ORIGIN = { x: 222, y: 150 };

// ═════════════════════════════════════════════════════════════════════════════
//  MAIN SCENE DISPATCH
// ═════════════════════════════════════════════════════════════════════════════
function drawTinyBackpack(ctx, frame) {
  const t = frame / FPS;
  ctx.imageSmoothingEnabled = false;

  // ===== FRAME 1 — Leaving the room =====
  if (frame < FR.S2) {
    drawRoom(ctx, t, true);
    if (frame < FR.S1B) {
      drawSamad(ctx, SAMAD_CENTER_X, SAMAD_TOP, SAMAD_S, "idle", frame, { showPack: false });
      if (frame < 6) whiteFlash(ctx, 1 - frame / 6);
    } else if (frame < FR.S1C) {
      const k = (frame - FR.S1B) / (FR.S1C - FR.S1B);
      const dip = (k < 0.5 ? lerp(0, 4, k / 0.5) : lerp(4, 0, (k - 0.5) / 0.5));
      const settled = k > 0.8;
      drawSamad(ctx, SAMAD_CENTER_X, SAMAD_TOP + dip, SAMAD_S, "pickup", frame, { showPack: settled });
      if (!settled) {
        const ap = clamp((k - 0.32) / 0.48, 0, 1);
        drawSmallPack(ctx, lerp(232, 214, ap), lerp(196, 134, ap) - Math.sin(ap * Math.PI) * 28);
      } else dustCloud(ctx, 222, 142, frame - (FR.S1B + 9), 8);
    } else {
      const walkK = clamp((frame - FR.S1C) / 18, 0, 1);
      const x = lerp(SAMAD_CENTER_X, 348, easeInOut(walkK));
      drawSamad(ctx, x, SAMAD_TOP, SAMAD_S, walkK < 1 ? "walk" : "idle", frame, { showPack: true });
    }
    return;
  }

  // ===== FRAME 2 — Platformer city =====
  if (frame < FR.S3) {
    const p = (frame - FR.S2) / (FR.S3 - FR.S2 - 1);   // 0..1
    const worldX = lerp(20, 640, p);
    const camX = worldX - 150;
    drawCity(ctx, camX, t);

    // assets (collect as Samad passes)
    let collected = 0;
    for (const a of GASSETS) {
      const dx = worldX - (a.wx + 8);
      if (dx >= 0) collected++;
      const ax = a.wx - camX, ay = a.wy;
      if (ax < -24 || ax > W + 24) continue;
      if (dx < -2) {
        drawGameAsset(ctx, ax, ay + Math.sin(t * 4 + a.plat) * 2, a, 0.4 + Math.sin(t * 8) * 0.25);
      } else if (dx < 16) {
        const ap = clamp((dx + 2) / 18, 0, 1);
        drawGameAsset(ctx, ax, ay - ap * 8, a, 1 - ap, 1 - ap * 0.6);
        sparkles(ctx, ax + 8, ay - ap * 8, ap, a.plat * 13, a.color);
      }
    }

    const fy = feetYAt(worldX);
    drawSamad(ctx, 150 - CITY_W / 2, fy.y - CITY_FEET, CITY_S, fy.air ? "jump" : "walk", frame, { showPack: true });
    drawCounter(ctx, collected);
    return;
  }

  // ===== FRAME 3 — Stuffing / doesn't fit =====
  if (frame < FR.S4) {
    const lf = frame - FR.S3;          // 0..71
    const lt = lf / FPS;               // 0..3 s

    // escalating screen shake
    let inten = 0.5;
    if (lt < 1) inten = 0.5 + lt;
    else if (lt < 1.5) inten = 1.5 + (lt - 1) * 2;
    else inten = Math.max(0.4, 2.5 - (lt - 1.5) * 3);
    const shakeX = Math.round(Math.sin(frame * 0.4) * inten);
    const shakeY = Math.round(Math.cos(frame * 0.5) * inten * 0.5);

    ctx.save();
    ctx.translate(shakeX, shakeY);
    drawRoom(ctx, t, false);

    const stuffing = lf < 36;          // 6.0–7.5s stuffing, then defeated
    const strain = stuffing ? (0.4 + 0.6 * Math.abs(Math.sin(lf * 0.4))) : 0;

    // bursting / settled items
    for (const bz of BURSTS) {
      const a = GASSETS[bz.i];
      const ft = lt - bz.launch;
      if (ft < 0) continue;            // still "inside" the pack
      if (ft <= bz.dur) {
        const pos = bounceTrajectory(BURST_ORIGIN.x, BURST_ORIGIN.y, bz.ex, bz.ey, ft, bz.dur, bz.b, bz.peak);
        drawGameAsset(ctx, pos.x, pos.y, a, 0.5 + Math.sin(t * 12 + bz.i) * 0.3);
        if (ft > bz.dur - 0.06) dustCloud(ctx, pos.x + 8, bz.ey + 14, lf, 4);
      } else {
        ctx.globalAlpha = 0.75;
        drawGameAsset(ctx, bz.ex, bz.ey, a, 0.2);
        ctx.globalAlpha = 1;
      }
    }

    if (lf >= 30 && lf <= 40) boing(ctx, W / 2 + 30, GROUND_Y - 60, lf - 30);
    if (stuffing) dustCloud(ctx, SAMAD_CENTER_X + SAMAD_W / 2, GROUND_Y - 40, lf, Math.round(inten * 3));

    drawSamad(ctx, SAMAD_CENTER_X, SAMAD_TOP, SAMAD_S, stuffing ? "stuff" : "defeat", frame, { showPack: true, strain });

    if (lt >= 1.5) speechBubble(ctx, SAMAD_CENTER_X + SAMAD_W / 2, SAMAD_TOP - 2, lf - 36, "THESE DON'T FIT!");
    ctx.restore();
    return;
  }

  // ===== FRAME 4 — Coffee & reflection =====
  const lf = frame - FR.S4;            // 0..71
  drawCoffeeShop(ctx, t);

  // gentle fade-in from the chaos of Frame 3
  drawSamad(ctx, SAMAD_CENTER_X, SAMAD_TOP, SAMAD_S, "coffee", frame, { showPack: true });

  // floating heart that rises, pulses, and fades — then repeats
  const hc = SAMAD_CENTER_X + 12 * SAMAD_S;
  const cyc = lf % 40;
  const rise = cyc / 40;
  const hs = 2 + (Math.sin(lf * 0.5) > 0 ? 1 : 0);
  drawHeart(ctx, hc, SAMAD_TOP - 14 - rise * 26, hs, "#ff5a6a", clamp(1 - rise, 0, 1) * 0.9);

  // mug steam
  ctx.globalAlpha = 0.45;
  for (let i = 0; i < 3; i++) {
    const sy = SAMAD_TOP + 56 - ((lf * 1.5 + i * 7) % 22);
    drawRect(ctx, hc - 4 + Math.sin((lf + i * 5) * 0.4) * 2, sy, 2, 2, "#e8e2d6");
  }
  ctx.globalAlpha = 1;

  if (lf < 6) whiteFlash(ctx, 1 - lf / 6);   // fade in
  if (frame >= FR.RESET) whiteFlash(ctx, (frame - FR.RESET) / (FR.TOTAL - FR.RESET));   // loop reset
}

// ── Scene label ────────────────────────────────────────────────────────────────
function sceneLabel(frame) {
  if (frame < FR.S2) return "FRAME 1 — LEAVING FOR PLAYABLE ADVENTURE";
  if (frame < FR.S3) return "FRAME 2 — COLLECTING PLAYABLE ASSETS";
  if (frame < FR.S4) return "FRAME 3 — FITTING THE ASSETS IN PLAYABLE";
  return "FRAME 4 — IS THE 5MB LIMIT STILL THE BEST?";
}

Object.assign(window, { drawTinyBackpack, sceneLabel, FR, FPS });
