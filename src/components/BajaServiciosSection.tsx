"use client";

import React, { useState } from "react";
import { ShieldAlert, Mail, Phone, KeyRound, CheckCircle2, ArrowRight, RefreshCw, AlertCircle } from "lucide-react";

export default function BajaServiciosSection() {
  const [step, setStep] = useState<"request" | "verify" | "success">("request");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setInfoMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    if (!cleanEmail || !cleanPhone) {
      setErrorMsg("Por favor, introduce tu correo electrónico y tu número de teléfono móvil.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setErrorMsg("El formato del correo electrónico no es válido.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/contacto/baja", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "request_otp",
          email: cleanEmail,
          phone: cleanPhone,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "No se pudo enviar el código de verificación.");
      }

      setInfoMsg(
        data.message ||
          "Código de verificación de 6 dígitos enviado por SMS y/o correo. Válido por 7 minutos."
      );
      setStep("verify");
    } catch (err: any) {
      setErrorMsg(err.message || "Error al solicitar el código de verificación.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanCode = code.trim();
    if (!cleanCode || cleanCode.length < 4) {
      setErrorMsg("Por favor, introduce el código de verificación recibido.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/contacto/baja", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "confirm_otp",
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          code: cleanCode,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Código de verificación incorrecto o expirado.");
      }

      setStep("success");
    } catch (err: any) {
      setErrorMsg(err.message || "Error al verificar el código.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep("request");
    setEmail("");
    setPhone("");
    setCode("");
    setErrorMsg(null);
    setInfoMsg(null);
  };

  return (
    <section
      id="baja-servicios"
      className="py-20 sm:py-24 bg-[#FAF9F6] border-t border-[#C5A059]/25 scroll-mt-20 font-sans"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#800020]/10 border border-[#800020]/25 text-[#800020] text-[11px] font-bold uppercase tracking-wider mb-3">
            <ShieldAlert className="w-4 h-4 text-[#800020]" />
            <span>Derecho de Supresión • Restricción Técnica</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#800020] mb-3">
            Baja de Servicios de la Escuela de Yoga / Centro
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto leading-relaxed">
            Si deseas darte de baja de los servicios, recordatorios y comunicaciones de la Escuela de Yoga, introduce tu email y teléfono móvil. Te enviaremos un código de verificación seguro para confirmar la baja por restricción técnica.
          </p>
        </div>

        {/* Tarjeta del Formulario */}
        <div className="bg-white border border-[#C5A059]/35 rounded-3xl p-6 sm:p-10 shadow-xl shadow-[#800020]/5 relative overflow-hidden">
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {infoMsg && step === "verify" && (
            <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-2.5">
              <KeyRound className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <span>{infoMsg}</span>
            </div>
          )}

          {step === "request" && (
            <form onSubmit={handleRequestOtp} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Correo Electrónico
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
                    placeholder="tu-email@ejemplo.com"
                    className="w-full pl-10 pr-4 py-3 bg-[#FAF9F6] border border-stone-300 focus:border-[#800020] focus:ring-1 focus:ring-[#800020] rounded-xl text-sm outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Teléfono Móvil
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="646 00 00 00 ó +34 646 00 00 00"
                    className="w-full pl-10 pr-4 py-3 bg-[#FAF9F6] border border-stone-300 focus:border-[#800020] focus:ring-1 focus:ring-[#800020] rounded-xl text-sm outline-none transition"
                  />
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  Enviaremos un código de 6 dígitos a este número y/o correo para validar la titularidad.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 bg-[#800020] hover:bg-[#800020]/95 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition duration-200 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Enviando código...</span>
                    </>
                  ) : (
                    <>
                      <span>Enviar Código de Verificación</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {step === "verify" && (
            <form onSubmit={handleConfirmOtp} className="space-y-5">
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 space-y-1">
                <p>
                  <strong>Email:</strong> {email}
                </p>
                <p>
                  <strong>Teléfono Móvil:</strong> {phone}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Código de Verificación (6 dígitos)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    autoFocus
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="123456"
                    className="w-full pl-10 pr-4 py-3 bg-[#FAF9F6] border border-stone-300 focus:border-[#800020] focus:ring-1 focus:ring-[#800020] rounded-xl text-lg tracking-widest font-mono text-center outline-none transition"
                  />
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  Introduce el código de 6 dígitos que has recibido. Válido durante 7 minutos.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={loading || code.length < 4}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 bg-[#800020] hover:bg-[#800020]/95 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition duration-200 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Comprobando código...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirmar Baja por Restricción Técnica</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="py-3 px-4 border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-bold uppercase tracking-wider rounded-xl transition"
                >
                  Volver a empezar
                </button>
              </div>
            </form>
          )}

          {step === "success" && (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-stone-900">
                Baja Tramitada con Éxito
              </h3>
              <div className="max-w-md mx-auto text-xs sm:text-sm text-stone-600 leading-relaxed space-y-2 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-4.5">
                <p className="font-semibold text-emerald-900">
                  Tu solicitud de baja por restricción técnica ha sido confirmada y aplicada.
                </p>
                <p>
                  El teléfono <strong>{phone}</strong> y el correo <strong>{email}</strong> han quedado bloqueados por restricción técnica en nuestros sistemas. No volverás a recibir mensajes, avisos ni comunicaciones de nuestros servicios.
                </p>
                <p className="text-[11px] text-stone-500 pt-1 border-t border-emerald-200/50">
                  Conforme a la normativa, si en el futuro deseas apelar o solicitar la reactivación voluntaria de tu atención, puedes enviar un correo a <a href="mailto:jigomezjub@gmail.com" className="underline font-semibold">jigomezjub@gmail.com</a> o escribirnos <code className="bg-emerald-100 px-1 py-0.5 rounded font-mono font-bold">ALTA</code> por WhatsApp.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center justify-center px-6 py-2.5 border border-stone-300 rounded-xl text-xs font-bold uppercase tracking-wider text-stone-700 hover:bg-stone-50 transition"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
