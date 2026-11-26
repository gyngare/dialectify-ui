import type { Metadata } from "next";
import ProductRank from "@/components/shopee/ProductRank";

export const metadata: Metadata = {
  title: "Peringkat produk Shopee: kelas S sampai D · Dialectify",
  description:
    "Tempel link produk Shopee dan lihat skornya: penjualan dalam Rupiah, kepercayaan pembeli, dan kualitas foto serta deskripsi. Lengkap dengan daftar perbaikan.",
  openGraph: {
    title: "Produkmu kelas berapa di Shopee?",
    description: "Skor 0–100 dari penjualan, ulasan, foto dan deskripsi. Gratis, tanpa daftar.",
    url: "https://dialectify.ai/rank-shopee",
    siteName: "Dialectify.ai",
    locale: "id_ID",
    type: "website",
  },
};

export default function Page() {
  return <ProductRank />;
}
