"use client";
import Image from "next/image";
import Link from "next/link";
import { Collection } from "@/data/collections";

export function CollectionCard({ collection, href }: { collection: Collection; href: string }) {
  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm"
    >
      <div className="relative aspect-[4/3] w-full">
        <Image
          src={collection.image}
          alt={collection.name}
          fill
          sizes="(max-width:768px) 100vw, 400px"
          className="rounded-3xl object-cover brightness-95 transition duration-300 group-hover:scale-[1.03]"
          priority={false}
        />
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
          <h3 className="text-2xl font-semibold drop-shadow">{collection.name}</h3>
          {collection.description && (
            <p className="mt-1 max-w-md text-white/80 drop-shadow-sm">{collection.description}</p>
          )}
          <div className="mt-6 inline-flex w-max items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur">
            Ver diseños →
          </div>
        </div>
      </div>
    </Link>
  );
}
