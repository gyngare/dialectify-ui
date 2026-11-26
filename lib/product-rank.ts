// Shopee product rank, rubric v1.
//
// The backend fetches one listing and answers a fixed set of yes/no checks
// (docs/api/rank-shopee.md). The score is computed here, from those facts only,
// so the same listing always gets the same score. No competitor data: every
// number is on a fixed scale that does not depend on other products.
//
//   Penjualan  50  monthly Rupiah sales on a log scale, Rp1 jt → 0, Rp1 M → 50
//   Kepercayaan 20 rating smoothed by review count, review count, photo reviews
//   Listing    30  fixed checklist: photos, title, description, variations
//
// Tier cut-offs are fixed: S ≥ 85, A ≥ 70, B ≥ 55, C ≥ 40, D below.

export const RUBRIC_VERSION = "v1";

/** Facts about one listing, as returned by the backend. Amounts in rupiah. */
export type Listing = {
  url: string;
  shopId: string;
  itemId: string;
  title: string;
  shopName: string;
  /** Leaf category path, e.g. ["Sepatu Pria", "Sneakers"]. */
  categoryPath: string[];
  /** Lowest variation price after the seller's discount. */
  price: number;
  /** Units sold in the last 30 days. If Shopee only shows "10RB+", the lower bound. */
  soldMonthly: number;
  soldTotal: number;
  /** 0–5, 0 if no reviews. */
  rating: number;
  ratingCount: number;
  ratingWithPhotoCount: number;
  imageUrls: string[];
  hasVideo: boolean;
  /** Characters in the description, whitespace collapsed. */
  descriptionLength: number;
  variationCount: number;
};

/** Checks the backend answers (AI yes/no at temperature 0, or rules). */
export type AiCheckId =
  | "main_photo_clean"
  | "main_photo_fills"
  | "photos_sharp"
  | "photos_in_use"
  | "title_clear"
  | "title_no_spam"
  | "desc_specs"
  | "desc_structured"
  | "desc_answers"
  | "variation_photos";

/** Checks computed here from Listing facts. */
type RuleCheckId = "photo_count" | "has_video" | "title_length" | "desc_length";

export type CheckId = AiCheckId | RuleCheckId;

export type RankResponse = {
  listing: Listing;
  checks: Record<AiCheckId, boolean>;
  /** Hash of the listing content the checks were answered for. */
  contentHash: string;
  checkedAt: string;
};

export type CheckGroup = "foto" | "judul" | "deskripsi" | "variasi";

type CheckDef = {
  id: CheckId;
  group: CheckGroup;
  points: number;
  label: string;
  /** What to do when the check fails. */
  fix: string;
};

export const CHECKS: CheckDef[] = [
  { id: "photo_count", group: "foto", points: 3, label: "Minimal 5 foto",
    fix: "Tambah foto sampai minimal 5: tampak depan, samping, detail bahan, ukuran, dan kemasan." },
  { id: "has_video", group: "foto", points: 3, label: "Ada video produk",
    fix: "Unggah video 10–30 detik yang memperlihatkan produk dipakai atau dibuka dari kemasan." },
  { id: "main_photo_clean", group: "foto", points: 2, label: "Foto utama berlatar bersih",
    fix: "Ganti foto utama dengan latar polos (putih atau satu warna) tanpa barang lain di sekitarnya." },
  { id: "main_photo_fills", group: "foto", points: 2, label: "Produk memenuhi foto utama",
    fix: "Potong foto utama supaya produk mengisi sebagian besar bingkai. Di hasil pencarian fotonya kecil." },
  { id: "photos_sharp", group: "foto", points: 2, label: "Semua foto tajam",
    fix: "Ganti foto yang buram atau pecah. Foto ulang dengan cahaya terang, minimal 1000×1000 piksel." },
  { id: "photos_in_use", group: "foto", points: 2, label: "Ada foto produk dipakai",
    fix: "Tambah satu foto produk sedang dipakai atau di samping benda lain, supaya pembeli tahu ukurannya." },
  { id: "title_length", group: "judul", points: 2, label: "Judul 40–120 karakter",
    fix: "Tulis judul 40–120 karakter: jenis produk, merek, bahan atau ukuran, lalu varian." },
  { id: "title_clear", group: "judul", points: 2, label: "Judul menyebut jenis dan ciri utama",
    fix: "Sebut jenis produk dan satu ciri pembeda di awal judul, misalnya bahan, ukuran, atau model." },
  { id: "title_no_spam", group: "judul", points: 2, label: "Judul tanpa kata berulang atau huruf kapital semua",
    fix: "Hapus kata yang diulang, merek lain, dan HURUF KAPITAL SEMUA. Judul yang rapi lebih dipercaya." },
  { id: "desc_length", group: "deskripsi", points: 2, label: "Deskripsi minimal 300 karakter",
    fix: "Panjangkan deskripsi sampai minimal 300 karakter. Mulai dari untuk siapa produk ini dan kenapa." },
  { id: "desc_specs", group: "deskripsi", points: 2, label: "Ada spesifikasi lengkap",
    fix: "Tulis spesifikasi dalam daftar: bahan, ukuran, berat, isi paket, dan garansi." },
  { id: "desc_structured", group: "deskripsi", points: 2, label: "Deskripsi tersusun, bukan satu paragraf",
    fix: "Pecah deskripsi jadi bagian pendek dengan judul kecil atau poin, supaya mudah dibaca di HP." },
  { id: "desc_answers", group: "deskripsi", points: 2, label: "Menjawab pertanyaan umum pembeli",
    fix: "Tambah bagian tanya-jawab: cara pakai, cara merawat, pengiriman, dan cara retur." },
  { id: "variation_photos", group: "variasi", points: 2, label: "Tiap variasi punya foto sendiri",
    fix: "Pasang foto di setiap variasi warna atau model, supaya pembeli melihat yang mereka pilih." },
];

