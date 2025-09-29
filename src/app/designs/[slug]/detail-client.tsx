"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { buttonStyles } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import { Collection } from "@/data/collections";
import { CollectionCard } from "@/components/collection-card";

export interface DetailClientProps {
  product: {
    slug: string;
    name: string;
    price: number;
    image: string;
    collection?: string | null;
  };
  collection?: Collection;
}

export function DetailClient({ product: p, collection }: DetailClientProps) {
  const { add } = useCart();

  return (
    <main className="pb-24 pt-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-black/10 bg-white">
            <Image src={p.image || '/placeholder.png'} alt={p.name} fill className="object-cover" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold sm:text-4xl">{p.name}</h1>
            <p className="mt-2 text-2xl font-bold">${p.price.toFixed(2)}</p>

            {collection ? (
              <p className="mt-2 text-sm text-foreground/70">
                Pertenece a la colección {" "}
                <Link
                  href={`/collections/${collection.slug}`}
                  className="font-medium text-emerald-600 underline-offset-4 hover:underline"
                >
                  {collection.name}
                </Link>
              </p>
            ) : (
              <p className="mt-2 text-sm text-foreground/70">Este diseño no pertenece a ninguna colección.</p>
            )}

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => add({ slug: p.slug, name: p.name, price: p.price, image: p.image })}
                className={buttonStyles({ variant: "primary" })}
              >
                Añadir al carrito
              </button>
              {collection && (
                <Link
                  href={`/collections/${collection.slug}`}
                  className={buttonStyles({ variant: "outline" })}
                >
                  Ver colección
                </Link>
              )}
            </div>
            {collection && (
              <div className="mt-10">
                {/* <h2 className="mb-4 text-lg font-medium">Colección relacionada</h2> */}
                <div className="">
                  <CollectionCard
                    collection={collection}
                    href={`/collections/${collection.slug}`}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
