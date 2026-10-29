import { redirect } from "next/navigation";
import { fetchCrmServices } from "@/lib/crmServices";
import { findActivityBySlugOrId, getActivitySlug } from "@/lib/activitySlug";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ id?: string; slug?: string; s?: string }>;
}

export default async function ActividadIndexPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const target = params.slug || params.id || params.s;

  if (target) {
    const { services } = await fetchCrmServices();
    const activity = findActivityBySlugOrId(target, services);
    if (activity) {
      redirect(`/actividad/${getActivitySlug(activity)}`);
    }
  }

  // Si no se especifica actividad, redirigir al catálogo de servicios
  redirect("/servicios");
}
