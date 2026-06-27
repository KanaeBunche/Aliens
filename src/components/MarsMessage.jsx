import { useEffect, useRef, useState } from "react";
import Decrypt from "./Decrypt";

// Absolute final beat of OTHER LIFE — full-height, decodes once in view.
export default function MarsMessage({ text = "WE SEE YOU TOO" }) {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setShow(true); }),
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center px-6 text-center">
      <div
        className="mb-5 font-mono text-[11px] uppercase tracking-[0.35em] text-[#ff8a5c]/70 transition-opacity duration-700"
        style={{ opacity: show ? 1 : 0 }}
    >
        incoming // origin: surface
      </div>
      {show && (
        <Decrypt
          as="div"
          text={text}
          speed={80}
          className="font-mono text-[clamp(1.8rem,6vw,4rem)] uppercase tracking-[0.25em] text-[#ff8a5c]"
        />
      )}
    </div>
  );
}
