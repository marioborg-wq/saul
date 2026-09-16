# KTO Saul

CRM asset generator. Build on-brand casino thumbnails from a background, up to
three foreground layers and editable text, then export a ready-to-upload
JPG or PNG.

Templates are 1:1 ports of the frames in `CRM_Asset_Templates.fig` — every
coordinate, font size and gradient stop was read out of the Figma file rather
than measured by eye.

## Running locally

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

```bash
npm run build     # production build into dist/
npm run preview   # serve the production build locally
```

## Deploying

### GitHub Pages

`.github/workflows/deploy.yml` builds and publishes on every push to `main`.
Enable it once in the repo: **Settings → Pages → Build and deployment →
Source: GitHub Actions**.

`vite.config.js` sets `base: "./"`, so the build works from a project subpath
(`user.github.io/repo/`) without further configuration.

### Anywhere else

`npm run build` emits a fully static `dist/`. Drop it on Netlify, Vercel,
Cloudflare Pages, S3 or any static host — there is no server component.

## How it works

Everything renders to a single `<canvas>`. The on-screen preview and the
downloaded file come from the same `renderThumbnail()` call at different
scales, so what the user sees is exactly what they get — no second code path
that can drift.

### Templates

Each template in `TEMPLATES` (top of `src/KtoSaul.jsx`) is pure data:

| Field | Meaning |
| --- | --- |
| `w`, `h` | Frame size in px |
| `foreground` | Default placement box for foreground layers |
| `gradient` | Rect, handle positions (`from`/`to`) and stops |
| `texts` | One entry per text layer: key, label, `boxY`, size, weight |
| `nameKeys` | Which text fields make up the game name |
| `exportDefaults` | Pre-selected format and scale in the download dialog |
| `textBehaviour` | `uppercase`, `autoFit` |
| `overflowHint` | Message shown when a name does not fit |

Adding a template is a data change, not a code change. The text fields, the
download defaults and the warnings are all generated from this object.

Text positioning follows Figma's model: the baseline sits at the text box top
plus one em, because Barlow's ascent is exactly 1000/1000 units.

### Automatic gradient

The scrim colour is derived from the background rather than picked by hand.
The lower half of the visible background is sampled, then a
saturation × value weighted circular hue average is taken — so a small area of
vivid colour (lava, neon) outweighs a large flat dark area. On the reference
artwork this returns `#bc4f00` against the designer's hand-picked `#b75702`.

It re-samples whenever the background image, size or position changes.

### Saving

Saved assets are stored as:

- `saul:index` — array of `{ id, name, templateId, savedAt, thumb }`, where
  `thumb` is a small JPEG for the Library grid. One read paints the whole grid.
- `saul:asset:<id>` — the full asset: text, layer transforms, gradient
  settings and the uploaded images as data URLs.

**Storage differs by environment.** Inside the Claude artifact runtime the host
provides `window.storage`. In a normal deployment it does not exist, so
`src/storage.js` installs an IndexedDB-backed shim with the same API. This is
why saving works after deployment; without it, Save and Library would fail
silently.

IndexedDB rather than localStorage because assets embed their images and run to
several MB each — localStorage's ~5MB per-origin cap would be exhausted after a
few saves.

Storage is **per browser, per user**. Two people do not see each other's
libraries, and clearing site data wipes them. If the CRM team needs a shared
library, that needs a backend — the storage layer is isolated in
`src/storage.js`, so swapping it for an API client is contained.

## Fonts

Barlow (500 and 900) and Inter load from Google Fonts in `index.html`. Barlow
Black 900 and Medium 500 match the Figma template exactly. If KTO needs to
self-host fonts, drop the woff2 files in `public/` and replace the `<link>`
with an `@font-face` block in `src/index.css`.

## Project layout

```
index.html            font links + mount point
src/main.jsx          entry; installs the storage shim before mounting
src/KtoSaul.jsx       the whole app: templates, renderer, UI
src/storage.js        IndexedDB shim for window.storage
src/index.css         Tailwind directives
```

`src/KtoSaul.jsx` is a single file by design — it came out of an artifact
where that was a constraint. Splitting templates, the renderer and the UI into
separate modules is the obvious first refactor if it keeps growing.

## Known gaps

- Third-party thumbnails only: the other five asset types in the dropdown
  (Live Casino, Hero Banner Vertical/Horizontal, Email Hero, Email Small) are
  placeholders awaiting Figma frames.
- Delete in the Library has no confirmation step.
- A background over roughly 5MB as a data URL may fail to save; the failure
  surfaces as "Save failed" without explaining the cause.
