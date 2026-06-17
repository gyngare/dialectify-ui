"use client";

import { useState, useEffect } from "react";

type Language = {
  id: string;
  code: string;
  name: string;
  region: string;
  status: string;
};
type Pair = { source_text: string; translated_text: string; domain: string };
type Step = "info" | "pairs" | "success";

const DOMAINS = [
  "casual",
  "market",
  "family",
  "proverb",
  "instruction",
  "formal",
];
const AGE_RANGES = ["under-18", "18-25", "26-35", "36-50", "50+"];
const SOURCE_LANG_CODE = "id"; // always Indonesian as source

const emptyPair = (): Pair => ({
  source_text: "",
  translated_text: "",
  domain: "casual",
});

export default function ContributeForm() {
  const [step, setStep] = useState<Step>("info");
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1 — contributor info
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [region, setRegion] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [nativeLangId, setNativeLangId] = useState("");
  const [targetLangId, setTargetLangId] = useState("");

  // Step 2 — sentence pairs
  const [pairs, setPairs] = useState<Pair[]>([
    emptyPair(),
    emptyPair(),
    emptyPair(),
  ]);

  useEffect(() => {
    fetch("/api/languages")
      .then((r) => r.json())
      .then((data) => setLanguages(data));
  }, []);

  const activeLangs = languages.filter(
    (l) => l.status === "active" && l.code !== SOURCE_LANG_CODE,
  );
  const sourceLangId =
    languages.find((l) => l.code === SOURCE_LANG_CODE)?.id ?? "";

  const updatePair = (i: number, field: keyof Pair, value: string) => {
    setPairs((prev) =>
      prev.map((p, idx) => (idx === i ? { ...p, [field]: value } : p)),
    );
  };

  const addPair = () => setPairs((prev) => [...prev, emptyPair()]);

  const removePair = (i: number) => {
    if (pairs.length <= 1) return;
    setPairs((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleInfoNext = () => {
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }
    if (!nativeLangId) {
      setError("Please select your native dialect.");
      return;
    }
    if (!targetLangId) {
      setError("Please select the dialect you are translating to.");
      return;
    }
    setError("");
    setStep("pairs");
  };

  const handleSubmit = async () => {
    const validPairs = pairs.filter(
      (p) => p.source_text.trim() && p.translated_text.trim(),
    );
    if (validPairs.length === 0) {
      setError("Please fill in at least one sentence pair.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/contribute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          region,
          age_range: ageRange,
          native_language_id: nativeLangId,
          pairs: validPairs.map((p) => ({
            source_text: p.source_text,
            source_language_id: sourceLangId,
            translated_text: p.translated_text,
            target_language_id: targetLangId,
            domain: p.domain,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        return;
      }
      setStep("success");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-20 px-6 min-h-screen bg-brand-bg">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-brand-blue-mid/10 border border-brand-blue-mid/20 rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase text-brand-blue-mid mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-blue-light animate-pulse" />
            Data Collection
          </div>
          <h1
            className="font-jakarta font-extrabold text-brand-text leading-tight tracking-tight mb-4"
            style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}
          >
            Help preserve your dialect
          </h1>
          <p className="text-brand-muted leading-relaxed max-w-md mx-auto">
            Every sentence you contribute helps bring your language into the AI
            era. It takes less than 5 minutes.
          </p>
        </div>

        {/* Progress */}
        {step !== "success" && (
          <div className="flex items-center gap-3 mb-10">
            {["info", "pairs"].map((s, i) => (
              <div key={s} className="flex items-center gap-3 flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                    step === s
                      ? "bg-brand-grad text-white"
                      : step === "pairs" && s === "info"
                        ? "bg-brand-blue-mid/20 text-brand-blue-mid"
                        : "bg-brand-border text-brand-muted"
                  }`}
                >
                  {step === "pairs" && s === "info" ? "✓" : i + 1}
                </div>
                <span
                  className={`text-sm font-medium ${step === s ? "text-brand-text" : "text-brand-muted"}`}
                >
                  {s === "info" ? "Your Info" : "Sentence Pairs"}
                </span>
                {i === 0 && <div className="flex-1 h-px bg-brand-border" />}
              </div>
            ))}
          </div>
        )}

        {/* STEP 1 — Info */}
        {step === "info" && (
          <div className="bg-white border border-brand-border rounded-2xl p-8 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Your Name (optional)">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Siti Rahayu"
                  className={inputCls}
                />
              </Field>
              <Field label="Email *">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  type="email"
                  className={inputCls}
                />
              </Field>
              <Field label="Your Region / Hometown">
                <input
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="e.g. Manado, North Sulawesi"
                  className={inputCls}
                />
              </Field>
              <Field label="Age Range">
                <select
                  value={ageRange}
                  onChange={(e) => setAgeRange(e.target.value)}
                  className={inputCls}
                >
                  <option value="">Select age range</option>
                  {AGE_RANGES.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Your Native Dialect *">
                <select
                  value={nativeLangId}
                  onChange={(e) => setNativeLangId(e.target.value)}
                  className={inputCls}
                >
                  <option value="">Select your dialect</option>
                  {activeLangs.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} — {l.region}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Translating To *">
                <select
                  value={targetLangId}
                  onChange={(e) => setTargetLangId(e.target.value)}
                  className={inputCls}
                >
                  <option value="">Select target dialect</option>
                  {activeLangs.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} — {l.region}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              onClick={handleInfoNext}
              className="w-full bg-brand-grad text-white py-3.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity border-none cursor-pointer"
            >
              Continue to Sentences →
            </button>
          </div>
        )}

        {/* STEP 2 — Pairs */}
        {step === "pairs" && (
          <div className="space-y-4">
            <div className="bg-brand-bg-dark/5 border border-brand-border rounded-xl px-5 py-3 text-sm text-brand-muted flex items-center gap-2">
              <span>📝</span>
              Write the Indonesian sentence on the left, then translate it
              naturally into your dialect on the right.
            </div>

            {pairs.map((pair, i) => (
              <div
                key={i}
                className="bg-white border border-brand-border rounded-2xl p-6 space-y-4"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-brand-blue-mid">
                    Pair {i + 1}
                  </span>
                  {pairs.length > 1 && (
                    <button
                      onClick={() => removePair(i)}
                      className="text-xs text-brand-muted hover:text-red-400 transition-colors bg-transparent border-none cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Indonesian (source)">
                    <textarea
                      value={pair.source_text}
                      onChange={(e) =>
                        updatePair(i, "source_text", e.target.value)
                      }
                      placeholder="e.g. Saya mau pergi ke pasar"
                      rows={3}
                      className={`${inputCls} resize-none`}
                    />
                  </Field>
                  <Field label="Your Dialect (translation)">
                    <textarea
                      value={pair.translated_text}
                      onChange={(e) =>
                        updatePair(i, "translated_text", e.target.value)
                      }
                      placeholder="e.g. Kita mo pi pasar"
                      rows={3}
                      className={`${inputCls} resize-none`}
                    />
                  </Field>
                </div>
                <Field label="Domain / Context">
                  <select
                    value={pair.domain}
                    onChange={(e) => updatePair(i, "domain", e.target.value)}
                    className={`${inputCls} max-w-xs`}
                  >
                    {DOMAINS.map((d) => (
                      <option key={d} value={d}>
                        {d.charAt(0).toUpperCase() + d.slice(1)}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            ))}

            <button
              onClick={addPair}
              className="w-full border-2 border-dashed border-brand-border text-brand-muted py-3 rounded-xl text-sm font-medium hover:border-brand-blue-mid hover:text-brand-blue-mid transition-colors bg-transparent cursor-pointer"
            >
              + Add another sentence pair
            </button>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex gap-3">
              <button
                onClick={() => setStep("info")}
                className="flex-1 border border-brand-border text-brand-muted py-3.5 rounded-xl text-sm font-semibold hover:bg-brand-bg transition-colors bg-transparent cursor-pointer"
              >
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-brand-grad text-white py-3.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity border-none cursor-pointer disabled:opacity-60"
              >
                {loading
                  ? "Submitting..."
                  : `Submit ${pairs.filter((p) => p.source_text && p.translated_text).length} Pairs`}
              </button>
            </div>
          </div>
        )}

        {/* SUCCESS */}
        {step === "success" && (
          <div className="bg-white border border-brand-border rounded-2xl p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-brand-blue-mid/10 flex items-center justify-center text-3xl mx-auto mb-6">
              🎉
            </div>
            <h2 className="font-jakarta font-extrabold text-brand-text text-2xl mb-3">
              Terima kasih!
            </h2>
            <p className="text-brand-muted leading-relaxed mb-8 max-w-sm mx-auto">
              Your sentences have been saved. Every contribution brings your
              dialect one step closer to the AI era.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  setPairs([emptyPair(), emptyPair(), emptyPair()]);
                  setStep("info");
                }}
                className="bg-brand-grad text-white px-8 py-3 rounded-xl text-sm font-semibold border-none cursor-pointer hover:opacity-90"
              >
                Contribute More
              </button>
              <a
                href="/"
                className="border border-brand-border text-brand-muted px-8 py-3 rounded-xl text-sm font-semibold hover:bg-brand-bg transition-colors text-center"
              >
                Back to Home
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const inputCls =
  "w-full px-4 py-2.5 rounded-xl border border-brand-border bg-brand-bg text-sm text-brand-text outline-none focus:border-brand-blue-mid transition-colors font-dm";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-brand-text uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  );
}
