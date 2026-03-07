"use client";

import { useReveal } from "./useReveal";

const cases = [
  {
    icon: "🏛️",
    title: "Government Services",
    desc: "Regional agencies deploying chatbots and voice services that actually speak the local dialect — not just formal Bahasa Indonesia.",
  },
  {
    icon: "📚",
    title: "Education Platforms",
    desc: "EdTech apps reaching rural students in the language they think in, not just the language they're tested in.",
  },
  {
    icon: "📺",
    title: "Media & Broadcasting",
    desc: "News and content companies localizing across Indonesia's 700+ dialects without a team of translators for each region.",
  },
  {
    icon: "🔬",
    title: "Research Institutions",
    desc: "Universities and linguists gaining access to the largest structured dialect dataset in Southeast Asia.",
  },
  {
    icon: "💬",
    title: "Messaging & Voice Apps",
    desc: "Consumer apps adding dialect-aware translation directly where people already communicate — WhatsApp, keyboards, voice assistants.",
  },
  {
    icon: "🌍",
    title: "NGOs & Development Orgs",
    desc: "Organizations working in rural and underserved communities communicating in the language that actually builds trust.",
  },
];

export default function UseCases() {
  const headerRef = useReveal();

  return (
    <section id="usecases" className="bg-brand-bg py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div ref={headerRef} className="reveal text-center mb-14">
          <p className="text-xs font-bold tracking-widest uppercase text-brand-blue-mid mb-3">
            Use Cases
          </p>
          <h2
            className="font-jakarta font-extrabold text-brand-text leading-tight tracking-tight mx-auto mb-4"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", maxWidth: 560 }}
          >
            Built for builders who reach everyone
          </h2>
          <p className="text-brand-muted mx-auto leading-relaxed" style={{ maxWidth: 480 }}>
            From regional governments to local startups — Dialectify.ai is the
            language layer your product has been missing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cases.map((c) => (
            <Card key={c.title} {...c} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Card({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className="reveal bg-white border border-brand-border rounded-2xl p-7 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-text/8 transition-all duration-300"
    >
      <div className="w-11 h-11 rounded-xl bg-brand-blue-mid/8 flex items-center justify-center text-2xl mb-5">
        {icon}
      </div>
      <h3 className="font-jakarta font-bold text-brand-text mb-2.5">{title}</h3>
      <p className="text-sm text-brand-muted leading-relaxed">{desc}</p>
    </div>
  );
}
