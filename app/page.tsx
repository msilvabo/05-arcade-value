"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { HomeHero } from "@/components/home/HomeHero";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { GamesPreviewRail } from "@/components/home/GamesPreviewRail";
import { HomeStats } from "@/components/home/HomeStats";
import { LiveActivitySection } from "@/components/home/LiveActivitySection";
import { PricingSection } from "@/components/home/PricingSection";
import { FinalCtaSection } from "@/components/home/FinalCtaSection";
import { Footer } from "@/components/library/Footer";

export default function HomePage() {
  const [credits, setCredits] = useState<number>(3);
  const [sfx, setSfx] = useState<boolean>(true);
  const [music, setMusic] = useState<boolean>(true);

  // Intersection Observer for scroll reveal effect
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleInsertCredit = () => {
    setCredits((prev) => prev + 1);
  };

  return (
    <div className="relative min-h-screen bg-surface font-body-md text-body-md text-on-surface overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container flex flex-col">
      {/* Full-page Ambient Vector Grid Backing */}
      <div
        className="fixed inset-0 pointer-events-none opacity-10 bg-[linear-gradient(to_right,#00f5ff_1px,transparent_1px),linear-gradient(to_bottom,#00f5ff_1px,transparent_1px)] bg-[size:4rem_4rem] z-0"
        aria-hidden="true"
      />

      {/* Global Navbar */}
      <Navbar
        credits={credits}
        sfx={sfx}
        music={music}
        onToggleSfx={() => setSfx((prev) => !prev)}
        onToggleMusic={() => setMusic((prev) => !prev)}
        onInsertCredit={handleInsertCredit}
      />

      {/* Main Landing Content */}
      <main className="w-full pt-20 relative flex-1 z-10">
        {/* Hero Section with Silhouettes, Eyebrow and CTAs */}
        <HomeHero />

        {/* 01: ¿Por qué Arcade Vault? Features Grid */}
        <FeaturesSection />

        {/* 02: Juegos Disponibles Ahora (Preview Rail) */}
        <GamesPreviewRail />

        {/* Quick Global Stats */}
        <HomeStats />

        {/* 03: Actividad en Vivo (Ticker & Top Jugadores Hoy) */}
        <LiveActivitySection />

        {/* 04: Precios & FAQs */}
        <PricingSection />

        {/* Final CTA: ¿Listo para jugar? */}
        <FinalCtaSection />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
