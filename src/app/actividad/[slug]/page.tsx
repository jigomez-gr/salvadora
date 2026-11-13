import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchCrmServices, CRM_API_BASE_URL } from "@/lib/crmServices";
import { findActivityBySlugOrId } from "@/lib/activitySlug";
import { FichaMultimediaClient } from "@/components/FichaMultimediaClient";
import BanosDeGongExperience from "@/components/BanosDeGongExperience";
import PracticaYogaExperience from "@/components/PracticaYogaExperience";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { services, businessName } = await fetchCrmServices();
  const activity = findActivityBySlugOrId(slug, services);

  if (!activity) {
    return {
      title: "Ficha de Actividad | Escuela de Yoga Salvadora Conesa",
      description: "Consulta los detalles y contenido multimedia de nuestras actividades de Yoga y Bienestar.",
    };
  }

  const rawFlyer =
    activity.flyerParticularUrl ||
    activity.flyerParticularPath ||
    activity.flyerUrl ||
    activity.flyerPath;
  const flyerPreview = rawFlyer
    ? rawFlyer.startsWith("http")
      ? rawFlyer
      : `https://salvadora.jigretera.com/${rawFlyer.replace(/^\/?(public\/)?/, "")}`
    : "https://salvadora.jigretera.com/imagenes/01_05_yoga_sala_centro_1920x1080.jpg";

  const datesText = activity.eventDatesText || activity.scheduleText || "Fechas disponibles";
  const desc = `${activity.name} en Escuela de Yoga Salvadora Conesa (Fuenlabrada). ${datesText}. Consulta el vídeo explicativo y flyer oficial.`;

  return {
    title: `🎬📄 ${activity.name} · Ficha Multimedia | ${businessName}`,
    description: desc,
    openGraph: {
      title: `🎬📄 ${activity.name} · Vídeo y Flyer Oficial`,
      description: desc,
      url: `https://salvadora.jigretera.com/actividad/${slug}`,
      siteName: "Escuela de Yoga Salvadora Conesa",
      images: [
        {
          url: flyerPreview,
          width: 1200,
          height: 630,
          alt: `Cartel oficial de ${activity.name}`,
        },
      ],
      type: "video.other",
    },
    twitter: {
      card: "summary_large_image",
      title: `🎬📄 ${activity.name} · Vídeo y Flyer`,
      description: desc,
      images: [flyerPreview],
    },
  };
}

export default async function ActividadPage({ params }: PageProps) {
  const { slug } = await params;
  const { services } = await fetchCrmServices();
  const activity = findActivityBySlugOrId(slug, services);

  if (!activity) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-stone-200 shadow-sm space-y-4">
          <span className="text-4xl block">🔍</span>
          <h1 className="font-serif text-2xl font-bold text-[#800020]">
            Actividad no encontrada
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed">
            No hemos encontrado una actividad con el identificador &quot;{slug}&quot;.
            Puedes consultar todo nuestro catálogo de actividades actualizado.
          </p>
          <a
            href="/servicios"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#800020] hover:bg-[#660019] transition active:scale-95 shadow-xs"
          >
            Ver Catálogo de Actividades
          </a>
        </div>
      </div>
    );
  }

  // Si es Baño de Gong, renderizar la experiencia inmersiva completa
  if (/baño de gong/i.test(activity.name)) {
    return (
      <div className="bg-[#FAF9F6] text-[#1C1C1C] min-h-screen flex flex-col justify-between selection:bg-[#C5A059]/30 selection:text-[#12241D]">
        <Navbar />
        <main className="pt-24 sm:pt-28 pb-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
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
          <BanosDeGongExperience activity={activity} isEmbedded={false} />
        </main>
        <Footer />
      </div>
    );
  }

  // Si es Practica Yoga, renderizar la experiencia inmersiva completa
  if (slug === "practica-yoga" || slug === "practica__yoga" || slug === "yoga") {
    return (
      <div className="bg-[#FAF9F6] text-[#1C1C1C] min-h-screen flex flex-col justify-between selection:bg-[#C5A059]/30 selection:text-[#12241D]">
        <Navbar />
        <main className="pt-24 sm:pt-28 pb-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
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
          <PracticaYogaExperience activity={activity} />
        </main>
        <Footer />
      </div>
    );
  }

  // Resolver URL del vídeo
  const rawVideo =
    activity.videoParticularUrl ||
    activity.videoParticularPath ||
    activity.videoUrl ||
    activity.videoPath;
  const videoSrc = rawVideo
    ? rawVideo.startsWith("http")
      ? rawVideo
      : rawVideo.startsWith("/api/")
      ? `${CRM_API_BASE_URL}${rawVideo}`
      : rawVideo.startsWith("/")
      ? rawVideo
      : `/${rawVideo.replace(/\\/g, "/").replace(/^public\//, "").replace(/^media_base\//, "")}`
    : null;

  // Resolver URL del flyer
  const rawFlyer =
    activity.flyerParticularUrl ||
    activity.flyerParticularPath ||
    activity.flyerUrl ||
    activity.flyerPath;
  const flyerSrc = rawFlyer
    ? rawFlyer.startsWith("http")
      ? rawFlyer
      : rawFlyer.startsWith("/api/")
      ? `${CRM_API_BASE_URL}${rawFlyer}`
      : rawFlyer.startsWith("/")
      ? rawFlyer
      : `/${rawFlyer.replace(/\\/g, "/").replace(/^public\//, "").replace(/^media_base\//, "")}`
    : null;

  return (
    <FichaMultimediaClient
      activity={activity}
      videoSrc={videoSrc}
      flyerSrc={flyerSrc}
    />
  );
}
