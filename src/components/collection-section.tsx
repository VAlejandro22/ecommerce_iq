import Image from "next/image";
import Link from "next/link";
import { CollectionCarousel } from "./collection-carousel";
import { NormalizedCollection, NormalizedDesign } from "@/lib/strapi";

interface CollectionSectionProps {
  collection: NormalizedCollection;
  designs: NormalizedDesign[];
}

export function CollectionSection({ collection, designs }: CollectionSectionProps) {
  const collectionUrl = `/collections/${collection.id}`;
  const bannerImage = collection.image || "/placeholder.png";

  return (
    <section className="w-full ">
      {/* 1. Large Collection Cover Banner (Edge-to-Edge) */}
      <Link href={collectionUrl} className="group block relative w-full overflow-hidden aspect-[3/4] md:aspect-[4/3] min-h-[250px] shadow-sm">
        {/* Mobile Cover Image (3:4 aspect) */}
        <div className="md:hidden absolute inset-0">
          <Image
            src={collection.portada_3_4 || bannerImage}
            alt={collection.name}
            fill
            sizes="100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            priority={false}
          />
        </div>

        {/* Desktop Cover Image (4:3 aspect) */}
        <div className="hidden md:block absolute inset-0">
          <Image
            src={collection.portada_4_3 || bannerImage}
            alt={collection.name}
            fill
            sizes="100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            priority={false}
          />
        </div>

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent transition-opacity duration-300 group-hover:opacity-95" />

        {/* Text bottom-left */}
        <div className="absolute bottom-0 left-0 p-8 md:p-12 flex flex-col justify-end text-white select-none pointer-events-none">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-wider drop-shadow-lg leading-tight">
            {collection.name}
          </h2>
          <span className="mt-3 inline-flex items-center gap-1.5 text-xs sm:text-sm font-black uppercase tracking-widest text-[#d4ff00]">
            COMPRAR AHORA
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="currentColor"
              className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform duration-300 group-hover:translate-x-1"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </span>
        </div>
      </Link>

      {/* Content wrapper with side padding and white background */}
      <div className="w-full bg-white dark:bg-white text-black py-10">
        <div className="mx-auto max-w-7xl px-6">
          {/* 2. Collection Header for Carousel */}
          <div className="mb-2 flex items-baseline justify-between border-b border-black/15 pb-4">
            <h3 className="text-lg sm:text-xl md:text-2xl font-black uppercase tracking-wider text-black">
              {collection.name}
            </h3>
            <Link
              href={collectionUrl}
              className="text-xs md:text-sm font-black uppercase tracking-widest underline decoration-2 underline-offset-4 hover:opacity-80 transition text-black"
            >
              VER TODOS
            </Link>
          </div>

          {/* 3. Horizontal Designs Carousel */}
          <CollectionCarousel designs={designs} collectionName={collection.name} />
        </div>
      </div>
    </section>
  );
}
