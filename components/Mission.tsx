"use client";

import { useReveal } from "./useReveal";

export default function Mission() {
  const ref = useReveal();

  return (
    <section id="mission" className="bg-brand-bg-dark py-28 px-6 text-center">
      <div ref={ref} className="reveal max-w-3xl mx-auto">
        <p className="text-xs font-bold tracking-widest uppercase text-brand-blue-light mb-5">
          Our Mission
        </p>
        <blockquote
          className="font-jakarta font-bold text-white leading-snug tracking-tight mb-8"
          style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.8rem)" }}
        >
          &ldquo;Millions of people interact with AI every day in a language that{" "}
          <em className="not-italic gradient-text">isn&apos;t truly theirs.</em> We&apos;re
          changing that — one dialect at a time.&rdquo;
        </blockquote>
        <p className="text-white/45 leading-relaxed mx-auto mb-12" style={{ maxWidth: 440 }}>
          Starting with Indonesia&apos;s 700+ dialects. Expanding to the world&apos;s
          6,900 ignored languages. Building the infrastructure that makes every
          language a first-class citizen of the AI era.
        </p>
        <button
          onClick={() =>
            document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })
          }
          className="bg-brand-grad text-white px-8 py-3.5 rounded-xl text-sm font-semibold shadow-lg shadow-brand-blue-mid/30 hover:-translate-y-0.5 hover:shadow-xl transition-all border-none cursor-pointer"
        >
          Join Us →
        </button>
      </div>
    </section>
  );
}
