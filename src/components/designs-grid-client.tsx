"use client";
import React from 'react';
import { ProductCard } from '@/components/product-card';
import { GridLayoutToggle } from '@/components/grid-layout-toggle';

interface DesignItem {
  id: string;
  name: string;
  price: number;
  image?: string | null;
  collection?: { name?: string } | null;
}

interface Props {
  designs: DesignItem[];
}

export function DesignsGridClient({ designs }: Props) {
  // Hydration-safe: render deterministic default (desktop 4) on server, adapt after mount.
  const [colPref, setColPref] = React.useState<number>(4);
  const [isMobile, setIsMobile] = React.useState<boolean>(false);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setHydrated(true);
    const apply = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);
      setColPref(prev => {
        // If we haven't explicitly changed yet (still default 4) and it's mobile, shift to mobile default 2
        if (prev === 4 && mobile) return 2;
        if (!mobile && (prev === 1 || prev === 3)) return 4; // normalize invalid desktop choices
        return prev;
      });
    };
    apply();
    window.addEventListener('resize', apply);
    return () => window.removeEventListener('resize', apply);
  }, []);

  const options = React.useMemo(() => (isMobile ? [1,2,3] : [2,4,6]), [isMobile]);

  // Ensure colPref stays within options after hydration changes
  React.useEffect(() => {
    if (!options.includes(colPref)) setColPref(options[0]);
  }, [options, colPref]);

  // Build responsive class string.
  // Mobile: exact colPref (1..3) => grid-cols-N
  // Desktop mapping:
  //   2 -> base 1 sm 2 md 2 lg 2
  //   4 -> base 1 sm 2 md 3 lg 4
  //   6 -> base 2 sm 3 md 4 lg 6 (progressive densification)
  const gridClass = React.useMemo(() => {
    // Safelist note for Tailwind (do not remove): grid-cols-1 grid-cols-2 grid-cols-3
    if (!hydrated) {
      return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
    }
    if (isMobile) {
      const mobile = Math.min(Math.max(colPref,1),3);
      if (mobile === 1) return 'grid-cols-1';
      if (mobile === 2) return 'grid-cols-2';
      return 'grid-cols-3';
    }
    switch (colPref) {
      case 2:
        return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2';
      case 6:
        return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6';
      case 4:
      default:
        return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
    }
  }, [colPref, isMobile, hydrated]);

  const isMaxDensity = hydrated && ((isMobile && colPref === 3) || (!isMobile && colPref === 6));

  return (
    <div className="mx-auto mt-8 max-w-7xl px-6">
      <div className="flex items-center justify-end">
  <GridLayoutToggle value={colPref} onChange={setColPref} options={options} />
      </div>
      <div className={`mt-4 grid gap-6 ${gridClass}`}>
        {designs.map((d) => (
          <ProductCard
            key={d.id}
            product={{
              slug: d.id,
              name: d.name,
              price: d.price,
              image: d.image || '/placeholder.png',
              collection: d.collection?.name,
            }}
            minimal={isMaxDensity}
          />
        ))}
      </div>
    </div>
  );
}
