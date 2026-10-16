import { NextRequest, NextResponse } from "next/server";
import { fetchCrmServices } from "@/lib/crmServices";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || searchParams.get("categoria") || undefined;
    const type = searchParams.get("type") || searchParams.get("tipo") || undefined;

    const data = await fetchCrmServices({ category, type });
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
