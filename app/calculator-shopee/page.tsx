import type { Metadata } from "next";
import ShopeeFeeCalculator from "@/components/shopee/ShopeeFeeCalculator";

export const metadata: Metadata = {
  title: "Kalkulator biaya layanan Shopee 2026 · Dialectify",
  description:
    "Hitung berapa persen omzetmu yang dipotong Shopee: biaya admin per kategori, Rp1.250 per pesanan, Gratis Ongkir XTRA (termasuk tarif 1 Desember 2026), Promo XTRA, Live XTRA, dan iklan.",
  openGraph: {
    title: "Berapa persen omzetmu yang diambil Shopee?",
    description: "Tarif per November 2026. Gratis, tanpa daftar.",
    url: "https://dialectify.ai/calculator-shopee",
    siteName: "Dialectify.ai",
    locale: "id_ID",
    type: "website",
  },
};

export default function Page() {
  return <ShopeeFeeCalculator />;
}
