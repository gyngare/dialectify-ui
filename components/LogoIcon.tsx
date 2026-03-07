export default function LogoIcon({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563c4" />
          <stop offset="1" stopColor="#4fa3e8" />
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="24" fill="url(#logoGrad)" />
      <path
        d="M30 22h36c16 0 28 11 28 28s-12 28-28 28H56L38 96V78H30C20 78 14 72 14 63V37C14 28 20 22 30 22Z"
        fill="white"
        fillOpacity="0.9"
      />
      <circle cx="76" cy="52" r="7" fill="url(#logoGrad)" />
    </svg>
  );
}
