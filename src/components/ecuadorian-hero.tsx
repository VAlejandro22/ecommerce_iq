"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "./ui/button";

// Global cache variables to prevent re-loading on route changes
let preloadedImagesGlobal: HTMLImageElement[] = [];
let hasLoadedOnceGlobal = false;

export function EcuadorianHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [easedProgress, setEasedProgress] = useState(0);
  const progressRef = useRef(0);

  // Preloader State
  const totalFrames = 185;
  const [imagesLoaded, setImagesLoaded] = useState(hasLoadedOnceGlobal ? totalFrames : 0);
  const [isLoading, setIsLoading] = useState(!hasLoadedOnceGlobal);
  const imagesRef = useRef<HTMLImageElement[]>(hasLoadedOnceGlobal ? preloadedImagesGlobal : []);

  // 1. Preload all 192 frame files
  useEffect(() => {
    if (hasLoadedOnceGlobal) {
      setIsLoading(false);
      return;
    }

    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = [];

    for (let i = 0; i < totalFrames; i++) {
      const img = new window.Image();
      img.src = `/frames/frame_${i}.webp`;
      img.onload = () => {
        loadedCount++;
        setImagesLoaded(loadedCount);
        if (loadedCount === totalFrames) {
          hasLoadedOnceGlobal = true;
          preloadedImagesGlobal = loadedImages;
          setIsLoading(false);
        }
      };
      img.onerror = () => {
        // Fallback or retry on error
        loadedCount++;
        setImagesLoaded(loadedCount);
        if (loadedCount === totalFrames) {
          hasLoadedOnceGlobal = true;
          preloadedImagesGlobal = loadedImages;
          setIsLoading(false);
        }
      };
      loadedImages.push(img);
    }
    imagesRef.current = loadedImages;
  }, []);

  // 2. Scroll Progress Tracker
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalHeight = rect.height - window.innerHeight;
      if (totalHeight <= 0) return;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / totalHeight));
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    setTimeout(handleScroll, 100);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 3. Easing Inertia Loop
  useEffect(() => {
    progressRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    let animationFrameId: number;
    const updateEased = () => {
      setEasedProgress((prev) => {
        const diff = progressRef.current - prev;
        if (Math.abs(diff) < 0.0005) return progressRef.current;
        return prev + diff * 0.12; // Easing inertia coefficient
      });
      animationFrameId = requestAnimationFrame(updateEased);
    };
    animationFrameId = requestAnimationFrame(updateEased);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // 4. Draw cover-fitted Frame to Canvas
  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const frameIndex = Math.min(
      totalFrames - 1,
      Math.max(0, Math.floor(easedProgress * (totalFrames - 1)))
    );
    const img = imagesRef.current[frameIndex];

    if (img && img.complete) {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw with cover fitting (preserve aspect ratio)
      const wr = canvas.width / img.width;
      const hr = canvas.height / img.height;
      const ratio = Math.max(wr, hr);
      const x = (canvas.width - img.width * ratio) / 2;
      const y = (canvas.height - img.height * ratio) / 2;

      ctx.drawImage(
        img,
        0, 0, img.width, img.height,
        x, y, img.width * ratio, img.height * ratio
      );
    }
  }, [easedProgress]);

  // Canvas resize handler
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawFrame();
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [imagesLoaded, drawFrame]);

  // Redraw canvas whenever scroll eased progress updates
  useEffect(() => {
    drawFrame();
  }, [easedProgress, drawFrame]);

  // Dynamic style for text placard fade reveals
  const getCardStyle = (start: number, end: number) => {
    const fadeInStart = start;
    const fadeOutStart = end - 0.1;
    let cardOpacity = 0;
    let cardTranslateY = 40;

    if (easedProgress >= fadeInStart && easedProgress <= end) {
      if (easedProgress < fadeInStart + 0.1) {
        const p = (easedProgress - fadeInStart) / 0.1;
        cardOpacity = p;
        cardTranslateY = 40 - p * 40;
      } else if (easedProgress > fadeOutStart) {
        const p = (end - easedProgress) / 0.1;
        cardOpacity = p;
        cardTranslateY = 0 - (1 - p) * 20;
      } else {
        cardOpacity = 1;
        cardTranslateY = 0;
      }
    }

    return {
      opacity: cardOpacity,
      transform: `translate3d(0, ${cardTranslateY}px, 0)`,
      pointerEvents: cardOpacity > 0.3 ? ("auto" as const) : ("none" as const),
    };
  };


  // 5. Title fade & translate styles based on scroll progress
  const getTitleStyle = () => {
    // Fades out completely by 15% scroll progress
    const p = Math.min(1, easedProgress / 0.15);
    const opacity = 1 - p;
    const translateY = -p * 60;
    return {
      opacity,
      transform: `translate3d(0, ${translateY}px, 0)`,
      pointerEvents: opacity > 0.15 ? ("auto" as const) : ("none" as const),
    };
  };

  const scrollToCustomizer = () => {
    const customizerSection = document.getElementById("ecuadorian-shop");
    if (customizerSection) {
      customizerSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const loadingPercentage = Math.round((imagesLoaded / totalFrames) * 100);

  return (
    <div ref={containerRef} className="relative h-[300vh] w-full bg-stone-950">

      {/* 1. Museum Loader Block */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-stone-950 flex flex-col items-center justify-center text-white font-outfit px-6">
          <div className="text-center space-y-6 max-w-sm w-full">
            <span className="text-[#d4ff00] font-bold tracking-[0.25em] text-xs block uppercase">
              EXPOSICIÓN VISION IQ
            </span>
            <h3 className="text-3xl font-playfair tracking-tight uppercase">
              Cargando Obra de Arte
            </h3>

            {/* Elegant slider loading bar */}
            <div className="relative h-[2px] w-full bg-stone-800 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-[#d4ff00] transition-all duration-300 shadow-[0_0_10px_#10b981]"
                style={{ width: `${loadingPercentage}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-xs text-stone-500 font-bold">
              <span>EDICIÓN: ECUADORIAN</span>
              <span>{loadingPercentage}%</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Sticky Canvas Room */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between select-none">

        {/* Fullscreen Video Canvas Background */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        />

        {/* Ambient Dark Museum Tint Overlay */}
        <div className="absolute inset-0 bg-black/45 z-10 pointer-events-none" />

        {/* Lights & Ambient Effects */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[350px] h-[60vh] opacity-35 light-beam" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] rounded-full radial-glow-spotlight opacity-70" />
        </div>

        {/* Header Title inside museum - Curatorial Banner */}
        <div
          style={getTitleStyle()}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center px-6 text-center pointer-events-none select-none"
        >
          <p className="text-[#d4ff00] tracking-[0.25em] text-xs sm:text-sm font-bold font-outfit uppercase animate-pulse">
            EXHIBICIÓN EXCLUSIVA • NUEVA COLECCIÓN
          </p>
          <h2 className="text-5xl sm:text-8xl md:text-9xl font-black tracking-tighter text-white font-playfair uppercase mt-2 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
            ECUADORIAN
          </h2>
          <div className="h-[2px] w-36 bg-gradient-to-r from-transparent via-[#d4ff00] to-transparent mx-auto mt-6" />
        </div>

        {/* Floating cards at the sides */}
        <div className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-center px-4 sm:px-8 md:px-16 max-w-7xl mx-auto">

          {/* Card 1: Left - El Plátano Verde */}
          <div
            style={getCardStyle(0.12, 0.42)}
            className="absolute left-6 sm:left-12 md:left-24 max-w-[280px] sm:max-w-[340px] glass-museum-card p-6 rounded-2xl museum-card-shadow border border-[#d4ff00]/10 backdrop-blur-md"
          >
            <span className="text-[10px] font-bold text-[#d4ff00] tracking-[0.2em] font-outfit uppercase">
              SECCIÓN I • LA IDENTIDAD
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-playfair text-white mt-1">
              El Plátano Verde
            </h3>
            <p className="text-sm text-stone-300 font-outfit leading-relaxed mt-3">
              De las ricas costas del Ecuador a una obra de arte contemporánea. Símbolo del esfuerzo de nuestra gente trabajadora, de la sazón tradicional y del orgullo patrio.
            </p>
          </div>

          {/* Card 2: Right - La Irreverencia */}
          <div
            style={getCardStyle(0.39, 0.69)}
            className="absolute right-6 sm:right-12 md:right-24 max-w-[280px] sm:max-w-[340px] glass-museum-card p-6 rounded-2xl museum-card-shadow border border-[#d4ff00]/10 backdrop-blur-md"
          >
            <span className="text-[10px] font-bold text-[#d4ff00] tracking-[0.2em] font-outfit uppercase">
              SECCIÓN II • EL CONCEPTO
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-playfair text-white mt-1">
              &quot;Comedian&quot; de la Costa
            </h3>
            <p className="text-sm text-stone-300 font-outfit leading-relaxed mt-3">
              Inspirado en la célebre cinta y plátano de Maurizio Cattelan. Desafiamos el concepto del arte para gritar que nuestra cultura y cotidianidad ecuatoriana son hermosas obras de arte.
            </p>
          </div>

          {/* Card 3: Left/Center - El Relieve 3D */}
          <div
            style={getCardStyle(0.66, 0.94)}
            className="absolute left-6 sm:left-12 md:left-24 max-w-[280px] sm:max-w-[340px] glass-museum-card p-6 rounded-2xl museum-card-shadow border border-[#d4ff00]/10 backdrop-blur-md"
          >
            <span className="text-[10px] font-bold text-[#d4ff00] tracking-[0.2em] font-outfit uppercase">
              SECCIÓN III • EL ACABADO
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-playfair text-white mt-1">
              Vidrio Líquido 3D
            </h3>
            <p className="text-sm text-stone-300 font-outfit leading-relaxed mt-3">
              Disponible en <span className="font-bold">Liquid Case</span> y <span className="font-bold">Liquid Gel</span>. El plátano y la cinta de ducto tienen un relieve 3D que brilla con la luz y se siente al tacto.
            </p>
          </div>

        </div>

        {/* Footer Scroll Guide / CTA */}
        <div className="absolute bottom-8 left-0 right-0 z-30 flex flex-col items-center gap-2 text-stone-400 font-outfit pointer-events-none">
          {easedProgress < 0.88 ? (
            <div className="flex flex-col items-center animate-bounce">
              <span className="text-[10px] tracking-[0.15em] uppercase font-bold text-white-500">
                Desliza para explorar la obra
              </span>
              <svg className="w-5 h-5 mt-1 text-[#d4ff00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          ) : (
            <></>
          )}
        </div>

      </div>
    </div>
  );
}
