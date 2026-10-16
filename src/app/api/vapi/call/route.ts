import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phoneNumber, name, agentKey = "booking", sessionId, inquiry } = body;

    if (!phoneNumber) {
      return NextResponse.json(
        { success: false, error: "El número de teléfono es obligatorio y debe tener formato E.164 (+34...)" },
        { status: 400 }
      );
    }

    const CRM_API_URL = process.env.NEXT_PUBLIC_CRM_API_URL || "https://crm-salvadoraconesa.jigretera.com";

    // Set a timeout for the CRM VAPI request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
      const crmRes = await fetch(`${CRM_API_URL}/api/widget/vapi/call`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber,
          name: name || "Visitante Web",
          agentKey,
          sessionId: sessionId || "web_guest",
          inquiry: inquiry || "Consulta general desde la web",
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const crmData = await crmRes.json().catch(() => ({}));

      if (!crmRes.ok) {
        return NextResponse.json(
          {
            success: false,
            error: crmData.error || `Error del servidor CRM (${crmRes.status}).`,
          },
          { status: crmRes.status }
        );
      }

      return NextResponse.json(crmData, { status: 200 });
    } catch (crmFetchErr: any) {
      clearTimeout(timeoutId);
      console.error("Error al contactar con el CRM de Salvadora:", crmFetchErr);
      return NextResponse.json(
        {
          success: false,
          error: "Error al contactar con VAPI o el CRM. Puedes llamarnos directamente al 695 172 625.",
        },
        { status: 502 }
      );
    }
  } catch (error: any) {
    console.error("Error general en /api/vapi/call:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Error interno al procesar llamada." },
      { status: 500 }
    );
  }
}

