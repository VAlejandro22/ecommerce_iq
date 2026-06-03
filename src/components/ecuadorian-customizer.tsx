"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import { WHATSAPP_PHONE } from "@/config";

export function EcuadorianCustomizer() {
  const [finish, setFinish] = useState<"liquid-case" | "liquid-gel">("liquid-case");
  const [selectedModel, setSelectedModel] = useState("iPhone 15 Pro");

  // Hardcoded prices (will be updated dynamically via backend in the future)
  const prices = {
    "liquid-case": 25.0,
    "liquid-gel": 22.0,
  };

  const iphoneModels = [
    "iPhone 17 Pro Max",
    "iPhone 17 Pro",
    "iPhone 17 Plus",
    "iPhone 17",
    "iPhone 16 Pro Max",
    "iPhone 16 Pro",
    "iPhone 16 Plus",
    "iPhone 16",
    "iPhone 15 Pro Max",
    "iPhone 15 Pro",
    "iPhone 15 Plus",
    "iPhone 15",
    "iPhone 14 Pro Max",
    "iPhone 14 Pro",
    "iPhone 14 Plus",
    "iPhone 14",
    "iPhone 13 Pro Max",
    "iPhone 13 Pro",
    "iPhone 13",
  ];

  const handleBuyClick = () => {
    const finishLabel = finish === "liquid-case" ? "Liquid Case (Estuche 3D)" : "Liquid Gel (Hidrogel 3D)";
    const message = `¡Hola! Me interesa adquirir la obra de arte para llevar: estuche "Ecuadorian" de la nueva colección exclusiva.\n\n• Acabado: ${finishLabel}\n• Modelo: ${selectedModel}\n• Precio: $${prices[finish].toFixed(2)}\n\n¿Me ayudan a confirmar mi pedido? ¡Muchas gracias!`;
    const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <section id="ecuadorian-shop" className="py-20 md:py-32 bg-stone-900 text-white relative overflow-hidden">
      {/* Light highlights */}
      <div className="absolute top-0 right-1/4 w-[350px] h-[350px] rounded-full bg-[#d4ff00]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] rounded-full bg-[#d4ff00]/5 blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-24">
          <span className="text-emerald-400 font-outfit text-xs font-bold tracking-[0.2em] uppercase">
            ADQUIERE LA OBRA
          </span>
          <h2 className="text-4xl md:text-5xl font-black font-playfair tracking-tight text-white uppercase mt-2">
            Lleva el Arte en tus Manos
          </h2>
          <p className="text-stone-400 font-outfit mt-4 leading-relaxed">
            Personaliza el acabado y selecciona tu modelo de iPhone. Cada pieza es fabricada artesanalmente con acabados de vidrio líquido en 3D para dar vida al plátano verde y la cinta plateada.
          </p>
        </div>

        {/* Customizer Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Column: Product Showcase Frame */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-[360px] aspect-[9/16] rounded-[40px] overflow-hidden shadow-museum-card border border-white/10 group select-none transform-gpu">

              {/* Product Background Spotlight */}
              <div className="absolute inset-0 bg-stone-950 transition-colors group-hover:bg-black/90 flex items-center justify-center">
                <div className="absolute w-[80%] h-[80%] rounded-full bg-[#d4ff00]/5 blur-[60px]" />
              </div>

              {/* Case Image */}
              <Image
                src="/lobby/ecuadorian-case.jpg"
                alt="Estuche Ecuadorian Colección de Arte"
                fill
                priority
                className="object-cover p-2 rounded-[38px] transition-transform duration-700 group-hover:scale-105"
              />

              {/* Museum Label Overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-black/85 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-[0.1em] font-outfit">
                    OBRA EXCLUSIVA
                  </span>
                  <p className="text-sm font-bold font-playfair text-white">&quot;ECUADORIAN&quot; #001</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-stone-400 block font-outfit">Precio Estimado</span>
                  <p className="text-sm font-bold text-emerald-400 font-outfit">$${prices[finish].toFixed(2)} USD</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Customizer Controls */}
          <div className="lg:col-span-6 space-y-8">

            {/* Curatorial Header */}
            <div>
              <h3 className="text-3xl font-bold font-playfair text-white">EDICIÓN COLECCIONISTA</h3>
              <p className="text-stone-400 font-outfit mt-2 leading-relaxed">
                Inspirado en la icónica sátira de Cattelan. Esta versión rinde tributo a la costa del Ecuador, sus plátanos verdes cosechados a mano y la fortaleza identitaria de su gente.
              </p>
            </div>

            {/* Step 1: Selector de Acabados */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-emerald-400 tracking-[0.15em] uppercase font-outfit block">
                Paso 1: Elige el Acabado de la Pieza
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Finish Option 1: Liquid Case */}
                <button
                  onClick={() => setFinish("liquid-case")}
                  className={`p-5 rounded-2xl text-left border transition-all duration-300 ${finish === "liquid-case"
                      ? "bg-stone-800 border-[#d4ff00]/80 shadow-[0_4px_20px_rgba(16,185,129,0.15)]"
                      : "bg-stone-900/60 border-white/5 hover:border-white/20"
                    }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm font-outfit">Liquid Case</span>
                    <span className="text-emerald-400 text-sm font-bold font-outfit">$25.00</span>
                  </div>
                  <p className="text-xs text-stone-400 mt-2 font-outfit leading-relaxed">
                    Estuche rígido con acabados de **vidrio líquido 3D** en el diseño. Brillo espectacular y relieve físico real sobre el plátano y la cinta.
                  </p>
                </button>

                {/* Finish Option 2: Liquid Gel */}
                <button
                  onClick={() => setFinish("liquid-gel")}
                  className={`p-5 rounded-2xl text-left border transition-all duration-300 ${finish === "liquid-gel"
                      ? "bg-stone-800 border-[#d4ff00]/80 shadow-[0_4px_20px_rgba(16,185,129,0.15)]"
                      : "bg-stone-900/60 border-white/5 hover:border-white/20"
                    }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm font-outfit">Liquid Gel</span>
                    <span className="text-emerald-400 text-sm font-bold font-outfit">$22.00</span>
                  </div>
                  <p className="text-xs text-stone-400 mt-2 font-outfit leading-relaxed">
                    Hidrogel protector para la parte trasera con relieves de **vidrio líquido 3D**. Protege contra rayones manteniendo un perfil ultra delgado.
                  </p>
                </button>

              </div>
            </div>

            {/* Step 2: Model Selector */}
            <div className="space-y-3">
              <label htmlFor="phone-model" className="text-xs font-bold text-emerald-400 tracking-[0.15em] uppercase font-outfit block">
                Paso 2: Selecciona tu Modelo de iPhone
              </label>
              <div className="relative">
                <select
                  id="phone-model"
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-stone-800 border border-white/10 text-white font-outfit text-sm focus:outline-none focus:border-[#d4ff00] appearance-none cursor-pointer"
                >
                  {iphoneModels.map((model) => (
                    <option key={model} value={model} className="bg-stone-800 text-white py-2">
                      {model}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <p className="text-[11px] text-stone-500 font-outfit">
                * Disponible en exclusiva para los modelos seleccionados. Si tienes alguna duda, consúltanos.
              </p>
            </div>

            {/* Specs list */}
            <div className="border-t border-white/10 pt-6 space-y-3 font-outfit text-xs text-stone-400">
              <div className="flex gap-2 items-center">
                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span>Efecto de vidrio líquido 3D premium (relieve al tacto).</span>
              </div>
              <div className="flex gap-2 items-center">
                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span>Ajuste preciso con recortes de cámara elevados para proteger el lente de tu iPhone.</span>
              </div>
              <div className="flex gap-2 items-center">
                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span>Materiales resistentes al amarilleo y de larga durabilidad.</span>
              </div>
            </div>

            {/* Buy Action */}
            <div className="pt-2">
              <Button
                onClick={handleBuyClick}
                className="w-full h-14 bg-[#d4ff00] hover:bg-emerald-400 text-black font-bold rounded-2xl flex items-center justify-center gap-3 shadow-[0_8px_30px_rgba(16,185,129,0.3)] transition-all transform hover:-translate-y-0.5"
              >
                {/* WhatsApp logo inline */}
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span>Comprar vía WhatsApp</span>
              </Button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
