"use client";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";
import { CloseIcon, MenuIcon, PhoneIcon, SunIcon } from "./icons";
import { cn } from "@/lib/cn";
import { CartTrigger, CartDrawer } from "./cart-drawer";

export function SiteHeader() {
  const [open, setOpen] = React.useState(false);
  return (
    <header className="fixed left-0 right-0 top-4 z-40 flex justify-center">
      <div className="flex h-20 w-11/12 items-center gap-6 rounded-full bg-background/90 px-6 shadow-md backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <Link href="/" className="flex items-center gap-2">
          {/* <div className="h-8 w-8 rounded-xl bg-foreground/90 text-background grid place-items-center">
            <span className="text-sm font-bold">V</span>
          </div>
          <span className="font-semibold">VISIONIQ</span> */}
          <Image
            src="/logo.png"
            alt="Logo"
            width={120}
            height={40}
            className="object-contain"
          />
        </Link>

        <div className="ml-auto flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4 text-sm text-foreground/80">
            <a
              href="https://www.instagram.com/vision.iq_ec"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-foreground"
            >
              <Image src="/iconos/instagram.svg" alt="Instagram" width={20} height={20} />
              <span className="hidden sm:inline">@vision.iq_ec</span>
            </a>
            <a
              href="https://www.tiktok.com/@visioniq_ec"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-foreground"
            >
              <Image src="/iconos/tiktok.svg" alt="TikTok" width={20} height={20} />
              <span className="hidden sm:inline">@visioniq_ec</span>
            </a>
            </div>
          <CartTrigger />
          <Button
            variant="outline"
            className="flex items-center gap-2 bg-foreground text-background hover:bg-foreground/90"
            onClick={() => setOpen(true)}
          >
            <MenuIcon className="h-5 w-5" />
            <span className="font-semibold">Menu</span>
          </Button>
        </div>
      </div>

      {/* Overlay Menu */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/60 transition-opacity",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setOpen(false)}
      />
      <aside
        className={cn(
          "fixed right-0 top-0 z-50 h-full w-[85%] max-w-md bg-[#0f1613] text-white p-8 transition-transform",
          open ? "translate-x-0" : "translate-x-full"
        )}
        aria-hidden={!open}
      >
        <button
          className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white text-black"
          onClick={() => setOpen(false)}
        >
          <CloseIcon className="h-5 w-5" />
        </button>
        <nav className="mt-12 flex flex-col gap-6">
          {[
            { href: "/", label: "Home" },
            { href: "/designs", label: "Diseños" },
            { href: "/collections", label: "Colecciones" },
            // { href: "/contact", label: "Contacto" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-3xl font-medium text-white/80 hover:text-emerald-400"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        {/* <div className="mt-8 flex gap-3">
          <Button className="bg-emerald-500 hover:bg-emerald-600">Sign In</Button>
          <Button variant="outline" className="border-emerald-500 text-emerald-400">
            Sign up
          </Button>
        </div> */}
      </aside>
      <CartDrawer />
    </header>
  );
}
