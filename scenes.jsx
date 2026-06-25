// scenes.jsx — "Same Build. Different Verdicts." · ref layout · 512×512 → 1080
const VERDICTS = { DURATION: 10.5, FPS: 8, G: 512, OUT: 1080 };

const P = {
  bg: "#080810",
  wall: "#101018",
  wallHi: "#181824",
  wallLine: "#222230",
  pinstripe: "#1a1a24",
  bench: "#484858",
  benchHi: "#5a5a6c",
  benchGroove: "#363644",
  benchEdge: "#6a6a7c",
  desk: "#404050",
  deskTop: "#525264",
  deskFront: "#2c2c38",
  monitor: "#14141c",
  bezel: "#303040",
  screenOff: "#0c0c12",
  screenOk: "#102018",
  screenErr: "#301010",
  screenErrAlt: "#481818",
  cable: "#5090c8",
  cableHi: "#90d0f8",
  cableDim: "#304860",
  machine: "#4a4a5c",
  machineHi: "#626274",
  machineSide: "#363644",
  slot: "#12121a",
  cart: "#e8e8f0",
  cartDk: "#686878",
  cartLbl: "#101018",
  cartBody: "#505060",
  cartHi: "#787888",
  skin: "#f0d8b8",
  skinHi: "#fff0e0",
  skinSh: "#c8a080",
  skinDk: "#a87858",
  nail: "#fff4e8",
  sleeve: "#344860",
  text: "#f0f0f8",
  dim: "#888898",
  applovin: "#40c868",
  google: "#58a8f0",
  meta: "#4888f0",
  iron: "#f0a830",
  gRed: "#e84040",
  gYellow: "#e8c840",
  gBlue: "#4080e8",
  gGreen: "#40c060",
  ok: "#48e078",
  okDim: "#287848",
  err: "#f04848",
  errTxt: "#ffe8e8",
  code: "#68a878",
  codeErr: "#e86868",
  logErr: "#f06060",
  logOk: "#60e080",
  logWarn: "#e8c050",
  outline: "#000000",
  shadow: "#14141c",
};

const STATIONS = [
  {
    col: 0,
    ok: true,
    accent: P.applovin,
    lines: ["RUNNING"],
    block: "L",
    blockColor: P.applovin,
    machine: "applovin",
    miniOk: "PLAY",
  },
  {
    col: 1,
    ok: false,
    accent: P.google,
    lines: ["SDK ERROR", "GAME END NOT", "DETECTED"],
    block: "T",
    blockColor: P.gYellow,
    machine: "google",
    miniOk: "ERROR",
  },
  {
    col: 2,
    ok: false,
    accent: P.meta,
    lines: ["END CARD", "CTA FAILED"],
    block: "SQ",
    blockColor: "#606070",
    machine: "meta",
    miniOk: null,
  },
  {
    col: 3,
    ok: true,
    accent: P.iron,
    lines: ["ADS SDK", "INIT OK"],
    block: "Z",
    blockColor: P.applovin,
    machine: "iron",
    miniOk: null,
  },
];

const COL_W = 120,
  MW = 100,
  MH = 74,
  CW = 88,
  CH = 50;
const BENCH = { y0: 206, y1: 222 };
const CRT = { x: 168, y: 282, w: 176, h: 88 };
const FLOOR_TOP = 244;

const GLYPH = {
  " ": ["     ", "     ", "     ", "     ", "     "],
  A: [" ### ", "#   #", "#####", "#   #", "#   #"],
  B: ["#### ", "#   #", "#### ", "#   #", "#### "],
  C: [" ### ", "#    ", "#    ", "#    ", " ### "],
  D: ["#### ", "#   #", "#   #", "#   #", "#### "],
  E: ["#####", "#    ", "#### ", "#    ", "#####"],
  F: ["#####", "#    ", "#### ", "#    ", "#    "],
  G: [" ### ", "#    ", "#  ##", "#   #", " ### "],
  H: ["#   #", "#   #", "#####", "#   #", "#   #"],
  I: [" ### ", "  #  ", "  #  ", "  #  ", " ### "],
  K: ["#   #", "#  # ", "###  ", "#  # ", "#   #"],
  L: ["#    ", "#    ", "#    ", "#    ", "#####"],
  M: ["#   #", "## ##", "# # #", "#   #", "#   #"],
  N: ["#   #", "##  #", "# # #", "#  ##", "#   #"],
  O: [" ### ", "#   #", "#   #", "#   #", " ### "],
  P: ["#### ", "#   #", "#### ", "#    ", "#    "],
  R: ["#### ", "#   #", "#### ", "#  # ", "#   #"],
  S: [" ####", "#    ", " ### ", "    #", "#### "],
  T: ["#####", "  #  ", "  #  ", "  #  ", "  #  "],
  U: ["#   #", "#   #", "#   #", "#   #", " ### "],
  V: ["#   #", "#   #", "#   #", " # # ", "  #  "],
  W: ["#   #", "#   #", "# # #", "## ##", "#   #"],
  Y: ["#   #", " # # ", "  #  ", "  #  ", "  #  "],
  0: [" ### ", "#   #", "#   #", "#   #", " ### "],
  1: ["  #  ", " ##  ", "  #  ", "  #  ", " ### "],
  2: [" ### ", "    #", " ### ", "#    ", "#####"],
  3: [" ### ", "    #", " ### ", "    #", " ### "],
  4: ["#   #", "#   #", "#####", "    #", "    #"],
  5: ["#####", "#    ", "#### ", "    #", "#### "],
  6: [" ### ", "#    ", "#### ", "#   #", " ### "],
  7: ["#####", "    #", "   # ", "  #  ", "  #  "],
  8: [" ### ", "#   #", " ### ", "#   #", " ### "],
  9: [" ### ", "#   #", " ####", "    #", " ### "],
  ":": ["     ", "  #  ", "     ", "  #  ", "     "],
};

