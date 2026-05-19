// scenes.jsx — Starter template. Replace with your scenes on each project branch.

function StarterScene({ start, end }) {
  return (
    <Sprite start={start} end={end}>
      {({ localTime, duration }) => {
        const fadeIn = Easing.easeOutCubic(clamp(localTime / 0.5, 0, 1));
        const fadeOutStart = duration - 0.5;
        const fadeOut =
          localTime > fadeOutStart
            ? Easing.easeInCubic(clamp((localTime - fadeOutStart) / 0.5, 0, 1))
            : 0;
        const opacity = fadeIn * (1 - fadeOut);
        const scale = 0.92 + 0.08 * Easing.easeOutBack(clamp(localTime / 1.2, 0, 1));

        return (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity,
              background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
            }}
          >
            <div
              style={{
                transform: `scale(${scale})`,
                textAlign: "center",
                fontFamily: "Inter, system-ui, sans-serif",
                color: "#f6f4ef",
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(246,244,239,0.55)",
                  marginBottom: 16,
                }}
              >
                GifBuilder
              </div>
              <div style={{ fontSize: 48, fontWeight: 700, letterSpacing: "-0.02em" }}>
                New GIF project
              </div>
              <div
                style={{
                  marginTop: 12,
                  fontFamily: "JetBrains Mono, ui-monospace, monospace",
                  fontSize: 13,
                  color: "rgba(246,244,239,0.7)",
                }}
              >
                Edit scenes.jsx on your branch
              </div>
            </div>
          </div>
        );
      }}
    </Sprite>
  );
}

Object.assign(window, { StarterScene });
