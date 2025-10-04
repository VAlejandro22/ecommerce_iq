import { SectionHeading } from "@/components/section-heading";
import { fetchDesignsPage } from "@/lib/strapi";
import { DesignsGridClient } from "@/components/designs-grid-client";

export const metadata = {
  title: "Designs",
  description: "Todos los diseños de VISIONIQ",
};

export const revalidate = 60;

interface DesignsPageParams { searchParams: Promise<{ page?: string }> }

export default async function DesignsPage(props: DesignsPageParams) {
  const { searchParams } = props;
  const resolved = await searchParams;
  const page = Number(resolved?.page || '1') || 1;
  const { designs, pagination } = await fetchDesignsPage(page, 24);
  const { page: currentPage, pageCount } = pagination;
  const createPageLink = (p: number) => `/designs${p === 1 ? '' : `?page=${p}`}`;
  const windowSize = 5;
  const start = Math.max(1, currentPage - Math.floor(windowSize/2));
  const end = Math.min(pageCount, start + windowSize - 1);
  const pages: number[] = [];
  for (let i = start; i <= end; i++) pages.push(i);
  return (
    <main className="pb-24 pt-28">
      <SectionHeading
        eyebrow="Diseños"
        title="Todos los diseños"
        subtitle="Explora todos los estilos. Algunos pertenecen a colecciones, otros son piezas individuales."
      />
      <DesignsGridClient designs={designs} />
      {pageCount > 1 && (
        <nav className="mx-auto mt-12 flex max-w-7xl items-center justify-center gap-2 px-6" aria-label="Paginación de diseños">
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
