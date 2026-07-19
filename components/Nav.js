"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useLenis } from "./SmoothScroll";

const LINKS = [
  { label: "Technology", target: "#technology" },
  { label: "Architecture", target: "#architecture" },
  { label: "Intelligence", target: "#intelligence" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastYRef = useRef(0);
  const lenisRef = useLenis();

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 40);

        if (y < 16) {
          setHidden(false);
        } else if (y > lastYRef.current + 4) {
          setHidden(true); // scrolling down — get out of the way
        } else if (y < lastYRef.current - 4) {
          setHidden(false); // scrolling up — hand navigation back
        }
        lastYRef.current = y;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-[transform,background-color,border-color] duration-500 ease-out ${
        hidden ? "-translate-y-full" : "translate-y-0"
      } ${
        scrolled
          ? "bg-nexus-black/70 backdrop-blur-md border-b border-white/10"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <motion.nav
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 md:px-10"
      >
        <a
          href="#top"
          onClick={goTo}
          className="font-mono-wide text-xs font-medium text-nexus-white md:text-sm"
        >
          NEXUS
        </a>

        <ul className="hidden items-center gap-10 md:flex">
          {LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.target}
                onClick={goTo}
                className="font-mono-wide text-[11px] text-nexus-white-dim transition-colors hover:text-nexus-cyan"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#final"
          onClick={goTo}
          className="group relative inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 font-mono-wide text-[11px] text-nexus-white transition-colors hover:border-nexus-cyan hover:text-nexus-cyan md:px-5"
        >
          Explore
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-nexus-cyan transition-transform group-hover:translate-x-0.5" />
        </a>
      </motion.nav>
    </header>
  );
}
