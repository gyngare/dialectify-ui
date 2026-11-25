"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import LogoIcon from "@/components/LogoIcon";
import { formatRp, formatRpShort } from "@/lib/format";
import {
  CATEGORIES,
  GOX_AD_DISCOUNT_PTS,
  computeFees,
  type FeeInput,
  type FeeLine,
  type PromoTier,
  type ShopTier,
} from "@/lib/shopee-fees";
import { renderShareImage } from "@/lib/share-image";

// Glass is this page's one material choice: frosted panels over a ledger-ruled
// page, with the live percentage set huge behind them so the blur has something
// real to show through. Everything else stays flat.
const glass =
  "bg-white/60 backdrop-blur-xl border border-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_10px_40px_-12px_rgba(14,28,53,0.18)]";

const pctFmt = (n: number) => n.toLocaleString("id-ID", { maximumFractionDigits: 1 });

export default function ShopeeFeeCalculator() {
  const [input, setInput] = useState<FeeInput>({
    tier: "nonstar",
    categoryId: "pakaian",
    sales: 50_000_000,
    orders: 600,
    adSpend: 2_500_000,
    gox: true,
    decRates: false,
    promo: "xtra",
    live: false,
    liveSharePct: 25,
    preorder: false,
    pph: false,
  });
  const set = <K extends keyof FeeInput>(k: K, v: FeeInput[K]) =>
    setInput((s) => ({ ...s, [k]: v }));

  const result = useMemo(() => computeFees(input), [input]);
  const category = CATEGORIES.find((c) => c.id === input.categoryId)!;
  const isMall = input.tier === "mall";

  // Hide the mobile bar once the result card itself is on screen.
  const resultRef = useRef<HTMLDivElement>(null);
  const [resultVisible, setResultVisible] = useState(false);
  useEffect(() => {
    const el = resultRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setResultVisible(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen font-plex text-brand-text bg-[#e9eef5] overflow-hidden">
      {/* Ledger ruling */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent 0 39px, rgba(37,99,196,0.07) 39px 40px)",
        }}
      />
      {/* The live number, behind the glass */}
      <div
        aria-hidden
        className="hidden lg:block pointer-events-none absolute right-[-4vw] top-[120px] font-plex font-semibold tracking-tight leading-none text-brand-blue-mid/[0.13] select-none tabular-nums"
        style={{ fontSize: "clamp(220px, 30vw, 480px)" }}
      >
        {pctFmt(result.feesOnlyPct)}%
      </div>

      <header className="relative z-10 max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 no-underline text-brand-text">
          <LogoIcon size={24} />
          <span className="font-semibold">dialectify</span>
        </a>
        <a href="/#kalkulator" className="text-sm text-brand-muted hover:text-brand-text">
          Kalkulator laba per pesanan
        </a>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-5 md:px-8 pb-28 lg:pb-20">
        <div className="pt-8 md:pt-14 pb-8 md:pb-10 max-w-2xl">
          <h1 className="text-[34px] md:text-[44px] font-semibold tracking-tight leading-[1.08]">
            Berapa persen omzetmu yang diambil Shopee?
          </h1>
          <p className="mt-4 text-brand-muted leading-relaxed">
            Biaya admin per kategori, Rp1.250 per pesanan, program XTRA yang kamu ikuti, dan
            iklan. Tarif per 25 November 2026, termasuk kenaikan Gratis Ongkir XTRA
            1 Desember.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-5 items-start">
          {/* ---------- Inputs ---------- */}
          <div className={`${glass} rounded-[18px] divide-y divide-brand-text/[0.07]`}>
            <Section title="Toko kamu">
              <Segmented<ShopTier>
                label="Tipe toko"
                value={input.tier}
                onChange={(v) => set("tier", v)}
                options={[
                  { value: "nonstar", label: "Non-Star" },
                  { value: "star", label: "Star / Star+" },
                  { value: "mall", label: "Shopee Mall" },
                ]}
              />
              <CategorySelect
                value={input.categoryId}
                onChange={(v) => set("categoryId", v)}
                isMall={isMall}
              />
            </Section>

            <Section title="Angka sebulan" hint="Lihat di Seller Centre › Keuangan, 30 hari terakhir.">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <MoneyField label="Omzet" value={input.sales} onChange={(v) => set("sales", v)} />
                <MoneyField
                  label="Jumlah pesanan"
                  value={input.orders}
                  onChange={(v) => set("orders", v)}
                  prefix=""
                />
                <MoneyField label="Belanja iklan" value={input.adSpend} onChange={(v) => set("adSpend", v)} />
              </div>
              <p className="text-xs text-brand-muted tabular-nums">
                Rata-rata {formatRp(result.aov)} per pesanan · iklan {pctFmt(result.adPct)}% dari omzet
              </p>
            </Section>

            <Section
              title="Program yang kamu ikuti"
              aside={
                !isMall && (
                  <MiniToggle
                    left="Tarif Nov"
                    right="Mulai 1 Des"
                    value={input.decRates}
                    onChange={(v) => set("decRates", v)}
                  />
                )
              }
            >
              <ul className="list-none -mx-1">
                <ToggleRow
                  title="Gratis Ongkir XTRA"
                  detail={
                    `${pctFmt(result.goxRate)}% untuk ${category.label.toLowerCase()}` +
                    (result.goxAdDiscount
                      ? ` (${pctFmt(input.decRates && !isMall ? category.goxDec : category.gox)}% dikurangi ${pctFmt(GOX_AD_DISCOUNT_PTS)} poin karena iklanmu ≥3%)`
                      : "")
                  }
                  checked={input.gox}
                  onChange={(v) => set("gox", v)}
                />
                <li className="px-1 py-3 border-b border-brand-text/[0.06]">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                    <div>
                      <div className="text-sm font-medium">Promo / Cashback XTRA</div>
                      <div className="text-xs text-brand-muted mt-0.5">
                        Dipotong dari semua pesanan, pakai voucher atau tidak
                      </div>
                    </div>
                    <Segmented<PromoTier>
                      compact
                      value={input.promo}
                      onChange={(v) => set("promo", v)}
                      options={[
                        { value: "none", label: "Tidak" },
                        { value: "xtra", label: "4,5%" },
                        { value: "xtraplus", label: "XTRA+ 6,5%" },
                      ]}
                    />
                  </div>
                </li>
                <ToggleRow
                  title="Shopee Live / Video XTRA"
                  detail={`${input.promo !== "none" ? "2%" : "3%"} per pesanan dari Live/Video, maks Rp20rb`}
                  checked={input.live}
                  onChange={(v) => set("live", v)}
                >
                  {input.live && (
                    <label className="flex items-center gap-3 mt-3 text-xs text-brand-muted">
                      <span className="shrink-0">Pesanan dari Live/Video</span>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        step={5}
                        value={input.liveSharePct}
                        onChange={(e) => set("liveSharePct", Number(e.target.value))}
                        className="w-full accent-brand-blue-mid"
                      />
                      <span className="w-10 text-right font-plex-mono text-brand-text tabular-nums">
                        {input.liveSharePct}%
                      </span>
                    </label>
                  )}
                </ToggleRow>
                <ToggleRow
                  title="Pre-order"
                  detail="3% kalau produkmu dikemas 3–30 hari kerja"
                  checked={input.preorder}
                  onChange={(v) => set("preorder", v)}
                />
                <ToggleRow
                  title="Dipungut PPh 22 (0,5%)"
                  detail="Badan usaha, atau omzet di atas Rp500 jt/tahun. Pajak, dihitung terpisah."
                  checked={input.pph}
                  onChange={(v) => set("pph", v)}
                />
              </ul>
            </Section>
          </div>

          {/* ---------- Result ---------- */}
          <div id="hasil" ref={resultRef} className="lg:sticky lg:top-6 scroll-mt-4">
            <Result result={result} sales={input.sales} />
          </div>
        </div>

        <footer className="mt-14 max-w-3xl text-xs text-brand-muted leading-relaxed space-y-2">
          <p>
            Cara hitung: semua biaya persen dihitung dari omzet setelah diskon yang kamu tanggung,
            dengan asumsi satu produk per pesanan (batas maksimal per produk dipakai per pesanan).
            Tarif admin memakai sub-kategori paling umum di tiap kelompok; sub-kategorimu bisa
            beda 0,5–1,5 poin. Tarif Gratis Ongkir XTRA 1 Desember berlaku untuk Non-Mall; Mall
            menyusul 1 Januari 2027.
          </p>
          <p>
            Sumber: tabel biaya Shopee Seller Education (Feb–Okt 2026) dan rangkuman Flexeet dan
            Sotagle. Cek ulang di Seller Centre sebelum mengubah harga.
          </p>
        </footer>
      </main>

      {/* Mobile: keep the live number in view while filling the form */}
      <a
        href="#hasil"
        className={`${glass} ${resultVisible ? "opacity-0 pointer-events-none" : ""} transition-opacity lg:hidden fixed z-20 left-3 right-3 bottom-3 rounded-[14px] h-14 px-4 flex items-center justify-between no-underline text-brand-text`}
      >
        <span className="text-sm text-brand-muted">Kamu bayar</span>
        <span className="flex items-center gap-3">
          <span className="font-semibold text-xl tabular-nums text-[#c2410c]">
            {pctFmt(result.feesOnlyPct)}%
          </span>
          <span className="text-sm font-medium">Lihat &amp; bagikan ↓</span>
        </span>
      </a>
    </div>
  );
}

/* ---------------------------------------------------------------- Result */

function Result({ result, sales }: { result: ReturnType<typeof computeFees>; sales: number }) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [showRupiah, setShowRupiah] = useState(false);
  const [showAds, setShowAds] = useState(false);
  const sansRef = useRef<HTMLSpanElement>(null);
  const monoRef = useRef<HTMLSpanElement>(null);

  const fees = result.lines.filter((l) => l.kind !== "iklan").sort((a, b) => b.amount - a.amount);
  const ads = result.lines.find((l) => l.kind === "iklan");

  async function makeImage() {
    const fonts = {
      sans: sansRef.current ? getComputedStyle(sansRef.current).fontFamily : "sans-serif",
      mono: monoRef.current ? getComputedStyle(monoRef.current).fontFamily : "monospace",
    };
    return renderShareImage(result, sales, fonts, { showRupiah, showAds });
  }

  const shareText = `Selamat, aku bayar ${pctFmt(result.feesOnlyPct)}% biaya layanan ke Shopee. Kamu berapa? dialectify.ai/calculator-shopee`;

  async function share() {
    setBusy(true);
    setMsg(null);
    try {
      const blob = await makeImage();
      const file = new File([blob], "biaya-shopee.png", { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text: shareText });
      } else {
        download(blob);
        window.open(
          `https://www.threads.net/intent/post?text=${encodeURIComponent(shareText)}`,
          "_blank",
          "noopener",
        );
        setMsg("Gambar sudah terunduh. Lampirkan di postingan Threads yang baru terbuka.");
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") setMsg("Gagal membuat gambar. Coba lagi.");
    } finally {
      setBusy(false);
    }
  }

  async function saveOnly() {
    download(await makeImage());
  }

  return (
    <div className={`${glass} rounded-[18px] p-6 md:p-7`}>
      {/* font probes for the canvas */}
      <span ref={sansRef} className="font-plex hidden" />
      <span ref={monoRef} className="font-plex-mono hidden" />

      <p className="text-sm text-brand-muted">Selamat, kamu bayar</p>
      <div
        className="font-plex font-semibold tabular-nums tracking-tight leading-none mt-2 text-[#c2410c]"
        style={{ fontSize: "clamp(64px, 9vw, 88px)" }}
        aria-live="polite"
      >
        {pctFmt(result.feesOnlyPct)}%
      </div>
      <p className="text-sm text-brand-text mt-2">
        biaya layanan ke Shopee ·{" "}
        <span className="font-plex-mono tabular-nums">{formatRpShort(result.feesOnly)}</span> sebulan
      </p>
      {ads && (
        <p className="text-xs text-brand-muted mt-1 tabular-nums">
          + iklan {pctFmt(result.adPct)}% → total {pctFmt(result.totalPct)}% omzetmu ke Shopee
        </p>
      )}

      <StackBar lines={fees} total={result.feesOnly} />

      <ul className="list-none mt-4 font-plex-mono text-[13px] tabular-nums">
        {fees.map((l) => (
          <FeeRow key={l.key} line={l} />
        ))}
      </ul>

      {(ads || result.pph > 0) && (
        <>
          <p className="mt-4 mb-1 text-[11px] text-brand-muted">Di luar biaya layanan</p>
          <ul className="list-none font-plex-mono text-[13px] tabular-nums">
            {ads && <FeeRow line={ads} />}
            {result.pph > 0 && (
              <FeeRow
                line={{ key: "pph", label: "PPh 22", note: "Pajak 0,5%, dipungut Shopee", amount: result.pph, kind: "wajib" }}
              />
            )}
          </ul>
        </>
      )}

      {result.adNudge && result.adNudge.goxSaving > 0 && (
        <AdNudge extraAds={result.adNudge.extraAds} saving={result.adNudge.goxSaving} />
      )}

      <div className="mt-6 space-y-3">
        <ShareOption
          id="share-rupiah"
          title="Tampilkan omzet di gambar"
          detail={showRupiah ? "Gambar memuat omzet dan biaya dalam Rupiah" : "Hanya persen, omzetmu tidak terlihat"}
          checked={showRupiah}
          onChange={setShowRupiah}
        />
        {ads && (
          <ShareOption
            id="share-ads"
            title="Tampilkan iklan di gambar"
            detail={showAds ? `Tambah baris: + iklan ${pctFmt(result.adPct)}%, total ${pctFmt(result.totalPct)}%` : "Gambar hanya memuat biaya layanan"}
            checked={showAds}
            onChange={setShowAds}
          />
        )}
      </div>

      <button
        onClick={share}
        disabled={busy || sales <= 0}
        className="mt-4 w-full h-12 rounded-[10px] bg-brand-text text-white font-medium text-[15px] flex items-center justify-center gap-2.5 hover:bg-black disabled:opacity-50 transition-colors cursor-pointer"
      >
        <ThreadsMark />
        {busy ? "Menyiapkan gambar…" : "Bagikan ke Threads"}
      </button>
      <button
        onClick={saveOnly}
        className="mt-2 w-full text-sm text-brand-muted hover:text-brand-text py-1.5 cursor-pointer"
      >
        Unduh gambarnya saja
      </button>
      {msg && <p className="mt-2 text-xs text-brand-muted text-center">{msg}</p>}
    </div>
  );
}

