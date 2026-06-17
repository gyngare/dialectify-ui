import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContributeForm from "@/components/ContributeForm";

export const metadata: Metadata = {
  title: "Contribute — Dialectify.ai",
  description:
    "Help preserve your dialect by contributing sentence pairs to the Dialectify.ai dataset. Every sentence you submit helps bring your language into the AI era.",
};

export default function ContributePage() {
  return (
    <>
      <Navbar />
      <main>
        <ContributeForm />
      </main>
      <Footer />
    </>
  );
}
