import { NextResponse } from "next/server";

const JWKS = {
  keys: [
    {
      crv: "Ed25519",
      x: "lAYsPmMuz3wrhDp5dhoiFZXH993bKmpYLA3g5L9ttqk",
      kty: "OKP",
      kid: "sJ8yht9x-x_dhPNkBzFdesdiBLEO5Y-ebiPIu86P00o",
      use: "sig",
    },
  ],
};

export async function GET() {
  return new NextResponse(JSON.stringify(JWKS, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/http-message-signatures-directory+json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers": "*",
      "Cache-Control": "public, max-age=86400",
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
