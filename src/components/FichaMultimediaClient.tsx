"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Film,
  FileText,
  Download,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Phone,
  MessageCircle,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Users,
  Award,
} from "lucide-react";
import { CrmService, formatServicePrice } from "@/lib/crmServices";
import { getNumeroWassap } from "@/lib/featureFlags";
import { VapiVoiceBookingButton } from "@/components/VapiVoiceBookingButton";

interface FichaMultimediaClientProps {
  activity: CrmService;
  videoSrc: string | null;
  flyerSrc: string | null;
}

export function FichaMultimediaClient({
  activity,
  videoSrc,
  flyerSrc,
}: FichaMultimediaClientProps) {
  const [activeTab, setActiveTab] = useState<"video" | "flyer">(
    videoSrc ? "video" : "flyer"
  );
  const [isZoomed, setIsZoomed] = useState(false);

  const { clean: cleanPhone } = getNumeroWassap();
  const whatsappBookingUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Hola, he consultado la ficha multimedia de "${activity.name}" y me gustaría consultar disponibilidad o reservar mi plaza.`
  )}`;

  const priceLabel = formatServicePrice(activity);
  const datesLabel =
    activity.eventDatesText ||
    activity.scheduleText ||
    "Consultar programación de fechas";

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-900 pb-28 sm:pb-20 font-sans selection:bg-[#800020]/20 selection:text-[#800020]">
      {/* ─── BARRA SUPERIOR DE NAVEGACIÓN ─── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <Link
            href="/servicios"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-[#800020] transition active:scale-95 py-1 px-2.5 rounded-lg hover:bg-stone-100"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a Actividades</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Ficha Multimedia Oficial
            </span>
          </div>
        </div>
      </header>

      {/* ─── CONTENEDOR PRINCIPAL ─── */}
      <main className="max-w-4xl mx-auto px-4 pt-4 sm:pt-6 space-y-5">
        {/* ENCABEZADO DE LA ACTIVIDAD */}
        <div className="bg-white rounded-2xl p-5 sm:p-7 border border-stone-200 shadow-xs space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#800020]/10 text-[#800020] text-xs font-bold uppercase tracking-wider border border-[#800020]/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{activity.categoryName || "Escuela de Yoga Salvadora Conesa"}</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl font-extrabold text-[#800020] leading-tight">
            {activity.name}
          </h1>

          {/* DATOS CLAVE: PRECIO, FECHAS, DURACIÓN, SEDE */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
            {/* Tarjeta 1: Precio */}
            <div className="bg-stone-50 rounded-xl p-3 border border-stone-200/80 text-center sm:text-left">
              <span className="text-[11px] uppercase tracking-wider text-stone-500 font-bold block mb-0.5">
                Tarifa
              </span>
              <span className="text-base sm:text-lg font-black text-[#800020] block">
                {priceLabel}
              </span>
            </div>

            {/* Tarjeta 2: Fechas / Horarios */}
            <div className="bg-stone-50 rounded-xl p-3 border border-stone-200/80 text-center sm:text-left col-span-1 sm:col-span-2">
              <span className="text-[11px] uppercase tracking-wider text-stone-500 font-bold flex items-center justify-center sm:justify-start gap-1 mb-0.5">
                <Calendar className="w-3 h-3 text-[#C5A059]" /> Horario / Convocatoria
              </span>
              <span className="text-xs sm:text-sm font-bold text-stone-800 line-clamp-2">
                {datesLabel}
              </span>
            </div>

            {/* Tarjeta 3: Duración */}
            <div className="bg-stone-50 rounded-xl p-3 border border-stone-200/80 text-center sm:text-left">
              <span className="text-[11px] uppercase tracking-wider text-stone-500 font-bold flex items-center justify-center sm:justify-start gap-1 mb-0.5">
                <Clock className="w-3 h-3 text-[#C5A059]" /> Duración
              </span>
              <span className="text-xs sm:text-sm font-bold text-stone-800">
                {activity.durationMinutes ? `${activity.durationMinutes} min` : "90 min"}
              </span>
            </div>
          </div>
        </div>

        {/* ─── SECCIÓN MULTIMEDIA (VÍDEO Y FLYER) ─── */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          {/* Selector de Pestañas Multimedia si ambos existen */}
          {videoSrc && flyerSrc && (
            <div className="flex border-b border-stone-200 bg-stone-50/80 p-1.5 gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("video")}
                className={`flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                  activeTab === "video"
                    ? "bg-[#800020] text-white shadow-xs"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/60"
                }`}
              >
                <Film className="w-4 h-4 text-amber-300" />
                <span>🎬 Vídeo de la Actividad</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("flyer")}
                className={`flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                  activeTab === "flyer"
                    ? "bg-[#0B4A72] text-white shadow-xs"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/60"
                }`}
              >
                <FileText className="w-4 h-4 text-sky-200" />
                <span>📄 Flyer Informativo</span>
              </button>
            </div>
          )}

          {/* CONTENEDOR MULTIMEDIA ACTIVO */}
          <div className="p-4 sm:p-6 bg-stone-900/5">
            {/* 1. VISOR DE VÍDEO */}
            {videoSrc && (activeTab === "video" || !flyerSrc) && (
              <div className="space-y-4">
                <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black shadow-md border border-stone-800">
                  <video
                    src={videoSrc}
                    controls
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-contain"
                  >
                    Tu navegador no soporta reproducción directa de vídeo HTML5.
                  </video>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="text-xs text-stone-600 flex items-center gap-1.5 font-medium">
                    <Film className="w-4 h-4 text-[#800020]" />
                    <span>Reproducción en directo sin límites de tamaño de WhatsApp</span>
                  </div>
                  <a
                    href={videoSrc}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#800020] hover:bg-[#660019] shadow-xs transition active:scale-95"
                    title="Descargar archivo de vídeo"
                  >
                    <Download className="w-4 h-4 text-amber-300" />
                    <span>Descargar Vídeo (MP4)</span>
                  </a>
                </div>
              </div>
            )}

            {/* 2. VISOR DE FLYER */}
            {flyerSrc && (activeTab === "flyer" || !videoSrc) && (
              <div className="space-y-4">
                <div
                  onClick={() => setIsZoomed(!isZoomed)}
                  className={`relative rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shadow-md cursor-zoom-in transition-all duration-200 flex items-center justify-center ${
                    isZoomed ? "max-h-none" : "max-h-[550px]"
                  }`}
                  title="Haz clic para ampliar o reducir"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={flyerSrc}
                    alt={`Flyer informativo de ${activity.name}`}
                    className="w-full h-auto object-contain max-h-[700px] select-none"
                    loading="lazy"
                  />
                  <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-black/60 text-white text-[11px] font-bold backdrop-blur-xs select-none pointer-events-none">
                    {isZoomed ? "🔍 Clic para reducir" : "🔍 Clic para ampliar"}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="text-xs text-stone-600 flex items-center gap-1.5 font-medium">
                    <FileText className="w-4 h-4 text-[#0B4A72]" />
                    <span>Cartel informativo en alta definición</span>
                  </div>
                  <a
                    href={flyerSrc}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0B4A72] hover:bg-[#083654] shadow-xs transition active:scale-95"
                    title="Descargar cartel en alta resolución"
                  >
                    <Download className="w-4 h-4 text-sky-200" />
                    <span>Descargar Flyer (JPG / PNG)</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ─── DESCRIPCIÓN Y DETALLES DE LA ACTIVIDAD ─── */}
        <div className="bg-white rounded-2xl p-5 sm:p-7 border border-stone-200 shadow-xs space-y-4">
          <h2 className="font-serif text-lg sm:text-xl font-bold text-[#800020] flex items-center gap-2">
            <span>Sobre esta actividad</span>
          </h2>

          {activity.textoespecifico && (
            <div className="p-3.5 bg-amber-50/80 border-l-4 border-amber-500 rounded-r-xl text-xs sm:text-sm text-amber-950 font-medium leading-relaxed">
              <strong>Nota de convocatoria:</strong> {activity.textoespecifico}
            </div>
          )}

          <p className="text-stone-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
            {activity.description ||
              "Actividad impartida en el Centro de Yoga Salvadora Conesa. Consulta disponibilidad y reserva tu plaza directamente por WhatsApp o por teléfono."}
          </p>

          {/* SEDE OFICIAL Y REQUISITOS */}
          <div className="border-t border-stone-100 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-700">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#800020] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-stone-900 font-bold">
                  Sede Oficial:
                </strong>
                <span>
                  Club Social Parque Granada, Calle Holanda, 1, 28942 Fuenlabrada
                  (Madrid) · Metro Parque Europa (L12).
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-stone-900 font-bold">
                  Garantía y Aforo:
                </strong>
                <span>
                  Plazas limitadas por orden de inscripción. Espacio acondicionado con
                  materiales de sonido, mantas y esterillas.
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ─── BARRA FLOTANTE FIJA INFERIOR (STICKY) PARA MÓVIL Y DESKTOP ─── */}
      <aside aria-label="Acciones de reserva" className="fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-t border-stone-200 p-3 sm:py-3.5 shadow-lg">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="hidden sm:block">
            <span className="text-xs font-bold text-stone-800 block truncate max-w-xs">
              {activity.name}
            </span>
            <span className="text-[11px] text-stone-500 font-medium">
              {priceLabel} · {datesLabel}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {/* Botón WhatsApp */}
            <a
              href={whatsappBookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition active:scale-95 text-center cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 shrink-0 text-white" />
              <span className="whitespace-nowrap">Reservar por Wassap</span>
            </a>

            {/* Botón Te Llamamos (IA) */}
            <div className="flex-1 sm:flex-initial">
              <VapiVoiceBookingButton
                buttonText="📞 Te Llamamos (IA)"
                serviceHint={activity.name}
                className="!w-full !py-2.5 !px-4 !rounded-xl !text-xs !bg-[#800020] hover:!bg-[#660019]"
              />
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
