import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    PORWASSAP: process.env.PORWASSAP || process.env.NEXT_PUBLIC_PORWASSAP || "N",
    NEXT_PUBLIC_PORWASSAP: process.env.NEXT_PUBLIC_PORWASSAP || process.env.PORWASSAP || "N",
    PORVAPI: process.env.PORVAPI || process.env.NEXT_PUBLIC_PORVAPI || "S",
    NEXT_PUBLIC_PORVAPI: process.env.NEXT_PUBLIC_PORVAPI || process.env.PORVAPI || "S",
  },
  async redirects() {
    return [
      {
        source: "/banos__gong.html",
        destination: "/servicios",
        statusCode: 301,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/pages/nagna__yoga.html",
        destination: "/nagna-yoga",
      },
      {
        source: "/pages/nagna_yoga.html",
        destination: "/nagna-yoga",
      },
      {
        source: "/pages/el_espacio_para_mejorar_las_asanas.html",
        destination: "/mejorar-asanas",
      },
      {
        source: "/pages/el_espacio_para_mejorar_las_asanas",
        destination: "/mejorar-asanas",
      },
      {
        source: "/pages/politica_de_privacidad.html",
        destination: "/politica-de-privacidad",
      },
      {
        source: "/pages/politica_de_cookies.html",
        destination: "/politica-de-cookies",
      },
      {
        source: "/pages/ley_de_proteccion_de_datos.html",
        destination: "/ley-de-proteccion-de-datos",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/",
        headers: [
          {
            key: "Link",
            value:
              '</.well-known/api-catalog>; rel="api-catalog", </.well-known/ai-catalog.json>; rel="ai-catalog", </.well-known/mcp/server-card.json>; rel="service-desc", </llms.txt>; rel="service-doc", </.well-known/agent-card.json>; rel="describedby", </.well-known/oauth-protected-resource>; rel="oauth-protected-resource", </.well-known/mcp/server-card.json>; rel="mcp-server-card", </.well-known/agent-card.json>; rel="agent-card"',
          },
          {
            key: "WWW-Authenticate",
            value:
              'Bearer resource_metadata="https://centrodeyogasalvadoraconesa.es/.well-known/oauth-protected-resource"',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
