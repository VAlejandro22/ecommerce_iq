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
    <div className="mx-auto max-w-7xl px-6">
      {eyebrow && (
        <div className="mb-2 inline-flex items-center gap-2 text-sm text-foreground/70">
          <span className="inline-block h-3 w-3 rounded-sm bg-emerald-500" />
          <span>{eyebrow}</span>
        </div>
      )}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-3 max-w-2xl text-foreground/70">{subtitle}</p>
          )}
        </div>
        {actions}
      </div>
    </div>
  );
}
