"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "./SmoothScroll";
import Callout from "./Callout";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function bandOpacity(progress, start, end, fadeIn = 0.06, fadeOut = 0.06) {
  if (progress < start - fadeIn || progress > end + fadeOut) return 0;
  if (progress < start) return gsap.utils.mapRange(start - fadeIn, start, 0, 1, progress);
  if (progress > end) return gsap.utils.mapRange(end, end + fadeOut, 1, 0, progress);
  return 1;
}

export default function CinematicReel({
  id,
  ariaLabel,
  frameFolder,
  frameCount,
  scrollVh = { base: 6, mobile: 3.8 },
  heroEntrance = false,
  index,
  total,
  eyebrow,
  heading,
  sub,
  textBand,
  videoBand = { start: 0.03, end: 0.94 },
  endReveal,
  callouts = [],
}) {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const loaderRef = useRef(null);
  const loaderTextRef = useRef(null);
  const captionRef = useRef(null);
  const endCaptionRef = useRef(null);
  const calloutEls = useRef([]);
  const calloutCropVisible = useRef([]);
  const lenisRef = useLenis();

  const framePath = (i) => `${frameFolder}/ezgif-frame-${String(i + 1).padStart(3, "0")}.jpg`;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const section = sectionRef.current;

    const images = new Array(frameCount);
    const loaded = new Array(frameCount).fill(false);
    let loadedCount = 0;
    const state = { frame: 0 };

    function nearestLoadedFrame(index) {
      if (loaded[index]) return images[index];
      for (let d = 1; d < frameCount; d++) {
        const back = index - d;
        const fwd = index + d;
        if (back >= 0 && loaded[back]) return images[back];
        if (fwd < frameCount && loaded[fwd]) return images[fwd];
      }
      return null;
    }

    function drawCover(img) {
      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      if (!iw || !ih) return;
      const canvasRatio = cw / ch;
      const imgRatio = iw / ih;
      let sx, sy, sw, sh;
      if (imgRatio > canvasRatio) {
        sh = ih;
        sw = ih * canvasRatio;
        sx = (iw - sw) / 2;
        sy = 0;
      } else {
        sw = iw;
        sh = iw / canvasRatio;
        sx = 0;
        sy = (ih - sh) / 2;
      }
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
    }

    function render() {
      const idx = Math.max(0, Math.min(frameCount - 1, Math.round(state.frame)));
      const img = loaded[idx] ? images[idx] : nearestLoadedFrame(idx);
      if (!img) return;
      drawCover(img);
    }

    function resizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      render();
      updateCalloutPositions();
    }

    // Callout coordinates are authored against the source frame (1280x720).
    // The canvas renders with object-fit: cover, so depending on the
    // viewport's aspect ratio the source gets cropped left/right or
    // top/bottom — recompute the same crop rect drawCover() uses and map
    // each callout's source point through it, hiding any point that lands
    // outside the visible crop (e.g. on a narrow mobile viewport).
    function updateCalloutPositions() {
      if (!callouts.length) return;
      const iw = 1280;
      const ih = 720;
      const cw = window.innerWidth;
      const ch = window.innerHeight;
      const canvasRatio = cw / ch;
      const imgRatio = iw / ih;
      let sx, sy, sw, sh;
      if (imgRatio > canvasRatio) {
        sh = ih;
        sw = ih * canvasRatio;
        sx = (iw - sw) / 2;
        sy = 0;
      } else {
        sw = iw;
        sh = iw / canvasRatio;
        sx = 0;
        sy = (ih - sh) / 2;
      }

      callouts.forEach((c, i) => {
        const leftPct = ((c.x - sx) / sw) * 100;
        const topPct = ((c.y - sy) / sh) * 100;
        const el = calloutEls.current[i];
        if (el) {
          el.style.left = `${leftPct}%`;
          el.style.top = `${topPct}%`;
        }
        calloutCropVisible.current[i] = leftPct > 2 && leftPct < 98 && topPct > 4 && topPct < 96;
      });
    }

    function onFrameSettled(index) {
      if (!loaded[index]) {
        loaded[index] = true;
        loadedCount++;
      }
      const pct = Math.round((loadedCount / frameCount) * 100);
      if (loaderTextRef.current) loaderTextRef.current.textContent = `${pct}%`;

      if (loadedCount === 1) render();
      if (loadedCount === frameCount) {
        loaderRef.current?.classList.add("opacity-0");
      }
    }

    function preloadFrames() {
      for (let i = 0; i < frameCount; i++) {
        const img = new window.Image();
        img.decoding = "async";
        img.onload = () => onFrameSettled(i);
        img.onerror = () => onFrameSettled(i);
        img.src = framePath(i);
        images[i] = img;
      }
    }

    function getScrollLength() {
      const isMobile = window.innerWidth < 768;
      const multiplier = isMobile ? scrollVh.mobile : scrollVh.base;
      return window.innerHeight * multiplier;
    }

    const ctxGsap = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => "+=" + Math.round(getScrollLength()),
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;

          const vp = gsap.utils.clamp(
            0,
            1,
            (p - videoBand.start) / (videoBand.end - videoBand.start)
          );
          state.frame = vp * (frameCount - 1);
          render();

          if (captionRef.current && textBand) {
            const op = bandOpacity(
              p,
              textBand.start,
              textBand.end,
              heroEntrance ? 0 : textBand.fadeIn ?? 0.08,
              textBand.fadeOut ?? 0.1
            );
            captionRef.current.style.opacity = op;
            captionRef.current.style.transform = `translateY(${(1 - op) * 18}px)`;
          }

          if (endCaptionRef.current && endReveal) {
            const op = bandOpacity(
              p,
              endReveal.band.start,
              endReveal.band.end,
              endReveal.band.fadeIn ?? 0.1,
              endReveal.band.fadeOut ?? 0
            );
            endCaptionRef.current.style.opacity = op;
            endCaptionRef.current.style.transform = `translateY(${(1 - op) * 14}px)`;
          }

          callouts.forEach((c, i) => {
            const el = calloutEls.current[i];
            if (!el) return;
            const band = c.band;
            let op = bandOpacity(p, band.start, band.end, band.fadeIn ?? 0.06, band.fadeOut ?? 0.06);
            if (!calloutCropVisible.current[i]) op = 0;
            el.style.opacity = op;
            el.style.transform = `translateY(${(1 - op) * 6}px) scale(${0.9 + op * 0.1})`;
          });
        },
      });

      let resizeTimer;
      const onResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          resizeCanvas();
          ScrollTrigger.refresh();
        }, 150);
      };
      window.addEventListener("resize", onResize);

      resizeCanvas();

      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              preloadFrames();
              io.disconnect();
            }
          });
        },
        { rootMargin: "150% 0px 150% 0px" }
      );
      io.observe(section);

      return () => {
        window.removeEventListener("resize", onResize);
        clearTimeout(resizeTimer);
        io.disconnect();
        trigger.kill();
      };
    }, section);

    return () => ctxGsap.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameFolder, frameCount]);

  const scrollToTop = (e) => {
    e.preventDefault();
    const lenis = lenisRef?.current;
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.6 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const HeadingTag = heroEntrance ? "h1" : "h2";

  const captionInner = (
    <div className="max-w-xl">
      <div className="mb-4 flex items-center gap-3">
        {index && (
          <span className="font-mono-wide text-[11px] text-nexus-white-dim/70">
            {index}/{total}
          </span>
        )}
        <p className="font-mono-wide text-[11px] text-nexus-cyan md:text-xs">{eyebrow}</p>
      </div>
      <HeadingTag className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-nexus-white sm:text-5xl md:text-6xl lg:text-7xl">
        {heading.map((line, i) => (
          <span className="block" key={i}>
            {line}
          </span>
        ))}
      </HeadingTag>
      <p className="mt-5 max-w-md text-sm text-nexus-white-dim md:text-base">{sub}</p>
    </div>
  );

  return (
    <section
      id={id}
      ref={sectionRef}
      aria-label={ariaLabel}
      className="relative h-screen w-full overflow-hidden bg-nexus-black"
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      <div
        ref={loaderRef}
        className="pointer-events-none absolute bottom-6 right-6 z-10 flex items-center gap-2 font-mono-wide text-[10px] text-nexus-white-dim transition-opacity duration-700 md:bottom-8 md:right-8"
      >
        <span className="inline-block h-1 w-1 animate-pulse rounded-full bg-nexus-cyan" />
        <span ref={loaderTextRef}>0%</span>
      </div>

      <div
        ref={captionRef}
        className="pointer-events-none absolute inset-0 flex items-end"
        style={{ opacity: heroEntrance ? 1 : 0 }}
      >
        <div className="absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
        <div className="relative w-full px-6 pb-20 sm:px-10 md:px-16 md:pb-28 lg:px-24">
          {heroEntrance ? (
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              {captionInner}
            </motion.div>
          ) : (
            captionInner
          )}
        </div>
      </div>

      {endReveal && (
        <div
          ref={endCaptionRef}
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-end text-center"
          style={{ opacity: 0 }}
        >
          <div className="absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-black/90 via-black/45 to-transparent" />
          <div className="relative px-6 pb-20 sm:pb-24 md:pb-28">
            <h2 className="font-display text-glow text-4xl font-bold leading-[1.05] tracking-tight text-nexus-white sm:text-5xl md:text-7xl lg:text-8xl">
              {endReveal.heading.map((line, i) => (
                <span className="block" key={i}>
                  {line}
                </span>
              ))}
            </h2>
            {endReveal.cta && (
              <a
                href="#top"
                onClick={scrollToTop}
                className="pointer-events-auto group mt-10 inline-flex items-center gap-3 rounded-full border border-nexus-cyan/40 px-6 py-3 font-mono-wide text-xs text-nexus-cyan transition-colors hover:bg-nexus-cyan hover:text-nexus-black md:text-sm"
              >
                {endReveal.cta}
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            )}
          </div>
        </div>
      )}

      {callouts.map((c, i) => (
        <Callout
          key={`${c.label}-${i}`}
          calloutRef={(el) => (calloutEls.current[i] = el)}
          x={c.x}
          y={c.y}
          side={c.side}
          label={c.label}
          sub={c.sub}
        />
      ))}
    </section>
  );
}
