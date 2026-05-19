// scenes.jsx — Four scenes: code editor → matrix → game → coffee shop.

// ─── Scene heading (top-left label) ─────────────────────────────────────────
function SceneHeading({ text, variant }) {
  const terminal = variant === "terminal";
  return (
    <div
      style={
        terminal
          ? {
              position: "absolute",
              top: 24,
              left: 28,
              zIndex: 50,
              fontFamily: '"JetBrains Mono", ui-monospace, monospace',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.14em",
              color: "#c8f0d8",
              textShadow: "0 1px 2px rgba(0,0,0,0.45)",
              pointerEvents: "none",
              padding: "8px 14px",
              background: "linear-gradient(145deg, #141c18 0%, #0f1513 100%)",
              border: "1px solid #4d8f6e",
              borderRadius: 4,
              boxShadow:
                "0 4px 20px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)",
              textTransform: "uppercase",
            }
          : {
              position: "absolute",
              top: 24,
              left: 28,
              zIndex: 50,
              fontFamily: '"Press Start 2P", "Courier New", monospace',
              fontSize: 14,
              letterSpacing: "0.12em",
              color: "#fff",
              textShadow: "2px 2px 0 #000, 0 0 12px rgba(217,119,87,0.6)",
              pointerEvents: "none",
              padding: "8px 12px",
              background: "rgba(0,0,0,0.55)",
              border: "1px solid rgba(217,119,87,0.5)",
              borderRadius: 4,
            }
      }
    >
      {text}
    </div>
  );
}

const PROMPT_TEXT = `Create a pixel-art side-scrolling game where the main character looks like me, a bald bearded man wearing a black tank top, a digital watch, and two bracelets. The character collects coffee beans, inspired by his love for freshly brewed pour-over coffee with light-roasted beans and wine-like notes. Include running and jumping animations.`;

