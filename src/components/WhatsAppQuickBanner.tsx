"use client";

import React from "react";
import { MessageCircle } from "lucide-react";

export default function WhatsAppQuickBanner() {
  const rawNumber =
    process.env.NEXT_PUBLIC_NUMEROWASSAP ||
    process.env.NUMEROWASSAP ||
    "34 646 03 42 31";

  const cleanNumber = rawNumber.replace(/\D/g, "");
  const formattedDisplay = rawNumber.trim().startsWith("+")
    ? rawNumber.trim()
    : `+${rawNumber.trim()}`;

  const wassapUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
    "Hola, deseo consultar información y disponibilidad de citas y actividades de la Escuela de Yoga Salvadora Conesa."
  )}`;

  return (
    <div className="mb-10 bg-gradient-to-r from-emerald-50 via-white to-emerald-50 border border-[#25D366]/35 rounded-2xl p-5 sm:p-6 shadow-md shadow-emerald-900/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left font-sans">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative shrink-0">
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#25D366] shadow-sm bg-stone-100 flex items-center justify-center">
            <img
              src="/imagenes/asistente_whatsapp.png"
              alt="Asistente Escuela Yoga"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "/imagenes/yoga/facebooksalvadora.jpeg";
              }}
            />
          </div>
          <span
            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#25D366] text-white flex items-center justify-center text-[10px] shadow-sm font-bold"
            title="WhatsApp Activo 24/7"
          >
            ✓
          </span>
        </div>
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#25D366]/15 text-[#128C7E] text-[10.5px] font-bold uppercase tracking-wider mb-1">
            <MessageCircle className="w-3 h-3 fill-current" />
            <span>Atención Inmediata 24/7 por WhatsApp</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-stone-900 leading-tight">
            ¿Prefieres consultar o reservar al instante por WhatsApp?
          </h3>
          <p className="text-xs text-stone-600 mt-0.5">
            Chatea con nuestro <strong>Asistente Escuela Yoga</strong> al{" "}
            <span className="font-mono font-bold text-[#128C7E]">
              {formattedDisplay}
            </span>{" "}
            para citas, plazas y consultas inmediatas.
          </p>
        </div>
      </div>
      <div className="w-full sm:w-auto shrink-0">
        <a
          href={wassapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-[#25D366]/25 hover:scale-102 active:scale-98 transition duration-200 cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 fill-current" />
          <span>Chatear por WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
