"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  MessageCircle,
  Phone,
  Play,
  ArrowRight,
  HelpCircle,
  Ticket,
  Maximize2,
  X,
  Compass,
  Heart,
  Activity,
  Layers,
  Wind,
  Smile,
  ChevronDown,
} from "lucide-react";
import {
  CrmService,
  formatServicePrice,
  FALLBACK_CRM_SERVICES,
} from "@/lib/crmServices";
import { getNumeroWassap } from "@/lib/featureFlags";
import { triggerCrmChat } from "@/components/ChatBubbleWidget";
import { triggerVapiCall } from "@/components/VapiCallModal";

interface PracticaYogaExperienceProps {
  activity?: CrmService;
}

export default function PracticaYogaExperience({
  activity,
}: PracticaYogaExperienceProps) {
  // Datos dinámicos del CRM
  const yogaService =
    activity ||
    FALLBACK_CRM_SERVICES.find((s) => /hatha yoga/i.test(s.name)) ||
    FALLBACK_CRM_SERVICES[0];

  const priceFormatted = formatServicePrice(yogaService);

  // WhatsApp
  const { clean: cleanPhone, display: formattedPhone } = getNumeroWassap();
  const wassapUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    "Hola Salvadora, me gustaría consultar horarios y solicitar mi primera clase de regalo (0 €) de Yoga en Fuenlabrada."
  )}`;

  // Modal para vídeos de Sala y Actividad
  const [activeMediaModal, setActiveMediaModal] = useState<
    "video-yoga" | "video-kundalini" | null
  >(null);

  // Vídeo activo en la galería interactiva de Nagna Yoga
  const [selectedNagnaVideo, setSelectedNagnaVideo] = useState(0);

  // Vídeo activo en la galería interactiva de Asanas
  const [selectedAsanaVideo, setSelectedAsanaVideo] = useState(0);

  // FAQ State
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  // Colección de vídeos de Nagna Yoga
  const nagnaVideos = [
    {
      id: "1",
      num: "I.",
      title: "El origen del conocimiento",
      description:
        "Una primera toma de contacto con el espíritu del Nagna Yoga: de dónde viene y qué sentido tiene detenerse a comprender antes de practicar.",
      src: "/videos/nagna_yoga/nagnayoga1.mp4",
      topic: "Filosofía & Consciencia",
    },
    {
      id: "2",
      num: "II.",
      title: "La respiración consciente",
      description:
        "Claves sencillas sobre el papel del pranayama en la práctica: cómo convertir el aire en la guía silenciosa de cada postura.",
      src: "/videos/nagna_yoga/nagnayoga2.mp4",
      topic: "Respiración & Pranayama",
    },
    {
      id: "3",
      num: "III.",
      title: "Anatomía del cuerpo en movimiento",
      description:
        "Nociones prácticas de biomecánica y cadenas musculares para comprender qué le estamos pidiendo al cuerpo en cada asana.",
      src: "/videos/nagna_yoga/nagnayoga3.mp4",
      topic: "Biomecánica & Cadenas",
    },
    {
      id: "4",
      num: "IV.",
      title: "El silencio como maestro",
      description:
        "Un acercamiento a la quietud mental y a la escucha interior como parte esencial e integradora del aprendizaje del yoga.",
      src: "/videos/nagna_yoga/nagnayoga4.mp4",
      topic: "Quietud & Meditación",
    },
  ];

  // Colección de vídeos de Mejorar las Asanas
  const asanasVideos = [
    {
      id: "1",
      num: "I.",
      title: "Corrección básica: Base y apoyos",
      description:
        "Un ajuste sencillo que marca la diferencia en la base de la postura: cómo colocar bien los apoyos para sostener el cuerpo con menos esfuerzo y mayor estabilidad.",
      src: "/videos/el_espacio_para_mejorar_las_asanas/correccion1.mp4",
      focus: "Apoyos & Enraizamiento",
    },
    {
      id: "2",
      num: "II.",
      title: "Corrección básica: Alineación sin compensar",
      description:
        "Seguimos afinando el detalle: una segunda corrección muy sencilla para ganar estabilidad y evitar sobrecargas o compensaciones lumbares innecesarias.",
      src: "/videos/el_espacio_para_mejorar_las_asanas/correccion2.mp4",
      focus: "Eje & Descompresión",
    },
    {
      id: "3",
      num: "III.",
      title: "Saludo al Sol (Secuencia completa)",
      description:
        "La secuencia completa del Surya Namaskar explicada paso a paso, integrando respiración, fluidez y alineación consciente de principio a fin.",
      src: "/videos/el_espacio_para_mejorar_las_asanas/saludo_al_sol.mp4",
      focus: "Secuencia Fluida",
    },
  ];

  const faqs = [
    {
      q: "¿Es mi primera vez haciendo yoga, puedo incorporarme a las clases?",
      a: "¡Por supuesto! Nuestras clases son inclusivas y progresivas. La primera clase de prueba es totalmente gratuita (un regalo de bienvenida sin compromiso), y adaptamos cada postura con apoyos y variantes a tu nivel físico actual.",
    },
    {
      q: "¿Qué diferencia hay entre Hatha, Kundalini y Nagna Yoga?",
      a: "El Hatha Yoga trabaja la alineación corporal, la descompresión articular y la calma mental mediante posturas estáticas y respiración consciente. Kundalini Yoga incide en la activación energética a través de kriyas y mantras. Y Nagna Yoga es nuestro espacio didáctico para comprender la anatomía y filosofía de la práctica.",
    },
    {
      q: "¿Por qué se trabaja preferentemente en descarga?",
      a: "Al practicar posturas en descarga (tumbados o con apoyos estables), liberamos a los discos intervertebrales de la compresión que sufren a diario por la gravedad y las malas posturas, favoreciendo su rehidratación natural y cuidando la espalda.",
    },
    {
      q: "¿Cómo son los horarios y la flexibilidad de recuperación?",
      a: "Dispones de horarios de mañana y tarde. Como alumno con turno fijo tienes tu plaza asegurada sin tener que reservar cada semana. Y si algún día no puedes asistir y avisas previamente, dispones de hasta 3 meses (90 días) para recuperar tu clase en cualquier otro turno con plaza disponible.",
    },
    {
      q: "¿Qué necesito llevar al centro?",
      a: "Ropa cómoda que te permita moverte con libertad y calcetines cálidos. En el centro ponemos a tu entera disposición esterillas de calidad, mantas, zafus y bloques higienizados para tu confort.",
    },
  ];

  return (
    <div className="w-full text-stone-800 font-sans selection:bg-[#C5A059]/30 selection:text-[#12241D]">
      {/* ─────────────────────────────────────────────────────────────
          1. CABECERA CINEMATOGRÁFICA — SLIDER PRÁCTICA YOGA
      ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl shadow-md bg-[#0D1F18] border border-[#C5A059]/30">
        <div className="relative w-full aspect-[16/9] sm:aspect-[1920/780] min-h-[380px] sm:min-h-[480px] max-h-[640px] flex items-center justify-center overflow-hidden">
          {/* Fotografía protagonista obligatoria slider_practica_yoga.jpg */}
          <img
            src="/imagenes/yoga/slider_practica_yoga.jpg"
            alt="Practica Yoga en Fuenlabrada - Salvadora Conesa realizando postura de yoga en descarga y equilibrio"
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.05] transition-transform duration-1000 ease-out hover:scale-102"
            loading="eager"
          />

          {/* Degradado oscuro suave y cinematográfico */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1612]/95 via-[#0A1612]/45 to-[#0A1612]/30 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#0A1612]/20 to-[#0A1612]/70 pointer-events-none" />

          {/* Contenido textual del Hero */}
          <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-12 flex flex-col items-center text-center justify-end h-full">
            {/* Logotipo discreto de la flor de loto */}
            <div className="w-12 h-12 sm:w-14 sm:h-14 mb-3 opacity-90 drop-shadow-md">
              <img
                src="/imagenes/yoga/flor_loto_logo.png"
                alt="Flor de Loto - Centro de Yoga Salvadora Conesa"
                className="w-full h-full object-contain filter brightness-110 drop-shadow-lg"
              />
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#12241D]/80 backdrop-blur-md border border-[#C5A059]/50 text-[#E5C378] text-[11px] sm:text-xs font-bold uppercase tracking-widest mb-3 shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
              <span>Centro de Yoga Salvadora Conesa · Fuenlabrada (Madrid)</span>
            </div>

            {/* Título Principal solicitado */}
            <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-md leading-tight max-w-4xl">
              Practica Yoga — Un camino hacia el equilibrio, la consciencia y el bienestar
            </h1>

            {/* Subtítulo recuperado de la web antigua */}
            <p className="font-serif italic text-sm sm:text-lg text-[#E5C378] mt-2 max-w-3xl text-shadow-sm font-light">
              «Hatha, Kundalini y Nagna Yoga: sesiones pensadas para cuidar tu columna, tu respiración y tu calma, sesión a sesión.»
            </p>

            {/* Badges de Clases y Regalo */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm text-stone-200 font-medium">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/60 backdrop-blur-sm border border-emerald-500/40 text-emerald-300 font-bold">
                🎁 1ª Clase de Regalo (0 €)
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10">
                <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                Grupos Mañana y Tarde
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 text-[#E5C378] font-bold">
                <Ticket className="w-3.5 h-3.5 text-[#D4AF37]" />
                {priceFormatted} (con turno reservado)
              </span>
            </div>

            {/* Botones de acción rápida en Hero */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 w-full sm:w-auto">
              <a
                href="#reservar-clase"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-gradient-to-r from-[#C5A059] via-[#D4AF37] to-[#B38D45] hover:from-[#D4AF37] hover:to-[#C5A059] text-[#0D1F18] font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-xl shadow-amber-900/30 hover:scale-103 active:scale-97 transition-all duration-200 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 fill-current" />
                <span>Reservar mi 1ª Clase Gratuita</span>
              </a>

              <button
                type="button"
                onClick={() => setActiveMediaModal("video-yoga")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-black/50 hover:bg-black/70 backdrop-blur-md text-white border border-[#C5A059]/40 font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl hover:border-[#C5A059] transition-all duration-200 cursor-pointer"
              >
                <Play className="w-4 h-4 text-[#D4AF37] fill-current" />
                <span>Ver vídeo de la sala</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. CÓMO SON LAS SESIONES: DESCARGA, COLUMNA Y FASCIAS
      ───────────────────────────────────────────────────────────── */}
      <section className="mt-14 sm:mt-18">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Cabecera de sección */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#12241D]/5 text-[#132A21] text-xs font-bold uppercase tracking-wider border border-[#132A21]/15">
              <Activity className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>1. La Práctica en el Centro</span>
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#12241D] leading-tight">
              Cómo son las sesiones: Cuidar tu columna y habitar tu cuerpo
            </h2>
            <p className="text-sm sm:text-base text-stone-600 font-light leading-relaxed">
              En el Centro de Yoga Salvadora Conesa entendemos la práctica como un espacio donde detenerse, respirar y atender las necesidades de tu estructura corporal con rigor anatómico y sensibilidad.
            </p>
          </div>

          {/* Bloque 1: Práctica en Descarga y Discos Intervertebrales */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white p-6 sm:p-10 rounded-2xl border border-[#C5A059]/25 shadow-sm">
            <div className="md:col-span-7 space-y-4 text-stone-700 leading-relaxed font-sans text-sm sm:text-base">
              <span className="text-xs uppercase tracking-wider text-[#96680E] font-bold block">
                Salud Vertebral & Alivio de Cargas
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#800020]">
                Prácticas realizadas preferentemente en descarga
              </h3>
              <p>
                A lo largo del día, la fuerza de gravedad y las horas sentados comprimen de forma continua nuestra columna. Por eso, en nuestras clases trabajamos gran parte de las posturas <strong>en descarga</strong> (tumbados o con apoyos biomecánicos controlados).
              </p>
              <p>
                Esto beneficia de forma directa a los <strong>discos intervertebrales</strong>. Con el paso del tiempo, el disco tiende a deshidratarse y se ve castigado por presiones desiguales. Determinados ejercicios en descarga favorecen la descompresión y facilitan que la columna conserve su movilidad y flexibilidad en mejores condiciones.
              </p>
            </div>

            <div className="md:col-span-5">
              <div className="rounded-2xl overflow-hidden border border-[#C5A059]/30 shadow-md bg-stone-100 group">
                <img
                  src="/imagenes/yoga/yoga_postura_1.jpg"
                  alt="Salvadora Conesa practicando postura de estiramiento y apertura en descarga"
                  className="w-full h-auto object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="p-3 bg-stone-50 border-t border-stone-200 text-center">
                  <span className="text-xs text-stone-600 font-medium">
                    Apertura torácica y estiramiento anterior sin sobrecarga lumbar
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bloque 2: Cadenas Musculares, Fascias y el «Gran Traje» */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white p-6 sm:p-10 rounded-2xl border border-[#C5A059]/25 shadow-sm">
            <div className="md:col-span-5 order-2 md:order-1">
              <div className="rounded-2xl overflow-hidden border border-[#C5A059]/30 shadow-md bg-stone-100 group">
                <img
                  src="/imagenes/yoga/yoga_postura_2.jpg"
                  alt="Salvadora Conesa en postura de Trikonasana (triángulo) trabajando la globalidad de la cadena lateral"
                  className="w-full h-auto object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="p-3 bg-stone-50 border-t border-stone-200 text-center">
                  <span className="text-xs text-stone-600 font-medium">
                    Alineación en Trikonasana: estiramiento armónico de la cadena miofascial
                  </span>
                </div>
              </div>
            </div>

            <div className="md:col-span-7 order-1 md:order-2 space-y-4 text-stone-700 leading-relaxed font-sans text-sm sm:text-base">
              <span className="text-xs uppercase tracking-wider text-[#96680E] font-bold block">
                Biomecánica y Fascias
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#800020]">
                Las fascias y el espíritu de globalidad
              </h3>
              <p>
                Los músculos no trabajan aislados: están envueltos y conectados por las <strong>fascias</strong>, una red continua de tejido conjuntivo que funciona como un <em>«gran traje»</em> biomecánico. Ellas determinan en gran medida la retracción o libertad de nuestro movimiento.
              </p>
              <p>
                En nuestras sesiones trabajamos siempre con <strong>espíritu de globalidad</strong>: al estirar un extremo de la cadena, vigilamos no provocar compensaciones en el opuesto. Estirar ambos extremos a la vez descomprime las articulaciones y favorece la nutrición de los cartílagos articulares.
              </p>
            </div>
          </div>

          {/* Bloque 3: Circulación Linfática, Respiración y Autorregulación Nerviosa */}
          <div className="bg-[#FAF9F6] p-6 sm:p-10 rounded-2xl border border-[#C5A059]/30 space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs uppercase tracking-wider text-[#96680E] font-bold block">
                Respiración Consciente & Sistema Nervioso
              </span>
              <h3 className="font-serif text-xl sm:text-3xl font-bold text-[#12241D]">
                La linfa y la respuesta de autorregulación
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-2">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                  <Wind className="w-5 h-5 text-emerald-700" />
                </div>
                <h4 className="font-serif font-bold text-stone-900 text-base">
                  Retorno Linfático
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed font-light">
                  A diferencia de la sangre, la linfa no cuenta con un corazón que la impulse. Se desplaza gracias al cambio de presiones que genera el movimiento suave y la respiración profunda, facilitando el deslizamiento entre tejidos.
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-2">
                <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
                  <Activity className="w-5 h-5 text-[#96680E]" />
                </div>
                <h4 className="font-serif font-bold text-stone-900 text-base">
                  Sistema Neurovegetativo
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed font-light">
                  La alternancia de asanas estáticas con pausas conscientes activa el tono parasimpático, induciendo una respuesta clara de autorregulación que reduce el estrés acumulado de la semana.
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-2">
                <div className="w-10 h-10 rounded-lg bg-rose-50 text-[#800020] flex items-center justify-center font-bold">
                  <Heart className="w-5 h-5 text-[#800020]" />
                </div>
                <h4 className="font-serif font-bold text-stone-900 text-base">
                  Liberar la Respiración
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed font-light">
                  Al abrir la caja torácica y relajar el diafragma, la respiración deja de ser corta o forzada para transformarse en un ancla de calma física y claridad mental.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. BENEFICIOS CONTRASTADOS DE PRACTICAR YOGA
      ───────────────────────────────────────────────────────────── */}
      <section className="mt-16 sm:mt-20 bg-gradient-to-b from-[#12241D] via-[#0E1C17] to-[#12241D] text-white rounded-3xl p-6 sm:p-12 shadow-md border border-[#C5A059]/25 relative overflow-hidden">
        <div className="max-w-5xl mx-auto space-y-10 relative z-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#E5C378] text-xs font-bold uppercase tracking-wider border border-[#C5A059]/40">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Beneficios Físicos y Emocionales</span>
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white">
              Qué te aporta la práctica continuada
            </h2>
            <p className="text-sm sm:text-base text-stone-300 font-light leading-relaxed">
              El yoga no busca competir con tu cuerpo, sino ofrecerle el espacio que necesita para regenerarse y funcionar en equilibrio.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 space-y-2">
              <span className="text-[#E5C378] text-xl block">🧘‍♀️</span>
              <h3 className="font-serif font-bold text-lg text-[#E5C378]">
                Alivio en la Espalda
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed font-light">
                Descarga de tensiones cervicales, dorsales y lumbares provocadas por posturas mantenidas frente a pantallas o sedentarismo.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 space-y-2">
              <span className="text-[#E5C378] text-xl block">🌿</span>
              <h3 className="font-serif font-bold text-lg text-[#E5C378]">
                Elasticidad y Fascias
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed font-light">
                Conservación de la movilidad articular, recuperando elasticidad funcional en caderas, hombros y cadenas posteriores.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 space-y-2">
              <span className="text-[#E5C378] text-xl block">🕊️</span>
              <h3 className="font-serif font-bold text-lg text-[#E5C378]">
                Calma y Reducción del Estrés
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed font-light">
                Aquietamiento del ritmo mental gracias a la relajación final y la atención plena en cada respiración.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 space-y-2">
              <span className="text-[#E5C378] text-xl block">📏</span>
              <h3 className="font-serif font-bold text-lg text-[#E5C378]">
                Higiene Postural
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed font-light">
                Mayor conciencia del propio eje corporal, aprendiendo a sostenerse de pie y sentarse sin forzar la musculatura.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 space-y-2">
              <span className="text-[#E5C378] text-xl block">🏃</span>
              <h3 className="font-serif font-bold text-lg text-[#E5C378]">
                Prevención de Lesiones
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed font-light">
                Un acondicionamiento complementario ideal para caminantes, corredores o practicantes de otros deportes.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 space-y-2">
              <span className="text-[#E5C378] text-xl block">🌙</span>
              <h3 className="font-serif font-bold text-lg text-[#E5C378]">
                Mejora del Descanso
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed font-light">
                Al soltar el tono muscular hipertónico antes de volver a casa, se favorece un sueño más reparador y profundo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. SECCIÓN 2: NAGNA YOGA — EL YOGA DEL CONOCIMIENTO
      ───────────────────────────────────────────────────────────── */}
      <section
        id="nagna-yoga"
        className="mt-16 sm:mt-24 scroll-mt-24 pt-8 border-t border-[#C5A059]/20"
      >
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#12241D]/5 text-[#132A21] text-xs font-bold uppercase tracking-wider border border-[#132A21]/15">
              <Compass className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>2. El Yoga del Conocimiento</span>
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#800020]">
              NAGNA YOGA
            </h2>
            <p className="text-base sm:text-lg text-stone-600 font-light leading-relaxed">
              El espacio de aprendizaje creado por Salvadora Conesa para comprender la anatomía, la respiración y los fundamentos del yoga antes de habitarlos en la esterilla.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#C5A059]/20 shadow-sm text-stone-700 leading-relaxed space-y-4 text-sm sm:text-base">
            <p>
              <strong>Nagna Yoga</strong> es el yoga del conocimiento. Es un proyecto didáctico nacido de más de cuatro décadas de docencia: pequeñas cápsulas audiovisuales de unos cinco minutos en las que Salvadora desgrana con lenguaje claro y cercano las claves que marcan la diferencia entre &quot;hacer&quot; una postura y vivirla con consciencia.
            </p>
            <p>
              Cada vídeo es una semilla de conocimiento pensada para acompañarte a tu propio ritmo: puedes volver a él las veces que desees, pausarlo y dejar que poco a poco cale en tu práctica semanal.
            </p>
          </div>

          {/* Galería de Vídeos de Nagna Yoga */}
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#12241D]">
                Colección de Vídeos de Nagna Yoga
              </h3>
              <span className="text-xs font-bold text-[#96680E] uppercase tracking-wider">
                {nagnaVideos.length} entregas disponibles
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {nagnaVideos.map((vid, idx) => (
                <div
                  key={vid.id}
                  className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="relative aspect-video bg-black">
                    <video
                      src={vid.src}
                      controls
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 inline-block mb-1">
                        {vid.topic}
                      </span>
                      <h4 className="font-serif text-base sm:text-lg font-bold text-[#800020]">
                        {vid.num} {vid.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mt-1">
                        {vid.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#FAF9F6] p-5 rounded-xl border border-[#C5A059]/30 text-center text-xs text-stone-600 italic">
              «Si alguna de las explicaciones despierta en ti una duda o inquietud anatómica, tráela a clase: el conocimiento del yoga se sigue construyendo entre todos.»
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. SECCIÓN 3: EL ESPACIO PARA MEJORAR LAS ASANAS
      ───────────────────────────────────────────────────────────── */}
      <section
        id="mejorar-asanas"
        className="mt-16 sm:mt-24 scroll-mt-24 pt-8 border-t border-[#C5A059]/20"
      >
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#12241D]/5 text-[#132A21] text-xs font-bold uppercase tracking-wider border border-[#132A21]/15">
              <Layers className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>3. Ajustes y Alineación</span>
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#800020]">
              El Espacio para Mejorar las Asanas
            </h2>
            <p className="text-base sm:text-lg text-stone-600 font-light leading-relaxed">
              Detenerse en el detalle: pequeños gestos técnicos que transforman por completo cómo se siente una postura en el cuerpo.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#C5A059]/20 shadow-sm text-stone-700 leading-relaxed space-y-4 text-sm sm:text-base">
            <p>
              A menudo, la diferencia entre una postura que nos genera tensión y otra que nos sostiene con ligereza no radica en esforzarse más, sino en <strong>ajustar con mayor precisión</strong>.
            </p>
            <p>
              En este espacio compartimos vídeos breves y prácticos con correcciones de apoyos, pelvis, hombros y respiración para que revises tus posturas antes o después de tu práctica semanal.
            </p>
          </div>

          {/* Galería de Vídeos de Mejorar las Asanas */}
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#12241D]">
                Vídeos Técnicos de Ajuste
              </h3>
              <span className="text-xs font-bold text-[#96680E] uppercase tracking-wider">
                {asanasVideos.length} vídeos de corrección
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {asanasVideos.map((vid) => (
                <div
                  key={vid.id}
                  className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="relative aspect-video bg-black">
                    <video
                      src={vid.src}
                      controls
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200 inline-block mb-1">
                        {vid.focus}
                      </span>
                      <h4 className="font-serif text-base font-bold text-[#800020]">
                        {vid.num} {vid.title}
                      </h4>
                      <p className="text-xs text-stone-600 leading-relaxed mt-1">
                        {vid.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. SECCIÓN 4: CONOCE NUESTRO ESPACIO DE YOGA & VÍDEOS DE ACTIVIDAD
      ───────────────────────────────────────────────────────────── */}
      <section className="mt-16 sm:mt-24 pt-8 border-t border-[#C5A059]/20">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#12241D]/5 text-[#132A21] text-xs font-bold uppercase tracking-wider border border-[#132A21]/15">
              <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>4. Nuestra Sala en Fuenlabrada</span>
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#12241D]">
              Conoce nuestro espacio de Yoga
            </h2>
            <p className="text-sm sm:text-base text-stone-600 font-light">
              Un entorno acogedor, silencioso y luminoso concebido exclusivamente para la práctica y el recogimiento.
            </p>
          </div>

          {/* Fotografía destacada de la sala con botones de vídeo */}
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-md border border-[#C5A059]/30 aspect-[16/9] sm:aspect-[21/9]">
            <img
              src="/imagenes/yoga/01_05_yoga_sala_centro_1920x1080.jpg"
              alt="Sala principal del Centro de Yoga Salvadora Conesa en Fuenlabrada con esterillas, cojines y luz natural"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end p-6 sm:p-10 text-white">
              <span className="text-xs font-bold uppercase tracking-wider text-[#E5C378] mb-1">
                Calle Pelayos, 1 · Fuenlabrada (Madrid)
              </span>
              <h3 className="font-serif text-xl sm:text-3xl font-bold text-white mb-2">
                Un refugio de paz en el centro de Fuenlabrada
              </h3>
              <p className="text-xs sm:text-sm text-stone-200 max-w-xl font-light mb-4">
                Suelo de madera cálido, esterillas higienizadas, mantas, zafus y una acústica cuidada para que disfrutes de tu práctica con comodidad absoluta.
              </p>

              {/* Botones para reproducir vídeos de la actividad */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveMediaModal("video-yoga")}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#800020] hover:bg-[#660019] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition duration-150 shadow-sm cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 text-[#E5C378] fill-current" />
                  <span>Ver Vídeo de Hatha Yoga (itinerario-1)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMediaModal("video-kundalini")}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white border border-[#C5A059]/50 text-xs font-bold uppercase tracking-wider rounded-xl transition duration-150 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 text-[#D4AF37] fill-current" />
                  <span>Ver Vídeo de Kundalini & Meditación</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. PREGUNTAS FRECUENTES (FAQ)
      ───────────────────────────────────────────────────────────── */}
      <section className="mt-16 sm:mt-24">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#12241D]/5 text-[#132A21] text-xs font-bold uppercase tracking-wider border border-[#132A21]/15">
              <HelpCircle className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Dudas Habituales</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#12241D]">
              Preguntas Frecuentes sobre las Clases de Yoga
            </h2>
            <p className="text-sm text-stone-600 font-light">
              Todo lo que necesitas saber antes de tu primera clase.
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
        id="reservar-clase"
        className="mt-16 sm:mt-24 scroll-mt-24"
      >
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#12241D] via-[#0B1713] to-[#12241D] rounded-3xl p-8 sm:p-14 text-white text-center shadow-md border-2 border-[#C5A059]/40 relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059]/20 text-[#E5C378] text-xs font-bold uppercase tracking-widest border border-[#C5A059]/40">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>100% Gratuita · Sin Permanencia ni Compromiso</span>
            </span>

            <h2 className="font-serif text-3xl sm:text-5xl font-black text-white leading-tight">
              Ven a probar tu 1ª Clase de Yoga de Regalo
            </h2>

            <p className="text-sm sm:text-base text-stone-300 font-light leading-relaxed">
              Descubre en primera persona cómo sienta una práctica cuidada, en descarga y pensada para tu columna. Consulta los turnos libres de mañana o tarde y reserva tu plaza.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={wassapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-[#25D366] via-[#20BD5A] to-[#1BA84E] hover:from-[#20BD5A] hover:to-[#1BA84E] text-white font-extrabold text-sm sm:text-base uppercase tracking-wider rounded-2xl shadow-xl shadow-emerald-950/40 hover:scale-103 active:scale-97 transition duration-200 cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Pedir mi Clase Gratis por WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() =>
                  triggerVapiCall({
                    inquiry: "Consulta sobre Clases de Hatha Yoga y primera clase gratis",
                  })
                }
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-[#C5A059]/50 font-bold text-sm uppercase tracking-wider rounded-2xl hover:border-[#C5A059] transition duration-200 cursor-pointer"
              >
                <Phone className="w-4 h-4 text-[#D4AF37]" />
                <span>Llamar / Asistente IA</span>
              </button>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-stone-400">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Confirmación inmediata por SMS y Email
              </span>
              <span>·</span>
              <span>Flexibilidad de recuperación hasta 3 meses</span>
              <span>·</span>
              <button
                type="button"
                onClick={() =>
                  triggerCrmChat(
                    "Hola, me gustaría información y horarios de las clases de Yoga en Fuenlabrada.",
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
          MODAL LIGHTBOX PARA VÍDEOS DE ACTIVIDAD Y SALA
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
            {/* Header del Modal */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveMediaModal("video-yoga")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    activeMediaModal === "video-yoga"
                      ? "bg-[#800020] text-white shadow"
                      : "bg-white/10 text-stone-300 hover:text-white"
                  }`}
                >
                  <Play className="w-3 h-3 text-[#E5C378] fill-current" />
                  <span>Hatha Yoga (itinerario-1)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMediaModal("video-kundalini")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    activeMediaModal === "video-kundalini"
                      ? "bg-[#800020] text-white shadow"
                      : "bg-white/10 text-stone-300 hover:text-white"
                  }`}
                >
                  <Play className="w-3 h-3 text-[#E5C378] fill-current" />
                  <span>Kundalini & Meditación</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setActiveMediaModal(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Reproductor del vídeo */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black shadow-inner">
              <video
                key={activeMediaModal}
                src={
                  activeMediaModal === "video-yoga"
                    ? "/videos/itinerario-1.mp4"
                    : "/videos/itinerario-2.mp4"
                }
                poster={
                  activeMediaModal === "video-yoga"
                    ? "/videos/itinerario-1-poster.jpg"
                    : "/videos/itinerario-2-poster.jpg"
                }
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              />
            </div>

            <div className="pt-3 text-center">
              <span className="text-xs text-stone-400">
                {activeMediaModal === "video-yoga"
                  ? "Vídeo de Sala de Hatha Yoga · Centro de Yoga Salvadora Conesa (Fuenlabrada)"
                  : "Vídeo de Kundalini Yoga y Meditación · Centro de Yoga Salvadora Conesa (Fuenlabrada)"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
