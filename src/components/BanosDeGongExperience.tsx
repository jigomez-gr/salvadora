"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Users,
  Volume2,
  HeartHandshake,
  ShieldCheck,
  CheckCircle2,
  MessageCircle,
  Phone,
  ChevronDown,
  Play,
  ArrowRight,
  HelpCircle,
  Ticket,
  Maximize2,
  X,
} from "lucide-react";
import {
  CrmService,
  formatServicePrice,
  FALLBACK_CRM_SERVICES,
} from "@/lib/crmServices";
import { getNumeroWassap } from "@/lib/featureFlags";
import { triggerCrmChat } from "@/components/ChatBubbleWidget";
import { triggerVapiCall } from "@/components/VapiCallModal";

interface BanosDeGongExperienceProps {
  activity?: CrmService;
  isEmbedded?: boolean;
}

export default function BanosDeGongExperience({
  activity,
  isEmbedded = false,
}: BanosDeGongExperienceProps) {
  // Datos dinámicos del CRM con fallback seguro
  const gongService =
    activity ||
    FALLBACK_CRM_SERVICES.find((s) => /baño de gong/i.test(s.name)) ||
    FALLBACK_CRM_SERVICES[2];

  const priceFormatted = formatServicePrice(gongService);
  const nextDateText =
    gongService.eventDatesText ||
    gongService.scheduleText ||
    "Sábado 21 de Noviembre de 2026 (18:00 a 20:00)";
  const durationText = gongService.durationMinutes
    ? `${Math.floor(gongService.durationMinutes / 60)} horas`
    : "2 horas (120 min)";
  const capacityText = gongService.maxCapacity
    ? `Aforo reducido (${gongService.maxCapacity} plazas máx.)`
    : "Aforo reducido (30 plazas máx.)";

  // WhatsApp
  const { clean: cleanPhone, display: formattedPhone } = getNumeroWassap();
  const wassapUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Hola Salvadora, me gustaría consultar disponibilidad y reservar plaza para los Baños de Gong en Fuenlabrada (${nextDateText}).`
  )}`;

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  // Video / Flyer Lightbox State
  const [activeMediaModal, setActiveMediaModal] = useState<
    "video-actividad" | "video-sesion" | "flyer" | null
  >(null);

  const faqs = [
    {
      q: "¿Necesito experiencia previa en yoga o meditación?",
      a: "No se requiere ninguna experiencia previa ni condición física especial. El baño de gong se experimenta cómodamente tumbado/a sobre una esterilla, con los ojos cerrados y abrigado/a con una manta. Solo necesitas venir con ganas de descansar, respirar y dejarte envolver por el sonido.",
    },
    {
      q: "¿Qué se siente durante una sesión de Baño de Gong?",
      a: "Las sensaciones varían en cada persona: desde una relajación muscular profunda hasta una agradable sensación de ligereza corporal, calma mental o estados meditativos espontáneos (ondas alfa y theta). El sonido de los gongs crea un campo acústico continuo que aquieta el diálogo interno sin esfuerzo.",
    },
    {
      q: "¿El sonido es muy fuerte o estridente?",
      a: "En absoluto. Aunque los gongs tienen un amplio rango dinámico, la sesión está facilitada de forma armónica, progresiva y sumamente respetuosa. El sonido comienza con un murmullo suave y evoluciona en oleadas armónicas envolventes, cuidando siempre el confort auditivo del grupo.",
    },
    {
      q: "¿Qué tengo que llevar a la sesión?",
      a: "Te recomendamos vestir ropa cómoda y holgada, además de calcetines cálidos. Como al entrar en relajación profunda la temperatura corporal suele bajar levemente, en el centro ponemos a tu disposición esterillas, mantas cálidas y zafus (cojines de meditación), aunque eres libre de traer tu propia manta si lo prefieres.",
    },
    {
      q: "¿Cómo se confirma la reserva y cómo se abona la aportación?",
      a: "Puedes solicitar tu plaza al instante por WhatsApp o a través de nuestro asistente telefónico 24/7. Recibirás confirmación fehaciente por SMS y correo electrónico. El abono de la aportación (16 € individual / 14 € si vienes con acompañante) se realiza cómodamente en el propio centro antes de comenzar la sesión.",
    },
    {
      q: "¿Existe alguna contraindicación que deba tener en cuenta?",
      a: "Por prudencia y recomendación general en sonoterapia, rogamos que nos consultes previamente si llevas marcapasos u otros dispositivos electrónicos cardíacos, si te encuentras en el primer trimestre de gestación o si tienes antecedentes de epilepsia inducida por estímulos sonoros.",
    },
  ];

  return (
    <div className="w-full text-stone-800 font-sans selection:bg-[#C5A059]/30 selection:text-[#12241D]">
      {/* ─────────────────────────────────────────────────────────────
          1. HERO CINEMATOGRÁFICO — IMAGEN PRINCIPAL (1920 × 780)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl shadow-md bg-[#0D1F18] border border-[#C5A059]/30">
        {/* Contenedor de la fotografía con encuadre original sin recortar gongs */}
        <div className="relative w-full aspect-[16/9] sm:aspect-[1920/780] min-h-[360px] sm:min-h-[460px] max-h-[640px] flex items-center justify-center overflow-hidden">
          {/* Fotografía protagonista obligatoria img__gong.jpg */}
          <img
            src="/imagenes/gong/img__gong.jpg"
            alt="Baños de Gong en Fuenlabrada - Dos gongs ancestrales y cuencos tibetanos en el Centro de Yoga Salvadora Conesa"
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.04] transition-transform duration-1000 ease-out hover:scale-102"
            loading="eager"
          />

          {/* Degradado oscuro suave y cinematográfico para integrar textos sin tapar los gongs */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1612]/95 via-[#0A1612]/40 to-[#0A1612]/30 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#0A1612]/20 to-[#0A1612]/70 pointer-events-none" />

          {/* Contenido textual superpuesto */}
          <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-12 flex flex-col items-center text-center justify-end h-full">
            {/* Badge de exclusividad y ubicación */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#12241D]/80 backdrop-blur-md border border-[#C5A059]/50 text-[#E5C378] text-[11px] sm:text-xs font-bold uppercase tracking-widest mb-3 shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
              <span>Experiencia Inmersiva de Sonoterapia · Fuenlabrada (Madrid)</span>
            </div>

            {/* Título principal solicitado */}
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight drop-shadow-md leading-tight">
              Baños de Gong
            </h1>

            {/* Subtítulo solicitado */}
            <p className="font-serif italic text-lg sm:text-2xl text-[#E5C378] mt-2 max-w-2xl text-shadow-sm font-light">
              «Un viaje sonoro hacia el silencio interior»
            </p>

            {/* Microficha de fecha y plazas en el hero */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-stone-200 font-medium">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10">
                <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                {nextDateText}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10">
                <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                {durationText}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 text-[#E5C378] font-bold">
                <Ticket className="w-3.5 h-3.5 text-[#D4AF37]" />
                {priceFormatted}
              </span>
            </div>

            {/* Botones de acción rápida en Hero */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 w-full sm:w-auto">
              <a
                href="#reservar-experiencia"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-gradient-to-r from-[#C5A059] via-[#D4AF37] to-[#B38D45] hover:from-[#D4AF37] hover:to-[#C5A059] text-[#0D1F18] font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-xl shadow-amber-900/30 hover:scale-103 active:scale-97 transition-all duration-200 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 fill-current" />
                <span>Reservar mi experiencia</span>
              </a>

              {/* Botón Vídeo de la Actividad (itinerario-3.mp4) */}
              <button
                type="button"
                onClick={() => setActiveMediaModal("video-actividad")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#800020]/90 hover:bg-[#800020] text-white border border-[#C5A059]/60 font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-lg hover:scale-102 active:scale-98 transition-all duration-200 cursor-pointer"
              >
                <Play className="w-4 h-4 text-[#E5C378] fill-current" />
                <span>Ver Vídeo de la Actividad</span>
              </button>

              {/* Botón Vídeo de la Sesión (Bano-de-Gong_particular.mp4) */}
              <button
                type="button"
                onClick={() => setActiveMediaModal("video-sesion")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white border border-[#C5A059]/40 font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl hover:border-[#C5A059] transition-all duration-200 cursor-pointer"
              >
                <Play className="w-4 h-4 text-[#D4AF37] fill-current" />
                <span>Ver Vídeo de Sala</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. SECCIÓN 1: LA MAGIA DEL GONG
      ───────────────────────────────────────────────────────────── */}
      <section className="mt-14 sm:mt-18">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Texto explicativo */}
            <div className="lg:col-span-7 space-y-4 text-stone-700 leading-relaxed font-sans">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#12241D]/5 text-[#132A21] text-xs font-bold uppercase tracking-wider border border-[#132A21]/15">
                <Volume2 className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>1. La Magia del Gong</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#12241D] leading-tight">
                Qué es un Baño de Gong y cómo se vive la experiencia
              </h2>

              <p className="text-base sm:text-lg text-stone-600 font-light">
                Un baño de gong no es un concierto convencional ni una clase de esfuerzo físico: es una <strong>inmersión sonora vivencial</strong> en la que el cuerpo se relaja de forma natural y la mente descansa en la escucha.
              </p>

              <p>
                Al hacer sonar los grandes gongs sinfónicos y los cuencos tradicionales, el espacio se llena de un espectro rico en armónicos que resuenan en todo el entorno. El sonido no solo viaja a través del oído, sino como una vibración acústica sutil que recorre los tejidos, invitando a soltar tensiones acumuladas y facilitando una sensación de ligereza profunda.
              </p>

              <p className="p-4 bg-[#F5F2EB] rounded-xl border-l-4 border-[#C5A059] text-stone-800 italic text-sm">
                «No hay nada que hacer, ninguna postura que sostener ni expectativas que cumplir. Solo tumbarte, cerrar los ojos y permitir que el sonido te acoja y te acompañe.»
              </p>
            </div>

            {/* Fotografía de los terapeutas con instrumentos */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border-2 border-[#C5A059]/30 bg-stone-100 group">
                <img
                  src="/imagenes/gong/01_presentacion_terapeutas_1920x1080.jpg"
                  alt="Dos terapeutas del sonido compartiendo una experiencia de calma y bienestar en el Centro de Yoga Salvadora Conesa de Fuenlabrada"
                  className="w-full h-auto object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 text-white text-xs">
                  <span className="font-bold text-[#E5C378] block">Presencia y Sensibilidad</span>
                  <span>Compartiendo calma, armonía y escucha en cada encuentro sonoro.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. SECCIÓN 2: UN VIAJE DE VIBRACIONES
      ───────────────────────────────────────────────────────────── */}
      <section className="mt-16 sm:mt-20 bg-gradient-to-b from-[#12241D] via-[#0E1C17] to-[#12241D] text-white rounded-3xl p-6 sm:p-12 shadow-md border border-[#C5A059]/25 relative overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#1A382B]/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#E5C378] text-xs font-bold uppercase tracking-wider border border-[#C5A059]/40">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>2. Un Viaje de Vibraciones</span>
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white">
              Sensaciones, Sonidos y Atmósfera
            </h2>
            <p className="text-sm sm:text-base text-stone-300 font-light leading-relaxed">
              La vibración del gong crea un entorno acústico envolvente que aquieta la mente y devuelve al cuerpo su ritmo natural de descanso.
            </p>
          </div>

          {/* Tres pilares de la experiencia vibracional */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pilar 1 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-[#C5A059]/60 transition-colors duration-300 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center text-[#E5C378] font-serif text-xl font-bold">
                01
              </div>
              <h3 className="font-serif text-lg font-bold text-[#E5C378]">
                Aquietamiento Mental
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
                La variedad de tonos y sobretonos del gong satura suavemente el aparato auditivo, evitando que la mente se aferre a pensamientos repetitivos y facilitando estados meditativos de calma lúcida (ondas alfa y theta).
              </p>
            </div>

            {/* Pilar 2 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-[#C5A059]/60 transition-colors duration-300 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center text-[#E5C378] font-serif text-xl font-bold">
                02
              </div>
              <h3 className="font-serif text-lg font-bold text-[#E5C378]">
                Resonancia Somática
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
                El sonido físico viaja por el aire y se siente en el pecho, articulaciones y espalda como un masaje sutil. Ayuda a liberar rigideces posturales y a suavizar la respiración de forma orgánica.
              </p>
            </div>

            {/* Pilar 3 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-[#C5A059]/60 transition-colors duration-300 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center text-[#E5C378] font-serif text-xl font-bold">
                03
              </div>
              <h3 className="font-serif text-lg font-bold text-[#E5C378]">
                Atmósfera Cálida y Segura
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
                Luz tenue de velas, sala templada, esterillas confortables y un respeto escrupuloso por el silencio. Un refugio acústico protegido del ruido urbano para reencontrarte contigo mismo/a.
              </p>
            </div>
          </div>

          {/* Galería doble inmersiva de imágenes reales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="rounded-2xl overflow-hidden border border-[#C5A059]/30 relative aspect-[16/10] group">
              <img
                src="/imagenes/gong/02_terapeutas_con_instrumentos_1920x1080.jpg"
                alt="Instrumentos de gong y cuencos tibetanos en el Centro de Yoga Salvadora Conesa"
                className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                <span className="text-xs text-stone-200">
                  Cuencos de cuarzo y gongs sinfónicos afinados armónicamente.
                </span>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-[#C5A059]/30 relative aspect-[16/10] group">
              <img
                src="/imagenes/gong/06_experiencia_de_relajacion_sonora_1920x1080.jpg"
                alt="Alumnos disfrutando de la relajación sonora en sala durante el Baño de Gong"
                className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                <span className="text-xs text-stone-200">
                  Relajación corporal profunda sobre esterillas y mantas cálidas.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. SECCIÓN 3: CÓMO ES UNA SESIÓN
      ───────────────────────────────────────────────────────────── */}
      <section className="mt-16 sm:mt-20">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#12241D]/5 text-[#132A21] text-xs font-bold uppercase tracking-wider border border-[#132A21]/15">
              <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>3. El Desarrollo de la Sesión</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#12241D]">
              Cómo es una sesión paso a paso
            </h2>
            <p className="text-sm sm:text-base text-stone-600 font-light">
              Diseñamos cada encuentro sonoro con un orden cuidadoso para que la transición desde el ritmo del día hacia el sosiego sea natural y placentera.
            </p>
          </div>

          {/* 4 Fases en línea temporal interactiva */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Paso 1 */}
            <div className="bg-[#FAF9F6] border border-stone-200 rounded-2xl p-5 space-y-2.5 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-[#96680E] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Fase 1 · 15 min
                </span>
              </div>
              <h3 className="font-serif text-base font-bold text-stone-900">
                Llegada y Acomodo
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                Entrada pausada a la sala, descalzarse, dejar el teléfono apagado y acomodar tu esterilla con manta, cojín y apoyacabezas para que el cuerpo quede perfectamente sostenido.
              </p>
            </div>

            {/* Paso 2 */}
            <div className="bg-[#FAF9F6] border border-stone-200 rounded-2xl p-5 space-y-2.5 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-[#96680E] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Fase 2 · 20 min
                </span>
              </div>
              <h3 className="font-serif text-base font-bold text-stone-900">
                Respiración y Descarga
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                Breve toma de tierra con respiración consciente y estiramientos muy suaves para aflojar tensiones en hombros y cuello, preparando al cuerpo para recibir el sonido.
              </p>
            </div>

            {/* Paso 3 */}
            <div className="bg-[#12241D] text-white border border-[#C5A059]/40 rounded-2xl p-5 space-y-2.5 relative shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-[#D4AF37] bg-white/10 px-2 py-0.5 rounded border border-[#C5A059]/40">
                  Fase 3 · 65 min
                </span>
              </div>
              <h3 className="font-serif text-base font-bold text-[#E5C378]">
                Inmersión en el Gong
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed font-light">
                Tumbados en Savasana, comienza el viaje sonoro. Cuencos, campanas tubulares y los gongs despliegan sus oleadas envolventes de armónicos continuos.
              </p>
            </div>

            {/* Paso 4 */}
            <div className="bg-[#FAF9F6] border border-stone-200 rounded-2xl p-5 space-y-2.5 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-[#96680E] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Fase 4 · 20 min
                </span>
              </div>
              <h3 className="font-serif text-base font-bold text-stone-900">
                Silencio e Integración
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                Minutos de silencio absoluto (Shunyata) para asimilar la vibración. Retorno suave al movimiento, compartir impresiones e infusión caliente de cierre.
              </p>
            </div>
          </div>

          {/* Imagen de preparación y espacio */}
          <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-sm relative aspect-[21/9] max-h-72">
            <img
              src="/imagenes/gong/05_preparacion_del_espacio_1920x1080.jpg"
              alt="Preparación del espacio y sala de Baños de Gong en el Centro de Yoga Salvadora Conesa"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent flex items-center p-6 sm:p-10">
              <div className="max-w-md text-white space-y-1">
                <span className="text-xs font-bold text-[#E5C378] uppercase tracking-wider block">
                  Cuidado en cada detalle
                </span>
                <p className="text-sm sm:text-base font-serif italic">
                  «Preparamos cada rincón de la sala con sensibilidad y cariño para que desde el primer minuto sientas un entorno de absoluta calma.»
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. SECCIÓN 4: SALVADORA CONESA (FACILITADORA)
      ───────────────────────────────────────────────────────────── */}
      <section className="mt-16 sm:mt-20">
        <div className="max-w-5xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-[#C5A059]/30 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Foto de Salvadora con cuenco y gong */}
            <div className="md:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border-2 border-[#C5A059]/40 shadow-lg bg-stone-100 aspect-[4/5] max-w-sm mx-auto">
                <img
                  src="/imagenes/gong/04_maria_con_cuenco_y_gong_1920x1080.jpg"
                  alt="María Salvadora Conesa facilitadora de Baños de Gong y terapeuta Gestalt en Fuenlabrada"
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#0A1612]/90 to-transparent p-4 text-center">
                  <span className="font-serif text-lg font-bold text-white block">
                    María Salvadora Conesa
                  </span>
                  <span className="text-[11px] font-bold text-[#E5C378] uppercase tracking-wider">
                    Facilitadora de Sonido & Terapeuta Gestalt
                  </span>
                </div>
              </div>
            </div>

            {/* Biografía y Filosofía */}
            <div className="md:col-span-7 space-y-4 text-stone-700 leading-relaxed font-sans">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#12241D]/5 text-[#132A21] text-xs font-bold uppercase tracking-wider border border-[#132A21]/15">
                <HeartHandshake className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>4. Tu Facilitadora</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#12241D]">
                Acompañamiento humano, respeto y más de 40 años de trayectoria
              </h2>

              <p className="text-sm sm:text-base text-stone-600">
                Al frente de cada sesión se encuentra <strong>María Salvadora Conesa</strong>, pionera de la enseñanza del Yoga y el bienestar holístico en Fuenlabrada y la zona sur de Madrid:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs sm:text-sm">
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FAF9F6] border border-stone-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>+40 años</strong> formando y guiando alumnos en Hatha Yoga y meditación.</span>
                </div>
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FAF9F6] border border-stone-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>26 años</strong> como terapeuta Gestalt y facilitadora de procesos de autoconocimiento.</span>
                </div>
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FAF9F6] border border-stone-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>Especialista en Sonoterapia</strong> con gongs sinfónicos, cuencos tibetanos y de cuarzo.</span>
                </div>
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FAF9F6] border border-stone-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>Espacio propio</strong> cuidado con esmero en pleno corazón de Fuenlabrada.</span>
                </div>
              </div>

              <p className="italic text-xs sm:text-sm text-stone-600 pt-2 border-t border-stone-100">
                «Para mí el gong no es una exhibición técnica ni una promesa milagrosa: es un puente sincero hacia el silencio interior, donde cada persona puede soltar su carga y reencontrarse con su paz natural.»
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. SECCIÓN 5: INFORMACIÓN PRÁCTICA & MULTIMEDIA (CRM DINÁMICO)
      ───────────────────────────────────────────────────────────── */}
      <section className="mt-16 sm:mt-20">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#12241D]/5 text-[#132A21] text-xs font-bold uppercase tracking-wider border border-[#132A21]/15">
              <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>5. Información Práctica</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#12241D]">
              Fechas, Aportación y Detalles de la Convocatoria
            </h2>
            <p className="text-sm text-stone-600 font-light">
              Datos actualizados y sincronizados con la secretaría del centro.
            </p>
          </div>

          {/* Tarjetas de datos clave prácticos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Próxima Fecha */}
            <div className="bg-[#FAF9F6] p-5 rounded-2xl border border-stone-200 text-stone-800 space-y-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-[#96680E]">
                <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                Próxima Sesión
              </span>
              <p className="text-sm sm:text-base font-bold text-stone-900 leading-snug">
                {nextDateText}
              </p>
              <span className="text-[11px] text-stone-500 block">Convocatoria confirmada</span>
            </div>

            {/* Duración */}
            <div className="bg-[#FAF9F6] p-5 rounded-2xl border border-stone-200 text-stone-800 space-y-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-[#96680E]">
                <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                Duración
              </span>
              <p className="text-sm sm:text-base font-bold text-stone-900 leading-snug">
                {durationText}
              </p>
              <span className="text-[11px] text-stone-500 block">Sesión completa con integración</span>
            </div>

            {/* Tarifa / Aportación */}
            <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200 text-stone-800 space-y-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-[#96680E]">
                <Ticket className="w-3.5 h-3.5 text-[#C5A059]" />
                Aportación
              </span>
              <p className="text-xl sm:text-2xl font-black text-[#800020] leading-none">
                {priceFormatted}
              </p>
              <span className="text-[11px] text-stone-600 block">
                14 € si vienes con acompañante
              </span>
            </div>

            {/* Lugar y Aforo */}
            <div className="bg-[#FAF9F6] p-5 rounded-2xl border border-stone-200 text-stone-800 space-y-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-[#96680E]">
                <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                Lugar & Aforo
              </span>
              <p className="text-xs sm:text-sm font-bold text-stone-900 leading-snug">
                Centro Salvadora Conesa
              </p>
              <span className="text-[11px] text-stone-500 block">
                C/ Pelayos 1, Fuenlabrada · {capacityText}
              </span>
            </div>
          </div>

          {/* Caja con Vídeo Oficial y Flyer descargable */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Material Oficial de la Actividad
              </span>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900">
                Vídeo Demostrativo y Cartel Oficial de la Convocatoria
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 font-light max-w-xl">
                Puedes ver un extracto en vídeo de la atmósfera en sala o consultar el cartel oficial con todos los detalles de la sesión.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setActiveMediaModal("video-actividad")}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#800020] hover:bg-[#660019] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition duration-150 shadow-sm cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 text-[#E5C378] fill-current" />
                <span>Vídeo de la Actividad</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMediaModal("video-sesion")}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#12241D] hover:bg-[#1a382b] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition duration-150 shadow-sm cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 text-[#D4AF37] fill-current" />
                <span>Vídeo de Sala</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMediaModal("flyer")}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 text-xs font-bold uppercase tracking-wider rounded-xl transition duration-150 cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5 text-stone-600" />
                <span>Ver Cartel Oficial</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. SECCIÓN 6: PREGUNTAS FRECUENTES (FAQ)
      ───────────────────────────────────────────────────────────── */}
      <section className="mt-16 sm:mt-20">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#12241D]/5 text-[#132A21] text-xs font-bold uppercase tracking-wider border border-[#132A21]/15">
              <HelpCircle className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>6. Dudas Habituales</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#12241D]">
              Preguntas Frecuentes
            </h2>
            <p className="text-sm text-stone-600 font-light">
              Todo lo que necesitas saber antes de venir a tu primer Baño de Gong.
            </p>
          </div>

          <div className="space-y-3 font-sans">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? "bg-white border-[#C5A059]/60 shadow-md ring-1 ring-[#C5A059]/20"
                      : "bg-[#FAF9F6] border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left px-5 sm:px-6 py-4 flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="font-serif text-base sm:text-lg font-bold text-stone-900 leading-snug">
                      {faq.q}
                    </span>
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border transition-transform duration-200 ${
                        isOpen
                          ? "rotate-180 bg-[#12241D] text-[#E5C378] border-[#12241D]"
                          : "bg-white text-stone-500 border-stone-200"
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed font-light border-t border-stone-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. BOTÓN DESTACADO & RESERVA INMEDIATA (CALL TO ACTION FINAL)
      ───────────────────────────────────────────────────────────── */}
      <section
        id="reservar-experiencia"
        className="mt-16 sm:mt-24 scroll-mt-24"
      >
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#12241D] via-[#0B1713] to-[#12241D] rounded-3xl p-8 sm:p-14 text-white text-center shadow-md border-2 border-[#C5A059]/40 relative overflow-hidden">
          {/* Destellos dorados */}
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059]/20 text-[#E5C378] text-xs font-bold uppercase tracking-widest border border-[#C5A059]/40">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Plazas Limitadas por Acústica y Aforo</span>
            </span>

            <h2 className="font-serif text-3xl sm:text-5xl font-black text-white leading-tight">
              Regálate dos horas de profunda serenidad y calma interior
            </h2>

            <p className="text-sm sm:text-base text-stone-300 font-light leading-relaxed">
              Próxima sesión: <strong className="text-[#E5C378]">{nextDateText}</strong>. Las plazas son reducidas para garantizar que cada asistente disfrute del espacio y el sonido con total comodidad.
            </p>

            {/* BOTÓN PRINCIPAL DESTACADO SOLICITADO */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={wassapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-[#25D366] via-[#20BD5A] to-[#1BA84E] hover:from-[#20BD5A] hover:to-[#1BA84E] text-white font-extrabold text-sm sm:text-base uppercase tracking-wider rounded-2xl shadow-xl shadow-emerald-950/40 hover:scale-103 active:scale-97 transition duration-200 cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Reservar mi experiencia por WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() =>
                  triggerVapiCall({
                    inquiry: "Información y fechas de los Baños de Gong",
                  })
                }
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-[#C5A059]/50 font-bold text-sm uppercase tracking-wider rounded-2xl hover:border-[#C5A059] transition duration-200 cursor-pointer"
              >
                <Phone className="w-4 h-4 text-[#D4AF37]" />
                <span>Llamar / Asistente IA</span>
              </button>
            </div>

            {/* Garantías y confirmación fehaciente */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-stone-400">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Confirmación inmediata por SMS y Email
              </span>
              <span>·</span>
              <span>Pago en el centro sin compromiso previo</span>
              <span>·</span>
              <button
                type="button"
                onClick={() =>
                  triggerCrmChat(
                    `Hola, me gustaría consultar dudas sobre los Baños de Gong en Fuenlabrada (${nextDateText}).`,
                    true
                  )
                }
                className="text-[#E5C378] underline hover:text-white cursor-pointer"
              >
                Abrir chat del centro
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          MODAL LIGHTBOX PARA VÍDEO Y FLYER
      ───────────────────────────────────────────────────────────── */}
      {activeMediaModal && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveMediaModal(null)}
        >
          <div
            className="relative bg-[#0D1F18] border border-[#C5A059]/40 rounded-2xl max-w-3xl w-full p-4 sm:p-6 overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del Modal con Selector de Contenido */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setActiveMediaModal("video-actividad")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    activeMediaModal === "video-actividad"
                      ? "bg-[#800020] text-white shadow"
                      : "bg-white/10 text-stone-300 hover:text-white"
                  }`}
                >
                  <Play className="w-3 h-3 text-[#E5C378] fill-current" />
                  <span>Vídeo Actividad</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMediaModal("video-sesion")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    activeMediaModal === "video-sesion"
                      ? "bg-[#800020] text-white shadow"
                      : "bg-white/10 text-stone-300 hover:text-white"
                  }`}
                >
                  <Play className="w-3 h-3 text-[#E5C378] fill-current" />
                  <span>Vídeo Sala</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMediaModal("flyer")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    activeMediaModal === "flyer"
                      ? "bg-[#800020] text-white shadow"
                      : "bg-white/10 text-stone-300 hover:text-white"
                  }`}
                >
                  <Maximize2 className="w-3 h-3 text-[#E5C378]" />
                  <span>Cartel</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setActiveMediaModal(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer shrink-0 self-end sm:self-auto"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido según selección */}
            {activeMediaModal === "video-actividad" && (
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black shadow-inner">
                <video
                  key="video-actividad"
                  src="/videos/itinerario-3.mp4"
                  poster="/videos/itinerario-3-poster.jpg"
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            {activeMediaModal === "video-sesion" && (
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black shadow-inner">
                <video
                  key="video-sesion"
                  src="/videos/Bano-de-Gong_particular.mp4"
                  poster="/videos/Bano-de-Gong_particular-poster.jpg"
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            {activeMediaModal === "flyer" && (
              <div className="max-h-[75vh] overflow-auto flex items-center justify-center bg-black/50 rounded-xl p-2">
                <img
                  src="/flyers/banogongparticular.jpg"
                  alt="Cartel oficial de Baños de Gong en el Centro de Yoga Salvadora Conesa"
                  className="max-h-[70vh] w-auto object-contain rounded-lg shadow-lg"
                />
              </div>
            )}

            <div className="pt-3 text-center">
              <span className="text-xs text-stone-400">
                {activeMediaModal === "video-actividad"
                  ? "Vídeo Resumen de la Actividad (itinerario-3.mp4)"
                  : activeMediaModal === "video-sesion"
                  ? "Vídeo de Sala · Baños de Gong (Bano-de-Gong_particular.mp4)"
                  : "Cartel Oficial de la Convocatoria"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
