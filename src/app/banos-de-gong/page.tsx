import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BanosDeGongExperience from "@/components/BanosDeGongExperience";
import { fetchCrmServices } from "@/lib/crmServices";
import { findActivityBySlugOrId } from "@/lib/activitySlug";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Baños de Gong en Fuenlabrada y Madrid | Sonoterapia · Salvadora Conesa",
  description:
    "Descubre los Baños de Gong en Fuenlabrada (Madrid) con Salvadora Conesa (+40 años de experiencia). Experiencia inmersiva de sonoterapia, cuencos tibetanos y relajación profunda. Consulta fechas y reserva tu plaza.",
  keywords: [
    "Baños de Gong en Fuenlabrada",
    "Baño de Gong Madrid",
    "Meditación sonora Fuenlabrada",
    "Salvadora Conesa",
    "Sonoterapia Fuenlabrada",
    "Cuencos tibetanos Madrid sur",
    "Relajación con gong Madrid",
  ],
  alternates: {
    canonical: "https://salvadoraconesa.es/banos-de-gong",
  },
  openGraph: {
    title: "Baños de Gong en Fuenlabrada · Un viaje hacia el silencio interior",
    description:
      "Inmersión sonora con gongs ancestrales y cuencos en el Centro de Yoga Salvadora Conesa de Fuenlabrada (Madrid). Sesión de relajación y meditación profunda.",
    url: "https://salvadoraconesa.es/banos-de-gong",
    siteName: "Centro de Yoga Salvadora Conesa",
    locale: "es_ES",
    type: "article",
    images: [
      {
        url: "https://salvadoraconesa.es/imagenes/gong/img__gong.jpg",
        width: 1920,
        height: 780,
        alt: "Baños de Gong en Fuenlabrada - Dos gongs ancestrales en el Centro de Yoga Salvadora Conesa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Baños de Gong en Fuenlabrada | Salvadora Conesa",
    description:
      "Experiencia inmersiva de sonoterapia y relajación profunda en Fuenlabrada (Madrid).",
    images: ["https://salvadoraconesa.es/imagenes/gong/img__gong.jpg"],
  },
};

export default async function BanosDeGongPage() {
  const { services } = await fetchCrmServices();
  const activity =
    findActivityBySlugOrId("bano-de-gong", services) ||
    services.find((s) => /baño de gong/i.test(s.name));

  const jsonLdEvent = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Baños de Gong y Meditación Sonora en Fuenlabrada",
    description:
      "Sesión completa de 2 horas de sonoterapia e inmersión sonora con gongs sinfónicos y cuencos tibetanos conducida por Salvadora Conesa.",
    image: "https://salvadoraconesa.es/imagenes/gong/img__gong.jpg",
    startDate: activity?.eventStartDate ? new Date(activity.eventStartDate).toISOString() : "2026-11-21T18:00:00+01:00",
    endDate: activity?.eventEndDate ? new Date(activity.eventEndDate).toISOString() : "2026-11-21T20:00:00+01:00",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: "Centro de Yoga Salvadora Conesa",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Calle Pelayos, 1",
        addressLocality: "Fuenlabrada",
        postalCode: "28945",
        addressRegion: "Madrid",
        addressCountry: "ES",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 40.2829,
        longitude: -3.7936,
      },
    },
    performer: {
      "@type": "Person",
      name: "María Salvadora Conesa",
      jobTitle: "Profesora de Yoga y Terapeuta Gestalt",
    },
    organizer: {
      "@type": "Organization",
      name: "Centro de Yoga Salvadora Conesa",
      url: "https://salvadoraconesa.es",
    },
    offers: {
      "@type": "Offer",
      url: "https://salvadoraconesa.es/banos-de-gong",
      price: "16.00",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      validFrom: "2026-01-01",
    },
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Necesito experiencia previa en yoga o meditación para asistir a un Baño de Gong?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No se requiere ninguna experiencia previa. La sesión se disfruta cómodamente tumbado sobre una esterilla, abrigado con una manta y con los ojos cerrados, dejándose sostener por el sonido.",
        },
      },
      {
        "@type": "Question",
        name: "¿Qué beneficios aporta una sesión de Baño de Gong?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Favorece la relajación profunda, ayuda a liberar el estrés cotidiano, aquieta el diálogo mental y promueve una agradable sensación de ligereza corporal y bienestar interior.",
        },
      },
      {
        "@type": "Question",
        name: "¿Dónde se celebran los Baños de Gong y cuál es el precio?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Se celebran en el Centro de Yoga Salvadora Conesa (Calle Pelayos 1, Fuenlabrada, Madrid). La aportación es de 16 € (14 € si vienes acompañado/a).",
        },
      },
    ],
  };

  return (
    <div className="bg-[#FAF9F6] text-[#1C1C1C] min-h-screen flex flex-col justify-between selection:bg-[#C5A059]/30 selection:text-[#12241D]">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdEvent) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />

      <Navbar />

      <main className="pt-24 sm:pt-28 pb-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Navegación y Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex flex-wrap items-center gap-2 text-xs font-semibold text-stone-500"
        >
          <Link
            href="/"
            className="hover:text-[#800020] transition inline-flex items-center gap-1"
          >
            <span>Inicio</span>
          </Link>
          <span>/</span>
          <Link
            href="/servicios"
            className="hover:text-[#800020] transition inline-flex items-center gap-1"
          >
            <span>Actividades</span>
          </Link>
          <span>/</span>
          <span className="text-[#800020] font-bold">Baños de Gong</span>
        </nav>

        {/* Componente Espectacular de Baños de Gong */}
        <BanosDeGongExperience activity={activity} isEmbedded={false} />
      </main>

      <Footer />
    </div>
  );
}
