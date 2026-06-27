import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.6 }); // springy follow
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.6 });
  const [hover, setHover] = useState(false);
  const [touch, setTouch] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(hover:none)").matches) { setTouch(true); return; } // no cursor on touch
    const move = (e) => { x.set(e.clientX - 18); y.set(e.clientY - 18); };      // -18 = half of w-9
    const over = (e) => { if (e.target.closest("a,button")) setHover(true); };
    const out  = (e) => { if (e.target.closest("a,button")) setHover(false); };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    window.addEventListener("mouseout", out);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mouseout", out);
    };
  }, []);

  if (touch) return null;
  return (
    <motion.div
      style={{ x: sx, y: sy }}
      animate={{ scale: hover ? 1.8 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="pointer-events-none fixed top-0 left-0 z-[90] h-9 w-9 rounded-full border border-cream mix-blend-difference"
    />
  );
}
