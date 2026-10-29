import { CrmService, FALLBACK_CRM_SERVICES } from "./crmServices";

export function slugifyActivity(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, ""); // Trim hyphens
}

export function findActivityBySlugOrId(
  slugOrId: string,
  services: CrmService[] = FALLBACK_CRM_SERVICES
): CrmService | undefined {
  if (!slugOrId) return undefined;
  const target = slugOrId.trim().toLowerCase();

  // 1. Exact UUID match
  const byId = services.find((s) => s.id.toLowerCase() === target);
  if (byId) return byId;

  // 2. Exact slug match
  const bySlug = services.find((s) => slugifyActivity(s.name) === target);
  if (bySlug) return bySlug;

  // 3. Known friendly aliases
  const aliases: Record<string, string> = {
    gong: "baño de gong",
    "bano-de-gong": "baño de gong",
    "banos-de-gong": "baño de gong",
    puja: "puja de gongs",
    "puja-de-gongs": "puja de gongs",
    constelaciones: "constelaciones familiares",
    "constelaciones-familiares": "constelaciones familiares",
    constelar: "constelar",
    participante: "participante",
    ayuno: "retiro de ayuno",
    "retiro-ayuno": "retiro de ayuno",
    "retiro-de-ayuno": "retiro de ayuno",
    "retiro-de-ayuno-terapeutico": "retiro de ayuno",
    bienestar: "bienestar experience",
    "bienestar-experience": "bienestar experience",
    "mas-alla-del-tumor": "bienestar experience",
    yoga: "hatha yoga terapéutico",
    "hatha-yoga": "hatha yoga terapéutico",
    "hatha-yoga-1": "1 clase semanal",
    "hatha-yoga-2": "2 clases semanales",
    gestalt: "terapia gestalt",
    "terapia-gestalt": "terapia gestalt",
    meditacion: "meditaciones guiadas",
    "meditaciones-guiadas": "meditaciones guiadas",
    mujeres: "encuentro de mujeres",
    "encuentro-mujeres": "encuentro de mujeres",
  };

  const aliasTarget = aliases[target];
  if (aliasTarget) {
    const found = services.find((s) =>
      s.name.toLowerCase().includes(aliasTarget)
    );
    if (found) return found;
  }

  // 4. Substring / partial match on slug or name
  return services.find(
    (s) =>
      slugifyActivity(s.name).includes(target) ||
      s.name.toLowerCase().includes(target)
  );
}

export function getActivitySlug(service: CrmService): string {
  // Returns clean short slug based on service name
  const name = service.name.toLowerCase();
  if (name.includes("baño de gong")) return "bano-de-gong";
  if (name.includes("puja")) return "puja-de-gongs";
  if (name.includes("constelaciones")) return "constelaciones-familiares";
  if (name.includes("ayuno")) return "retiro-ayuno-terapeutico";
  if (name.includes("bienestar experience")) return "bienestar-experience";
  if (name.includes("gestalt")) return "terapia-gestalt";
  if (name.includes("meditaciones")) return "meditaciones-guiadas";
  if (name.includes("hatha yoga") && name.includes("2")) return "hatha-yoga-2-clases";
  if (name.includes("hatha yoga")) return "hatha-yoga";
  return slugifyActivity(service.name);
}
