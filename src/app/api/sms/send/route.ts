import { NextResponse } from "next/server";
import { sendSms } from "@/lib/sms";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { number, message, sender, contactId, callId, appointmentId } = body;

    if (!number || !message) {
      return NextResponse.json(
        {
          success: false,
          error: "Los campos 'number' y 'message' son obligatorios.",
        },
        { status: 400 }
      );
    }

    const result = await sendSms({
      number,
      message,
      sender,
      contactId,
      callId,
      appointmentId,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "No se pudo enviar el SMS.",
          rawResponse: result.rawResponse,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      status: result.status,
      messages: result.messages,
      cost: result.cost,
      currency: result.currency,
      service: result.service,
    });
  } catch (err: any) {
    console.error("Error in POST /api/sms/send:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Error interno al enviar SMS." },
      { status: 500 }
    );
  }
}
