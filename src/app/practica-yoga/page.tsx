import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PracticaYogaExperience from "@/components/PracticaYogaExperience";
import { fetchCrmServices } from "@/lib/crmServices";
import { findActivityBySlugOrId } from "@/lib/activitySlug";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Practica Yoga en Fuenlabrada | Clases, Nagna Yoga y Asanas · Salvadora Conesa",
  description:
    "Descubre la práctica de Yoga en Fuenlabrada con Salvadora Conesa (+40 años de experiencia). Hatha Yoga en descarga, Nagna Yoga y perfeccionamiento de asanas. Clases de mañana y tarde. ¡1ª clase de regalo de bienvenida!",
  keywords: [
    "Yoga en Fuenlabrada",
    "Clases de Yoga en Fuenlabrada",
    "Practica Yoga",
    "Nagna Yoga",
    "Mejorar las Asanas",
    "Hatha Yoga Fuenlabrada",
    "Salvadora Conesa",
    "Yoga para la espalda Fuenlabrada",
    "Yoga en descarga Madrid sur",
  ],
  alternates: {
    canonical: "https://salvadoraconesa.es/practica-yoga",
  },
  openGraph: {
    title: "Practica Yoga en Fuenlabrada · Equilibrio, Consciencia y Bienestar",
    description:
      "Hatha, Kundalini y Nagna Yoga en el Centro de Yoga Salvadora Conesa de Fuenlabrada. Cuida tu columna, tu respiración y tu calma. 1ª clase gratuita.",
    url: "https://salvadoraconesa.es/practica-yoga",
    siteName: "Centro de Yoga Salvadora Conesa",
    locale: "es_ES",
    type: "article",
    images: [
      {
        url: "https://salvadoraconesa.es/imagenes/yoga/slider_practica_yoga.jpg",
        width: 1920,
        height: 780,
        alt: "Practica Yoga en Fuenlabrada - Salvadora Conesa en postura de equilibrio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Practica Yoga en Fuenlabrada | Salvadora Conesa",
    description:
      "Sesiones pensadas para cuidar tu columna, tu respiración y tu calma sesión a sesión.",
    images: ["https://salvadoraconesa.es/imagenes/yoga/slider_practica_yoga.jpg"],
  },
};

export default async function PracticaYogaPage() {
  const { services } = await fetchCrmServices();
  const activity =
    services.find((s) => /hatha yoga/i.test(s.name) && s.textoespecifico) ||
    findActivityBySlugOrId("hatha-yoga", services) ||
    services.find((s) => /hatha yoga/i.test(s.name));

  const jsonLdBusiness = {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    name: "Centro de Yoga Salvadora Conesa - Practica Yoga",
    image: "https://salvadoraconesa.es/imagenes/yoga/slider_practica_yoga.jpg",
    url: "https://salvadoraconesa.es/practica-yoga",
    telephone: "+34646034231",
    priceRange: "25€ - 42€",
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
    founder: {
      "@type": "Person",
      name: "María Salvadora Conesa",
      jobTitle: "Profesora de Yoga y Terapeuta Gestalt",
    },
  };

  const jsonLdCourse = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Clases Regulares de Hatha Yoga y Nagna Yoga",
    description:
      "Práctica continuada de yoga en descarga, higiene postural de la columna, respiración consciente y descompresión articular.",
    provider: {
      "@type": "Organization",
      name: "Centro de Yoga Salvadora Conesa",
      sameAs: "https://salvadoraconesa.es",
    },
    offers: {
      "@type": "Offer",
      price: "25.00",
      priceCurrency: "EUR",
      category: "Suscripción mensual",
    },
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Es mi primera vez haciendo yoga, puedo incorporarme a las clases?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "¡Por supuesto! Nuestras clases son inclusivas y progresivas. La primera clase de prueba es totalmente gratuita (un regalo de bienvenida sin compromiso), y adaptamos cada postura a tu nivel físico actual.",
        },
      },
      {
        "@type": "Question",
        name: "¿Por qué se trabaja preferentemente en descarga?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Al practicar posturas en descarga (tumbados o con apoyos estables), liberamos a los discos intervertebrales de la compresión diaria provocada por la gravedad y el sedentarismo, favoreciendo su rehidratación natural.",
        },
      },
      {
        "@type": "Question",
        name: "¿Dónde se imparten las clases de yoga y cómo son los horarios?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "En el Centro de Yoga Salvadora Conesa (Calle Pelayos 1, Fuenlabrada, Madrid). Contamos con turnos de mañana y tarde con recuperación de clases avisando con antelación.",
        },
      },
    ],
  };

  return (
    <div className="bg-[#FAF9F6] text-[#1C1C1C] min-h-screen flex flex-col justify-between selection:bg-[#C5A059]/30 selection:text-[#12241D]">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBusiness) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdCourse) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />

      <Navbar />

      <main className="pt-24 sm:pt-28 pb-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Breadcrumb Navigation */}
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
          <span className="text-[#800020] font-bold">Practica Yoga</span>
        </nav>

        {/* Master Experience Component */}
        <PracticaYogaExperience activity={activity} />
      </main>

      <Footer />
    </div>
  );
}
