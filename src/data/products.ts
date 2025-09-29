import { Product } from "@/components/product-card";

export const trendingProducts: Product[] = [
  {
    slug: "neo-wave",
    name: "Neo Wave",
    price: 24.99,
    image: "/cases/case-1.jpg",
    collection: "neon",
  },
  {
    slug: "midnight-grid",
    name: "Midnight Grid",
    price: 22.0,
    image: "/cases/case-2.jpg",
    collection: "minimal",
  },
  {
    slug: "pastel-swirl",
    name: "Pastel Swirl",
    price: 21.5,
    image: "/cases/case-3.jpg",
    collection: "soft",
  },
  {
    slug: "retro-pop",
    name: "Retro Pop",
    price: 25.0,
    image: "/cases/case-4.jpg",
    collection: "vintage",
  }
];

export const newDrops: Product[] = [
  {
    slug: "glossy-mist",
    name: "Glossy Mist",
    price: 23.0,
    image: "/cases/case-5.jpg",
  },
  {
    slug: "aqua-ripple",
    name: "Aqua Ripple",
    price: 24.0,
    image: "/cases/case-6.jpg",
  },
  {
    slug: "sunset-glow",
    name: "Sunset Glow",
    price: 24.5,
    image: "/cases/case-7.jpg",
  },
];

// Unified list for convenience where a product may or may not have a collection
export const allProducts: Product[] = [
  ...trendingProducts,
  ...newDrops,
].filter((p, idx, arr) => arr.findIndex((x) => x.slug === p.slug) === idx);
