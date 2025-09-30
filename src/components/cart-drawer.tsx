"use client";
import { useCart } from "@/context/cart-context";
import { buildCartWhatsAppLink } from "@/config";
import Image from "next/image";
import Link from "next/link";
import { buttonStyles } from "./ui/button";

export function CartTrigger() {
  const { items, setOpen } = useCart();
  const count = items.reduce((n, i) => n + i.qty, 0);
  return (
    <button
      onClick={() => setOpen(true)}
      className="relative inline-flex items-center p-1 hover:opacity-80 transition"
      aria-label="Abrir carrito"
    >
      <Image src="/iconos/cart.svg" alt="Carrito" width={26} height={26} priority />
      {count > 0 && (
        <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-emerald-500 px-1 text-xs font-semibold text-white">
          {count}
        </span>
      )}
    </button>
  );
}

export function CartDrawer() {
  const { items, remove, clear, subtotal, open, setOpen } = useCart();
  const link = buildCartWhatsAppLink(items, subtotal);
  return (
    <div
      className={`fixed inset-0 z-50 ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        onClick={() => setOpen(false)}
      />
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-white p-6 shadow-xl transition-transform dark:bg-[#111] ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Tu carrito</h2>
          <button onClick={() => setOpen(false)} className="text-sm text-foreground/60 hover:text-foreground">
            Cerrar
          </button>
        </div>
        {items.length === 0 ? (
          <p className="text-sm text-foreground/60">Aún no agregaste diseños.</p>
        ) : (
          <ul className="flex flex-col gap-4 overflow-y-auto pr-2" style={{ maxHeight: "55vh" }}>
            {items.map((i) => (
              <li key={`${i.slug}-${i.phoneModel || 'default'}`} className="flex gap-4">
                <div className="relative h-20 w-16 overflow-hidden rounded-lg border border-black/10">
                  <Image src={i.image} alt={i.name} fill className="object-cover" />
                </div>
                <div className="flex-1 text-sm">
                  <p className="font-medium leading-tight">{i.name}</p>
                  <p className="mt-0.5 text-foreground/60">x{i.qty}</p>
                  {i.phoneModel && (
                    <p className="mt-0.5 text-xs text-foreground/60">Modelo: {i.phoneModel}</p>
                  )}
                  <p className="mt-1 font-semibold">${(i.price * i.qty).toFixed(2)}</p>
                  <button
                    onClick={() => remove(i.slug, i.phoneModel)}
                    className="mt-1 text-xs text-red-600 hover:underline"
                  >
                    Quitar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-6 border-t pt-4">
          <div className="flex items-center justify-between text-sm">
            <span>Subtotal</span>
            <span className="font-semibold">${subtotal.toFixed(2)}</span>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className={buttonStyles({ variant: "primary" })}
            >
              Comprar por WhatsApp
            </a>
            <p className="text-[11px] leading-snug text-foreground/60 -mt-1">
              * Un asesor te escribirá para confirmar modelo y método de pago (transferencia o tarjeta) antes de finalizar.
            </p>
            {items.length > 0 && (
              <button
                onClick={clear}
                className={buttonStyles({ variant: "outline" })}
              >
                Vaciar carrito
              </button>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}