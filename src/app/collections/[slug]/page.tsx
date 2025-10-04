import { SectionHeading } from "@/components/section-heading";
import { ProductCard } from "@/components/product-card";
import Image from "next/image";
import { notFound } from "next/navigation";
import { fetchCollection, fetchCollections } from "@/lib/strapi";

export async function generateStaticParams() {
  const cols = await fetchCollections();
  return cols.map((c) => ({ slug: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolved = await params;
  // Metadata will be refined in page using dynamic fetch if needed.
  // Here minimal info to avoid extra fetch; full description inside component.
  return { title: `Colección ${resolved.slug}` };
}

export const revalidate = 60;

export default async function CollectionDetail({ params }: { params: Promise<{ slug: string }> }) {
  const resolved = await params;
  let data;
  try {
    data = await fetchCollection(resolved.slug);
  } catch {
    return notFound();
  }
  const { collection: col, designs } = data;

  return (
    <main className="pb-24 pt-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative mb-10 overflow-hidden rounded-3xl">
          {col.image && (
            <Image src={col.image} alt={col.name} width={1600} height={600} className="h-64 w-full object-cover md:h-80" />
          )}
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-end p-6 text-white">
            <div>
              <h1 className="text-4xl font-semibold md:text-5xl">{col.name}</h1>
              {col.description && (
                <p className="mt-2 max-w-2xl text-white/85">{col.description}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <SectionHeading
        eyebrow="Diseños"
        title={`Diseños de ${col.name}`}
        subtitle="Selecciona tu modelo y color favorito."
      />
      <div className="mx-auto mt-8 grid max-w-7xl grid-cols-1 gap-6 px-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {designs.length === 0 ? (
          <p className="col-span-full text-foreground/70">
            Aún no hay diseños asignados a esta colección.
          </p>
        ) : (
          designs.map((d) => (
            <ProductCard
              key={d.id}
              product={{
                slug: d.id,
                name: d.name,
                price: d.price,
                image: d.image || '/placeholder.png',
                collection: col.name,
              }}
            />
          ))
        )}
      </div>
    </main>
  );
}
