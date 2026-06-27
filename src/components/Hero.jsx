import { motion } from "framer-motion";
import Decrypt from "./Decrypt";

function MaskLine({ children, delay = 0 }) {
  return (
    <span className="block overflow-hidden">
      <motion.span
        className="block"
        initial={{ y: "110%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

const fade = { initial: { y: 14, opacity: 0 }, animate: { y: 0, opacity: 1 } };

export default function Hero() {
  return (
    <section className="relative z-10 h-[100svh] w-full flex flex-col justify-end px-5 md:px-8 pb-16 md:pb-20 pointer-events-none">
      <div className="max-w-5xl">
        <motion.span
          {...fade}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="block font-mono text-[11px] tracking-widest uppercase text-muted mb-4"
        >
          <Decrypt text="OL-00 / SIGNAL ACQUIRED" speed={28} />
        </motion.span>

        <motion.h1
          className="text-[clamp(4.5rem,8vw,8.5rem)] leading-[0.9] font-medium tracking-[-0.04em]"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <MaskLine delay={0.5}><Decrypt text="Other" /></MaskLine>
          <MaskLine delay={0.62}><Decrypt text="Life" speed={45} /></MaskLine>
        </motion.h1>

        <motion.p
          {...fade}
          transition={{ delay: 1.0, duration: 0.8 }}
          className="mt-6 max-w-md text-[18px] leading-[1.65] text-muted"
        >
          A receiver listening to things that should not be transmitting. Scroll
          to follow one signal as it forms, breaks, and resolves into a world.
        </motion.p>
      </div>

      <motion.div
        {...fade}
        transition={{ delay: 1.15, duration: 0.8 }}
        className="absolute bottom-8 right-5 md:right-8 flex items-center gap-3 font-mono text-[10px] tracking-widest uppercase text-muted"
      >
        <span className="leading-tight text-right">Scroll down<br />to begin listening</span>
        <span className="block w-px h-10 bg-hair relative overflow-hidden">
          <motion.span
            className="absolute left-0 top-0 w-full h-1/2 bg-cream"
            animate={{ y: [0, 40] }}
            transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.6, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}
