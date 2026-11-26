"use client";

import { useEffect, useId, useRef, useState } from "react";
import LogoIcon from "@/components/LogoIcon";
import { formatNumber, formatRp, formatRpShort } from "@/lib/format";
import {
  CHECKS,
  GROUP_LABEL,
  RUBRIC_VERSION,
  TIERS,
  gmvForSalesPoints,
  looksLikeShopeeLink,
  scoreListing,
  type CheckGroup,
  type CheckResult,
  type Listing,
  type RankResponse,
  type Score,
  type Tier,
} from "@/lib/product-rank";
import { EXAMPLE_URL, RankError, rankShopeeProduct, type RankErrorCode } from "@/lib/rank-api";
import { renderRankImage } from "@/lib/rank-share-image";

// Flat, solid surfaces. The one loud element is the tier tile: a big letter on
// its own tint, the same object that leads the share card.
const card = "bg-white border border-brand-text/[0.08] rounded-[14px]";

const TIER_UI: Record<Tier, { fg: string; bg: string; bar: string }> = {
  S: { fg: "text-[#5b21b6]", bg: "bg-[#ede5ff]", bar: "bg-[#6d3fd0]" },
  A: { fg: "text-[#116b45]", bg: "bg-[#dcf3e8]", bar: "bg-[#178a5a]" },
  B: { fg: "text-[#1d4fa3]", bg: "bg-[#dde8fb]", bar: "bg-brand-blue-mid" },
  C: { fg: "text-[#8a5300]", bg: "bg-[#fbecd0]", bar: "bg-[#c47a0a]" },
  D: { fg: "text-[#a3221a]", bg: "bg-[#fbe0dd]", bar: "bg-[#c8382e]" },
};

const n1 = (n: number) => n.toLocaleString("id-ID", { maximumFractionDigits: 1 });

const ERROR_TEXT: Record<RankErrorCode, string> = {
  invalid_url: "Itu bukan link produk Shopee Indonesia. Buka produknya di aplikasi, ketuk Bagikan, lalu Salin link.",
  not_found: "Produk ini tidak ditemukan. Mungkin sudah dihapus atau diarsipkan.",
  unreadable: "Shopee sedang tidak bisa kami baca untuk produk ini. Coba lagi beberapa menit lagi.",
  rate_limited: "Kamu sudah mengecek banyak produk dalam sejam terakhir. Coba lagi nanti.",
  unknown: "Ada yang salah di sisi kami. Coba lagi.",
};

type State =
  | { kind: "idle" }
  | { kind: "loading"; url: string }
  | { kind: "error"; message: string }
  | { kind: "done"; data: RankResponse; score: Score };

