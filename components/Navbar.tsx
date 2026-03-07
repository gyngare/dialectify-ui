"use client";

import { useState, useEffect } from "react";
import LogoIcon from "./LogoIcon";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-4 flex items-center justify-between transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl shadow-sm border-b border-brand-border"
          : "bg-brand-bg/80 backdrop-blur-sm"
      }`}
    >
      {/* Logo */}
      <a href="#" className="flex items-center gap-2.5 no-underline">
        <LogoIcon size={32} />
        <span className="font-jakarta font-bold text-lg text-brand-blue-dark">
          dialectify<span className="text-brand-blue-mid">.ai</span>
        </span>
      </a>

      {/* Desktop nav */}
      <ul className="hidden md:flex items-center gap-8 list-none">
        {["how", "usecases", "mission"].map((id) => (
          <li key={id}>
            <button
              onClick={() => scrollTo(id)}
              className="text-brand-muted text-sm font-medium hover:text-brand-blue-mid transition-colors capitalize bg-transparent border-none cursor-pointer"
            >
              {id === "usecases" ? "Use Cases" : id === "how" ? "How It Works" : "Mission"}
            </button>
          </li>
        ))}
        <li>
          <button
            onClick={() => scrollTo("waitlist")}
            className="bg-brand-grad text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity border-none cursor-pointer"
          >
            Join Waitlist
          </button>
        </li>
      </ul>

      {/* Mobile hamburger */}
      <button
        className="md:hidden flex flex-col gap-1.5 bg-transparent border-none cursor-pointer p-1"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span className={`block w-6 h-0.5 bg-brand-text transition-transform duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
        <span className={`block w-6 h-0.5 bg-brand-text transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`} />
        <span className={`block w-6 h-0.5 bg-brand-text transition-transform duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-brand-border shadow-lg md:hidden">
          <div className="flex flex-col p-6 gap-4">
            {["how", "usecases", "mission"].map((id) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="text-brand-muted text-sm font-medium text-left bg-transparent border-none cursor-pointer hover:text-brand-blue-mid transition-colors"
              >
                {id === "usecases" ? "Use Cases" : id === "how" ? "How It Works" : "Mission"}
              </button>
            ))}
            <button
              onClick={() => scrollTo("waitlist")}
              className="bg-brand-grad text-white px-5 py-3 rounded-lg text-sm font-semibold border-none cursor-pointer text-center"
            >
              Join Waitlist
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
