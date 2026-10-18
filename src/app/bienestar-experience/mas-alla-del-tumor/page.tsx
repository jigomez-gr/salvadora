import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Ticket,
  ArrowUpRight,
  Sparkles,
  Users,
  Compass,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  HeartHandshake,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Bienestar Experience 2026: Más allá del tumor | Madrid",
  description:
    "Bienestar Experience 2026 · Más allá del tumor. Una mirada integrativa sobre el cáncer con Txiki Soto, Giulliana Gabaldoni y María Salvadora Conesa en Madrid.",
  alternates: {
    canonical: "https://salvadoraconesa.es/bienestar-experience/mas-alla-del-tumor",
  },
  openGraph: {
    title: "Bienestar Experience 2026 · Más allá del tumor",
    description:
      "Una mirada integrativa sobre el cáncer y el bienestar. 13 de noviembre de 2026 en Madrid.",
    url: "https://salvadoraconesa.es/bienestar-experience/mas-alla-del-tumor",
    siteName: "Centro de Yoga Salvadora Conesa",
    images: [
      {
        url: "https://salvadoraconesa.es/flyers/bienestar.png",
        width: 1200,
        height: 630,
        alt: "Bienestar Experience 2026 Más allá del tumor en Madrid",
      },
    ],
    locale: "es_ES",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bienestar Experience 2026 · Más allá del tumor",
    description:
      "Una mirada integrativa sobre el cáncer y el bienestar. 13 de noviembre de 2026 en Madrid.",
    images: ["https://salvadoraconesa.es/flyers/bienestar.png"],
  },
};

const EVENT_END_DATE = new Date("2026-11-13T21:30:00+01:00");

