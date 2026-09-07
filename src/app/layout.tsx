import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Centro de Yoga Fuenlabrada | Salvadora Conesa",
  description: "Clases de Hatha y Kundalini yoga, baños y puja de gong, meditación guiada y retiros de ayuno terapéutico en Fuenlabrada, dirigido por Salvadora Conesa.",
};

import { ChatBubbleWidget } from "@/components/ChatBubbleWidget";
import VapiCallModal from "@/components/VapiCallModal";
import { WebMcpProvider } from "@/components/WebMcpProvider";

const WEBMCP_INLINE_SCRIPT = `
(function() {
  var tools = [
    {
      name: "search_classes",
      description: "Busca información sobre clases de yoga, horarios y disciplinas disponibles en el Centro de Yoga Salvadora Conesa (Kundalini Yoga, Nagna Yoga, Baños de Gong, Meditación guiada, Taller Mejorar Asanas, Retiros de Ayuno).",
      inputSchema: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Término de búsqueda, disciplina o actividad deseada"
          }
        },
        required: ["query"]
      },
      annotations: { readOnlyHint: true },
      execute: async function() {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              disciplines: [
                { name: "Kundalini Yoga", description: "Práctica de vitalidad, kriyas, pranayama y meditación con mantras.", url: "https://centrodeyogasalvadoraconesa.es/servicios" },
                { name: "Nagna Yoga", description: "Yoga desnudo consciente para la autoaceptación corporal y superación de complejos.", url: "https://centrodeyogasalvadoraconesa.es/nagna-yoga" },
                { name: "Baños y Puja de Gong", description: "Terapia de sonido con gongs sinfónicos para relajación profunda y meditación.", url: "https://centrodeyogasalvadoraconesa.es/servicios" },
                { name: "Taller Mejorar Asanas", description: "Alineación postural y biomecánica consciente.", url: "https://centrodeyogasalvadoraconesa.es/mejorar-asanas" }
              ]
            })
          }]
        };
      }
    },
    {
      name: "get_schedule_and_pricing",
      description: "Consulta los horarios actualizados y tarifas de las clases, talleres y bonos del Centro de Yoga Salvadora Conesa.",
      inputSchema: {
        type: "object",
        properties: {
          service: {
            type: "string",
            description: "Servicio o disciplina ('kundalini', 'nagna', 'gong', 'todos')"
          }
        }
      },
      annotations: { readOnlyHint: true },
      execute: async function() {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              schedule: [
                { class: "Kundalini Yoga", days: "Lunes y Miércoles 19:00 - 20:30", duration: "90 min" },
                { class: "Nagna Yoga", days: "Viernes 19:30 - 21:00", duration: "90 min" },
                { class: "Baños de Gong", days: "Sábados quincenales 11:00", duration: "60 min" }
              ],
              pricing: {
                matricula: "Gratuita",
                mes_1_dia_semana: "45€ / mes",
                mes_2_dias_semana: "65€ / mes",
                sesion_suelta: "15€",
                bano_de_gong: "25€ / sesión"
              },
              contactPhone: "+34 695 17 26 25"
            })
          }]
        };
      }
    },
    {
      name: "book_yoga_session",
      description: "Inicia el proceso de reserva para una clase de yoga o sesión de baño de gong en el Centro de Yoga Salvadora Conesa.",
      inputSchema: {
        type: "object",
        properties: {
          service: {
            type: "string",
            description: "Nombre del servicio o disciplina (Kundalini Yoga, Nagna Yoga, Baño de Gong)"
          },
          clientName: {
            type: "string",
            description: "Nombre y apellidos del cliente"
          },
          clientPhone: {
            type: "string",
            description: "Teléfono o WhatsApp de contacto"
          }
        },
        required: ["service", "clientName", "clientPhone"]
      },
      execute: async function(params) {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              status: "success",
              bookingUrl: "https://centrodeyogasalvadoraconesa.es/reserva",
              message: "Reserva pre-registrada para " + ((params && params.clientName) || "el cliente") + " en " + ((params && params.service) || "la clase") + "."
            })
          }]
        };
      }
    },
    {
      name: "navigate_site",
      description: "Navega a las diferentes secciones y páginas del Centro de Yoga Salvadora Conesa.",
      inputSchema: {
        type: "object",
        properties: {
          path: {
            type: "string",
            description: "Ruta de la página ('/', '/servicios', '/reserva', '/nagna-yoga', '/mejorar-asanas')"
          }
        },
        required: ["path"]
      },
      execute: async function(params) {
        if (typeof window !== "undefined" && params && params.path) {
          window.location.href = params.path;
        }
        return {
          content: [{
            type: "text",
            text: "Navegando a " + ((params && params.path) || "/")
          }]
        };
      }
    }
  ];

  var controller = typeof AbortController !== "undefined" ? new AbortController() : null;
  var signal = controller ? controller.signal : undefined;

  function registerWithContext(mc) {
    if (!mc) return;
    try {
      if (typeof mc.provideContext === "function") {
        try {
          mc.provideContext({ tools: tools, signal: signal });
        } catch(e1) {
          try { mc.provideContext(tools); } catch(e2) {}
        }
      }
    } catch(e) {}

    try {
      if (typeof mc.registerTool === "function") {
        for (var i = 0; i < tools.length; i++) {
          try {
            mc.registerTool(tools[i], { signal: signal });
          } catch(e1) {
            try { mc.registerTool(tools[i]); } catch(e2) {}
          }
        }
      }
    } catch(e) {}
  }

  function setup() {
    var nav = typeof navigator !== "undefined" ? navigator : null;
    var doc = typeof document !== "undefined" ? document : null;

    if (nav) {
      if (nav.modelContext) {
        registerWithContext(nav.modelContext);
      } else {
        var _storedTools = [].concat(tools);
        var polyfill = {
          tools: _storedTools,
          getTools: function() { return _storedTools; },
          provideContext: function(ctx) {
            var incoming = Array.isArray(ctx) ? ctx : (ctx && ctx.tools ? ctx.tools : []);
            _storedTools.length = 0;
            for (var j = 0; j < incoming.length; j++) { _storedTools.push(incoming[j]); }
            return Promise.resolve(_storedTools);
          },
          registerTool: function(t) {
            _storedTools.push(t);
            return Promise.resolve(t);
          }
        };

        var currentMC = polyfill;
        try {
          Object.defineProperty(nav, "modelContext", {
            get: function() { return currentMC; },
            set: function(val) {
              currentMC = val;
              registerWithContext(val);
            },
            configurable: true,
            enumerable: true
          });
        } catch(err) {
          try { nav.modelContext = polyfill; } catch(e) {}
        }
        registerWithContext(nav.modelContext);
      }
    }

    if (doc) {
      if (doc.modelContext) {
        registerWithContext(doc.modelContext);
      } else {
        try {
          var docPolyfill = {
            tools: [].concat(tools),
            provideContext: function(ctx) { return Promise.resolve(); },
            registerTool: function(t) { return Promise.resolve(); }
          };
          doc.modelContext = docPolyfill;
          registerWithContext(docPolyfill);
        } catch(e) {}
      }
    }
  }

  setup();

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", setup);
    }
    if (typeof window !== "undefined") {
      window.addEventListener("load", setup);
    }
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${cormorant.variable} ${outfit.variable} h-full antialiased`}
    >
      <head>
        <link rel="api-catalog" href="/.well-known/api-catalog" />
        <link rel="ai-catalog" href="/.well-known/ai-catalog.json" />
        <link rel="service-desc" href="/.well-known/mcp/server-card.json" />
        <link rel="service-doc" href="/llms.txt" />
        <link rel="describedby" href="/.well-known/agent-card.json" />
        <link rel="oauth-protected-resource" href="/.well-known/oauth-protected-resource" />
        <script
          id="webmcp-init"
          dangerouslySetInnerHTML={{
            __html: WEBMCP_INLINE_SCRIPT,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#FAF9F6] text-[#1C1C1C]">
        <WebMcpProvider />
        {children}
        <ChatBubbleWidget agentKey="booking" brandColor="#800020" />
        <VapiCallModal />
      </body>
    </html>
  );
}
