import { SectionHeading } from "@/components/section-heading";
import { CollectionCard } from "@/components/collection-card";
import { fetchCollectionsPage } from "@/lib/strapi";

export const metadata = {
  title: "Collections",
  description: "Explora las colecciones de VISIONIQ",
};

export const revalidate = 60; // ISR

interface CollectionsPageParams { searchParams: Promise<{ page?: string }> }

export default async function CollectionsPage(props: CollectionsPageParams) {
  const { searchParams } = props;
  const resolved = await searchParams;
  const page = Number(resolved?.page || '1') || 1;
  const { collections, pagination } = await fetchCollectionsPage(page, 24);
  const { page: currentPage, pageCount } = pagination;
  const createPageLink = (p: number) => `/collections${p === 1 ? '' : `?page=${p}`}`;
  const windowSize = 5;
  const start = Math.max(1, currentPage - Math.floor(windowSize/2));
  const end = Math.min(pageCount, start + windowSize - 1);
  const pages: number[] = [];
  for (let i = start; i <= end; i++) pages.push(i);
  return (
    <main className="pb-24 pt-28">
      <SectionHeading
        eyebrow="Colecciones"
        title="Explora nuestras colecciones"
        subtitle="Cada colección representa una estética distinta para combinar con tu estilo."
      />
      <div className="mx-auto mt-8 grid max-w-7xl grid-cols-1 gap-6 px-6 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((c) => (
          <CollectionCard key={c.id} collection={{
            name: c.name,
            description: c.description || undefined,
            image: c.image || "/placeholder.png",
            slug: c.id,
          }} href={`/collections/${c.id}`} />
        ))}
      </div>
      {pageCount > 1 && (
        <nav className="mx-auto mt-12 flex max-w-7xl items-center justify-center gap-2 px-6" aria-label="Paginación de colecciones">
          <a
            href={currentPage > 1 ? createPageLink(currentPage - 1) : undefined}
            aria-disabled={currentPage === 1}
            className={`px-3 py-2 text-sm rounded-md border border-foreground/20 ${currentPage === 1 ? 'cursor-not-allowed opacity-40' : 'hover:bg-foreground/5'}`}
          >Prev</a>
          {pages[0] > 1 && (
            <a href={createPageLink(1)} className="px-3 py-2 text-sm rounded-md border border-foreground/20 hover:bg-foreground/5">1</a>
          )}
          {pages[0] > 2 && <span className="px-2 text-sm">…</span>}
          {pages.map(p => (
            <a
              key={p}
              href={createPageLink(p)}
              aria-current={p === currentPage ? 'page' : undefined}
              className={`px-3 py-2 text-sm rounded-md border border-foreground/20 ${p === currentPage ? 'bg-foreground text-background' : 'hover:bg-foreground/5'}`}
            >{p}</a>
          ))}
          {pages[pages.length -1] < pageCount -1 && <span className="px-2 text-sm">…</span>}
          {pages[pages.length -1] < pageCount && (
            <a href={createPageLink(pageCount)} className="px-3 py-2 text-sm rounded-md border border-foreground/20 hover:bg-foreground/5">{pageCount}</a>
          )}
          <a
            href={currentPage < pageCount ? createPageLink(currentPage + 1) : undefined}
            aria-disabled={currentPage === pageCount}
            className={`px-3 py-2 text-sm rounded-md border border-foreground/20 ${currentPage === pageCount ? 'cursor-not-allowed opacity-40' : 'hover:bg-foreground/5'}`}
          >Next</a>
        </nav>
      )}
    </main>
  );
}
