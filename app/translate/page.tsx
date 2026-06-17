import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TranslateApp from "@/components/Translate";

export const metadata: Metadata = {
  title: "Translate — Dialectify.ai",
  description:
    "Translate between Bahasa Indonesia and Manado Malay, Javanese, or Sundanese. Built for dialects Google Translate gets wrong.",
};

export default function TranslatePage() {
  return (
    <>
      <Navbar />
      <main>
        <TranslateApp />
      </main>
      <Footer />
    </>
  );
}
