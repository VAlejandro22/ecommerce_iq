import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";
// Font import removed because unused

export function Hero() {
  return (
    // <section className="relative isolate overflow-hidden bg-gradient-to-b from-stone-950 to-red-10 pt-28">
    <section className="relative isolate overflow-hidden bg-stone-950 pt-28">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 pb-20 md:grid-cols-2 md:pb-28">
        <div className="pt-8">
          <p className="text-white/90 text-xl">Únicos en el mundo, como tú</p>
          <h1 className="mt-3 text-6xl font-extrabold tracking-tight text-white md:text-8xl ">
            LIQUID
            <br /> CASE
          </h1>
          <div className="mt-10 flex gap-4">
            <Link href="/collections">
              <Button className="bg-white text-gray-900 hover:bg-white/90 font-bold">Ver colecciones</Button>
            </Link>
            <Link href="/designs">
              <Button variant="outline" className="text-white border-white/50 hover:bg-white/10 font-bold">
                Ver diseños
              </Button>
            </Link>
          </div>
        </div>
        <div className="relative h-[420px] md:h-[520px] rounded-tl-[140px] rounded-br-[40px] overflow-hidden shadow-xl">
          {/* Imagen principal (puedes cambiar el src por tu hero específico) */}
          <Image
            src="/lobby/destacado2.jpg"
            alt="Case destacado"
            fill
            priority
            className="object-cover"
          />
          {/* Capa de gradiente decorativa encima de la imagen */}
          <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_100%_0%,_rgba(255,255,255,0.85)_0%,_rgba(255,255,255,0.15)_45%,_rgba(255,255,255,0)_65%),_linear-gradient(160deg,_#dcfce7,_#7dd3fc)] mix-blend-multiply" />
          {/* Borde superior */}
            {/* <div className="absolute inset-0 border border-white/50 pointer-events-none" /> */}
        </div>
      </div>
    </section>
  );
}