function rect(ctx, x, y, w, h, c) {
  ctx.fillStyle = c;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

function outlineRect(ctx, x, y, w, h, fill, stroke) {
  const s = stroke || P.outline;
  rect(ctx, x, y, w, h, fill);
  const ix = Math.round(x),
    iy = Math.round(y),
    iw = Math.round(w),
    ih = Math.round(h);
  ctx.fillStyle = s;
  ctx.fillRect(ix, iy, iw, 2);
  ctx.fillRect(ix, iy + ih - 2, iw, 2);
  ctx.fillRect(ix, iy, 2, ih);
  ctx.fillRect(ix + iw - 2, iy, 2, ih);
}

function pixelText(ctx, x, y, str, color, scale) {
  const sc = scale || 1;
  let cx = x;
  for (const ch of String(str).toUpperCase()) {
    const g = GLYPH[ch] || GLYPH[" "];
    for (let r = 0; r < 5; r++)
      for (let c = 0; c < 5; c++)
        if (g[r][c] === "#") rect(ctx, cx + c * sc, y + r * sc, sc, sc, color);
    cx += 6 * sc;
  }
}

function textWidth(str, scale) {
  return String(str).length * 6 * (scale || 1);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}
function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}
function seg(t, a, b) {
  return clamp((t - a) / (b - a), 0, 1);
}
function ease(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function colX(col) {
  return 16 + col * COL_W;
}

function stationLayout(st) {
  const bx = colX(st.col);
  return {
    mx: bx + (COL_W - MW) / 2,
    my: 72,
    cx: bx + (COL_W - CW) / 2,
    cy: 156,
  };
}

function clickTarget(st) {
  const { cx, cy } = stationLayout(st);
  return { x: cx + 65, y: cy + 30 };
}

// Fingertip is the anchor (hand.x/hand.y = fingertip position)
const FINGER_TIP = { dx: 0, dy: 0 };

const PHASES = [
  { t0: 0.8, t1: 3.0, idx: 0 },
  { t0: 3.0, t1: 5.2, idx: 1 },
  { t0: 5.2, t1: 7.4, idx: 2 },
  { t0: 7.4, t1: 9.6, idx: 3 },
];
const TITLE_AT = 10.2;
const HOME = { x: 240, y: 230 };

function sim(t) {
  const s = {
    inserted: [false, false, false, false],
    screen: ["off", "off", "off", "off"],
    hand: { x: HOME.x, y: HOME.y, show: false, click: 0 },
    title: false,
    errBlink: Math.floor(t * 2.5) % 2 === 0,
    logs: [],
    btnPress: [0, 0, 0, 0],
  };

  for (const ph of PHASES) {
    if (t >= ph.t1) {
      s.inserted[ph.idx] = true;
      s.screen[ph.idx] = STATIONS[ph.idx].ok ? "ok" : "error";
    } else if (t >= ph.t0) {
      s.hand.show = true;
      const p = seg(t, ph.t0, ph.t1);
      const tgt = clickTarget(STATIONS[ph.idx]);
      const hx = tgt.x - FINGER_TIP.dx;
      const hy = tgt.y - FINGER_TIP.dy;

      if (p < 0.32) {
        const m = ease(p / 0.32);
        s.hand.x = lerp(HOME.x, hx, m);
        s.hand.y = lerp(HOME.y, hy, m);
        s.hand.click = 0;
      } else if (p < 0.58) {
        s.hand.x = hx;
        s.hand.y = hy;
        const cp = seg(p, 0.32, 0.58);
        s.hand.click = cp < 0.45 ? ease(cp / 0.45) : ease((1 - cp) / 0.55);
        s.btnPress[ph.idx] = s.hand.click;
        if (p >= 0.44) {
          s.inserted[ph.idx] = true;
          s.screen[ph.idx] = STATIONS[ph.idx].ok ? "ok" : "error";
        }
      } else {
        if (p >= 0.44) {
          s.inserted[ph.idx] = true;
          s.screen[ph.idx] = STATIONS[ph.idx].ok ? "ok" : "error";
        }
        const m = ease(seg(p, 0.58, 1));
        s.hand.x = lerp(hx, HOME.x, m);
        s.hand.y = lerp(hy, HOME.y, m);
        s.hand.click = 0;
        s.btnPress[ph.idx] = 0;
      }
    }
  }

  if (t >= 0.4 && t < 9.6 && !s.hand.show) {
    s.hand.show = true;
    s.hand.x = HOME.x;
    s.hand.y = HOME.y;
  }
  if (t >= 9.6) s.hand.show = false;

  const logDefs = [
    { after: 1, text: "ERR: game_end_not_detected", color: P.logErr },
    { after: 2, text: "ERR: endcard_cta_failed", color: P.logWarn },
    { after: 0, text: "OK:  applovin_running", color: P.logOk },
    { after: 3, text: "OK:  iron_ads_init", color: P.logOk },
  ];
  for (const lg of logDefs) {
    if (s.inserted[lg.after]) s.logs.push(lg);
  }

  return s;
}

function drawBackground(ctx) {
  rect(ctx, 0, 0, VERDICTS.G, VERDICTS.G, P.bg);
  rect(ctx, 0, 0, VERDICTS.G, BENCH.y0 + 20, P.wall);
  rect(ctx, 0, 0, VERDICTS.G, 52, P.wallHi);
  for (let y = 20; y < BENCH.y0; y += 6)
    rect(ctx, 0, y, VERDICTS.G, 1, y % 12 === 0 ? P.pinstripe : P.wallLine);
  // vertical wall panel seams
  for (const x of [128, 256, 384])
    rect(ctx, x, 52, 1, BENCH.y0 - 52, P.pinstripe);
}

function drawFloor(ctx) {
  const top = FLOOR_TOP;
  rect(ctx, 0, top - 2, VERDICTS.G, 2, P.benchEdge);
  for (let y = top; y < VERDICTS.G; y++) {
    const c = (y - top) % 16 < 2 ? P.benchGroove : P.wall;
    rect(ctx, 0, y, VERDICTS.G, 1, c);
  }
  // perspective seams receding to centre
  const cxm = VERDICTS.G / 2;
  for (const bx of [40, 140, cxm, VERDICTS.G - 140, VERDICTS.G - 40]) {
    for (let y = top; y < VERDICTS.G; y += 2) {
      const tt = (y - top) / (VERDICTS.G - top);
      const x = lerp(bx, cxm + (bx - cxm) * 0.35, tt);
      rect(ctx, x, y, 1, 1, P.pinstripe);
    }
  }
}

function drawTitlePlaque(ctx) {
  const lines = ["PLAYABLE", "VALIDATOR SETUP"];
  const pw = 208,
    ph = 42,
    px = (VERDICTS.G - pw) / 2,
    py = 6;
  outlineRect(ctx, px, py, pw, ph, P.bench);
  rect(ctx, px + 4, py + 4, pw - 8, ph - 8, P.wallHi);
  pixelTextCentered(ctx, px, pw, py + 7, lines[0], P.text, 2);
  pixelTextCentered(ctx, px, pw, py + 23, lines[1], P.text, 2);
}

function drawWorkbench(ctx) {
  const { y0, y1 } = BENCH;
  for (let y = y0; y <= y1; y++) {
    const t = (y - y0) / (y1 - y0);
    const lx = lerp(32, 8, t);
    const rx = lerp(480, 504, t);
    rect(
      ctx,
      lx,
      y,
      rx - lx,
      1,
      y === y0 ? P.benchEdge : y % 3 === 0 ? P.benchGroove : P.bench,
    );
  }
  for (let y = y1 + 1; y < FLOOR_TOP; y++) {
    rect(ctx, 0, y, VERDICTS.G, 1, y % 8 < 2 ? P.benchGroove : P.wall);
  }
}

function drawGlowCable(ctx, mx, my, cx, cy, t) {
  const mcx = mx + MW / 2;
  const ccx = cx + CW / 2;
  const y1 = my + MH + 1;
  const yMid = y1 + 6;
  const glow = Math.floor(t * 4) % 2 === 0;

  // plug at monitor base
  rect(ctx, mcx - 3, y1, 6, 3, P.machineSide);
  rect(ctx, mcx - 2, y1, 4, yMid - y1, P.cableDim);
  const dir = ccx >= mcx ? 1 : -1;
  const len = Math.abs(ccx - mcx);
  for (let i = 0; i <= len; i++) {
    const x = mcx + dir * i;
    rect(ctx, x, yMid, 2, 3, glow && i % 4 < 2 ? P.cableHi : P.cable);
  }
  rect(ctx, ccx - 2, yMid, 4, cy - yMid, glow ? P.cableHi : P.cable);
  // plug at console top
  rect(ctx, ccx - 3, cy - 3, 6, 3, P.machineSide);
}

function pixelTextCentered(ctx, boxX, boxW, y, str, color, scale) {
  pixelText(
    ctx,
    boxX + (boxW - textWidth(str, scale)) / 2,
    y,
    str,
    color,
    scale,
  );
}

function drawTetrisBlock(ctx, x, y, type, color) {
  const u = 5;
  const blocks = {
    L: [
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 2],
    ],
    T: [
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
    ],
    Z: [
      [0, 0],
      [1, 0],
      [1, 1],
      [2, 1],
    ],
    SQ: [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ],
  };
  for (const [bx, by] of blocks[type] || blocks.SQ) {
    rect(ctx, x + bx * u, y + by * u, u, u, color);
    rect(
      ctx,
      x + bx * u + 1,
      y + by * u + 1,
      u - 2,
      u - 2,
      color === P.applovin ? P.ok : color,
    );
  }
}

