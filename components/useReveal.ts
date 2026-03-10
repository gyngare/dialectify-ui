"use client";

import { useEffect, useRef } from "react";

export function useReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Small delay ensures DOM is fully painted before observing
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            el.classList.add("visible");
            observer.unobserve(el);
          }
        },
        { threshold: 0.05, rootMargin: "0px 0px 0px 0px" },
      );

      observer.observe(el);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return ref;
}
