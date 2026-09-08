import { NextResponse } from "next/server";
import { fetchCrmServices } from "@/lib/crmServices";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await fetchCrmServices();
    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error: any) {
    console.error("Error at CRM services proxy:", error);
    return NextResponse.json(
      { success: false, error: "Error fetching services" },
      { status: 500 }
    );
  }
}
