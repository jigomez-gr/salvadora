"use client";

import { useEffect } from "react";

export function WebMcpProvider() {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const controller = new AbortController();

      const tools = [
        {
          name: "search_classes",
          description:
            "Busca información sobre clases de yoga, horarios y disciplinas disponibles en el Centro de Yoga Salvadora Conesa (Kundalini Yoga, Nagna Yoga, Baños de Gong, Meditación guiada, Taller Mejorar Asanas, Retiros de Ayuno).",
          inputSchema: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "Término de búsqueda, disciplina o actividad deseada",
              },
            },
            required: ["query"],
          },
          annotations: { readOnlyHint: true },
          execute: async () => {
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify({
                    disciplines: [
                      {
                        name: "Kundalini Yoga",
                        description:
                          "Práctica de vitalidad, kriyas, pranayama y meditación con mantras.",
                        url: "https://centrodeyogasalvadoraconesa.es/servicios",
                      },
                      {
                        name: "Nagna Yoga",
                        description:
                          "Yoga desnudo consciente para la autoaceptación corporal y superación de complejos.",
                        url: "https://centrodeyogasalvadoraconesa.es/nagna-yoga",
                      },
                      {
                        name: "Baños y Puja de Gong",
                        description:
                          "Terapia de sonido con gongs sinfónicos para relajación profunda y meditación.",
                        url: "https://centrodeyogasalvadoraconesa.es/servicios",
                      },
                      {
                        name: "Taller Mejorar Asanas",
                        description:
                          "Alineación postural y biomecánica consciente.",
                        url: "https://centrodeyogasalvadoraconesa.es/mejorar-asanas",
                      },
                    ],
                  }),
                },
              ],
            };
          },
        },
        {
          name: "get_schedule_and_pricing",
          description:
            "Consulta los horarios actualizados y tarifas de las clases, talleres y bonos del Centro de Yoga Salvadora Conesa.",
          inputSchema: {
            type: "object",
            properties: {
              service: {
                type: "string",
                description:
                  "Servicio o disciplina ('kundalini', 'nagna', 'gong', 'todos')",
              },
            },
          },
          annotations: { readOnlyHint: true },
          execute: async () => {
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify({
                    schedule: [
                      {
                        class: "Kundalini Yoga",
                        days: "Lunes y Miércoles 19:00 - 20:30",
                        duration: "90 min",
                      },
                      {
                        class: "Nagna Yoga",
                        days: "Viernes 19:30 - 21:00",
                        duration: "90 min",
                      },
                      {
                        class: "Baños de Gong",
                        days: "Sábados quincenales 11:00",
                        duration: "60 min",
                      },
                    ],
                    pricing: {
                      matricula: "Gratuita",
                      mes_1_dia_semana: "25€ / mes",
                      mes_2_dias_semana: "42€ / mes",
                      primera_cita_prueba: "Gratuita si te haces alumno / 10€ sesión suelta",
                      recuperacion_clases: "Hasta 3 meses (90 días)",
                      bano_de_gong: "16€ / sesión",
                      puja_de_gong: "90€ / sesión",
                    },
                    contactPhone: "+34 695 17 26 25",
                  }),
                },
              ],
            };
          },
        },
        {
          name: "book_yoga_session",
          description:
            "Inicia el proceso de reserva para una clase de yoga o sesión de baño de gong en el Centro de Yoga Salvadora Conesa.",
          inputSchema: {
            type: "object",
            properties: {
              service: {
                type: "string",
                description:
                  "Nombre del servicio o disciplina (Kundalini Yoga, Nagna Yoga, Baño de Gong)",
              },
              clientName: {
                type: "string",
                description: "Nombre y apellidos del cliente",
              },
              clientPhone: {
                type: "string",
                description: "Teléfono o WhatsApp de contacto",
              },
            },
            required: ["service", "clientName", "clientPhone"],
          },
          execute: async (params: unknown) => {
            const p = (params as Record<string, string>) || {};
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify({
                    status: "success",
                    bookingUrl: "https://centrodeyogasalvadoraconesa.es/reserva",
                    message: `Reserva pre-registrada para ${p.clientName || "el cliente"} en ${p.service || "la clase"}.`,
                  }),
                },
              ],
            };
          },
        },
        {
          name: "navigate_site",
          description:
            "Navega a las diferentes secciones y páginas del Centro de Yoga Salvadora Conesa.",
          inputSchema: {
            type: "object",
            properties: {
              path: {
                type: "string",
                description:
                  "Ruta de la página ('/', '/servicios', '/reserva', '/nagna-yoga', '/mejorar-asanas')",
              },
            },
            required: ["path"],
          },
          execute: async (params: unknown) => {
            const p = (params as { path?: string }) || {};
            if (p.path && typeof window !== "undefined") {
              window.location.href = p.path;
            }
            return {
              content: [
                {
                  type: "text",
                  text: `Navegando a ${p.path || "/"}`,
                },
              ],
            };
          },
        },
      ];

      const registerWithContext = (mc: unknown) => {
        if (!mc || typeof mc !== "object") return;
        const target = mc as {
          provideContext?: (opts: unknown) => void;
          registerTool?: (
            tool: unknown,
            opts?: { signal?: AbortSignal }
          ) => void;
        };

        if (typeof target.provideContext === "function") {
          try {
            target.provideContext({ tools, signal: controller.signal });
          } catch {
            try {
              target.provideContext(tools);
            } catch {
              // ignore
            }
          }
        }

        if (typeof target.registerTool === "function") {
          for (const tool of tools) {
            try {
              target.registerTool(tool, { signal: controller.signal });
            } catch {
              try {
                target.registerTool(tool);
              } catch {
                // ignore
              }
            }
          }
        }
      };

      if (typeof navigator !== "undefined") {
        const nav = navigator as unknown as { modelContext?: unknown };
        if (nav.modelContext) {
          registerWithContext(nav.modelContext);
        }
      }

      if (typeof document !== "undefined") {
        const doc = document as unknown as { modelContext?: unknown };
        if (doc.modelContext) {
          registerWithContext(doc.modelContext);
        }
      }

      return () => {
        controller.abort();
      };
    } catch (e) {
      console.warn("WebMCP registration error:", e);
    }
  }, []);

  return null;
}

