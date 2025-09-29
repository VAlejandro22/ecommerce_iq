import { Hero } from "@/components/hero";
import { Hero2 } from "@/components/hero2";
import { SectionHeading } from "@/components/section-heading";
import { ProductCard } from "@/components/product-card";
import { fetchCollectionsWithDesigns, fetchDesigns } from "@/lib/strapi";

export const revalidate = 60;

export default async function Home() {
  // Fetch collections (with designs) sorted by launch date (desc) and pick the newest
  const collections = await fetchCollectionsWithDesigns();
  const latestCollection = collections[0];
  const trendingDesigns = latestCollection ? latestCollection.designs.slice(0, 8) : [];

  // Fetch all designs (already populated with collection) and pick latest 3 by createdAt
  const allDesigns = await fetchDesigns();
  const latestThree = [...allDesigns]
    .sort((a, b) => {
      const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return db - da; // newest first
    })
    .slice(0, 3);

  return (
    <div className="min-h-screen">
      <Hero />

      {/* Trending section */}
      <section className="py-16 md:py-24">
        <SectionHeading
          eyebrow="Trending"
          title={
            <>
              Explora las colecciones
              <br />
              en tendencia
            </>
          }
          subtitle="Diseños que están rompiendo en redes y calles. Ediciones limitadas y estilos que marcan diferencia."
        />
        <div className="mx-auto mt-8 grid max-w-7xl grid-cols-1 gap-6 px-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {trendingDesigns.length === 0 ? (
            <p className="text-sm text-foreground/60">No hay diseños aún.</p>
          ) : (
            trendingDesigns.map((d) => (
              <ProductCard
                key={d.id}
                product={{
                  slug: d.id,
                  name: d.name,
                  price: d.price,
                  image: d.image || '/placeholder.png',
                  collection: latestCollection?.collection.name,
                }}
              />
            ))
          )}
        </div>
      </section>
      <Hero2 />
      {/* New drops */}
      <section className="pb-20 md:pb-28 py-16 md:py-24">
        <SectionHeading
          eyebrow="Nuevos lanzamientos"
          title="Lo último que llegó"
          subtitle="Acabados premium, colores vibrantes y materiales resistentes para proteger tu teléfono con estilo."
        />
        <div className="mx-auto mt-8 grid max-w-7xl grid-cols-1 gap-6 px-6 sm:grid-cols-2 md:grid-cols-3">
          {latestThree.map((d) => (
            <ProductCard
              key={d.id}
              product={{
                slug: d.id,
                name: d.name,
                price: d.price,
                image: d.image || '/placeholder.png',
                collection: d.collection?.name,
              }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
