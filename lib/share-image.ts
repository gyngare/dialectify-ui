// Renders the Threads share card (1080×1350, Threads' 4:5 portrait) to a PNG.
//
// Dark, to sit in the Threads feed. Material 3 dark structure: near-black
// surface, one tonal container, pastel "80-tone" colours for data, 28px
// container radius, pill chips. The visual is a 100-cell waffle: one cell per
// Rp1 of every Rp100 sold, coloured by which fee takes it.

import { formatRpShort } from "./format";
import type { FeeLine, FeeResult } from "./shopee-fees";

type Fonts = { sans: string; mono: string };

const W = 1080;
const H = 1350;
const PAD = 80;

// Surfaces and text (M3 dark roles)
const BG = "#0e0f12"; // surface
const CONTAINER = "#1a1c21"; // surface-container
const CONTAINER_HI = "#24272e"; // surface-container-high
const ON = "#f1f2f6"; // on-surface
const ON_VAR = "#a9aebb"; // on-surface-variant
const OUTLINE = "#3a3e47";
const ACCENT = "#ff9e7a"; // the number

// Fee colours, tone ~80 on dark
const FEE_COLOR: Record<string, string> = {
  admin: "#a8c7fa",
  gox: "#ffb4a1",
  promo: "#ffd58a",
  live: "#e3b8ff",
  proses: "#8fe0bf",
  payment: "#c4c8f8",
  preorder: "#d9d2c3",
};
const color = (l: FeeLine) => FEE_COLOR[l.key] ?? "#c4c7cf";

// Short legend labels so value and label never collide.
const SHORT: Record<string, string> = {
  admin: "Biaya admin",
  proses: "Proses pesanan",
  payment: "Pembayaran Mall",
  gox: "Gratis Ongkir",
  promo: "Promo XTRA",
  live: "Live/Video",
  preorder: "Pre-order",
};

const LOGO_BUBBLE =
  "M30 22h36c16 0 28 11 28 28s-12 28-28 28H56L38 96V78H30C20 78 14 72 14 63V37C14 28 20 22 30 22Z";

