"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import LogoIcon from "./LogoIcon";

type Translation = {
  id: string;
  translated_text: string;
  verified: boolean;
  quality_score: number | null;
  notes: string | null;
  created_at: string;
  sentences: {
    source_text: string;
    domain: string;
    languages: { name: string; code: string };
  };
  languages: { name: string; code: string };
  contributors: { name: string; email: string; region: string } | null;
};

type Stats = {
  total_translations: number;
  verified_translations: number;
  total_contributors: number;
  total_sentences: number;
};

const PIN = "dialectify2026"; // simple PIN — replace with proper auth later

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);

  const [translations, setTranslations] = useState<Translation[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [filter, setFilter] = useState<"all" | "unverified" | "verified">(
    "unverified",
  );
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);

  const handleLogin = () => {
    if (pin === PIN) {
      setAuthed(true);
      setPinError(false);
    } else setPinError(true);
  };

  const fetchStats = useCallback(async () => {
    const [t, v, c, s] = await Promise.all([
      supabase
        .from("translations")
        .select("id", { count: "exact", head: true }),
      supabase
        .from("translations")
        .select("id", { count: "exact", head: true })
        .eq("verified", true),
      supabase
        .from("contributors")
        .select("id", { count: "exact", head: true }),
      supabase.from("sentences").select("id", { count: "exact", head: true }),
    ]);
    setStats({
      total_translations: t.count ?? 0,
      verified_translations: v.count ?? 0,
      total_contributors: c.count ?? 0,
      total_sentences: s.count ?? 0,
    });
  }, []);

  const fetchTranslations = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("translations")
      .select(
        `
        id, translated_text, verified, quality_score, notes, created_at,
        sentences ( source_text, domain, languages ( name, code ) ),
        languages ( name, code ),
        contributors ( name, email, region )
      `,
      )
      .order("created_at", { ascending: false })
      .limit(100);

    if (filter === "unverified") query = query.eq("verified", false);
    if (filter === "verified") query = query.eq("verified", true);

    const { data, error } = await query;
    if (!error && data) setTranslations(data as unknown as Translation[]);
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    if (authed) {
      fetchStats();
      fetchTranslations();
    }
  }, [authed, fetchStats, fetchTranslations]);

  const verify = async (id: string, quality: number, notes: string) => {
    setSaving(id);
    await supabase
      .from("translations")
      .update({ verified: true, quality_score: quality, notes })
      .eq("id", id);
    await fetchTranslations();
    await fetchStats();
    setSaving(null);
  };

  const reject = async (id: string) => {
    setSaving(id);
    await supabase.from("translations").delete().eq("id", id);
    await fetchTranslations();
    await fetchStats();
    setSaving(null);
  };

  // LOGIN SCREEN
  if (!authed) {
    return (
      <div className="min-h-screen bg-brand-bg-dark flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl p-10 w-full max-w-sm text-center shadow-xl">
          <div className="flex justify-center mb-5">
            <LogoIcon size={40} />
          </div>
          <h1 className="font-jakarta font-extrabold text-brand-text text-xl mb-1">
            Admin Access
          </h1>
          <p className="text-brand-muted text-sm mb-7">
            Enter your PIN to continue
          </p>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Enter PIN"
            className={`w-full px-4 py-3 rounded-xl border text-sm text-center tracking-widest outline-none mb-3 transition-colors ${pinError ? "border-red-400" : "border-brand-border focus:border-brand-blue-mid"}`}
          />
          {pinError && (
            <p className="text-xs text-red-500 mb-3">Incorrect PIN</p>
          )}
          <button
            onClick={handleLogin}
            className="w-full bg-brand-grad text-white py-3 rounded-xl text-sm font-semibold border-none cursor-pointer hover:opacity-90"
          >
            Enter
          </button>
        </div>
      </div>
    );
  }

  // DASHBOARD
  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Top bar */}
      <div className="bg-white border-b border-brand-border px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <LogoIcon size={28} />
          <span className="font-jakarta font-bold text-brand-text">
            dialectify<span className="text-brand-blue-mid">.ai</span>{" "}
            <span className="text-brand-muted font-normal text-sm">
              / admin
            </span>
          </span>
        </div>
        <button
          onClick={() => setAuthed(false)}
          className="text-xs text-brand-muted hover:text-brand-text transition-colors bg-transparent border-none cursor-pointer"
        >
          Sign out
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { label: "Total Pairs", value: stats.total_translations },
              { label: "Verified", value: stats.verified_translations },
              { label: "Contributors", value: stats.total_contributors },
              { label: "Source Sentences", value: stats.total_sentences },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white border border-brand-border rounded-2xl px-6 py-5"
              >
                <div className="font-jakarta font-extrabold text-3xl gradient-text leading-none mb-1">
                  {s.value}
                </div>
                <div className="text-xs font-semibold uppercase tracking-widest text-brand-muted">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {(["unverified", "all", "verified"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors border-none cursor-pointer capitalize ${
                filter === f
                  ? "bg-brand-grad text-white"
                  : "bg-white border border-brand-border text-brand-muted hover:text-brand-text"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Translations list */}
        {loading ? (
          <div className="text-center py-20 text-brand-muted">Loading...</div>
        ) : translations.length === 0 ? (
          <div className="text-center py-20 text-brand-muted">
            No submissions yet.
          </div>
        ) : (
          <div className="space-y-4">
            {translations.map((t) => (
              <TranslationCard
                key={t.id}
                translation={t}
                saving={saving === t.id}
                onVerify={verify}
                onReject={reject}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TranslationCard({
  translation: t,
  saving,
  onVerify,
  onReject,
}: {
  translation: Translation;
  saving: boolean;
  onVerify: (id: string, quality: number, notes: string) => void;
  onReject: (id: string) => void;
}) {
  const [quality, setQuality] = useState(t.quality_score ?? 4);
  const [notes, setNotes] = useState(t.notes ?? "");

  const src = t.sentences as unknown as {
    source_text: string;
    domain: string;
    languages: { name: string };
  };

  return (
    <div
      className={`bg-white border rounded-2xl p-6 ${t.verified ? "border-green-200 bg-green-50/30" : "border-brand-border"}`}
    >
      <div className="flex flex-col md:flex-row md:items-start gap-6">
        {/* Pair */}
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            <span className="bg-brand-blue-mid/10 text-brand-blue-mid px-2.5 py-1 rounded-full">
              {src?.languages?.name ?? "Indonesian"}
            </span>
            <span className="bg-brand-bg text-brand-muted border border-brand-border px-2.5 py-1 rounded-full">
              {src?.domain ?? "casual"}
            </span>
            {t.verified && (
              <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
                ✓ Verified {t.quality_score}/5
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-brand-bg rounded-xl px-4 py-3">
              <div className="text-xs font-semibold text-brand-muted mb-1 uppercase tracking-wide">
                Source
              </div>
              <p className="text-sm text-brand-text">{src?.source_text}</p>
            </div>
            <div className="bg-brand-blue-mid/5 rounded-xl px-4 py-3">
              <div className="text-xs font-semibold text-brand-blue-mid mb-1 uppercase tracking-wide">
                {(t.languages as unknown as { name: string })?.name}
              </div>
              <p className="text-sm text-brand-text">{t.translated_text}</p>
            </div>
          </div>
          {t.contributors && (
            <p className="text-xs text-brand-muted">
              By {t.contributors.name || "Anonymous"} · {t.contributors.email} ·{" "}
              {t.contributors.region || "Unknown region"}
            </p>
          )}
        </div>

        {/* Actions */}
        {!t.verified && (
          <div className="flex flex-col gap-3 min-w-[180px]">
            <div>
              <label className="text-xs font-semibold text-brand-muted uppercase tracking-wide block mb-1">
                Quality (1-5)
              </label>
              <select
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-brand-border text-sm bg-brand-bg outline-none"
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n} — {["", "Poor", "Fair", "Good", "Great", "Native"][n]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-brand-muted uppercase tracking-wide block mb-1">
                Notes
              </label>
              <input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional reviewer note"
                className="w-full px-3 py-2 rounded-lg border border-brand-border text-sm bg-brand-bg outline-none"
              />
            </div>
            <button
              onClick={() => onVerify(t.id, quality, notes)}
              disabled={saving}
              className="w-full bg-brand-grad text-white py-2.5 rounded-lg text-sm font-semibold border-none cursor-pointer hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "Saving..." : "✓ Verify"}
            </button>
            <button
              onClick={() => onReject(t.id)}
              disabled={saving}
              className="w-full bg-transparent border border-red-200 text-red-500 py-2.5 rounded-lg text-sm font-semibold cursor-pointer hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              ✕ Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
