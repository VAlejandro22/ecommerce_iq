"use client";
import { useEffect } from "react";

export default function LoadingCollectionDetail() {
  useEffect(() => {
    // Lock scroll on body only to prevent mobile browsers from hiding fixed overlays
    const style = document.body.style;
    const prevBodyOverflow = style.overflow;
    const prevBodyOverscroll = style.getPropertyValue("overscroll-behavior");
    style.overflow = "hidden";
    style.setProperty("overscroll-behavior", "contain");
    return () => {
      style.overflow = prevBodyOverflow;
      if (prevBodyOverscroll) {
        style.setProperty("overscroll-behavior", prevBodyOverscroll);
      } else {
        style.removeProperty("overscroll-behavior");
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
      <div role="status" aria-live="polite" aria-busy="true" className="flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/25 border-t-white" aria-hidden="true" />
      </div>
    </div>
  );
}