// ─── Scene 1 — Code editor with AI chat panel ───────────────────────────────
function EditorScene({ localTime, duration }) {
  const typeDur = duration * 0.86;
  const charsTotal = PROMPT_TEXT.length;
  const charsShown = Math.min(
    charsTotal,
    Math.floor((localTime / typeDur) * charsTotal),
  );
  const visible = PROMPT_TEXT.slice(0, charsShown);
  const fadeIn = Easing.easeOutCubic(clamp(localTime / 0.4, 0, 1));
  const fadeOutStart = duration - 0.35;
  const fadeOut =
    localTime > fadeOutStart
      ? Easing.easeInCubic(clamp((localTime - fadeOutStart) / 0.35, 0, 1))
      : 0;
  const opacity = fadeIn * (1 - fadeOut);
  const blink = Math.floor(localTime * 2) % 2 === 0 ? 1 : 0;
  const cursorVisible = charsShown < charsTotal ? 1 : blink;

  const codeLines = [
    { num: 1, parts: [{ t: "<!DOCTYPE html>", c: "#7eb8d4" }] },
    {
      num: 2,
      parts: [
        { t: "<html", c: "#8fd4a8" },
        { t: " lang", c: "#d8c078" },
        { t: "=", c: "#9aa8ac" },
        { t: '"en"', c: "#e0a878" },
        { t: ">", c: "#8fd4a8" },
      ],
    },
    { num: 3, parts: [{ t: "<head>", c: "#8fd4a8" }] },
    {
      num: 4,
      parts: [
        { t: "  <meta", c: "#8fd4a8" },
        { t: " charset", c: "#d8c078" },
        { t: "=", c: "#9aa8ac" },
        { t: '"UTF-8"', c: "#e0a878" },
        { t: " />", c: "#8fd4a8" },
      ],
    },
    {
      num: 5,
      parts: [
        { t: "  <title>", c: "#8fd4a8" },
        { t: "Coffee Runner", c: "#e8ecea" },
        { t: "</title>", c: "#8fd4a8" },
      ],
    },
    { num: 6, parts: [{ t: "  <style>", c: "#8fd4a8" }] },
    {
      num: 7,
      parts: [
        { t: "    body", c: "#d8c078" },
        { t: " { ", c: "#9aa8ac" },
        { t: "margin", c: "#a8b8e8" },
        { t: ": 0; ", c: "#c5d0d5" },
        { t: "background", c: "#7eb8d4" },
        { t: ": #0a0e0d;", c: "#e0a878" },
        { t: " }", c: "#9aa8ac" },
      ],
    },
    {
      num: 8,
      parts: [
        { t: "    canvas", c: "#d8c078" },
        { t: " { ", c: "#9aa8ac" },
        { t: "image-rendering", c: "#a8b8e8" },
        { t: ": pixelated;", c: "#e0a878" },
        { t: " }", c: "#9aa8ac" },
      ],
    },
    { num: 9, parts: [{ t: "  </style>", c: "#8fd4a8" }] },
    { num: 10, parts: [{ t: "</head>", c: "#8fd4a8" }] },
    { num: 11, parts: [{ t: "<body>", c: "#8fd4a8" }] },
    {
      num: 12,
      parts: [
        { t: "  <canvas", c: "#8fd4a8" },
        { t: " id", c: "#d8c078" },
        { t: "=", c: "#9aa8ac" },
        { t: '"game"', c: "#e0a878" },
        { t: " />", c: "#8fd4a8" },
      ],
    },
    {
      num: 13,
      parts: [
        { t: "  <script", c: "#8fd4a8" },
        { t: " src", c: "#d8c078" },
        { t: "=", c: "#9aa8ac" },
        { t: '"./main.js"', c: "#e0a878" },
        { t: "></script>", c: "#8fd4a8" },
      ],
    },
    { num: 14, parts: [{ t: "</body>", c: "#8fd4a8" }] },
  ];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        background:
          "linear-gradient(180deg, #121a18 0%, #0e1311 50%, #0c100e 100%)",
        display: "flex",
        flexDirection: "column",
        fontFamily: '"JetBrains Mono", ui-monospace, "Courier New", monospace',
      }}
    >
      <SceneHeading text="SCENE 1 — WRITING THE PROMPT" variant="terminal" />

      {/* Title bar */}
      <div
        style={{
          height: 32,
          background: "linear-gradient(180deg, #1a2220 0%, #141b19 100%)",
          borderBottom: "1px solid #3d6b58",
          display: "flex",
          alignItems: "center",
          padding: "0 14px",
          gap: 8,
          flexShrink: 0,
          boxShadow: "0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 2,
              background: "#c97a7a",
              border: "1px solid rgba(255,255,255,0.25)",
            }}
          />
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 2,
              background: "#d4b87a",
              border: "1px solid rgba(255,255,255,0.25)",
            }}
          />
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 2,
              background: "#7ab89a",
              border: "1px solid rgba(255,255,255,0.25)",
            }}
          />
        </div>
        <div
          style={{
            flex: 1,
            textAlign: "center",
            color: "#a8e0c0",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.08em",
          }}
        >
          COFFEE-RUNNER · <span style={{ color: "#7eb8d4" }}>AGENT</span>{" "}
          SESSION
        </div>
      </div>

      {/* Body: sidebar | editor | chat */}
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        {/* Sidebar — warm green tint */}
        <div
          style={{
            width: 200,
            background: "linear-gradient(90deg, #15201c 0%, #121c18 100%)",
            borderRight: "1px solid #2a4540",
            padding: "14px 12px",
            fontSize: 12,
            color: "#7aab8f",
          }}
        >
          <div
            style={{
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: "#8fd4a8",
              marginBottom: 10,
              fontWeight: 700,
            }}
          >
            <span style={{ color: "#d8c078" }}>{">"}</span> FILES
          </div>
          {[
            "[DIR] src",
            "  main.js",
            "  game.js",
            "  player.js",
            "[DIR] assets",
            "  sprites.png",
            "  index.html",
            "  package.json",
            "  README.md",
          ].map((f, i) => (
            <div
              key={i}
              style={{
                padding: "4px 6px",
                borderRadius: 3,
                marginBottom: 1,
                background: i === 6 ? "rgba(127,184,212,0.12)" : "transparent",
                color: i === 6 ? "#e8ecea" : "#6b9d82",
                fontSize: 11,
                whiteSpace: "pre",
                borderLeft:
                  i === 6 ? "3px solid #d8c078" : "3px solid transparent",
              }}
            >
              {f}
            </div>
          ))}
        </div>

        {/* Editor — neutral dark */}
        <div
          style={{
            flex: 1,
            background: "#0e1211",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Tabs */}
          <div
            style={{
              display: "flex",
              height: 32,
              background: "#0c100f",
              borderBottom: "1px solid #2a4540",
            }}
          >
            <div
              style={{
                padding: "0 14px",
                display: "flex",
                alignItems: "center",
                background: "#121a18",
                borderRight: "1px solid #3d6b58",
                color: "#d8e4e0",
                fontSize: 11,
                fontWeight: 700,
                gap: 8,
              }}
            >
              index.html
              <span style={{ color: "#a8b8e8" }}>×</span>
            </div>
          </div>
          {/* Code */}
          <div
            style={{
              flex: 1,
              padding: "12px 0",
              fontFamily: '"JetBrains Mono", ui-monospace, monospace',
              fontSize: 12,
              lineHeight: "20px",
              color: "#b4e4c4",
              overflow: "hidden",
              background:
                "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(143,212,168,0.02) 1px, rgba(143,212,168,0.02) 2px)",
            }}
          >
            {codeLines.map((line) => (
              <div key={line.num} style={{ display: "flex", padding: "0 8px" }}>
                <div
                  style={{
                    width: 36,
                    textAlign: "right",
                    color: "#4a7260",
                    userSelect: "none",
                    paddingRight: 12,
                    fontWeight: 600,
                  }}
                >
                  {line.num}
                </div>
                <div>
                  {line.parts.map((p, i) => (
                    <span key={i} style={{ color: p.c }}>
                      {p.t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Chat — cool slate accent */}
        <div
          style={{
            width: 420,
            background: "linear-gradient(90deg, #141820 0%, #12161c 100%)",
            borderLeft: "1px solid #3a4a5c",
            display: "flex",
            flexDirection: "column",
            boxShadow: "-6px 0 24px rgba(0,0,0,0.25)",
          }}
        >
          <div
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid #3a4a5c",
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "rgba(126,184,212,0.06)",
            }}
          >
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: 4,
                background: "#1a2228",
                border: "1px solid #7eb8d4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#e8ecea",
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              +
            </div>
            <div
              style={{
                color: "#e8ecea",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.06em",
              }}
            >
              NEW <span style={{ color: "#8fd4a8" }}>AGENT</span>
            </div>
            <div style={{ flex: 1 }} />
            <div style={{ color: "#a8b8e8", fontSize: 10, fontWeight: 700 }}>
              + ^
            </div>
          </div>

          <div style={{ flex: 1, padding: "14px 16px", overflow: "hidden" }}>
            <div
              style={{
                fontSize: 10,
                color: "#6b8a9e",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                marginBottom: 10,
                fontWeight: 700,
              }}
            >
              <span style={{ color: "#8fd4a8" }}>::</span> INPUT ·{" "}
              <span style={{ color: "#d8c078" }}>/</span> CMD ·{" "}
              <span style={{ color: "#a8b8e8" }}>@</span> CTX
            </div>
            <div
              style={{
                background: "#0e1218",
                border: "1px solid #3d5a6e",
                borderRadius: 6,
                padding: "14px 14px",
                color: "#b4e4c4",
                fontSize: 12,
                lineHeight: 1.55,
                minHeight: 280,
                fontFamily: '"JetBrains Mono", ui-monospace, monospace',
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
              }}
            >
              {visible}
              <span
                style={{
                  display: "inline-block",
                  width: 7,
                  height: 14,
                  background: "#6ecf9c",
                  verticalAlign: "text-bottom",
                  marginLeft: 2,
                  opacity: cursorVisible,
                  borderRadius: 1,
                }}
              />
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <div
                style={{
                  padding: "6px 12px",
                  borderRadius: 4,
                  background: "rgba(143,212,168,0.1)",
                  border: "1px solid #3d6b58",
                  color: "#e8ecea",
                  fontSize: 10,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  letterSpacing: "0.05em",
                }}
              >
                <span style={{ color: "#d8c078" }}>{">"}</span> AGENT{" "}
                <span style={{ color: "#7eb8d4" }}>▼</span>
              </div>
              <div
                style={{
                  padding: "6px 12px",
                  borderRadius: 4,
                  background: "#121820",
                  border: "1px solid #3a4a5c",
                  color: "#8eb4c8",
                  fontSize: 10,
                  fontWeight: 700,
                }}
              >
                AUTO <span style={{ color: "#d8c078" }}>▼</span>
              </div>
            </div>
            <div
              style={{
                marginTop: 10,
                fontSize: 10,
                color: "#7aab8f",
                fontWeight: 700,
              }}
            >
              <span style={{ color: "#a8b8e8" }}>{">"}</span> LOCAL{" "}
              <span style={{ color: "#d8c078" }}>[BRANCH: MAIN]</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom status bar */}
      <div
        style={{
          height: 24,
          background: "#121a18",
          borderTop: "1px solid #2a4540",
          display: "flex",
          alignItems: "center",
          padding: "0 14px",
          gap: 16,
          fontSize: 10,
          color: "#6b9d82",
          flexShrink: 0,
          fontWeight: 700,
          letterSpacing: "0.04em",
        }}
      >
        <span style={{ color: "#8fd4a8" }}>● MAIN</span>
        <span style={{ color: "#c5d0d5" }}>ERR 0</span>
        <span style={{ color: "#d8c078" }}>WARN 0</span>
        <span style={{ color: "#7eb8d4" }}>● LINK</span>
        <div style={{ flex: 1 }} />
        <span style={{ color: "#c5d0d5" }}>
          LN {Math.min(34, 1 + Math.floor(charsShown / 8))} COL{" "}
          {(charsShown % 60) + 1}
        </span>
        <span style={{ color: "#6b8a9e" }}>UTF-8</span>
        <span style={{ color: "#a8b8e8" }}>HTML</span>
      </div>
    </div>
  );
}

function Scene1Prompt({ start, end }) {
  return (
    <Sprite start={start} end={end}>
      {({ localTime, duration }) => (
        <EditorScene localTime={localTime} duration={duration} />
      )}
    </Sprite>
  );
}

// ─── Scene 2 — Matrix code rain ────────────────────────────────────────────
function MatrixScene({ localTime, duration }) {
  const canvasRef = React.useRef(null);

  React.useLayoutEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    drawMatrix(cv, localTime, duration);
  }, [localTime, duration]);

  const fadeIn = Easing.easeOutCubic(clamp(localTime / 0.12, 0, 1));
  const fadeOutStart = duration - 0.14;
  const fadeOut =
    localTime > fadeOutStart
      ? Easing.easeInCubic(clamp((localTime - fadeOutStart) / 0.14, 0, 1))
      : 0;
  const opacity = fadeIn * (1 - fadeOut);
  const t = localTime / duration;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "#000",
        opacity,
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        width={1280}
        height={720}
        style={{ width: "100%", height: "100%", display: "block" }}
      />
      <SceneHeading text="SCENE 2 — AI PROCESSING" />

      {/* Center status overlay */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          padding: "24px 40px",
          background: "rgba(0,0,0,0.6)",
          border: "1px solid #00ff66",
          boxShadow:
            "0 0 40px rgba(0,255,102,0.4), inset 0 0 20px rgba(0,255,102,0.1)",
          color: "#00ff66",
          fontFamily: '"JetBrains Mono", ui-monospace, monospace',
          fontSize: 22,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          textShadow: "0 0 12px #00ff66",
        }}
      >
        {t < 0.22
          ? "analyzing prompt"
          : t < 0.52
            ? "generating sprites"
            : "rendering scene"}
        <span style={{ marginLeft: 6 }}>
          {".".repeat(Math.floor(localTime * 9) % 4)}
        </span>
      </div>

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

function Scene2Processing({ start, end }) {
  return (
    <Sprite start={start} end={end}>
      {({ localTime, duration }) => (
        <MatrixScene localTime={localTime} duration={duration} />
      )}
    </Sprite>
  );
}

