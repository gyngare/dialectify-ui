// Shopee Indonesia seller fee model, as of 25 Nov 2026.
//
// Sources (cross-checked, Shopee's own Seller Education pages render client-side
// and could not be read directly):
// - Admin fee per sub-category, Non-Star/Star and Mall: Shopee tables updated
//   Feb–Jul 2026 as reproduced by sotagle.com (Aug 2026) and flexeet.com (2 Oct 2026).
// - Biaya proses pesanan Rp1.250 per completed order since 20 Jul 2025.
// - Gratis Ongkir XTRA: 1–8%, cap Rp40.000/qty; from 1 Dec 2026 (non-Mall) and
//   1 Jan 2027 (Mall) the rates rise and the cap becomes Rp60.000/qty.
//   Sellers with net ad spend >= 3% of sales (last 30 days) get the GOX rate cut
//   by up to 1.5 points.
// - Promo XTRA 4.5% cap Rp60.000/qty. Promo XTRA+ 6.5% cap Rp80.000/qty.
// - Shopee Live/Video XTRA 3% cap Rp20.000/qty, 2% if also in Promo XTRA.
// - Pre-order 3%. Mall payment fee 1.8% cap Rp50.000/qty.
// - PPh 22 0.5% since 2 Oct 2026 (tax, not a Shopee fee).
//
// All percentage fees are charged on price after seller-funded discounts. The
// calculator assumes one item per order, so caps are applied per order.

export type ShopTier = "nonstar" | "star" | "mall";

export type Category = {
  id: string;
  label: string;
  /** Admin fee for Non-Star and Star/Star+ (same table). */
  admin: number;
  /** Admin fee for Shopee Mall. */
  adminMall: number;
  /** Gratis Ongkir XTRA rate, regular size, until 30 Nov 2026. */
  gox: number;
  /** Gratis Ongkir XTRA rate, regular size, from 1 Dec 2026 (non-Mall). */
  goxDec: number;
};

// Representative rate for the most common sub-category in each group.
export const CATEGORIES: Category[] = [
  { id: "pakaian",      label: "Pakaian pria & wanita",        admin: 8.25, adminMall: 9.95,  gox: 6.5, goxDec: 10 },
  { id: "muslim",       label: "Fashion muslim",               admin: 8.25, adminMall: 9.95,  gox: 8,   goxDec: 9 },
  { id: "sepatu",       label: "Sepatu",                       admin: 9,    adminMall: 10.2,  gox: 6.5, goxDec: 10.5 },
  { id: "tas",          label: "Tas & koper",                  admin: 9,    adminMall: 10.2,  gox: 7.5, goxDec: 11 },
  { id: "aksesoris",    label: "Aksesoris fashion & jam",      admin: 9,    adminMall: 10.2,  gox: 8,   goxDec: 11 },
  { id: "kecantikan",   label: "Kecantikan & skincare",        admin: 8.25, adminMall: 9.95,  gox: 5.5, goxDec: 9 },
  { id: "kesehatan",    label: "Kesehatan & suplemen",         admin: 9,    adminMall: 7.2,   gox: 5.5, goxDec: 8.5 },
  { id: "ibubayi",      label: "Ibu & bayi",                   admin: 8.25, adminMall: 10.2,  gox: 5.5, goxDec: 9 },
  { id: "snack",        label: "Makanan ringan & minuman",     admin: 9.5,  adminMall: 10.2,  gox: 6,   goxDec: 9.5 },
  { id: "pokok",        label: "Bahan pokok & masak",          admin: 6.75, adminMall: 6.2,   gox: 6,   goxDec: 9.5 },
  { id: "hp",           label: "Handphone & tablet",           admin: 5.25, adminMall: 4.7,   gox: 1,   goxDec: 1.5 },
  { id: "akshp",        label: "Aksesoris HP (casing, charger)", admin: 10, adminMall: 10.2,  gox: 5.5, goxDec: 8.5 },
  { id: "komputer",     label: "Laptop & komputer",            admin: 5.25, adminMall: 4.2,   gox: 1,   goxDec: 1.5 },
  { id: "audio",        label: "Audio & elektronik kecil",     admin: 9,    adminMall: 7.2,   gox: 5.5, goxDec: 8.5 },
  { id: "rumah",        label: "Perlengkapan rumah",           admin: 10,   adminMall: 11.7,  gox: 8,   goxDec: 11 },
  { id: "olahraga",     label: "Olahraga & outdoor",           admin: 10,   adminMall: 11.7,  gox: 8,   goxDec: 11 },
  { id: "hobi",         label: "Hobi, mainan & koleksi",       admin: 9.5,  adminMall: 7.7,   gox: 7,   goxDec: 10 },
  { id: "buku",         label: "Buku & alat tulis",            admin: 9,    adminMall: 7.2,   gox: 6.5, goxDec: 10 },
  { id: "pet",          label: "Hewan peliharaan",             admin: 9.5,  adminMall: 7.7,   gox: 7,   goxDec: 10 },
  { id: "otomotif",     label: "Otomotif (aksesoris & suku cadang)", admin: 8.25, adminMall: 10.45, gox: 7.5, goxDec: 9.5 },
];

