import { SectionHeading } from "@/components/section-heading";
import { CollectionCard } from "@/components/collection-card";
import { fetchCollections } from "@/lib/strapi";

export const metadata = {
  title: "Collections",
  description: "Explora las colecciones de CaseWave",
};

export const revalidate = 60; // ISR

export default async function CollectionsPage() {
  const collections = await fetchCollections();
  return (
    <main className="pb-24 pt-28">
      <SectionHeading
        eyebrow="Colecciones"
        title="Explora nuestras colecciones"
        subtitle="Cada colección representa una estética distinta para combinar con tu estilo."
      />

      {/* Grid de colecciones */}
      <div className="mx-auto mt-8 grid max-w-7xl grid-cols-1 gap-6 px-6 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((c) => (
          <CollectionCard key={c.id} collection={{
            name: c.name,
            description: c.description || undefined,
            image: c.image || "/placeholder.png",
            slug: c.id, // using documentId directly
          }} href={`/collections/${c.id}`} />
        ))}
      </div>
    </main>
  );
}
