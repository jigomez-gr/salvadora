export interface CrmService {
  id: string;
  name: string;
  serviceType: "recurring" | "event" | string;
  description?: string | null;
  scheduleText?: string | null;
  weeklySchedule?: Record<string, string[]> | null;
  eventDatesText?: string | null;
  durationMinutes: number;
  price?: string | null;
  currency?: string;
  maxCapacity?: number | null;
  paymentType?: string;
  externalPaymentUrl?: string | null;
  allowedModalities?: string[];
  requiresApproval?: boolean;
  firstClassFree?: boolean;
  freeForYogaStudents?: boolean;
  whatsappBookingUrl?: string;
}

export interface CrmServicesResponse {
  success: boolean;
  businessName: string;
  businessDescription?: string;
  brandColor?: string;
  logoUrl?: string | null;
  whatsappNumber: string;
  services: CrmService[];
}

export const CRM_API_BASE_URL =
  process.env.CRM_API_URL ||
  process.env.NEXT_PUBLIC_CRM_API_URL ||
  "https://crm-salvadoraconesa.jigretera.com";

export const CRM_SERVICES_ENDPOINT = `${CRM_API_BASE_URL}/api/widget/services`;

// Fallback catalog in case of temporary network unavailability
export const FALLBACK_CRM_SERVICES: CrmService[] = [
  {
    id: "d3b4566d-e1da-430c-be1f-b2bd1d0a0bad",
    name: "Hatha Yoga Terapéutico (1 clase semanal)",
    serviceType: "recurring",
    description: "Práctica consciente de asanas, alineación corporal, respiración terapéutica y relajación profunda. Horarios: Martes (9:45, 11:15, 17:00, 18:30, 20:00), Miércoles (20:15) y Jueves (9:45, 11:15, 16:00, 17:30, 19:00). Aforo del listado: 20 plazas (con margen de hasta 28 para recuperaciones). Precio: 25€/mes. Pago en el centro.",
    scheduleText: "Martes (9:45, 11:15, 17:00, 18:30, 20:00), Miércoles (20:15) y Jueves (9:45, 11:15, 16:00, 17:30, 19:00)",
    durationMinutes: 90,
    price: "25.00",
    currency: "EUR",
    maxCapacity: 20,
    allowedModalities: ["in_person"],
    firstClassFree: true,
    freeForYogaStudents: false,
    whatsappBookingUrl: "https://wa.me/34695172625?text=Hola%2C%20me%20gustar%C3%ADa%20informaci%C3%B3n%20y%20disponibilidad%20para%20Hatha%20Yoga%20Terap%C3%A9utico%20(1%20clase%20semanal).",
  },
  {
    id: "15f33ff9-210c-45ab-b6fd-e660854505b4",
    name: "Hatha Yoga Terapéutico (2 clases semanales)",
    serviceType: "recurring",
    description: "Práctica consciente de asanas, alineación corporal, respiración terapéutica y relajación profunda (2 clases a la semana). Horarios: Martes (9:45, 11:15, 17:00, 18:30, 20:00), Miércoles (20:15) y Jueves (9:45, 11:15, 16:00, 17:30, 19:00). Aforo del listado: 20 plazas. Precio: 42€/mes. Pago en el centro.",
    scheduleText: "Martes (9:45, 11:15, 17:00, 18:30, 20:00), Miércoles (20:15) y Jueves (9:45, 11:15, 16:00, 17:30, 19:00)",
    durationMinutes: 90,
    price: "42.00",
    currency: "EUR",
    maxCapacity: 20,
    allowedModalities: ["in_person"],
    firstClassFree: true,
    freeForYogaStudents: false,
    whatsappBookingUrl: "https://wa.me/34695172625?text=Hola%2C%20me%20gustar%C3%ADa%20informaci%C3%B3n%20y%20disponibilidad%20para%20Hatha%20Yoga%20Terap%C3%A9utico%20(2%20clases%20semanales).",
  },
  {
    id: "3993614b-aa86-422e-b05f-6a58d43867c5",
    name: "Iaidō (Esgrima Japonesa)",
    serviceType: "recurring",
    description: "Arte marcial tradicional japonés de desenvainado y manejo de la katana. Práctica de katas, concentración, precisión y presencia. Horarios: Lunes de 20:00 a 21:00 y Jueves de 20:30 a 22:00. Lugar: Club Social Parque Granada. Primera clase de prueba gratuita. Información y reservas por WhatsApp: 695 172 625.",
    scheduleText: "Lunes de 20:00 a 21:00 y Jueves de 20:30 a 22:00",
    durationMinutes: 60,
    price: "0.00",
    currency: "EUR",
    maxCapacity: 20,
    allowedModalities: ["in_person"],
    firstClassFree: true,
    freeForYogaStudents: false,
    whatsappBookingUrl: "https://wa.me/34695172625?text=Hola%2C%20me%20gustar%C3%ADa%20informaci%C3%B3n%20y%20disponibilidad%20para%20Iaid%C5%8D%20(Esgrima%20Japonesa).",
  },
  {
    id: "469fa9b9-227d-4168-bda7-cac5cf3e7f46",
    name: "Bienestar Experience (Longevidad y Bienestar Integral)",
    serviceType: "recurring",
    description: "Programa y sesiones de asesoramiento personalizado presencial y online en longevidad, bienestar integral, nutrición, biohacking, meditación y psicología positiva. Horario convenido individualmente. Requiere aprobación previa del responsable (Jose Ignacio Gomez Raya). Precio: 25€ por sesión de 1 hora. Pago en el centro.",
    scheduleText: "Sesión individual concertada (Presencial u Online)",
    durationMinutes: 60,
    price: "25.00",
    currency: "EUR",
    maxCapacity: 1,
    allowedModalities: ["in_person", "virtual"],
    requiresApproval: true,
    firstClassFree: false,
    freeForYogaStudents: false,
    whatsappBookingUrl: "https://wa.me/34695172625?text=Hola%2C%20me%20gustar%C3%ADa%20informaci%C3%B3n%20y%20disponibilidad%20para%20Bienestar%20Experience%20(Longevidad%20y%20Bienestar%20Integral).",
  },
  {
    id: "8d243111-8e4c-40e3-ac5a-b4301fe6cfb9",
    name: "Meditaciones Guiadas",
    serviceType: "recurring",
    description: "Sesión grupal de meditación y centramiento. Martes y Jueves de 9:15 a 9:45. Gratuitas para alumnos del centro de Yoga. Precio general: 15€/mes. Pago en el centro.",
    scheduleText: "Martes y Jueves de 09:15 a 09:45",
    durationMinutes: 30,
    price: "15.00",
    currency: "EUR",
    maxCapacity: 28,
    allowedModalities: ["in_person"],
    firstClassFree: false,
    freeForYogaStudents: true,
    whatsappBookingUrl: "https://wa.me/34695172625?text=Hola%2C%20me%20gustar%C3%ADa%20informaci%C3%B3n%20y%20disponibilidad%20para%20Meditaciones%20Guiadas.",
  },
  {
    id: "3886172f-4a00-4af7-9d5f-5c4015e07f9c",
    name: "Baño de Gong y Meditación Sonora",
    serviceType: "event",
    description: "Un sábado al mes (a finales de mes). Sesión completa de 2 horas: preparación, baño de sonido envolvente con gongs y meditación integradora. Próxima sesión: Sábado 26 de Septiembre de 2026 (18:00 a 20:00). Aforo máximo: 30 personas. Precio: 16€. Pago en el centro.",
    scheduleText: "Un sábado al mes (18:00 a 20:00)",
    eventDatesText: "Sábado 26 de Septiembre de 2026",
    durationMinutes: 120,
    price: "16.00",
    currency: "EUR",
    maxCapacity: 30,
    allowedModalities: ["in_person"],
    firstClassFree: false,
    freeForYogaStudents: false,
    whatsappBookingUrl: "https://wa.me/34695172625?text=Hola%2C%20me%20gustar%C3%ADa%20informaci%C3%B3n%20y%20disponibilidad%20para%20Ba%C3%B1o%20de%20Gong%20y%20Meditaci%C3%B3n%20Sonora.",
  },
  {
    id: "f929b07c-3505-42b8-907f-be7a1bca9af6",
    name: "Puja de Gongs (Noche Sagrada de Sonido - 11h)",
    serviceType: "event",
    description: "Evento anual de inmersión y transformación sonora durante toda la noche (11 horas continuas de sonido). Fecha prevista: Finales de noviembre (Sábado 28 de Noviembre de 2026, 21:00 a 08:00). Aforo: 30 personas por sesión. Precio: 95€ (90-100€ según asistentes). Reserva anticipada. Pago en el centro.",
    eventDatesText: "Sábado 28 de Noviembre de 2026 (Noche de 21:00 a 08:00)",
    durationMinutes: 660,
    price: "95.00",
    currency: "EUR",
    maxCapacity: 30,
    allowedModalities: ["in_person"],
    firstClassFree: false,
    freeForYogaStudents: false,
    whatsappBookingUrl: "https://wa.me/34695172625?text=Hola%2C%20me%20gustar%C3%ADa%20informaci%C3%B3n%20y%20disponibilidad%20para%20Puja%20de%20Gongs%20(Noche%20Sagrada%20de%20Sonido%20-%2011h).",
  },
  {
    id: "85254e72-a7dd-4fdb-a1e0-607b27ef63a7",
    name: "Constelaciones Familiares",
    serviceType: "event",
    description: "Taller vivencial mensual de sanación de vínculos y patrones familiares. Próxima fecha tentativa: Domingo 27 de Septiembre de 2026 (10:00 a 14:00). Precios: Constelar (trabajar asunto propio) 60€ / Participar (representante) 20€. Aforo: 25 personas. Pago en el centro.",
    eventDatesText: "Domingo 27 de Septiembre de 2026 (10:00 a 14:00)",
    durationMinutes: 240,
    price: "60.00",
    currency: "EUR",
    maxCapacity: 25,
    allowedModalities: ["in_person"],
    firstClassFree: false,
    freeForYogaStudents: false,
    whatsappBookingUrl: "https://wa.me/34695172625?text=Hola%2C%20me%20gustar%C3%ADa%20informaci%C3%B3n%20y%20disponibilidad%20para%20Constelaciones%20Familiares.",
  },
  {
    id: "6bfc9e2b-bef8-42d5-9c25-bd3b7554229a",
    name: "Retiro de Ayuno Terapéutico",
    serviceType: "event",
    description: "Retiro semestral (Otoño y Primavera) de depuración, ayuno consciente, descanso y reconexión en la naturaleza. Próxima edición: Puente de Octubre (Del 9 al 12 de Octubre de 2026). Aforo: 20 plazas. Precio según lugar de hospedaje y días elegidos. Pago en el centro.",
    eventDatesText: "Del 9 al 12 de Octubre de 2026 (Puente de Octubre)",
    durationMinutes: 1440,
    price: null,
    currency: "EUR",
    maxCapacity: 20,
    allowedModalities: ["in_person"],
    firstClassFree: false,
    freeForYogaStudents: false,
    whatsappBookingUrl: "https://wa.me/34695172625?text=Hola%2C%20me%20gustar%C3%ADa%20informaci%C3%B3n%20y%20disponibilidad%20para%20Retiro%20de%20Ayuno%20Terap%C3%A9utico.",
  },
  {
    id: "076c81be-6ce8-4f14-87a9-f507b01ba465",
    name: "Terapia Gestalt (Sesión Individual)",
    serviceType: "recurring",
    description: "Sesión individual de psicoterapia Gestalt presencial u online. Enfoque humanista y toma de conciencia. Horario convenido individualmente entre terapeuta y alumno/paciente. Requiere aprobación previa por parte del terapeuta responsable (Jose Ignacio Gomez Raya). Precio: 35€ por sesión de 1 hora. Pago en el centro.",
    durationMinutes: 60,
    price: "35.00",
    currency: "EUR",
    maxCapacity: 1,
    allowedModalities: ["in_person", "virtual"],
    requiresApproval: true,
    firstClassFree: false,
    freeForYogaStudents: false,
    whatsappBookingUrl: "https://wa.me/34695172625?text=Hola%2C%20me%20gustar%C3%ADa%20informaci%C3%B3n%20y%20disponibilidad%20para%20Terapia%20Gestalt%20(Sesi%C3%B3n%20Individual).",
  },
];

