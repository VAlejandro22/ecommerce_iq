import Image from "next/image";
import Link from "next/link";

export type Product = {
  slug: string;
  name: string;
  price: number;
  image: string;
  collection?: string;
};

export function ProductCard({ product, minimal = false }: { product: Product; minimal?: boolean }) {
  const img = product.image || "/placeholder.png";
  return (
    <Link
      href={`/designs/${product.slug}`}
      className={
        `group block overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm transition hover:shadow-md ` +
        (minimal ? 'p-0' : '')
      }
    >
      <div className="relative aspect-[4/5] w-full">
        <Image
          src={img}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      {!minimal && (
        <div className="p-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate text-base font-medium">{product.name}</h3>
          </div>
          <span className="text-sm font-semibold">${product.price.toFixed(2)}</span>
          {product.collection && (
            <p className="mt-1 text-xs text-foreground/60">Colección: {product.collection}</p>
          )}
        </div>
      )}
    </Link>
  );
}
