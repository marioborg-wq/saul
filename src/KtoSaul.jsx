import React, { useState, useRef, useEffect, useCallback } from "react";

/* ------------------------------------------------------------------ *
 * KTO Saul — asset generator for the CRM team (v0.3)
 *
 * "Casino Thumbnail - 1 line" is a 1:1 port of the Figma frame.
 * Every number below was read out of CRM_Asset_Templates.fig:
 *   frame            386 × 516
 *   Background       0,0    386 × 516   image fill, scale mode FILL
 *   Foreground       100,78 186 × 186   image fill, scale mode FILL
 *   Gradient         0,232  386 × 284   linear, transparent → opaque, top→bottom
 *   Game Name        y 332  Barlow Black 72 / 86.4, centre, #ffffff
 *   Provider Name    y 419  Barlow Medium 20 / 24, centre, #ffffff
 * Figma baselines sit at box top + 1.0em (Barlow ascent = 1000/1000 upm).
 * ------------------------------------------------------------------ */

const C = {
  red: "#da0000",
  green: "#00dd70",
  yellow: "#fad749",
  bg: "#121212",
  panel: "#1a1a1a",
  panel2: "#232323",
  line: "#2f2f2f",
  text: "#f2f2f2",
  dim: "#9b9b9b",
  dim2: "#5a5a5a",
  sel: "#9b9b9b",
  label: "#828282",
};

const CATEGORIES = [
  "Casino Thumbnails",
  "Live Casino Thumbnails",
  "Hero Banner Vertical",
  "Hero Banner Horizontal",
  "Email Hero",
  "Email Small",
];

const TEMPLATES = [
  {
    id: "casino-thumb-1line",
    group: "Casino Thumbnails",
    name: "Casino Thumbnail - 1 line",
    w: 386,
    h: 516,
    ready: true,
    // thumbnails ship as 2× JPG
    exportDefaults: { format: "jpg", scale: 2 },
    // caps come from the Figma layers; type size is fixed at the template's
    // spec and never shrinks to fit, so what renders matches the design exactly
    textBehaviour: { uppercase: true, autoFit: false },
    exportNote: "Optimized for Casino Game Tiles",
    overflowHint: "Too long for this template, try Casino Thumbnail - 2 lines",
    nameKeys: ["gameName"],
    defaults: { gameName: "GAME", provider: "PROVIDER" },
    foreground: { x: 100, y: 78, w: 186, h: 186 },
    gradient: {
      x: 0,
      y: 232,
      w: 386,
      h: 284,
      sampleFrom: 0.45,
      // gradient handles as a fraction of the rect height, then the stops
      from: 0,
      to: 1,
      stops: [
        { p: 0, a: 0, c: "top" },
        { p: 1, a: 1, c: "bot" },
      ],
    },
    texts: [
      {
        key: "gameName",
        label: "Game name",
        boxY: 332,
        size: 72,
        weight: 900,
        family: "Barlow",
        color: "#ffffff",
        uppercase: true,
        minSize: 42,
      },
      {
        key: "provider",
        label: "Provider name",
        boxY: 419,
        size: 20,
        weight: 500,
        family: "Barlow",
        color: "#ffffff",
        uppercase: true,
        minSize: 14,
      },
    ],
    sidePadding: 24,
  },
  {
    id: "casino-thumb-2line",
    group: "Casino Thumbnails",
    name: "Casino Thumbnail - 2 lines",
    w: 386,
    h: 516,
    ready: true,
    exportDefaults: { format: "jpg", scale: 2 },
    textBehaviour: { uppercase: true, autoFit: false },
    exportNote: "Optimized for Casino Game Tiles",
    overflowHint: "Too long for this template, try moving a word to the other line",
    // the game name is split across two lines: a lighter upper line and the
    // heavy lower line, so the user still types one name
    nameKeys: ["gameLine1", "gameLine2"],
    defaults: { gameLine1: "GAME", gameLine2: "GAME", provider: "PROVIDER" },
    foreground: { x: 100, y: 78, w: 186, h: 186 },
    gradient: {
      x: 0,
      y: 232,
      w: 386,
      h: 284,
      sampleFrom: 0.45,
      // identical to the 1-line template: same rect, same fade
      from: 0,
      to: 1,
      stops: [
        { p: 0, a: 0, c: "top" },
        { p: 1, a: 1, c: "bot" },
      ],
    },
    texts: [
      {
        key: "gameLine1",
        label: "Game Name Line 1",
        boxY: 287,
        size: 45,
        weight: 500,
        family: "Barlow",
        color: "#ffffff",
        uppercase: true,
        minSize: 28,
      },
      {
        key: "gameLine2",
        label: "Game Name Line 2",
        boxY: 332,
        size: 72,
        weight: 900,
        family: "Barlow",
        color: "#ffffff",
        uppercase: true,
        minSize: 42,
      },
      {
        key: "provider",
        label: "Provider name",
        boxY: 419,
        size: 20,
        weight: 500,
        family: "Barlow",
        color: "#ffffff",
        uppercase: true,
        minSize: 14,
      },
    ],
    sidePadding: 24,
  },
  {
    id: "casino-thumb-3line",
    group: "Casino Thumbnails",
    name: "Casino Thumbnail - 3 lines",
    w: 386,
    h: 516,
    ready: true,
    exportDefaults: { format: "jpg", scale: 2 },
    textBehaviour: { uppercase: true, autoFit: false },
    exportNote: "Optimized for Casino Game Tiles",
    overflowHint: "Too long for this template, try moving a word to another line",
    nameKeys: ["gameLine1", "gameLine2", "gameLine3"],
    defaults: { gameLine1: "GAME", gameLine2: "GAME", gameLine3: "GAME", provider: "PROVIDER" },
    foreground: { x: 100, y: 54, w: 186, h: 186 },
    gradient: {
      x: 0,
      y: 131,
      w: 386,
      h: 385,
      sampleFrom: 0.45,
      from: 0.0727,
      to: 1,
      stops: [
        { p: 0, a: 0, c: "top" },
        { p: 0.3, a: 0.6, c: 0.47 },
        { p: 1, a: 1, c: "bot" },
      ],
    },
    texts: [
      { key: "gameLine1", label: "Game Name Line 1", boxY: 253, size: 28, weight: 500, family: "Barlow", color: "#ffffff", uppercase: true, minSize: 20 },
      { key: "gameLine2", label: "Game Name Line 2", boxY: 285, size: 50, weight: 900, family: "Barlow", color: "#ffffff", uppercase: true, minSize: 32 },
      { key: "gameLine3", label: "Game Name Line 3", boxY: 332, size: 72, weight: 900, family: "Barlow", color: "#ffffff", uppercase: true, minSize: 42 },
      { key: "provider", label: "Provider Name", boxY: 419, size: 20, weight: 500, family: "Barlow", color: "#ffffff", uppercase: true, minSize: 14 },
    ],
    sidePadding: 24,
  },
];

/* ----------------------------- helpers ---------------------------- */

const font = (weight, px, family) => `${weight} ${px}px ${family}, system-ui, sans-serif`;