function drawCodeLines(ctx, x, y, w, ok) {
  const colors = ok ? [P.code, P.dim, P.code] : [P.codeErr, P.dim, P.codeErr];
  for (let i = 0; i < 3; i++) {
    const lw = w - 8 - (i % 2) * 12;
    rect(ctx, x + 4, y + i * 5, lw, 2, colors[i]);
  }
}

function drawCheckmarks(ctx, x, y) {
  drawCheck(ctx, x, y, P.ok);
  drawCheck(ctx, x + 10, y, P.ok);
}

function drawCheck(ctx, x, y, color) {
  rect(ctx, x, y + 3, 2, 5, color);
  rect(ctx, x + 2, y + 5, 2, 3, color);
  rect(ctx, x + 4, y + 1, 2, 7, color);
}

function drawMonitor(ctx, st, state, t, errBlink) {
  const { mx, my } = stationLayout(st);
  // wall mount bracket behind monitor
  rect(ctx, mx + MW / 2 - 3, my - 10, 6, 10, P.machineSide);
  rect(ctx, mx + MW / 2 - 10, my - 12, 20, 4, P.bench);
  outlineRect(ctx, mx - 4, my - 4, MW + 8, MH + 8, P.bezel);
  outlineRect(ctx, mx, my, MW, MH, P.monitor);
  // bezel screws
  drawScrew(ctx, mx + 2, my + 2);
  drawScrew(ctx, mx + MW - 5, my + 2);
  drawScrew(ctx, mx + 2, my + MH - 5);
  drawScrew(ctx, mx + MW - 5, my + MH - 5);
  const ix = mx + 6,
    iy = my + 6,
    iw = MW - 12,
    ih = MH - 12;
  rect(ctx, ix, iy, iw, ih, P.screenOff);

  if (state === "off") {
    pixelText(
      ctx,
      mx + MW / 2 - textWidth("NO SIGNAL", 1) / 2,
      my + MH / 2 - 2,
      "NO SIGNAL",
      P.dim,
      1,
    );
    drawScanlines(ctx, ix, iy, iw, ih);
    return;
  }

  const bg =
    state === "ok" ? P.screenOk : errBlink ? P.screenErrAlt : P.screenErr;
  rect(ctx, ix, iy, iw, ih, bg);
  const hdrColor = state === "ok" ? P.ok : P.err;
  rect(ctx, ix, iy, iw, 6, hdrColor);

  const lines = st.lines;
  lines.forEach((line, i) => {
    pixelText(
      ctx,
      ix + 4,
      iy + 11 + i * 8,
      line,
      state === "ok" ? P.ok : P.errTxt,
      1,
    );
  });

  if (state === "ok" && st.col === 3) drawCheckmarks(ctx, ix + iw - 26, iy + 9);

  drawTetrisBlock(ctx, ix + 6, iy + ih - 26, st.block, st.blockColor);
  drawCodeLines(ctx, ix + iw - 38, iy + ih - 24, 34, state === "ok");
  drawScanlines(ctx, ix, iy, iw, ih);
}

