"use client";

import { useReveal } from "./useReveal";

const languages = [
  { name: "English",     sub: "✓ Fully supported",   supported: true  },
  { name: "Mandarin",    sub: "✓ Fully supported",   supported: true  },
  { name: "Javanese",    sub: "⚠ Barely supported",  supported: false },
  { name: "Sundanese",   sub: "⚠ Barely supported",  supported: false },
  { name: "Batak",       sub: "✗ Not supported",     supported: false },
  { name: "Minangkabau", sub: "✗ Not supported",     supported: false },
  { name: "Madurese",    sub: "✗ Not supported",     supported: false },
  { name: "Bugis",       sub: "✗ Not supported",     supported: false },
];

export default function Problem() {
  const leftRef  = useReveal();
  const rightRef = useReveal();

  return (
    <section className="bg-brand-bg-dark py-24 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Left */}
        <div ref={leftRef} className="reveal">
          <p className="text-xs font-bold tracking-widest uppercase text-brand-blue-light mb-4">
            The Problem
          </p>
          <h2 className="font-jakarta font-extrabold text-white leading-tight tracking-tight mb-5"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}>
            Most of the world&apos;s languages are invisible to AI
          </h2>
          <p className="text-white/50 leading-relaxed text-base">
            English, Mandarin, Spanish — AI handles these well. But the Javanese
            farmer, the Sundanese student, the Batak entrepreneur? They interact
            with AI in a language that isn&apos;t truly theirs. We&apos;re building the
            infrastructure to change that.
          </p>
        </div>

        {/* Right — language grid */}
        <div ref={rightRef} className="reveal grid grid-cols-2 gap-3">
          {languages.map((lang) => (
            <div
              key={lang.name}
              className={`relative rounded-xl px-5 py-4 text-sm font-medium overflow-hidden transition-all ${
                lang.supported
                  ? "bg-brand-blue-mid/15 border border-brand-blue-light/40 text-white"
                  : "bg-white/4 border border-white/8 text-white/50"
              }`}
            >
              {lang.supported && (
                <span className="absolute top-0 left-0 right-0 h-0.5 bg-brand-grad" />
              )}
              {lang.name}
              <div
                className={`text-xs mt-1 ${
                  lang.supported ? "text-brand-blue-light/80" : "text-white/30"
                }`}
              >
                {lang.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