function drawCoverClipped(ctx, img, x, y, w, h, scale, ox, oy) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  const ir = img.width / img.height;
  const br = w / h;
  let dw, dh;
  if (ir > br) {
    dh = h * scale;
    dw = dh * ir;
  } else {
    dw = w * scale;
    dh = dw / ir;
  }
  ctx.drawImage(img, x + (w - dw) / 2 + ox * w, y + (h - dh) / 2 + oy * h, dw, dh);
  ctx.restore();
}

/* Foreground: fitted whole (no crop) to the template's reference box at
 * 100%, but free to scale past it and move anywhere on the canvas. Only
 * the frame itself clips. */
function drawContainFree(ctx, img, box, canvasW, canvasH, scale, ox, oy, rotate) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, canvasW, canvasH);
  ctx.clip();
  const ir = img.width / img.height;
  let dw = box.w * scale;
  let dh = dw / ir;
  if (dh > box.h * scale) {
    dh = box.h * scale;
    dw = dh * ir;
  }
  const cx = box.x + box.w / 2 + ox * canvasW;
  const cy = box.y + box.h / 2 + oy * canvasH;
  // rotate about the image's own centre so size and position stay predictable
  ctx.translate(cx, cy);
  if (rotate) ctx.rotate((rotate * Math.PI) / 180);
  ctx.drawImage(img, -dw / 2, -dh / 2, dw, dh);
  ctx.restore();
}

/* Derive the scrim colours from what is actually visible in the lower
 * part of the background. Weighted by saturation × value so a vivid
 * accent (lava, neon, felt) wins over large flat dark areas. */
const gradientCache = new Map();

function computeGradientStops(img, t, bgT) {
  const key = `${img.src.length}|${img.width}x${img.height}|${bgT.scale}|${bgT.x}|${bgT.y}|${t.id}`;
  if (gradientCache.has(key)) return gradientCache.get(key);

  const sw = 96;
  const sh = Math.round((sw * t.h) / t.w);
  const c = document.createElement("canvas");
  c.width = sw;
  c.height = sh;
  const cx = c.getContext("2d", { willReadFrequently: true });
  const s = sw / t.w;
  drawCoverClipped(cx, img, 0, 0, sw, sh, bgT.scale, bgT.x, bgT.y);

  const y0 = Math.floor(sh * t.gradient.sampleFrom);
  let data;
  try {
    data = cx.getImageData(0, y0, sw, sh - y0).data;
  } catch (e) {
    return { s0: "rgba(0,0,0,0)", s1: "rgba(0,0,0,0.85)" };
  }

  let sx = 0, sy = 0, ws = 0, satNum = 0, satDen = 0, vSum = 0, vN = 0;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i] / 255, g = data[i + 1] / 255, b = data[i + 2] / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const v = max;
    if (v < 0.06) continue;
    const d = max - min;
    const sat = max === 0 ? 0 : d / max;
    let h = 0;
    if (d !== 0) {
      if (max === r) h = ((g - b) / d) % 6;
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h /= 6;
      if (h < 0) h += 1;
    }
    const w = sat * v;
    sx += w * Math.cos(h * 2 * Math.PI);
    sy += w * Math.sin(h * 2 * Math.PI);
    ws += w;
    satNum += sat * w;
    satDen += w;
    vSum += v;
    vN++;
  }

  const hue = ws ? (Math.atan2(sy, sx) / (2 * Math.PI) + 1) % 1 : 0;
  const ms = satDen ? satNum / satDen : 0;
  const mv = vN ? vSum / vN : 0.3;

  const hsv = (h, s, v) => {
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s), q = v * (1 - f * s), tt = v * (1 - (1 - f) * s);
    const [r, g, b] = [
      [v, tt, p],
      [q, v, p],
      [p, v, tt],
      [p, q, v],
      [tt, p, v],
      [v, p, q],
    ][i % 6];
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  };

  const top = hsv(hue, Math.min(1, ms * 0.9), Math.min(0.65, Math.max(0.3, mv * 1.1)));
  const bot = hsv(hue, Math.min(1, ms * 1.6 + 0.25), Math.min(0.8, Math.max(0.45, mv * 1.5)));
  const out = { top, bot };
  gradientCache.set(key, out);
  return out;
}

const rgbStr = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const hex = (c) => "#" + c.map((v) => v.toString(16).padStart(2, "0")).join("");

function fitSize(ctx, text, base, minSize, maxW, weight, family) {
  let size = base;
  ctx.font = font(weight, size, family);
  while (ctx.measureText(text).width > maxW && size > minSize) {
    size -= 1;
    ctx.font = font(weight, size, family);
  }
  return { size, overflow: ctx.measureText(text).width > maxW };
}

/* Moving a one-line name onto a two-line template: the last word goes on the
 * heavy lower line ("MEGA MYSTERY" / "MINE"), matching the existing tiles. */
function splitName(name, lines = 2) {
  const words = String(name || "").trim().split(/\s+/).filter(Boolean);
  const out = new Array(lines).fill("");
  if (!words.length) return out;
  if (words.length <= lines) {
    // fill from the last line back, so a short name lands on the heavy lines
    words.slice().reverse().forEach((w, i) => (out[lines - 1 - i] = w));
    return out;
  }
  // last words take one line each, the rest bunch up on the first line
  for (let i = lines - 1; i >= 1; i--) out[i] = words.pop();
  out[0] = words.join(" ");
  return out;
}

/* House naming convention: Game-Name-2x
 * Words joined with dashes and always title-cased, whatever the user typed —
 * "COYOte ugly" and "COYOTE UGLY" both save as Coyote-Ugly. */
const titleCase = (s) =>
  String(s || "")
    .toLowerCase()
    .replace(/(^|[\s-])([a-z0-9])/g, (m, lead, ch) => lead + ch.toUpperCase());

const dashed = (s) =>
  titleCase(String(s || "").trim())
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

const assetFilename = (gameName, scale) => `${dashed(gameName) || "Asset"}-${scale}x`;

// keep what the user typed, strip only what a filesystem would object to
const safeFilename = (s) =>
  String(s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9._-]+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "")
    .slice(0, 80);


/* ------------------------- saved assets --------------------------- */
/* One key per asset (images make them large) plus a light index the
 * Library grid can read in a single call. */

