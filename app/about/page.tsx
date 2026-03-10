"use client";

import { useReveal } from "@/components/useReveal";
import LogoIcon from "@/components/LogoIcon";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const values = [
  {
    icon: "🌏",
    title: "Language is identity",
    desc: "Every dialect carries centuries of culture, humor, and wisdom. When a language disappears from AI, a community becomes invisible to the modern world.",
  },
  {
    icon: "🔬",
    title: "Data before models",
    desc: "The bottleneck isn't AI capability — it's data. We obsess over collecting clean, verified, native-speaker data before we write a single line of model code.",
  },
  {
    icon: "🤝",
    title: "Community first",
    desc: "The people who speak these languages are our partners, not just data sources. We build with communities, not on top of them.",
  },
  {
    icon: "🏗️",
    title: "Infrastructure thinking",
    desc: "We're not building a translation app. We're building the roads that make every dialect-aware AI product possible.",
  },
];

const milestones = [
  { year: "2026", event: "Dialectify.ai founded in Bandung, Indonesia" },
  { year: "2026", event: "First dataset — Manado Malay sentence pairs" },
  { year: "2026", event: "Waitlist launched at dialectify.ai" },
  { year: "Soon", event: "First fine-tuned dialect model" },
  { year: "Soon", event: "Public API for developers" },
];