export async function renderShareImage(
  result: FeeResult,
  sales: number,
  fonts: Fonts,
  opts: {
    /** Show Rupiah figures. Off by default: total Rp + % would reveal omzet. */
    showRupiah?: boolean;
    /** Add an ads chip under the headline. Ads are not a service fee. */
    showAds?: boolean;
  } = {},
): Promise<Blob> {
  const { showRupiah = false, showAds = false } = opts;
  const fees = result.lines
    .filter((l) => l.kind !== "iklan" && l.amount > 0)
    .sort((a, b) => b.amount - a.amount);
  const hasAds = showAds && result.adPct > 0;
  const pctOf = (n: number) => (sales > 0 ? (n / sales) * 100 : 0);
  const f1 = (n: number) => n.toLocaleString("id-ID", { maximumFractionDigits: 1 });

  await document.fonts.ready;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.textBaseline = "alphabetic";

  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, W, H);

  /* ---------- Header: logo + chip ---------- */
  const headY = 72;
  ctx.save();
  ctx.translate(PAD, headY);
  ctx.scale(48 / 120, 48 / 120);
  roundRect(ctx, 0, 0, 120, 120, 28);
  ctx.fillStyle = "#2f6fd6";
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.fill(new Path2D(LOGO_BUBBLE));
  ctx.beginPath();
  ctx.arc(76, 52, 7, 0, Math.PI * 2);
  ctx.fillStyle = "#2f6fd6";
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = ON;
  ctx.font = `600 34px ${fonts.sans}`;
  ctx.fillText("dialectify", PAD + 64, headY + 36);

  chip(ctx, fonts, "Kalkulator biaya Shopee", W - PAD, headY + 4, "right", "outline");

  /* ---------- Headline ---------- */
  let y = 250;
  ctx.fillStyle = ON_VAR;
  ctx.font = `500 50px ${fonts.sans}`;
  ctx.fillText("Selamat, kamu bayar", PAD, y);

  const pct = f1(result.feesOnlyPct);
  let size = 270;
  ctx.font = `600 ${size}px ${fonts.sans}`;
  while (ctx.measureText(`${pct}%`).width > W - PAD * 2 && size > 140) {
    size -= 10;
    ctx.font = `600 ${size}px ${fonts.sans}`;
  }
  y += size * 0.86;
  ctx.fillStyle = ACCENT;
  // Tighten the big numerals a little.
  drawTracked(ctx, `${pct}%`, PAD - size * 0.04, y, -size * 0.03);

  y += 82;
  ctx.fillStyle = ON;
  ctx.font = `600 56px ${fonts.sans}`;
  ctx.fillText("biaya layanan ke Shopee", PAD, y);

  y += 58;
  ctx.fillStyle = ON_VAR;
  ctx.font = `400 32px ${fonts.sans}`;
  const cents = Math.round(Math.min(100, result.feesOnlyPct));
  ctx.fillText(
    showRupiah
      ? `${formatRpShort(result.feesOnly)} dari omzet ${formatRpShort(sales)} sebulan`
      : `Dari setiap Rp100 penjualan, Rp${cents} masuk ke Shopee`,
    PAD,
    y,
  );

  /* ---------- Optional ads chip, then the panel, then footer ---------- */
  if (hasAds) {
    const label = showRupiah
      ? `+ iklan ${formatRpShort(result.total - result.feesOnly)}  ·  total ${f1(result.totalPct)}% omzet`
      : `+ iklan ${f1(result.adPct)}%  ·  total ${f1(result.totalPct)}% omzet`;
    chip(ctx, fonts, label, PAD, y + 30, "left", "tonal");
    y += 30 + 52;
  }

  const footerH = 64;
  const footerY = H - 60 - footerH;

  const legendItems = fees.slice(0, 6);
  const legendRows = Math.ceil(legendItems.length / 2);
  const rowH = 48;
  const legendH = legendRows * rowH;

  const cols = 20;
  const rows = 5;
  const gap = 8;
  const inner = 36; // container padding
  const cell = (W - PAD * 2 - inner * 2 - gap * (cols - 1)) / cols;
  const waffleH = rows * cell + (rows - 1) * gap;

  const captionH = 50;
  const panelH = inner + captionH + waffleH + 32 + legendH + inner - 14;
  // Centre the panel in the space between the text block and the footer.
  const spaceTop = y + 36;
  const spaceBottom = footerY - 36;
  const panelY = Math.max(spaceTop, spaceTop + (spaceBottom - spaceTop - panelH) / 2);

  // Tonal container
  roundRect(ctx, PAD, panelY, W - PAD * 2, panelH, 28);
  ctx.fillStyle = CONTAINER;
  ctx.fill();

  // Waffle: assign 100 cells to fees by largest remainder.
  const counts = allocate(fees.map((l) => pctOf(l.amount)), cents);
  const cellColors: string[] = [];
  fees.forEach((l, i) => {
    for (let k = 0; k < counts[i]; k++) cellColors.push(color(l));
  });
  const wx = PAD + inner;
  const wy = panelY + inner + captionH;

  // Caption: what the grid is.
  ctx.font = `500 26px ${fonts.sans}`;
  ctx.fillStyle = ON_VAR;
  ctx.fillText("Tiap kotak = Rp1 dari Rp100 penjualanmu", wx, panelY + inner + 22);
  ctx.fillStyle = ACCENT;
  ctx.font = `600 26px ${fonts.sans}`;
  const cap = `Rp${cents} ke Shopee`;
  ctx.fillText(cap, W - PAD - inner - ctx.measureText(cap).width, panelY + inner + 22);
  for (let i = 0; i < cols * rows; i++) {
    // Fill column by column so each fee reads as a block from the left.
    const c = Math.floor(i / rows);
    const r = i % rows;
    const x = wx + c * (cell + gap);
    const yy = wy + r * (cell + gap);
    roundRect(ctx, x, yy, cell, cell, 9);
    ctx.fillStyle = cellColors[i] ?? CONTAINER_HI;
    ctx.fill();
  }

  // Legend, two columns
  const ly = wy + waffleH + 32;
  const colW = (W - PAD * 2 - inner * 2 - 40) / 2;
  legendItems.forEach((l, i) => {
    const lx = wx + (i % 2) * (colW + 40);
    const lyy = ly + Math.floor(i / 2) * rowH;
    roundRect(ctx, lx, lyy + 4, 20, 20, 6);
    ctx.fillStyle = color(l);
    ctx.fill();

    ctx.fillStyle = ON_VAR;
    ctx.font = `500 26px ${fonts.mono}`;
    const v = showRupiah ? formatRpShort(l.amount) : `${f1(pctOf(l.amount))}%`;
    const vw = ctx.measureText(v).width;
    ctx.fillText(v, lx + colW - vw, lyy + 24);

    ctx.fillStyle = ON;
    ctx.font = `500 26px ${fonts.sans}`;
    ctx.fillText(fitText(ctx, SHORT[l.key] ?? l.label, colW - 36 - vw - 16), lx + 36, lyy + 24);
  });

  /* ---------- Footer ---------- */
  ctx.fillStyle = ON_VAR;
  ctx.font = `400 30px ${fonts.sans}`;
  ctx.fillText("Kamu berapa? Hitung di", PAD, footerY + 42);
  chip(ctx, fonts, "dialectify.ai/calculator-shopee", W - PAD, footerY, "right", "filled");

  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/png"),
  );
}

