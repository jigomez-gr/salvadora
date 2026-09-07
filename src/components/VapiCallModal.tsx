"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  PhoneCall,
  X,
  Loader2,
  CheckCircle2,
  Phone,
  MessageCircle,
  Sparkles,
  ShieldCheck,
  User,
  Volume2,
  ArrowRight
} from "lucide-react";

export interface VapiCallOptions {
  inquiry?: string;
  name?: string;
  phone?: string;
}

const INQUIRY_OPTIONS = [
  { id: "yoga", label: "Clases de Yoga", inquiryText: "Consulta sobre Clases de Hatha Yoga" },
  { id: "gong", label: "Baño de Gong", inquiryText: "Información y fechas de los Baños de Gong" },
  { id: "puja", label: "La Puja de Gong", inquiryText: "Información sobre la Puja nocturna de Gong" },
  { id: "retiro", label: "Retiro de Ayuno", inquiryText: "Consulta sobre los Retiros de Ayuno y Bienestar" },
  { id: "general", label: "Consulta General", inquiryText: "Consulta general sobre servicios y horarios" },
];

export default function VapiCallModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [clientName, setClientName] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState(INQUIRY_OPTIONS[0].inquiryText);
  const [customInquiry, setCustomInquiry] = useState("");
  const [showCustomInquiry, setShowCustomInquiry] = useState(false);

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [countdown, setCountdown] = useState(6);
  const [sessionId, setSessionId] = useState("");

  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize session ID
  useEffect(() => {
    let sid = "";
    try {
      sid = localStorage.getItem("crm_widget_session_id") || "";
    } catch {}
    if (!sid) {
      sid = "web_vapi_" + Math.random().toString(36).substring(2, 9);
      try {
        localStorage.setItem("crm_widget_session_id", sid);
      } catch {}
    }
    setSessionId(sid);
  }, []);

  // Listen for open-vapi-call-modal event
  useEffect(() => {
    const handleOpenModal = (e: CustomEvent<VapiCallOptions>) => {
      const detail = e.detail || {};
      if (detail.phone) setPhoneNumber(detail.phone);
      if (detail.name) setClientName(detail.name);
      if (detail.inquiry) {
        setSelectedInquiry(detail.inquiry);
        // check if it matches any preset
        const matched = INQUIRY_OPTIONS.find((opt) => opt.inquiryText === detail.inquiry);
        if (!matched) {
          setShowCustomInquiry(true);
          setCustomInquiry(detail.inquiry);
        }
      }
      setStatus("idle");
      setErrorMessage("");
      setIsOpen(true);
    };

    window.addEventListener("open-vapi-call-modal" as any, handleOpenModal as EventListener);
    return () => {
      window.removeEventListener("open-vapi-call-modal" as any, handleOpenModal as EventListener);
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  }, []);

  // Countdown effect when success
  useEffect(() => {
    if (status === "success") {
      setCountdown(6);
      countdownTimerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
            setIsOpen(false);
            setStatus("idle");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    }
    return () => {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  }, [status]);

  const handleClose = () => {
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    setIsOpen(false);
    setStatus("idle");
    setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let cleanPhone = phoneNumber.replace(/[\s\-\(\)]/g, "").trim();
    if (!cleanPhone) {
      setErrorMessage("Por favor, introduce tu número de teléfono.");
      setStatus("error");
      return;
    }

    // Auto-formateo a prefijo internacional E.164 (+34 para números españoles estándar)
    if (/^[6789]\d{8}$/.test(cleanPhone)) {
      cleanPhone = `+34${cleanPhone}`;
    } else if (!cleanPhone.startsWith("+")) {
      cleanPhone = `+${cleanPhone}`;
    }

    const inquiryTextToSubmit = showCustomInquiry && customInquiry.trim()
      ? customInquiry.trim()
      : selectedInquiry;

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/vapi/call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: cleanPhone,
          name: clientName.trim() || undefined,
          agentKey: "booking",
          sessionId: sessionId || "web_guest",
          inquiry: inquiryTextToSubmit || "Consulta general desde la web",
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.success === false) {
        throw new Error(data.error || "No se pudo iniciar la llamada en este momento.");
      }

      setStatus("success");
    } catch (err: any) {
      console.error("Error en handleVapiCall:", err);
      setStatus("error");
      setErrorMessage(
        err.message ||
        "No hemos podido conectar con el servicio de llamadas automatizadas. Puedes contactar directamente con Salvadora."
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-lg bg-[#FAF9F6] border border-[#C5A059]/40 rounded-2xl shadow-2xl overflow-hidden font-sans animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Top Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#800020] via-[#C5A059] to-[#800020]" />

        {/* Modal Header */}
        <div className="px-5 pt-5 pb-4 sm:px-7 sm:pt-6 border-b border-[#C5A059]/20 bg-white">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#800020]/10 text-[#800020] text-[10.5px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-[#C5A059]" />
                <span>Voz Inteligente · Sin esperas</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-[26px] font-bold text-[#800020] leading-tight">
                Te Llamamos Ahora Mismo
              </h3>
              <p className="text-xs sm:text-sm text-[#1C1C1C]/75">
                Centro de Yoga y Bienestar Salvadora Conesa
              </p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-7 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* STATE: SUCCESS */}
          {status === "success" && (
            <div className="p-6 bg-white border border-emerald-200 rounded-xl text-center space-y-4 shadow-sm animate-in fade-in">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 border-2 border-emerald-400 flex items-center justify-center text-emerald-600 shadow-sm animate-bounce">
                <PhoneCall className="w-8 h-8" />
              </div>

              <div className="space-y-1.5">
                <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider rounded-full">
                  ¡Llamada en curso!
                </span>
                <h4 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                  Tu teléfono sonará en breves segundos
                </h4>
                <p className="text-xs sm:text-sm text-stone-600 max-w-sm mx-auto">
                  Hemos ordenado la llamada hacia tu número. Cuando descuelgues, el asistente te saludará y responderá a todas tus preguntas sobre nuestras actividades.
                </p>
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-2.5 text-left text-[11px] text-amber-900 flex items-center gap-2">
                  <span className="text-sm">📲</span>
                  <span><strong>Confirmación por SMS:</strong> Tras acordar los detalles de tu cita, recibirás un mensaje SMS al instante con la confirmación de tu reserva.</span>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <span>Esta ventana se cerrará en {countdown}s</span>
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-3 py-1 bg-[#800020] text-white font-bold rounded-md hover:bg-[#800020]/90 transition"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}

          {/* STATE: LOADING */}
          {status === "loading" && (
            <div className="p-8 bg-white border border-[#C5A059]/30 rounded-xl text-center space-y-4 shadow-sm animate-in fade-in">
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <span className="absolute inset-0 rounded-full border-4 border-[#800020]/20 animate-ping" />
                <div className="w-16 h-16 rounded-full bg-[#800020] text-white flex items-center justify-center shadow-lg">
                  <Volume2 className="w-8 h-8 animate-pulse" />
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="font-serif text-xl font-bold text-[#800020]">
                  Conectando con el Asistente de Voz...
                </h4>
                <p className="text-xs text-stone-600 max-w-xs mx-auto">
                  Registrando tu petición y activando la llamada saliente. Por favor, mantén tu móvil cerca.
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-[#96680E] font-medium pt-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#800020]" />
                <span>Contactando con VAPI & CRM...</span>
              </div>
            </div>
          )}

          {/* STATE: FORM (Idle or Error) */}
          {(status === "idle" || status === "error") && (
            <form onSubmit={handleSubmit} className="space-y-4.5">
              {/* Error Alert with Fallback */}
              {status === "error" && (
                <div className="p-4 bg-red-50/90 border border-red-200 rounded-xl text-xs space-y-2.5 text-red-800 animate-in fade-in">
                  <div className="flex items-start gap-2">
                    <span className="font-bold">⚠️ Atención:</span>
                    <p className="flex-1">{errorMessage}</p>
                  </div>

                  {/* Fallback Direct Call Buttons */}
                  <div className="pt-2 border-t border-red-200/80 flex flex-wrap gap-2 items-center">
                    <span className="text-[11px] font-semibold text-stone-700 w-full">
                      Puedes contactar directamente ahora:
                    </span>
                    <a
                      href="tel:+34695172625"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#800020] text-white rounded-lg font-bold hover:bg-[#800020]/90 transition"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Llamar al 695 172 625
                    </a>
                    <a
                      href="https://wa.me/34695172625?text=Hola%20Salvadora,%20me%20gustar%C3%ADa%20informaci%C3%B3n%20sobre%20las%20actividades%20del%20centro"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] text-white rounded-lg font-bold hover:bg-[#20ba5a] transition"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      Escribir por WhatsApp
                    </a>
                  </div>
                </div>
              )}

              {/* Inquiry Selection (Chips) */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#96680E]">
                  ¿Qué te gustaría consultar?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {INQUIRY_OPTIONS.map((opt) => {
                    const isSelected = selectedInquiry === opt.inquiryText && !showCustomInquiry;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setSelectedInquiry(opt.inquiryText);
                          setShowCustomInquiry(false);
                        }}
                        className={`px-3 py-2 text-xs font-semibold rounded-xl border text-left transition ${
                          isSelected
                            ? "bg-[#800020] text-white border-[#800020] shadow-sm shadow-[#800020]/20 font-bold"
                            : "bg-white text-stone-700 border-stone-200 hover:border-[#800020]/40 hover:bg-stone-50"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => setShowCustomInquiry(true)}
                    className={`px-3 py-2 text-xs font-semibold rounded-xl border text-left transition ${
                      showCustomInquiry
                        ? "bg-[#800020] text-white border-[#800020] shadow-sm font-bold"
                        : "bg-white text-stone-700 border-stone-200 hover:border-[#800020]/40 hover:bg-stone-50"
                    }`}
                  >
                    Otro motivo...
                  </button>
                </div>

                {showCustomInquiry && (
                  <input
                    type="text"
                    value={customInquiry}
                    onChange={(e) => setCustomInquiry(e.target.value)}
                    placeholder="Ej. Consultar horarios para embarazadas, bono regalo..."
                    className="w-full mt-1.5 px-3 py-2 text-xs bg-white border border-[#800020]/30 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#800020] text-stone-800"
                  />
                )}
              </div>

              {/* Phone Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-800">
                  Tu número de teléfono móvil <span className="text-[#800020]">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 flex items-center gap-1.5 text-xs font-bold text-stone-500 select-none border-r border-stone-200 pr-2.5">
                    <span className="text-base leading-none">🇪🇸</span>
                    <span>+34</span>
                  </span>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="600 11 22 33"
                    className="w-full pl-24 pr-4 py-3 bg-white border border-stone-300 rounded-xl text-sm font-medium text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#800020] focus:ring-1 focus:ring-[#800020] shadow-xs transition"
                  />
                </div>
                <p className="text-[11px] text-stone-500">
                  Si resides fuera de España, añade tu código internacional (ej. +44, +1, +33).
                </p>
              </div>

              {/* Name Input (Optional) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-stone-800">
                    Tu nombre
                  </label>
                  <span className="text-[11px] text-stone-400 font-medium">Opcional</span>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Ej. María García"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-300 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#800020] focus:ring-1 focus:ring-[#800020] shadow-xs transition"
                  />
                </div>
                <p className="text-[11px] text-[#96680E]">
                  La voz del asistente te saludará cordialmente por tu nombre al descolgar.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-col sm:flex-row items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 rounded-xl transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!phoneNumber.trim()}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#800020] hover:bg-[#800020]/95 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md shadow-[#800020]/20 hover:scale-101 active:scale-98 transition duration-150"
                >
                  <PhoneCall className="w-4 h-4 text-[#C5A059]" />
                  <span>Llamar Ahora Gratis</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer info & Legal */}
        <div className="px-5 py-3 bg-stone-100/80 border-t border-stone-200/80 text-[10.5px] text-stone-500 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2E5A44]" />
            Llamada saliente sin coste para ti · RGPD UE
          </span>
          <a
            href="tel:+34695172625"
            className="hover:text-[#800020] font-semibold underline"
          >
            Directo: 695 172 625
          </a>
        </div>
      </div>
    </div>
  );
}

// Global dispatcher helper so ANY button in the site can open this modal easily
export function triggerVapiCall(options?: VapiCallOptions) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("open-vapi-call-modal", {
        detail: options || {},
      })
    );
  }
}
