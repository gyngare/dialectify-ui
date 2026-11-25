import type { Metadata } from "next";
import { jakarta, dm, plex, plexMono } from "./fonts";
import "./globals.css";

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
    <html lang="en" className={`${jakarta.variable} ${dm.variable} ${plex.variable} ${plexMono.variable}`}>
      <body className="font-dm">{children}</body>
    </html>
  );
}