function drawScanlines(ctx, x, y, w, h) {
  ctx.save();
  ctx.globalAlpha = 0.12;
  for (let yy = y + 1; yy < y + h; yy += 3) rect(ctx, x, yy, w, 1, "#000000");
  ctx.restore();
}

function drawConsoleButton(ctx, x, y, w, h, label, accent, pressed, lit) {
  const dy = pressed ? 2 : 0;
  const fill = lit ? accent : P.machineSide;
  outlineRect(ctx, x, y + dy, w, h - dy, fill);
  if (!pressed) {
    rect(ctx, x + 2, y + 2, w - 4, 2, lit ? P.text : P.machineHi);
    rect(ctx, x + 2, y + 2, 2, h - 5, lit ? P.text : P.machineHi);
  }
  pixelTextCentered(
    ctx,
    x,
    w,
    y + dy + Math.floor((h - dy) / 2) - 2,
    label,
    lit ? P.bg : P.dim,
    1,
  );
}

function drawScrew(ctx, x, y) {
  rect(ctx, x, y, 3, 3, P.machineSide);
  rect(ctx, x + 1, y + 1, 1, 1, P.dim);
}

// Shared console shell: shadow, body, nameplate, screws, power LED.
function drawMachineFrame(ctx, cx, cy, name, accent, ledOn, ledColor) {
  rect(ctx, cx + 5, cy + CH, CW - 2, 4, P.shadow);
  outlineRect(ctx, cx, cy, CW, CH, P.machine);
  // nameplate
  rect(ctx, cx + 2, cy + 2, CW - 4, 11, P.machineSide);
  rect(ctx, cx + 2, cy + 2, CW - 4, 1, P.machineHi);
  pixelTextCentered(ctx, cx, CW, cy + 5, name, accent, 1);
  // screws
  drawScrew(ctx, cx + 4, cy + CH - 6);
  drawScrew(ctx, cx + CW - 7, cy + CH - 6);
  // power LED bottom-left
  rect(ctx, cx + 4, cy + CH - 13, 6, 6, P.outline);
  rect(ctx, cx + 5, cy + CH - 12, 4, 4, ledOn ? ledColor : P.machineSide);
}

