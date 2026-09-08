"use client";

import { useState, useEffect } from "react";
import {
    User,
    Mail,
    Phone,
    Users,
    ShieldCheck,
    ArrowRight,
    Loader2,
    KeyRound,
    LogOut,
    CheckCircle,
    CreditCard,
    RefreshCw,
    MessageSquare,
    Sparkles,
    Calendar,
    HeartHandshake,
    Clock
} from "lucide-react";
import {
    CrmService,
    FALLBACK_CRM_SERVICES,
    findServiceByCodeOrId,
    formatServicePrice
} from "@/lib/crmServices";

interface UserSession {
    loggedIn: boolean;
    user?: {
        idusuario: number;
        correo: string;
        nombre?: string;
        apellido?: string;
        movil?: string;
        telegramUsername?: string;
        telegramId?: string;
        estadoVerificacion?: string;
    };
    reserva?: {
        id: string;
        nombre: string;
        email: string;
        telefono: string;
        numeroPlazas: number;
        tipoHabitacion: string;
        importeTotal: number;
        estado: string;
        stripeSessionId?: string;
        comentarios?: string;
    };
    pagos?: {
        idpago: number;
        codigoViaje?: string;
        fechaSalida?: string;
        descripcionViaje?: string;
        cantidadAbonada?: number;
        procesado?: string;
        fechaPago?: string;
    }[];
    totalPaid?: number;
}

interface BookingFormProps {
    initialServices?: CrmService[];
}