// Persistent matrix column state
const _matrixCols = [];
function drawMatrix(cv, t, duration) {
  const ctx = cv.getContext("2d");
  const W = cv.width,
    H = cv.height;
  const fontSize = 16;
  const cols = Math.floor(W / fontSize);

  // Initialize column positions once
  if (_matrixCols.length !== cols) {
    _matrixCols.length = 0;
    for (let i = 0; i < cols; i++) {
      _matrixCols.push({
        y: Math.random() * H,
        speed: 140 + Math.random() * 260,
        lastT: t,
      });
    }
  }

  // Trail effect (snappier clear = faster-feeling rain)
  ctx.fillStyle = "rgba(0, 0, 0, 0.14)";
  ctx.fillRect(0, 0, W, H);

  const MATRIX_PACE = 1.9;

  ctx.font = `bold ${fontSize}px "JetBrains Mono", ui-monospace, monospace`;

  const charSet =
    "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%@&!?*+=<>{}[]/\\";

  for (let i = 0; i < cols; i++) {
    const col = _matrixCols[i];
    const dt = Math.max(0, Math.min(0.05, t - col.lastT));
    col.lastT = t;
    col.y += col.speed * MATRIX_PACE * dt;
    if (col.y > H + 200) {
      col.y = -Math.random() * 400;
      col.speed = 140 + Math.random() * 260;
    }

    const x = i * fontSize;
    const trailLen = 22;
    for (let j = 0; j < trailLen; j++) {
      const cy = col.y - j * fontSize;
      if (cy < 0 || cy > H) continue;
      // Stable per-cell character (changes occasionally)
      const seed = Math.floor(
        i * 1000 + cy / fontSize + Math.floor(t * 14) * (j === 0 ? 4 : 1),
      );
      const ch = charSet[Math.abs(seed) % charSet.length];
      if (j === 0) {
        ctx.fillStyle = "#d8ffd8";
        ctx.shadowColor = "#00ff66";
        ctx.shadowBlur = 8;
      } else {
        const fade = 1 - j / trailLen;
        const g = Math.floor(180 * fade + 60);
        ctx.fillStyle = `rgba(0, ${g}, 64, ${fade})`;
        ctx.shadowBlur = 0;
      }
      ctx.fillText(ch, x, cy);
    }
    ctx.shadowBlur = 0;
  }
}

// ─── Scene 3 — Pixel Art Side-Scroller ──────────────────────────────────────
const SCENE3 = {
  GROUND_Y: 140,
  PLAYER_X: 70,
  PL_BODY_L: 73, // AABB vs platforms / beans (player x + 3)
  PL_BODY_R: 85, // player x + 15
  FEET_TO_TOP: 22,
  SPEED: 88,
  CYCLE: 1080,
  G: 600,
  DT: 1 / 96,
  OBSTACLES: [
    { x: 0, kind: "cactus" },
    { x: 92, kind: "rock" },
    { x: 198, kind: "cactus" },
    { x: 305, kind: "spikes" },
    { x: 415, kind: "rock" },
    { x: 518, kind: "cactus" },
    { x: 628, kind: "spikes" },
    { x: 738, kind: "rock" },
    { x: 848, kind: "cactus" },
    { x: 958, kind: "rock" },
  ],
  PLATFORMS: [
    { x: 128, w: 46, yTop: 118 },
    { x: 248, w: 44, yTop: 104 },
    { x: 368, w: 42, yTop: 116 },
    { x: 488, w: 40, yTop: 100 },
    { x: 598, w: 48, yTop: 114 },
    { x: 718, w: 44, yTop: 106 },
    { x: 838, w: 46, yTop: 120 },
    { x: 958, w: 50, yTop: 108 },
  ],
};

function scene3BeanDefs() {
  const gy = SCENE3.GROUND_Y;
  const platBeans = SCENE3.PLATFORMS.map((p) => ({
    wx: p.x + Math.floor(p.w / 2) - 4,
    y: p.yTop - 9,
  }));
  const floatBeans = [
    { wx: 52, y: gy - 34 },
    { wx: 330, y: gy - 42 },
    { wx: 485, y: gy - 50 },
    { wx: 652, y: gy - 36 },
    { wx: 812, y: gy - 44 },
    { wx: 972, y: gy - 32 },
  ];
  return [...platBeans, ...floatBeans];
}

function scene3OnPlatform(feetY, scrollX) {
  const { PL_BODY_L, PL_BODY_R, CYCLE } = SCENE3;
  const pl = PL_BODY_L;
  const pr = PL_BODY_R;
  for (const plat of SCENE3.PLATFORMS) {
    for (let pass = 0; pass < 2; pass++) {
      const sx = plat.x + pass * CYCLE - scrollX;
      if (
        pr > sx + 2 &&
        pl < sx + plat.w - 2 &&
        Math.abs(feetY - plat.yTop) < 1.8
      )
        return true;
    }
  }
  return false;
}

/** Deterministic jump / gravity / pickups from scene time (no React state). */
function computeScene3GameState(t) {
  const {
    GROUND_Y,
    PLAYER_X,
    PL_BODY_L,
    PL_BODY_R,
    SPEED,
    CYCLE,
    G,
    DT,
    OBSTACLES,
    PLATFORMS,
  } = SCENE3;
  const pl = PL_BODY_L;
  const pr = PL_BODY_R;
  const pcx = PLAYER_X + 8;

  const beans = scene3BeanDefs().map((b, id) => ({
    id,
    wx: b.wx,
    y: b.y,
    got: false,
    tGot: -1,
  }));

  if (t <= 0) {
    return {
      feetY: GROUND_Y,
      vy: 0,
      beans,
      beanCount: 0,
      runFrame: 0,
      jumping: false,
    };
  }

  const maxSteps = Math.min(Math.ceil(t / DT), 14000);
  let feetY = GROUND_Y;
  let vy = 0;
  let jumpCD = 0;

  for (let step = 0; step < maxSteps; step++) {
    const tt = step * DT;
    const scrollX = (tt * SPEED) % CYCLE;
    const prevY = feetY;
    jumpCD = Math.max(0, jumpCD - DT);

    const onGround = feetY >= GROUND_Y - 0.6;
    const onPlat = scene3OnPlatform(feetY, scrollX);
    const onSurface = onGround || onPlat;

    if (jumpCD <= 0 && onSurface && vy >= -4) {
      let obstacleBoost = 0;
      for (let pass = 0; pass < 2; pass++) {
        for (const ob of OBSTACLES) {
          const ox = ob.x + pass * CYCLE - scrollX;
          const dx = ox - PLAYER_X;
          if (dx > 10 && dx < 62) {
            const u = (dx - 10) / 52;
            obstacleBoost = Math.max(
              obstacleBoost,
              Math.sin((1 - u) * Math.PI),
            );
          }
        }
      }

      let platClearH = 0;
      for (const plat of PLATFORMS) {
        if (plat.yTop >= feetY - 1) continue;
        for (let pass = 0; pass < 2; pass++) {
          const sx = plat.x + pass * CYCLE - scrollX;
          if (sx > PLAYER_X + 12 && sx < PLAYER_X + 44) {
            const h = feetY - plat.yTop;
            if (h > platClearH) platClearH = h;
          }
        }
      }

      if (obstacleBoost > 0.32) {
        vy = -108 * (0.72 + 0.28 * obstacleBoost);
        jumpCD = 0.3;
      } else if (platClearH > 6) {
        const h = Math.min(platClearH + 4, 38);
        vy = -Math.sqrt(2 * G * h) * 0.96;
        jumpCD = 0.34;
      }
    }

    vy += G * DT;
    feetY += vy * DT;

    if (feetY >= GROUND_Y) {
      feetY = GROUND_Y;
      if (vy > 0) vy = 0;
    }

    if (feetY < GROUND_Y - 0.4) {
      let landed = false;
      for (const plat of PLATFORMS) {
        for (let pass = 0; pass < 2; pass++) {
          const sx = plat.x + pass * CYCLE - scrollX;
          const overlap = pr > sx + 2 && pl < sx + plat.w - 2;
          if (!overlap) continue;
          if (vy >= -2 && feetY >= plat.yTop && prevY <= plat.yTop + 8) {
            feetY = plat.yTop;
            if (vy > 0) vy = 0;
            landed = true;
            break;
          }
        }
        if (landed) break;
      }
    }

    if (
      feetY < GROUND_Y - 0.5 &&
      Math.abs(vy) < 3 &&
      !scene3OnPlatform(feetY, scrollX)
    ) {
      vy = 22;
    }

    const pcy = feetY - 11;
    for (const b of beans) {
      if (b.got) continue;
      for (let pass = 0; pass < 2; pass++) {
        const bx = b.wx + pass * CYCLE - scrollX;
        if (bx < -24 || bx > 340) continue;
        if (Math.abs(bx - pcx) < 13 && Math.abs(b.y - pcy) < 15) {
          b.got = true;
          b.tGot = tt;
        }
      }
    }
  }

  const runFrame = Math.floor(t * 10) % 4;
  const jumping = feetY < GROUND_Y - 3 || vy < -28;
  const beanCount = beans.filter((b) => b.got).length;
  return { feetY, vy, beans, beanCount, runFrame, jumping };
}

