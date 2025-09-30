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
  const [mode, setMode] = React.useState<"iphone" | "otros" | null>(null);
  const [iphoneModel, setIphoneModel] = React.useState("");
  const [otherModel, setOtherModel] = React.useState("");

  const iphoneModels = React.useMemo(
    () => [
      "iPhone 11","iPhone 11 Pro","iPhone 11 Pro Max",
      "iPhone 12","iPhone 12 Mini","iPhone 12 Pro","iPhone 12 Pro Max",
      "iPhone 13","iPhone 13 Mini","iPhone 13 Pro","iPhone 13 Pro Max",
      "iPhone 14","iPhone 14 Plus","iPhone 14 Pro","iPhone 14 Pro Max",
      "iPhone 15","iPhone 15 Plus","iPhone 15 Pro","iPhone 15 Pro Max",
      "iPhone 16","iPhone 16 Plus","iPhone 16 Pro","iPhone 16 Pro Max",
      "iPhone 17","iPhone Air","iPhone 17 Pro","iPhone 17 Pro Max"
    ],
    []
  );

  const selectedModel = mode === 'iphone' ? iphoneModel : mode === 'otros' ? otherModel : '';
  const canAdd = !!selectedModel;

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

            {/* Selector de modelo */}
            <div className="mt-6 space-y-4">
              <div className="flex gap-3">
                <button
                  onClick={() => { setMode('iphone'); setOtherModel(''); }}
                  className={buttonStyles({ variant: mode === 'iphone' ? 'primary' : 'outline' })}
                  type="button"
                >
                  iPhone
                </button>
                <button
                  onClick={() => { setMode('otros'); setIphoneModel(''); }}
                  className={buttonStyles({ variant: mode === 'otros' ? 'primary' : 'outline' })}
                  type="button"
                >
                  Otros
                </button>
              </div>
              {mode === 'iphone' && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Modelo de iPhone</label>
                  <select
                    value={iphoneModel}
                    onChange={(e) => setIphoneModel(e.target.value)}
                    className="w-full rounded-md border border-black/20 bg-white p-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-[#1a1a1a]"
                  >
                    <option value="">Selecciona un modelo</option>
                    {iphoneModels.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              )}
              {mode === 'otros' && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Modelo de tu celular</label>
                  <input
                    type="text"
                    value={otherModel}
                    onChange={(e) => setOtherModel(e.target.value)}
                    placeholder="Ej: Samsung Galaxy S24"
                    className="w-full rounded-md border border-black/20 bg-white p-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-[#1a1a1a]"
                  />
                  <p className="text-xs text-foreground/60">Antes de proceder con el pago, un asesor confirmará si hay stock para ese modelo.</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                disabled={!canAdd}
                onClick={() => canAdd && add({ slug: p.slug, name: p.name, price: p.price, image: p.image, phoneModel: selectedModel })}
                className={buttonStyles({ variant: "primary" }) + (canAdd ? '' : ' opacity-50 pointer-events-none')}
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
