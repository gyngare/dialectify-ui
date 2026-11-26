// Client for POST /api/rank/shopee. Contract: docs/api/rank-shopee.md
//
// Uses NEXT_PUBLIC_API_URL like lib/api.ts. When it is unset in development,
// the response is mocked: the same link always returns the same sample, so the
// page can be built and tested before the backend exists.

import type { AiCheckId, Listing, RankResponse } from "./product-rank";

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
const useMock = !API_URL && process.env.NODE_ENV !== "production";

export type RankErrorCode = "invalid_url" | "not_found" | "unreadable" | "rate_limited" | "unknown";

export class RankError extends Error {
  constructor(public code: RankErrorCode) {
    super(code);
  }
}

export async function rankShopeeProduct(url: string, signal?: AbortSignal): Promise<RankResponse> {
  if (useMock) {
    await new Promise((r) => setTimeout(r, 2200));
    return mockRank(url);
  }
  if (!API_URL) throw new RankError("unknown");

  let res: Response;
  try {
    res = await fetch(`${API_URL}/api/rank/shopee`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
      signal,
    });
  } catch (e) {
    if ((e as Error).name === "AbortError") throw e;
    throw new RankError("unknown");
  }
  if (res.ok) return (await res.json()) as RankResponse;

  const body = (await res.json().catch(() => null)) as { error?: RankErrorCode } | null;
  throw new RankError(
    body?.error ??
      (res.status === 400 ? "invalid_url" : res.status === 404 ? "not_found" : res.status === 429 ? "rate_limited" : "unknown"),
  );
}

/* ---------------------------------------------------------------- mock */

type Sample = { listing: Omit<Listing, "url" | "imageUrls">; images: number; hue: number; checks: AiCheckId[] };

// Three listings that land in different tiers. `checks` lists the AI checks that pass.
const SAMPLES: Sample[] = [
  {
    hue: 214,
    images: 9,
    listing: {
      shopId: "88120334",
      itemId: "24019387712",
      title: "Sepatu Sneakers Pria Kanvas Low Top Sol Karet Anti Slip Ukuran 39-44",
      shopName: "Langkah Ringan Official",
      categoryPath: ["Sepatu Pria", "Sneakers"],
      price: 189_000,
      soldMonthly: 1_840,
      soldTotal: 21_300,
      rating: 4.8,
      ratingCount: 6_120,
      ratingWithPhotoCount: 1_410,
      hasVideo: true,
      descriptionLength: 1_260,
      variationCount: 12,
    },
    checks: ["main_photo_clean", "main_photo_fills", "photos_sharp", "title_clear", "title_no_spam", "desc_specs", "desc_structured"],
  },
  {
    hue: 28,
    images: 4,
    listing: {
      shopId: "30551871",
      itemId: "18832004561",
      title: "KERIPIK PISANG COKLAT KERIPIK PISANG LUMER 250GR KERIPIK PISANG",
      shopName: "Dapur Mbak Rini",
      categoryPath: ["Makanan & Minuman", "Makanan Ringan"],
      price: 25_000,
      soldMonthly: 5_000,
      soldTotal: 48_000,
      rating: 4.9,
      ratingCount: 9_840,
      ratingWithPhotoCount: 1_120,
      hasVideo: false,
      descriptionLength: 210,
      variationCount: 3,
    },
    checks: ["photos_sharp", "photos_in_use", "title_clear", "desc_specs"],
  },
  {
    hue: 158,
    images: 3,
    listing: {
      shopId: "71200458",
      itemId: "27740019935",
      title: "Gantungan kunci akrilik custom",
      shopName: "Kreasi Kecil",
      categoryPath: ["Hobi & Koleksi", "Aksesoris Hobi"],
      price: 5_000,
      soldMonthly: 410,
      soldTotal: 2_900,
      rating: 4.7,
      ratingCount: 38,
      ratingWithPhotoCount: 4,
      hasVideo: false,
      descriptionLength: 120,
      variationCount: 1,
    },
    checks: ["main_photo_fills"],
  },
];

const AI_CHECKS: AiCheckId[] = [
  "main_photo_clean", "main_photo_fills", "photos_sharp", "photos_in_use", "title_clear",
  "title_no_spam", "desc_specs", "desc_structured", "desc_answers", "variation_photos",
];

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

function tile(hue: number, i: number) {
  const l = 86 - (i % 4) * 6;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="hsl(${hue} 40% ${l}%)"/><rect x="26" y="30" width="48" height="40" rx="6" fill="hsl(${hue} 45% ${l - 28}%)"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function mockRank(url: string): RankResponse {
  const s =
    SAMPLES.find((x) => url.includes(x.listing.itemId)) ?? SAMPLES[hash(url.trim()) % SAMPLES.length];
  const passing = new Set(s.checks);
  return {
    listing: {
      ...s.listing,
      url: url.trim(),
      imageUrls: Array.from({ length: s.images }, (_, i) => tile(s.hue, i)),
    },
    checks: Object.fromEntries(AI_CHECKS.map((id) => [id, passing.has(id)])) as Record<AiCheckId, boolean>,
    contentHash: hash(`${url}:${s.listing.itemId}`).toString(16),
    checkedAt: new Date().toISOString(),
  };
}

/** Example links that map to each sample, for the "coba contoh" button. */
export const EXAMPLE_URL = "https://shopee.co.id/Sepatu-Sneakers-Pria-Kanvas-i.88120334.24019387712";
