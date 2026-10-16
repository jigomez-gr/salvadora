import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import Stripe from "stripe";
import { sendPaymentConfirmationSms } from "@/lib/sms";

export const dynamic = "force-dynamic";

const stripe = process.env.STRIPE_SECRET_KEY
    ? new Stripe(process.env.STRIPE_SECRET_KEY, {
        // @ts-ignore
        apiVersion: "2023-10-16",
    })
    : null;

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Email sending simulation helper
function simulateEmails(reserva: any) {
    let serviceLabel = "Actividad Centro de Yoga";
    if (reserva.tipoHabitacion === "clase_semanal") serviceLabel = "1 Clase Semanal (25 €/mes)";
    else if (reserva.tipoHabitacion === "dos_clases_semanal") serviceLabel = "2 Clases Semanales (42 €/mes)";
    else if (reserva.tipoHabitacion === "gong") serviceLabel = "Baño de Gong (16 €/sesión)";
    else if (reserva.tipoHabitacion === "puja") serviceLabel = "Puja de Gong (90 €/puja)";
    else if (reserva.tipoHabitacion === "constelaciones_constelar") serviceLabel = "Constelaciones - Constelar (60 €/sesión)";
    else if (reserva.tipoHabitacion === "constelaciones_participar") serviceLabel = "Constelaciones - Participar (20 €/sesión)";
    else if (reserva.tipoHabitacion === "retiro_encuentro") serviceLabel = "Señal Retiro / Encuentro (100 €)";

    console.log(`
============================================================
[SIMULACIÓN DE EMAIL] - CONFIRMACIÓN DE RESERVA Y PAGO
============================================================
Destinatario: ${reserva.email}
Asunto: Confirmación de pago e inscripción - Centro de Yoga Fuenlabrada
Cuerpo:
Estimado/a ${reserva.nombre},

Hemos recibido correctamente el pago de su reserva para el Centro de Yoga Fuenlabrada Salvadora Conesa.

Detalles de la Inscripción:
- ID de Registro: ${reserva.id}
- Teléfono: ${reserva.telefono}
- Plazas/Inscripciones: ${reserva.numeroPlazas}
- Servicio Contratado: ${serviceLabel}
- Importe Total Pagado: ${reserva.importeTotal} € (IVA incluido)
- Comentarios: ${reserva.comentarios || "Ninguno"}

Nos pondremos en contacto con usted para darle la bienvenida y ultimar los detalles.
¡Gracias por confiar en el Centro de Yoga Fuenlabrada Salvadora Conesa!

============================================================
`);

    console.log(`
============================================================
[SIMULACIÓN DE EMAIL] - NOTIFICACIÓN PARA ORGANIZACIÓN
============================================================
Destinatario: info@centro-yoga-salvadoraconesa.com
Asunto: ¡NUEVA INSCRIPCIÓN RECIBIDA! - Centro de Yoga Fuenlabrada
Cuerpo:
Hola Salvadora,

Se ha confirmado el pago de una nueva inscripción para las actividades del Centro de Yoga.

Detalles del Cliente:
- Nombre: ${reserva.nombre}
- Email: ${reserva.email}
- Teléfono: ${reserva.telefono}
- Plazas/Inscripciones: ${reserva.numeroPlazas}
- Servicio: ${serviceLabel}
- Importe: ${reserva.importeTotal} €
- Comentarios: ${reserva.comentarios || "Ninguno"}

ID de Transacción Stripe (Checkout Session): ${reserva.stripeSessionId}
ID de Pago (Payment Intent): ${reserva.stripePaymentIntentId || "N/A"}
============================================================
`);
}

