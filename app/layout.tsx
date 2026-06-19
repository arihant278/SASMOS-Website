import type { Metadata } from "next";
import { Archivo, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/providers/SmoothScroll";
import Nav from "@/components/Nav";
import SphereProgress from "@/components/SphereProgress";
import Preloader from "@/components/Preloader";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});
const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "SASMOS — Sea · Land · Air · Space",
  description:
    "SASMOS HET Technologies builds high-reliability interconnection systems and electromechanical assemblies for the world's most demanding environments — on earth and beyond it.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${plexSans.variable} ${plexMono.variable} grain antialiased`}
    >
      <body>
        <Preloader />
        {/* palette-driven backdrop for chapters without a frame sequence
            (intro, land, sea, timeline, people, return). The image-sequence
            sections paint their own opaque canvas on top of this. */}
        <div
          aria-hidden
          className="fixed inset-0 z-0"
          style={{ background: "var(--bg)", transition: "background 0.6s linear" }}
        />
        <SmoothScroll>
          <Nav />
          <SphereProgress />
          <main className="relative z-10">{children}</main>
        </SmoothScroll>
      </body>
    </html>
  );
}
