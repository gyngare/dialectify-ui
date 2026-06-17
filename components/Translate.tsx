"use client";

import { useState, useCallback } from "react";

const DIALECTS = [
  {
    id: "manado",
    name: "Manado Malay",
    local: "Bahasa Manado",
    region: "North Sulawesi",
    flag: "🌴",
    example: "Kita mo pi pasar jo",
  },
  {
    id: "javanese",
    name: "Javanese",
    local: "Basa Jawa",
    region: "Central & East Java",
    flag: "🏛️",
    example: "Aku arep mangan sik",
  },
  {
    id: "sundanese",
    name: "Sundanese",
    local: "Basa Sunda",
    region: "West Java",
    flag: "🌿",
    example: "Kumaha damang?",
  },
];

type Direction = "to_dialect" | "to_indonesian";

export default function TranslateApp() {
  const [selectedDialect, setSelectedDialect] = useState(DIALECTS[0]);
  const [direction, setDirection] = useState<Direction>("to_dialect");
  const [inputText, setInputText] = useState("");
  const [translation, setTranslation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [charCount, setCharCount] = useState(0);

  const MAX_CHARS = 500;

  const sourceLang =
    direction === "to_dialect" ? "Bahasa Indonesia" : selectedDialect.name;
  const targetLang =
    direction === "to_dialect" ? selectedDialect.name : "Bahasa Indonesia";

  const handleTranslate = useCallback(async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setError("");
    setTranslation("");

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: inputText,
          dialect: selectedDialect.id,
          direction,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Translation failed.");
        return;
      }

      setTranslation(data.translation);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [inputText, selectedDialect, direction]);

  const handleSwap = () => {
    setDirection((prev) =>
      prev === "to_dialect" ? "to_indonesian" : "to_dialect",
    );
    setInputText(translation);
    setTranslation(inputText);
  };

  const handleInput = (val: string) => {
    if (val.length > MAX_CHARS) return;
    setInputText(val);
    setCharCount(val.length);
    setTranslation("");
    setError("");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translation);
  };

  return (
    <div className="min-h-screen bg-brand-bg pt-24 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-brand-blue-mid/10 border border-brand-blue-mid/20 rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase text-brand-blue-mid mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-blue-light animate-pulse" />
            Dialect Translator
          </div>
          <h1
            className="font-jakarta font-extrabold text-brand-text leading-tight tracking-tight mb-3"
            style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}
          >
            Translate to & from{" "}
            <span className="gradient-text">{selectedDialect.name}</span>
          </h1>
          <p className="text-brand-muted text-base max-w-md mx-auto">
            The dialects Google Translate gets wrong. Powered by AI trained on
            real native speaker patterns.
          </p>
        </div>

        {/* Dialect selector */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          {DIALECTS.map((d) => (
            <button
              key={d.id}
              onClick={() => {
                setSelectedDialect(d);
                setTranslation("");
                setError("");
              }}
              className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl border-2 transition-all cursor-pointer text-left ${
                selectedDialect.id === d.id
                  ? "border-brand-blue-mid bg-white shadow-md shadow-brand-blue-mid/10"
                  : "border-brand-border bg-white hover:border-brand-blue-mid/40"
              }`}
            >
              <span className="text-2xl">{d.flag}</span>
              <div>
                <div
                  className={`font-jakarta font-bold text-sm ${selectedDialect.id === d.id ? "text-brand-blue-mid" : "text-brand-text"}`}
                >
                  {d.name}
                </div>
                <div className="text-xs text-brand-muted">{d.region}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Translator box */}
        <div className="bg-white border border-brand-border rounded-3xl overflow-hidden shadow-sm">
          {/* Language bar */}
          <div className="flex items-center border-b border-brand-border">
            <div className="flex-1 px-6 py-4 text-sm font-bold text-brand-text text-center">
              {sourceLang}
            </div>
            <button
              onClick={handleSwap}
              className="w-12 h-12 rounded-full border border-brand-border bg-brand-bg flex items-center justify-center text-brand-muted hover:text-brand-blue-mid hover:border-brand-blue-mid transition-all cursor-pointer shrink-0 mx-2"
              title="Swap languages"
            >
              ⇄
            </button>
            <div className="flex-1 px-6 py-4 text-sm font-bold text-brand-blue-mid text-center">
              {targetLang}
            </div>
          </div>

          {/* Text areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-brand-border">
            {/* Input */}
            <div className="relative p-6">
              <textarea
                value={inputText}
                onChange={(e) => handleInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey))
                    handleTranslate();
                }}
                placeholder={`Type in ${sourceLang}...`}
                rows={7}
                className="w-full resize-none outline-none text-brand-text text-base leading-relaxed placeholder:text-brand-muted/50 bg-transparent font-dm"
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-brand-muted">
                  {charCount}/{MAX_CHARS}
                </span>
                {inputText && (
                  <button
                    onClick={() => {
                      setInputText("");
                      setTranslation("");
                      setCharCount(0);
                    }}
                    className="text-xs text-brand-muted hover:text-brand-text transition-colors bg-transparent border-none cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Output */}
            <div className="relative p-6 bg-brand-bg/50">
              {loading ? (
                <div className="flex items-center gap-3 h-full min-h-[168px]">
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-full bg-brand-blue-mid animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-brand-muted">
                    Translating...
                  </span>
                </div>
              ) : error ? (
                <p className="text-sm text-red-400 min-h-[168px]">{error}</p>
              ) : translation ? (
                <div className="min-h-[168px]">
                  <p className="text-brand-text text-base leading-relaxed font-dm whitespace-pre-wrap">
                    {translation}
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <button
                      onClick={handleCopy}
                      className="text-xs text-brand-muted hover:text-brand-blue-mid transition-colors bg-transparent border-none cursor-pointer flex items-center gap-1"
                    >
                      📋 Copy
                    </button>
                  </div>
                </div>
              ) : (
                <div className="min-h-[168px] flex items-center justify-center">
                  <p className="text-sm text-brand-muted/50 text-center">
                    Translation will appear here
                    <br />
                    <span className="text-xs">
                      Try: "{selectedDialect.example}"
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Translate button */}
          <div className="px-6 py-4 border-t border-brand-border flex items-center justify-between">
            <p className="text-xs text-brand-muted hidden sm:block">
              Press{" "}
              <kbd className="bg-brand-bg border border-brand-border rounded px-1.5 py-0.5 text-xs">
                ⌘ Enter
              </kbd>{" "}
              to translate
            </p>
            <button
              onClick={handleTranslate}
              disabled={loading || !inputText.trim()}
              className="ml-auto bg-brand-grad text-white px-8 py-3 rounded-xl text-sm font-semibold border-none cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-brand-blue-mid/20"
            >
              {loading ? "Translating..." : `Translate →`}
            </button>
          </div>
        </div>

        {/* Dialect info card */}
        <div className="mt-6 bg-white border border-brand-border rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="text-3xl">{selectedDialect.flag}</div>
          <div className="flex-1">
            <div className="font-jakarta font-bold text-brand-text text-sm mb-0.5">
              {selectedDialect.name}{" "}
              <span className="text-brand-muted font-normal">
                ({selectedDialect.local})
              </span>
            </div>
            <div className="text-xs text-brand-muted">
              Spoken in {selectedDialect.region}, Indonesia. One of the dialects
              AI has historically struggled with most.
            </div>
          </div>
          <a
            href="/contribute"
            className="text-xs font-semibold text-brand-blue-mid hover:underline whitespace-nowrap"
          >
            Help improve this →
          </a>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-xs text-brand-muted mt-6 leading-relaxed">
          Translations are AI-generated and may not be perfect. Native speaker
          verification is in progress.
          <a
            href="/contribute"
            className="text-brand-blue-mid ml-1 hover:underline"
          >
            Help us improve.
          </a>
        </p>
      </div>
    </div>
  );
}
