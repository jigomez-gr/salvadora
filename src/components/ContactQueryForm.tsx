"use client";

import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MessageSquare,
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { CrmCategory, CrmService, FALLBACK_CRM_SERVICES } from "@/lib/crmServices";

interface ContactQueryFormProps {
  initialServices?: CrmService[];
  initialCategories?: CrmCategory[];
}

export default function ContactQueryForm({
  initialServices,
}: ContactQueryFormProps = {}) {
  const services =
    initialServices && initialServices.length > 0
      ? initialServices
      : FALLBACK_CRM_SERVICES;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [requestType, setRequestType] = useState<"consulta" | "reserva">("consulta");
  const [selectedService, setSelectedService] = useState("Consulta General");
  const [message, setMessage] = useState("");
  const [rgpdAccepted, setRgpdAccepted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Por favor, introduce tu nombre.");
      return;
    }
    if (!email.trim()) {
      setError("Por favor, introduce tu correo electrónico.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Por favor, introduce un correo electrónico válido.");
      return;
    }
    if (!message.trim()) {
      setError(
        requestType === "reserva"
          ? "Por favor, indícanos detalles sobre tu reserva (horarios preferidos, etc.)."
          : "Por favor, escribe el motivo de tu consulta o duda."
      );
      return;
    }
    if (!rgpdAccepted) {
      setError("Debes aceptar la política de privacidad para enviar la solicitud.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          serviceName: selectedService,
          message: message.trim(),
          requestType,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "No se pudo enviar la solicitud.");
      }

      setSuccessMessage(
        data.message ||
          (requestType === "reserva"
            ? "¡Gracias! Hemos recibido tu solicitud de reserva de plaza y nos pondremos en contacto contigo para confirmarte los detalles."
            : "¡Gracias por contactar! Hemos recibido tu consulta y nos pondremos en contacto contigo lo antes posible.")
      );
    } catch (err: any) {
      setError(
        err.message ||
          "Ocurrió un error al enviar tu mensaje. Por favor, inténtalo de nuevo o contáctanos por WhatsApp."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setPhone("");
    setRequestType("consulta");
    setSelectedService("Consulta General");
    setMessage("");
    setRgpdAccepted(false);
    setError(null);
    setSuccessMessage(null);
  };

  return (
    <div className="bg-white rounded-3xl border border-[#C5A059]/30 p-6 sm:p-10 shadow-xl shadow-[#800020]/5 relative overflow-hidden text-left">
      {/* Elemento decorativo */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#C5A059]/15 via-[#800020]/5 to-transparent rounded-bl-full pointer-events-none" />

      {successMessage ? (
        <div className="py-8 sm:py-12 text-center space-y-5 max-w-lg mx-auto">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-200 shadow-md">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <div className="space-y-2">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#800020]">
              {requestType === "reserva" ? "Solicitud de Reserva Registrada" : "Consulta Enviada con Éxito"}
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              {successMessage}
            </p>
          </div>
          <div className="bg-[#FAF9F6] border border-[#C5A059]/20 rounded-2xl p-4 text-xs text-stone-600 text-left space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-[#800020]">
              <Clock className="w-4 h-4 text-[#C5A059]" />
              <span>Tiempo estimado de respuesta:</span>
            </div>
            <p>
              Solemos responder en un plazo de <strong>24 a 48 horas laborables</strong>. También te hemos enviado un acuse de recibo a <strong>{email}</strong>.
            </p>
          </div>
          <div className="pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl border border-[#800020]/30 text-[#800020] text-xs font-bold uppercase tracking-wider hover:bg-[#800020]/5 transition"
            >
              Enviar otra petición
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="border-b border-[#C5A059]/20 pb-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#800020]/10 text-[#800020] text-[11px] font-bold uppercase tracking-wider mb-2">
              <Mail className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Canal de Correo Electrónico Oficial</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#800020]">
              Consultas y Reservas por Email
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Envíanos tu consulta sobre horarios y actividades o solicita tu reserva de plaza por escrito. Te responderemos personalmente por correo o teléfono.
            </p>

            {/* Selector de Tipo de Petición */}
            <div className="mt-4 flex rounded-xl bg-[#FAF9F6] p-1 border border-[#C5A059]/30 max-w-md">
              <button
                type="button"
                onClick={() => setRequestType("consulta")}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition ${
                  requestType === "consulta"
                    ? "bg-[#800020] text-white shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                Duda / Consulta
              </button>
              <button
                type="button"
                onClick={() => setRequestType("reserva")}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition ${
                  requestType === "reserva"
                    ? "bg-[#800020] text-white shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                Solicitar Reserva de Plaza
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-xs text-red-800 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">Aviso:</span>
                {error}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Nombre */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                Nombre y Apellidos <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. María García López"
                  className="w-full pl-10 pr-4 py-3 bg-[#FAF9F6] border border-[#C5A059]/30 rounded-xl text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#800020]/30 focus:border-[#800020] transition"
                />
              </div>
            </div>

            {/* Correo Electrónico */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                Correo Electrónico <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className="w-full pl-10 pr-4 py-3 bg-[#FAF9F6] border border-[#C5A059]/30 rounded-xl text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#800020]/30 focus:border-[#800020] transition"
                />
              </div>
            </div>

            {/* Teléfono Móvil */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Teléfono Móvil
                </label>
                <span className="text-[11px] text-stone-400 font-medium">Opcional</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ej. 600 11 22 33"
                  className="w-full pl-10 pr-4 py-3 bg-[#FAF9F6] border border-[#C5A059]/30 rounded-xl text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#800020]/30 focus:border-[#800020] transition"
                />
              </div>
              <p className="text-[11px] text-stone-500">
                Indícalo si prefieres recibir respuesta también por llamada o WhatsApp.
              </p>
            </div>

            {/* Actividad o Servicio */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                Actividad o Consulta sobre
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#FAF9F6] border border-[#C5A059]/30 rounded-xl text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#800020]/30 focus:border-[#800020] transition cursor-pointer"
                >
                  <option value="Consulta General">Consulta General / Duda</option>
                  {services.map((s) => (
                    <option key={s.id || s.name} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Mensaje */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
              {requestType === "reserva" ? "Detalles de tu Reserva" : "Tu Consulta o Mensaje"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute top-3.5 left-3.5 pointer-events-none text-stone-400">
                <MessageSquare className="w-4 h-4" />
              </div>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  requestType === "reserva"
                    ? "Indica tus preferencias (días, horarios disponibles, si es tu primera clase de prueba gratuita o cualquier detalle relevante para tu plaza)..."
                    : "Escribe aquí tu consulta con todo detalle (horarios que buscas, si tienes alguna lesión o molestia previa, dudas sobre materiales o cualquier aspecto que quieras comentarnos)..."
                }
                className="w-full pl-10 pr-4 py-3 bg-[#FAF9F6] border border-[#C5A059]/30 rounded-xl text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#800020]/30 focus:border-[#800020] transition resize-y min-h-[110px]"
              />
            </div>
          </div>

          {/* RGPD y Privacidad */}
          <div className="pt-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={rgpdAccepted}
                onChange={(e) => setRgpdAccepted(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-stone-300 text-[#800020] focus:ring-[#800020] cursor-pointer"
              />
              <span className="text-xs text-stone-600 leading-relaxed">
                He leído y acepto la{" "}
                <a
                  href="/politica-de-privacidad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#800020] font-semibold underline hover:text-[#800020]/80"
                >
                  política de privacidad
                </a>{" "}
                y el tratamiento responsable de mis datos personales conforme al RGPD exclusivamente para la resolución de mi petición.
              </span>
            </label>
          </div>

          {/* Botón de Envío */}
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-[11px] text-stone-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Tus datos no se cederán a terceros ni se usarán para spam.</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#800020] hover:bg-[#800020]/95 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md shadow-[#800020]/20 hover:scale-101 active:scale-98 transition duration-200 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#C5A059]" />
                  <span>
                    {requestType === "reserva"
                      ? "Enviando solicitud de reserva…"
                      : "Enviando consulta…"}
                  </span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-[#C5A059]" />
                  <span>
                    {requestType === "reserva"
                      ? "Solicitar Reserva por Email"
                      : "Enviar Consulta por Email"}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
