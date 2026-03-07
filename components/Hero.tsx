"use client";

export default function Hero() {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-28 pb-20 text-center overflow-hidden">
      {/* Background gradients */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(37,99,196,0.10) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 80% 80%, rgba(79,163,232,0.07) 0%, transparent 60%)",
        }}
      />
      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(37,99,196,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,196,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Badge */}
      <div className="relative inline-flex items-center gap-2 bg-brand-blue-mid/10 border border-brand-blue-mid/20 rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase text-brand-blue-mid mb-7 animate-fade-up">
        <span className="w-1.5 h-1.5 rounded-full bg-brand-blue-light animate-pulse-dot" />
        Now building — Starting with Indonesia
      </div>

      {/* Headline */}
      <h1
        className="relative font-jakarta font-extrabold leading-[1.08] tracking-tight text-brand-text max-w-3xl mb-6 animate-fade-up"
        style={{ fontSize: "clamp(2.6rem, 6vw, 5rem)", animationDelay: "0.1s" }}
      >
        AI Infrastructure for the World&apos;s{" "}
        <span className="gradient-text">Ignored Languages</span>
      </h1>

      {/* Subtitle */}
      <p
        className="relative text-brand-muted max-w-xl leading-relaxed mb-10 text-lg animate-fade-up"
        style={{ animationDelay: "0.2s" }}
      >
        Dialectify.ai provides the data pipelines, fine-tuned models, and APIs
        that power AI products for the 6,900 languages modern AI has left behind.
      </p>

      {/* CTAs */}
      <div
        className="relative flex flex-wrap gap-3 items-center justify-center animate-fade-up"
        style={{ animationDelay: "0.3s" }}
      >
        <button
          onClick={() => scrollTo("waitlist")}
          className="bg-brand-grad text-white px-8 py-3.5 rounded-xl text-sm font-semibold shadow-lg shadow-brand-blue-mid/30 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-blue-mid/40 transition-all border-none cursor-pointer"
        >
          Join the Waitlist
        </button>
        <button
          onClick={() => scrollTo("how")}
          className="bg-transparent text-brand-blue-mid border border-brand-blue-mid/30 px-8 py-3.5 rounded-xl text-sm font-semibold hover:bg-brand-blue-mid/5 hover:border-brand-blue-mid transition-all cursor-pointer"
        >
          See How It Works →
        </button>
      </div>

      {/* Stats bar */}
      <div
        className="relative mt-16 flex flex-col sm:flex-row bg-white border border-brand-border rounded-2xl overflow-hidden shadow-md animate-fade-up w-full max-w-2xl"
        style={{ animationDelay: "0.4s" }}
      >
        {[
          { number: "7,000+", label: "Languages in the world" },
          { number: "~100",   label: "Supported by AI today" },
          { number: "700+",   label: "Indonesian dialects — where we start" },
        ].map((stat, i) => (
          <div
            key={i}
            className="flex-1 px-8 py-6 text-center border-b sm:border-b-0 sm:border-r border-brand-border last:border-0"
          >
            <div className="font-jakarta font-extrabold text-3xl gradient-text leading-none mb-1.5">
              {stat.number}
            </div>
            <div className="text-xs font-semibold uppercase tracking-widest text-brand-muted">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