export const GROUP_LABEL: Record<CheckGroup, string> = {
  foto: "Foto & video",
  judul: "Judul",
  deskripsi: "Deskripsi",
  variasi: "Variasi",
};

export type Tier = "S" | "A" | "B" | "C" | "D";

export const TIERS: { tier: Tier; min: number; label: string }[] = [
  { tier: "S", min: 85, label: "Juara" },
  { tier: "A", min: 70, label: "Kuat" },
  { tier: "B", min: 55, label: "Bagus" },
  { tier: "C", min: 40, label: "Berkembang" },
  { tier: "D", min: 0, label: "Baru mulai" },
];

export const tierFor = (score: number) => TIERS.find((t) => score >= t.min)!;

export type CheckResult = CheckDef & { passed: boolean };

export type Score = {
  total: number;
  tier: (typeof TIERS)[number];
  sales: { points: number; max: 50; gmv: number };
  trust: {
    points: number;
    max: 20;
    smoothedRating: number;
    ratingPts: number;
    countPts: number;
    photoPts: number;
    photoShare: number;
  };
  listing: { points: number; max: 30; checks: CheckResult[] };
  /** Failed checks, most points first, then rubric order. */
  fixes: CheckResult[];
  /** Score if every failed check were fixed. */
  potential: number;
};

// Scale ends and constants. Changing any of these is a new rubric version.
const GMV_FLOOR = 1_000_000; // Rp1 jt/month → 0 points
const GMV_CEIL = 1_000_000_000; // Rp1 M/month → 50 points
const PRIOR_RATING = 4.0; // what we assume before reviews come in
const PRIOR_WEIGHT = 20; // reviews' worth of the prior
const RATING_LOW = 4.0; // smoothed rating at 0 points
const RATING_HIGH = 4.9; // smoothed rating at full points
const REVIEW_CEIL = 5_000; // review count for full points
const PHOTO_SHARE_CEIL = 0.3; // share of reviews with photos for full points

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
// Round to one decimal so floating point never changes a displayed score.
const r1 = (n: number) => Math.round(n * 10) / 10;

export function scoreListing(res: RankResponse): Score {
  const l = res.listing;

  // Penjualan
  const gmv = Math.max(0, l.soldMonthly) * Math.max(0, l.price);
  const salesPts =
    gmv <= 0 ? 0 : 50 * clamp01(Math.log10(gmv / GMV_FLOOR) / Math.log10(GMV_CEIL / GMV_FLOOR));

  // Kepercayaan
  const n = Math.max(0, l.ratingCount);
  const smoothed = (PRIOR_RATING * PRIOR_WEIGHT + l.rating * n) / (PRIOR_WEIGHT + n);
  const ratingPts = 12 * clamp01((smoothed - RATING_LOW) / (RATING_HIGH - RATING_LOW));
  const countPts = n <= 0 ? 0 : 5 * clamp01(Math.log10(n) / Math.log10(REVIEW_CEIL));
  const photoShare = n > 0 ? l.ratingWithPhotoCount / n : 0;
  const photoPts = 3 * clamp01(photoShare / PHOTO_SHARE_CEIL);

  // Listing
  const rules: Record<RuleCheckId, boolean> = {
    photo_count: l.imageUrls.length >= 5,
    has_video: l.hasVideo,
    title_length: l.title.trim().length >= 40 && l.title.trim().length <= 120,
    desc_length: l.descriptionLength >= 300,
  };
  const checks: CheckResult[] = CHECKS.map((c) => ({
    ...c,
    passed:
      c.id === "variation_photos" && l.variationCount <= 1
        ? true // nothing to photograph
        : c.id in rules
          ? rules[c.id as RuleCheckId]
          : Boolean(res.checks[c.id as AiCheckId]),
  }));
  const listingPts = checks.reduce((s, c) => s + (c.passed ? c.points : 0), 0);

  const sales = r1(salesPts);
  const trust = r1(ratingPts + countPts + photoPts);
  const total = Math.round(sales + trust + listingPts);
  const fixes = checks.filter((c) => !c.passed).sort((a, b) => b.points - a.points);
  const potential = Math.round(sales + trust + 30);

  return {
    total,
    tier: tierFor(total),
    sales: { points: sales, max: 50, gmv },
    trust: {
      points: trust,
      max: 20,
      smoothedRating: smoothed,
      ratingPts: r1(ratingPts),
      countPts: r1(countPts),
      photoPts: r1(photoPts),
      photoShare,
    },
    listing: { points: listingPts, max: 30, checks },
    fixes,
    potential,
  };
}

/** Rupiah needed per month for a given number of sales points (inverse of the scale). */
export function gmvForSalesPoints(points: number) {
  return GMV_FLOOR * Math.pow(GMV_CEIL / GMV_FLOOR, Math.min(50, Math.max(0, points)) / 50);
}

/** Client-side check before calling the API. Accepts product and short links. */
export function looksLikeShopeeLink(input: string) {
  const s = input.trim();
  if (!s) return false;
  try {
    const u = new URL(/^https?:\/\//i.test(s) ? s : `https://${s}`);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "shopee.co.id") {
      return /-i\.\d+\.\d+/.test(u.pathname) || /^\/product\/\d+\/\d+/.test(u.pathname);
    }
    return ["id.shp.ee", "shp.ee", "shope.ee"].includes(host) && u.pathname.length > 1;
  } catch {
    return false;
  }
}
