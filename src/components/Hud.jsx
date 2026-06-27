import { useEffect, useState } from "react";

function phaseFor(p) {
  if (p < 0.28) return { state: "CARRIER", mode: "PASSIVE" };
  if (p < 0.55) return { state: "BURST", mode: "TRACKING" };
  if (p < 0.82) return { state: "UNSTABLE", mode: "ACTIVE" };
  return { state: "LOCKED", mode: "RESOLVED" };
}

export default function Hud() {
  const [clock, setClock] = useState("--:-- --");
  const [state, setState] = useState("CARRIER");
  const [mode, setMode] = useState("PASSIVE");
  const [drift, setDrift] = useState("0.0000");

  useEffect(() => {
    const tick = () => setClock(
      new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })
    );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let raf, jitter = 0.4;
    const loop = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const p = Math.max(0, Math.min(1, (window.scrollY || 0) / max));
      const ph = phaseFor(p);
      setState(ph.state);
      setMode(ph.mode);
      if (p >= 0.82) {
        setDrift("0.0000");
      } else {
        jitter += (Math.random() - 0.5) * 0.06;
        const base = 0.2 + p * 0.7;
        const v = Math.min(0.999, Math.max(0, base + jitter * 0.1));
        setDrift(v.toFixed(4));
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const locked = state === "LOCKED";

  return (
    <header className="fixed top-0 left-0 z-50 w-full px-5 md:px-8 py-4 flex items-start justify-between font-mono text-[11px] uppercase tracking-wider text-muted pointer-events-none">
      <div className="hidden md:flex flex-col gap-1">
        <div className="flex gap-2">
          <span>SIGNAL / PHASE:</span>
          <span style={{ color: locked ? "#ff8a5c" : "#7fe9c4" }}>{state}</span>
        </div>
        <div className="flex gap-2">
          <span>RECEIVER MODE:</span>
          <span className="text-cream">{mode}</span>
        </div>
        <div className="flex gap-2">
          <span>FREQUENCY DRIFT:</span>
          <span className="text-cream" style={{ fontVariantNumeric: "tabular-nums" }}>{drift}</span>
        </div>
      </div>

      <div className="ml-auto flex flex-col items-end gap-2 pointer-events-auto">
        <span className="text-cream/70" style={{ fontVariantNumeric: "tabular-nums" }}>{clock}</span>
        <nav className="flex gap-4">
          <a href="#" className="hover:text-cream transition-colors">Log</a>
          <a href="#" className="hover:text-cream transition-colors">Signals</a>
          <a href="#" className="hover:text-cream transition-colors">Contact</a>
        </nav>
      </div>
    </header>
  );
}
