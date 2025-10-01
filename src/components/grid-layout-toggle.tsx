"use client";
import React from 'react';
import { cn } from '@/lib/cn';

interface Props {
  value: number;
  onChange: (v: number) => void;
  className?: string;
  options?: number[]; // allowed column counts (e.g. [2,3,4])
  includeLabels?: boolean;
}

// Minimal icon button: draws 1,2,3 layout variants via inline SVG blocks
export function GridLayoutToggle({ value, onChange, className, options = [1,2,3], includeLabels = false }: Props) {
  const mapped = options.map(o => ({ cols: o, label: `${o} por fila`, slots: o }));

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-foreground/20 bg-white px-2 py-1 dark:bg-[#111] dark:border-white/15',
        className
      )}
      role="radiogroup"
      aria-label="Elegir columnas"
    >
      {mapped.map((opt) => {
        const active = value === opt.cols;
        return (
          <button
            key={opt.cols}
            type="button"
            onClick={() => onChange(opt.cols)}
            role="radio"
            aria-checked={active}
            title={opt.label}
            className={cn(
              'relative grid h-8 w-8 place-items-center rounded-full transition',
              active
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'text-foreground/70 hover:bg-foreground/10'
            )}
          >
            <LayoutIcon slots={opt.slots} active={active} />
          </button>
        );
      })}
    </div>
  );
}

function LayoutIcon({ slots, active }: { slots: number; active: boolean }) {
  const base = 'currentColor';
  const rects: React.ReactElement[] = [];
  const gap = 2;
  const size = 16; // icon canvas 24, leaving padding
  if (slots <= 6) {
    const totalGap = gap * (slots - 1);
    const colW = (size - totalGap) / slots;
    for (let i = 0; i < slots; i++) {
      rects.push(
        <rect
          key={i}
          x={4 + i * (colW + gap)}
          y={4}
          width={colW}
          height={16}
          rx={1.5}
          fill={base}
          opacity={active ? 1 : 0.65}
        />
      );
    }
  } else {
    // fallback: show a filled rectangle
    rects.push(<rect key="all" x={4} y={4} width={16} height={16} rx={2} fill={base} opacity={active ? 1 : 0.65} />);
  }
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" aria-hidden="true">
      {rects}
    </svg>
  );
}