export const PROCESSING_FEE = 1250;
export const GOX_CAP = 40_000;
export const GOX_CAP_DEC = 60_000;
export const GOX_AD_THRESHOLD_PCT = 3;
export const GOX_AD_DISCOUNT_PTS = 1.5;
export const MALL_PAYMENT_PCT = 1.8;
export const MALL_PAYMENT_CAP = 50_000;
export const LIVE_PCT = 3;
export const LIVE_PCT_WITH_PROMO = 2;
export const LIVE_CAP = 20_000;
export const PREORDER_PCT = 3;
export const PPH22_PCT = 0.5;

export type PromoTier = "none" | "xtra" | "xtraplus";
export const PROMO: Record<Exclude<PromoTier, "none">, { pct: number; cap: number; label: string }> = {
  xtra:     { pct: 4.5, cap: 60_000, label: "Promo XTRA" },
  xtraplus: { pct: 6.5, cap: 80_000, label: "Promo XTRA+" },
};

export type FeeInput = {
  tier: ShopTier;
  categoryId: string;
  /** Monthly sales after seller-funded discounts. */
  sales: number;
  orders: number;
  adSpend: number;
  gox: boolean;
  /** Use rates that start 1 Dec 2026 (non-Mall) instead of current. */
  decRates: boolean;
  promo: PromoTier;
  live: boolean;
  /** Share of orders that come from Live/Video, 0–100. */
  liveSharePct: number;
  preorder: boolean;
  /** Seller is a company, or an individual above Rp500 jt/yr turnover. */
  pph: boolean;
};

export type FeeLine = {
  key: string;
  label: string;
  amount: number;
  note: string;
  kind: "wajib" | "program" | "iklan";
};

export type FeeResult = {
  aov: number;
  lines: FeeLine[];
  /** Everything Shopee keeps, ads included. */
  total: number;
  totalPct: number;
  /** Shopee fees only, no ads. */
  feesOnly: number;
  feesOnlyPct: number;
  adPct: number;
  pph: number;
  goxRate: number;
  goxAdDiscount: boolean;
  /** Extra ad spend needed to reach the GOX threshold, and what it saves. */
  adNudge: { extraAds: number; goxSaving: number } | null;
};

const capped = (aov: number, pct: number, cap: number) => Math.min((aov * pct) / 100, cap);

