import { useLenis } from "./hooks/useLenis";
import Cursor from "./components/Cursor";
import Attractor from "./components/Attractor";
import Hud from "./components/Hud";
import Hero from "./components/Hero";
import Section2 from "./components/Section2";
import ObservedSystems from "./components/ObservedSystems";
import SignalConditions from "./components/SignalConditions";
import SoundManifesto from "./components/SoundManifesto";
import Finale from "./components/Finale";
import BeginListening from "./components/BeginListening";
import BootSequence from "./components/BootSequence";
import CRTOverlay from "./components/CRTOverlay";
import MarsMessage from "./components/MarsMessage";

export default function App() {
  useLenis();
  return (
    <>
      {/* fixed attractor lives behind everything and transforms on scroll */}
      <Attractor />
      <Cursor />
      <Hud />
      <main className="relative z-10">
        <Hero />
        <Section2 />
        <ObservedSystems />
        <SignalConditions />
        <SoundManifesto />
        <Finale />
        <BeginListening />
        <BootSequence />
        <CRTOverlay />
<MarsMessage />
     
      </main>
    </>
  );
}