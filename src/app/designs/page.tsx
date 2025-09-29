import { SectionHeading } from "@/components/section-heading";
import { ProductCard } from "@/components/product-card";
import { fetchDesigns } from "@/lib/strapi";

export const metadata = {
  title: "Designs",
  description: "Todos los diseños de CaseWave",
};

export const revalidate = 60;

export default async function DesignsPage() {
  const designs = await fetchDesigns();
  return (
    <main className="pb-24 pt-28">
      <SectionHeading
        eyebrow="Diseños"
        title="Todos los diseños"
        subtitle="Explora todos los estilos. Algunos pertenecen a colecciones, otros son piezas individuales."
      />
      <div className="mx-auto mt-8 grid max-w-7xl grid-cols-1 gap-6 px-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {designs.map((d) => (
          <ProductCard
            key={d.id}
            product={{
              slug: d.id,
              name: d.name,
              price: d.price,
              image: d.image || '/placeholder.png',
              collection: d.collectionId,
            }}
          />
        ))}
      </div>
    </main>
  );
}
