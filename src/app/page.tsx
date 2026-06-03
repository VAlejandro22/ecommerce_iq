import Link from "next/link";
import { EcuadorianHero } from "@/components/ecuadorian-hero";
import { CollectionSection } from "@/components/collection-section";
import { CollectionCarousel } from "@/components/collection-carousel";
import { fetchCollectionsWithDesigns, fetchDesignsPage } from "@/lib/strapi";

export const revalidate = 60;

export default async function Home() {
  // Fetch collections populated with their designs, and the 10 latest designs
  const [collections, designsResult] = await Promise.all([
    fetchCollectionsWithDesigns(),
    fetchDesignsPage(1, 10),
  ]);

  // Slice to get only the 5 latest collections
  const latestFiveCollections = collections.slice(0, 5);
  const latestTenDesigns = designsResult.designs;

  return (
    <div className="min-h-screen">
      <EcuadorianHero />

      {/* Nuevos Arribos (Latest 10 Designs Carousel) */}
      {latestTenDesigns.length > 0 && (
        <div className="w-full bg-white dark:bg-white text-black py-10">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-2 flex items-baseline justify-between border-b border-black/15 pb-4">
              <h3 className="text-lg sm:text-xl md:text-2xl font-black uppercase tracking-wider text-black">
                NUEVOS ARRIVOS
              </h3>
              <Link
                href="/designs"
                className="text-xs md:text-sm font-black uppercase tracking-widest underline decoration-2 underline-offset-4 hover:opacity-80 transition text-black"
              >
                VER TODOS
              </Link>
            </div>
            <CollectionCarousel designs={latestTenDesigns} collectionName="" />
          </div>
        </div>
      )}

      {/* Dynamic Collection Banners and Carousels */}
      <div className="pb-16 ">
        {latestFiveCollections.length === 0 ? (
          <div className="mx-auto max-w-7xl px-6 py-12 text-center text-foreground/60">
            No hay colecciones disponibles todavía.
          </div>
        ) : (
          latestFiveCollections.map(({ collection, designs }) => (
            <CollectionSection
              key={collection.id}
              collection={collection}
              designs={designs}
            />
          ))
        )}
      </div>
    </div>
  );
}

