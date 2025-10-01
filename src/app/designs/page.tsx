import { SectionHeading } from "@/components/section-heading";
import { fetchDesigns } from "@/lib/strapi";
import { DesignsGridClient } from "@/components/designs-grid-client";

export const metadata = {
  title: "Designs",
  description: "Todos los diseños de VISIONIQ",
};

export const revalidate = 60;

export default async function DesignsPage() {
  const designs = await fetchDesigns();
  const sorted = [...designs].sort((a,b)=>{
    const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return db - da;
  });
  return (
    <main className="pb-24 pt-28">
      <SectionHeading
        eyebrow="Diseños"
        title="Todos los diseños"
        subtitle="Explora todos los estilos. Algunos pertenecen a colecciones, otros son piezas individuales."
      />
      <DesignsGridClient designs={sorted} />
    </main>
  );
}
