import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          "blue-dark":  "#1a3a6b",
          "blue-mid":   "#2563c4",
          "blue-light": "#4fa3e8",
          "bg":         "#f7f9fc",
          "bg-dark":    "#0e1c35",
          "text":       "#0e1c35",
          "muted":      "#5a6a85",
          "border":     "rgba(37,99,196,0.12)",
        },
      },
      fontFamily: {
        jakarta: ["var(--font-jakarta)", "sans-serif"],
        dm:      ["var(--font-dm)",      "sans-serif"],
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #2563c4 0%, #4fa3e8 100%)",
      },
      animation: {
        "pulse-dot": "pulseDot 2s ease-in-out infinite",
        "fade-up":   "fadeUp 0.6s ease both",
      },
      keyframes: {
        pulseDot: {
          "0%, 100%": { opacity: "1",   transform: "scale(1)"   },
          "50%":      { opacity: "0.5", transform: "scale(1.3)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to:   { opacity: "1", transform: "translateY(0)"    },
        },
      },
    },
  },
  plugins: [],
};

export default config;
