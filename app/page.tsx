import Hero from "@/components/sections/Hero";
import CinematicJourney from "@/components/sections/CinematicJourney";
import Timeline from "@/components/sections/Timeline";
import People from "@/components/sections/People";
import ReturnToSpace from "@/components/sections/ReturnToSpace";
import Footer from "@/components/Footer";
import { JOURNEY_CHAPTERS } from "@/lib/journey-content";

export default function Home() {
  // One continuous film: Space → Sky → Land → Sea scrubbed across a single
  // canvas (no per-section seams). Then history, people, return to space.
  return (
    <>
      <Hero />
      <CinematicJourney chapters={JOURNEY_CHAPTERS} />
      <Timeline />
      <People />
      <ReturnToSpace />
      <Footer />
    </>
  );
}
