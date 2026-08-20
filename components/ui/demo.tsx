"use client";

import { CinematicFooter } from "@/components/ui/motion-footer";

export default function Demo() {
  return (
    <div className="relative w-full bg-[#0A1628] min-h-screen font-sans selection:bg-[#C9A84C]/30 overflow-x-hidden">

      {/* 
        MAIN CONTENT AREA 
        We use a high z-index and minimum height to allow the user 
        to scroll down and reveal the footer securely underneath.
      */}
      <main className="relative z-10 w-full min-h-[120vh] bg-[#0A1628] flex flex-col items-center justify-center text-white border-b border-white/10 shadow-2xl rounded-b-3xl px-4 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_center,rgba(201,168,76,0.1)_0%,transparent_60%)] pointer-events-none" />
        
        <span className="text-[#C9A84C] text-sm font-bold tracking-[0.3em] uppercase mb-4">
          HMMJ Teknik Mesin UBH
        </span>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6 uppercase">
          Scroll Down To Reveal
        </h1>
        <p className="text-gray-400 max-w-lg mb-8 text-sm md:text-base">
          Cinematic footer interaktif berbasis GSAP ScrollTrigger dengan efek curtain reveal, marquee banner, dan magnetic buttons.
        </p>
        
        <div className="w-[2px] h-28 bg-gradient-to-b from-[#C9A84C] to-transparent animate-pulse" />
      </main>

      {/* The Cinematic Footer is injected here */}
      <CinematicFooter />
      
    </div>
  );
}
