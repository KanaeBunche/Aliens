export default function CRTOverlay() {
  return (
    <>
      <style>{`
        @keyframes ol-scan { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
        @keyframes ol-flicker {
          0%,100% { opacity: 0.05; }
          50% { opacity: 0.08; }
          52% { opacity: 0.03; }
        }
      `}</style>

      <div
        className="pointer-events-none fixed inset-0 z-[95]"
        style={{
          background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.16) 0px, rgba(0,0,0,0.16) 1px, transparent 1px, transparent 3px)",
          mixBlendMode: "multiply",
        }}
      />

      <div
        className="pointer-events-none fixed inset-0 z-[95]"
        style={{
          background: "radial-gradient(120% 120% at 50% 50%, transparent 60%, rgba(0,20,14,0.35))",
          animation: "ol-flicker 6s steps(1) infinite",
        }}
      />

      <div className="pointer-events-none fixed inset-0 z-[96] overflow-hidden">
        <div
          style={{
            position: "absolute",
            left: 0,
            width: "100%",
            height: "30%",
            background: "linear-gradient(180deg, transparent, rgba(127,233,196,0.05), transparent)",
            animation: "ol-scan 7s linear infinite",
          }}
        />
      </div>
    </>
  );
}
