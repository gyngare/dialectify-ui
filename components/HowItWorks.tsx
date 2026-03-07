"use client";

import { useReveal } from "./useReveal";

const steps = [
  {
    num: "01",
    title: "Collect",
    desc: "Community-driven data pipelines that gather, clean, and label dialect speech and text — building a proprietary dataset no one else has.",
  },
  {
    num: "02",
    title: "Train",
    desc: "Fine-tuned language models purpose-built for low-resource environments. Not general models — specialized models that actually understand dialect nuance.",
  },
  {
    num: "03",
    title: "Deploy",
    desc: "Simple APIs developers call to add low-resource language capabilities to their own products. Plug in, build fast, reach communities that were unreachable before.",
  },
];

export default function HowItWorks() {
  const leftRef  = useReveal();
  const rightRef = useReveal();

  return (
    <section id="how" className="bg-white py-24 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20 items-start">
        {/* Left */}
        <div ref={leftRef} className="reveal">
          <p className="text-xs font-bold tracking-widest uppercase text-brand-blue-mid mb-4">
            How It Works
          </p>
          <h2
            className="font-jakarta font-extrabold text-brand-text leading-tight tracking-tight mb-8"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
          >
            Three layers. One platform.
          </h2>

          <div className="flex flex-col divide-y divide-brand-border">
            {steps.map((step) => (
              <div key={step.num} className="flex gap-5 py-6 first:pt-0 last:pb-0">
                <div className="w-10 h-10 rounded-xl bg-brand-grad flex items-center justify-center shrink-0 font-jakarta font-extrabold text-white text-sm">
                  {step.num}
                </div>
                <div>
                  <div className="font-jakarta font-bold text-brand-text mb-1.5">
                    {step.title}
                  </div>
                  <p className="text-sm text-brand-muted leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — API preview */}
        <div ref={rightRef} className="reveal md:sticky md:top-24 bg-brand-bg border border-brand-border rounded-2xl p-6">
          <p className="text-xs font-bold tracking-widest uppercase text-brand-muted mb-3">
            API Example
          </p>
          <div className="bg-brand-bg-dark rounded-xl p-6 font-mono text-sm leading-loose text-white/70">
            <span className="text-brand-blue-light/70">{"// Translate to Javanese dialect"}</span>
            <br />
            <span className="text-blue-300">const</span> result ={" "}
            <span className="text-blue-300">await</span> dialectify.
            <br />
            &nbsp;&nbsp;translate(&#123;
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-300">text:</span>{" "}
            <span className="text-sky-300">&quot;Hello, how are you?&quot;</span>,
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-300">target:</span>{" "}
            <span className="text-sky-300">&quot;jv-kromo&quot;</span>,
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-300">region:</span>{" "}
            <span className="text-sky-300">&quot;central-java&quot;</span>
            <br />
            &nbsp;&nbsp;&#125;);
            <br />
            <br />
            <span className="text-brand-blue-light/70">
              {"// → \"Sugeng, pripun kabare?\""}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