export default function AboutContent() {
  const heroRef = useReveal();
  const storyRef = useReveal();
  const quoteRef = useReveal();
  const valuesRef = useReveal();
  const teamRef = useReveal();
  const timelineRef = useReveal();
  const ctaRef = useReveal();

  return (
    <>
      <Navbar />
      <main>
        <div className="pt-20">
          {/* Hero */}
          <section className="relative px-6 py-24 text-center overflow-hidden">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(37,99,196,0.09) 0%, transparent 70%)",
              }}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(37,99,196,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,196,0.04) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
              }}
            />
            <div ref={heroRef} className="reveal relative max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-brand-blue-mid/10 border border-brand-blue-mid/20 rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase text-brand-blue-mid mb-7">
                Our Story
              </div>
              <h1
                className="font-jakarta font-extrabold text-brand-text leading-tight tracking-tight mb-6"
                style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)" }}
              >
                Built for the languages{" "}
                <span className="gradient-text">the world forgot</span>
              </h1>
              <p className="text-brand-muted text-lg leading-relaxed max-w-xl mx-auto">
                Dialectify.ai exists because millions of people deserve AI that
                truly understands them — in the language they grew up speaking,
                not just the one they were taught in school.
              </p>
            </div>
          </section>

          {/* Story */}
          <section className="bg-white px-6 py-20">
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div ref={storyRef} className="reveal">
                <p className="text-xs font-bold tracking-widest uppercase text-brand-blue-mid mb-4">
                  The Origin
                </p>
                <h2
                  className="font-jakarta font-extrabold text-brand-text leading-tight tracking-tight mb-6"
                  style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}
                >
                  It started with a conversation my mom couldn&apos;t have with
                  AI
                </h2>
                <div className="space-y-4 text-brand-muted leading-relaxed">
                  <p>
                    My mother is Manadonese. She grew up speaking Bahasa Manado
                    — a language full of warmth, humor, and expressions that
                    simply don&apos;t exist in standard Indonesian. When I tried
                    using AI tools to help her translate or communicate, they
                    failed. Not partially — completely.
                  </p>
                  <p>
                    That moment made me realize the problem wasn&apos;t just
                    Manado Malay. There are 700+ dialects across Indonesia
                    alone, and thousands more across the world, that modern AI
                    treats as if they don&apos;t exist. The people who speak
                    them are invisible to the technology shaping our future.
                  </p>
                  <p>
                    Dialectify.ai is my answer to that. Not just a translation
                    tool — but the infrastructure layer that makes every ignored
                    language a first-class citizen of the AI era.
                  </p>
                </div>
              </div>

              {/* Quote card */}
              <div ref={quoteRef} className="reveal">
                <div className="bg-brand-bg-dark rounded-2xl p-8 relative overflow-hidden">
                  <div
                    className="absolute inset-0 pointer-events-none opacity-20"
                    style={{
                      background:
                        "radial-gradient(ellipse at top right, #4fa3e8, transparent 60%)",
                    }}
                  />
                  <div className="relative">
                    <div className="text-5xl font-jakarta font-extrabold gradient-text leading-none mb-6">
                      &ldquo;
                    </div>
                    <p className="text-white text-lg leading-relaxed font-jakarta font-medium mb-6">
                      7,000 languages exist in the world. AI speaks maybe 100 of
                      them well. We&apos;re here for the other 6,900.
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-grad flex items-center justify-center text-white font-jakarta font-bold text-sm">
                        GA
                      </div>
                      <div>
                        <div className="text-white font-semibold text-sm">
                          Geary Audie
                        </div>
                        <div className="text-white/40 text-xs">
                          Founder, Dialectify.ai
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Values */}
          <section className="bg-brand-bg px-6 py-20">
            <div className="max-w-5xl mx-auto">
              <div ref={valuesRef} className="reveal text-center mb-14">
                <p className="text-xs font-bold tracking-widest uppercase text-brand-blue-mid mb-3">
                  What We Believe
                </p>
                <h2
                  className="font-jakarta font-extrabold text-brand-text leading-tight tracking-tight mx-auto"
                  style={{
                    fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
                    maxWidth: 500,
                  }}
                >
                  Our values shape every decision we make
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {values.map((v) => (
                  <ValueCard key={v.title} {...v} />
                ))}
              </div>
            </div>
          </section>

          {/* Team */}
          <section className="bg-white px-6 py-20">
            <div className="max-w-5xl mx-auto">
              <div ref={teamRef} className="reveal text-center mb-14">
                <p className="text-xs font-bold tracking-widest uppercase text-brand-blue-mid mb-3">
                  The Team
                </p>
                <h2
                  className="font-jakarta font-extrabold text-brand-text leading-tight tracking-tight"
                  style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}
                >
                  Small team. Big mission.
                </h2>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                {/* Founder card */}
                <div className="bg-brand-bg border border-brand-border rounded-2xl p-8 max-w-sm w-full mx-auto sm:mx-0">
                  <div className="w-16 h-16 rounded-2xl bg-brand-grad flex items-center justify-center text-white font-jakarta font-extrabold text-xl mb-5">
                    GA
                  </div>
                  <h3 className="font-jakarta font-bold text-brand-text text-lg mb-1">
                    Geary Audie
                  </h3>
                  <p className="text-brand-blue-mid text-sm font-semibold mb-4">
                    Founder & Engineer
                  </p>
                  <p className="text-brand-muted text-sm leading-relaxed">
                    Software developer based in Bandung, Indonesia. Building
                    Dialectify.ai to give the world&apos;s ignored languages a
                    place in the AI era — starting with his mother&apos;s
                    language, Manado Malay.
                  </p>
                </div>

                {/* Join card */}
                <div className="bg-brand-bg-dark border border-white/8 rounded-2xl p-8 max-w-sm w-full mx-auto sm:mx-0 flex flex-col justify-between">
                  <div>
                    <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-white/20 flex items-center justify-center text-white/30 text-2xl mb-5">
                      +
                    </div>
                    <h3 className="font-jakarta font-bold text-white text-lg mb-1">
                      You?
                    </h3>
                    <p className="text-white/40 text-sm font-semibold mb-4">
                      Co-founder · Linguist · Engineer
                    </p>
                    <p className="text-white/50 text-sm leading-relaxed">
                      We&apos;re looking for people who are passionate about
                      language, AI, and building infrastructure that matters. If
                      that&apos;s you, we&apos;d love to talk.
                    </p>
                  </div>
                  <a
                    href="mailto:hello@dialectify.ai"
                    className="mt-6 inline-block text-center bg-white/10 hover:bg-white/15 transition-colors text-white text-sm font-semibold px-5 py-3 rounded-xl"
                  >
                    Get in touch →
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Timeline */}
          <section className="bg-brand-bg px-6 py-20">
            <div className="max-w-2xl mx-auto">
              <div ref={timelineRef} className="reveal text-center mb-14">
                <p className="text-xs font-bold tracking-widest uppercase text-brand-blue-mid mb-3">
                  Roadmap
                </p>
                <h2
                  className="font-jakarta font-extrabold text-brand-text leading-tight tracking-tight"
                  style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}
                >
                  Where we&apos;ve been. Where we&apos;re going.
                </h2>
              </div>

              <div className="relative">
                {/* vertical line */}
                <div className="absolute left-[19px] top-0 bottom-0 w-px bg-brand-border" />

                <div className="space-y-8">
                  {milestones.map((m, i) => (
                    <MilestoneItem key={i} {...m} done={m.year !== "Soon"} />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="bg-brand-bg-dark px-6 py-24 text-center">
            <div ref={ctaRef} className="reveal max-w-xl mx-auto">
              <div className="flex justify-center mb-6">
                <LogoIcon size={48} />
              </div>
              <h2
                className="font-jakarta font-extrabold text-white leading-tight tracking-tight mb-5"
                style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}
              >
                Be part of the mission
              </h2>
              <p className="text-white/50 leading-relaxed mb-8">
                Whether you&apos;re a developer, researcher, linguist, or
                someone who just loves their dialect — there&apos;s a place for
                you in what we&apos;re building.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="/#waitlist"
                  className="bg-brand-grad text-white px-8 py-3.5 rounded-xl text-sm font-semibold shadow-lg shadow-brand-blue-mid/30 hover:opacity-90 transition-opacity text-center"
                >
                  Join the Waitlist
                </a>
                <a
                  href="mailto:hello@dialectify.ai"
                  className="bg-transparent text-white border border-white/20 px-8 py-3.5 rounded-xl text-sm font-semibold hover:bg-white/5 transition-colors text-center"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

function ValueCard({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className="reveal bg-white border border-brand-border rounded-2xl p-7 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
    >
      <div className="w-11 h-11 rounded-xl bg-brand-blue-mid/8 flex items-center justify-center text-2xl mb-5">
        {icon}
      </div>
      <h3 className="font-jakarta font-bold text-brand-text mb-2">{title}</h3>
      <p className="text-sm text-brand-muted leading-relaxed">{desc}</p>
    </div>
  );
}

function MilestoneItem({
  year,
  event,
  done,
}: {
  year: string;
  event: string;
  done: boolean;
}) {
  const ref = useReveal();
  return (
    <div ref={ref} className="reveal flex items-start gap-5 relative">
      <div
        className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 z-10 ${
          done
            ? "bg-brand-grad border-brand-blue-mid text-white"
            : "bg-brand-bg border-brand-border text-brand-muted"
        }`}
      >
        {done ? "✓" : "○"}
      </div>
      <div className="pt-2">
        <span
          className={`text-xs font-bold tracking-widest uppercase mr-3 ${
            done ? "text-brand-blue-mid" : "text-brand-muted"
          }`}
        >
          {year}
        </span>
        <span
          className={`text-sm font-medium ${
            done ? "text-brand-text" : "text-brand-muted"
          }`}
        >
          {event}
        </span>
      </div>
    </div>
  );
}
