"use client";

import { useState } from "react";
import { useReveal } from "./useReveal";

type Status = "idle" | "loading" | "success" | "duplicate" | "error";

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const ref = useReveal();

  const messages: Record<Status, string | null> = {
    idle: null,
    loading: null,
    success: "✓ You're on the list. We'll be in touch soon.",
    duplicate: "✓ You're already on the waitlist — we'll be in touch!",
    error: "Something went wrong. Please try again.",
  };

  const handleSubmit = async () => {
    if (!email || !email.includes("@")) {
      setStatus("error");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.status === 409) {
        setStatus("duplicate");
        setEmail("");
      } else if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        console.error(data.error);
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const isError = status === "error";
  const isSuccess = status === "success" || status === "duplicate";
  const isLoading = status === "loading";
  const message = messages[status];

  return (
    <section id="waitlist" className="bg-white py-24 px-6">
      <div ref={ref} className="reveal max-w-lg mx-auto text-center">
        <p className="text-xs font-bold tracking-widest uppercase text-brand-blue-mid mb-4">
          Early Access
        </p>
        <h2
          className="font-jakarta font-extrabold text-brand-text leading-tight tracking-tight mb-4"
          style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)" }}
        >
          Be first to build on Dialectify.ai
        </h2>
        <p className="text-brand-muted leading-relaxed mb-9">
          We&apos;re onboarding early partners — developers, researchers, and
          organizations who want to build for underserved language communities.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === "error") setStatus("idle");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="your@email.com"
            disabled={isLoading || isSuccess}
            className={`flex-1 px-5 py-3.5 rounded-xl border text-sm font-dm text-brand-text bg-brand-bg outline-none transition-colors disabled:opacity-50 ${
              isError
                ? "border-red-400 focus:border-red-400"
                : "border-brand-border focus:border-brand-blue-mid"
            }`}
          />
          <button
            onClick={handleSubmit}
            disabled={isLoading || isSuccess}
            className="bg-brand-grad text-white px-6 py-3.5 rounded-xl text-sm font-semibold shadow-md shadow-brand-blue-mid/25 hover:opacity-90 transition-opacity border-none cursor-pointer whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? "Submitting..." : "Request Access"}
          </button>
        </div>

        {message && (
          <p
            className={`mt-4 text-sm font-medium ${
              isError ? "text-red-500" : "text-brand-blue-mid"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </section>
  );
}
