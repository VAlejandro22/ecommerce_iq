"use client";

import React, { useRef, useState, useEffect } from "react";
import { ProductCard } from "./product-card";
import { NormalizedDesign } from "@/lib/strapi";

interface CollectionCarouselProps {
  designs: NormalizedDesign[];
  collectionName: string;
}

export function CollectionCarousel({ designs, collectionName }: CollectionCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Check scroll position to show/hide arrows
  const checkScroll = () => {
    const el = containerRef.current;
    if (!el) return;

    setShowLeftArrow(el.scrollLeft > 10);
    // Allow a small tolerance for rounding issues
    setShowRightArrow(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      // Run once initially and on window resize
      checkScroll();
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      if (el) {
        el.removeEventListener("scroll", checkScroll);
      }
      window.removeEventListener("resize", checkScroll);
    };
  }, [designs]);

  const scroll = (direction: "left" | "right") => {
    const el = containerRef.current;
    if (!el) return;

    // Scroll by 80% of the visible container width
    const scrollAmount = el.clientWidth * 0.8;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (!designs || designs.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-foreground/55">
        No hay diseños en esta colección todavía.
      </div>
    );
  }

  return (
    <div className="group/carousel relative w-full">
      {/* Left Arrow Button */}
      {showLeftArrow && (
        <button
          onClick={() => scroll("left")}
          className="absolute -left-3 top-[40%] z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-lg hover:scale-105 active:scale-95 transition dark:bg-zinc-900 dark:text-white border border-foreground/10"
          aria-label="Ver anteriores"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
      )}

      {/* Right Arrow Button (Neon Yellow/Lime style matching mockup) */}
      {showRightArrow && (
        <button
          onClick={() => scroll("right")}
          className="absolute -right-3 top-[40%] z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-[#d4ff00] text-black shadow-xl hover:scale-105 active:scale-95 transition"
          aria-label="Ver más"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      )}

      {/* Horizontal Scrollable Container */}
      <div
        ref={containerRef}
        className="scrollbar-none flex w-full gap-6 overflow-x-auto snap-x snap-mandatory px-2 py-4 scroll-smooth"
      >
        {designs.map((design) => (
          <div
            key={design.id}
            className="w-[280px] sm:w-[300px] md:w-[320px] shrink-0 snap-start"
          >
            <ProductCard
              minimal={false}
              product={{
                slug: design.id,
                name: design.name,
                price: design.price,
                image: design.image || "/placeholder.png",
                collection: collectionName || design.collection?.name || "",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
