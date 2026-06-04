// animations.jsx — Canvas 2D pixel-animation framework + direct-canvas GIF export.
//
// Usage (in index.html):
//   <Stage width={480} height={270} fps={24} duration={7} loop
//          draw={window.drawScene} sceneLabel={window.sceneLabel} />
//
// The `draw` prop is a pure function (ctx, frame, { width, height }) => void.
// Frames are deterministic from the frame index, so the on-screen preview and
// the exported GIF are identical.

// ── Math / easing helpers ───────────────────────────────────────────────────
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function lerp(a, b, t) { return a + (b - a) * t; }
function easeLinear(t) { return t; }
function easeInOut(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
function easeOutBack(t) {
  const c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

// Deterministic pseudo-random in [0,1) from a numeric seed.
function rnd(seed) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

// ── Pixel drawing helpers ─────────────────────────────────────────────────────
function drawRect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}
function drawPixel(ctx, gx, gy, size, color) {
  ctx.fillStyle = color;
  ctx.fillRect(gx * size, gy * size, size, size);
}

// ── Script loader (used to lazy-load gif.js on first export) ──────────────────
function loadScriptOnce(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement('script');
    s.src = src;
    s.crossOrigin = 'anonymous';
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Could not load ${src}`));
    document.head.appendChild(s);
  });
}

// ── GIF export (reads pixels straight from an offscreen canvas) ───────────────
async function exportCanvasToGIF({
  draw, width, height, fps, totalFrames,
  exportScale = 2, filename = 'animation.gif', onProgress,
}) {
  if (typeof GIF === 'undefined') {
    await loadScriptOnce('https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.js');
  }

  const ec = document.createElement('canvas');
  ec.width = width * exportScale;
  ec.height = height * exportScale;
  const ectx = ec.getContext('2d');
  ectx.imageSmoothingEnabled = false;

  // Worker must be same-origin (browsers block cross-origin Worker URLs).
  const workerScript = new URL('gif.worker.js', window.location.href).href;
  const gif = new GIF({
    workers: 2,
    quality: 10,
    width: ec.width,
    height: ec.height,
    workerScript,
  });

  const delay = Math.round(1000 / fps);
  for (let f = 0; f < totalFrames; f++) {
    ectx.setTransform(exportScale, 0, 0, exportScale, 0, 0);
    ectx.clearRect(0, 0, width, height);
    draw(ectx, f, { width, height });
    ectx.setTransform(1, 0, 0, 1, 0, 0);
    gif.addFrame(ectx, { copy: true, delay });
    if (onProgress) onProgress(((f + 1) / totalFrames) * 0.5);
    // Yield so the UI can repaint the progress label.
    await new Promise((r) => setTimeout(r, 0));
  }

  if (onProgress) gif.on('progress', (p) => onProgress(0.5 + p * 0.5));

  const blob = await new Promise((resolve, reject) => {
    gif.on('finished', resolve);
    gif.on('error', reject);
    gif.render();
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Stage ─────────────────────────────────────────────────────────────────────
function Stage({
  width = 480, height = 270, fps = 24, duration = 7, loop = true,
  scale = 2, draw, sceneLabel, exportScale = 2, filename = 'animation.gif',
}) {
  const totalFrames = Math.max(1, Math.round(duration * fps));
  const canvasRef = React.useRef(null);
  const rafRef = React.useRef(null);
  const startRef = React.useRef(null);

  const [frame, setFrame] = React.useState(0);
  const [playing, setPlaying] = React.useState(true);
  const [exporting, setExporting] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  // Render one frame to the visible canvas.
  const render = React.useCallback((f) => {
    const cv = canvasRef.current;
    if (!cv || typeof draw !== 'function') return;
    const ctx = cv.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, width, height);
    draw(ctx, ((f % totalFrames) + totalFrames) % totalFrames, { width, height });
  }, [draw, width, height, totalFrames]);

  React.useEffect(() => { render(frame); }, [frame, render]);

  // Playback loop.
  React.useEffect(() => {
    if (!playing || exporting) { startRef.current = null; return; }
    const tick = (ts) => {
      if (startRef.current == null) startRef.current = ts - (frame / fps) * 1000;
      const elapsed = (ts - startRef.current) / 1000;
      let f = Math.floor(elapsed * fps);
      if (f >= totalFrames) {
        if (loop) { startRef.current = ts; f = 0; }
        else { f = totalFrames - 1; setPlaying(false); }
      }
      setFrame(f);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, exporting, fps, totalFrames, loop]);

  const handleExport = React.useCallback(async () => {
    if (exporting || typeof draw !== 'function') return;
    const wasPlaying = playing;
    setPlaying(false);
    setExporting(true);
    setProgress(0);
    try {
      await exportCanvasToGIF({
        draw, width, height, fps, totalFrames, exportScale, filename,
        onProgress: setProgress,
      });
    } catch (e) {
      console.error(e);
      window.alert(
        'GIF export failed. Keep `gif.worker.js` next to this page and serve over http(s).\n\n' +
          (e && e.message ? e.message : String(e))
      );
    } finally {
      setExporting(false);
      setProgress(0);
      if (wasPlaying) setPlaying(true);
    }
  }, [exporting, draw, width, height, fps, totalFrames, exportScale, filename, playing]);

  const time = frame / fps;
  const pct = totalFrames > 1 ? (frame / (totalFrames - 1)) * 100 : 0;
  const mono = 'JetBrains Mono, ui-monospace, monospace';
  const fmt = (t) => `${t.toFixed(2)}s`;

  const onSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = clamp((e.clientX - rect.left) / rect.width, 0, 1);
    startRef.current = null;
    setFrame(Math.round(x * (totalFrames - 1)));
  };

  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 16, background: '#0a0a0a',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      {/* Canvas + scene label */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          style={{
            width: width * scale,
            height: height * scale,
            imageRendering: 'pixelated',
            display: 'block',
            background: '#000',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            borderRadius: 4,
          }}
        />
      </div>

      {/* Playback bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '8px 16px',
        width: Math.min(width * scale, 720),
        background: 'rgba(20,20,20,0.92)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 8,
        color: '#f6f4ef',
        userSelect: 'none',
      }}>
        <IconBtn title="Restart" onClick={() => { startRef.current = null; setFrame(0); }}>
          <svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 2v10M12 2L5 7l7 5V2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none"/></svg>
        </IconBtn>
        <IconBtn title="Play / pause" onClick={() => { startRef.current = null; setPlaying(p => !p); }}>
          {playing
            ? <svg width="14" height="14" viewBox="0 0 14 14"><rect x="3" y="2" width="3" height="10" fill="currentColor"/><rect x="8" y="2" width="3" height="10" fill="currentColor"/></svg>
            : <svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 2l9 5-9 5V2z" fill="currentColor"/></svg>}
        </IconBtn>

        <div style={{ fontFamily: mono, fontSize: 12, width: 52, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
          {fmt(time)}
        </div>

        <div onMouseDown={onSeek} style={{ flex: 1, height: 18, position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <div style={{ position: 'absolute', left: 0, right: 0, height: 4, background: 'rgba(255,255,255,0.12)', borderRadius: 2 }} />
          <div style={{ position: 'absolute', left: 0, width: `${pct}%`, height: 4, background: '#ffcc66', borderRadius: 2 }} />
          <div style={{ position: 'absolute', left: `${pct}%`, width: 10, height: 10, marginLeft: -5, background: '#fff', borderRadius: 5, boxShadow: '0 1px 3px rgba(0,0,0,0.5)' }} />
        </div>

        <div style={{ fontFamily: mono, fontSize: 12, width: 52, color: 'rgba(246,244,239,0.55)', fontVariantNumeric: 'tabular-nums' }}>
          {fmt(duration)}
        </div>

        <button
          type="button"
          onClick={handleExport}
          disabled={exporting}
          title="Export the full loop as a .gif"
          style={{
            padding: '6px 12px',
            background: exporting ? 'rgba(255,204,102,0.25)' : '#ffcc66',
            color: exporting ? '#ffcc66' : '#1a1208',
            border: 'none', borderRadius: 6,
            fontSize: 11, fontWeight: 800, letterSpacing: '0.04em',
            cursor: exporting ? 'progress' : 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          {exporting ? `EXPORTING ${Math.round(progress * 100)}%` : 'EXPORT GIF'}
        </button>
      </div>
    </div>
  );
}

function IconBtn({ children, onClick, title }) {
  return (
    <button type="button" onClick={onClick} title={title} style={{
      width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 6, color: '#f6f4ef', cursor: 'pointer', padding: 0,
    }}>
      {children}
    </button>
  );
}

Object.assign(window, {
  clamp, lerp, easeLinear, easeInOut, easeOutCubic, easeOutBack, rnd,
  drawRect, drawPixel, loadScriptOnce, exportCanvasToGIF, Stage,
});