export async function POST(request: Request) {
    const rawBody = await request.text();
    const sig = request.headers.get("stripe-signature");

    if (!sig || !endpointSecret) {
        // If webhook signing secret is not configured, we allow manual trigger in development or if Stripe is in test mode
        const isTestMode = process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_") || false;
        if (process.env.NODE_ENV !== "production" || isTestMode) {
            try {
                const bodyObj = JSON.parse(rawBody);
                if (bodyObj.action === "simulate_success" && bodyObj.reservaId) {
                    const reserva = await prisma.reserva.findUnique({
                        where: { id: bodyObj.reservaId },
                    });

                    if (!reserva) {
                        return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 });
                    }

                    const checkoutAmount = bodyObj.amount ? parseFloat(bodyObj.amount) : reserva.importeTotal;

                    // Verify or create traveler usuario
                    let user = await prisma.usuario.findUnique({
                        where: { correo: reserva.email },
                    });

                    if (!user) {
                        user = await prisma.usuario.create({
                            data: {
                                correo: reserva.email,
                                nombre: reserva.nombre,
                                movil: reserva.telefono,
                                idrolusuario: 3,
                                estadoVerificacion: "verificado",
                            },
                        });
                    }

                    const mockSessionId = bodyObj.sessionId || "simulated_session_" + Date.now();

                    // Check if payment with this session ID already exists to prevent duplicate entries on refresh
                    const existingPayment = await prisma.pagosUsuario.findFirst({
                        where: {
                            stripeSessionId: mockSessionId,
                        },
                    });

                    if (existingPayment) {
                        return NextResponse.json({ status: "success", info: "Payment already registered previously" });
                    }

                    // Create payments record
                    await prisma.pagosUsuario.create({
                        data: {
                            codigoViaje: "CENTRO_YOGA_SALVADORA",
                            fechaSalida: new Date(),
                            idusuario: user.idusuario,
                            descripcionViaje: `Abono de reserva - Centro de Yoga Salvadora Conesa (${checkoutAmount} €)`,
                            cantidadAbonada: checkoutAmount,
                            procesado: "N",
                            stripeSessionId: mockSessionId,
                        },
                    });

                    // Check total paid
                    const dbPayments = await prisma.pagosUsuario.findMany({
                        where: { idusuario: user.idusuario },
                    });
                    const totalPaid = dbPayments.reduce((acc: number, curr: any) => acc + (curr.cantidadAbonada ?? 0), 0);

                    // Update reserva state
                    const shouldMarkPaid = totalPaid >= (reserva.importeTotal - 0.01);
                    const updatedReserva = await prisma.reserva.update({
                        where: { id: bodyObj.reservaId },
                        data: {
                            estado: shouldMarkPaid ? "pagada" : "pendiente_pago",
                            stripePaymentIntentId: "simulated_intent_" + Date.now(),
                            stripeSessionId: mockSessionId,
                        },
                    });

                    // Log simulation email info detail
                    console.log(`[PAGO PARCIAL SIMULADO] Se han pagado ${checkoutAmount} €. Total abonado: ${totalPaid} / ${reserva.importeTotal} €.`);
                    simulateEmails({
                        ...updatedReserva,
                        currentPayment: checkoutAmount,
                        totalPaid,
                        remaining: Math.max(0, reserva.importeTotal - totalPaid),
                    });

                    // Disparar SMS de confirmación de pago vía Zadarma API
                    try {
                        await sendPaymentConfirmationSms({
                            telefono: reserva.telefono,
                            nombre: reserva.nombre,
                            servicio: reserva.tipoHabitacion,
                            importe: checkoutAmount,
                        });
                    } catch (smsErr) {
                        console.error("Error al enviar SMS de confirmación de pago:", smsErr);
                    }

                    return NextResponse.json({ status: "success", info: "Simulated success manually" });
                }
            } catch (err: any) {
                return NextResponse.json({ error: "Failed to parse simulation req" }, { status: 400 });
            }
        }

        return NextResponse.json(
            { error: "Stripe signature or secret missing." },
            { status: 400 }
        );
    }

    let event: Stripe.Event;

    try {
        if (!stripe) {
            throw new Error("Stripe secret key is not configured.");
        }
        event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
    } catch (err: any) {
        console.error(`Webhook Error de Firma: ${err.message}`);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // Handle the event
    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;
                const reservaId = session.metadata?.reservaId;
                const metadataAmount = session.metadata?.amount;
                const paymentIntentId = typeof session.payment_intent === "string"
                    ? session.payment_intent
                    : session.payment_intent?.toString() || null;

                if (!reservaId) {
                    console.warn("Stripe Checkout Session sin reservaId en metadata.");
                    break;
                }

                const reserva = await prisma.reserva.findUnique({
                    where: { id: reservaId },
                });

                if (!reserva) {
                    console.error(`Reserva ${reservaId} no encontrada en el webhook.`);
                    break;
                }

                let user = await prisma.usuario.findUnique({
                    where: { correo: reserva.email },
                });

                if (!user) {
                    user = await prisma.usuario.create({
                        data: {
                            correo: reserva.email,
                            nombre: reserva.nombre,
                            movil: reserva.telefono,
                            idrolusuario: 3,
                            estadoVerificacion: "verificado",
                        },
                    });
                }

                const checkoutAmount = metadataAmount ? parseFloat(metadataAmount) : reserva.importeTotal;

                // Create physical payment log
                await prisma.pagosUsuario.create({
                    data: {
                        codigoViaje: "CENTRO_YOGA_SALVADORA",
                        fechaSalida: new Date(),
                        idusuario: user.idusuario,
                        descripcionViaje: `Abono de inscripción vía Stripe (${checkoutAmount} €)`,
                        cantidadAbonada: checkoutAmount,
                        procesado: "N",
                        stripeSessionId: session.id,
                    },
                });

                // Compute total paid
                const dbPayments = await prisma.pagosUsuario.findMany({
                    where: { idusuario: user.idusuario },
                });
                const totalPaid = dbPayments.reduce((acc: number, curr: any) => acc + (curr.cantidadAbonada ?? 0), 0);

                const shouldMarkPaid = totalPaid >= (reserva.importeTotal - 0.01);

                const updated = await prisma.reserva.update({
                    where: { id: reservaId },
                    data: {
                        estado: shouldMarkPaid ? "pagada" : "pendiente_pago",
                        stripePaymentIntentId: paymentIntentId,
                        stripeSessionId: session.id,
                    },
                });

                console.log(`Reserva ${reservaId} marcada satisfactoriamente. Total abonado: ${totalPaid} €.`);
                simulateEmails({
                    ...updated,
                    currentPayment: checkoutAmount,
                    totalPaid,
                    remaining: Math.max(0, reserva.importeTotal - totalPaid),
                });

                // Disparar SMS de confirmación de pago vía Zadarma API
                try {
                    await sendPaymentConfirmationSms({
                        telefono: reserva.telefono,
                        nombre: reserva.nombre,
                        servicio: reserva.tipoHabitacion,
                        importe: checkoutAmount,
                    });
                } catch (smsErr) {
                    console.error("Error al enviar SMS de confirmación de pago:", smsErr);
                }
                break;
            }

            case "checkout.session.expired": {
                const session = event.data.object as Stripe.Checkout.Session;
                const reservaId = session.metadata?.reservaId;

                if (reservaId) {
                    const reserva = await prisma.reserva.findUnique({ where: { id: reservaId } });
                    if (reserva && reserva.estado === "pendiente_pago") {
                        await prisma.reserva.update({
                            where: { id: reservaId },
                            data: { estado: "cancelada" },
                        });
                        console.log(`Reserva ${reservaId} expirada y marcada como CANCELADA.`);
                    }
                }
                break;
            }

            default:
                console.log(`Evento de webhook no manejado: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error("Error al procesar el evento de webhook:", error);
        return NextResponse.json(
            { error: "Error en el webhook handler: " + error.message },
            { status: 500 }
        );
    }
}
