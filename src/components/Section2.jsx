import { motion } from "framer-motion";
import Decrypt from "./Decrypt";
// OTHER LIFE — the signal's three phases reveal as they scroll over the attractor.
function Reveal({ children, className = "", delay = 0 }) {
  return (
    <span className="block overflow-hidden">
      <motion.span
        className={"block " + className}
        initial={{ y: "110%" }}
        whileInView={{ y: "0%" }}
        viewport={{ once: true, margin: "-12% 0px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

const fadeIn = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-12% 0px" },
};

// Three phases of one signal.
const STATES = [
  {
    id: "OL-01",
    label: "PHASE / CARRIER",
    title: ["Steady", "Tone"],
    body: "A single frequency holding against the noise. No source we can name, no reason for it to persist — and yet it does.",
    align: "left",
  },
  {
    id: "OL-02",
    label: "PHASE / BURST",
    title: ["Broken", "Pattern"],
    body: "The tone fractures. For a few milliseconds there is structure inside the static — too ordered to be an accident.",
    align: "right",
  },
  {
    id: "OL-03",
    label: "PHASE / RESOLUTION",
    title: ["A", "World"],
    body: "The signal collapses into a shape, and the shape into a sphere. It was never noise. Something out there is turning toward us.",
    align: "left",
  },
];

export default function Section2() {
  return (
    <section className="relative z-10 w-full">
      {/* intro statement */}
      <div className="px-5 md:px-8 py-[28vh] max-w-4xl pointer-events-none">
        <h2 className="text-[clamp(4rem,7vw,7rem)] leading-[0.9] font-medium tracking-[-0.04em]">
          <Reveal>We are not broadcasting.</Reveal>
          <Reveal delay={0.08}>
            <span className="text-muted">We are listening.</span>
          </Reveal>
        </h2>
      </div>

      {/* the three phases */}
      {STATES.map((st) => (
        <div
          key={st.id}
          className={
            "min-h-screen flex flex-col justify-center px-5 md:px-8 pointer-events-none " +
            (st.align === "right" ? "items-end text-right" : "items-start text-left")
          }
        >
          <div className="w-full max-w-[1200px]">
            <motion.div
              {...fadeIn}
              transition={{ duration: 0.7 }}
              className="font-mono text-[11px] tracking-widest uppercase text-muted mb-5 flex gap-3"
            >
              <span>{st.id}</span>
              <span className="text-cream/70">{st.label}</span>
            </motion.div>

            <h3 className="text-[clamp(3rem,9vw,9rem)] leading-[0.85] font-medium tracking-[-0.06em] text-cream">
              <span className="block">{st.title[0]}</span>
              <span className="block">{st.title[1]}</span>
            </h3>

            <motion.p
              {...fadeIn}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="mt-6 text-[15px] leading-relaxed text-muted max-w-md"
              style={st.align === "left" ? { marginLeft: 0 } : { marginLeft: "auto" }}
            >
              {st.body}
            </motion.p>
          </div>
        </div>
      ))}
    </section>
  );
}