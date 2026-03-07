export default function Footer() {
  return (
    <footer className="bg-brand-bg-dark border-t border-white/6 px-6 md:px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
      <span className="font-jakarta font-bold text-white">
        dialectify<span className="text-brand-blue-light">.ai</span>
      </span>
      <p className="text-xs text-white/30">
        © 2026 Dialectify.ai · AI Infrastructure for Low-Resource Languages
      </p>
      <p className="text-xs text-white/30">Starting in Indonesia 🇮🇩</p>
    </footer>
  );
}