function GameCanvas({ localTime, duration }) {
  const { exporting } = useTimeline();
  const canvasRef = React.useRef(null);
  const sim = React.useMemo(
    () => computeScene3GameState(localTime),
    [localTime],
  );
  React.useLayoutEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    drawGame(cv, localTime, duration, sim);
  }, [localTime, duration, sim]);

  const fadeIn = Easing.easeOutCubic(clamp(localTime / 0.3, 0, 1));
  const score = 1800 + sim.beanCount * 920 + Math.floor(localTime * 48);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: fadeIn,
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <SceneHeading text="SCENE 3 — GAME OUTPUT" />
      <canvas
        ref={canvasRef}
        width={320}
        height={180}
        style={{
          width: 1280,
          height: 720,
          imageRendering: "pixelated",
          display: "block",
        }}
      />
      {!exporting && (
        <>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0 2px, transparent 2px 5px)",
              pointerEvents: "none",
              mixBlendMode: "multiply",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              boxShadow: "inset 0 0 200px rgba(0,0,0,0.5)",
              pointerEvents: "none",
            }}
          />
        </>
      )}
      <div
        style={{
          position: "absolute",
          top: 28,
          right: 32,
          fontFamily: '"Press Start 2P", "Courier New", monospace',
          color: "#ffcd5c",
          fontSize: 18,
          textShadow: "3px 3px 0 #000",
          letterSpacing: "0.05em",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <CoffeeBeanIcon size={20} /> × {sim.beanCount}
      </div>
      <div
        style={{
          position: "absolute",
          top: 70,
          right: 32,
          fontFamily: '"Press Start 2P", "Courier New", monospace',
          color: "#fff",
          fontSize: 14,
          textShadow: "3px 3px 0 #000",
          letterSpacing: "0.05em",
        }}
      >
        SCORE {String(score).padStart(5, "0")}
      </div>
    </div>
  );
}

function Scene3Game({ start, end }) {
  return (
    <Sprite start={start} end={end}>
      {({ localTime, duration }) => (
        <GameCanvas localTime={localTime} duration={duration} />
      )}
    </Sprite>
  );
}

function CoffeeBeanIcon({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 8 8"
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="1" y="2" width="6" height="4" fill="#6b3410" />
      <rect x="2" y="1" width="4" height="6" fill="#6b3410" />
      <rect x="3" y="2" width="1" height="4" fill="#3a1a08" />
      <rect x="4" y="1" width="1" height="6" fill="#3a1a08" />
      <rect x="2" y="2" width="1" height="1" fill="#a8642a" />
      <rect x="5" y="4" width="1" height="1" fill="#a8642a" />
    </svg>
  );
}

// ── Game renderer ─────────────────────────────────────────────────────────
function drawBeanCollectPop(ctx, x, y, age) {
  const a = clamp(1 - age / 0.4, 0, 1);
  const rise = age * 42;
  ctx.fillStyle = `rgba(255, 230, 140, ${0.9 * a})`;
  fillRect(ctx, x - 14, y - 18 - rise, 28, 10);
  ctx.fillStyle = `rgba(40, 20, 10, ${a})`;
  ctx.font = '6px "Press Start 2P", monospace';
  ctx.textAlign = "center";
  ctx.fillText("+1", x, y - 11 - rise);
  ctx.fillStyle = `rgba(255, 205, 92, ${0.85 * a})`;
  for (let i = 0; i < 6; i++) {
    const ang = (i / 6) * Math.PI * 2 + age * 8;
    const r = 10 + age * 34;
    fillRect(ctx, x + Math.cos(ang) * r - 1, y + Math.sin(ang) * r - 1, 2, 2);
  }
}

function drawGame(cv, t, duration, sim) {
  const ctx = cv.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  const W = cv.width,
    H = cv.height;
  const {
    GROUND_Y,
    PLAYER_X,
    SPEED,
    CYCLE,
    OBSTACLES,
    PLATFORMS,
    FEET_TO_TOP,
  } = SCENE3;
  const scrollX = (t * SPEED) % CYCLE;

  // Sky
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, "#3a2a4a");
  sky.addColorStop(0.5, "#d97557");
  sky.addColorStop(1, "#ffcd5c");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  // Sun
  ctx.fillStyle = "#fff5cc";
  fillRect(ctx, 230, 40, 24, 24);
  ctx.fillStyle = "#ffe488";
  fillRect(ctx, 234, 40, 16, 24);
  fillRect(ctx, 230, 44, 24, 16);

  // Far mountains
  const farX = -((t * 8) % 320);
  drawMountains(ctx, farX, 80, "#5a3a6a");
  drawMountains(ctx, farX + 320, 80, "#5a3a6a");

  // Mid hills
  const midX = -((t * 18) % 160);
  for (let i = 0; i < 3; i++) drawHill(ctx, midX + i * 160, 110, "#3a4a5a");

  // Clouds
  const cloudX = -((t * 12) % 400);
  drawCloud(ctx, cloudX + 40, 30);
  drawCloud(ctx, cloudX + 200, 50);
  drawCloud(ctx, cloudX + 320, 25);

  // Trees
  const treeX = -((t * 35) % 110);
  for (let i = 0; i < 4; i++) drawPineTree(ctx, treeX + i * 110, 118);

  // Grass + dirt
  ctx.fillStyle = "#4a8a3a";
  fillRect(ctx, 0, GROUND_Y, W, 4);
  ctx.fillStyle = "#3a6a2a";
  fillRect(ctx, 0, GROUND_Y + 4, W, 6);
  ctx.fillStyle = "#6a4a2a";
  fillRect(ctx, 0, GROUND_Y + 10, W, H - GROUND_Y - 10);
  ctx.fillStyle = "#4a2e18";
  for (let i = 0; i < W; i += 8) {
    fillRect(ctx, i, GROUND_Y + 14, 4, 2);
    fillRect(ctx, i + 4, GROUND_Y + 22, 3, 2);
  }
  const tileX = -((t * 80) % 16);
  for (let i = 0; i < 22; i++) {
    const x = tileX + i * 16;
    if (i % 2 === 0) {
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      fillRect(ctx, x, GROUND_Y, 16, 4);
    }
  }

  // Floating platforms (jump targets + bean pedestals)
  for (let pass = 0; pass < 2; pass++) {
    for (const plat of PLATFORMS) {
      const sx = plat.x + pass * CYCLE - scrollX;
      if (sx + plat.w < -8 || sx > W + 8) continue;
      drawPlatform(ctx, Math.floor(sx), plat.yTop, plat.w);
    }
  }

  // Ground obstacles
  for (let pass = 0; pass < 2; pass++) {
    for (const ob of OBSTACLES) {
      const ox = ob.x + pass * CYCLE - scrollX;
      if (ox < -40 || ox > W + 20) continue;
      if (ob.kind === "cactus") drawCactus(ctx, Math.floor(ox), GROUND_Y - 18);
      else if (ob.kind === "rock") drawRock(ctx, Math.floor(ox), GROUND_Y - 10);
      else drawSpikes(ctx, Math.floor(ox), GROUND_Y - 6);
    }
  }

  // Coffee beans on platforms (only while not collected)
  for (const b of sim.beans) {
    if (b.got) continue;
    for (let pass = 0; pass < 2; pass++) {
      const bx = b.wx + pass * CYCLE - scrollX;
      if (bx < -12 || bx > W + 12) continue;
      const bob = Math.sin(t * 5 + b.id * 1.7) * 2;
      drawCoffeeBean(ctx, Math.floor(bx), Math.floor(b.y + bob), t * 6 + b.id);
    }
  }

  const charTop = Math.floor(sim.feetY - FEET_TO_TOP);
  drawCharacter(ctx, PLAYER_X, charTop, sim.runFrame, sim.jumping);

  // Pickup feedback (after character so pop reads on top)
  for (const b of sim.beans) {
    if (!b.got || b.tGot < 0) continue;
    const popAge = t - b.tGot;
    if (popAge < 0 || popAge > 0.42) continue;
    let bxDraw = null;
    for (let pass = 0; pass < 2; pass++) {
      const x = b.wx + pass * CYCLE - scrollX;
      if (x >= -40 && x <= W + 40) {
        bxDraw = x;
        break;
      }
    }
    if (bxDraw == null) continue;
    const bob = Math.sin(t * 5 + b.id * 1.7) * 2;
    drawBeanCollectPop(ctx, bxDraw + 3, b.y + bob, popAge);
  }

  // Foreground grass
  const fgX = -((t * 100) % 32);
  ctx.fillStyle = "#2a5a1a";
  for (let i = 0; i < 12; i++) {
    const x = fgX + i * 32;
    fillRect(ctx, x, GROUND_Y - 2, 1, 2);
    fillRect(ctx, x + 1, GROUND_Y - 3, 1, 3);
    fillRect(ctx, x + 2, GROUND_Y - 2, 1, 2);
  }
}

