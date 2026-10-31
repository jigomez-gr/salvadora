import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://salvadoraconesa.es";

  return [
    {
      url: `${baseUrl}/`,
    },
    {
      url: `${baseUrl}/servicios`,
    },
    {
      url: `${baseUrl}/nagna-yoga`,
    },
    {
      url: `${baseUrl}/mejorar-asanas`,
    },
    {
      url: `${baseUrl}/bienestar-experience/mas-alla-del-tumor`,
    },
    {
      url: `${baseUrl}/politica-de-privacidad`,
    },
    {
      url: `${baseUrl}/politica-de-cookies`,
    },
    {
      url: `${baseUrl}/ley-de-proteccion-de-datos`,
    },
  ];
}
