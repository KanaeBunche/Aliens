// OTHER LIFE — "Signal Conditions" light decoded-log panel.
// Fixed Unsplash CDN photo URLs (images.unsplash.com/photo-...) — these are
// permanent direct links and do NOT break like source.unsplash.com did.
import Decrypt from "./Decrypt";


const conditions = [
  { number: "01", label: "CARRIER", title: "Steady\nTone",
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1200&auto=format&fit=crop" },
  { number: "02", label: "BURST", title: "Broken\nPattern",
    image: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?q=80&w=1200&auto=format&fit=crop" },
  { number: "03", label: "RESOLUTION", title: "A\nWorld",
    image: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=1200&auto=format&fit=crop" },
];

export default function SignalConditions() {
  return (
    <section className="relative z-20 min-h-screen bg-[#eeeeee] px-5 py-20 text-[#0c0c0d] md:px-8">
      <div className="grid min-h-screen grid-cols-1 gap-16 md:grid-cols-[0.42fr_1fr]">
        <div className="font-mono text-[16px] uppercase tracking-wide">
          Signal Conditions
        </div>

        <div className="max-w-[980px]">
          <h2 className="text-[clamp(3rem,5vw,5.8rem)] leading-[0.95] font-medium tracking-[-0.05em]">
            Every world begins as a signal.
          </h2>

          <h2 className="mt-16 text-[clamp(3rem,5vw,5.8rem)] leading-[0.95] font-medium tracking-[-0.05em]">
            Small shifts in frequency, rhythm, and noise decide whether we hear it at all.
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        {conditions.map((item) => (
          <article
            key={item.number}
            className="border-l border-black/15 pl-7 pt-6"
          >
            <div className="mb-28 flex justify-between font-mono text-[13px] uppercase tracking-wide text-black/70">
              <span>{item.number}</span>
              <span>{item.label}</span>
            </div>

            <h3 className="whitespace-pre-line text-[clamp(3.2rem,5vw,5rem)] ...">
  <Decrypt text={item.title.replace("\n", " ")} />
</h3>

            <div className="mt-8 h-[220px] overflow-hidden">
              <img
                src={item.image}
                alt={item.label}
                loading="lazy"
                className="h-full w-full object-cover grayscale"
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}