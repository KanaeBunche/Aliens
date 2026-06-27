import { useEffect, useRef, useState } from "react";

const GLYPHS = "!<>-_\\/[]{}=+*^?#01ABCDEFGHJKLMNPQRSTUVWXYZ".split("");

export default function Decrypt({ text, className = "", as = "span", speed = 36 }) {
  const [out, setOut] = useState("");
  const ref = useRef(null);
  const started = useRef(false);
  const Tag = as;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const run = () => {
      if (started.current) return;
      started.current = true;
      const final = text;
      let frame = 0;
      const locks = final.split("").map(() => Math.floor(Math.random() * 14) + 6);
      const tick = () => {
        let done = true;
        const next = final.split("").map((ch, i) => {
          if (ch === " ") return " ";
          if (frame >= locks[i]) return ch;
          done = false;
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }).join("");
        setOut(next);
        frame++;
        if (!done) setTimeout(tick, speed);
      };
      tick();
    };

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) run(); }),
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [text, speed]);

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {out || text.replace(/[^ ]/g, "\u00A0")}
    </Tag>
  );
}
