const rupiah = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 });

// -12500 → "-Rp12.500"
export function formatRp(n: number): string {
  const sign = n < 0 ? "-" : "";
  return `${sign}Rp${rupiah.format(Math.abs(Math.round(n)))}`;
}

// 48600000 → "Rp48,6 jt", 1250000000 → "Rp1,3 M"
export function formatRpShort(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  const fmt = (v: number) => v.toLocaleString("id-ID", { maximumFractionDigits: 1 });
  if (abs >= 1e9) return `${sign}Rp${fmt(abs / 1e9)} M`;
  if (abs >= 1e6) return `${sign}Rp${fmt(abs / 1e6)} jt`;
  if (abs >= 1e3) return `${sign}Rp${fmt(abs / 1e3)} rb`;
  return formatRp(n);
}

export function formatPct(n: number, digits = 1): string {
  return `${n.toLocaleString("id-ID", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}%`;
}

export function formatNumber(n: number): string {
  return rupiah.format(n);
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