/* ---------------------------------------------------------------- helpers */

function chip(
  ctx: CanvasRenderingContext2D,
  fonts: Fonts,
  text: string,
  x: number,
  y: number,
  align: "left" | "right",
  style: "outline" | "tonal" | "filled",
) {
  ctx.font = `500 ${style === "filled" ? 30 : 26}px ${fonts.sans}`;
  const h = style === "filled" ? 64 : 52;
  const padX = style === "filled" ? 30 : 24;
  const w = ctx.measureText(text).width + padX * 2;
  const left = align === "right" ? x - w : x;
  roundRect(ctx, left, y, w, h, h / 2);
  if (style === "outline") {
    ctx.strokeStyle = OUTLINE;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = ON_VAR;
  } else if (style === "tonal") {
    ctx.fillStyle = CONTAINER_HI;
    ctx.fill();
    ctx.fillStyle = ON;
  } else {
    ctx.fillStyle = "#a8c7fa";
    ctx.fill();
    ctx.fillStyle = "#062e6f";
  }
  ctx.fillText(text, left + padX, y + h / 2 + (style === "filled" ? 10 : 9));
}

function drawTracked(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, tracking: number) {
  let cx = x;
  for (const ch of text) {
    ctx.fillText(ch, cx, y);
    cx += ctx.measureText(ch).width + tracking;
  }
}

function fitText(ctx: CanvasRenderingContext2D, text: string, max: number) {
  if (ctx.measureText(text).width <= max) return text;
  let t = text;
  while (t.length > 1 && ctx.measureText(`${t}…`).width > max) t = t.slice(0, -1);
  return `${t.trimEnd()}…`;
}

/** Split `total` whole cells across shares, keeping proportions (largest remainder). */
function allocate(shares: number[], total: number): number[] {
  const sum = shares.reduce((a, b) => a + b, 0);
  if (sum <= 0 || total <= 0) return shares.map(() => 0);
  const raw = shares.map((s) => (s / sum) * total);
  const out = raw.map(Math.floor);
  let left = total - out.reduce((a, b) => a + b, 0);
  const order = raw.map((r, i) => [r - Math.floor(r), i] as const).sort((a, b) => b[0] - a[0]);
  for (const [, i] of order) {
    if (left-- <= 0) break;
    out[i]++;
  }
  return out;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
