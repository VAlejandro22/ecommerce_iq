import { notFound } from "next/navigation";
import { fetchDesign } from "@/lib/strapi";
import { DetailClient } from "./detail-client";

export const revalidate = 60;

export async function generateStaticParams() {
  // We could pre-build some designs later; for now return empty to use on-demand ISR.
  return [];
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const d = await fetchDesign(params.slug);
    return { title: `${d.name} — Diseño`, description: d.description?.slice(0,160) };
  } catch {
    return {};
  }
}

export default async function DesignDetail({ params }: { params: { slug: string } }) {
  let design;
  try {
    design = await fetchDesign(params.slug);
  } catch {
    return notFound();
  }

  const collectionData = design.collection ? {
    name: design.collection.name || '',
    description: design.collection.description || undefined,
    image: design.collection.image || '/placeholder.png',
    slug: design.collection.id,
  } : undefined;

  const product = {
    slug: design.id,
    name: design.name,
    price: design.price,
    image: design.image || '/placeholder.png',
    collection: design.collectionId,
  };

  return <DetailClient product={product} collection={collectionData} />;
}
