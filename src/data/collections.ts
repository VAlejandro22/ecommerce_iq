export type Collection = {
  slug: string;
  name: string;
  description?: string;
  image: string;
};

export const collections: Collection[] = [
  {
    slug: "neon",
    name: "Neon",
    description: "Colores vibrantes y acentos que destacan.",
    image: "/collections/neon.jpg",
  },
  {
    slug: "minimal",
    name: "Minimal",
    description: "Líneas limpias y sobrias para un look elegante.",
    image: "/collections/minimal.jpg",
  },
  {
    slug: "soft",
    name: "Soft",
    description: "Tonos pastel y texturas suaves.",
    image: "/collections/soft.jpg",
  },
  {
    slug: "vintage",
    name: "Vintage",
    description: "Estética retro y colores desaturados.",
    image: "/collections/vintage.jpg",
  },
];