export default function BookingForm({ initialServices }: BookingFormProps = {}) {
    // Tab Navigation: 'alta' (default) vs 'consulta' (consultar estado existente)
    const [activeTab, setActiveTab] = useState<"alta" | "consulta">("alta");

    // Session State
    const [session, setSession] = useState<UserSession | null>(null);
    const [sessionLoading, setSessionLoading] = useState(true);

    // Initial Registration Fields (Alta)
    const [nombre, setNombre] = useState("");
    const [telefono, setTelefono] = useState("");
    const [bookingEmail, setBookingEmail] = useState("");
    const [numeroPlazas, setNumeroPlazas] = useState(1);
    const [tipoHabitacion, setTipoHabitacion] = useState<string>("clase_semanal");
    const [comentarios, setComentarios] = useState("");
    const [condiciones, setCondiciones] = useState(false);
    const [privacidad, setPrivacidad] = useState(false);

    // Success State for Alta
    const [bookingSuccessData, setBookingSuccessData] = useState<{
        reservaId: string;
        reserva: any;
        smsSent: boolean;
        emailProvided: boolean;
    } | null>(null);

    // OTP Verification Fields (for existing session lookup)
    const [authEmail, setAuthEmail] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [otpCode, setOtpCode] = useState("");
    const [otpLoading, setOtpLoading] = useState(false);
    const [otpSuccessMsg, setOtpSuccessMsg] = useState<string | null>(null);
    const [debugCode, setDebugCode] = useState<string | null>(null);

    // Profile Update Fields
    const [userNombre, setUserNombre] = useState("");
    const [userApellido, setUserApellido] = useState("");
    const [userMovil, setUserMovil] = useState("");
    const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);
    const [profileLoading, setProfileLoading] = useState(false);

    // Installment Payment States
    const [paymentOption, setPaymentOption] = useState<"primer" | "segundo" | "completo" | "personalizado">("primer");
    const [customAmount, setCustomAmount] = useState("50");
    const [checkoutLoading, setCheckoutLoading] = useState(false);

    const [formLoading, setFormLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Helper: fetch active session
    const loadSession = async () => {
        try {
            const res = await fetch("/api/reservas/me");
            if (res.ok) {
                const data = await res.json();
                setSession(data);
                if (data.loggedIn && data.user) {
                    setAuthEmail(data.user.correo || "");
                    setUserNombre(data.user.nombre || "");
                    setUserApellido(data.user.apellido || "");
                    setUserMovil(data.user.movil || "");

                    if (data.reserva) {
                        setNombre(data.reserva.nombre || "");
                        setTelefono(data.reserva.telefono || "");
                        setNumeroPlazas(data.reserva.numeroPlazas || 1);
                        setTipoHabitacion(data.reserva.tipoHabitacion || "clase_semanal");
                        setComentarios(data.reserva.comentarios || "");
                    } else if (data.user.nombre) {
                        setNombre(`${data.user.nombre || ""} ${data.user.apellido || ""}`.trim());
                        setTelefono(data.user.movil || "");
                    }
                }
            }
        } catch (err) {
            console.error("Error al cargar la sesión:", err);
        } finally {
            setSessionLoading(false);
        }
    };

    // Dynamic CRM Services
    const [services, setServices] = useState<CrmService[]>(
        initialServices && initialServices.length > 0 ? initialServices : FALLBACK_CRM_SERVICES
    );

    useEffect(() => {
        loadSession();
        async function loadCrmServices() {
            try {
                const res = await fetch("/api/crm/services");
                if (res.ok) {
                    const data = await res.json();
                    if (data.services && Array.isArray(data.services) && data.services.length > 0) {
                        setServices(data.services);
                    }
                }
            } catch (err) {
                console.warn("Could not load dynamic services for booking form:", err);
            }
        }
        loadCrmServices();
    }, []);

    // Dynamic Price calculation from CRM catalog
    const matchedService = findServiceByCodeOrId(services, tipoHabitacion);
    const parsedPrice = matchedService && matchedService.price ? parseFloat(matchedService.price) : 25;
    const unitPrice = isNaN(parsedPrice) ? 25 : parsedPrice;
    const totalPrice = numeroPlazas * unitPrice;

    // Remaining balance
    const currentReserva = bookingSuccessData?.reserva || session?.reserva;
    const currentPaid = session?.totalPaid ?? 0;
    const remainingBalance = currentReserva
        ? Math.max(0, currentReserva.importeTotal - currentPaid)
        : 0;

    // Helper: Dynamic Service Label
    const getServiceTitle = (code: string) => {
        const found = findServiceByCodeOrId(services, code);
        if (found) return found.name;
        const labels: Record<string, string> = {
            clase_semanal: "1 Clase Semanal (Mes)",
            dos_clases_semanal: "2 Clases Semanales (Mes)",
            gong: "Baño de Gong",
            puja: "Puja de Gong",
            constelaciones_constelar: "Constelaciones (Constelar)",
            constelaciones_participar: "Constelaciones (Participar)",
            retiro_encuentro: "Retiro de Ayuno Terapéutico",
        };
        return labels[code] || code;
    };

    // ALTA DE RESERVA: Enviar formulario
    const handleCreateBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!nombre.trim() || !telefono.trim()) {
            setError("Por favor, introduce tu nombre y número de teléfono móvil.");
            return;
        }

        if (!condiciones || !privacidad) {
            setError("Debes aceptar las condiciones de inscripción y la política de privacidad (RGPD).");
            return;
        }

        setFormLoading(true);
        try {
            const emailToSend = bookingEmail.trim() || authEmail.trim();

            const res = await fetch("/api/reservas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombre: nombre.trim(),
                    email: emailToSend,
                    telefono: telefono.trim(),
                    numeroPlazas,
                    tipoHabitacion,
                    comentarios: comentarios.trim(),
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Ocurrió un error al registrar la reserva.");
            }

            setBookingSuccessData({
                reservaId: data.reservaId,
                reserva: data.reserva,
                smsSent: data.smsSent,
                emailProvided: data.emailProvided,
            });

            // Refrescar sesión en segundo plano
            await loadSession();
        } catch (err: any) {
            setError(err.message || "Error al registrar la reserva.");
        } finally {
            setFormLoading(false);
        }
    };

    // Pay installment via Stripe Checkout
    const handlePayInstallment = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const targetReserva = bookingSuccessData?.reserva || session?.reserva;
        if (!targetReserva) return;

        let payAmount = 0;
        if (paymentOption === "primer") {
            payAmount = Math.min(100, remainingBalance || targetReserva.importeTotal);
        } else if (paymentOption === "completo") {
            payAmount = remainingBalance || targetReserva.importeTotal;
        } else {
            const parsed = parseFloat(customAmount);
            if (isNaN(parsed) || parsed < 10) {
                setError("La cantidad personalizada debe ser de al menos 10 €.");
                return;
            }
            payAmount = parsed;
        }

        setCheckoutLoading(true);
        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    reservaId: targetReserva.id,
                    amount: payAmount,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Error al procesar el pago.");

            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error("No se pudo obtener la pasarela de pago.");
            }
        } catch (err: any) {
            setError(err.message);
            setCheckoutLoading(false);
        }
    };

    // Send OTP for existing reservation lookup
    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setOtpSuccessMsg(null);
        setDebugCode(null);

        if (!authEmail.trim() || !authEmail.includes("@")) {
            setError("Por favor, introduce una dirección de correo válida.");
            return;
        }

        setOtpLoading(true);
        try {
            const res = await fetch("/api/auth/otp/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: authEmail.trim() }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Error al enviar el código.");

            setOtpSent(true);
            setOtpSuccessMsg(data.message);
            if (data.debugCode) setDebugCode(data.debugCode);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setOtpLoading(false);
        }
    };

    // Verify OTP
    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setOtpSuccessMsg(null);

        if (!otpCode.trim() || otpCode.length < 5) {
            setError("Por favor, introduce el código de verificación.");
            return;
        }

        setOtpLoading(true);
        try {
            const res = await fetch("/api/auth/otp/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: authEmail.trim(), code: otpCode.trim() }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Código incorrecto o expirado.");

            setOtpSent(false);
            setOtpCode("");
            await loadSession();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setOtpLoading(false);
        }
    };

    // Logout
    const handleLogout = async () => {
        setError(null);
        setProfileSuccessMsg(null);
        try {
            await fetch("/api/auth/session", { method: "DELETE" });
            setSession(null);
            setAuthEmail("");
            setOtpSent(false);
            setBookingSuccessData(null);
        } catch (err) {
            console.error("Error logging out:", err);
        }
    };

    // Profile update
    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setProfileLoading(true);
        setProfileSuccessMsg(null);
        setError(null);

        try {
            const res = await fetch("/api/auth/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombre: userNombre,
                    apellido: userApellido,
                    movil: userMovil,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "No se pudo actualizar el perfil.");
            setProfileSuccessMsg("¡Datos actualizados correctamente!");
            await loadSession();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setProfileLoading(false);
        }
    };

    if (sessionLoading) {
        return (
            <div className="bg-[#FAF9F6] border border-[#C5A059]/30 rounded-2xl p-8 sm:p-12 shadow-xl flex flex-col justify-center items-center gap-4 text-center min-h-[260px]">
                <Loader2 className="w-9 h-9 animate-spin text-[#800020]" />
                <p className="text-sm font-medium text-[#1C1C1C]/70">Cargando área de reservas...</p>
            </div>
        );
    }

    return (
        <div className="bg-[#FAF9F6] border border-[#C5A059]/30 rounded-2xl p-5 sm:p-9 shadow-2xl relative overflow-hidden transition-all duration-300 font-sans">
            {/* Top Accent Gradient Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-[#800020] via-[#C5A059] to-[#800020]" />

            {/* TAB SELECTOR */}
            <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-6 gap-2 flex-wrap">
                <div className="inline-flex rounded-xl bg-stone-100 p-1 border border-stone-200">
                    <button
                        type="button"
                        onClick={() => {
                            setActiveTab("alta");
                            setError(null);
                        }}
                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                            activeTab === "alta"
                                ? "bg-[#800020] text-white shadow-xs"
                                : "text-stone-600 hover:text-stone-900"
                        }`}
                    >
                        ✨ Alta de Reserva (Directa)
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setActiveTab("consulta");
                            setError(null);
                        }}
                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                            activeTab === "consulta"
                                ? "bg-[#800020] text-white shadow-xs"
                                : "text-stone-600 hover:text-stone-900"
                        }`}
                    >
                        📋 {session?.reserva ? "Mi Reserva / Pagos" : "¿Ya tienes una reserva?"}
                    </button>
                </div>

                {session?.loggedIn && (
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-stone-500 hidden sm:inline">
                            Identificado como <strong>{session.user?.correo}</strong>
                        </span>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-stone-600 hover:text-[#800020] bg-white border border-stone-200 px-2.5 py-1.5 rounded-lg transition"
                        >
                            <LogOut className="w-3.5 h-3.5" /> Salir
                        </button>
                    </div>
                )}
            </div>

            {/* ALERTA DE ERROR */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-xs sm:text-sm text-red-800 font-medium animate-in fade-in">
                    {error}
                </div>
            )}

            {/* TAB 1: ALTA DE RESERVA (DIRECTA, SIN BARRERAS) */}
            {activeTab === "alta" && (
                <div>
                    {/* ÉXITO TRAS COMPLETAR ALTA */}
                    {bookingSuccessData ? (
                        <div className="space-y-6 animate-in zoom-in-95 duration-200">
                            <div className="p-6 bg-white border-2 border-emerald-500/30 rounded-2xl shadow-sm text-center space-y-4">
                                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 shadow-sm">
                                    <CheckCircle className="w-8 h-8" />
                                </div>

                                <div className="space-y-1.5">
                                    <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider rounded-full">
                                        ¡Inscripción Registrada!
                                    </span>
                                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#800020]">
                                        Tu plaza ha quedado reservada
                                    </h3>
                                    <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
                                        Hemos registrado tu alta para <strong>{bookingSuccessData.reserva?.nombre}</strong>.
                                    </p>
                                </div>

                                {/* AVISO DE CONFIRMACIÓN POR SMS Y EMAIL */}
                                <div className="max-w-md mx-auto space-y-2.5 text-left pt-2">
                                    <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
                                        <Phone className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                        <div>
                                            <strong className="block font-bold">📲 Confirmación por SMS (Zadarma):</strong>
                                            <span>
                                                {bookingSuccessData.smsSent
                                                    ? `Hemos emitido un SMS de confirmación a tu teléfono ${bookingSuccessData.reserva?.telefono} con los datos de tu plaza.`
                                                    : `Tu teléfono ${bookingSuccessData.reserva?.telefono} ha quedado registrado como canal principal de contacto.`}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200 text-xs text-blue-950 flex items-start gap-2.5">
                                        <Mail className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                                        <div>
                                            <strong className="block font-bold">✉️ Correo Electrónico (Respeto a tu Privacidad):</strong>
                                            <span>
                                                {bookingSuccessData.emailProvided
                                                    ? `Recibirás un comprobante de cortesía en ${bookingSuccessData.reserva?.email}. Solo lo utilizaremos para cuestiones vinculadas a tu actividad.`
                                                    : "Has optado por no indicar correo en este momento. Respetamos totalmente tu decisión. Si deseas recibir justificantes o avisos por email en el futuro, puedes facilitarlo en recepción."}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* RESUMEN DE LA RESERVA */}
                                <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 max-w-md mx-auto text-left text-xs space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-stone-500">Actividad:</span>
                                        <span className="font-bold text-[#800020]">
                                            {getServiceTitle(bookingSuccessData.reserva?.tipoHabitacion)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-stone-500">Plazas:</span>
                                        <span className="font-bold text-stone-900">
                                            {bookingSuccessData.reserva?.numeroPlazas} plaza(s)
                                        </span>
                                    </div>
                                    <div className="flex justify-between border-t border-stone-200 pt-2 font-bold">
                                        <span className="text-stone-700">Importe Total:</span>
                                        <span className="text-[#800020] text-sm">
                                            {bookingSuccessData.reserva?.importeTotal} €
                                        </span>
                                    </div>
                                </div>

                                {/* OPCIONES DE PAGO */}
                                <div className="pt-3 max-w-md mx-auto space-y-2.5">
                                    <button
                                        type="button"
                                        onClick={handlePayInstallment}
                                        disabled={checkoutLoading}
                                        className="w-full py-3.5 px-4 bg-[#800020] hover:bg-[#660019] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {checkoutLoading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" /> Conectando con Stripe...
                                            </>
                                        ) : (
                                            <>
                                                <CreditCard className="w-4 h-4" />
                                                Pagar Ahora Online con Tarjeta (Stripe)
                                            </>
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setBookingSuccessData(null);
                                            setActiveTab("consulta");
                                        }}
                                        className="w-full py-2.5 px-4 bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 rounded-xl font-semibold text-xs transition"
                                    >
                                        Pagaré en el Centro / Ver Detalle Completo
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* FORMULARIO DE ALTA CON EMAIL RESPETUOSO */
                        <form onSubmit={handleCreateBooking} className="space-y-6">
                            <div>
                                <span className="block text-xs uppercase tracking-widest text-[#C5A059] font-bold mb-1">
                                    Centro de Yoga Fuenlabrada Salvadora Conesa
                                </span>
                                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#800020]">
                                    Alta de Reserva e Inscripción
                                </h3>
                                <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
                                    Completa tus datos de contacto para asegurar tu plaza. Recibirás un <strong>mensaje SMS inmediato</strong> con la confirmación de tu reserva.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                                {/* NOMBRE Y APELLIDOS */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold text-stone-800">
                                        Nombre y Apellidos <span className="text-[#800020]">*</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-400">
                                            <User className="h-4 w-4" />
                                        </span>
                                        <input
                                            required
                                            type="text"
                                            value={nombre}
                                            onChange={(e) => setNombre(e.target.value)}
                                            placeholder="Ej. María García López"
                                            className="block w-full pl-10 pr-3 py-2.5 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#800020] focus:border-[#800020] shadow-2xs transition"
                                        />
                                    </div>
                                </div>

                                {/* TELÉFONO MÓVIL (CANAL PRINCIPAL DE CONTACTO Y SMS) */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-xs font-bold text-stone-800">
                                            Teléfono Móvil <span className="text-[#800020]">*</span>
                                        </label>
                                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                            📲 SMS Inmediato
                                        </span>
                                    </div>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-400">
                                            <Phone className="h-4 w-4" />
                                        </span>
                                        <input
                                            required
                                            type="tel"
                                            value={telefono}
                                            onChange={(e) => setTelefono(e.target.value)}
                                            placeholder="Ej. 600 11 22 33"
                                            className="block w-full pl-10 pr-3 py-2.5 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#800020] focus:border-[#800020] shadow-2xs transition"
                                        />
                                    </div>
                                    <p className="text-[10px] text-stone-500">
                                        Recibirás aquí el SMS de confirmación y podrás contactar por WhatsApp.
                                    </p>
                                </div>

                                {/* CORREO ELECTRÓNICO (SOLICITADO CON RESPETO EN EL ALTA) */}
                                <div className="space-y-1.5 sm:col-span-2">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-xs font-bold text-stone-800">
                                            Correo Electrónico
                                        </label>
                                        <span className="text-[10px] font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                            🕊️ Solicitado con respeto
                                        </span>
                                    </div>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-400">
                                            <Mail className="h-4 w-4" />
                                        </span>
                                        <input
                                            type="email"
                                            value={bookingEmail}
                                            onChange={(e) => setBookingEmail(e.target.value)}
                                            placeholder="Ej. maria@ejemplo.com (para justificantes y confirmación)"
                                            className="block w-full pl-10 pr-3 py-2.5 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#800020] focus:border-[#800020] shadow-2xs transition"
                                        />
                                    </div>
                                    <div className="rounded-xl bg-[#FAF6EE] border border-[#E8DFC8] p-3 text-[11px] text-[#63512D] leading-relaxed flex items-start gap-2">
                                        <HeartHandshake className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                                        <span>
                                            <strong>Tratamiento respetuoso de tu email:</strong> Solicitamos tu correo con el máximo respeto a tu privacidad, exclusivamente para remitirte la confirmación formal de tu plaza, comprobantes de pago y avisos de interés de tu actividad. <strong>Nunca te enviaremos publicidad invasiva ni cederemos tus datos.</strong>
                                        </span>
                                    </div>
                                </div>

                                {/* SELECCIÓN DE ACTIVIDAD / SERVICIO */}
                                <div className="space-y-2 sm:col-span-2 pt-1">
                                    <label className="block text-xs font-bold text-stone-800">
                                        Servicio o Actividad a Reservar <span className="text-[#800020]">*</span>
                                    </label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {services.map((svc) => {
                                            const isSelected =
                                                tipoHabitacion === svc.id ||
                                                (tipoHabitacion === "clase_semanal" && svc.name.includes("1 clase semanal"));
                                            const priceDisplay = formatServicePrice(svc);

                                            return (
                                                <label
                                                    key={svc.id}
                                                    className={`flex flex-col justify-between p-3.5 rounded-xl border cursor-pointer transition ${
                                                        isSelected
                                                            ? "bg-[#800020]/5 border-[#800020] ring-1 ring-[#800020]"
                                                            : "bg-white border-stone-200 hover:border-stone-400"
                                                    }`}
                                                >
                                                    <div className="flex items-start gap-2.5">
                                                        <input
                                                            type="radio"
                                                            name="serviceType"
                                                            value={svc.id}
                                                            checked={isSelected}
                                                            onChange={() => setTipoHabitacion(svc.id)}
                                                            className="mt-0.5 text-[#800020] focus:ring-[#800020]"
                                                        />
                                                        <div>
                                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                                <span className="block text-xs font-bold text-stone-900 leading-snug">
                                                                    {svc.name}
                                                                </span>
                                                                {svc.firstClassFree && (
                                                                    <span className="text-[9px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded border border-amber-300">
                                                                        1ª Gratis
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <span className="block text-[11px] text-stone-500 mt-1 leading-snug line-clamp-2">
                                                                {svc.description || svc.scheduleText || "Actividad del centro"}
                                                            </span>
                                                            {svc.scheduleText && (
                                                                <span className="block text-[10px] text-[#0B4A72] font-semibold mt-1">
                                                                    🕒 {svc.scheduleText}
                                                                </span>
                                                            )}
                                                            {svc.maxCapacity && (
                                                                <span className="block text-[10px] text-stone-400 mt-0.5">
                                                                    👥 Aforo: {svc.maxCapacity} plazas
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <span className="block text-xs font-bold text-[#800020] mt-2.5 pl-6">
                                                        {priceDisplay}
                                                    </span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* NÚMERO DE PLAZAS */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold text-stone-800">
                                        Número de Plazas <span className="text-[#800020]">*</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-400">
                                            <Users className="h-4 w-4" />
                                        </span>
                                        <select
                                            value={numeroPlazas}
                                            onChange={(e) => setNumeroPlazas(parseInt(e.target.value, 10))}
                                            className="block w-full pl-10 pr-8 py-2.5 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#800020] focus:border-[#800020] shadow-2xs appearance-none"
                                        >
                                            {Array.from({ length: 8 }, (_, i) => i + 1).map((n) => (
                                                <option key={n} value={n}>
                                                    {n} plaza{n > 1 ? "s" : ""}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* TOTAL ESTIMADO */}
                                <div className="bg-[#800020]/5 border border-[#800020]/20 rounded-xl p-3.5 flex items-center justify-between">
                                    <div>
                                        <span className="block text-[10px] text-stone-500 uppercase tracking-wider font-bold">
                                            Total a abonar
                                        </span>
                                        <span className="text-[11px] text-stone-600">
                                            {numeroPlazas} plaza(s) x {unitPrice} €
                                        </span>
                                    </div>
                                    <div className="font-serif text-2xl font-bold text-[#800020]">
                                        {totalPrice} €
                                    </div>
                                </div>

                                {/* COMENTARIOS */}
                                <div className="space-y-1.5 sm:col-span-2">
                                    <label className="block text-xs font-bold text-stone-800">
                                        Comentarios o Preferencia Horaria (Opcional)
                                    </label>
                                    <textarea
                                        value={comentarios}
                                        onChange={(e) => setComentarios(e.target.value)}
                                        placeholder="Ej. Prefiero turno de mañana, o informar sobre alguna condición física relevante..."
                                        rows={2}
                                        className="block w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#800020] focus:border-[#800020] shadow-2xs transition"
                                    />
                                </div>
                            </div>

                            {/* CONSENTIMIENTOS */}
                            <div className="space-y-2.5 pt-2">
                                <label className="flex items-start gap-2.5 text-xs text-stone-600 cursor-pointer select-none">
                                    <input
                                        required
                                        type="checkbox"
                                        checked={condiciones}
                                        onChange={(e) => setCondiciones(e.target.checked)}
                                        className="mt-0.5 text-[#800020] focus:ring-[#800020] rounded border-stone-300"
                                    />
                                    <span>
                                        He leído y acepto las <strong className="text-stone-900">condiciones de inscripción</strong> y política de plaza del Centro de Yoga Salvadora Conesa. *
                                    </span>
                                </label>

                                <label className="flex items-start gap-2.5 text-xs text-stone-600 cursor-pointer select-none">
                                    <input
                                        required
                                        type="checkbox"
                                        checked={privacidad}
                                        onChange={(e) => setPrivacidad(e.target.checked)}
                                        className="mt-0.5 text-[#800020] focus:ring-[#800020] rounded border-stone-300"
                                    />
                                    <span>
                                        Doy mi consentimiento para el tratamiento de mis datos de contacto conforme al <strong className="text-stone-900">RGPD y LOPD-GDD</strong> para la gestión de la reserva y envío de SMS. *
                                    </span>
                                </label>
                            </div>

                            {/* BOTÓN SUBMIT */}
                            <button
                                type="submit"
                                disabled={formLoading}
                                className="w-full py-3.5 px-6 bg-[#800020] hover:bg-[#660019] text-white rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2.5 disabled:opacity-50"
                            >
                                {formLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" /> Registrando tu plaza...
                                    </>
                                ) : (
                                    <>
                                        <span>Confirmar Alta de Reserva (con SMS Inmediato)</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            )}

            {/* TAB 2: CONSULTA DE RESERVA EXISTENTE / PAGOS */}
            {activeTab === "consulta" && (
                <div className="space-y-6">
                    {session?.loggedIn && session?.reserva ? (
                        /* PANEL DE RESERVA EXISTENTE */
                        <div className="space-y-6">
                            <div className="border-b border-stone-200 pb-4">
                                <span className="block text-xs uppercase tracking-widest text-[#C5A059] font-bold mb-1">
                                    Tu Inscripción
                                </span>
                                <h3 className="font-serif text-2xl font-bold text-[#800020]">
                                    Hola, {session.reserva.nombre}
                                </h3>
                                <p className="text-xs text-stone-500 mt-0.5">
                                    Móvil: {session.reserva.telefono} | Correo: {session.reserva.email}
                                </p>
                            </div>

                            {/* STATS DE LA RESERVA */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="bg-white p-4 border border-stone-200 rounded-xl shadow-2xs">
                                    <span className="block text-[11px] text-stone-500 uppercase tracking-wider font-bold mb-1">
                                        Actividad
                                    </span>
                                    <span className="block text-sm font-bold text-[#800020]">
                                        {getServiceTitle(session.reserva.tipoHabitacion)}
                                    </span>
                                    <span className="block text-xs text-stone-500 mt-1">
                                        {session.reserva.numeroPlazas} plaza(s)
                                    </span>
                                </div>

                                <div className="bg-white p-4 border border-stone-200 rounded-xl shadow-2xs">
                                    <span className="block text-[11px] text-stone-500 uppercase tracking-wider font-bold mb-1">
                                        Abonado
                                    </span>
                                    <span className="block text-lg font-bold text-emerald-700">
                                        {(session.totalPaid ?? 0).toLocaleString("es-ES")} €
                                    </span>
                                    <span className="block text-[11px] text-stone-500 mt-1">
                                        de {session.reserva.importeTotal} €
                                    </span>
                                </div>

                                <div className="bg-white p-4 border border-stone-200 rounded-xl shadow-2xs">
                                    <span className="block text-[11px] text-stone-500 uppercase tracking-wider font-bold mb-1">
                                        Pendiente
                                    </span>
                                    <span className={`block text-lg font-bold ${remainingBalance > 0 ? "text-[#800020]" : "text-emerald-700"}`}>
                                        {remainingBalance.toLocaleString("es-ES")} €
                                    </span>
                                    <span className="block text-[11px] text-stone-500 mt-1">
                                        {remainingBalance === 0 ? "✓ Pagado en su totalidad" : "Abono pendiente"}
                                    </span>
                                </div>
                            </div>

                            {/* PAGO STRIPE SI QUEDA SALDO */}
                            {remainingBalance > 0 && (
                                <form onSubmit={handlePayInstallment} className="bg-white border border-[#C5A059]/30 rounded-xl p-5 space-y-4">
                                    <h4 className="font-serif text-base font-bold text-[#800020] flex items-center gap-2">
                                        <CreditCard className="w-4 h-4 text-[#C5A059]" />
                                        Abonar Pago con Tarjeta (Stripe)
                                    </h4>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <label className={`flex items-center p-3 rounded-xl border cursor-pointer ${paymentOption === "completo" ? "bg-[#800020]/5 border-[#800020]" : "bg-stone-50 border-stone-200"}`}>
                                            <input
                                                type="radio"
                                                name="paymentOption"
                                                value="completo"
                                                checked={paymentOption === "completo"}
                                                onChange={() => setPaymentOption("completo")}
                                                className="text-[#800020] focus:ring-[#800020]"
                                            />
                                            <span className="ml-2.5 text-xs font-bold text-stone-800">
                                                Liquidar Total ({remainingBalance} €)
                                            </span>
                                        </label>

                                        {remainingBalance > 50 && (
                                            <label className={`flex items-center p-3 rounded-xl border cursor-pointer ${paymentOption === "primer" ? "bg-[#800020]/5 border-[#800020]" : "bg-stone-50 border-stone-200"}`}>
                                                <input
                                                    type="radio"
                                                    name="paymentOption"
                                                    value="primer"
                                                    checked={paymentOption === "primer"}
                                                    onChange={() => setPaymentOption("primer")}
                                                    className="text-[#800020] focus:ring-[#800020]"
                                                />
                                                <span className="ml-2.5 text-xs font-bold text-stone-800">
                                                    Pago Parcial (50 €)
                                                </span>
                                            </label>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={checkoutLoading}
                                        className="w-full py-3 bg-[#800020] hover:bg-[#660019] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {checkoutLoading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" /> Conectando...
                                            </>
                                        ) : (
                                            <>
                                                <CreditCard className="w-4 h-4" /> Proceder al Pago Seguro
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    ) : (
                        /* ACCESO MEDIANTE CORREO / OTP */
                        <div className="space-y-4 max-w-md mx-auto py-2">
                            <div>
                                <span className="block text-xs uppercase tracking-widest text-[#C5A059] font-bold mb-1">
                                    Consulta de Reserva
                                </span>
                                <h3 className="font-serif text-xl font-bold text-[#800020]">
                                    Acceder a mis Reservas
                                </h3>
                                <p className="text-xs text-stone-600 mt-1">
                                    Introduce el correo electrónico que utilizaste en tu alta para recibir un código de acceso temporal.
                                </p>
                            </div>

                            {otpSuccessMsg && (
                                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium">
                                    {otpSuccessMsg}
                                </div>
                            )}

                            {!otpSent ? (
                                <form onSubmit={handleSendOtp} className="space-y-3">
                                    <div className="relative">
                                        <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                                        <input
                                            required
                                            type="email"
                                            value={authEmail}
                                            onChange={(e) => setAuthEmail(e.target.value)}
                                            placeholder="Tu correo electrónico de reserva"
                                            className="w-full pl-9 pr-3 py-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#800020]"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={otpLoading}
                                        className="w-full py-2.5 bg-[#800020] hover:bg-[#660019] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition disabled:opacity-50"
                                    >
                                        {otpLoading ? "Enviando Código..." : "Enviar Código de Acceso"}
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handleVerifyOtp} className="space-y-3">
                                    <div className="relative">
                                        <KeyRound className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                                        <input
                                            required
                                            type="text"
                                            maxLength={6}
                                            value={otpCode}
                                            onChange={(e) => setOtpCode(e.target.value)}
                                            placeholder="Código de 6 dígitos"
                                            className="w-full pl-9 pr-3 py-2.5 bg-white border border-stone-300 rounded-xl text-sm font-mono font-bold tracking-widest text-center text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#800020]"
                                        />
                                    </div>
                                    {debugCode && (
                                        <div className="text-[11px] text-center text-[#96680E]">
                                            Código demo: <strong>{debugCode}</strong>
                                        </div>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={otpLoading}
                                        className="w-full py-2.5 bg-[#800020] hover:bg-[#660019] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition disabled:opacity-50"
                                    >
                                        {otpLoading ? "Verificando..." : "Acceder a mi Reserva"}
                                    </button>
                                </form>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
