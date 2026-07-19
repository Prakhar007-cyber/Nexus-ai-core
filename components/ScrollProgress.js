"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ScrollProgress() {
  const barRef = useRef(null);

  useEffect(() => {
    const bar = barRef.current;

    const ctx = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.2,
        onUpdate: (self) => {
          bar.style.transform = `scaleX(${self.progress})`;
        },
      });

      return () => trigger.kill();
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="pointer-events-none fixed top-0 left-0 right-0 z-[60] h-[2px] bg-white/5">
      <div
        ref={barRef}
        className="h-full w-full origin-left bg-nexus-cyan"
        style={{ transform: "scaleX(0)", boxShadow: "0 0 12px rgba(79,232,255,0.7)" }}
      />
    </div>
  );
}
