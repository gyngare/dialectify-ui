# Dialectify.ai — Landing Page

Next.js 15 · TypeScript · Tailwind CSS · App Router

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Tech Stack

- **Next.js 15** with App Router
- **TypeScript** — fully typed
- **Tailwind CSS** — utility-first styling with custom brand tokens
- **Google Fonts** — Plus Jakarta Sans + DM Sans (loaded via `next/font/google`)

## Project Structure

```
dialectify/
├── app/
│   ├── layout.tsx       # Root layout with font imports & metadata
│   ├── page.tsx         # Main page — assembles all sections
│   └── globals.css      # Tailwind directives + custom utilities
├── components/
│   ├── Navbar.tsx       # Sticky nav with mobile hamburger menu
│   ├── Hero.tsx         # Hero section with stats bar
│   ├── Problem.tsx      # Problem section with language grid
│   ├── HowItWorks.tsx   # 3-step flow + API code preview
│   ├── UseCases.tsx     # 6 use case cards
│   ├── Mission.tsx      # Mission quote section
│   ├── Waitlist.tsx     # Email capture CTA
│   ├── Footer.tsx       # Footer
│   ├── LogoIcon.tsx     # SVG logo component
│   └── useReveal.ts     # Scroll reveal hook
├── tailwind.config.ts   # Brand color tokens + font config
└── tsconfig.json
```

## Brand Colors

All colors are defined as Tailwind tokens in `tailwind.config.ts`:

| Token                  | Value     |
|------------------------|-----------|
| `brand-blue-dark`      | `#1a3a6b` |
| `brand-blue-mid`       | `#2563c4` |
| `brand-blue-light`     | `#4fa3e8` |
| `brand-bg`             | `#f7f9fc` |
| `brand-bg-dark`        | `#0e1c35` |
| `brand-text`           | `#0e1c35` |
| `brand-muted`          | `#5a6a85` |

## Build for Production

```bash
npm run build
npm start
```
