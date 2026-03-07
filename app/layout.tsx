import type { Metadata } from "next";
import { Plus_Jakarta_Sans, DM_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const dm = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dialectify.ai — AI Infrastructure for the World's Ignored Languages",
  description:
    "Dialectify.ai provides the data pipelines, fine-tuned models, and APIs that power AI products for the 6,900 languages modern AI has left behind. Starting with Indonesia's 700+ dialects.",
  openGraph: {
    title: "Dialectify.ai",
    description: "AI Infrastructure for the World's Ignored Languages",
    url: "https://dialectify.ai",
    siteName: "Dialectify.ai",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jakarta.variable} ${dm.variable}`}>
      <body className="font-dm">{children}</body>
    </html>
  );
}