// ── Pixel primitives ──────────────────────────────────────────────────────
function fillRect(ctx, x, y, w, h) {
  ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
}

function drawMountains(ctx, x, baseY, color) {
  ctx.fillStyle = color;
  const peaks = [
    { x: 0, w: 80, h: 50 },
    { x: 70, w: 100, h: 65 },
    { x: 180, w: 90, h: 45 },
    { x: 250, w: 70, h: 38 },
  ];
  for (const p of peaks) {
    for (let i = 0; i < p.h; i++) {
      const stripW = Math.floor((p.w * (p.h - i)) / p.h);
      const stripX = x + p.x + Math.floor((p.w - stripW) / 2);
      fillRect(ctx, stripX, baseY + (p.h - i), stripW, 1);
    }
  }
  ctx.fillStyle = "#b8a8c8";
  for (const p of peaks) {
    if (p.h > 50) {
      const capW = Math.floor(p.w * 0.2);
      const capX = x + p.x + Math.floor((p.w - capW) / 2);
      fillRect(ctx, capX, baseY + 4, capW, 3);
    }
  }
}

function drawHill(ctx, x, baseY, color) {
  ctx.fillStyle = color;
  const segs = [
    { dx: 0, w: 60, h: 25 },
    { dx: 50, w: 70, h: 32 },
    { dx: 110, w: 50, h: 22 },
  ];
  for (const s of segs) {
    for (let i = 0; i < s.h; i++) {
      const stripW = Math.floor((s.w * (s.h - i)) / s.h);
      const stripX = x + s.dx + Math.floor((s.w - stripW) / 2);
      fillRect(ctx, stripX, baseY + (s.h - i), stripW, 1);
    }
  }
}

function drawCloud(ctx, x, y) {
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  fillRect(ctx, x + 3, y, 12, 4);
  fillRect(ctx, x, y + 2, 18, 4);
  fillRect(ctx, x + 2, y + 4, 14, 2);
}

function drawPineTree(ctx, x, y) {
  ctx.fillStyle = "#4a2818";
  fillRect(ctx, x + 4, y + 14, 2, 4);
  ctx.fillStyle = "#1a4a2a";
  fillRect(ctx, x + 3, y + 10, 4, 4);
  fillRect(ctx, x + 2, y + 12, 6, 2);
  ctx.fillStyle = "#2a6a3a";
  fillRect(ctx, x + 3, y + 6, 4, 4);
  fillRect(ctx, x + 2, y + 8, 6, 2);
  ctx.fillStyle = "#3a8a4a";
  fillRect(ctx, x + 4, y + 2, 2, 4);
  fillRect(ctx, x + 3, y + 4, 4, 2);
}

function drawCoffeeBean(ctx, x, y, spinT) {
  const w = Math.max(3, Math.round(6 + Math.sin(spinT) * 2));
  ctx.fillStyle = "rgba(255,205,92,0.3)";
  fillRect(ctx, x - 1, y - 1, w + 2, 8);
  ctx.fillStyle = "#6b3410";
  fillRect(ctx, x, y, w, 6);
  fillRect(ctx, x + 1, y - 1, w - 2, 8);
  ctx.fillStyle = "#3a1a08";
  const creaseX = x + Math.floor(w / 2);
  fillRect(ctx, creaseX, y, 1, 6);
  ctx.fillStyle = "#a8642a";
  fillRect(ctx, x + 1, y, 1, 1);
}

function drawCactus(ctx, x, y) {
  ctx.fillStyle = "#3a7a2a";
  fillRect(ctx, x + 3, y, 4, 18);
  fillRect(ctx, x, y + 6, 3, 2);
  fillRect(ctx, x, y + 4, 1, 4);
  fillRect(ctx, x + 7, y + 4, 3, 2);
  fillRect(ctx, x + 9, y + 2, 1, 4);
  ctx.fillStyle = "#5aaa3a";
  fillRect(ctx, x + 3, y, 1, 18);
  ctx.fillStyle = "#1a3a0a";
  fillRect(ctx, x + 4, y + 3, 1, 1);
  fillRect(ctx, x + 5, y + 8, 1, 1);
  fillRect(ctx, x + 4, y + 13, 1, 1);
}

function drawRock(ctx, x, y) {
  ctx.fillStyle = "#5a4a3a";
  fillRect(ctx, x + 1, y + 2, 12, 8);
  fillRect(ctx, x + 3, y, 8, 4);
  ctx.fillStyle = "#7a6a5a";
  fillRect(ctx, x + 4, y + 1, 4, 2);
  fillRect(ctx, x + 2, y + 3, 2, 1);
  ctx.fillStyle = "#3a2a1a";
  fillRect(ctx, x + 9, y + 6, 2, 2);
  fillRect(ctx, x + 1, y + 8, 12, 2);
}

function drawSpikes(ctx, x, y) {
  ctx.fillStyle = "#9a9aa0";
  for (let i = 0; i < 4; i++) {
    const sx = x + i * 4;
    fillRect(ctx, sx + 1, y + 4, 2, 2);
    fillRect(ctx, sx + 1, y + 2, 2, 2);
    fillRect(ctx, sx + 2, y, 1, 2);
  }
  ctx.fillStyle = "#5a5a60";
  for (let i = 0; i < 4; i++) fillRect(ctx, x + i * 4 + 2, y + 2, 1, 4);
}

function drawPlatform(ctx, x, y, w) {
  ctx.fillStyle = "#5aaa3a";
  fillRect(ctx, x, y, w, 2);
  ctx.fillStyle = "#3a7a2a";
  fillRect(ctx, x, y + 2, w, 2);
  ctx.fillStyle = "#8a5a3a";
  fillRect(ctx, x, y + 4, w, 6);
  ctx.fillStyle = "#6a3a2a";
  fillRect(ctx, x, y + 8, w, 2);
  ctx.fillStyle = "#5a2a1a";
  for (let i = 4; i < w; i += 8) fillRect(ctx, x + i, y + 4, 1, 4);
  ctx.fillStyle = "#a87a4a";
  fillRect(ctx, x + 2, y + 5, 2, 1);
  fillRect(ctx, x + w - 6, y + 5, 2, 1);
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  fillRect(ctx, x, y + 10, w, 1);
}