// Icon zone: cx+8 .. cx+42 (36 wide), button zone: cx+48 .. cx+82.
const ICON_X = 10,
  ICON_Y = 17,
  BTN_X = 48,
  BTN_Y = 18,
  BTN_W = 34,
  BTN_H = 24;

function drawMachineApplovin(ctx, cx, cy, inserted, pressed, st) {
  drawMachineFrame(ctx, cx, cy, "APPLOVIN", P.applovin, inserted, P.ok);
  // logo: green app tile with white play triangle
  outlineRect(ctx, cx + ICON_X, cy + ICON_Y, 26, 24, P.applovin);
  rect(ctx, cx + ICON_X + 9, cy + ICON_Y + 6, 3, 12, P.text);
  rect(ctx, cx + ICON_X + 12, cy + ICON_Y + 8, 3, 8, P.text);
  rect(ctx, cx + ICON_X + 15, cy + ICON_Y + 10, 3, 4, P.text);
  drawConsoleButton(
    ctx,
    cx + BTN_X,
    cy + BTN_Y,
    BTN_W,
    BTN_H,
    "RUN",
    P.applovin,
    pressed,
    inserted && st.ok,
  );
}

function drawMachineGoogle(ctx, cx, cy, inserted, pressed) {
  drawMachineFrame(ctx, cx, cy, "GOOGLE", P.google, inserted, P.err);
  // 2x2 logo squares
  const gx = cx + ICON_X + 2,
    gy = cy + ICON_Y + 1;
  rect(ctx, gx, gy, 11, 11, P.gBlue);
  rect(ctx, gx + 12, gy, 11, 11, P.gRed);
  rect(ctx, gx, gy + 12, 11, 11, P.gYellow);
  rect(ctx, gx + 12, gy + 12, 11, 11, P.gGreen);
  drawConsoleButton(
    ctx,
    cx + BTN_X,
    cy + BTN_Y,
    BTN_W,
    BTN_H,
    inserted ? "ERR" : "TEST",
    P.err,
    pressed,
    inserted,
  );
}

function drawMachineMeta(ctx, cx, cy, inserted, pressed) {
  drawMachineFrame(ctx, cx, cy, "META", P.meta, inserted, P.err);
  // infinity logo: two interlocking rings
  const mx = cx + ICON_X,
    my = cy + ICON_Y + 4;
  outlineRect(ctx, mx, my, 14, 15, P.meta);
  rect(ctx, mx + 4, my + 4, 6, 7, P.machine);
  outlineRect(ctx, mx + 11, my, 14, 15, P.meta);
  rect(ctx, mx + 15, my + 4, 6, 7, P.machine);
  drawConsoleButton(
    ctx,
    cx + BTN_X,
    cy + BTN_Y,
    BTN_W,
    BTN_H,
    inserted ? "FAIL" : "RUN",
    P.err,
    pressed,
    inserted,
  );
}

function drawMachineIron(ctx, cx, cy, inserted, pressed, t) {
  drawMachineFrame(ctx, cx, cy, "IRONSRC", P.iron, inserted, P.ok);
  // orange tile with pulse bar
  outlineRect(ctx, cx + ICON_X, cy + ICON_Y, 26, 24, P.machineSide);
  if (inserted) {
    const pulse = Math.sin(t * 5) * 0.5 + 0.5;
    rect(ctx, cx + ICON_X + 4, cy + ICON_Y + 14, 18, 3 + pulse * 5, P.iron);
    rect(ctx, cx + ICON_X + 6, cy + ICON_Y + 6, 14, 3, "#f8d060");
  } else {
    pixelTextCentered(ctx, cx + ICON_X, 26, cy + ICON_Y + 9, "iS", P.iron, 1);
  }
  drawConsoleButton(
    ctx,
    cx + BTN_X,
    cy + BTN_Y,
    BTN_W,
    BTN_H,
    inserted ? "OK" : "INIT",
    P.ok,
    pressed,
    inserted,
  );
}

