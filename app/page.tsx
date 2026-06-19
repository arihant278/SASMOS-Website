import Hero from "@/components/sections/Hero";
import SatelliteScrollytelling from "@/components/sections/SatelliteScrollytelling";
import JetScrollytelling from "@/components/sections/JetScrollytelling";
import SphereSection from "@/components/sections/SphereSection";
import Timeline from "@/components/sections/Timeline";
import People from "@/components/sections/People";
import ReturnToSpace from "@/components/sections/ReturnToSpace";
import Footer from "@/components/Footer";
import { SPHERES } from "@/lib/content";

export default function Home() {
  // space → Satellite Sequence, sky → Jet Sequence.
  // land/sea keep the SphereSection layout until their sequences are produced.
  const land = SPHERES[2];
  const sea = SPHERES[3];
  return (
    <>
      <Hero />
      <SatelliteScrollytelling />
      <JetScrollytelling />
      <SphereSection data={land} index={2} />
      <SphereSection data={sea} index={3} />
      <Timeline />
      <People />
      <ReturnToSpace />
      <Footer />
    </>
  );
}