// ── Side-view character ──────────────────────────────────────────────────
function drawCharacter(ctx, x, y, frame, jumping) {
  const SKIN = "#e8a878",
    SKIN_SHADE = "#b8784a";
  const BEARD = "#3a2818",
    BEARD_HI = "#5a3a28";
  const TANK = "#1a1410",
    TANK_HI = "#2a2418";
  const PANTS = "#3a2a1a",
    SHOE = "#0a0808";
  const WATCH = "#3a8a8a",
    WATCH_BAND = "#1a1a1a";
  const BRACELET_BLACK = "#2a2a2a",
    BRACELET_BROWN = "#6a4a2a";
  const TATTOO = "#1a3a4a";

  ctx.fillStyle = SKIN;
  fillRect(ctx, x + 4, y, 8, 7);
  ctx.fillStyle = "#ffd8a8";
  fillRect(ctx, x + 5, y + 1, 2, 1);
  ctx.fillStyle = SKIN_SHADE;
  fillRect(ctx, x + 11, y + 3, 1, 2);
  ctx.fillStyle = "#1a1010";
  fillRect(ctx, x + 9, y + 3, 1, 1);
  fillRect(ctx, x + 8, y + 2, 2, 1);

  ctx.fillStyle = BEARD;
  fillRect(ctx, x + 5, y + 5, 7, 3);
  fillRect(ctx, x + 6, y + 8, 5, 1);
  fillRect(ctx, x + 4, y + 6, 1, 2);
  ctx.fillStyle = BEARD_HI;
  fillRect(ctx, x + 7, y + 7, 1, 1);
  fillRect(ctx, x + 9, y + 6, 1, 1);
  ctx.fillStyle = "#8a4a3a";
  fillRect(ctx, x + 8, y + 6, 1, 1);

  ctx.fillStyle = SKIN_SHADE;
  fillRect(ctx, x + 7, y + 9, 3, 1);

  ctx.fillStyle = SKIN;
  fillRect(ctx, x + 4, y + 10, 2, 2);
  fillRect(ctx, x + 11, y + 10, 2, 2);
  ctx.fillStyle = TANK;
  fillRect(ctx, x + 6, y + 10, 5, 7);
  ctx.fillStyle = TANK_HI;
  fillRect(ctx, x + 6, y + 10, 1, 7);
  ctx.fillStyle = TANK;
  fillRect(ctx, x + 6, y + 9, 1, 1);
  fillRect(ctx, x + 10, y + 9, 1, 1);

  const armSwing = [
    { L: { dx: -1, dy: 0 }, R: { dx: 1, dy: 0 } },
    { L: { dx: 0, dy: 0 }, R: { dx: 0, dy: 0 } },
    { L: { dx: 1, dy: 0 }, R: { dx: -1, dy: 0 } },
    { L: { dx: 0, dy: 0 }, R: { dx: 0, dy: 0 } },
  ];
  const sw = jumping
    ? { L: { dx: 0, dy: -2 }, R: { dx: 0, dy: -2 } }
    : armSwing[frame];
  const lAx = x + 3 + sw.L.dx,
    lAy = y + 11 + sw.L.dy;
  ctx.fillStyle = SKIN;
  fillRect(ctx, lAx, lAy, 2, 4);
  fillRect(ctx, lAx, lAy + 4, 2, 2);
  ctx.fillStyle = WATCH_BAND;
  fillRect(ctx, lAx, lAy + 3, 2, 1);
  ctx.fillStyle = WATCH;
  fillRect(ctx, lAx, lAy + 3, 2, 1);
  ctx.fillStyle = "#88e8e8";
  fillRect(ctx, lAx, lAy + 3, 1, 1);

  const rAx = x + 12 + sw.R.dx,
    rAy = y + 11 + sw.R.dy;
  ctx.fillStyle = SKIN;
  fillRect(ctx, rAx, rAy, 2, 4);
  fillRect(ctx, rAx, rAy + 4, 2, 2);
  ctx.fillStyle = TATTOO;
  fillRect(ctx, rAx, rAy + 4, 2, 1);
  fillRect(ctx, rAx + 1, rAy + 5, 1, 1);
  ctx.fillStyle = BRACELET_BLACK;
  fillRect(ctx, rAx, rAy + 3, 2, 1);
  ctx.fillStyle = BRACELET_BROWN;
  fillRect(ctx, rAx, rAy + 2, 2, 1);

  ctx.fillStyle = PANTS;
  if (jumping) {
    fillRect(ctx, x + 6, y + 17, 2, 4);
    fillRect(ctx, x + 9, y + 17, 2, 4);
    ctx.fillStyle = SHOE;
    fillRect(ctx, x + 5, y + 20, 3, 2);
    fillRect(ctx, x + 9, y + 20, 3, 2);
  } else {
    const poses = [
      {
        L: { x: 5, y: 17, w: 2, h: 4, fx: 4, fy: 21, fw: 3 },
        R: { x: 10, y: 17, w: 2, h: 5, fx: 10, fy: 21, fw: 3 },
      },
      {
        L: { x: 6, y: 17, w: 2, h: 5, fx: 5, fy: 21, fw: 3 },
        R: { x: 9, y: 17, w: 2, h: 5, fx: 9, fy: 21, fw: 3 },
      },
      {
        L: { x: 6, y: 17, w: 2, h: 5, fx: 5, fy: 21, fw: 3 },
        R: { x: 11, y: 17, w: 2, h: 4, fx: 11, fy: 20, fw: 3 },
      },
      {
        L: { x: 6, y: 17, w: 2, h: 5, fx: 5, fy: 21, fw: 3 },
        R: { x: 9, y: 17, w: 2, h: 5, fx: 9, fy: 21, fw: 3 },
      },
    ];
    const p = poses[frame];
    fillRect(ctx, x + p.L.x, y + p.L.y, p.L.w, p.L.h);
    fillRect(ctx, x + p.R.x, y + p.R.y, p.R.w, p.R.h);
    ctx.fillStyle = SHOE;
    fillRect(ctx, x + p.L.fx, y + p.L.fy, p.L.fw, 1);
    fillRect(ctx, x + p.R.fx, y + p.R.fy, p.R.fw, 1);
  }

  if (!jumping && frame % 2 === 0) {
    ctx.fillStyle = "rgba(180,150,100,0.5)";
    fillRect(ctx, x + 2, y + 22, 2, 1);
    fillRect(ctx, x + 13, y + 22, 1, 1);
  }
}

// ─── Scene 4 — Coffee Shop (full body, lower table) ─────────────────────────
function CoffeeShopCanvas({ localTime, duration }) {
  const { exporting } = useTimeline();
  const canvasRef = React.useRef(null);
  React.useLayoutEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    drawCoffeeShop(cv, localTime, duration);
  }, [localTime, duration]);

  const fadeIn = Easing.easeOutCubic(clamp(localTime / 0.4, 0, 1));
  const fadeOutStart = duration - 0.4;
  const fadeOut =
    localTime > fadeOutStart
      ? Easing.easeInCubic(clamp((localTime - fadeOutStart) / 0.4, 0, 1))
      : 0;
  const opacity = fadeIn * (1 - fadeOut);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <SceneHeading text="SCENE 4 — COFFEE TIME" />
      <canvas
        ref={canvasRef}
        width={320}
        height={180}
        style={{
          width: 1280,
          height: 720,
          imageRendering: "pixelated",
          display: "block",
        }}
      />
      {!exporting && (
        <>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0 2px, transparent 2px 5px)",
              pointerEvents: "none",
              mixBlendMode: "multiply",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              boxShadow: "inset 0 0 200px rgba(0,0,0,0.55)",
              pointerEvents: "none",
            }}
          />
        </>
      )}
      <div
        style={{
          position: "absolute",
          bottom: 48,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div
          style={{
            fontFamily: '"Press Start 2P", "Courier New", monospace',
            fontSize: 17,
            color: "#ffe488",
            textShadow: "3px 3px 0 #000, 0 0 16px rgba(217,119,87,0.85)",
            letterSpacing: "0.1em",
            padding: "10px 24px 0",
            whiteSpace: "nowrap",
          }}
        >
          ★ MISSION COMPLETE ★
        </div>
        <div
          style={{
            fontFamily: '"Press Start 2P", "Courier New", monospace',
            fontSize: 20,
            color: "#ffe488",
            textShadow: "4px 4px 0 #000, 0 0 18px rgba(217,119,87,0.85)",
            letterSpacing: "0.08em",
            whiteSpace: "nowrap",
          }}
        >
          But at what cost?
        </div>
      </div>
    </div>
  );
}

function Scene4CoffeeShop({ start, end }) {
  return (
    <Sprite start={start} end={end}>
      {({ localTime, duration }) => (
        <CoffeeShopCanvas localTime={localTime} duration={duration} />
      )}
    </Sprite>
  );
}

