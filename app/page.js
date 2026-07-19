import SmoothScroll from "@/components/SmoothScroll";
import ScrollProgress from "@/components/ScrollProgress";
import Nav from "@/components/Nav";
import CinematicReel from "@/components/CinematicReel";
import Footer from "@/components/Footer";

// Callout coordinates are hand-placed against the source frame (1280x720)
// at the point in the reel where the part is fully separated and settled —
// see CinematicReel's updateCalloutPositions for how (x, y) maps onto the
// cropped, cover-fit canvas at any viewport ratio.
const TECHNOLOGY_CALLOUTS = [
  {
    label: "MACHINED CHASSIS",
    sub: "Aerospace-grade unibody",
    x: 680,
    y: 185,
    side: "right",
    band: { start: 0.8, end: 1, fadeIn: 0.05, fadeOut: 0 },
  },
  {
    label: "FRONT GLASS PANEL",
    sub: "Optical-grade shielding",
    x: 255,
    y: 300,
    side: "left",
    band: { start: 0.83, end: 1, fadeIn: 0.05, fadeOut: 0 },
  },
  {
    label: "THERMAL ARRAY",
    sub: "Precision-milled cooling fins",
    x: 412,
    y: 380,
    side: "left",
    band: { start: 0.86, end: 1, fadeIn: 0.05, fadeOut: 0 },
  },
  {
    label: "COPPER HEAT SPREADER",
    sub: "Direct-contact thermal transfer",
    x: 905,
    y: 420,
    side: "right",
    band: { start: 0.89, end: 1, fadeIn: 0.05, fadeOut: 0 },
  },
  {
    label: "AI CORE",
    sub: "Neural processing unit",
    x: 615,
    y: 340,
    side: "right",
    band: { start: 0.92, end: 1, fadeIn: 0.05, fadeOut: 0 },
  },
];

const ARCHITECTURE_CALLOUTS = [
  {
    label: "AI CORE",
    sub: "Central neural die",
    x: 645,
    y: 355,
    side: "right",
    band: { start: 0.1, end: 0.24, fadeIn: 0.04, fadeOut: 0.05 },
  },
  {
    label: "THERMAL MODULE",
    sub: "Left interconnect array",
    x: 285,
    y: 360,
    side: "left",
    band: { start: 0.13, end: 0.24, fadeIn: 0.04, fadeOut: 0.05 },
  },
  {
    label: "THERMAL MODULE",
    sub: "Right interconnect array",
    x: 1000,
    y: 360,
    side: "right",
    band: { start: 0.16, end: 0.24, fadeIn: 0.04, fadeOut: 0.05 },
  },
];

export default function Home() {
  return (
    <SmoothScroll>
      <ScrollProgress />
      <Nav />
      <main id="top">
        <CinematicReel
          id="technology"
          ariaLabel="NEXUS AI Core — the processor, assembled and revealed"
          frameFolder="/frames/section-1"
          frameCount={240}
          scrollVh={{ base: 6, mobile: 3.8 }}
          heroEntrance
          index="01"
          total="03"
          eyebrow="NEXUS COMPUTING"
          heading={["INTELLIGENCE.", "ENGINEERED."]}
          sub="A new architecture built to process intelligence at unprecedented scale."
          textBand={{ start: 0, end: 0.1, fadeOut: 0.12 }}
          videoBand={{ start: 0.04, end: 0.94 }}
          callouts={TECHNOLOGY_CALLOUTS}
        />

        <CinematicReel
          id="architecture"
          ariaLabel="Inside the intelligence — the neural architecture at the core"
          frameFolder="/frames/section-2"
          frameCount={240}
          scrollVh={{ base: 5.5, mobile: 3.6 }}
          index="02"
          total="03"
          eyebrow="NEURAL ARCHITECTURE"
          heading={["THINKING", "AT SCALE."]}
          sub="Billions of connections. Millions of signals. One intelligent architecture."
          textBand={{ start: 0.3, end: 0.55, fadeIn: 0.08, fadeOut: 0.1 }}
          videoBand={{ start: 0.03, end: 0.92 }}
          callouts={ARCHITECTURE_CALLOUTS}
        />

        <CinematicReel
          id="intelligence"
          ariaLabel="Data becomes intelligence — real-time signal processing"
          frameFolder="/frames/section-3"
          frameCount={240}
          scrollVh={{ base: 6.5, mobile: 4.2 }}
          index="03"
          total="03"
          eyebrow="REAL-TIME INTELLIGENCE"
          heading={["FROM SIGNAL", "TO INSIGHT."]}
          sub="Transforming millions of simultaneous data points into structured intelligence in real time."
          textBand={{ start: 0.12, end: 0.35, fadeIn: 0.06, fadeOut: 0.1 }}
          videoBand={{ start: 0.03, end: 0.75 }}
          endReveal={{
            band: { start: 0.82, end: 1, fadeIn: 0.1, fadeOut: 0 },
            heading: ["THE FUTURE", "THINKS FASTER."],
            cta: "Explore NEXUS",
          }}
        />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