const INDEX_KEY = "saul:index";
const assetKey = (id) => `saul:asset:${id}`;
const newId = () => `a${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

async function readIndex() {
  try {
    const res = await window.storage.get(INDEX_KEY);
    return res ? JSON.parse(res.value) : [];
  } catch (e) {
    return [];
  }
}

async function writeIndex(list) {
  await window.storage.set(INDEX_KEY, JSON.stringify(list));
}

/* ------------------------------ render ---------------------------- */

function renderThumbnail(ctx, t, S, st, preview) {
  const W = t.w * S;
  const H = t.h * S;
  const notes = { shrunk: [] };

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);

  // Background
  if (st.bgImg) {
    // below 100% the image no longer covers the frame, so fill the gap with a
    // blurred, darkened copy of itself rather than leaving bare canvas
    if (st.bg.scale < 1) {
      ctx.save();
      try {
        ctx.filter = `blur(${Math.round(16 * S)}px) brightness(0.55)`;
      } catch (e) {}
      drawCoverClipped(ctx, st.bgImg, 0, 0, W, H, 1.2, 0, 0);
      ctx.restore();
    }
    drawCoverClipped(ctx, st.bgImg, 0, 0, W, H, st.bg.scale, st.bg.x, st.bg.y);
  } else {
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, "#2b2b2b");
    g.addColorStop(1, "#151515");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  // Foreground layers
  const f = t.foreground;
  // the panel lists layers front-first, so draw the list in reverse
  [...(st.fgs || [])].reverse().forEach((layer) => {
    if (!layer.img) return;
    drawContainFree(
      ctx,
      layer.img,
      { x: f.x * S, y: f.y * S, w: f.w * S, h: f.h * S },
      W,
      H,
      layer.scale,
      layer.x,
      layer.y,
      layer.rotate || 0
    );
  });

  // Gradient scrim
  const gr = t.gradient;
  if (st.gradientOn) {
    let top, bot;
    if (st.gradientMode === "auto" && st.stops) {
      top = st.stops.top;
      bot = st.stops.bot;
    } else {
      top = [0, 0, 0];
      bot = [0, 0, 0];
    }
    const g = ctx.createLinearGradient(
      0,
      (gr.y + gr.from * gr.h) * S,
      0,
      (gr.y + gr.to * gr.h) * S
    );
    gr.stops.forEach((stop) => {
      // c is "top", "bot", or a 0–1 blend between them
      const k = stop.c === "bot" ? 1 : stop.c === "top" ? 0 : stop.c;
      const col = [0, 1, 2].map((i) => Math.round(top[i] + (bot[i] - top[i]) * k));
      g.addColorStop(stop.p, rgbStr(col, stop.a * st.gradientOpacity));
    });
    ctx.fillStyle = g;
    ctx.fillRect(gr.x * S, gr.y * S, gr.w * S, gr.h * S);
  }

  // Text
  const maxW = (t.w - t.sidePadding * 2) * S;
  t.texts.forEach((spec) => {
    const raw = (st.texts[spec.key] || "").trim();
    if (!raw) return;
    const value = spec.uppercase && st.uppercase ? raw.toUpperCase() : raw;
    let size = spec.size * S;
    if (st.autoFit) {
      const r = fitSize(ctx, value, spec.size * S, spec.minSize * S, maxW, spec.weight, spec.family);
      size = r.size;
      if (r.size < spec.size * S - 0.5) notes.shrunk.push({ key: spec.key, from: spec.size, to: Math.round(size / S) });
    }
    ctx.font = font(spec.weight, size, spec.family);
    ctx.fillStyle = spec.color;
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    // Figma: baseline = box top + ascent, and ascent = 1.0em for Barlow
    ctx.fillText(value, (t.w / 2) * S, (spec.boxY + spec.size) * S);
    if (!st.autoFit && ctx.measureText(value).width > maxW) notes.shrunk.push({ key: spec.key, overflow: true });
  });

  return notes;
}

/* --------------------------- UI primitives ------------------------ */

function SaulLogo({ height = 22 }) {
  return (
    <svg height={height} viewBox="0 0 356 51" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", color: "#ffffff" }}>
      <path d="M11.3936 22.2939L27.5488 8.57715C27.5488 8.57715 29.1871 7.00015 32.2305 7H45.6543L28.875 21.1904L46.0439 41.8447H33.8701C30.6831 41.8447 29.2767 39.8895 29.2656 39.874L20.0566 28.7588L11.3936 36.0898V41.7666H0V7H11.3936V22.2939ZM94.8975 7V18.5098H77.5723V41.7666H66.1787V18.5098H48.8535V7H94.8975ZM127.831 7C137.274 7.00015 145 14.8048 145 24.3438C145 33.8826 137.352 41.6874 127.831 41.6875H114.563C105.121 41.6873 97.3946 33.8826 97.3945 24.3438C97.3945 14.8049 105.043 7.00019 114.563 7H127.831ZM114.485 18.4307C111.286 18.4309 108.633 21.1117 108.633 24.3438C108.633 27.5758 111.286 30.2556 114.485 30.2559H127.831C131.031 30.2557 133.684 27.6547 133.684 24.3438C133.684 21.1116 131.031 18.4308 127.831 18.4307H114.485Z" fill="#DA0000"/>
      <path d="M318.284 49.248L330.236 1.07996H346.724L337.94 36.432H355.652L352.484 49.248H318.284Z" fill="currentColor"/>
      <path d="M291.352 50.688C277.168 50.688 269.176 42.696 272.632 28.872L279.544 1.07996H295.816L288.616 30.024C287.464 34.704 288.976 37.872 293.08 37.872C296.752 37.872 298.696 35.136 299.92 30.168L307.192 1.07996H323.464L316.192 30.384C312.952 43.344 304.816 50.688 291.352 50.688Z" fill="currentColor"/>
      <path d="M218.009 49.248L241.337 1.07996H268.337L266.969 49.248H250.553L251.201 40.68H238.961L235.289 49.248H218.009ZM243.569 29.664H251.993L253.865 4.96796L243.569 29.664Z" fill="currentColor"/>
      <path d="M197.147 50.472C183.467 50.472 174.971 44.352 177.419 32.04H193.331C192.827 36.864 194.051 39.6 198.011 39.6C200.747 39.6 202.187 38.232 202.187 35.568C202.187 33.552 201.107 32.256 194.555 29.808C187.427 27.144 183.611 23.328 183.611 16.488C183.611 5.4 191.387 0 204.419 0C217.811 0 225.443 5.832 223.139 17.28H207.443C208.091 13.464 207.083 10.872 203.411 10.872C200.963 10.872 199.523 12.168 199.523 14.112C199.523 16.2 201.683 17.064 206.723 18.936C215.291 22.104 219.251 26.352 219.251 33.48C219.251 44.64 211.331 50.472 197.147 50.472Z" fill="currentColor"/>
    </svg>
  );
}

function Section({ title, badge, children }) {
  return (
    <div style={{ borderBottom: `1px solid ${C.line}` }} className="px-4 py-4">
      <div className="mb-3 flex items-center justify-between">
        <span style={{ color: C.text, fontSize: 11, fontWeight: 600, letterSpacing: "0.04em" }}>{title}</span>
        {badge}
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

function Field({ label, value, onChange, hint }) {
  return (
    <label className="block">
      <span style={{ color: C.label }} className="mb-1 block text-xs">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ background: C.panel2, border: `1px solid ${C.line}`, color: C.text }}
        className="w-full rounded px-2.5 py-2 text-sm outline-none"
      />
      {hint && (
        <span style={{ color: C.yellow }} className="mt-1 block text-xs">
          {hint}
        </span>
      )}
    </label>
  );
}

const SLIDER_TRACK = "#3c3c3c";
const SLIDER_FILL = "#9b9b9b";

const SLIDER_CSS = `
.saul-range {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 4px;
  border-radius: 2px;
  outline: none;
  cursor: pointer;
}
.saul-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: ${SLIDER_FILL};
  border: none;
  cursor: pointer;
}
.saul-range::-moz-range-thumb {
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: ${SLIDER_FILL};
  border: none;
  cursor: pointer;
}
.saul-range::-moz-range-track { background: transparent; }
.saul-range:focus-visible::-webkit-slider-thumb { box-shadow: 0 0 0 3px rgba(155,155,155,0.3); }
`;

function Slider({ label, value, onChange, min, max, step, format }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between">
        <span style={{ color: C.label }} className="text-xs">
          {label}
        </span>
        <span style={{ color: C.text }} className="text-xs tabular-nums">
          {format ? format(value) : value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="saul-range"
        style={{
          background: `linear-gradient(to right, ${SLIDER_FILL} 0%, ${SLIDER_FILL} ${pct}%, ${SLIDER_TRACK} ${pct}%, ${SLIDER_TRACK} 100%)`,
        }}
      />
    </div>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <button onClick={() => onChange(!checked)} className="flex w-full items-center gap-2.5 py-0.5 text-left">
      <span
        style={{
          background: checked ? C.sel : "transparent",
          border: `1px solid ${checked ? C.sel : C.dim2}`,
          width: 16,
          height: 16,
        }}
        className="flex shrink-0 items-center justify-center rounded-sm"
      >
        {checked && (
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 6.2L4.8 8.5L9.5 3.8" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span style={{ color: checked ? C.text : C.dim }} className="text-xs">
        {label}
      </span>
    </button>
  );
}

function IconButton({ onClick, disabled, title, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        background: C.panel2,
        border: `1px solid ${C.line}`,
        color: disabled ? C.dim2 : C.dim,
        opacity: disabled ? 0.5 : 1,
      }}
      className="flex items-center justify-center rounded px-2 py-2"
    >
      {children}
    </button>
  );
}

function Uploader({ label, img, onFile, onClear, actions }) {
  const ref = useRef(null);
  return (
    <div>
      <span style={{ color: C.label }} className="mb-1.5 block text-xs">
        {label}
      </span>
      <div className="flex gap-2">
        <button
          onClick={() => ref.current?.click()}
          style={{ background: C.panel2, border: `1px solid ${C.line}`, color: img ? C.label : C.dim2 }}
          className="flex-1 truncate rounded px-2.5 py-2 text-xs"
        >
          {img ? `${img.width}×${img.height}px` : "Choose file…"}
        </button>
        {actions}
        {img && (
          <button
            onClick={onClear}
            style={{ background: C.panel2, border: `1px solid ${C.line}`, color: C.dim }}
            className="rounded px-2.5 py-2 text-xs"
          >
            Clear
          </button>
        )}
      </div>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}

function SegButtons({ options, value, onChange }) {
  return (
    <div style={{ background: C.panel2, border: `1px solid ${C.line}` }} className="flex rounded p-0.5">
      {options.map(([val, label, sub]) => {
        const on = val === value;
        return (
          <button
            key={val}
            onClick={() => onChange(val)}
            style={{ background: on ? C.sel : "transparent", color: on ? "#000" : C.dim }}
            className="flex-1 rounded px-3 py-2 text-center"
          >
            <span className="block text-xs" style={{ fontWeight: 600 }}>
              {label}
            </span>
            {sub && (
              <span className="block text-xs tabular-nums" style={{ color: on ? "rgba(255,255,255,0.75)" : C.dim2 }}>
                {sub}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function ExportDialog({ t, format, setFormat, scale, setScale, filename, setFilename, onFilenameEdit, preview, onClose, onConfirm }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter") onConfirm();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onConfirm]);

  const kb = preview.bytes ? (preview.bytes > 1024 * 1024 ? `${(preview.bytes / 1048576).toFixed(1)} MB` : `${Math.round(preview.bytes / 1024)} KB`) : "—";
  const rec = t.exportDefaults;
  const isRecommended = rec && rec.format === format && rec.scale === scale;

  return (
    <div
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      style={{ background: "rgba(0,0,0,0.72)" }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
    >
      <div
        style={{ background: C.panel, border: `1px solid ${C.line}`, width: 520, boxShadow: "0 30px 80px rgba(0,0,0,0.6)" }}
        className="overflow-hidden rounded-lg"
      >
        <div style={{ borderBottom: `1px solid ${C.line}` }} className="flex items-start justify-between gap-4 px-5 py-4">
          <div>
            <div style={{ fontWeight: 600 }}>Download asset</div>
            <div style={{ color: C.dim2 }} className="mt-0.5 text-xs">
              {t.name}
            </div>
          </div>
          {rec && (
            <div className="shrink-0 text-right">
              {isRecommended ? (
                <span style={{ color: C.green }} className="text-xs">
                  Recommended settings
                </span>
              ) : (
                <button
                  onClick={() => {
                    setFormat(rec.format);
                    setScale(rec.scale);
                  }}
                  style={{ color: C.yellow }}
                  className="text-xs underline"
                >
                  Recommended settings
                </button>
              )}
              {t.exportNote && (
                <span style={{ color: C.dim2, maxWidth: 230 }} className="mt-0.5 block text-xs leading-snug">
                  {t.exportNote}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-5 px-5 py-5">
          <div className="shrink-0">
            {preview.url ? (
              <img
                src={preview.url}
                alt=""
                style={{ width: 104, border: `1px solid ${C.line}`, background: "#000" }}
                className="rounded"
              />
            ) : (
              <div style={{ width: 104, height: 139, background: C.panel2 }} className="rounded" />
            )}
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <div>
              <span style={{ color: C.label }} className="mb-1.5 block text-xs">
                File type
              </span>
              <SegButtons
                options={[
                  ["jpg", "JPG"],
                  ["png", "PNG"],
                ]}
                value={format}
                onChange={setFormat}
              />
            </div>

            <div>
              <span style={{ color: C.label }} className="mb-1.5 block text-xs">
                Resolution
              </span>
              <SegButtons
                options={[
                  ["1", "1×"],
                  ["2", "2×"],
                  ["3", "3×"],
                ]}
                value={String(scale)}
                onChange={(v) => setScale(Number(v))}
              />
            </div>

            <label className="block">
              <span style={{ color: C.label }} className="mb-1.5 block text-xs">
                File name
              </span>
              <div className="flex items-center gap-2">
                <input
                  value={filename}
                  onChange={(e) => {
                    onFilenameEdit();
                    setFilename(e.target.value);
                  }}
                  style={{ background: C.panel2, border: `1px solid ${C.line}`, color: C.text }}
                  className="min-w-0 flex-1 rounded px-2.5 py-2 text-sm outline-none"
                />
                <span style={{ color: C.dim2 }} className="text-sm">
                  .{format}
                </span>
              </div>
            </label>
          </div>
        </div>

        <div
          style={{ borderTop: `1px solid ${C.line}`, background: C.bg }}
          className="flex items-center justify-between px-5 py-3"
        >
          <span style={{ color: C.dim2 }} className="text-xs tabular-nums">
            {t.w * scale}×{t.h * scale} px · {kb}
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              style={{ background: C.panel2, border: `1px solid ${C.line}`, color: C.dim }}
              className="rounded px-3 py-2 text-xs"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              style={{ background: C.green, color: "#000", fontWeight: 600 }}
              className="rounded px-4 py-2 text-xs"
            >
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


function Library({ items, loading, onOpen, onRename, onDelete }) {
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState("");

  if (loading) {
    return (
      <div style={{ color: C.dim2 }} className="p-8 text-sm">
        Loading saved assets…
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8">
        <span style={{ color: C.dim }} className="text-sm">
          Nothing saved yet
        </span>
        <span style={{ color: C.dim2 }} className="text-xs">
          Build an asset on the Create tab and hit Save to keep it here.
        </span>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))" }}>
        {items.map((it) => (
          <div key={it.id} style={{ background: C.panel, border: `1px solid ${C.line}` }} className="overflow-hidden rounded">
            <button onClick={() => onOpen(it.id, it.name)} className="block w-full" title="Open in Create">
              <img src={it.thumb} alt="" style={{ display: "block", width: "100%", background: "#000" }} />
            </button>
            <div className="flex flex-col gap-1.5 px-2.5 py-2">
              {editing === it.id ? (
                <input
                  autoFocus
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onBlur={() => {
                    onRename(it.id, draft.trim() || it.name);
                    setEditing(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                    if (e.key === "Escape") setEditing(null);
                  }}
                  style={{ background: C.panel2, border: `1px solid ${C.line}`, color: C.text }}
                  className="w-full rounded px-2 py-1 text-xs outline-none"
                />
              ) : (
                <button
                  onClick={() => {
                    setEditing(it.id);
                    setDraft(it.name);
                  }}
                  style={{ color: C.text }}
                  className="truncate text-left text-xs"
                  title="Rename"
                >
                  {it.name}
                </button>
              )}
              <div className="flex items-center justify-between">
                <span style={{ color: C.dim2 }} className="text-xs">
                  {new Date(it.savedAt).toLocaleDateString()}
                </span>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setEditing(it.id);
                      setDraft(it.name);
                    }}
                    style={{ color: C.dim2 }}
                    className="text-xs"
                  >
                    Rename
                  </button>
                  <button onClick={() => onDelete(it.id)} style={{ color: C.dim2 }} className="text-xs">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------- app ------------------------------ */

export default function KtoSaul() {
  const [tab, setTab] = useState("create");
  const [library, setLibrary] = useState([]);
  const [libLoading, setLibLoading] = useState(false);
  const [assetId, setAssetId] = useState(null);
  const [assetName, setAssetName] = useState("Casino Thumbnail - 1 line");
  const [renaming, setRenaming] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved | error
  const [category, setCategory] = useState("Casino Thumbnails");
  const [templateId, setTemplateId] = useState("casino-thumb-1line");
  const t = TEMPLATES.find((x) => x.id === templateId);
  // a template is "live" only when it is built and belongs to the chosen type
  const live = t.ready && t.group === category;
  const canSave = t.ready && tab === "create";

  const [texts, setTexts] = useState({ gameName: "GAME", gameLine1: "GAME", gameLine2: "GAME", gameLine3: "GAME", provider: "PROVIDER" });
  const [bgImg, setBgImg] = useState(null);
  const [fgs, setFgs] = useState([{ img: null, scale: 1, x: 0, y: 0, rotate: 0 }]);
  const [bg, setBg] = useState({ scale: 1, x: 0, y: 0 });
  const [gradientOn, setGradientOn] = useState(true);
  const [gradientMode, setGradientMode] = useState("auto");
  const [gradientOpacity, setGradientOpacity] = useState(1);
  const [stops, setStops] = useState(null);
  // not displayed, but flipping it forces the canvas to redraw once Barlow has
  // loaded — otherwise the first paint measures a fallback font
  const [fontsReady, setFontsReady] = useState(false);
  const [format, setFormat] = useState(t.exportDefaults?.format || "png");
  const [exportScale, setExportScale] = useState(t.exportDefaults?.scale || 1);
  const [exportOpen, setExportOpen] = useState(false);
  const [filename, setFilename] = useState("");
  const [filenameEdited, setFilenameEdited] = useState(false);
  const [preview, setPreview] = useState({ url: null, bytes: 0 });
  const [notes, setNotes] = useState({ shrunk: [] });

  const canvasRef = useRef(null);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Barlow:wght@500;900&family=Inter:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
    const load = async () => {
      try {
        await Promise.all([
          document.fonts.load("900 72px Barlow"),
          document.fonts.load("500 20px Barlow"),
          document.fonts.load("600 14px Inter"),
        ]);
      } catch (e) {}
      setFontsReady(true);
    };
    load();
    const tm = setTimeout(() => setFontsReady(true), 2500);
    return () => clearTimeout(tm);
  }, []);

  // keep the game name when switching templates: a one-line name splits across
  // the two lines (last word on the heavy line), two lines join back into one
  const prevTemplate = useRef(templateId);
  useEffect(() => {
    const from = TEMPLATES.find((x) => x.id === prevTemplate.current);
    prevTemplate.current = templateId;
    if (!from || from.id === templateId) return;
    // an untouched name follows the template; a friendly one is left alone
    setAssetName((prev) => (prev === from.name ? t.name : prev));
    setTexts((prev) => {
      const fd = from.defaults || {};
      // still on placeholder copy? then just adopt the new template's placeholders
      const untouched = (from.nameKeys || ["gameName"]).every((k) => prev[k] === fd[k]);
      if (untouched && t.defaults) return { ...prev, ...t.defaults };
      const fromKeys = from.nameKeys || ["gameName"];
      const toKeys = t.nameKeys || ["gameName"];
      const full = fromKeys.map((k) => prev[k]).filter(Boolean).join(" ");
      if (toKeys.length === 1) return { ...prev, [toKeys[0]]: full };
      const lines = splitName(full, toKeys.length);
      const next = { ...prev };
      toKeys.forEach((k, i) => (next[k] = lines[i]));
      return next;
    });
  }, [templateId]);

  // recompute the auto gradient whenever the visible background changes
  useEffect(() => {
    if (!bgImg || !live) return setStops(null);
    setStops(computeGradientStops(bgImg, t, bg));
  }, [bgImg, bg.scale, bg.x, bg.y, templateId]);

  const nameKeys = t.nameKeys || ["gameName"];
  const fullGameName = nameKeys.map((k) => texts[k]).filter(Boolean).join(" ");

  const st = {
    texts,
    bgImg,
    fgs,
    bg,
    gradientOn,
    gradientMode,
    gradientOpacity,
    stops,
    uppercase: t.textBehaviour?.uppercase ?? true,
    autoFit: t.textBehaviour?.autoFit ?? true,
  };

  useEffect(() => {
    if (!live) return;
    const cv = canvasRef.current;
    if (!cv) return;
    cv.width = t.w;
    cv.height = t.h;
    const n = renderThumbnail(cv.getContext("2d"), t, 1, st, true);
    // the draw runs on every render, so only commit notes when they change
    setNotes((prev) => (JSON.stringify(prev) === JSON.stringify(n) ? prev : n));
  });

  const resetAll = () => {
    setBgImg(null);
    setBg({ scale: 1, x: 0, y: 0 });
    setFgs([{ img: null, scale: 1, x: 0, y: 0, rotate: 0 }]);
    setStops(null);
    setGradientOn(true);
    setGradientMode("auto");
    setGradientOpacity(1);
    setTexts({ gameName: "GAME", gameLine1: "GAME", gameLine2: "GAME", gameLine3: "GAME", provider: "PROVIDER", ...(t.defaults || {}) });
    setAssetId(null);
    setAssetName(t.name);
  };

  const refreshLibrary = async () => {
    setLibLoading(true);
    const list = await readIndex();
    setLibrary(list.sort((a, b) => b.savedAt - a.savedAt));
    setLibLoading(false);
  };

  useEffect(() => {
    if (tab === "library") refreshLibrary();
  }, [tab]);

  const saveAsset = async () => {
    if (!live) return;
    setSaveState("saving");
    try {
      // small preview for the Library grid, kept in the index
      const thumbW = 240;
      const tc = document.createElement("canvas");
      const ts = thumbW / t.w;
      tc.width = thumbW;
      tc.height = Math.round(t.h * ts);
      renderThumbnail(tc.getContext("2d"), t, ts, st, false);
      const thumb = tc.toDataURL("image/jpeg", 0.7);

      const id = assetId || newId();
      const payload = {
        id,
        templateId,
        category,
        texts,
        bg: { scale: bg.scale, x: bg.x, y: bg.y, src: bgImg ? bgImg.src : null },
        fgs: fgs.map((l) => ({ scale: l.scale, x: l.x, y: l.y, rotate: l.rotate || 0, src: l.img ? l.img.src : null })),
        gradient: { on: gradientOn, mode: gradientMode, opacity: gradientOpacity },
      };
      await window.storage.set(assetKey(id), JSON.stringify(payload));

      const list = await readIndex();
      const entry = { id, name: assetName || t.name, templateId, savedAt: Date.now(), thumb };
      await writeIndex([entry, ...list.filter((x) => x.id !== id)]);

      setAssetId(id);
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2000);
    } catch (e) {
      setSaveState("error");
      setTimeout(() => setSaveState("idle"), 3000);
    }
  };

  const openAsset = async (id, name) => {
    try {
      const res = await window.storage.get(assetKey(id));
      const a = JSON.parse(res.value);
      const tpl = TEMPLATES.find((x) => x.id === a.templateId);
      if (tpl) {
        prevTemplate.current = a.templateId; // skip the name-carrying rewrite
        setCategory(a.category || tpl.group);
        setTemplateId(a.templateId);
      }
      setTexts(a.texts);
      setGradientOn(a.gradient?.on ?? true);
      setGradientMode(a.gradient?.mode ?? "auto");
      setGradientOpacity(a.gradient?.opacity ?? 1);
      setBg({ scale: a.bg.scale, x: a.bg.x, y: a.bg.y });
      setBgImg(null);
      if (a.bg.src) {
        const img = new Image();
        img.onload = () => setBgImg(img);
        img.src = a.bg.src;
      }
      setFgs(a.fgs.map((l) => ({ img: null, scale: l.scale, x: l.x, y: l.y, rotate: l.rotate })));
      a.fgs.forEach((l, i) => {
        if (!l.src) return;
        const img = new Image();
        img.onload = () => setFgs((prev) => prev.map((p, n) => (n === i ? { ...p, img } : p)));
        img.src = l.src;
      });
      setAssetId(id);
      if (name) setAssetName(name);
      setTab("create");
    } catch (e) {
      setSaveState("error");
      setTimeout(() => setSaveState("idle"), 3000);
    }
  };

  const renameAsset = async (id, name) => {
    const list = await readIndex();
    await writeIndex(list.map((x) => (x.id === id ? { ...x, name } : x)));
    if (assetId === id) setAssetName(name);
    refreshLibrary();
  };

  const deleteAsset = async (id) => {
    try {
      await window.storage.delete(assetKey(id));
    } catch (e) {}
    const list = await readIndex();
    await writeIndex(list.filter((x) => x.id !== id));
    if (assetId === id) setAssetId(null);
    refreshLibrary();
  };

  const MAX_FG = 3;
  const patchFg = (i, patch) => setFgs((prev) => prev.map((l, n) => (n === i ? { ...l, ...patch } : l)));
  const addFg = () =>
    setFgs((prev) => (prev.length >= MAX_FG ? prev : [...prev, { img: null, scale: 1, x: 0, y: 0, rotate: 0 }]));
  const moveFg = (i, delta) =>
    setFgs((prev) => {
      const j = i + delta;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  const removeFg = (i) =>
    setFgs((prev) => (prev.length === 1 ? [{ img: null, scale: 1, x: 0, y: 0, rotate: 0 }] : prev.filter((l, n) => n !== i)));

  const loadFile = (file, setter) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => setter(img);
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const renderToURL = (scale, fmt) => {
    const cv = document.createElement("canvas");
    cv.width = Math.round(t.w * scale);
    cv.height = Math.round(t.h * scale);
    renderThumbnail(cv.getContext("2d"), t, scale, st, false);
    return cv.toDataURL(fmt === "jpg" ? "image/jpeg" : "image/png", 0.92);
  };

  const openExport = () => {
    if (!live) return;
    const d = t.exportDefaults || { format: "png", scale: 1 };
    setFormat(d.format);
    setExportScale(d.scale);
    setFilename(assetFilename(fullGameName, d.scale));
    setFilenameEdited(false);
    setExportOpen(true);
  };

  // the name carries the export size, so keep it in step with the resolution
  // picker — unless the user has typed their own
  useEffect(() => {
    if (!exportOpen || filenameEdited) return;
    setFilename(assetFilename(fullGameName, exportScale));
  }, [exportOpen, exportScale, filenameEdited, fullGameName]);

  // build the preview + file size whenever the dialog settings change
  useEffect(() => {
    if (!exportOpen) return;
    const url = renderToURL(exportScale, format);
    const bytes = Math.round((url.length - url.indexOf(",") - 1) * 0.75);
    setPreview({ url, bytes });
  }, [exportOpen, exportScale, format]);

  const confirmDownload = useCallback(() => {
    const name = `${safeFilename(filename) || assetFilename(fullGameName, exportScale)}.${format}`;
    const mime = format === "jpg" ? "image/jpeg" : "image/png";

    const save = (href, isObjectUrl) => {
      const a = document.createElement("a");
      a.href = href;
      a.download = name;
      a.rel = "noopener";
      // Firefox and sandboxed frames need the anchor in the document to fire
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      if (isObjectUrl) setTimeout(() => URL.revokeObjectURL(href), 5000);
      setExportOpen(false);
    };

    const cv = document.createElement("canvas");
    cv.width = Math.round(t.w * exportScale);
    cv.height = Math.round(t.h * exportScale);
    renderThumbnail(cv.getContext("2d"), t, exportScale, st, false);

    // a blob URL is far more reliable than a multi-megabyte data: URL
    if (cv.toBlob) {
      cv.toBlob(
        (blob) => (blob ? save(URL.createObjectURL(blob), true) : save(cv.toDataURL(mime, 0.92), false)),
        mime,
        0.92
      );
    } else {
      save(cv.toDataURL(mime, 0.92), false);
    }
  }, [t, exportScale, format, filename, st, fullGameName]);

  const inCategory = TEMPLATES.filter((x) => x.group === category);

  const changeCategory = (next) => {
    setCategory(next);
    const first = TEMPLATES.find((x) => x.group === next && x.ready) || TEMPLATES.find((x) => x.group === next);
    if (first) setTemplateId(first.id);
  };
  const shrunkNote = notes.shrunk?.[0];

  return (
    <div
      style={{ background: C.bg, color: C.text, fontFamily: "Inter, system-ui, sans-serif", fontSize: 14 }}
      className="flex h-screen w-full flex-col overflow-hidden"
    >
      <style>{SLIDER_CSS}</style>

      <header
        style={{ background: C.panel, borderBottom: `1px solid ${C.line}` }}
        className="flex shrink-0 items-center justify-between px-4 py-2.5"
      >
        <div className="flex items-center">
          {/* logo block matches the width of the left rail so the tabs line up with the stage */}
          <div style={{ width: 224 - 16 }} className="flex items-center">
            <SaulLogo height={22} />
          </div>
          <div className="flex gap-4">
            {[
              ["create", "Create"],
              ["library", "Library"],
            ].map(([k, label]) => (
              <button
                key={k}
                onClick={() => setTab(k)}
                style={{
                  color: tab === k ? C.text : C.dim,
                  borderBottom: `2px solid ${tab === k ? C.red : "transparent"}`,
                }}
                className="pb-1 pt-1 text-xs"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={saveAsset}
            disabled={!canSave}
            title={canSave ? "Save this asset to your Library" : "Pick a built template to save"}
            style={{ color: canSave ? C.yellow : C.dim2 }}
            className="text-xs"
          >
            {saveState === "saving"
              ? "Saving…"
              : saveState === "saved"
              ? "Saved"
              : saveState === "error"
              ? "Save failed"
              : assetId
              ? "Save changes"
              : "Save"}
          </button>
          <button
            onClick={openExport}
            disabled={!live}
            style={{ background: live ? C.green : C.panel2, color: live ? "#000" : C.dim2, fontWeight: 600, fontSize: 13 }}
            className="rounded px-4 py-2"
          >
            Download
          </button>
        </div>
      </header>

      {tab === "library" ? (
        <Library
          items={library}
          loading={libLoading}
          onOpen={(id, name) => openAsset(id, name)}
          onRename={renameAsset}
          onDelete={deleteAsset}
        />
      ) : (
      <div className="flex min-h-0 flex-1">
        <aside style={{ background: C.panel, borderRight: `1px solid ${C.line}` }} className="w-56 shrink-0 overflow-y-auto">
          <div style={{ borderBottom: `1px solid ${C.line}` }} className="px-3 py-3">
            <span style={{ color: C.text, fontSize: 11, fontWeight: 600, letterSpacing: "0.04em" }} className="mb-1.5 block">
              Asset type
            </span>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => changeCategory(e.target.value)}
                style={{ background: C.panel2, border: `1px solid ${C.line}`, color: C.text }}
                className="w-full appearance-none rounded py-2 pl-2.5 pr-7 text-xs outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} style={{ background: C.panel2 }}>
                    {c}
                  </option>
                ))}
              </select>
              <svg
                width="10"
                height="10"
                viewBox="0 0 12 12"
                fill="none"
                style={{ position: "absolute", right: 9, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
              >
                <path d="M2.5 4.5L6 8L9.5 4.5" stroke={C.dim} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <div className="px-3 py-3">
            <span style={{ color: C.text, fontSize: 11, fontWeight: 600, letterSpacing: "0.04em" }} className="mb-2.5 block">
              Template
            </span>
            {inCategory.length === 0 ? (
              <div style={{ color: C.dim2 }} className="px-1 py-2 text-xs leading-relaxed">
                No templates here yet. More templates will be added soon
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                {inCategory.map((tp) => {
                  const active = tp.id === templateId;
                  return (
                    <button
                      key={tp.id}
                      onClick={() => setTemplateId(tp.id)}
                      style={{
                        background: active ? "rgba(0,221,112,0.14)" : "transparent",
                        border: `1px solid ${active ? C.green : "transparent"}`,
                        opacity: tp.ready ? 1 : 0.45,
                      }}
                      className="flex items-center gap-2.5 rounded px-2 py-2 text-left"
                    >
                      <span
                        style={{
                          border: `1px solid ${active ? C.green : C.dim2}`,
                          width: 20,
                          height: Math.round((20 * tp.h) / tp.w),
                          background: active ? "rgba(0,221,112,0.25)" : C.panel2,
                        }}
                        className="shrink-0 rounded-sm"
                      />
                      <span className="min-w-0">
                        <span className="block truncate text-xs">{tp.name}</span>
                        <span style={{ color: active ? C.dim : C.dim2 }} className="block text-xs tabular-nums">
                          {tp.ready ? `${tp.w}×${tp.h}` : "awaiting spec"}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col">
          <div
            style={{ borderBottom: `1px solid ${C.line}`, background: C.panel }}
            className="flex shrink-0 items-center justify-center gap-2 px-4 py-2"
          >
            {renaming ? (
              <input
                autoFocus
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                onBlur={() => {
                  setAssetName(nameDraft.trim() || assetName);
                  setRenaming(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.currentTarget.blur();
                  if (e.key === "Escape") setRenaming(false);
                }}
                style={{ background: C.panel2, border: `1px solid ${C.line}`, color: C.text, width: 260 }}
                className="rounded px-2 py-1 text-center text-xs outline-none"
              />
            ) : (
              <>
                <span style={{ color: C.text }} className="text-xs">
                  {assetName}
                </span>
                <button
                  onClick={() => {
                    setNameDraft(assetName);
                    setRenaming(true);
                  }}
                  title="Rename this asset"
                  style={{ color: C.dim }}
                  className="p-1"
                >
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M9.6 1.9a1.3 1.3 0 0 1 1.9 0l0.6 0.6a1.3 1.3 0 0 1 0 1.9L5.2 10.8 2.3 11.7l0.9-2.9 6.4-6.9Z"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </>
            )}
          </div>

          <div
            className="flex min-h-0 flex-1 items-center justify-center overflow-auto p-6"
            style={{ background: "#0d0d0d" }}
          >
            {live ? (
              <canvas
                ref={canvasRef}
                style={{
                  // preview is always 1:1 — the canvas is 386×516 and renders at 386×516 CSS px
                  width: t.w,
                  height: t.h,
                  flexShrink: 0,
                  boxShadow: "0 18px 60px rgba(0,0,0,0.6)",
                  border: `1px solid ${C.line}`,
                }}
              />
            ) : (
              <div style={{ color: C.dim2 }} className="text-center text-sm">
                Coming Soon
              </div>
            )}
          </div>

          <div
            style={{ borderTop: `1px solid ${C.line}`, background: C.panel, color: C.dim2 }}
            className="flex shrink-0 items-center justify-between px-4 py-2 text-xs"
          >
            <span>
              {t.w}×{t.h} @1x
            </span>
            {stops && gradientOn && gradientMode === "auto" && (
              <span className="flex items-center gap-2">
                Auto gradient
                <span style={{ background: hex(stops.bot), border: `1px solid ${C.line}` }} className="inline-block h-3 w-3 rounded-sm" />
                <span style={{ color: C.yellow }}>{hex(stops.bot)}</span>
              </span>
            )}
          </div>
        </main>

        <aside style={{ background: C.panel, borderLeft: `1px solid ${C.line}` }} className="w-72 shrink-0 overflow-y-auto">
          <Section
            title="Text"
            badge={
              <button onClick={resetAll} style={{ color: C.yellow }} className="text-xs">
                Reset all
              </button>
            }
          >
            {t.texts.map((spec) => (
              <Field
                key={spec.key}
                label={spec.label}
                value={texts[spec.key] || ""}
                onChange={(v) => setTexts({ ...texts, [spec.key]: v })}
                hint={shrunkNote && shrunkNote.key === spec.key ? t.overflowHint : null}
              />
            ))}
          </Section>

          <Section title="Background">
            <Uploader label="Background (JPG or PNG)" img={bgImg} onFile={(f) => loadFile(f, setBgImg)} onClear={() => { setBgImg(null); setBg({ scale: 1, x: 0, y: 0 }); }} />
            {bgImg && (
              <>
                <Slider label="Size" value={bg.scale} min={0.3} max={2.5} step={0.01} onChange={(v) => setBg({ ...bg, scale: v })} format={(v) => `${Math.round(v * 100)}%`} />
                <Slider label="Position X" value={bg.x} min={-0.6} max={0.6} step={0.005} onChange={(v) => setBg({ ...bg, x: v })} format={(v) => v.toFixed(2)} />
                <Slider label="Position Y" value={bg.y} min={-0.6} max={0.6} step={0.005} onChange={(v) => setBg({ ...bg, y: v })} format={(v) => v.toFixed(2)} />
              </>
            )}
          </Section>

          <Section
            title="Foreground"
            badge={
              fgs.length < MAX_FG ? (
                <button onClick={addFg} style={{ color: C.yellow }} className="text-xs">
                  Add foreground
                </button>
              ) : (
                <span style={{ color: C.dim2 }} className="text-xs">
                  3 of 3
                </span>
              )
            }
          >
            {fgs.map((layer, i) => (
              <div
                key={i}
                style={{ borderTop: i === 0 ? "none" : `1px solid ${C.line}`, paddingTop: i === 0 ? 0 : 14 }}
                className="flex flex-col gap-3"
              >
                <Uploader
                  label={fgs.length > 1 ? `Foreground ${i + 1} (PNG)` : "Foreground (PNG)"}
                  img={layer.img}
                  onFile={(file) => loadFile(file, (img) => patchFg(i, { img }))}
                  onClear={() => patchFg(i, { img: null, scale: 1, x: 0, y: 0, rotate: 0 })}
                  actions={
                    fgs.length > 1 ? (
                      <>
                        <IconButton onClick={() => moveFg(i, -1)} disabled={i === 0} title="Bring forward">
                          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                            <path d="M6 9.5V2.5M6 2.5L2.8 5.7M6 2.5L9.2 5.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </IconButton>
                        <IconButton onClick={() => moveFg(i, 1)} disabled={i === fgs.length - 1} title="Send backward">
                          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                            <path d="M6 2.5V9.5M6 9.5L2.8 6.3M6 9.5L9.2 6.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </IconButton>
                      </>
                    ) : null
                  }
                />
                {layer.img && (
                  <>
                    <Slider label="Size" value={layer.scale} min={0.2} max={3} step={0.01} onChange={(v) => patchFg(i, { scale: v })} format={(v) => `${Math.round(v * 100)}%`} />
                    <Slider label="Position X" value={layer.x} min={-0.6} max={0.6} step={0.005} onChange={(v) => patchFg(i, { x: v })} format={(v) => v.toFixed(2)} />
                    <Slider label="Position Y" value={layer.y} min={-0.6} max={0.6} step={0.005} onChange={(v) => patchFg(i, { y: v })} format={(v) => v.toFixed(2)} />
                    <Slider label="Rotation" value={layer.rotate || 0} min={-180} max={180} step={1} onChange={(v) => patchFg(i, { rotate: v })} format={(v) => `${v}°`} />
                  </>
                )}
                <div className="flex gap-4">
                  {layer.img && (layer.scale !== 1 || layer.x !== 0 || layer.y !== 0 || (layer.rotate || 0) !== 0) && (
                    <button
                      onClick={() => patchFg(i, { scale: 1, x: 0, y: 0, rotate: 0 })}
                      style={{ color: C.dim }}
                      className="text-left text-xs underline"
                    >
                      Reset to template position
                    </button>
                  )}
                  {fgs.length > 1 && (
                    <button onClick={() => removeFg(i)} style={{ color: C.dim2 }} className="text-left text-xs underline">
                      Remove layer
                    </button>
                  )}
                </div>
              </div>
            ))}
          </Section>

          <Section
            title="Gradient"
            badge={
              gradientOn && stops && gradientMode === "auto" ? (
                <span style={{ color: C.dim2 }} className="text-xs">
                  from background
                </span>
              ) : null
            }
          >
            <Checkbox label="Gradient overlay" checked={gradientOn} onChange={setGradientOn} />
            {gradientOn && (
              <>
                <div>
                  <span style={{ color: C.label }} className="mb-1.5 block text-xs">
                    Colours
                  </span>
                  <div style={{ background: C.panel2, border: `1px solid ${C.line}` }} className="flex rounded p-0.5">
                    {[
                      ["auto", "Automatic"],
                      ["manual", "Black"],
                    ].map(([k, lab]) => (
                      <button
                        key={k}
                        onClick={() => setGradientMode(k)}
                        style={{ background: gradientMode === k ? C.sel : "transparent", color: gradientMode === k ? "#000" : C.dim }}
                        className="flex-1 rounded px-2 py-1.5 text-xs"
                      >
                        {lab}
                      </button>
                    ))}
                  </div>
                </div>
                <Slider
                  label="Opacity"
                  value={gradientOpacity}
                  min={0.3}
                  max={1}
                  step={0.01}
                  onChange={setGradientOpacity}
                  format={(v) => `${Math.round(v * 100)}%`}
                />
                {stops && gradientMode === "auto" && (
                  <div style={{ color: C.dim2 }} className="text-xs leading-relaxed">
                    Sampled from the lower half of your background. Upload a different image and it re-tints itself.
                  </div>
                )}
              </>
            )}
          </Section>
        </aside>
      </div>
      )}

      {exportOpen && (
        <ExportDialog
          t={t}
          format={format}
          setFormat={setFormat}
          scale={exportScale}
          setScale={setExportScale}
          filename={filename}
          setFilename={setFilename}
          onFilenameEdit={() => setFilenameEdited(true)}
          preview={preview}
          onClose={() => setExportOpen(false)}
          onConfirm={confirmDownload}
        />
      )}
    </div>
  );
}