function drawMachine(ctx, st, inserted, pressed, t) {
  const { cx, cy } = stationLayout(st);
  if (st.machine === "applovin")
    drawMachineApplovin(ctx, cx, cy, inserted, pressed, st);
  else if (st.machine === "google")
    drawMachineGoogle(ctx, cx, cy, inserted, pressed);
  else if (st.machine === "meta") drawMachineMeta(ctx, cx, cy, inserted, pressed);
  else drawMachineIron(ctx, cx, cy, inserted, pressed, t);
}

// Classic pointer-cursor hand. X=outline S=skin H=highlight D=shadow
// Fingertip is centered on column 4, row 0.
const HAND_MAP = [
  "    XXX         ",
  "   XHSSX        ",
  "   XHSSX        ",
  "   XHSSX        ",
  "   XHSSX        ",
  "   XHSSX        ",
  "   XHSSX        ",
  "   XHSSXX       ",
  "   XHSSSSX      ",
  "   XHSSSSSX     ",
  " XXXHSSSSSSX    ",
  "XHSSSSSSSSSX    ",
  "XHSSSSSSSSSSX   ",
  "XHSSSSSSSSSSX   ",
  " XHSSSSSSSSDX   ",
  " XHSSSSSSSDDX   ",
  "  XHSSSSSDDDX   ",
  "  XHSSSSDDDDX   ",
  "   XHSSDDDDX    ",
  "   XDDDDDDX     ",
  "    XXXXXX      ",
];
const HAND_COLORS = { X: P.outline, S: P.skin, H: P.skinHi, D: P.skinSh };
const HAND_SCALE = 2;
const HAND_TIP_COL = 4;

function drawClickSparks(ctx, tx, ty, strength) {
  if (strength < 0.2) return;
  const s = HAND_SCALE;
  const rays = [
    [0, -10],
    [-4, -9],
    [4, -9],
    [-8, -6],
    [8, -6],
    [-9, -1],
    [9, -1],
  ];
  for (const [rx, ry] of rays) {
    rect(ctx, tx + (rx * s) / 2, ty + ry, s, s + 2, P.outline);
  }
}

function drawPointingHand(ctx, h) {
  if (!h.show) return;
  const s = HAND_SCALE;
  const click = h.click || 0;
  const dip = Math.round(click * 4);
  const originX = Math.round(h.x) - HAND_TIP_COL * s;
  const originY = Math.round(h.y) + dip;

  for (let r = 0; r < HAND_MAP.length; r++) {
    const row = HAND_MAP[r];
    for (let c = 0; c < row.length; c++) {
      const ch = row[c];
      if (ch === " ") continue;
      rect(ctx, originX + c * s, originY + r * s, s, s, HAND_COLORS[ch]);
    }
  }

  const tipX = Math.round(h.x);
  const tipY = originY - 2;
  drawClickSparks(ctx, tipX, tipY, click);
}

function drawForegroundDesk(ctx) {
  const { x, y, w } = CRT;
  const dx = x - 28,
    dw = w + 56;
  const top = y + 90;
  const rows = 64;
  for (let row = 0; row < rows; row++) {
    const ty = top + row;
    const t = row / rows;
    const lx = lerp(dx + 14, dx, t);
    const rx = lerp(dx + dw - 14, dx + dw, t);
    rect(
      ctx,
      lx,
      ty,
      rx - lx,
      1,
      row < 3 ? P.deskTop : row % 5 === 0 ? P.benchGroove : P.deskFront,
    );
  }
  // front edge highlight
  rect(ctx, dx, top + rows - 2, dw, 2, P.benchEdge);
}

function drawKeyboardTray(ctx, cx, topY) {
  const rows = 3,
    rowH = 8,
    bodyH = rows * rowH + 14,
    botY = topY + bodyH;
  const topHalf = 80,
    botHalf = 102;
  // tray body (perspective trapezoid)
  for (let yy = topY; yy <= botY; yy++) {
    const tt = (yy - topY) / bodyH;
    const hw = lerp(topHalf, botHalf, tt);
    let col = P.bench;
    if (yy < topY + 2) col = P.benchHi;
    else if (yy > botY - 3) col = P.machineSide;
    rect(ctx, cx - hw, yy, hw * 2, 1, col);
  }
  outlineRect(ctx, cx - topHalf, topY, 2, bodyH, P.machineSide);
  outlineRect(ctx, cx + topHalf - 2, topY, 2, bodyH, P.machineSide);
  // key rows
  for (let r = 0; r < rows; r++) {
    const ry = topY + 4 + r * rowH;
    const tt = (ry - topY) / bodyH;
    const hw = lerp(topHalf - 10, botHalf - 12, tt);
    const n = 11;
    const kw = (hw * 2) / n;
    for (let k = 0; k < n; k++) {
      const kx = cx - hw + k * kw;
      rect(ctx, kx + 1, ry, kw - 2, rowH - 3, P.deskTop);
      rect(ctx, kx + 1, ry + rowH - 3, kw - 2, 1, P.machineSide);
    }
  }
  // spacebar
  const sy = topY + 4 + rows * rowH;
  const tt = (sy - topY) / bodyH;
  const hw = lerp(topHalf - 10, botHalf - 12, tt);
  rect(ctx, cx - hw * 0.55, sy, hw * 1.1, rowH - 3, P.deskTop);
  rect(ctx, cx - hw * 0.55, sy + rowH - 3, hw * 1.1, 1, P.machineSide);
}

