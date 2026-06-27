import { useEffect, useRef, useState } from "react";
import * as Tone from "tone";

export function useSignalAudio() {
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(false);
  const nodes = useRef(null);

  const begin = async () => {
    if (started) return;
    await Tone.start();
    Tone.Transport.start();

    const reverb = new Tone.Reverb({ decay: 14, wet: 0.6 }).toDestination();
    const master = new Tone.Gain(0.0).connect(reverb);
    master.gain.rampTo(0.9, 3);

    const carrier = new Tone.Gain(0.0).connect(master);
    const oscA = new Tone.Oscillator(55, "sine").connect(carrier).start();
    const oscB = new Tone.Oscillator(55.4, "sine").connect(carrier).start();
    carrier.gain.rampTo(0.5, 4);

    const burst = new Tone.Gain(0.0).connect(master);
    const oscC = new Tone.Oscillator(220, "triangle").connect(burst).start();
    const wobble = new Tone.LFO({ frequency: 0.07, min: 215, max: 232 }).start();
    wobble.connect(oscC.frequency);

    const tangle = new Tone.Gain(0.0).connect(master);
    const noise = new Tone.Noise("pink").connect(new Tone.Filter(700, "lowpass").connect(tangle)).start();

    nodes.current = { master, carrier, burst, tangle, oscB,
      setProgress: (p) => {
        const burV = Math.max(0, Math.min(1, (p - 0.25) / 0.35)) * (1 - Math.max(0, (p - 0.8) / 0.2)) * 0.32;
        const tanV = Math.max(0, Math.min(1, (p - 0.5) / 0.3)) * (1 - Math.max(0, (p - 0.85) / 0.15)) * 0.28;
        carrier.gain.rampTo(0.5, 0.3);
        burst.gain.rampTo(burV, 0.3);
        tangle.gain.rampTo(tanV, 0.3);
        const off = Math.sin(Math.min(p, 0.8) / 0.8 * Math.PI) * 0.9 * (1 - Math.max(0, (p - 0.85) / 0.15));
        oscB.frequency.rampTo(55 + off, 0.2);
      },
    };

    const glitch = () => {
      if (nodes.current && !mutedRef.current) {
        const g = nodes.current.master.gain;
        const now = Tone.now();
        g.cancelScheduledValues(now);
        g.setValueAtTime(0.25, now);
        g.linearRampToValueAtTime(0.9, now + 0.18);
      }
      Tone.Transport.scheduleOnce(glitch, "+" + (8 + Math.random() * 14));
    };
    Tone.Transport.scheduleOnce(glitch, "+10");

    setStarted(true);
  };

  const mutedRef = useRef(false);
  const toggleMute = () => {
    const next = !mutedRef.current;
    mutedRef.current = next;
    setMuted(next);
    if (nodes.current) nodes.current.master.gain.rampTo(next ? 0 : 0.9, 0.6);
  };

  useEffect(() => {
    if (!started) return;
    let raf;
    const loop = () => {
      if (!mutedRef.current && nodes.current) {
        const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const p = Math.max(0, Math.min(1, (window.scrollY || 0) / max));
        nodes.current.setProgress(p);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [started]);

  useEffect(() => {
    return () => { try { Tone.Transport.stop(); Tone.Transport.cancel(); } catch (e) {} };
  }, []);

  return { started, muted, begin, toggleMute };
}
