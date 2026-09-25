import { NextResponse } from "next/server";
import {
  CRM_API_BASE_URL,
  checkCrmMaintenanceAndContact,
} from "@/lib/crmServices";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, serviceName, message } = body;

    const trimmedName = (name || "").trim();
    const trimmedEmail = (email || "").trim().toLowerCase();
    const trimmedPhone = (phone || "").trim();
    const trimmedMessage = (message || "").trim();
    const targetService = (serviceName || "").trim() || "Consulta General";

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      return NextResponse.json(
        {
          error:
            "Por favor, completa los campos requeridos: nombre, correo electrónico y mensaje.",
        },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return NextResponse.json(
        { error: "El formato de correo electrónico introducido no es válido." },
        { status: 400 }
      );
    }

    // 1. Comprobación de estado de mantenimiento y usuario bloqueado en CRM
    const crmCheck = await checkCrmMaintenanceAndContact(
      trimmedPhone || undefined,
      trimmedEmail
    );
    if (!crmCheck.allowed) {
      return NextResponse.json(
        { error: crmCheck.message },
        { status: crmCheck.statusCode || 400 }
      );
    }

    // 2. Envío al backend del CRM (Canal Email)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
      const res = await fetch(`${CRM_API_BASE_URL}/api/widget/contact-query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          phone: trimmedPhone || undefined,
          serviceName: targetService,
          message: trimmedMessage,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        return NextResponse.json(
          {
            error:
              data.message ||
              data.error ||
              "No se pudo registrar la consulta en este momento.",
          },
          { status: res.status }
        );
      }

      return NextResponse.json({
        success: true,
        message:
          data.message ||
          "Tu consulta ha sido enviada con éxito. Te responderemos a la mayor brevedad.",
      });
    } catch (fetchErr: any) {
      clearTimeout(timeoutId);
      console.error("Error al contactar con el CRM para consulta de contacto:", fetchErr);
      return NextResponse.json(
        {
          error:
            "No se ha podido conectar con el servidor de correo. Puedes escribirnos directamente a salvadoraconesa@gmail.com o por WhatsApp al 695 172 625.",
        },
        { status: 502 }
      );
    }
  } catch (error: any) {
    console.error("Error en POST /api/contacto:", error);
    return NextResponse.json(
      { error: "Error interno al procesar el formulario de consulta." },
      { status: 500 }
    );
  }
}
