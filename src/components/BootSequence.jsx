import { useEffect, useRef, useState } from "react";

const LINES = [
  "OTHER LIFE // RECEIVER STATION",
  "",
  "> POWERING ARRAY ............ OK",
  "> ESTABLISHING UPLINK ....... OK",
  "> SCANNING DEEP FIELD .......",
  "> SIGNAL ACQUIRED",
  "> SOURCE: UNKNOWN",
  "> DECODING TRANSMISSION .....",
  "",
  "> WARNING: ORIGIN NOT TERRESTRIAL",
  "",
  "> BEGIN OBSERVATION",
];

export default function BootSequence({ onDone }) {
  const [shown, setShown] = useState([]);
  const [typed, setTyped] = useState("");
  const [done, setDone] = useState(false);
  const timers = useRef([]);

  useEffect(() => {
    let li = 0, ci = 0;
    const run = () => {
      if (li >= LINES.length) {
        timers.current.push(setTimeout(() => setDone(true), 600));
        timers.current.push(setTimeout(() => onDone && onDone(), 1400));
        return;
      }
      const line = LINES[li];
      if (ci <= line.length) {
        setTyped(line.slice(0, ci));
        ci++;
        timers.current.push(setTimeout(run, line[ci - 1] === " " ? 12 : 26));
      } else {
        setShown((s) => [...s, line]);
        setTyped("");
        li++; ci = 0;
        timers.current.push(setTimeout(run, line === "" ? 120 : 300));
      }
    };
    const skip = () => { timers.current.forEach(clearTimeout); setDone(true); timers.current.push(setTimeout(() => onDone && onDone(), 700)); };
    window.addEventListener("keydown", skip);
    window.addEventListener("click", skip);
    timers.current.push(setTimeout(run, 500));
    return () => {
      timers.current.forEach(clearTimeout);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("click", skip);
    };
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col justify-center px-6 md:px-16 font-mono text-[13px] md:text-[15px] leading-relaxed text-[#7fe9c4] transition-opacity duration-700"
      style={{ background: "#050607", opacity: done ? 0 : 1, pointerEvents: done ? "none" : "auto" }}
    >
      <div className="max-w-[820px]">
        {shown.map((l, i) => (
          <div key={i} className={l.startsWith("> WARNING") ? "text-[#ff6a4d]" : ""}>
            {l || "\u00A0"}
          </div>
        ))}
        {!done && (
          <div className={typed.startsWith("> WARNING") ? "text-[#ff6a4d]" : ""}>
            {typed}
            <span className="inline-block w-[8px] -mb-[2px] ml-[2px] h-[14px] bg-[#7fe9c4] animate-pulse" />
          </div>
        )}
      </div>

      <div className="absolute bottom-8 left-6 md:left-16 text-[11px] uppercase tracking-widest text-[#7fe9c4]/40">
        press any key to skip
      </div>

      <div className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{ background: "repeating-linear-gradient(0deg, #7fe9c4 0px, #7fe9c4 1px, transparent 1px, transparent 3px)" }} />
    </div>
  );
}
