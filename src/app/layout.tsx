import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { CartProvider } from "@/context/cart-context";
import { Analytics } from "@vercel/analytics/next"
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "VISIONIQ - Cases en tendencia",
    template: "%s • VISIONIQ",
  },
  description:
    "Discover stylish, protective phone cases. New drops and curated collections for iPhone, Samsung and more.",
};

export const viewport = {
  colorScheme: "light" as const,
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
  themeColor: "#ffffff",
};

import { SiteFooter } from "@/components/site-footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CartProvider>
          <SiteHeader />
          
          <main className="min-h-[85dvh]">
            {children}
          </main>

          <SiteFooter />
        </CartProvider>
        <Analytics />
      </body>
    </html>
  );
}