function drawCRT(ctx, logs, t) {
  const { x, y, w, h } = CRT;
  const cxm = x + w / 2;
  // monitor neck + base (grounds the screen on the desk)
  rect(ctx, cxm - 8, y + h - 2, 16, 18, P.bezel);
  rect(ctx, cxm - 6, y + h, 4, 16, P.machineSide);
  rect(ctx, cxm - 30, y + h + 10, 60, 7, P.bench);
  rect(ctx, cxm - 30, y + h + 10, 60, 2, P.benchHi);
  rect(ctx, cxm - 30, y + h + 15, 60, 2, P.machineSide);
  // monitor
  outlineRect(ctx, x - 8, y - 6, w + 16, h + 12, P.bezel);
  outlineRect(ctx, x, y, w, h, P.monitor);
  drawScrew(ctx, x + 2, y + 2);
  drawScrew(ctx, x + w - 5, y + 2);
  const ix = x + 6,
    iy = y + 6,
    iw = w - 12,
    ih = h - 12;
  rect(ctx, ix, iy, iw, ih, "#0e1018");
  rect(ctx, ix, iy, iw, 10, "#1a1c28");
  rect(ctx, ix + 4, iy + 3, 6, 6, P.err);
  rect(ctx, ix + 14, iy + 3, 6, 6, P.logWarn);
  rect(ctx, ix + 24, iy + 3, 6, 6, P.ok);

  const allLogs = [{ text: "LOG: build_uploaded", color: P.dim }, ...logs];
  allLogs.slice(0, 5).forEach((lg, i) => {
    pixelText(ctx, ix + 4, iy + 16 + i * 10, lg.text, lg.color, 1);
  });
  drawScanlines(ctx, ix, iy, iw, ih);

  // keyboard in front of the screen
  drawKeyboardTray(ctx, cxm, y + h + 20);
}

function drawTitle(ctx) {
  rect(ctx, 0, 0, VERDICTS.G, VERDICTS.G, P.bg);
  pixelText(ctx, 120, 156, "SAME", P.text, 3);
  pixelText(ctx, 88, 194, "BUILD", P.applovin, 3);
  pixelText(ctx, 40, 232, "DIFFERENT", P.text, 3);
  pixelText(ctx, 58, 270, "VERDICTS", P.err, 3);
}

function getActiveClick(t) {
  for (const ph of PHASES) {
    if (t >= ph.t0 && t < ph.t1) {
      const p = seg(t, ph.t0, ph.t1);
      if (p >= 0.32 && p < 0.58)
        return { idx: ph.idx, press: ease(seg(p, 0.32, 0.58)) };
    }
  }
  return null;
}

function drawVerdictsFrame(ctx, t) {
  ctx.imageSmoothingEnabled = false;
  if (sim(t).title) {
    drawTitle(ctx);
    return;
  }

  const s = sim(t);
  const activeClick = getActiveClick(t);

  drawBackground(ctx);
  drawTitlePlaque(ctx);
  drawWorkbench(ctx);
  drawFloor(ctx);
  for (let i = 0; i < 4; i++) {
    const lay = stationLayout(STATIONS[i]);
    drawGlowCable(ctx, lay.mx, lay.my, lay.cx, lay.cy, t);
  }
  for (let i = 0; i < 4; i++) {
    const st = STATIONS[i];
    const press =
      s.btnPress[i] ||
      (activeClick && activeClick.idx === i
        ? activeClick.press < 0.5
          ? activeClick.press * 2
          : (1 - activeClick.press) * 2
        : 0);
    drawMachine(ctx, st, s.inserted[i], press, t);
  }
  for (let i = 0; i < 4; i++) {
    drawMonitor(ctx, STATIONS[i], s.screen[i], t, s.errBlink);
  }
  drawForegroundDesk(ctx);
  drawCRT(ctx, s.logs, t);
  drawPointingHand(ctx, s.hand);
}

