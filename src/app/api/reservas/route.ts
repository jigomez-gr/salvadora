import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { sendBookingConfirmationSms } from "@/lib/sms";
import { fetchCrmServices, findServiceByCodeOrId } from "@/lib/crmServices";

export const dynamic = "force-dynamic";

const MAX_PLAZAS = 999999;

export async function GET() {
    try {
        return NextResponse.json({
            maxPlazas: MAX_PLAZAS,
            totalPaidPlazas: 0,
            availablePlazas: MAX_PLAZAS,
        });
    } catch (error: any) {
        console.error("Error at reservations query API:", error);
        return NextResponse.json(
            { error: "Error al consultar las plazas disponibles." },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { nombre, email, telefono, numeroPlazas, tipoHabitacion, comentarios } = body;

        // Validación de campos de contacto primarios
        if (!nombre || !telefono || !numeroPlazas || !tipoHabitacion) {
            return NextResponse.json(
                { error: "Por favor, indica tu nombre, teléfono y la actividad deseada." },
                { status: 400 }
            );
        }

        const plazasCount = parseInt(numeroPlazas, 10);
        if (isNaN(plazasCount) || plazasCount < 1) {
            return NextResponse.json(
                { error: "El número de plazas debe ser mayor o igual a 1." },
                { status: 400 }
            );
        }

        // Consulta dinámica de servicios del CRM
        const { services } = await fetchCrmServices();
        const service = findServiceByCodeOrId(services, tipoHabitacion);

        let unitPrice = 25;
        if (service && service.price) {
            const p = parseFloat(service.price);
            if (!isNaN(p)) unitPrice = p;
        } else {
            if (tipoHabitacion === "dos_clases_semanal") unitPrice = 42;
            else if (tipoHabitacion === "gong") unitPrice = 16;
            else if (tipoHabitacion === "puja") unitPrice = 90;
            else if (tipoHabitacion === "constelaciones_constelar") unitPrice = 60;
            else if (tipoHabitacion === "constelaciones_participar") unitPrice = 20;
            else if (tipoHabitacion === "retiro_encuentro") unitPrice = 100;
        }
        const totalAmount = plazasCount * unitPrice;

        // Procedimiento de tratamiento de email con respeto:
        // Si el cliente lo proporciona, se normaliza y almacena.
        // Si prefiere no indicarlo en el alta, se asigna un identificador interno de cortesía.
        const cleanPhone = telefono.replace(/[\s\-\(\)\.]/g, "").trim();
        const hasRealEmail = email && typeof email === "string" && email.includes("@") && email.trim().length > 4;
        const normalizedEmail = hasRealEmail
            ? email.trim().toLowerCase()
            : `contacto_${cleanPhone || Date.now()}@salvadoraconesa.com`;

        // Alta o verificación del usuario en la base de datos
        let user = await prisma.usuario.findUnique({
            where: { correo: normalizedEmail },
        });

        if (!user) {
            user = await prisma.usuario.create({
                data: {
                    correo: normalizedEmail,
                    nombre,
                    movil: telefono,
                    idrolusuario: 3,
                    estadoVerificacion: "verificado",
                },
            });
        } else {
            user = await prisma.usuario.update({
                where: { correo: normalizedEmail },
                data: {
                    nombre,
                    movil: telefono,
                },
            });
        }

        // Registrar la reserva en estado 'pendiente_pago'
        const reserva = await prisma.reserva.create({
            data: {
                nombre,
                email: normalizedEmail,
                telefono,
                numeroPlazas: plazasCount,
                tipoHabitacion,
                importeTotal: totalAmount,
                estado: "pendiente_pago",
                comentarios: comentarios || "",
            },
        });

        // Crear cookie de sesión para que el usuario pueda gestionar su reserva
        try {
            const sessionPayload = {
                idusuario: user.idusuario,
                correo: user.correo,
                nombre: user.nombre || "",
                apellido: user.apellido || "",
                movil: user.movil || "",
            };
            const cookieStore = await cookies();
            cookieStore.set("auth_session", JSON.stringify(sessionPayload), {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 60 * 24 * 7,
                path: "/",
            });
        } catch (cookieErr) {
            console.warn("No se pudo guardar la cookie de sesión automática:", cookieErr);
        }

        // DISPARO DE SMS DE CONFIRMACIÓN (Zadarma API + CRM Fallback)
        let smsResult = null;
        try {
            smsResult = await sendBookingConfirmationSms({
                telefono,
                nombre,
                servicio: tipoHabitacion,
                plazas: plazasCount,
                email: hasRealEmail ? normalizedEmail : undefined,
            });
            console.log(`[RESERVA SMS RESULT] Para ${telefono}:`, smsResult);
        } catch (smsErr) {
            console.error("Error al disparar SMS de confirmación:", smsErr);
        }

        return NextResponse.json({
            success: true,
            reservaId: reserva.id,
            reserva,
            smsSent: smsResult?.success ?? false,
            emailProvided: hasRealEmail,
        });
    } catch (error: any) {
        console.error("Error creating reservation:", error);
        return NextResponse.json(
            { error: "Error interno del servidor al registrarse: " + error.message },
            { status: 500 }
        );
    }
}