export function computeFees(input: FeeInput): FeeResult {
  const cat = CATEGORIES.find((c) => c.id === input.categoryId) ?? CATEGORIES[0];
  const sales = Math.max(0, input.sales);
  const orders = Math.max(0, Math.round(input.orders));
  const aov = orders > 0 ? sales / orders : 0;
  const isMall = input.tier === "mall";
  // The December change reaches Mall only on 1 Jan 2027.
  const useDec = input.decRates && !isMall;
  const adPct = sales > 0 ? (input.adSpend / sales) * 100 : 0;

  const lines: FeeLine[] = [];

  const adminPct = isMall ? cat.adminMall : cat.admin;
  lines.push({
    key: "admin",
    label: "Biaya administrasi",
    amount: (sales * adminPct) / 100,
    note: `${fmtPct(adminPct)} kategori ${cat.label.toLowerCase()}`,
    kind: "wajib",
  });

  lines.push({
    key: "proses",
    label: "Biaya proses pesanan",
    amount: orders * PROCESSING_FEE,
    note: `Rp1.250 × ${orders.toLocaleString("id-ID")} pesanan`,
    kind: "wajib",
  });

  if (isMall) {
    lines.push({
      key: "payment",
      label: "Biaya pembayaran Mall",
      amount: orders * capped(aov, MALL_PAYMENT_PCT, MALL_PAYMENT_CAP),
      note: "1,8%, maks Rp50.000 per produk",
      kind: "wajib",
    });
  }

  const goxBase = useDec ? cat.goxDec : cat.gox;
  const goxAdDiscount = adPct >= GOX_AD_THRESHOLD_PCT;
  const goxRate = Math.max(0, goxBase - (goxAdDiscount ? GOX_AD_DISCOUNT_PTS : 0));
  const goxCap = useDec ? GOX_CAP_DEC : GOX_CAP;
  let adNudge: FeeResult["adNudge"] = null;

  if (input.gox) {
    lines.push({
      key: "gox",
      label: "Gratis Ongkir XTRA",
      amount: orders * capped(aov, goxRate, goxCap),
      note: goxAdDiscount
        ? `${fmtPct(goxRate)} (sudah dipotong ${fmtPct(GOX_AD_DISCOUNT_PTS)} karena iklan ≥3%)`
        : `${fmtPct(goxRate)}, maks Rp${(goxCap / 1000).toLocaleString("id-ID")}rb per produk`,
      kind: "program",
    });

    if (!goxAdDiscount && sales > 0) {
      const extraAds = (sales * GOX_AD_THRESHOLD_PCT) / 100 - input.adSpend;
      const discounted = Math.max(0, goxBase - GOX_AD_DISCOUNT_PTS);
      const goxSaving =
        orders * (capped(aov, goxBase, goxCap) - capped(aov, discounted, goxCap));
      adNudge = { extraAds, goxSaving };
    }
  }

  if (input.promo !== "none") {
    const p = PROMO[input.promo];
    lines.push({
      key: "promo",
      label: p.label,
      amount: orders * capped(aov, p.pct, p.cap),
      note: `${fmtPct(p.pct)}, maks Rp${(p.cap / 1000).toLocaleString("id-ID")}rb per produk`,
      kind: "program",
    });
  }

  if (input.live) {
    const pct = input.promo !== "none" ? LIVE_PCT_WITH_PROMO : LIVE_PCT;
    const share = Math.min(100, Math.max(0, input.liveSharePct)) / 100;
    lines.push({
      key: "live",
      label: "Live / Video XTRA",
      amount: orders * share * capped(aov, pct, LIVE_CAP),
      note: `${fmtPct(pct)} dari ${Math.round(share * 100)}% pesanan via Live/Video`,
      kind: "program",
    });
  }

  if (input.preorder) {
    lines.push({
      key: "preorder",
      label: "Biaya pre-order",
      amount: (sales * PREORDER_PCT) / 100,
      note: "3% untuk produk pre-order",
      kind: "program",
    });
  }

  const feesOnly = lines.reduce((s, l) => s + l.amount, 0);

  if (input.adSpend > 0) {
    lines.push({
      key: "ads",
      label: "Iklan Shopee",
      amount: input.adSpend,
      note: `${fmtPct(adPct)} dari omzet`,
      kind: "iklan",
    });
  }

  const total = feesOnly + input.adSpend;
  const pct = (n: number) => (sales > 0 ? (n / sales) * 100 : 0);

  return {
    aov,
    lines,
    total,
    totalPct: pct(total),
    feesOnly,
    feesOnlyPct: pct(feesOnly),
    adPct,
    pph: input.pph ? (sales * PPH22_PCT) / 100 : 0,
    goxRate,
    goxAdDiscount,
    adNudge,
  };
}

function fmtPct(n: number) {
  return `${n.toLocaleString("id-ID", { maximumFractionDigits: 2 })}%`;
}