/**
 * Fetches services from CRM API with timeout and fallback.
 */
export async function fetchCrmServices(): Promise<{
  success: boolean;
  businessName: string;
  whatsappNumber: string;
  services: CrmService[];
}> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(CRM_SERVICES_ENDPOINT, {
      signal: controller.signal,
      next: { revalidate: 60 },
      headers: {
        Accept: "application/json",
      },
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`CRM returned HTTP status ${res.status}`);
    }

    const data: CrmServicesResponse = await res.json();
    if (data && data.services && Array.isArray(data.services) && data.services.length > 0) {
      return {
        success: true,
        businessName: data.businessName || "Centro de Yoga y Bienestar Salvadora",
        whatsappNumber: data.whatsappNumber || "34695172625",
        services: data.services,
      };
    }

    throw new Error("Empty services returned from CRM");
  } catch (err: any) {
    console.warn(
      `[CRM Integration] Fallback used. Could not fetch live services from CRM (${err.message}).`
    );
    return {
      success: true,
      businessName: "Centro de Yoga y Bienestar Salvadora",
      whatsappNumber: "34695172625",
      services: FALLBACK_CRM_SERVICES,
    };
  }
}

/**
 * Human-readable price formatting based on CRM data.
 */
export function formatServicePrice(service: CrmService): string {
  if (service.price === null || service.price === undefined || service.price === "") {
    return "A consultar";
  }

  const num = parseFloat(service.price);
  if (isNaN(num)) {
    return service.price;
  }

  if (num === 0) {
    return "Prueba Gratis (0 €)";
  }

  const formattedNum = num.toFixed(2).replace(".00", "") + " €";

  if (service.serviceType === "recurring") {
    if (service.name.toLowerCase().includes("clase semanal")) {
      return `${formattedNum} / mes`;
    }
    if (
      service.name.toLowerCase().includes("sesión") ||
      service.name.toLowerCase().includes("gestalt") ||
      service.name.toLowerCase().includes("experience")
    ) {
      return `${formattedNum} / sesión`;
    }
    return `${formattedNum} / mes`;
  }

  return formattedNum;
}