function FeeRow({ line: l }: { line: FeeLine }) {
  return (
    <li className="flex items-baseline gap-3 py-1.5 border-b border-dashed border-brand-text/10 last:border-0">
      <span className={`h-2 w-2 rounded-full shrink-0 translate-y-[-1px] ${dot(l)}`} />
      <span className="font-plex flex-1 min-w-0">
        <span className="block text-brand-text">{l.label}</span>
        <span className="block text-[11px] text-brand-muted truncate">{l.note}</span>
      </span>
      <span>{formatRp(l.amount)}</span>
    </li>
  );
}

function ShareOption({
  id,
  title,
  detail,
  checked,
  onChange,
}: {
  id: string;
  title: string;
  detail: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <label htmlFor={id} className="cursor-pointer">
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-brand-muted mt-0.5">{detail}</div>
      </label>
      <Switch id={id} checked={checked} onChange={onChange} />
    </div>
  );
}

function AdNudge({ extraAds, saving }: { extraAds: number; saving: number }) {
  const worth = saving > extraAds;
  return (
    <div className="mt-5 rounded-[10px] bg-white/70 border border-brand-text/[0.06] px-4 py-3 text-[13px] leading-relaxed">
      Iklanmu di bawah 3% omzet. Tambah{" "}
      <b className="font-plex-mono tabular-nums">{formatRpShort(extraAds)}</b> iklan dan biaya Gratis
      Ongkir XTRA turun {pctFmt(GOX_AD_DISCOUNT_PTS)} poin, hemat{" "}
      <b className="font-plex-mono tabular-nums">{formatRpShort(saving)}</b>.{" "}
      <span className="text-brand-muted">
        {worth
          ? "Hematnya lebih besar dari tambahan iklannya."
          : "Hematnya lebih kecil dari tambahan iklan, jadi hanya masuk akal kalau iklannya juga menambah penjualan."}
      </span>
    </div>
  );
}