function drawCoffeeShop(cv, t, duration) {
  const ctx = cv.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  const W = cv.width,
    H = cv.height;

  // Wall
  const wall = ctx.createLinearGradient(0, 0, 0, H);
  wall.addColorStop(0, "#3a2418");
  wall.addColorStop(1, "#5a3424");
  ctx.fillStyle = wall;
  ctx.fillRect(0, 0, W, H);

  // Wallpaper dots (only upper area)
  ctx.fillStyle = "rgba(255,200,140,0.07)";
  for (let yy = 14; yy < 110; yy += 12) {
    for (let xx = yy % 24 === 0 ? 0 : 6; xx < W; xx += 12) {
      fillRect(ctx, xx, yy, 2, 2);
    }
  }

  // Window
  ctx.fillStyle = "#3a2418";
  fillRect(ctx, 24, 14, 84, 50);
  const sky = ctx.createLinearGradient(0, 18, 0, 60);
  sky.addColorStop(0, "#a8c8e8");
  sky.addColorStop(1, "#ffd9a0");
  ctx.fillStyle = sky;
  fillRect(ctx, 28, 18, 76, 42);
  ctx.fillStyle = "#7a8aa0";
  fillRect(ctx, 28, 46, 76, 14);
  ctx.fillStyle = "#5a6a80";
  for (let i = 0; i < 4; i++) {
    const hx = 32 + i * 18;
    fillRect(ctx, hx, 44, 8, 2);
    fillRect(ctx, hx + 1, 42, 6, 2);
  }
  ctx.fillStyle = "#fff5cc";
  fillRect(ctx, 86, 24, 8, 8);
  ctx.fillStyle = "#2a1810";
  fillRect(ctx, 26, 38, 80, 2);
  fillRect(ctx, 64, 16, 2, 46);

  // Plant on windowsill
  ctx.fillStyle = "#3a2418";
  fillRect(ctx, 34, 64, 14, 6);
  ctx.fillStyle = "#2a6a3a";
  fillRect(ctx, 36, 58, 10, 6);
  fillRect(ctx, 34, 60, 14, 4);
  ctx.fillStyle = "#3a8a4a";
  fillRect(ctx, 38, 56, 6, 4);
  ctx.fillStyle = "#D97757";
  fillRect(ctx, 37, 57, 1, 1);
  fillRect(ctx, 43, 58, 1, 1);

  // Chalkboard — block diagram (prompt → agent → game), no orange accent blob
  const cbx = 222,
    cby = 20,
    cbw = 66,
    cbh = 40;
  ctx.fillStyle = "#2a1810";
  fillRect(ctx, 220, 18, 70, 44);
  ctx.fillStyle = "#1a2418";
  fillRect(ctx, cbx, cby, cbw, cbh);
  ctx.fillStyle = "rgba(200,230,210,0.06)";
  for (let ly = cby; ly < cby + cbh; ly += 2) fillRect(ctx, cbx, ly, cbw, 1);

  const bStroke = "#b8dcc8";
  const bIn = "#3d5a5c";
  const bMid = "#4a6a72";
  const bOut = "#3d5a48";
  const diaBox = (x, y, w, h, fill) => {
    ctx.fillStyle = fill;
    fillRect(ctx, x, y, w, h);
    ctx.fillStyle = bStroke;
    fillRect(ctx, x, y, w, 1);
    fillRect(ctx, x, y + h - 1, w, 1);
    fillRect(ctx, x, y, 1, h);
    fillRect(ctx, x + w - 1, y, 1, h);
  };
  const arrowH = (x, y, len) => {
    ctx.fillStyle = bStroke;
    fillRect(ctx, x, y, len, 1);
    fillRect(ctx, x + len - 1, y - 1, 1, 1);
    fillRect(ctx, x + len - 1, y + 1, 1, 1);
  };
  // [in] → [ core ] → [out]
  diaBox(225, 27, 13, 8, bIn);
  arrowH(238, 31, 7);
  diaBox(246, 24, 20, 14, bMid);
  arrowH(266, 31, 7);
  diaBox(274, 27, 12, 8, bOut);
  // small “nodes” under main block (sub-steps)
  ctx.fillStyle = bStroke;
  fillRect(ctx, 250, 40, 2, 2);
  fillRect(ctx, 254, 40, 2, 2);
  fillRect(ctx, 258, 40, 2, 2);
  ctx.fillStyle = bIn;
  fillRect(ctx, 249, 43, 4, 3);
  fillRect(ctx, 254, 43, 4, 3);
  fillRect(ctx, 259, 43, 4, 3);

  // String lights
  ctx.fillStyle = "#2a1810";
  for (let xx = 0; xx < W; xx += 2) {
    const yy = 4 + Math.sin(xx * 0.05) * 2;
    fillRect(ctx, xx, Math.floor(yy), 1, 1);
  }
  const lightColors = ["#ffe488", "#ffb060", "#88e8e8", "#ff8888", "#a8e088"];
  for (let i = 0; i < 16; i++) {
    const lx = 8 + i * 20;
    const ly = 4 + Math.sin(lx * 0.05) * 2 + 2;
    const flicker = (Math.floor(t * 3) + i) % 5 === 0 ? 0.6 : 1;
    ctx.fillStyle = lightColors[i % lightColors.length];
    ctx.globalAlpha = flicker;
    fillRect(ctx, lx, ly, 2, 2);
    ctx.globalAlpha = flicker * 0.3;
    fillRect(ctx, lx - 1, ly - 1, 4, 4);
    ctx.globalAlpha = 1;
  }

  // Pendant lamp
  ctx.fillStyle = "#3a2418";
  fillRect(ctx, 178, 0, 1, 18);
  ctx.fillStyle = "#1a1410";
  fillRect(ctx, 170, 18, 18, 6);
  fillRect(ctx, 172, 24, 14, 2);
  ctx.fillStyle = "#ffe488";
  fillRect(ctx, 176, 26, 6, 4);
  ctx.fillStyle = "rgba(255,228,136,0.18)";
  for (let r = 1; r < 5; r++) {
    fillRect(ctx, 176 - r, 26 - r, 6 + r * 2, 4 + r * 2);
  }

  // Floor (wooden planks) — character stands ON the floor, no counter blocking legs
  const FLOOR_Y = 150;
  ctx.fillStyle = "#5a2810";
  fillRect(ctx, 0, FLOOR_Y, W, H - FLOOR_Y);
  ctx.fillStyle = "#7a3a18";
  for (let yy = FLOOR_Y; yy < H; yy += 6) fillRect(ctx, 0, yy, W, 1);
  ctx.fillStyle = "#3a1a08";
  for (let xx = 0; xx < W; xx += 22) fillRect(ctx, xx, FLOOR_Y, 1, H - FLOOR_Y);

  // Small bistro table to the side (so it's clearly a coffee shop, but not blocking him)
  const TX = 40,
    TY = 130;
  // Table top
  ctx.fillStyle = "#6a3a1a";
  fillRect(ctx, TX, TY, 32, 4);
  ctx.fillStyle = "#8a5028";
  fillRect(ctx, TX, TY, 32, 1);
  // Table leg
  ctx.fillStyle = "#4a2410";
  fillRect(ctx, TX + 14, TY + 4, 4, 16);
  fillRect(ctx, TX + 10, TY + 19, 12, 2);
  // Coffee cup on table
  ctx.fillStyle = "#f0ebe2";
  fillRect(ctx, TX + 6, TY - 5, 6, 5);
  ctx.fillStyle = "#a8a098";
  fillRect(ctx, TX + 11, TY - 4, 1, 3);
  ctx.fillStyle = "#3a1a08";
  fillRect(ctx, TX + 7, TY - 5, 4, 1);

  // Background patrons (further back, sitting at tables)
  ctx.fillStyle = "rgba(20,10,5,0.5)";
  fillRect(ctx, 130, 100, 12, 28);
  fillRect(ctx, 128, 94, 10, 8);
  fillRect(ctx, 296, 104, 12, 24);
  fillRect(ctx, 294, 98, 8, 8);
  // Tables for them
  ctx.fillStyle = "#4a2410";
  fillRect(ctx, 124, 128, 18, 2);
  fillRect(ctx, 132, 130, 2, 14);
  fillRect(ctx, 290, 128, 18, 2);
  fillRect(ctx, 298, 130, 2, 14);

  // Character (full body, standing on floor, facing camera, holding mug)
  const cx = 138,
    cy = 90;
  const breathe = Math.sin(t * 2) * 1;
  drawCharacterFront(ctx, cx, Math.floor(cy + breathe), t);

  // Steam
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  for (let i = 0; i < 3; i++) {
    const phase = (t * 1.5 + i * 0.7) % 1.5;
    const sx = cx + 12 + Math.sin(phase * Math.PI * 2 + i) * 3;
    const sy = cy + 28 - phase * 22;
    const op = (1 - phase / 1.5) * 0.7;
    ctx.globalAlpha = op;
    fillRect(ctx, Math.floor(sx), Math.floor(sy), 2, 2);
    fillRect(ctx, Math.floor(sx) + 1, Math.floor(sy) - 1, 1, 1);
  }
  ctx.globalAlpha = 1;

  // Floating heart
  const heartT = (t * 1.5) % 3;
  if (heartT < 1.5) {
    const hy = cy - 10 - heartT * 12;
    const hop = (1 - heartT / 1.5) * 0.9;
    ctx.globalAlpha = hop;
    drawHeart(ctx, cx + 18, Math.floor(hy));
    ctx.globalAlpha = 1;
  }
}

function drawHeart(ctx, x, y) {
  ctx.fillStyle = "#ff6688";
  fillRect(ctx, x + 1, y, 2, 1);
  fillRect(ctx, x + 4, y, 2, 1);
  fillRect(ctx, x, y + 1, 7, 2);
  fillRect(ctx, x + 1, y + 3, 5, 1);
  fillRect(ctx, x + 2, y + 4, 3, 1);
  fillRect(ctx, x + 3, y + 5, 1, 1);
  ctx.fillStyle = "#ffaabb";
  fillRect(ctx, x + 1, y + 1, 1, 1);
}

