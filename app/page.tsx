import Hero from "@/components/sections/Hero";
import SatelliteScrollytelling from "@/components/sections/SatelliteScrollytelling";
import JetScrollytelling from "@/components/sections/JetScrollytelling";
import LandScrollytelling from "@/components/sections/LandScrollytelling";
import SeaScrollytelling from "@/components/sections/SeaScrollytelling";
import Timeline from "@/components/sections/Timeline";
import People from "@/components/sections/People";
import ReturnToSpace from "@/components/sections/ReturnToSpace";
import Footer from "@/components/Footer";

export default function Home() {
  // space → Satellite Sequence, sky → Jet Sequence,
  // land → Land Sequence, sea → water sequence.
  return (
    <>
      <Hero />
      <SatelliteScrollytelling />
      <JetScrollytelling />
      <LandScrollytelling />
      <SeaScrollytelling />
      <Timeline />
      <People />
      <ReturnToSpace />
      <Footer />
    </>
  );
}
