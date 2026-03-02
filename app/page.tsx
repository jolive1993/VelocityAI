"use client";

import {
  AmbientBackground,
  CTA,
  Features,
  Footer,
  Hero,
  Stats,
  VervoAd,
} from "@/components/home";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a0b]">
      <AmbientBackground />

      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-32 pt-20 sm:px-8 lg:px-12">
        <Hero />
        <Stats />
        <Features />
        <VervoAd />
        <CTA />
        <Footer />
      </main>
    </div>
  );
}
