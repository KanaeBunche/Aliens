import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Decrypt from "./Decrypt";
// OTHER LIFE — "Observed Signals". Cards are smaller + semi-transparent so the
// morphing attractor/Mars stays visible behind them (an observation window over
// the live signal). Fixed images.unsplash.com CDN URLs.
const cards = [
  {
    id: "OL-01",
    label: "OBSERVED / DEEP FIELD",
    title: "Carrier Drift",
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1600&auto=format&fit=crop",
    left: "A STEADY TONE FROM AN EMPTY QUADRANT.",
    right: "NO SOURCE. NO DECAY. STILL TRANSMITTING.",
  },
  {
    id: "OL-02",
    label: "OBSERVED / BURST EVENT",
    title: "Signal Bloom",
    image: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?q=80&w=1600&auto=format&fit=crop",
    left: "MILLISECONDS OF STRUCTURE INSIDE THE NOISE.",
    right: "REPEATS ON NO PATTERN WE CAN HOLD.",
  },
  {
    id: "OL-03",
    label: "OBSERVED / RESOLUTION",
    title: "The Source",
    image: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=1600&auto=format&fit=crop",
    left: "THE SIGNAL COLLAPSES INTO A SHAPE.",
    right: "IT WAS NEVER NOISE. IT WAS A WORLD.",
  },
];

function Card({ card }) {
  return (
    <article className="h-[440px] w-[min(60vw,560px)] border border-[#1c2a26]/70 bg-[#0b0f0e]/55 backdrop-blur-md text-cream p-6">
      <div className="mb-4 flex justify-between font-mono text-[12px] uppercase tracking-wider text-[#7fe9c4]">
        <span>{card.id}</span>
        <span>{card.label}</span>
      </div>

      <div className="mb-6 h-[210px] overflow-hidden bg-[#070b0a] relative">
        <img
          src={card.image}
          alt={card.title}
          loading="lazy"
          className="h-full w-full object-cover opacity-75"
          style={{ filter: "grayscale(0.3) contrast(1.1) hue-rotate(120deg) saturate(0.8)" }}
        />
        <div className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(120,255,214,0.10), transparent 30%, rgba(7,11,10,0.5))" }} />
        <div className="absolute bottom-3 left-3 font-mono text-[11px] uppercase tracking-widest text-[#7fe9c4]">
          {card.title}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 font-mono text-[11px] uppercase leading-tight tracking-wide text-cream/80">
        <p>{card.left}</p>
        <p>{card.right}</p>
      </div>
    </article>
  );
}

export default function ObservedSystems() {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const card2X = useTransform(scrollYProgress, [0.18, 0.38], ["115vw", "0vw"]);
  const card3X = useTransform(scrollYProgress, [0.42, 0.62], ["115vw", "0vw"]);

  return (
    <section ref={ref} className="relative z-10 h-[320vh] w-full">
      <div className="sticky top-0 h-screen overflow-hidden px-5 md:px-8">
        <div className="absolute left-8 top-[14vh] font-mono text-[14px] uppercase tracking-wider text-[#7fe9c4]">
          Observed Signals
        </div>

        {/* cards pushed lower so the planet reads in the upper-centre */}
        <div className="absolute left-1/2 top-[62%] z-10 -translate-x-1/2 -translate-y-1/2">
          <Card card={cards[0]} />
        </div>

        <motion.div
          style={{ x: card2X }}
          className="absolute left-1/2 top-[62%] z-20 -translate-x-1/2 -translate-y-1/2"
        >
          <Card card={cards[1]} />
        </motion.div>

        <motion.div
          style={{ x: card3X }}
          className="absolute left-1/2 top-[62%] z-30 -translate-x-1/2 -translate-y-1/2"
        >
          <Card card={cards[2]} />
        </motion.div>
      </div>
    </section>
  );
}