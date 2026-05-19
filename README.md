# GifBuilder

Branch-per-project repo for building animated GIFs with **React**, **Babel (in-browser)**, **html2canvas**, and **gif.js**.

## Branches

| Branch | Project |
|--------|---------|
| `main` | Shared framework + starter template (start new GIFs here) |
| `prompt-to-pixel-game` | Prompt → Pixel promo animation |

## New GIF project

```bash
git checkout main
git pull
git checkout -b my-new-gif-name
# Edit index.html, scenes.jsx — then commit and push
python3 -m http.server 8765
# Open http://127.0.0.1:8765/
```

## Run locally

Serve over HTTP (required for JSX + GIF worker):

```bash
python3 -m http.server 8765
```

Open `http://127.0.0.1:8765/` — use the **GIF** button in the playback bar to export.

## Stack

- React 18 (CDN) + Babel standalone
- `animations.jsx` — Stage, timeline, sprites, GIF export
- `scenes.jsx` — your scenes (per branch)
- `gif.worker.js` — same-origin worker for gif.js