/**
 * Format duration minutes nicely (e.g., 90 min, 2 horas, 11 horas).
 */
export function formatDuration(minutes: number): string {
  if (!minutes || minutes <= 0) return "Consultar";
  if (minutes < 60) return `${minutes} min`;
  if (minutes === 60) return "60 min (1h)";
  if (minutes % 60 === 0) return `${minutes / 60} horas`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hrs}h ${mins}min`;
}

/**
 * Map legacy booking keys to CRM service ID or lookup service by key/ID.
 */
export function findServiceByCodeOrId(
  services: CrmService[],
  identifier: string
): CrmService | undefined {
  if (!identifier) return undefined;
  const target = identifier.trim().toLowerCase();

  // 1. Direct UUID match
  const byId = services.find((s) => s.id.toLowerCase() === target);
  if (byId) return byId;

  // 2. Direct name match
  const byName = services.find((s) => s.name.toLowerCase() === target);
  if (byName) return byName;

  // 3. Legacy slugs mapping
  const legacyMap: Record<string, string> = {
    clase_semanal: "1 clase semanal",
    dos_clases_semanal: "2 clases semanales",
    gong: "baño de gong",
    puja: "puja de gong",
    constelaciones_constelar: "constelar",
    constelaciones_participar: "participante",
    retiro_encuentro: "retiro de ayuno",
    iaido: "iaidō",
    bienestar_experience: "bienestar experience",
    meditacion: "meditaciones guiadas",
    gestalt: "terapia gestalt",
  };

  const matchKey = legacyMap[target];
  if (matchKey) {
    const found = services.find((s) => s.name.toLowerCase().includes(matchKey));
    if (found) return found;
  }

  // 4. Loose substring match
  return services.find((s) => s.name.toLowerCase().includes(target));
}

/**
 * Dynamic categorization for landing display sections.
 */
export function categorizeCrmServices(services: CrmService[]) {
  const destacadas: CrmService[] = [];
  const regularesYoga: CrmService[] = [];
  const talleresEventos: CrmService[] = [];
  const saludTerapeutica: CrmService[] = [];

  for (const s of services) {
    const lower = s.name.toLowerCase();

    // Activities in Club Social Parque Granada / Bienestar Experience
    if (
      lower.includes("bienestar experience") ||
      lower.includes("iaidō") ||
      lower.includes("iaido")
    ) {
      destacadas.push(s);
      continue;
    }

    // Health / Clinics / Physio / Gestalt
    if (
      lower.includes("consulta médica") ||
      lower.includes("fisioterapia") ||
      lower.includes("gestalt")
    ) {
      saludTerapeutica.push(s);
      continue;
    }

    // Events, retreats, workshops
    if (
      s.serviceType === "event" ||
      lower.includes("gong") ||
      lower.includes("puja") ||
      lower.includes("constelaciones") ||
      lower.includes("retiro") ||
      lower.includes("conferencia") ||
      lower.includes("encuentro")
    ) {
      talleresEventos.push(s);
      continue;
    }

    // Regular Yoga & Meditation
    regularesYoga.push(s);
  }

  return {
    destacadas,
    regularesYoga,
    talleresEventos,
    saludTerapeutica,
    all: services,
  };
}
