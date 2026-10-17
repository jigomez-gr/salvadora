import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return new NextResponse(null, {
    status: 301,
    headers: {
      Location: "https://salvadoraconesa.es/servicios",
    },
  });
}

export async function HEAD() {
  return new NextResponse(null, {
    status: 301,
    headers: {
      Location: "https://salvadoraconesa.es/servicios",
    },
  });
}
