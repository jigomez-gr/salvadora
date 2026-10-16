import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "centrodeyogasalvadoraconesa.es";
  const proto = host.includes("centrodeyogasalvadoraconesa.es") ? "https" : (request.headers.get("x-forwarded-proto") || "https");
  const canonicalOrigin = `${proto}://${host}`;

  const queryResource = request.nextUrl.searchParams.get("resource");
  const resourceUrl = queryResource || `${canonicalOrigin}/`;

  const prm = {
    resource: resourceUrl,
    authorization_servers: [
      `${canonicalOrigin}/`,
      canonicalOrigin,
      "https://centrodeyogasalvadoraconesa.es/",
      "https://centrodeyogasalvadoraconesa.es",
    ],
    scopes_supported: ["openid", "profile", "read:classes", "write:bookings"],
    bearer_methods_supported: ["header"],
    resource_documentation: "https://centrodeyogasalvadoraconesa.es/llms.txt",
    resource_policy_uri: "https://centrodeyogasalvadoraconesa.es/politica-de-privacidad",
    resource_tos_uri: "https://centrodeyogasalvadoraconesa.es/ley-de-proteccion-de-datos",
  };

  return new NextResponse(JSON.stringify(prm, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers": "*",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers": "*",
    },
  });
}
