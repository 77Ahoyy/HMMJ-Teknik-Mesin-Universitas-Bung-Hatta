"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

// Register ScrollTrigger safely for React
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// -------------------------------------------------------------------------
// 1. THEME-ADAPTIVE INLINE STYLES
// -------------------------------------------------------------------------
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');

.cinematic-footer-wrapper {
  font-family: 'Plus Jakarta Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  
  /* Dynamic Variables using standard shadcn/tailwind tokens */
  --pill-bg-1: color-mix(in oklch, var(--color-text, #fff) 3%, transparent);
  --pill-bg-2: color-mix(in oklch, var(--color-text, #fff) 1%, transparent);
  --pill-shadow: color-mix(in oklch, var(--color-bg, #000) 50%, transparent);
  --pill-highlight: color-mix(in oklch, var(--color-primary, #c9a84c) 20%, transparent);
  --pill-inset-shadow: color-mix(in oklch, var(--color-bg, #000) 80%, transparent);
  --pill-border: color-mix(in oklch, var(--color-primary, #c9a84c) 25%, transparent);
  
  --pill-bg-1-hover: color-mix(in oklch, var(--color-primary, #c9a84c) 15%, transparent);
  --pill-bg-2-hover: color-mix(in oklch, var(--color-text, #fff) 5%, transparent);
  --pill-border-hover: color-mix(in oklch, var(--color-primary, #c9a84c) 60%, transparent);
  --pill-shadow-hover: color-mix(in oklch, var(--color-bg, #000) 70%, transparent);
  --pill-highlight-hover: color-mix(in oklch, var(--color-primary, #c9a84c) 40%, transparent);
}

@keyframes footer-breathe {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
  100% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
}

@keyframes footer-scroll-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@keyframes footer-heartbeat {
  0%, 100% { transform: scale(1); filter: drop-shadow(0 0 5px rgba(239, 68, 68, 0.5)); }
  15%, 45% { transform: scale(1.2); filter: drop-shadow(0 0 10px rgba(239, 68, 68, 0.8)); }
  30% { transform: scale(1); }
}

.animate-footer-breathe {
  animation: footer-breathe 8s ease-in-out infinite alternate;
}

.animate-footer-scroll-marquee {
  animation: footer-scroll-marquee 40s linear infinite;
}

.animate-footer-heartbeat {
  animation: footer-heartbeat 2s cubic-bezier(0.25, 1, 0.5, 1) infinite;
}

/* Theme-adaptive Grid Background */
.footer-bg-grid {
  background-size: 60px 60px;
  background-image: 
    linear-gradient(to right, rgba(201, 168, 76, 0.06) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(201, 168, 76, 0.06) 1px, transparent 1px);
  mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
}

/* Theme-adaptive Aurora Glow */
.footer-aurora {
  background: radial-gradient(
    circle at 50% 50%, 
    rgba(201, 168, 76, 0.2) 0%, 
    rgba(19, 34, 56, 0.3) 40%, 
    transparent 70%
  );
}

/* Glass Pill Theming */
.footer-glass-pill {
  background: linear-gradient(145deg, var(--pill-bg-1) 0%, var(--pill-bg-2) 100%);
  box-shadow: 
      0 10px 30px -10px var(--pill-shadow), 
      inset 0 1px 1px var(--pill-highlight), 
      inset 0 -1px 2px var(--pill-inset-shadow);
  border: 1px solid var(--pill-border);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.footer-glass-pill:hover {
  background: linear-gradient(145deg, var(--pill-bg-1-hover) 0%, var(--pill-bg-2-hover) 100%);
  border-color: var(--pill-border-hover);
  box-shadow: 
      0 20px 40px -10px var(--pill-shadow-hover), 
      inset 0 1px 1px var(--pill-highlight-hover);
  color: #fff;
}

/* Giant Background Text Masking */
.footer-giant-bg-text {
  font-size: 24vw;
  line-height: 0.75;
  font-weight: 900;
  letter-spacing: -0.05em;
  color: transparent;
  -webkit-text-stroke: 1px rgba(201, 168, 76, 0.12);
  background: linear-gradient(180deg, rgba(201, 168, 76, 0.15) 0%, transparent 60%);
  -webkit-background-clip: text;
  background-clip: text;
}

/* Metallic Text Glow */
.footer-text-glow {
  background: linear-gradient(180deg, #FFFFFF 0%, #E8C97E 50%, #C9A84C 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0px 0px 24px rgba(201, 168, 76, 0.35));
}
`;

// -------------------------------------------------------------------------
// 2. MAGNETIC BUTTON PRIMITIVE (Zero Dependency)
// -------------------------------------------------------------------------
export type MagneticButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & 
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    as?: React.ElementType;
  };

export const MagneticButton = React.forwardRef<HTMLElement, MagneticButtonProps>(
  ({ className, children, as: Component = "button", ...props }, forwardedRef) => {
    const localRef = useRef<HTMLElement>(null);

    useEffect(() => {
      if (typeof window === "undefined") return;
      const element = localRef.current;
      if (!element) return;

      const ctx = gsap.context(() => {
        const handleMouseMove = (e: MouseEvent) => {
          const rect = element.getBoundingClientRect();
          const h = rect.width / 2;
          const w = rect.height / 2;
          const x = e.clientX - rect.left - h;
          const y = e.clientY - rect.top - w;

          gsap.to(element, {
            x: x * 0.4,
            y: y * 0.4,
            rotationX: -y * 0.15,
            rotationY: x * 0.15,
            scale: 1.05,
            ease: "power2.out",
            duration: 0.4,
          });
        };

        const handleMouseLeave = () => {
          gsap.to(element, {
            x: 0,
            y: 0,
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            ease: "elastic.out(1, 0.3)",
            duration: 1.2,
          });
        };

        element.addEventListener("mousemove", handleMouseMove as any);
        element.addEventListener("mouseleave", handleMouseLeave);

        return () => {
          element.removeEventListener("mousemove", handleMouseMove as any);
          element.removeEventListener("mouseleave", handleMouseLeave);
        };
      }, element);

      return () => ctx.revert();
    }, []);

    return (
      <Component
        ref={(node: HTMLElement) => {
          (localRef as any).current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) (forwardedRef as any).current = node;
        }}
        className={cn("cursor-pointer", className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
MagneticButton.displayName = "MagneticButton";

// -------------------------------------------------------------------------
// 3. MAIN COMPONENT
// -------------------------------------------------------------------------
interface MarqueeItemProps {
  items?: string[];
}

const MarqueeItem = ({ items }: MarqueeItemProps) => {
  const defaultItems = [
    "SOLIDARITY FOREVER",
    "HMMJ TEKNIK MESIN",
    "UNIVERSITAS BUNG HATTA",
    "PERIODE 2026/2027",
    "BERSATU BERKARYA BERPRESTASI",
  ];
  const list = items || defaultItems;

  return (
    <div className="flex items-center space-x-12 px-6">
      {list.map((text, idx) => (
        <React.Fragment key={idx}>
          <span className="text-gray-300 font-semibold">{text}</span>
          <span className="text-[#C9A84C]">✦</span>
        </React.Fragment>
      ))}
    </div>
  );
};

export interface CinematicFooterProps {
  title?: string;
  giantBgText?: string;
  marqueeItems?: string[];
  copyrightText?: string;
  creatorText?: string;
  creatorUrl?: string;
}

export function CinematicFooter({
  title = "Solidarity Forever!",
  giantBgText = "HMMJ UBH",
  marqueeItems,
  copyrightText = "© 2026 HMMJ Teknik Mesin Universitas Bung Hatta.",
  creatorText = "HMMJ Kominfo",
  creatorUrl = "https://www.instagram.com/himpunan_mesin_ubh/",
}: CinematicFooterProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const giantTextRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!wrapperRef.current) return;

    // React strict mode compatible GSAP context cleanup
    const ctx = gsap.context(() => {
      // Background Parallax
      gsap.fromTo(
        giantTextRef.current,
        { y: "10vh", scale: 0.8, opacity: 0 },
        {
          y: "0vh",
          scale: 1,
          opacity: 1,
          ease: "power1.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 80%",
            end: "bottom bottom",
            scrub: 1,
          },
        }
      );

      // Staggered Content Reveal
      gsap.fromTo(
        [headingRef.current, linksRef.current],
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 40%",
            end: "bottom bottom",
            scrub: 1,
          },
        }
      );
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      
      {/* 
        The "Curtain Reveal" Wrapper:
        It sits in standard flow. Because it has clip-path, its contents
        are ONLY visible within its bounding box. 
      */}
      <div
        ref={wrapperRef}
        className="relative h-screen w-full"
        style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
      >
        {/* The actual footer stays fixed to the viewport underneath everything */}
        <footer className="fixed bottom-0 left-0 flex h-screen w-full flex-col justify-between overflow-hidden bg-[#070F1E] text-white cinematic-footer-wrapper">
          
          {/* Ambient Light & Grid Background */}
          <div className="footer-aurora absolute left-1/2 top-1/2 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 animate-footer-breathe rounded-[50%] blur-[80px] pointer-events-none z-0" />
          <div className="footer-bg-grid absolute inset-0 z-0 pointer-events-none" />

          {/* Giant background text */}
          <div
            ref={giantTextRef}
            className="footer-giant-bg-text absolute -bottom-[5vh] left-1/2 -translate-x-1/2 whitespace-nowrap z-0 pointer-events-none select-none text-[#C9A84C]/10"
          >
            {giantBgText}
          </div>

          {/* 1. Diagonal Sleek Marquee (Top of footer) */}
          <div className="absolute top-12 left-0 w-full overflow-hidden border-y border-[rgba(201,168,76,0.2)] bg-[#0A1628]/80 backdrop-blur-md py-4 z-10 -rotate-2 scale-110 shadow-2xl">
            <div className="flex w-max animate-footer-scroll-marquee text-xs md:text-sm font-bold tracking-[0.3em] text-[#C9A84C] uppercase">
              <MarqueeItem items={marqueeItems} />
              <MarqueeItem items={marqueeItems} />
            </div>
          </div>

          {/* 2. Main Center Content */}
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 mt-20 w-full max-w-5xl mx-auto">
            <h2
              ref={headingRef}
              className="text-4xl sm:text-6xl md:text-8xl font-black footer-text-glow tracking-tighter mb-12 text-center"
            >
              {title}
            </h2>

            {/* Interactive Magnetic Pills Layout */}
            <div ref={linksRef} className="flex flex-col items-center gap-6 w-full">
              {/* Primary Action Links */}
              <div className="flex flex-wrap justify-center gap-4 w-full">
                <MagneticButton
                  as="a"
                  href="/struktur"
                  className="footer-glass-pill px-8 py-4 rounded-full text-white font-bold text-sm md:text-base flex items-center gap-3 group border-[rgba(201,168,76,0.3)] shadow-[0_4px_20px_rgba(201,168,76,0.25)]"
                >
                  <span className="text-xl">⚙️</span>
                  Struktur Organisasi
                </MagneticButton>
                
                <MagneticButton
                  as="a"
                  href="/kegiatan"
                  className="footer-glass-pill px-8 py-4 rounded-full text-white font-bold text-sm md:text-base flex items-center gap-3 group border-[rgba(201,168,76,0.3)] shadow-[0_4px_20px_rgba(201,168,76,0.25)]"
                >
                  <span className="text-xl">📰</span>
                  Berita & Kegiatan
                </MagneticButton>

                <MagneticButton
                  as="a"
                  href="/galeri"
                  className="footer-glass-pill px-8 py-4 rounded-full text-white font-bold text-sm md:text-base flex items-center gap-3 group border-[rgba(201,168,76,0.3)] shadow-[0_4px_20px_rgba(201,168,76,0.25)]"
                >
                  <span className="text-xl">📸</span>
                  Galeri Dokumentasi
                </MagneticButton>
              </div>

              {/* Secondary Navigation Links */}
              <div className="flex flex-wrap justify-center gap-3 md:gap-6 w-full mt-2">
                <MagneticButton as="a" href="/tentang" className="footer-glass-pill px-6 py-2.5 rounded-full text-gray-300 font-medium text-xs md:text-sm hover:text-[#C9A84C]">
                  Tentang HMMJ
                </MagneticButton>
                <MagneticButton as="a" href="/kontak" className="footer-glass-pill px-6 py-2.5 rounded-full text-gray-300 font-medium text-xs md:text-sm hover:text-[#C9A84C]">
                  Sekretariat & Kontak
                </MagneticButton>
                <MagneticButton as="a" href="/login" className="footer-glass-pill px-6 py-2.5 rounded-full text-gray-300 font-medium text-xs md:text-sm hover:text-[#C9A84C]">
                  Admin Portal
                </MagneticButton>
              </div>
            </div>
          </div>

          {/* 3. Bottom Bar / Credits */}
          <div className="relative z-20 w-full pb-8 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Copyright */}
            <div className="text-gray-400 text-[10px] md:text-xs font-semibold tracking-widest uppercase order-2 md:order-1 text-center md:text-left">
              {copyrightText}
            </div>

            {/* "Made with Love" Badge */}
            <a
              href={creatorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-glass-pill px-6 py-3 rounded-full flex items-center gap-2 order-1 md:order-2 border-[rgba(201,168,76,0.25)] hover:border-[#C9A84C] transition-colors"
            >
              <span className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">Crafted with</span>
              <span className="animate-footer-heartbeat text-sm md:text-base text-red-500">❤</span>
              <span className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">by</span>
              <span className="text-[#E8C97E] font-black text-xs md:text-sm tracking-normal ml-1">{creatorText}</span>
            </a>

            {/* Back to top */}
            <MagneticButton
              as="button"
              onClick={scrollToTop}
              aria-label="Kembali ke atas"
              className="w-12 h-12 rounded-full footer-glass-pill flex items-center justify-center text-[#C9A84C] hover:text-white group order-3 border-[rgba(201,168,76,0.3)] shadow-[0_0_15px_rgba(201,168,76,0.2)]"
            >
              <svg className="w-5 h-5 transform group-hover:-translate-y-1.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
              </svg>
            </MagneticButton>

          </div>
        </footer>
      </div>
    </>
  );
}

export default CinematicFooter;
