import Decrypt from "./Decrypt";
// ...
<h1 className="text-[clamp(7rem,11vw,12rem)] leading-[0.85] font-medium tracking-[-0.07em]">
  <Decrypt as="span" className="block" text="Other" />
  <Decrypt as="span" className="block" text="Life" speed={45} />
</h1>
// OTHER LIFE — the arrival. Mars has formed behind this; the signal had a source.
export default function Finale() {
  return (
    <section className="relative z-10 min-h-screen overflow-hidden">
      <div className="relative h-screen px-8">
        <div className="absolute right-[12%] top-[12%]">
          <h1 className="text-[clamp(7rem,11vw,12rem)] leading-[0.85] font-medium tracking-[-0.07em]">
            Other
            <br />
            Life
          </h1>
        </div>

        <div className="absolute right-[12%] top-[58%] max-w-[760px]">
          <p className="font-mono text-[18px] uppercase leading-relaxed text-cream/80">
            ONE SIGNAL. THREE PHASES. A SINGLE SOURCE.
            <br />
            <br />
            IT FORMED.
            <br />
            IT BROKE.
            <br />
            IT RESOLVED INTO A WORLD.
          </p>

          <button className="mt-10 border border-cream/20 px-7 py-4 font-mono text-sm uppercase tracking-[0.2em] transition-all hover:bg-cream hover:text-black">
            Open The Archive →
          </button>
        </div>

        <div className="absolute bottom-10 left-12 font-mono text-xs text-cream/30">
          © 2026 OTHER LIFE / RECEIVER STATION
        </div>
      </div>
    </section>
  );
}