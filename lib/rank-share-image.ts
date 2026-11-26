// Renders the product-rank share card (1080×1350) to a PNG. Same dark Material 3
// system as the fee card (lib/share-image.ts): near-black surface, one tonal
// container, tone-80 colours. The hero is the tier letter on a tone-30 tile.

import { formatRpShort } from "./format";
import type { Listing, Score, Tier } from "./product-rank";
import {
  BG,
  CONTAINER,
  CONTAINER_HI,
  H,
  ON,
  ON_VAR,
  PAD,
  W,
  chip,
  drawBrandHeader,
  fitText,
  roundRect,
  type Fonts,
} from "./share-image";

// [tone 80 on dark, tone 30 container]
const TIER_COLOR: Record<Tier, [string, string]> = {
  S: ["#d0bcff", "#4a3584"],
  A: ["#8fe0bf", "#0f4d36"],
  B: ["#a8c7fa", "#1d4178"],
  C: ["#ffd58a", "#5a4300"],
  D: ["#ffb4ab", "#7a1e17"],
};

export async function renderRankImage(
  listing: Listing,
  score: Score,
  fonts: Fonts,
  opts: { showTitle?: boolean; showRupiah?: boolean } = {},
): Promise<Blob> {
  const { showTitle = true, showRupiah = false } = opts;
  const [fg, tile] = TIER_COLOR[score.tier.tier];
  const f1 = (n: number) => n.toLocaleString("id-ID", { maximumFractionDigits: 1 });

  await document.fonts.ready;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, W, H);

  drawBrandHeader(ctx, fonts, "Peringkat produk Shopee");

  /* ---------- Headline ---------- */
  let y = 250;
  ctx.fillStyle = ON_VAR;
  ctx.font = `500 50px ${fonts.sans}`;
  ctx.fillText("Produkku dapat kelas", PAD, y);

  // Tier tile with the letter
  const tileY = y + 44;
  const tileS = 360;
  roundRect(ctx, PAD, tileY, tileS, tileS, 48);
  ctx.fillStyle = tile;
  ctx.fill();
  ctx.fillStyle = fg;
  ctx.font = `600 300px ${fonts.sans}`;
  const lw = ctx.measureText(score.tier.tier).width;
  ctx.fillText(score.tier.tier, PAD + (tileS - lw) / 2, tileY + tileS / 2 + 107);

  // Score beside it
  const rx = PAD + tileS + 56;
  ctx.fillStyle = ON;
  ctx.font = `600 196px ${fonts.sans}`;
  const total = String(score.total);
  ctx.fillText(total, rx - 8, tileY + 180);
  const tw = ctx.measureText(total).width;
  ctx.fillStyle = ON_VAR;
  ctx.font = `500 56px ${fonts.sans}`;
  ctx.fillText("/100", rx - 8 + tw + 10, tileY + 180);

  ctx.fillStyle = fg;
  ctx.font = `600 46px ${fonts.sans}`;
  ctx.fillText(score.tier.label, rx, tileY + 262);
  if (showRupiah) {
    ctx.fillStyle = ON_VAR;
    ctx.font = `400 32px ${fonts.sans}`;
    ctx.fillText(`${formatRpShort(score.sales.gmv)} penjualan sebulan`, rx, tileY + 314);
  }

  y = tileY + tileS + 70;

  /* ---------- Product ---------- */
  if (showTitle) {
    ctx.fillStyle = ON;
    ctx.font = `500 40px ${fonts.sans}`;
    const lines = wrap(ctx, listing.title, W - PAD * 2, 2);
    lines.forEach((line, i) => ctx.fillText(line, PAD, y + i * 52));
    y += (lines.length - 1) * 52 + 50;
    ctx.fillStyle = ON_VAR;
    ctx.font = `400 30px ${fonts.sans}`;
    ctx.fillText(fitText(ctx, listing.categoryPath.join(" › "), W - PAD * 2), PAD, y);
    y += 20;
  } else {
    ctx.fillStyle = ON_VAR;
    ctx.font = `400 32px ${fonts.sans}`;
    ctx.fillText(listing.categoryPath.join(" › "), PAD, y);
    y += 20;
  }

  /* ---------- Breakdown panel ---------- */
  const footerH = 64;
  const footerY = H - 60 - footerH;
  const inner = 36;
  const rowH = 88;
  const parts = [
    { label: "Penjualan", pts: score.sales.points, max: 50 },
    { label: "Kepercayaan pembeli", pts: score.trust.points, max: 20 },
    { label: "Foto & deskripsi", pts: score.listing.points, max: 30 },
  ];
  const panelH = inner * 2 + parts.length * rowH - 30;
  const spaceTop = y + 40;
  const spaceBottom = footerY - 40;
  const panelY = Math.max(spaceTop, spaceTop + (spaceBottom - spaceTop - panelH) / 2);

  roundRect(ctx, PAD, panelY, W - PAD * 2, panelH, 28);
  ctx.fillStyle = CONTAINER;
  ctx.fill();

  const bx = PAD + inner;
  const bw = W - PAD * 2 - inner * 2;
  parts.forEach((p, i) => {
    const ry = panelY + inner + i * rowH;
    ctx.fillStyle = ON;
    ctx.font = `500 30px ${fonts.sans}`;
    ctx.fillText(p.label, bx, ry + 28);
    ctx.font = `500 28px ${fonts.mono}`;
    ctx.fillStyle = ON_VAR;
    const v = `${f1(p.pts)}/${p.max}`;
    ctx.fillText(v, bx + bw - ctx.measureText(v).width, ry + 28);

    roundRect(ctx, bx, ry + 44, bw, 14, 7);
    ctx.fillStyle = CONTAINER_HI;
    ctx.fill();
    const fw = Math.max(14, (bw * p.pts) / p.max);
    roundRect(ctx, bx, ry + 44, fw, 14, 7);
    ctx.fillStyle = fg;
    ctx.fill();
  });

  /* ---------- Footer ---------- */
  ctx.fillStyle = ON_VAR;
  ctx.font = `400 30px ${fonts.sans}`;
  ctx.fillText("Produkmu kelas berapa?", PAD, footerY + 42);
  chip(ctx, fonts, "dialectify.ai/rank-shopee", W - PAD, footerY, "right", "filled");

  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/png"),
  );
}

function wrap(ctx: CanvasRenderingContext2D, text: string, max: number, maxLines: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (ctx.measureText(next).width <= max) {
      cur = next;
      continue;
    }
    if (cur) lines.push(cur);
    cur = w;
    if (lines.length === maxLines) break;
  }
  if (lines.length < maxLines && cur) lines.push(cur);
  if (lines.length > maxLines) lines.length = maxLines;
  // Ellipsis on the last line if anything was cut.
  const used = lines.join(" ").length;
  if (used < text.length) lines[lines.length - 1] = fitText(ctx, `${lines[lines.length - 1]}…`, max);
  return lines;
}
