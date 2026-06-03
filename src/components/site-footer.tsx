import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="w-full bg-[#d4ff00] text-black pt-12 pb-0">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <h4 className="text-lg font-black uppercase tracking-wider ">
              VISIONIQ
            </h4>
            <p className="text-sm text-black/85 max-w-xs font-medium leading-relaxed">
              Estos no son estuches, son obras de arte. Orgullosamente hecho en Ecuador.
            </p>
          </div>

          {/* Links Column */}
          <div className="space-y-4">
            <h4 className="text-sm font-black uppercase tracking-wider ">
              Navegación
            </h4>
            <nav className="flex flex-col gap-2.5 text-sm font-medium">
              <Link href="/" className="hover:opacity-75 transition ">
                Home
              </Link>
              <Link href="/designs" className="hover:opacity-75 transition ">
                Diseños
              </Link>
              <Link href="/collections" className="hover:opacity-75 transition ">
                Colecciones
              </Link>
              <Link href="/iqchat" className="hover:opacity-75 transition ">
                IQchat
              </Link>
            </nav>
          </div>

          {/* Contact Column */}
          <div className="space-y-4">
            <h4 className="text-sm font-black uppercase tracking-wider ">
              Contacto
            </h4>
            <p className="text-sm text-black/85 font-medium leading-relaxed">
              ¿Tienes preguntas o deseas confirmar un pedido? Escríbenos por WhatsApp o visítanos en nuestras redes sociales.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/vision.iq_ec"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-black uppercase tracking-widest underline underline-offset-4 hover:opacity-75 transition "
              >
                Instagram
              </a>
              <a
                href="https://www.tiktok.com/@visioniq_ec"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-black uppercase tracking-widest underline underline-offset-4 hover:opacity-75 transition "
              >
                TikTok
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright area (22px padding top, 50px padding bottom) */}
        <div className="mt-12 border-t border-black/15 pt-[22px] pb-[50px] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-black/70 font-bold uppercase tracking-widest">
          <span>© 2026 VISIONIQ. Todos los derechos reservados.</span>
          <span>Hecho en Ecuador</span>
        </div>
      </div>
    </footer>
  );
}
