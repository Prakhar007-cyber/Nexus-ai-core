// A single exploded-diagram annotation: a pulsing marker anchored at an exact
// (x%, y%) point, with a leader line + label extending left or right so it
// never has to guess which way to grow.
export default function Callout({ calloutRef, x, y, side = "right", label, sub }) {
  const isLeft = side === "left";

  return (
    <div
      ref={calloutRef}
      className="pointer-events-none absolute hidden md:block"
      style={{ left: `${x}%`, top: `${y}%`, opacity: 0 }}
    >
      <span className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2">
        <span className="absolute inset-0 animate-ping rounded-full bg-nexus-cyan/50" />
        <span className="relative block h-1.5 w-1.5 rounded-full bg-nexus-cyan shadow-[0_0_10px_rgba(79,232,255,0.9)]" />
      </span>

      <div
        className={`absolute top-0 -translate-y-1/2 whitespace-nowrap ${
          isLeft ? "right-4 text-right" : "left-4 text-left"
        }`}
      >
        <div
          className="inline-flex items-center gap-2"
          style={{ flexDirection: isLeft ? "row-reverse" : "row" }}
        >
          <span className="h-px w-5 bg-nexus-cyan/40 md:w-8" />
          <div className="rounded-sm border border-white/10 bg-black/60 px-2.5 py-1.5 backdrop-blur-sm">
            <p className="font-mono-wide text-[9px] text-nexus-cyan md:text-[10px]">{label}</p>
            {sub && (
              <p className="mt-0.5 text-[10px] text-nexus-white-dim md:text-[11px]">{sub}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
