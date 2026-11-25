// Self-hosted fonts (latin subset, from Fontsource, OFL-1.1). Loaded locally
// so the build never depends on fetching from Google Fonts, which failed on
// Vercel inside next/font/google.
import localFont from "next/font/local";

export const jakarta = localFont({
  src: [
    { path: "./fonts/plus-jakarta-sans-latin-400-normal.woff2", weight: "400" },
    { path: "./fonts/plus-jakarta-sans-latin-500-normal.woff2", weight: "500" },
    { path: "./fonts/plus-jakarta-sans-latin-600-normal.woff2", weight: "600" },
    { path: "./fonts/plus-jakarta-sans-latin-700-normal.woff2", weight: "700" },
    { path: "./fonts/plus-jakarta-sans-latin-800-normal.woff2", weight: "800" },
  ],
  variable: "--font-jakarta",
  display: "swap",
});

export const dm = localFont({
  src: [
    { path: "./fonts/dm-sans-latin-300-normal.woff2", weight: "300" },
    { path: "./fonts/dm-sans-latin-400-normal.woff2", weight: "400" },
    { path: "./fonts/dm-sans-latin-500-normal.woff2", weight: "500" },
  ],
  variable: "--font-dm",
  display: "swap",
});

// IBM Plex Sans for text, Plex Mono for Rupiah figures (tabular numerals).
export const plex = localFont({
  src: [
    { path: "./fonts/ibm-plex-sans-latin-400-normal.woff2", weight: "400" },
    { path: "./fonts/ibm-plex-sans-latin-500-normal.woff2", weight: "500" },
    { path: "./fonts/ibm-plex-sans-latin-600-normal.woff2", weight: "600" },
  ],
  variable: "--font-plex",
  display: "swap",
});

export const plexMono = localFont({
  src: [
    { path: "./fonts/ibm-plex-mono-latin-400-normal.woff2", weight: "400" },
    { path: "./fonts/ibm-plex-mono-latin-500-normal.woff2", weight: "500" },
    { path: "./fonts/ibm-plex-mono-latin-600-normal.woff2", weight: "600" },
  ],
  variable: "--font-plex-mono",
  display: "swap",
});