export default function MasAllaDelTumorPage() {
  const isPastEvent = new Date().getTime() > EVENT_END_DATE.getTime();

  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Bienestar Experience 2026 · Más allá del tumor",
    startDate: "2026-11-13T16:30:00+01:00",
    endDate: "2026-11-13T21:30:00+01:00",
    eventStatus: isPastEvent
      ? "https://schema.org/EventMovedOnline"
      : "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: "Impact Hub Gobernador",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Calle del Gobernador, 26",
        addressLocality: "Madrid",
        postalCode: "28014",
        addressRegion: "Madrid",
        addressCountry: "ES",
      },
    },
    image: [
      "https://salvadoraconesa.es/flyers/bienestar.png",
      "https://salvadoraconesa.es/videos/Promo_Bienestar-Experience-2026_1920x1080-poster.jpg",
    ],
    description:
      "Bienestar Experience 2026 propone una mirada integrativa sobre el cáncer en Madrid. Un encuentro dedicado al cuidado global de la persona, con Txiki Soto, Giulliana Gabaldoni y el cierre sonoro con Baño de Gong de María Salvadora Conesa.",
    offers: {
      "@type": "Offer",
      url: "https://txikisoto.com/bienestarexperience/",
      price: "19.99",
      priceCurrency: "EUR",
      availability: isPastEvent
        ? "https://schema.org/Discontinued"
        : "https://schema.org/InStock",
      validFrom: "2026-01-01T00:00:00+01:00",
    },
    performer: [
      {
        "@type": "Person",
        name: "Txiki Soto",
        jobTitle: "Especialista en salud integrativa y consciencia",
      },
      {
        "@type": "Person",
        name: "Giulliana Gabaldoni",
        jobTitle: "Conferenciante y mentora de vida consciente",
      },
      {
        "@type": "Person",
        name: "María Salvadora Conesa",
        jobTitle: "Directora del Centro de Yoga Salvadora Conesa y Sonoterapeuta de Gong",
        url: "https://salvadoraconesa.es",
      },
    ],
    organizer: {
      "@type": "Organization",
      name: "Bienestar Experience",
      url: "https://txikisoto.com/bienestarexperience/",
    },
  };

  return (
    <div className="bg-[#FAF9F6] text-[#1C1C1C] min-h-screen flex flex-col justify-between selection:bg-[#800020] selection:text-white font-sans">
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />

      <main className="pt-28 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Breadcrumb de navegación interna */}
        <nav aria-label="Miga de pan" className="mb-6 flex items-center gap-2 text-xs text-stone-500 flex-wrap">
          <Link href="/" className="hover:text-[#800020] transition-colors">
            Inicio
          </Link>
          <span className="text-stone-300">/</span>
          <Link href="/#itinerario" className="hover:text-[#800020] transition-colors">
            Actividades
          </Link>
          <span className="text-stone-300">/</span>
          <Link href="/#dia-9" className="hover:text-[#800020] transition-colors">
            Bienestar Experience
          </Link>
          <span className="text-stone-300">/</span>
          <span className="text-stone-800 font-bold">Más allá del tumor</span>
        </nav>

        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/#dia-9"
            className="text-xs uppercase font-bold tracking-widest text-[#800020] hover:underline inline-flex items-center space-x-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a Bienestar Experience en Actividades</span>
          </Link>
        </div>

        {/* Hero Section del Evento */}
        <article className="space-y-12">
          {/* Header del evento */}
          <header className="space-y-4 text-center sm:text-left border-b border-[#C5A059]/20 pb-8">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="text-xs uppercase tracking-widest text-[#96680E] font-extrabold px-3 py-1 bg-amber-50 rounded-full border border-[#C5A059]/30">
                Bienestar Experience · Encuentro Oficial 2026
              </span>
              {isPastEvent ? (
                <span className="text-xs uppercase tracking-wider text-stone-600 font-bold px-3 py-1 bg-stone-200 rounded-full">
                  Evento celebrado · Memoria del encuentro
                </span>
              ) : (
                <span className="text-xs uppercase tracking-wider text-emerald-800 font-extrabold px-3 py-1 bg-emerald-100 rounded-full border border-emerald-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  Próxima edición · Viernes 13 Noviembre 2026
                </span>
              )}
            </div>

            {/* Un solo H1 en toda la página */}
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#800020] leading-tight">
              Bienestar Experience 2026 · Más allá del tumor
            </h1>

            {/* H2 del evento */}
            <h2 className="font-serif text-xl sm:text-2xl text-[#C5A059] italic font-semibold">
              Una mirada integrativa sobre el cáncer
            </h2>

            <p className="text-sm sm:text-base text-stone-600 max-w-3xl leading-relaxed">
              Un espacio de salud integrativa, consciencia y bienestar integral en Madrid. Una tarde para mirar la salud de una manera más amplia y situar a la persona en el centro.
            </p>
          </header>

          {/* Flyer Principal & Ficha Rápida */}
          <section aria-labelledby="informacion-resumen" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Imagen principal / Flyer */}
            <div className="lg:col-span-5">
              <div className="bg-white p-3 rounded-2xl border border-[#C5A059]/25 shadow-md">
                <div className="relative aspect-[3/4] sm:aspect-[4/5] rounded-xl overflow-hidden bg-stone-100">
                  <Image
                    src="/flyers/bienestar.png"
                    alt="Bienestar Experience 2026 Más allá del tumor en Madrid"
                    width={800}
                    height={1000}
                    priority
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="mt-3 text-center">
                  <span className="text-[11px] uppercase tracking-wider text-stone-500 font-bold block">
                    Flyer Oficial Bienestar Experience 2026
                  </span>
                </div>
              </div>
            </div>

            {/* Tarjeta de Información Rápida & Reserva */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#C5A059]/25 shadow-sm space-y-6">
                <div>
                  <h3 id="informacion-resumen" className="font-serif text-2xl font-bold text-[#800020] mb-1">
                    Información del evento
                  </h3>
                  <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold">
                    Datos prácticos para asistir al encuentro en Madrid
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 bg-[#FAF9F6] p-4 rounded-xl border border-stone-200/70">
                    <Calendar className="w-5 h-5 text-[#800020] shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[11px] uppercase tracking-wider text-stone-500 font-bold">
                        Fecha
                      </span>
                      <span className="text-sm font-semibold text-stone-800">
                        Viernes 13 de noviembre de 2026
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-[#FAF9F6] p-4 rounded-xl border border-stone-200/70">
                    <Clock className="w-5 h-5 text-[#800020] shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[11px] uppercase tracking-wider text-stone-500 font-bold">
                        Horario
                      </span>
                      <span className="text-sm font-semibold text-stone-800">
                        16:30 a 21:30 h
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-[#FAF9F6] p-4 rounded-xl border border-stone-200/70">
                    <MapPin className="w-5 h-5 text-[#800020] shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[11px] uppercase tracking-wider text-stone-500 font-bold">
                        Lugar
                      </span>
                      <span className="text-sm font-semibold text-stone-800">
                        Impact Hub Gobernador
                      </span>
                      <span className="block text-xs text-stone-600 mt-0.5">
                        C/ del Gobernador, 26, Madrid
                      </span>
                      <span className="inline-block mt-1 text-[10px] font-bold text-stone-500 bg-white px-2 py-0.5 rounded border border-stone-200">
                        Metro Antón Martín
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-[#FAF9F6] p-4 rounded-xl border border-stone-200/70">
                    <Ticket className="w-5 h-5 text-[#800020] shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[11px] uppercase tracking-wider text-stone-500 font-bold">
                        Precio Entrada
                      </span>
                      <span className="text-lg font-extrabold text-[#800020]">
                        19,99 €
                      </span>
                      <span className="block text-xs text-stone-500">
                        Acceso a todas las ponencias y experiencia
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sección de Entradas */}
                <div className="pt-4 border-t border-stone-100">
                  <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">
                    Entradas Bienestar Experience 2026
                  </h3>
                  {isPastEvent ? (
                    <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-center space-y-2">
                      <p className="text-sm font-semibold text-stone-700">
                        Esta edición de Bienestar Experience ha finalizado.
                      </p>
                      <p className="text-xs text-stone-500">
                        Puedes consultar próximas actividades y retiros en el{" "}
                        <Link href="/" className="text-[#800020] underline font-bold">
                          Centro de Yoga Salvadora Conesa
                        </Link>{" "}
                        o visitar el canal oficial de Bienestar Experience.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-xs sm:text-sm text-stone-600">
                        Las entradas y reservas oficiales se gestionan a través de la plataforma oficial del encuentro. Plazas con aforo limitado en la sala.
                      </p>
                      <a
                        href="https://txikisoto.com/bienestarexperience/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-[#800020] hover:bg-[#800020]/90 text-white text-sm font-bold uppercase tracking-wider rounded-xl shadow-md shadow-[#800020]/15 hover:scale-[1.01] active:scale-98 transition duration-200 cursor-pointer text-center"
                      >
                        <span>RESERVAR ENTRADA</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                      <p className="text-[11px] text-stone-400 text-center">
                        Enlace oficial de información y compra: https://txikisoto.com/bienestarexperience/
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Sección: Bienestar integral y salud */}
          <section aria-labelledby="bienestar-integral-heading" className="bg-white p-6 sm:p-10 rounded-2xl border border-[#C5A059]/25 shadow-sm space-y-6">
            <div className="border-b border-stone-100 pb-4">
              <span className="text-xs uppercase tracking-widest text-[#96680E] font-extrabold block mb-1">
                Perspectiva y Enfoque
              </span>
              <h3 id="bienestar-integral-heading" className="font-serif text-2xl sm:text-3xl font-bold text-[#800020]">
                Bienestar integral y salud
              </h3>
            </div>

            <div className="space-y-4 text-stone-700 leading-relaxed font-sans text-sm sm:text-base">
              <p className="font-medium text-stone-900 text-base sm:text-lg">
                Una tarde para mirar la salud de una manera más amplia y poner a la persona en el centro.
              </p>
              <p>
                <strong>Bienestar Experience</strong> es un espacio de encuentro dedicado al bienestar integral, el autoconocimiento y el cuidado de cuerpo y mente. A través de diferentes encuentros reunimos profesionales, propuestas y experiencias que nos ayudan a mirar la salud desde una perspectiva más amplia, humana y consciente. Cada edición de Bienestar Experience aborda una temática diferente combinando conocimiento, reflexión y experiencias prácticas.
              </p>
              <p>
                <strong>Bienestar Experience 2026</strong> propone una mirada integrativa sobre el cáncer, relacionando diferentes dimensiones que influyen en nuestro bienestar: lo que comemos, cómo descansamos, lo que sentimos, lo que pensamos y la forma en la que vivimos.
              </p>
              <p>
                A menudo observamos por separado aspectos de nuestra vida que están profundamente relacionados. Durante este encuentro iremos uniendo esas piezas para acercarnos al bienestar desde una perspectiva más global y consciente.
              </p>
              <div className="bg-[#FAF9F6] p-4 sm:p-6 rounded-xl border-l-4 border-[#800020] text-stone-800 italic">
                &ldquo;No se trata únicamente de hablar de enfermedad. Se trata de hablar de personas, de salud y de vida.&rdquo;
              </div>
              <p>
                A lo largo de la tarde diferentes profesionales compartirán conocimientos, reflexiones y experiencias para ayudarnos a comprender la importancia del cuidado integral.
              </p>
            </div>
          </section>

          {/* Sección: Participantes */}
          <section aria-labelledby="participantes-heading" className="space-y-6">
            <div className="text-center sm:text-left">
              <span className="text-xs uppercase tracking-widest text-[#96680E] font-extrabold block mb-1">
                Conocimiento, Reflexión y Práctica
              </span>
              <h3 id="participantes-heading" className="font-serif text-2xl sm:text-3xl font-bold text-[#800020]">
                Participantes
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                Profesionales de referencia en salud integrativa, consciencia vital y terapias de sonido
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Txiki Soto */}
              <div className="bg-white p-6 rounded-2xl border border-[#C5A059]/25 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-full bg-[#800020]/10 text-[#800020] flex items-center justify-center font-serif text-2xl font-bold border border-[#800020]/20">
                    TS
                  </div>
                  <div>
                    <h4 className="font-serif text-xl font-bold text-stone-900">
                      Txiki Soto
                    </h4>
                    <span className="block text-xs uppercase tracking-wider text-[#96680E] font-extrabold mt-1">
                      Más allá del tumor · Una mirada integrativa sobre el cáncer
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
                    Una aproximación a la salud que invita a ampliar la mirada y comprender a la persona más allá de un diagnóstico.
                  </p>
                </div>
              </div>

              {/* Giulliana Gabaldoni */}
              <div className="bg-white p-6 rounded-2xl border border-[#C5A059]/25 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-full bg-[#800020]/10 text-[#800020] flex items-center justify-center font-serif text-2xl font-bold border border-[#800020]/20">
                    GG
                  </div>
                  <div>
                    <h4 className="font-serif text-xl font-bold text-stone-900">
                      Giulliana Gabaldoni
                    </h4>
                    <span className="block text-xs uppercase tracking-wider text-[#96680E] font-extrabold mt-1">
                      Diseña tu vida
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
                    Una invitación a reflexionar sobre nuestras decisiones, nuestra forma de vivir y la posibilidad de participar de manera más consciente en la construcción de nuestra propia vida.
                  </p>
                </div>
              </div>

              {/* María Salvadora Conesa */}
              <div className="bg-white p-6 rounded-2xl border border-[#C5A059]/25 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-full bg-[#800020]/10 text-[#800020] flex items-center justify-center font-serif text-2xl font-bold border border-[#800020]/20">
                    SC
                  </div>
                  <div>
                    <h4 className="font-serif text-xl font-bold text-stone-900">
                      María Salvadora Conesa
                    </h4>
                    <span className="block text-xs uppercase tracking-wider text-[#96680E] font-extrabold mt-1">
                      Baño de Gong
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
                    María Salvadora Conesa cerrará la jornada con un{" "}
                    <Link
                      href="/#dia-3"
                      className="text-[#800020] font-bold underline hover:text-[#96680E] transition-colors"
                    >
                      Baño de Gong
                    </Link>
                    , una experiencia sonora orientada a favorecer la relajación, la pausa, la escucha y la conexión con uno mismo.
                  </p>
                </div>
                <div className="pt-3 border-t border-stone-100 mt-4">
                  <Link
                    href="/#dia-3"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#800020] hover:underline"
                  >
                    <span>Conocer las sesiones de Baño de Gong</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Sección: Baño de Gong con María Salvadora Conesa */}
          <section aria-labelledby="gong-section-heading" className="bg-white p-6 sm:p-10 rounded-2xl border border-[#C5A059]/25 shadow-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-5">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-stone-200 shadow-sm">
                  <Image
                    src="/imagenes/gong/04_maria_con_cuenco_y_gong_1920x1080.jpg"
                    alt="María Salvadora Conesa en un Baño de Gong"
                    width={1920}
                    height={1080}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-[11px] text-stone-500 text-center mt-2 italic">
                  María Salvadora Conesa en un Baño de Gong
                </p>
              </div>

              <div className="md:col-span-7 space-y-4">
                <span className="text-xs uppercase tracking-widest text-[#96680E] font-extrabold block">
                  Experiencia Sonora de Cierre
                </span>
                <h3 id="gong-section-heading" className="font-serif text-2xl sm:text-3xl font-bold text-[#800020]">
                  Baño de Gong con María Salvadora Conesa
                </h3>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-sans">
                  El sonido del gong y los cuencos armónicos acompañan la clausura del encuentro Bienestar Experience 2026. A través de la vibración sonora se genera un espacio de descanso profundo, pausa y asimilación de lo compartido a lo largo de toda la jornada.
                </p>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-sans">
                  En el{" "}
                  <Link href="/" className="text-[#800020] font-bold underline hover:text-[#96680E]">
                    Centro de Yoga Salvadora Conesa
                  </Link>{" "}
                  en <strong>Fuenlabrada (Madrid)</strong>, desarrollamos regularmente encuentros mensuales de{" "}
                  <Link href="/#dia-3" className="text-[#800020] font-bold underline hover:text-[#96680E]">
                    Baño de Gong Madrid
                  </Link>{" "}
                  y meditación sonora para facilitar estados de calma profunda y reducción del estrés diario.
                </p>
                <div className="pt-2 flex flex-wrap gap-3">
                  <Link
                    href="/#dia-3"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#800020] bg-[#FAF9F6] px-3.5 py-2 rounded-lg border border-[#800020]/20 hover:border-[#800020] transition"
                  >
                    <span>Ver detalles del Baño de Gong en Fuenlabrada</span>
                    <span>→</span>
                  </Link>
                  <Link
                    href="/servicios"
                    className="inline-flex items-center gap-1 text-xs font-bold text-stone-700 bg-stone-100 px-3.5 py-2 rounded-lg hover:bg-stone-200 transition"
                  >
                    <span>Consultar todas las actividades</span>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Vídeo Promocional Oficial */}
          <section aria-labelledby="video-promo-heading" className="bg-white p-6 sm:p-8 rounded-2xl border border-[#C5A059]/25 shadow-md space-y-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#96680E] font-extrabold block mb-1">
                Multimedia Oficial
              </span>
              <h3 id="video-promo-heading" className="font-serif text-2xl font-bold text-[#800020]">
                Vídeo promocional · Bienestar Experience 2026
              </h3>
            </div>
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-stone-200">
              <video
                src="/videos/Promo_Bienestar-Experience-2026_1920x1080.mp4"
                poster="/videos/Promo_Bienestar-Experience-2026_1920x1080-poster.jpg"
                controls
                playsInline
                preload="metadata"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-xs text-stone-500 text-center">
              Promo Bienestar Experience 2026 · Más allá del tumor. Viernes 13 de noviembre de 2026 en Impact Hub Gobernador, Madrid.
            </p>
          </section>

          {/* Bloque CTA Final */}
          <section className="bg-gradient-to-br from-[#800020] to-[#550015] text-white p-8 sm:p-12 rounded-3xl text-center space-y-6 shadow-xl">
            <span className="text-xs uppercase tracking-[0.2em] text-[#E9C168] font-bold block">
              Encuentro de Salud y Consciencia · Madrid 2026
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl font-bold text-white max-w-2xl mx-auto leading-tight">
              Asegura tu plaza en Bienestar Experience 2026
            </h3>
            <p className="text-xs sm:text-sm text-stone-200 max-w-xl mx-auto leading-relaxed">
              Un punto de encuentro para mirar la salud desde una perspectiva humana, amplia y consciente. Viernes 13 de noviembre de 2026 en Impact Hub Gobernador, Madrid.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://txikisoto.com/bienestarexperience/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#E9C168] hover:bg-[#E9C168]/90 text-stone-900 text-xs sm:text-sm font-extrabold uppercase tracking-wider rounded-xl shadow-lg transition duration-200 cursor-pointer"
              >
                <span>RESERVAR ENTRADA (19,99 €)</span>
                <ArrowUpRight className="w-4 h-4 text-stone-900" />
              </a>
              <Link
                href="/#itinerario"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl border border-white/30 transition duration-200 cursor-pointer"
              >
                Explorar todas las actividades del centro
              </Link>
            </div>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