export default function ProductRank() {
  const [url, setUrl] = useState("");
  const [state, setState] = useState<State>({ kind: "idle" });
  const reportRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  async function run(link: string) {
    const clean = link.trim();
    if (!looksLikeShopeeLink(clean)) {
      setState({ kind: "error", message: ERROR_TEXT.invalid_url });
      return;
    }
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    setState({ kind: "loading", url: clean });
    requestAnimationFrame(() => reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    try {
      const data = await rankShopeeProduct(clean, ac.signal);
      setState({ kind: "done", data, score: scoreListing(data) });
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      const code = e instanceof RankError ? e.code : "unknown";
      setState({ kind: "error", message: ERROR_TEXT[code] });
    }
  }

  function again() {
    setUrl("");
    setState({ kind: "idle" });
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => inputRef.current?.focus(), 300);
  }

  return (
    <div className="min-h-screen font-plex text-brand-text bg-[#eef1f6]">
      <header className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 no-underline text-brand-text">
          <LogoIcon size={24} />
          <span className="font-semibold">dialectify</span>
        </a>
        <a href="/calculator-shopee" className="text-sm text-brand-muted hover:text-brand-text">
          Kalkulator biaya Shopee
        </a>
      </header>

      <main className="max-w-6xl mx-auto px-5 md:px-8 pb-24">
        {/* ---------- Hero: the input is the hero ---------- */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-x-10 gap-y-8 pt-8 md:pt-14 pb-10 items-start">
          <div>
            <h1 className="text-[34px] md:text-[46px] font-semibold tracking-tight leading-[1.06] max-w-xl">
              Produkmu kelas berapa di Shopee?
            </h1>
            <p className="mt-4 text-brand-muted leading-relaxed max-w-xl">
              10.000 terjual × Rp5.000 itu Rp50 juta. 5.000 terjual × Rp25.000 itu Rp125 juta. Kami
              menilai penjualan dalam Rupiah, bukan jumlah terjual, lalu ulasan, foto dan
              deskripsimu.
            </p>

            <form
              className="mt-8"
              onSubmit={(e) => {
                e.preventDefault();
                run(url);
              }}
            >
              <label htmlFor="link" className="block text-sm font-medium mb-2">
                Link produk Shopee
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  ref={inputRef}
                  id="link"
                  type="text"
                  inputMode="url"
                  autoComplete="off"
                  spellCheck={false}
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://shopee.co.id/…-i.123.456"
                  className="w-full sm:flex-1 min-w-0 h-12 rounded-[10px] border border-brand-text/15 bg-white px-4 text-[15px] outline-none focus:border-brand-blue-mid focus:ring-4 focus:ring-brand-blue-mid/10 transition"
                />
                <button
                  type="submit"
                  disabled={state.kind === "loading"}
                  className="h-12 px-6 rounded-[10px] bg-brand-text text-white font-medium text-[15px] hover:bg-black disabled:opacity-60 transition-colors cursor-pointer whitespace-nowrap"
                >
                  {state.kind === "loading" ? "Menilai…" : "Nilai produk ini"}
                </button>
              </div>
              <p className="mt-2.5 text-xs text-brand-muted">
                Di aplikasi Shopee: buka produk › Bagikan › Salin link.{" "}
                <button
                  type="button"
                  onClick={() => {
                    setUrl(EXAMPLE_URL);
                    run(EXAMPLE_URL);
                  }}
                  className="underline underline-offset-2 hover:text-brand-text cursor-pointer"
                >
                  Coba dengan contoh
                </button>
              </p>
            </form>
          </div>

          <div className={state.kind === "idle" ? "" : "hidden lg:block"}>
            <Rubric />
          </div>
        </div>

        {/* ---------- Report ---------- */}
        <div ref={reportRef} className="scroll-mt-6">
          {state.kind === "loading" && <Loading />}
          {state.kind === "error" && (
            <div role="alert" className={`${card} p-5 text-sm max-w-2xl`}>
              {state.message}
            </div>
          )}
          {state.kind === "done" && <Report data={state.data} score={state.score} onAgain={again} />}
        </div>
      </main>
    </div>
  );
}

/* ---------------------------------------------------------------- Rubric */

function Rubric() {
  return (
    <aside className={`${card} p-5 md:p-6`}>
      <h2 className="text-[15px] font-semibold">Cara kami menilai</h2>
      <p className="text-xs text-brand-muted mt-1 leading-relaxed">
        Rubrik tetap, sama untuk semua kategori. Produk yang sama selalu dapat skor yang sama selama
        listingnya tidak berubah.
      </p>
      <ul className="list-none mt-4 space-y-3 text-sm">
        {[
          { pts: 50, t: "Penjualan sebulan", d: "terjual × harga, dalam Rupiah" },
          { pts: 20, t: "Kepercayaan pembeli", d: "rating, jumlah ulasan, ulasan berfoto" },
          { pts: 30, t: "Foto & deskripsi", d: `${CHECKS.length} cek: foto, video, judul, deskripsi` },
        ].map((r) => (
          <li key={r.t} className="grid grid-cols-[44px_1fr] gap-3 items-start">
            <span className="font-plex-mono tabular-nums text-right text-brand-text">{r.pts}</span>
            <span>
              <span className="block">{r.t}</span>
              <span className="block text-xs text-brand-muted">{r.d}</span>
              <span className="mt-1.5 block h-1.5 rounded-full bg-brand-text/[0.06] overflow-hidden">
                <span className="block h-full bg-brand-text/70" style={{ width: `${r.pts * 2}%` }} />
              </span>
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-5 pt-4 border-t border-brand-text/[0.07] flex gap-1.5">
        {TIERS.map((t) => (
          <div key={t.tier} className={`flex-1 rounded-[8px] ${TIER_UI[t.tier].bg} px-2 py-2 text-center`}>
            <div className={`text-lg font-semibold leading-none ${TIER_UI[t.tier].fg}`}>{t.tier}</div>
            <div className="mt-1 font-plex-mono text-[11px] tabular-nums text-brand-muted">
              {t.min > 0 ? `≥${t.min}` : `<40`}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

/* ---------------------------------------------------------------- Loading */

function Loading() {
  return (
    <div className={`${card} p-6 md:p-8`} aria-live="polite">
      <p className="text-sm font-medium">Sedang menilai produkmu</p>
      <div className="mt-3 h-1 rounded-full bg-brand-text/[0.06] overflow-hidden">
        <div className="h-full w-1/3 bg-brand-blue-mid rounded-full animate-[rankbar_1.2s_ease-in-out_infinite]" />
      </div>
      <ul className="list-none mt-4 text-sm text-brand-muted space-y-1">
        <li>Membaca harga, penjualan 30 hari, dan ulasan</li>
        <li>Memeriksa setiap foto dan video</li>
        <li>Membaca judul dan deskripsi</li>
      </ul>
      <style>{`@keyframes rankbar{0%{transform:translateX(-100%)}100%{transform:translateX(300%)}}`}</style>
    </div>
  );
}

/* ---------------------------------------------------------------- Report */

function Report({ data, score, onAgain }: { data: RankResponse; score: Score; onAgain: () => void }) {
  const l = data.listing;
  const ui = TIER_UI[score.tier.tier];

  return (
    <div className="space-y-5">
      {/* Verdict */}
      <section className={`${card} p-5 md:p-7 grid grid-cols-[auto_minmax(0,1fr)] gap-x-5 md:gap-x-8 gap-y-4 items-center`}>
        <div
          className={`${ui.bg} ${ui.fg} rounded-[18px] grid place-items-center font-semibold leading-none md:row-span-2 h-[112px] w-[112px] md:h-[168px] md:w-[168px] text-[80px] md:text-[124px]`}
          aria-label={`Kelas ${score.tier.tier}`}
        >
          {score.tier.tier}
        </div>
        <div className="min-w-0 md:self-end">
          <p className="text-sm text-brand-muted">Kelas {score.tier.tier} · {score.tier.label}</p>
          <p className="mt-1 leading-none">
            <span className="text-[56px] md:text-[72px] font-semibold tracking-tight tabular-nums">{score.total}</span>
            <span className="text-xl text-brand-muted">/100</span>
          </p>
        </div>
        <ProductLine listing={l} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-5 items-start">
        <div className="space-y-5 order-2 lg:order-1">
          <SalesPart listing={l} score={score} />
          <TrustPart listing={l} score={score} />
          <ListingPart score={score} />
        </div>

        <div className="space-y-5 order-1 lg:order-2">
          <ShareCard listing={l} score={score} />
          <Fixes score={score} />
        </div>
      </div>

      <p className="text-xs text-brand-muted leading-relaxed max-w-3xl">
        Rubrik {RUBRIC_VERSION} · dicek{" "}
        {new Date(data.checkedAt).toLocaleString("id-ID", { day: "numeric", month: "long", year: "numeric" })}.
        Penjualan 30 hari dan ulasan diambil dari halaman produk. Kalau Shopee hanya menampilkan
        angka bulat seperti &quot;1RB+&quot;, kami pakai angka terendahnya. Foto, judul dan
        deskripsi dinilai dengan pertanyaan ya/tidak yang sama untuk setiap produk.
      </p>
      <button
        onClick={onAgain}
        className="h-11 px-5 rounded-[10px] border border-brand-text/15 bg-white text-sm font-medium hover:border-brand-text/30 cursor-pointer"
      >
        Nilai produk lain
      </button>
    </div>
  );
}

function ProductLine({ listing: l }: { listing: Listing }) {
  return (
    <div className="col-span-2 md:col-span-1 md:self-start flex items-center gap-3 min-w-0">
      {l.imageUrls[0] && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={l.imageUrls[0]} alt="" className="h-12 w-12 rounded-[8px] object-cover shrink-0 bg-brand-text/[0.05]" />
      )}
      <div className="min-w-0 text-sm">
        <a href={l.url} target="_blank" rel="noopener noreferrer" className="block truncate text-brand-text hover:underline">
          {l.title}
        </a>
        <p className="truncate text-xs text-brand-muted mt-0.5">
          {l.shopName} · {l.categoryPath.join(" › ")}
        </p>
      </div>
    </div>
  );
}

function PartHeader({ title, pts, max, tier }: { title: string; pts: number; max: number; tier: Tier }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-[15px] font-semibold">{title}</h2>
        <span className="font-plex-mono tabular-nums text-sm">
          {n1(pts)}
          <span className="text-brand-muted">/{max}</span>
        </span>
      </div>
      <div className="mt-2.5 h-2 rounded-full bg-brand-text/[0.06] overflow-hidden">
        <div className={`h-full rounded-full ${TIER_UI[tier].bar}`} style={{ width: `${(pts / max) * 100}%` }} />
      </div>
    </div>
  );
}

function SalesPart({ listing: l, score }: { listing: Listing; score: Score }) {
  const s = score.sales;
  const pos = s.points / 50;
  const nextPts = Math.min(50, Math.floor(s.points) + 5);
  const nextGmv = gmvForSalesPoints(nextPts);
  return (
    <section className={`${card} p-5 md:p-6`}>
      <PartHeader title="Penjualan sebulan" pts={s.points} max={50} tier={score.tier.tier} />
      <p className="mt-4 font-plex-mono tabular-nums text-[15px]">
        {formatNumber(l.soldMonthly)} terjual × {formatRp(l.price)} ={" "}
        <b className="font-semibold">{formatRpShort(s.gmv)}</b>
      </p>
      <p className="text-xs text-brand-muted mt-1">30 hari terakhir, harga setelah diskon toko</p>

      {/* Log scale with the product's position */}
      <div className="mt-5 relative pt-6">
        <div
          className="absolute top-0 -translate-x-1/2 font-plex-mono text-[11px] tabular-nums whitespace-nowrap"
          style={{ left: `${Math.min(92, Math.max(8, pos * 100))}%` }}
        >
          {formatRpShort(s.gmv)}
        </div>
        <div className="relative h-2 rounded-full bg-brand-text/[0.06]">
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-4 w-4 rounded-full bg-brand-text border-[3px] border-white shadow-[0_0_0_1px_rgba(14,28,53,0.2)]"
            style={{ left: `${pos * 100}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between font-plex-mono text-[11px] tabular-nums text-brand-muted">
          <span>Rp1 jt</span>
          <span>Rp10 jt</span>
          <span>Rp100 jt</span>
          <span>Rp1 M</span>
        </div>
      </div>

      <p className="mt-4 text-[13px] text-brand-muted leading-relaxed">
        {s.points >= 50
          ? "Penjualanmu sudah di puncak skala."
          : `Setiap 10× penjualan menambah ${n1(50 / 3)} poin. Tembus ${formatRpShort(nextGmv)} sebulan untuk ${nextPts} poin.`}
      </p>
    </section>
  );
}

function TrustPart({ listing: l, score }: { listing: Listing; score: Score }) {
  const t = score.trust;
  const rows = [
    {
      k: "Rating",
      v: l.ratingCount > 0 ? `${n1(l.rating)} dari ${formatNumber(l.ratingCount)} ulasan` : "Belum ada ulasan",
      d: `Disesuaikan jadi ${t.smoothedRating.toLocaleString("id-ID", { maximumFractionDigits: 2 })}: rating dari sedikit ulasan ditarik ke 4,0`,
      pts: t.ratingPts,
      max: 12,
    },
    { k: "Jumlah ulasan", v: formatNumber(l.ratingCount), d: "Poin penuh di 5.000 ulasan", pts: t.countPts, max: 5 },
    {
      k: "Ulasan berfoto",
      v: `${n1(t.photoShare * 100)}%`,
      d: "Poin penuh kalau 30% ulasan punya foto",
      pts: t.photoPts,
      max: 3,
    },
  ];
  return (
    <section className={`${card} p-5 md:p-6`}>
      <PartHeader title="Kepercayaan pembeli" pts={t.points} max={20} tier={score.tier.tier} />
      <ul className="list-none mt-4 text-sm">
        {rows.map((r) => (
          <li key={r.k} className="flex items-baseline gap-4 py-2.5 border-b border-brand-text/[0.06] last:border-0 last:pb-0">
            <span className="flex-1 min-w-0">
              <span className="block">
                {r.k} <span className="text-brand-muted">· {r.v}</span>
              </span>
              <span className="block text-xs text-brand-muted mt-0.5">{r.d}</span>
            </span>
            <span className="font-plex-mono tabular-nums text-[13px] shrink-0">
              {n1(r.pts)}
              <span className="text-brand-muted">/{r.max}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ListingPart({ score }: { score: Score }) {
  const groups = Object.keys(GROUP_LABEL) as CheckGroup[];
  return (
    <section className={`${card} p-5 md:p-6`}>
      <PartHeader title="Foto & deskripsi" pts={score.listing.points} max={30} tier={score.tier.tier} />
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
        {groups.map((g) => {
          const items = score.listing.checks.filter((c) => c.group === g);
          return (
            <div key={g}>
              <h3 className="text-xs text-brand-muted mb-1.5">{GROUP_LABEL[g]}</h3>
              <ul className="list-none text-sm">
                {items.map((c) => (
                  <CheckRow key={c.id} check={c} />
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function CheckRow({ check: c }: { check: CheckResult }) {
  return (
    <li className="flex items-start gap-2.5 py-1.5">
      <span
        aria-hidden
        className={`mt-[3px] h-4 w-4 shrink-0 rounded-full grid place-items-center ${
          c.passed ? "bg-[#178a5a] text-white" : "border border-brand-text/25"
        }`}
      >
        {c.passed && (
          <svg width="9" height="9" viewBox="0 0 10 10">
            <path d="M2 5.2 4.2 7.3 8 3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span className={`flex-1 ${c.passed ? "" : "text-brand-muted"}`}>
        {c.label}
        <span className="sr-only">{c.passed ? ", lulus" : ", belum"}</span>
      </span>
      <span className={`font-plex-mono tabular-nums text-xs mt-[2px] ${c.passed ? "" : "text-brand-muted"}`}>
        {c.passed ? `+${c.points}` : "0"}
      </span>
    </li>
  );
}

/* ---------------------------------------------------------------- Fixes */

const FIRST_FIXES = 5;

function Fixes({ score }: { score: Score }) {
  const [all, setAll] = useState(false);
  if (score.fixes.length === 0) {
    return (
      <section className={`${card} p-5 md:p-6`}>
        <h2 className="text-[15px] font-semibold">Listingmu sudah lengkap</h2>
        <p className="text-sm text-brand-muted mt-1.5 leading-relaxed">
          Semua {CHECKS.length} cek lulus. Skor hanya bisa naik dari penjualan dan ulasan sekarang.
        </p>
      </section>
    );
  }
  const gain = score.potential - score.total;
  const nextTier = TIERS.find((t) => score.potential >= t.min)!;
  return (
    <section className={`${card} p-5 md:p-6`}>
      <h2 className="text-[15px] font-semibold">Perbaiki ini dulu</h2>
      <p className="text-xs text-brand-muted mt-1">Urut dari poin terbanyak. Semua bisa dikerjakan hari ini.</p>
      <ol className="list-none mt-4 space-y-3.5">
        {(all ? score.fixes : score.fixes.slice(0, FIRST_FIXES)).map((f) => (
          <li key={f.id} className="grid grid-cols-[38px_1fr] gap-3">
            <span className="h-6 rounded-full bg-[#dcf3e8] text-[#116b45] font-plex-mono text-xs tabular-nums grid place-items-center">
              +{f.points}
            </span>
            <span className="text-sm">
              <span className="block font-medium">{f.label}</span>
              <span className="block text-[13px] text-brand-muted mt-0.5 leading-relaxed">{f.fix}</span>
            </span>
          </li>
        ))}
      </ol>
      {!all && score.fixes.length > FIRST_FIXES && (
        <button
          onClick={() => setAll(true)}
          className="mt-3 ml-[50px] text-sm text-brand-blue-mid hover:underline cursor-pointer"
        >
          Lihat {score.fixes.length - FIRST_FIXES} perbaikan lagi
        </button>
      )}
      <p className="mt-5 pt-4 border-t border-brand-text/[0.07] text-sm">
        Kalau semua diperbaiki: <b className="tabular-nums">{score.potential}</b>
        <span className="text-brand-muted">/100</span>, +{gain} poin
        {nextTier.tier !== score.tier.tier ? (
          <>
            , naik ke <b className={TIER_UI[nextTier.tier].fg}>kelas {nextTier.tier}</b>.
          </>
        ) : (
          "."
        )}
      </p>
    </section>
  );
}

/* ---------------------------------------------------------------- Share */

function ShareCard({ listing, score }: { listing: Listing; score: Score }) {
  const [showTitle, setShowTitle] = useState(true);
  const [showRupiah, setShowRupiah] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const sansRef = useRef<HTMLSpanElement>(null);
  const monoRef = useRef<HTMLSpanElement>(null);

  function make() {
    const fonts = {
      sans: sansRef.current ? getComputedStyle(sansRef.current).fontFamily : "sans-serif",
      mono: monoRef.current ? getComputedStyle(monoRef.current).fontFamily : "monospace",
    };
    return renderRankImage(listing, score, fonts, { showTitle, showRupiah });
  }

  // Live preview of exactly what gets shared.
  useEffect(() => {
    let url: string | null = null;
    let cancelled = false;
    make().then((b) => {
      if (cancelled) return;
      url = URL.createObjectURL(b);
      setPreview(url);
    });
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listing, score, showTitle, showRupiah]);

  const shareText = `Produkku dapat kelas ${score.tier.tier} (${score.total}/100) di Shopee. Produkmu kelas berapa? dialectify.ai/rank-shopee`;

  async function share() {
    setBusy(true);
    setMsg(null);
    try {
      const blob = await make();
      const file = new File([blob], "kelas-produk-shopee.png", { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text: shareText });
      } else {
        download(blob);
        window.open(`https://www.threads.net/intent/post?text=${encodeURIComponent(shareText)}`, "_blank", "noopener");
        setMsg("Gambar sudah terunduh. Lampirkan di postingan Threads yang baru terbuka.");
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") setMsg("Gagal membuat gambar. Coba lagi.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className={`${card} p-5 md:p-6`}>
      <span ref={sansRef} className="font-plex hidden" />
      <span ref={monoRef} className="font-plex-mono hidden" />

      <div className="grid grid-cols-[96px_1fr] gap-4 items-start">
        <div className="aspect-[4/5] rounded-[8px] bg-[#0e0f12] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {preview && <img src={preview} alt="Pratinjau gambar yang dibagikan" className="h-full w-full" />}
        </div>
        <div className="space-y-3">
          <Toggle label="Tampilkan nama produk" checked={showTitle} onChange={setShowTitle} />
          <Toggle
            label="Tampilkan penjualan Rupiah"
            hint={showRupiah ? formatRpShort(score.sales.gmv) + " sebulan ikut terlihat" : "Hanya kelas dan skor"}
            checked={showRupiah}
            onChange={setShowRupiah}
          />
        </div>
      </div>

      <button
        onClick={share}
        disabled={busy}
        className="mt-5 w-full h-12 rounded-[10px] bg-brand-text text-white font-medium text-[15px] flex items-center justify-center gap-2.5 hover:bg-black disabled:opacity-50 transition-colors cursor-pointer"
      >
        <ThreadsMark />
        {busy ? "Menyiapkan gambar…" : "Bagikan ke Threads"}
      </button>
      <button
        onClick={async () => download(await make())}
        className="mt-2 w-full text-sm text-brand-muted hover:text-brand-text py-1.5 cursor-pointer"
      >
        Unduh gambarnya saja
      </button>
      {msg && <p className="mt-2 text-xs text-brand-muted text-center">{msg}</p>}
    </section>
  );
}

function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  const id = useId();
  return (
    <div className="flex items-start justify-between gap-3">
      <label htmlFor={id} className="cursor-pointer text-sm leading-snug">
        {label}
        {hint && <span className="block text-xs text-brand-muted mt-0.5">{hint}</span>}
      </label>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative shrink-0 h-6 w-10 rounded-full transition-colors cursor-pointer ${
          checked ? "bg-brand-blue-mid" : "bg-brand-text/15"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-[0_1px_2px_rgba(14,28,53,0.25)] transition-transform ${
            checked ? "translate-x-4" : ""
          }`}
        />
      </button>
    </div>
  );
}

function download(blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "kelas-produk-shopee.png";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function ThreadsMark() {
  return (
    <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3.6" stroke="currentColor" strokeWidth="2" />
      <path
        d="M15.6 12v1.4a2.6 2.6 0 0 0 5.2 0V12a8.8 8.8 0 1 0-3.6 7.1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