function StackBar({ lines, total }: { lines: FeeLine[]; total: number }) {
  if (total <= 0) return null;
  return (
    <div className="mt-6 flex h-2.5 w-full overflow-hidden rounded-full bg-brand-text/[0.06]">
      {lines.map((l) => (
        <div
          key={l.key}
          className={`${dot(l)} h-full border-r border-white/70 last:border-0 transition-[width] duration-300`}
          style={{ width: `${(l.amount / total) * 100}%` }}
          title={l.label}
        />
      ))}
    </div>
  );
}

const DOTS: Record<string, string> = {
  admin: "bg-brand-blue-dark",
  proses: "bg-brand-blue-mid",
  payment: "bg-[#6b7fa6]",
  gox: "bg-[#c2410c]",
  promo: "bg-[#e07a3f]",
  live: "bg-[#f0a974]",
  preorder: "bg-[#9aa7bd]",
  ads: "bg-brand-blue-light",
  pph: "bg-brand-text/20",
};
const dot = (l: FeeLine) => DOTS[l.key] ?? "bg-brand-muted";

function download(blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "biaya-shopee.png";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* ---------------------------------------------------------------- Inputs */

function Section({
  title,
  hint,
  aside,
  children,
}: {
  title: string;
  hint?: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="p-5 md:p-6 space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div>
          <h2 className="text-[15px] font-semibold">{title}</h2>
          {hint && <p className="text-xs text-brand-muted mt-0.5">{hint}</p>}
        </div>
        {aside}
      </div>
      {children}
    </section>
  );
}

function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
  compact,
}: {
  label?: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  compact?: boolean;
}) {
  return (
    <div className={compact ? "shrink-0" : ""}>
      {label && <div className="text-xs text-brand-muted mb-1.5">{label}</div>}
      <div
        role="radiogroup"
        aria-label={label}
        className={`inline-flex rounded-[10px] bg-brand-text/[0.06] p-1 ${compact ? "" : "w-full"}`}
      >
        {options.map((o) => {
          const on = o.value === value;
          return (
            <button
              key={o.value}
              role="radio"
              aria-checked={on}
              onClick={() => onChange(o.value)}
              className={`${compact ? "px-2.5 text-xs" : "flex-1 px-3 text-sm"} h-8 rounded-[7px] whitespace-nowrap transition-colors cursor-pointer ${
                on ? "bg-white text-brand-text font-medium shadow-[0_1px_2px_rgba(14,28,53,0.12)]" : "text-brand-muted hover:text-brand-text"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CategorySelect({
  value,
  onChange,
  isMall,
}: {
  value: string;
  onChange: (v: string) => void;
  isMall: boolean;
}) {
  const id = useId();
  const cat = CATEGORIES.find((c) => c.id === value)!;
  return (
    <div>
      <label htmlFor={id} className="block text-xs text-brand-muted mb-1.5">
        Kategori produk terlaris
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-11 appearance-none rounded-[10px] border border-brand-text/10 bg-white/80 pl-3.5 pr-24 text-sm outline-none focus:border-brand-blue-mid cursor-pointer"
        >
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-9 top-1/2 -translate-y-1/2 font-plex-mono text-xs text-brand-muted tabular-nums">
          admin {(isMall ? cat.adminMall : cat.admin).toLocaleString("id-ID")}%
        </span>
        <svg
          aria-hidden
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-muted"
          width="12"
          height="12"
          viewBox="0 0 12 12"
        >
          <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>
    </div>
  );
}

function MoneyField({
  label,
  value,
  onChange,
  prefix = "Rp",
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="block text-xs text-brand-muted mb-1.5">
        {label}
      </label>
      <div className="flex items-center h-11 rounded-[10px] border border-brand-text/10 bg-white/80 focus-within:border-brand-blue-mid transition-colors">
        {prefix && <span className="pl-3.5 text-sm text-brand-muted">{prefix}</span>}
        <input
          id={id}
          inputMode="numeric"
          value={value ? value.toLocaleString("id-ID") : ""}
          placeholder="0"
          onChange={(e) => onChange(Number(e.target.value.replace(/\D/g, "")) || 0)}
          className={`w-full min-w-0 ${prefix ? "pl-1.5" : "pl-3.5"} pr-3.5 bg-transparent font-plex-mono text-sm tabular-nums outline-none`}
        />
      </div>
    </div>
  );
}

function ToggleRow({
  title,
  detail,
  checked,
  onChange,
  children,
}: {
  title: string;
  detail: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  children?: React.ReactNode;
}) {
  const id = useId();
  return (
    <li className="px-1 py-3 border-b border-brand-text/[0.06] last:border-0 first:pt-0">
      <div className="flex items-start justify-between gap-4">
        <label htmlFor={id} className="cursor-pointer">
          <div className="text-sm font-medium">{title}</div>
          <div className="text-xs text-brand-muted mt-0.5">{detail}</div>
        </label>
        <Switch id={id} checked={checked} onChange={onChange} />
      </div>
      {children}
    </li>
  );
}

function Switch({ id, checked, onChange }: { id: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
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
  );
}

function MiniToggle({
  left,
  right,
  value,
  onChange,
}: {
  left: string;
  right: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <Segmented<"0" | "1">
      compact
      value={value ? "1" : "0"}
      onChange={(v) => onChange(v === "1")}
      options={[
        { value: "0", label: left },
        { value: "1", label: right },
      ]}
    />
  );
}

function ThreadsMark() {
  // Plain "@"-style glyph, drawn here rather than using Threads' logo asset.
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
