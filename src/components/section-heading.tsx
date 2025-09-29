import React from "react";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-7xl px-6 text-center">
      {eyebrow && (
      <div className="mb-4 inline-flex items-center justify-center gap-2 text-sm font-semibold text-foreground/70">
        <span className="inline-block h-3 w-3 rounded-sm bg-emerald-500" />
        <span>{eyebrow}</span>
      </div>
      )}
      <div className="flex flex-col items-center gap-6">
      <div>
        <h2 className="text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
        {title}
        </h2>
        {subtitle && (
        <p className="mt-3 max-w-2xl text-foreground/70 mx-auto">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex justify-center">{actions}</div>}
      </div>
    </div>
  );
}
