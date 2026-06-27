import { useSignalAudio } from "../hooks/useSignalAudio";

export default function BeginListening() {
  const { started, muted, begin, toggleMute } = useSignalAudio();
  return (
    <button
      onClick={started ? toggleMute : begin}
      className="fixed bottom-6 left-1/2 z-[80] -translate-x-1/2 border border-[#7fe9c4]/40 bg-[#070b0a]/60 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[#7fe9c4] backdrop-blur-md transition-all hover:bg-[#7fe9c4] hover:text-black"
    >
      {!started ? "▶ Begin Listening" : muted ? "▶ Resume Signal" : "■ Mute Signal"}
    </button>
  );
}
