// "use client";
import React from "react";
import { cn } from "@/lib/cn";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
};

const base =
  "inline-flex items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

const variants: Record<string, string> = {
  primary: "bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc]",
  outline:
    "border border-black/10 dark:border-white/20 hover:bg-black/[.05] dark:hover:bg-white/[.06]",
  ghost: "hover:bg-black/[.05] dark:hover:bg-white/[.06]",
};

const sizes: Record<string, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-5 text-base",
  lg: "h-14 px-6 text-lg",
};

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: { variant?: keyof typeof variants; size?: keyof typeof sizes; className?: string } = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button className={buttonStyles({ variant, size, className })} {...props} />
  );
}
