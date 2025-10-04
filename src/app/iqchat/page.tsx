import React from "react";
import { SectionHeading } from "@/components/section-heading";

export const metadata = {
  title: "IQchat",
  description: "Busca tu estuche con lenguaje natural (próximamente)",
};

export default function IQChatPage() {
  return (
    <main className="relative pb-24 pt-28">
      <SectionHeading
        eyebrow="IQchat"
        title={<>
          Encuentra tu estuche ideal con IA
        </>}
        subtitle={<>
          Describe lo que quieres: colores, formas, vibras o inspiración; nosotros te mostramos diseños que encajan.
        </>}
      />

      {/* Mobile simple UI: input on top and result cards below */}
      <div className="sm:hidden">
        <div className="mx-auto mt-6 w-full max-w-2xl px-4">
          <div className="flex items-end gap-2">
            <div className="relative flex-1">
              <input
                aria-label="Describe tu estuche ideal"
                placeholder="¿Qué estuche buscas? Colores, formas, vibra…"
                className="w-full rounded-xl border border-foreground/20 bg-background px-4 py-3 text-sm outline-none ring-emerald-500/30 transition focus:border-emerald-400/60 focus:ring-4 disabled:opacity-60"
                disabled
              />
            </div>
            <button className="rounded-xl bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-60" disabled>
              Buscar
            </button>
          </div>
        </div>

        <div className="mx-auto mt-5 w-full max-w-2xl px-4">
          <p className="text-xs text-foreground/60">Ejemplos: “estuche beige con ondas suaves”, “colores cálidos y orgánico”.</p>
        </div>

        <div className="mx-auto mt-4 w-full max-w-2xl px-4">
          <div className="grid grid-cols-2 gap-4">
            {[1,2].map((i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-foreground/15 bg-background shadow-sm">
                <div className="aspect-[4/5] w-full animate-pulse bg-foreground/5" />
                <div className="p-3">
                  <div className="h-3 w-3/5 animate-pulse rounded bg-foreground/10" />
                  <div className="mt-2 h-3 w-2/5 animate-pulse rounded bg-foreground/10" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Wrap content in a relative container so the overlay only covers the page body, not the global header */}
      <div className="relative mx-auto mt-10 hidden max-w-4xl px-6 sm:block">
        <div className="rounded-2xl border border-foreground/15 bg-background/80 shadow-sm backdrop-blur">
          {/* Messages area (mock) */}
          <div className="max-h-[420px] overflow-hidden px-4 py-6 sm:px-6">
            <div className="space-y-6">
              {/* User bubble (mock) */}
              <div className="flex justify-end">
                <div className="max-w-full sm:max-w-[80%] rounded-2xl rounded-br-sm bg-foreground text-background px-4 py-3 text-sm shadow">
                  Busco un estuche con vibra minimalista, colores tierra y formas orgánicas.
                </div>
              </div>
              {/* Assistant bubble (mock) */}
              <div className="flex justify-start">
                <div className="max-w-full sm:max-w-[85%] rounded-2xl rounded-bl-sm border border-foreground/15 bg-background px-4 py-3 text-sm shadow-sm">
                  Genial. Esto es lo que encontré basado en tu descripción…
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {/* Skeleton cards to hint results */}
                    {[1,2,3,4].map((i) => (
                      <div key={i} className="group relative overflow-hidden rounded-xl border border-foreground/15 bg-background shadow-sm">
                        <div className="h-24 sm:h-28 w-full animate-pulse bg-foreground/5" />
                        <div className="p-3">
                          <div className="h-3 w-3/5 animate-pulse rounded bg-foreground/10" />
                          <div className="mt-2 h-3 w-2/5 animate-pulse rounded bg-foreground/10" />
                        </div>
                        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Input area (mock, disabled) */}
          <div className="border-t border-foreground/10 p-4 sm:p-5">
            <div className="flex items-end gap-2">
              <div className="relative flex-1">
                <input
                  aria-label="Describe tu estuche ideal"
                  placeholder="Describe tu estuche ideal… (colores, formas, vibra)"
                  className="w-full rounded-xl border border-foreground/20 bg-background px-4 py-3 text-sm outline-none ring-emerald-500/30 transition focus:border-emerald-400/60 focus:ring-4 disabled:opacity-60"
                  disabled
                />
                {/* typing dots animation hint */}
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                  <span className="inline-flex items-center gap-1 text-foreground/40">
                    <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-foreground/50 [animation-delay:0ms]" />
                    <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-foreground/50 [animation-delay:120ms]" />
                    <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-foreground/50 [animation-delay:240ms]" />
                  </span>
                </div>
              </div>
              <button className="rounded-xl bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-60" disabled>
                Buscar
              </button>
            </div>
            <p className="mt-2 text-xs text-foreground/60">Sugerencias: “estuche beige con ondas suaves”, “colores cálidos y textura orgánica”, “estilo vaporwave minimal”.</p>
          </div>
        </div>
      </div>

      {/* Overlay for >= sm (desktop/tablet): scoped to chat container */}
      <div
        aria-hidden
        className="pointer-events-auto absolute inset-0 z-30 hidden place-items-center bg-black/60 backdrop-blur-sm sm:grid"
        style={{ WebkitBackdropFilter: "blur(4px)" }}
      >
        <div className="px-6 text-center">
          <h3 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
            Próximamente
          </h3>
          <p className="mt-3 max-w-xl text-white/80">
            Estamos preparando IQchat para ayudarte a encontrar el estuche perfecto para ti y tu celular.
          </p>
          <br/>
            <span className="text-sm font-bold text-black dark:text-white">ÚNICOS EN EL MUNDO, COMO TÚ</span>
        </div>
      </div>

      {/* Overlay for < sm (mobile): cover the simple-mobile UI section (not the header) */}
      <div
        aria-hidden
        className="pointer-events-auto absolute inset-0 z-30 grid place-items-center bg-black/60 backdrop-blur-sm sm:hidden"
        style={{ inset: 0, WebkitBackdropFilter: "blur(4px)" }}
      >
        <div className="px-6 text-center">
          <h3 className="text-3xl font-extrabold tracking-tight text-white">
            Próximamente
          </h3>
          <p className="mt-3 max-w-xl text-white/80">
            Estamos preparando IQchat para ayudarte a encontrar el estuche perfecto para ti.
            <br/>
            <span className="text-sm font-bold text-black dark:text-white">ÚNICOS EN EL MUNDO, COMO TÚ</span>
          </p>
        </div>
      </div>
    </main>
  );
}