// ── Front-facing FULL BODY character (with legs visible) ──────────────────
function drawCharacterFront(ctx, x, y, t) {
  const SKIN = "#e8a878",
    SKIN_SHADE = "#b8784a";
  const BEARD = "#3a2818",
    BEARD_HI = "#5a3a28";
  const TANK = "#1a1410",
    TANK_HI = "#2a2418";
  const PANTS = "#3a2a1a",
    PANTS_HI = "#4a3a2a";
  const SHOE = "#0a0808",
    SHOE_HI = "#2a1818";
  const WATCH = "#3a8a8a",
    WATCH_BAND = "#1a1a1a";
  const BRACELET_BLACK = "#2a2a2a",
    BRACELET_BROWN = "#6a4a2a";
  const TATTOO = "#1a3a4a";
  const MUG = "#f0ebe2",
    MUG_SHADE = "#a8a098",
    COFFEE = "#3a1a08";

  // Head (bald)
  ctx.fillStyle = SKIN;
  fillRect(ctx, x + 6, y, 14, 12);
  fillRect(ctx, x + 4, y + 4, 18, 6);
  ctx.fillStyle = "#ffd8a8";
  fillRect(ctx, x + 9, y + 1, 3, 2);
  fillRect(ctx, x + 12, y + 1, 1, 1);
  ctx.fillStyle = SKIN_SHADE;
  fillRect(ctx, x + 3, y + 6, 1, 3);
  fillRect(ctx, x + 22, y + 6, 1, 3);
  ctx.fillStyle = "#1a1010";
  fillRect(ctx, x + 9, y + 6, 2, 2);
  fillRect(ctx, x + 15, y + 6, 2, 2);
  ctx.fillStyle = "#ffffff";
  fillRect(ctx, x + 10, y + 6, 1, 1);
  fillRect(ctx, x + 16, y + 6, 1, 1);
  ctx.fillStyle = BEARD;
  fillRect(ctx, x + 8, y + 4, 4, 1);
  fillRect(ctx, x + 14, y + 4, 4, 1);

  // Beard
  ctx.fillStyle = BEARD;
  fillRect(ctx, x + 5, y + 9, 16, 6);
  fillRect(ctx, x + 7, y + 15, 12, 2);
  fillRect(ctx, x + 4, y + 10, 1, 4);
  fillRect(ctx, x + 21, y + 10, 1, 4);
  ctx.fillStyle = BEARD_HI;
  fillRect(ctx, x + 6, y + 11, 1, 2);
  fillRect(ctx, x + 19, y + 11, 1, 2);
  fillRect(ctx, x + 11, y + 14, 1, 1);
  fillRect(ctx, x + 14, y + 14, 1, 1);
  ctx.fillStyle = "#2a1810";
  fillRect(ctx, x + 10, y + 9, 6, 1);
  ctx.fillStyle = "#3a1a18";
  fillRect(ctx, x + 11, y + 12, 4, 1);
  ctx.fillStyle = "#8a4a3a";
  fillRect(ctx, x + 12, y + 13, 2, 1);

  // Neck
  ctx.fillStyle = SKIN_SHADE;
  fillRect(ctx, x + 10, y + 17, 6, 2);

  // Torso (tank)
  ctx.fillStyle = SKIN;
  fillRect(ctx, x + 4, y + 19, 4, 4);
  fillRect(ctx, x + 18, y + 19, 4, 4);
  ctx.fillStyle = TANK;
  fillRect(ctx, x + 7, y + 19, 12, 14);
  ctx.fillStyle = TANK_HI;
  fillRect(ctx, x + 7, y + 19, 1, 14);
  fillRect(ctx, x + 8, y + 19, 11, 1);
  ctx.fillStyle = TANK;
  fillRect(ctx, x + 8, y + 18, 2, 1);
  fillRect(ctx, x + 16, y + 18, 2, 1);
  ctx.fillStyle = SKIN_SHADE;
  fillRect(ctx, x + 12, y + 20, 2, 1);

  // Arms holding mug
  ctx.fillStyle = SKIN;
  fillRect(ctx, x + 3, y + 22, 3, 5);
  fillRect(ctx, x + 5, y + 25, 4, 4);
  fillRect(ctx, x + 8, y + 26, 3, 3);
  fillRect(ctx, x + 20, y + 22, 3, 5);
  fillRect(ctx, x + 17, y + 25, 4, 4);
  fillRect(ctx, x + 15, y + 26, 3, 3);

  // Bear tattoo (right hand = viewer's left)
  ctx.fillStyle = TATTOO;
  fillRect(ctx, x + 8, y + 28, 3, 1);
  fillRect(ctx, x + 9, y + 27, 1, 1);
  fillRect(ctx, x + 8, y + 27, 1, 1);
  ctx.fillStyle = BRACELET_BLACK;
  fillRect(ctx, x + 6, y + 26, 3, 1);
  ctx.fillStyle = "#5a5a5a";
  fillRect(ctx, x + 6, y + 26, 1, 1);
  fillRect(ctx, x + 8, y + 26, 1, 1);
  ctx.fillStyle = BRACELET_BROWN;
  fillRect(ctx, x + 6, y + 25, 3, 1);
  ctx.fillStyle = "#8a6a3a";
  fillRect(ctx, x + 7, y + 25, 1, 1);

  // Apple Watch (left wrist)
  ctx.fillStyle = WATCH_BAND;
  fillRect(ctx, x + 17, y + 26, 3, 1);
  ctx.fillStyle = WATCH;
  fillRect(ctx, x + 17, y + 25, 3, 2);
  ctx.fillStyle = "#88e8e8";
  fillRect(ctx, x + 18, y + 25, 1, 1);
  ctx.fillStyle = "#ffffff";
  fillRect(ctx, x + 18, y + 25, 1, 1);

  // Mug
  ctx.fillStyle = MUG;
  fillRect(ctx, x + 9, y + 23, 8, 7);
  ctx.fillStyle = MUG_SHADE;
  fillRect(ctx, x + 16, y + 24, 1, 5);
  fillRect(ctx, x + 9, y + 29, 8, 1);
  ctx.fillStyle = MUG;
  fillRect(ctx, x + 17, y + 25, 2, 1);
  fillRect(ctx, x + 18, y + 26, 1, 2);
  fillRect(ctx, x + 17, y + 28, 2, 1);
  ctx.fillStyle = COFFEE;
  fillRect(ctx, x + 10, y + 24, 6, 1);
  ctx.fillStyle = "#5a2818";
  fillRect(ctx, x + 11, y + 24, 4, 1);
  ctx.fillStyle = "#D97757";
  fillRect(ctx, x + 11, y + 26, 1, 1);
  fillRect(ctx, x + 13, y + 26, 1, 1);
  fillRect(ctx, x + 11, y + 27, 3, 1);
  fillRect(ctx, x + 12, y + 28, 1, 1);

  // ── LEGS (visible, full body) ────────────────────────────────────────
  // Pants (jeans)
  ctx.fillStyle = PANTS;
  fillRect(ctx, x + 7, y + 33, 12, 5); // hip / belt area
  // Left leg (viewer)
  ctx.fillStyle = PANTS;
  fillRect(ctx, x + 7, y + 38, 5, 16);
  ctx.fillStyle = PANTS_HI;
  fillRect(ctx, x + 7, y + 38, 1, 16);
  // Right leg
  ctx.fillStyle = PANTS;
  fillRect(ctx, x + 14, y + 38, 5, 16);
  ctx.fillStyle = PANTS_HI;
  fillRect(ctx, x + 14, y + 38, 1, 16);
  // Knee shading
  ctx.fillStyle = "#2a1a0a";
  fillRect(ctx, x + 7, y + 46, 5, 1);
  fillRect(ctx, x + 14, y + 46, 5, 1);
  // Cuffs
  ctx.fillStyle = "#1a0a04";
  fillRect(ctx, x + 7, y + 53, 5, 1);
  fillRect(ctx, x + 14, y + 53, 5, 1);

  // Shoes (sneakers)
  ctx.fillStyle = SHOE;
  fillRect(ctx, x + 6, y + 54, 7, 3);
  fillRect(ctx, x + 13, y + 54, 7, 3);
  ctx.fillStyle = SHOE_HI;
  fillRect(ctx, x + 6, y + 54, 7, 1);
  fillRect(ctx, x + 13, y + 54, 7, 1);
  // Sole
  ctx.fillStyle = "#f0ebe2";
  fillRect(ctx, x + 6, y + 56, 7, 1);
  fillRect(ctx, x + 13, y + 56, 7, 1);

  // Floor shadow under feet
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  fillRect(ctx, x + 5, y + 57, 16, 1);
  fillRect(ctx, x + 7, y + 58, 12, 1);
}

Object.assign(window, {
  Scene1Prompt,
  Scene2Processing,
  Scene3Game,
  Scene4CoffeeShop,
});
