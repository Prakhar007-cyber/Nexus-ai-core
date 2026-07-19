"use client";

import { useLenis } from "./SmoothScroll";

const NAVIGATE = [
  { label: "Technology", target: "#technology" },
  { label: "Architecture", target: "#architecture" },
  { label: "Intelligence", target: "#intelligence" },
];

const SYSTEM_SPECS = [
  { label: "Architecture", value: "Neural Fabric" },
  { label: "Cores", value: "128 Threads" },
  { label: "Fabrication", value: "2nm Process" },
  { label: "Inference", value: "< 1ms Latency" },
];

const CONNECT = ["X", "GitHub", "LinkedIn"];

export default function Footer() {
  const lenisRef = useLenis();

  const goTo = (e) => {
    e.preventDefault();
    const selector = e.currentTarget.getAttribute("href");
    const el = document.querySelector(selector);
    if (!el) return;
    const lenis = lenisRef?.current;
    if (lenis) {
      lenis.scrollTo(el, { duration: 1.4, offset: 0 });
    } else {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer id="final" className="relative bg-nexus-black">
      <div className="mx-auto max-w-[1600px] px-6 pt-24 pb-10 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 gap-14 border-b border-white/10 pb-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="font-display text-2xl font-semibold tracking-tight text-nexus-white">
              NEXUS <span className="text-nexus-cyan">AI CORE</span>
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-nexus-white-dim">
              A new architecture built to process intelligence at unprecedented
              scale. Engineered for what comes next.
            </p>
            <a
              href="#top"
              onClick={goTo}
              className="font-mono-wide group mt-8 inline-flex items-center gap-2 text-[11px] text-nexus-cyan"
            >
              Back to top
              <span className="inline-block -translate-y-px transition-transform group-hover:-translate-y-1">
                ↑
              </span>
            </a>
          </div>

          <div>
            <p className="font-mono-wide mb-5 text-[10px] text-nexus-white-dim/70">Navigate</p>
            <ul className="space-y-3">
              {NAVIGATE.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.target}
                    onClick={goTo}
                    className="text-sm text-nexus-white-dim transition-colors hover:text-nexus-cyan"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono-wide mb-5 text-[10px] text-nexus-white-dim/70">System</p>
            <ul className="space-y-3">
              {SYSTEM_SPECS.map((spec) => (
                <li key={spec.label} className="flex flex-col text-sm">
                  <span className="text-nexus-white-dim">{spec.label}</span>
                  <span className="font-mono-wide text-[10px] text-nexus-white/80">
                    {spec.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono-wide mb-5 text-[10px] text-nexus-white-dim/70">Connect</p>
            <ul className="space-y-3">
              {CONNECT.map((label) => (
                <li key={label}>
                  <a
                    href="#"
                    className="text-sm text-nexus-white-dim transition-colors hover:text-nexus-cyan"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-8 text-center md:flex-row md:text-left">
          <p className="font-mono-wide text-[10px] text-nexus-white-dim/70">
            © {new Date().getFullYear()} NEXUS COMPUTING. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="font-mono-wide text-[10px] text-nexus-white-dim/70 transition-colors hover:text-nexus-cyan"
            >
              Privacy
            </a>
            <a
              href="#"
              className="font-mono-wide text-[10px] text-nexus-white-dim/70 transition-colors hover:text-nexus-cyan"
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