function renderToCanvas(canvas, t) {
  const sc = canvas.width / VERDICTS.G;
  const ctx = canvas.getContext("2d");
  ctx.setTransform(sc, 0, 0, sc, 0, 0);
  drawVerdictsFrame(ctx, t);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

async function loadGifJs() {
  if (typeof GIF !== "undefined") return;
  await new Promise((resolve, reject) => {
    const sc = document.createElement("script");
    sc.src = "https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.js";
    sc.crossOrigin = "anonymous";
    sc.onload = resolve;
    sc.onerror = reject;
    document.head.appendChild(sc);
  });
}

async function exportVerdictsGif({
  setTime,
  setPlaying,
  duration,
  resumePlaying,
}) {
  await loadGifJs();
  const fps = VERDICTS.FPS;
  const n = Math.round(duration * fps);
  const off = document.createElement("canvas");
  off.width = off.height = VERDICTS.OUT;
  const gif = new GIF({
    workers: 2,
    quality: 10,
    width: VERDICTS.OUT,
    height: VERDICTS.OUT,
    workerScript: new URL("gif.worker.js", window.location.href).href,
  });
  const flush = ReactDOM.flushSync
    ? (fn) => ReactDOM.flushSync(fn)
    : (fn) => fn();
  flush(() => setPlaying(false));
  await new Promise((r) =>
    requestAnimationFrame(() => requestAnimationFrame(r)),
  );
  try {
    for (let i = 0; i < n; i++) {
      const time = (i / n) * duration;
      flush(() => setTime(time));
      renderToCanvas(off, time);
      gif.addFrame(off.getContext("2d"), {
        copy: true,
        delay: Math.round(1000 / fps),
      });
      await new Promise((r) => setTimeout(r, 0));
    }
    const blob = await new Promise((res, rej) => {
      gif.on("finished", res);
      gif.on("error", rej);
      gif.render();
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "same-build-different-verdicts.gif";
    a.click();
  } finally {
    if (resumePlaying) setPlaying(true);
  }
}

async function exportVerdictsMp4({
  setTime,
  setPlaying,
  duration,
  resumePlaying,
}) {
  const fps = VERDICTS.FPS;
  const off = document.createElement("canvas");
  off.width = off.height = VERDICTS.OUT;
  const mime = MediaRecorder.isTypeSupported("video/mp4")
    ? "video/mp4"
    : MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
      ? "video/webm;codecs=vp9"
      : "video/webm";
  const rec = new MediaRecorder(off.captureStream(fps), {
    mimeType: mime,
    videoBitsPerSecond: 5_000_000,
  });
  const chunks = [];
  rec.ondataavailable = (e) => {
    if (e.data.size) chunks.push(e.data);
  };
  const flush = ReactDOM.flushSync
    ? (fn) => ReactDOM.flushSync(fn)
    : (fn) => fn();
  const n = Math.round(duration * fps);
  flush(() => setPlaying(false));
  await new Promise((r) =>
    requestAnimationFrame(() => requestAnimationFrame(r)),
  );
  rec.start();
  try {
    for (let i = 0; i < n; i++) {
      flush(() => setTime((i / n) * duration));
      renderToCanvas(off, (i / n) * duration);
      await new Promise((r) => setTimeout(r, 1000 / fps));
    }
    rec.stop();
    await new Promise((res) => {
      rec.onstop = res;
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(chunks, { type: mime }));
    a.download = `same-build-different-verdicts.${mime.includes("mp4") ? "mp4" : "webm"}`;
    a.click();
  } finally {
    if (resumePlaying) setPlaying(true);
  }
}

function VerdictsScene() {
  const { time } = useTimeline();
  const canvasRef = React.useRef(null);
  React.useEffect(() => {
    const cv = canvasRef.current;
    if (cv) renderToCanvas(cv, time);
  }, [time]);
  return (
    <canvas
      ref={canvasRef}
      width={VERDICTS.OUT}
      height={VERDICTS.OUT}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        imageRendering: "pixelated",
      }}
    />
  );
}

function VerdictsStage() {
  const tl = useTimeline();
  const [busy, setBusy] = React.useState(false);
  const onGif = React.useCallback(async () => {
    if (busy) return;
    setBusy(true);
    try {
      await exportVerdictsGif({
        setTime: tl.setTime,
        setPlaying: tl.setPlaying,
        duration: VERDICTS.DURATION,
        resumePlaying: tl.playing,
      });
    } finally {
      setBusy(false);
    }
  }, [tl, busy]);
  const onMp4 = React.useCallback(async () => {
    if (busy) return;
    setBusy(true);
    try {
      await exportVerdictsMp4({
        setTime: tl.setTime,
        setPlaying: tl.setPlaying,
        duration: VERDICTS.DURATION,
        resumePlaying: tl.playing,
      });
    } finally {
      setBusy(false);
    }
  }, [tl, busy]);
  return (
    <>
      <VerdictsScene />
      <div
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          display: "flex",
          gap: 6,
          zIndex: 2,
        }}
      >
        <button
          type="button"
          onClick={onGif}
          disabled={busy}
          style={exportBtnStyle}
        >
          GIF
        </button>
        <button
          type="button"
          onClick={onMp4}
          disabled={busy}
          style={exportBtnStyle}
        >
          MP4
        </button>
      </div>
    </>
  );
}

const exportBtnStyle = {
  fontFamily: "JetBrains Mono, monospace",
  fontSize: 10,
  fontWeight: 700,
  padding: "4px 8px",
  background: "rgba(0,0,0,0.55)",
  border: "1px solid rgba(255,255,255,0.2)",
  borderRadius: 4,
  color: "#eaeaea",
  cursor: "pointer",
};

Object.assign(window, {
  VerdictsScene,
  VerdictsStage,
  drawVerdictsFrame,
  VERDICTS,
});
