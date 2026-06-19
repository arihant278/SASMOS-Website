import Hero from "@/components/sections/Hero";
import SphereSection from "@/components/sections/SphereSection";
import Timeline from "@/components/sections/Timeline";
import People from "@/components/sections/People";
import ReturnToSpace from "@/components/sections/ReturnToSpace";
import Footer from "@/components/Footer";
import { SPHERES } from "@/lib/content";

export default function Home() {
  // SPHERES[0] (space) is rendered inside Hero; sky/land/sea use SphereSection.
  const [, ...rest] = SPHERES;
  return (
    <>
      <Hero />
      {rest.map((s, i) => (
        <SphereSection key={s.id} data={s} index={i + 1} />
      ))}
      <Timeline />
      <People />
      <ReturnToSpace />
      <Footer />
    </>
  );
}
