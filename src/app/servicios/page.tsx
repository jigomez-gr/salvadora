"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  Calendar,
  Clock,
  MessageSquare,
  X,
  CheckCircle2,
  Phone,
  User,
  Mail,
  ArrowUpRight,
  ShieldCheck,
  Users,
} from "lucide-react";
import { SimuladorDiagnosticoModal } from "@/components/SimuladorDiagnosticoModal";
import { triggerCrmChat } from "@/components/ChatBubbleWidget";
import { VapiVoiceBookingButton } from "@/components/VapiVoiceBookingButton";
import {
  CrmService,
  FALLBACK_CRM_SERVICES,
  formatServicePrice,
  formatDuration,
  categorizeCrmServices,
} from "@/lib/crmServices";

export default function DemoLandingPage() {
  const showAnalizaIA =
    process.env.NEXT_PUBLIC_ENABLE_ANALIZAIA !== "N" &&
    process.env.NEXT_PUBLIC_ENABLE_ANALIZAIA !== "n" &&
    process.env.NEXT_PUBLIC_SHOW_ANALIZAIA !== "N" &&
    process.env.NEXT_PUBLIC_SHOW_ANALIZAIA !== "n";

  const [simuladorOpen, setSimuladorOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [isCrmChatOpen, setIsCrmChatOpen] = useState(false);

  // Dynamic services from CRM
  const [services, setServices] = useState<CrmService[]>(FALLBACK_CRM_SERVICES);
  const [whatsappPhone, setWhatsappPhone] = useState("+34695172625");
  const [crmLoading, setCrmLoading] = useState(true);

  useEffect(() => {
    async function loadServices() {
      try {
        const res = await fetch("/api/crm/services");
        if (res.ok) {
          const data = await res.json();
          if (data && data.services && Array.isArray(data.services) && data.services.length > 0) {
            setServices(data.services);
            if (data.whatsappNumber) {
              setWhatsappPhone(data.whatsappNumber);
            }
          }
        }
      } catch (err) {
        console.warn("Could not load dynamic services, using fallback catalog:", err);
      } finally {
        setCrmLoading(false);
      }
    }
    loadServices();
  }, []);

  useEffect(() => {
    const handleCrmVisibility = (e: CustomEvent<{ isOpen: boolean }>) => {
      setIsCrmChatOpen(!!e?.detail?.isOpen);
    };
    window.addEventListener("crm-chat-visibility-change" as any, handleCrmVisibility as EventListener);
    return () => window.removeEventListener("crm-chat-visibility-change" as any, handleCrmVisibility as EventListener);
  }, []);

  // WhatsApp Handoff Form State
  const [waModalOpen, setWaModalOpen] = useState(false);
  const [waName, setWaName] = useState("");
  const [waPhone, setWaPhone] = useState("");
  const [waEmail, setWaEmail] = useState("");
  const [waLoading, setWaLoading] = useState(false);
  const [waSuccess, setWaSuccess] = useState(false);

  // Dynamically categorized services
  const { destacadas, regularesYoga, talleresEventos, saludTerapeutica } = categorizeCrmServices(services);

  const handleServiceSelect = (svc: CrmService, preferredShift?: string) => {
    setSelectedService(svc.name);
    const msg = preferredShift
      ? `Hola, me gustaría reservar para ${svc.name} en turno de ${preferredShift}. ¿Qué disponibilidad tenéis?`
      : `Hola, me gustaría información y disponibilidad para ${svc.name}.`;
    triggerCrmChat(msg, true);
  };

  const handleWhatsAppHandoff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waPhone.trim()) return;

    setWaLoading(true);
    const CRM_API_URL = process.env.NEXT_PUBLIC_CRM_API_URL || "https://crm-salvadoraconesa.jigretera.com";
    const currentSession = (typeof window !== "undefined" && localStorage.getItem("crm_widget_session_id")) || "web_guest";
    try {
      const res = await fetch(`${CRM_API_URL}/api/widget/handoff-whatsapp/booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: currentSession,
          name: waName.trim() || "Visitante Web",
          phone: waPhone.trim(),
          email: waEmail.trim() || undefined,
          serviceName: selectedService || undefined,
          note: "Handoff solicitado desde la landing web para continuar por WhatsApp.",
        }),
      });
      const data = await res.json();
      setWaLoading(false);
      setWaSuccess(true);

      setTimeout(() => {
        if (data.whatsappUrl) {
          window.open(data.whatsappUrl, "_blank");
        } else {
          const defaultMsg = encodeURIComponent(
            `Hola, me gustaría información sobre ${selectedService || "las actividades del centro"}.`
          );
          window.open(`https://wa.me/${whatsappPhone.replace(/[^0-9]/g, "")}?text=${defaultMsg}`, "_blank");
        }
        setWaModalOpen(false);
        setWaSuccess(false);
      }, 1200);
    } catch {
      setWaLoading(false);
      alert("No se pudo conectar con el servidor. Inténtalo de nuevo.");
    }
  };

  // Helper icons and category labels
  const getCategoryMeta = (svc: CrmService) => {
    const lower = svc.name.toLowerCase();
    if (lower.includes("bienestar")) return { icon: "🌿", label: "Longevidad & Biohacking" };
    if (lower.includes("iaidō") || lower.includes("iaido")) return { icon: "⚔️", label: "Arte de la Katana" };
    if (lower.includes("hatha")) return { icon: "🧘", label: "Yoga & Salud Postural" };
    if (lower.includes("meditaci")) return { icon: "✨", label: "Conciencia & Silencio" };
    if (lower.includes("gestalt")) return { icon: "🌱", label: "Psicoterapia Gestalt" };
    if (lower.includes("gong") && lower.includes("puja")) return { icon: "🌙", label: "Inmersión Nocturna Anual" };
    if (lower.includes("gong")) return { icon: "🔔", label: "Sonoterapia Mensual" };
    if (lower.includes("constelaci")) return { icon: "🕊️", label: "Taller Vivencial" };
    if (lower.includes("ayuno")) return { icon: "🏕️", label: "Retiro Residencial" };
    if (lower.includes("mujeres")) return { icon: "🌸", label: "Círculo Femenino" };
    if (lower.includes("médica") || lower.includes("clinico")) return { icon: "🩺", label: "Consulta Médica" };
    if (lower.includes("fisioterapia")) return { icon: "💆", label: "Rehabilitación Postural" };
    return { icon: "🌟", label: svc.serviceType === "recurring" ? "Actividad Regular" : "Evento Especial" };
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#1E1E1E] font-sans selection:bg-[#800020] selection:text-white relative">
      {/* Top Banner CRM Notification */}
      <div className="bg-[#800020] text-white px-3 sm:px-4 py-2 text-xs shadow-md sticky top-0 z-40 border-b border-amber-500/20">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="flex h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium">
              <strong>Catálogo Sincronizado en Vivo con CRM Salvadora</strong> · Traspaso directo a WhatsApp
            </span>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1 bg-white/15 hover:bg-white/25 px-3 py-1 rounded text-xs font-bold transition whitespace-nowrap"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Volver a Inicio
          </Link>
        </div>
      </div>

      {/* Notice Header - Parque Granada & Centro */}
      <div className="bg-[#0B4A72] text-white px-3 sm:px-4 py-2 text-xs text-center font-bold tracking-wide flex items-center justify-center gap-3 sm:gap-4 flex-wrap shadow-inner">
        <span>📍 CLUB SOCIAL PARQUE GRANADA & CENTRO SALVADORA CONESA</span>
        <span className="bg-emerald-500 text-white px-2.5 py-0.5 rounded text-[11px] font-extrabold uppercase tracking-wide">
          💳 Pagos en el Centro · Sincronizado en tiempo real
        </span>
        <button
          onClick={() => setSimuladorOpen(true)}
          className="inline-flex items-center gap-1 bg-amber-400 hover:bg-amber-300 text-stone-950 px-3 py-0.5 rounded-full text-xs font-bold transition shadow-xs cursor-pointer"
        >
          🔬 Simulador IA
        </button>
        <button
          onClick={() => setWaModalOpen(true)}
          className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 px-3 py-0.5 rounded-full text-white font-semibold transition shadow-xs cursor-pointer"
        >
          📱 Continuar por WhatsApp
        </button>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-stone-200 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <span className="text-[10px] tracking-widest text-[#0B4A72] uppercase font-extrabold">
              CENTRO DE YOGA & BIENESTAR INTEGRAL
            </span>
            <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#800020] tracking-wide uppercase">
              Salvadora Conesa
            </h1>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <a
              href="https://www.instagram.com/escuelayogasalvadoraconesa/"
              target="_blank"
              rel="noopener noreferrer"
              title="Instagram @escuelayogasalvadoraconesa"
              className="p-2 rounded-lg border border-pink-500/30 text-pink-600 hover:bg-pink-50 transition shadow-2xs flex items-center gap-1 text-xs font-semibold"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              <span className="hidden md:inline">Instagram</span>
            </a>

            <a
              href="https://www.facebook.com/share/1EhbRPtem8/"
              target="_blank"
              rel="noopener noreferrer"
              title="Facebook Escuela Yoga Salvadora Conesa"
              className="p-2 rounded-lg border border-blue-500/30 text-blue-600 hover:bg-blue-50 transition shadow-2xs flex items-center gap-1 text-xs font-semibold"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span className="hidden md:inline">Facebook</span>
            </a>

            {showAnalizaIA && (
              <button
                onClick={() => setSimuladorOpen(true)}
                className="bg-amber-400 hover:bg-amber-500 text-stone-950 px-3 py-2 rounded-lg text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" /> Simulador IA
              </button>
            )}
            <button
              onClick={() => setWaModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" /> WhatsApp Alta Rápida
            </button>
            <button
              onClick={() => triggerCrmChat("Hola, me gustaría consultar los servicios y actividades del Centro de Yoga Salvadora Conesa.", false)}
              className="bg-[#800020] text-white px-3.5 py-2 rounded-lg text-xs font-bold hover:bg-[#800020]/90 transition shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" /> Abrir Asistente
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 pt-8 pb-6">
        <div className="bg-linear-to-r from-[#800020]/10 via-amber-500/10 to-[#0B4A72]/10 rounded-3xl p-6 sm:p-10 border border-stone-300 shadow-sm text-center sm:text-left space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider border border-emerald-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Yoga, Longevidad, Bienestar y Artes Tradicionales
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-[#800020] leading-tight">
            Descubre tus Actividades de Salud, Conciencia y Armonía
          </h2>
          <p className="text-stone-700 text-sm sm:text-base max-w-3xl leading-relaxed">
            Catálogo completo actualizado en vivo desde nuestra base de datos. Consulta las clases regulares de <strong>Hatha Yoga Terapéutico</strong>, el programa <strong>Bienestar Experience</strong>, las sesiones de <strong>Iaidō</strong> en Parque Granada, meditaciones, sonoterapia y retiros.
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
            <button
              onClick={() => triggerCrmChat("Hola, me gustaría consultar los servicios y actividades del Centro de Yoga Salvadora Conesa.", false)}
              className="bg-[#800020] hover:bg-[#800020]/90 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Calendar className="w-4 h-4" /> Consultar Disponibilidad en Vivo
            </button>
            <VapiVoiceBookingButton
              buttonText="📞 Reservar por Teléfono (Llamada IA + SMS)"
              serviceHint="Consulta y reserva de clases de Yoga y actividades"
              className="!py-2.5 !px-5 !rounded-xl !text-xs !bg-[#800020] hover:!bg-[#660019]"
            />
            <button
              onClick={() => setWaModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Phone className="w-4 h-4" /> Traspasar Consulta a WhatsApp
            </button>
          </div>
        </div>
      </section>

      {/* ─── SECCIÓN 1: OTRAS ACTIVIDADES ADICIONALES (BIENESTAR EXPERIENCE & IAIDŌ) ─── */}
      {destacadas.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-8">
          <div className="mb-6 pb-3 border-b-2 border-[#0B4A72]">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#0B4A72] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> ACTIVIDADES DESTACADAS · CLUB SOCIAL PARQUE GRANADA & CENTRO
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
                  Longevidad (Bienestar Experience) & Iaidō (Esgrima Japonesa)
                </h3>
              </div>
              <span className="text-xs text-stone-600 font-medium">
                {crmLoading ? "Sincronizando..." : `${destacadas.length} actividades disponibles`}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {destacadas.map((act) => {
              const meta = getCategoryMeta(act);
              const isBienestar = act.name.toLowerCase().includes("bienestar experience");
              const priceDisplay = formatServicePrice(act);
              const durationDisplay = formatDuration(act.durationMinutes);

              return (
                <div
                  key={act.id}
                  className="bg-white rounded-3xl border-2 border-stone-200 p-6 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:border-[#800020] relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-amber-100/50 via-transparent to-transparent rounded-bl-full pointer-events-none" />

                  <div>
                    {/* Header Badges */}
                    <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-stone-100 text-stone-800 flex items-center gap-1.5 border border-stone-200">
                        <span>{meta.icon}</span> {meta.label}
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {act.firstClassFree && (
                          <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase">
                            Prueba Gratis
                          </span>
                        )}
                        {act.maxCapacity && (
                          <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200 flex items-center gap-1">
                            <Users className="w-3 h-3" /> Aforo: {act.maxCapacity} {act.maxCapacity === 1 ? "plaza" : "plazas"}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Title & Emblem for Bienestar Experience */}
                    {isBienestar ? (
                      <div className="space-y-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-full bg-stone-900 text-white flex items-center justify-center p-2 border-2 border-amber-500 shadow-md text-center">
                            <div className="leading-tight">
                              <span className="block text-[8px] font-bold tracking-widest text-amber-300 uppercase">BIEN</span>
                              <span className="block text-[10px] font-extrabold tracking-wider uppercase">ESTAR</span>
                              <span className="block text-[8px] font-bold tracking-widest text-stone-300 uppercase">EXP</span>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 group-hover:text-[#800020] transition-colors leading-snug">
                              {act.name}
                            </h4>
                            <p className="text-xs font-semibold text-emerald-700 mt-0.5">
                              {priceDisplay} • {act.allowedModalities?.map(m => m === "in_person" ? "Presencial" : m === "virtual" ? "Online" : m).join(" · ") || "Presencial y Online"}
                            </p>
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-line">
                          {act.description}
                        </p>

                        <div className="pt-2">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0B4A72] block mb-1.5">
                            🔬 Disciplinas y Áreas Incluidas:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {[
                              "Biohacking",
                              "Longevidad",
                              "Rejuvenecimiento",
                              "Ciclos Circadianos",
                              "Psicología Positiva",
                              "Terapia de Sonido",
                              "Nutrición Celular",
                              "Meditación",
                            ].map((t) => (
                              <span
                                key={t}
                                className="inline-block bg-amber-50 text-amber-900 border border-amber-200/80 px-2 py-0.5 rounded-md text-[10px] font-medium"
                              >
                                • {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 group-hover:text-[#800020] transition-colors">
                            {act.name}
                          </h4>
                          <span className="font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg text-xs border border-emerald-200 shrink-0 ml-2">
                            {priceDisplay}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mb-4 whitespace-pre-line">
                          {act.description}
                        </p>
                      </div>
                    )}

                    {/* Horarios dinámicos desde CRM */}
                    {(act.scheduleText || act.eventDatesText) && (
                      <div className="bg-[#FAF9F6] rounded-2xl p-4 border border-stone-200/90 space-y-2 mb-4">
                        <div className="text-xs font-bold text-[#800020] uppercase tracking-wider flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-[#0B4A72]" /> Horarios y Turnos Oficiales:
                        </div>
                        <div className="text-xs text-stone-800">
                          {act.scheduleText || act.eventDatesText}
                        </div>
                        <div className="text-[11px] text-stone-600 italic pt-1 border-t border-stone-200 flex items-center justify-between">
                          <span>Duración: {durationDisplay}</span>
                          {act.maxCapacity && <span>Aforo máximo: {act.maxCapacity} plazas</span>}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-stone-100 space-y-2.5">
                    <button
                      onClick={() => handleServiceSelect(act)}
                      className="w-full py-3 px-4 bg-[#800020] hover:bg-[#800020]/90 text-white rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Calendar className="w-4 h-4" /> Reservar / Consultar Disponibilidad
                    </button>
                    <div className="flex items-center justify-between text-xs pt-1">
                      {act.whatsappBookingUrl ? (
                        <a
                          href={act.whatsappBookingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1"
                        >
                          <Phone className="w-3.5 h-3.5" /> Pedir por WhatsApp
                        </a>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedService(act.name);
                            setWaModalOpen(true);
                          }}
                          className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Phone className="w-3.5 h-3.5" /> Pedir por WhatsApp
                        </button>
                      )}
                      <span className="text-stone-500 font-medium">Pago en centro</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ─── SECCIÓN 2: ESCUELA DE YOGA & TERAPIAS REGULARES ─── */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6 pb-3 border-b-2 border-stone-300">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#800020]">
            ESCUELA SALVADORA CONESA · CLASES REGULARES
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            Hatha Yoga Terapéutico, Meditaciones y Terapias
          </h3>
        </div>

        {/* Banner Informativo Políticas de Yoga */}
        <div className="mb-6 bg-amber-50/95 border-2 border-amber-200/90 rounded-2xl p-5 text-xs text-stone-800 shadow-sm space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧘</span>
            <h4 className="font-bold text-amber-950 text-sm sm:text-base">
              Condiciones de Matriculación y Flexibilidad para Alumnos:
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1 text-stone-700 leading-relaxed">
            <div className="space-y-2">
              <p>
                • 🎁 <strong>1ª Clase de prueba de REGALO:</strong> Tu primera clase en las disciplinas marcadas es gratuita (0 €), sin compromiso ni permanencia.
              </p>
              <p>
                • 📅 <strong>Cuotas de Alumno con Turno Fijo:</strong> 1 clase semanal (25 €/mes) o 2 clases semanales (42 €/mes) con plaza reservada fija garantizada.
              </p>
              <p>
                • 🎟️ <strong>Clases sueltas / esporádicas:</strong> 10 € por clase para quien no desee matricularse mensualmente.
              </p>
            </div>
            <div className="space-y-2">
              <p>
                • 🔄 <strong>Política de recuperaciones (hasta 3 meses / 90 días):</strong> Si avisas con antelación, puedes recuperar tus clases en cualquier otro turno disponible.
              </p>
              <p>
                • ✨ <strong>Meditaciones Guiadas:</strong> Gratuitas para los alumnos matriculados en Yoga. No alumnos: 15 €/mes (o 3 € sesión suelta).
              </p>
              <p>
                • 📩 <strong>Confirmación Inmediata:</strong> Avisos por SMS y correo electrónico al confirmar cada plaza o reserva.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...regularesYoga, ...saludTerapeutica].map((svc) => {
            const meta = getCategoryMeta(svc);
            const priceDisplay = formatServicePrice(svc);
            const durationDisplay = formatDuration(svc.durationMinutes);

            return (
              <div
                key={svc.id}
                className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between hover:border-[#800020]/40"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 flex items-center gap-1">
                      <span>{meta.icon}</span> {meta.label}
                    </span>
                    <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {priceDisplay}
                    </span>
                  </div>

                  {/* Badges especiales */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {svc.firstClassFree && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 inline-block">
                        ⭐ 1ª Clase de Regalo (0€)
                      </span>
                    )}
                    {svc.freeForYogaStudents && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-300 inline-block">
                        ✨ ¡Gratis Alumnos Yoga!
                      </span>
                    )}
                    {svc.maxCapacity && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200 inline-flex items-center gap-1">
                        <Users className="w-2.5 h-2.5" /> Aforo: {svc.maxCapacity} plazas
                      </span>
                    )}
                  </div>

                  <h4 className="font-serif text-base font-bold text-stone-900 mb-1.5 leading-snug">
                    {svc.name}
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed mb-3 whitespace-pre-line">
                    {svc.description}
                  </p>

                  {svc.scheduleText && (
                    <div className="bg-[#FAF9F6] rounded-xl p-3 border border-stone-200 text-xs space-y-1 mb-3">
                      <div className="font-bold text-[#800020] text-[11px] uppercase flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Horarios Oficiales:
                      </div>
                      <div className="text-[11px] text-stone-800">
                        {svc.scheduleText}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-stone-100 space-y-2">
                  <button
                    onClick={() => handleServiceSelect(svc)}
                    className="w-full py-2 px-3 bg-[#800020] hover:bg-[#800020]/90 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" /> Reservar Plaza
                  </button>
                  <div className="flex items-center justify-between text-[11px] text-stone-500">
                    <span>{durationDisplay}</span>
                    {svc.whatsappBookingUrl ? (
                      <a
                        href={svc.whatsappBookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-700 font-bold hover:underline"
                      >
                        WhatsApp
                      </a>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedService(svc.name);
                          setWaModalOpen(true);
                        }}
                        className="text-emerald-700 font-bold hover:underline cursor-pointer"
                      >
                        WhatsApp
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── SECCIÓN 3: TALLERES, EVENTOS Y RETIROS ESPECIALES ─── */}
      {talleresEventos.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-8">
          <div className="mb-6 pb-3 border-b-2 border-purple-300">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-purple-900">
              ENCUENTROS, SONIDO Y RETIROS
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Baños de Gong, Pujas, Constelaciones y Retiros
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {talleresEventos.map((ev) => {
              const meta = getCategoryMeta(ev);
              const priceDisplay = formatServicePrice(ev);
              const durationDisplay = formatDuration(ev.durationMinutes);

              return (
                <div
                  key={ev.id}
                  className="bg-white rounded-3xl border border-purple-200/80 p-5 shadow-xs hover:shadow-lg transition flex flex-col justify-between hover:border-purple-600"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-2.5">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-900 border border-purple-200 flex items-center gap-1">
                        <span>{meta.icon}</span> {meta.label}
                      </span>
                      <span className="text-xs font-extrabold text-stone-900 bg-amber-100 px-2.5 py-0.5 rounded-md">
                        {priceDisplay}
                      </span>
                    </div>

                    {/* Fecha de evento o aforo */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {ev.eventDatesText && (
                        <div className="inline-block bg-purple-100 text-purple-950 font-bold text-[11px] px-2.5 py-0.5 rounded-md">
                          🗓️ {ev.eventDatesText}
                        </div>
                      )}
                      {ev.maxCapacity && (
                        <div className="inline-flex items-center gap-1 bg-stone-100 text-stone-700 text-[11px] px-2.5 py-0.5 rounded-md border border-stone-200">
                          <Users className="w-3 h-3" /> Aforo: {ev.maxCapacity} plazas
                        </div>
                      )}
                    </div>

                    <h4 className="font-serif text-lg font-bold text-stone-900 mb-1.5 leading-snug">
                      {ev.name}
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed mb-3 whitespace-pre-line">
                      {ev.description}
                    </p>

                    {ev.scheduleText && (
                      <div className="bg-stone-50 rounded-xl p-2.5 border border-stone-200 text-[11px] text-stone-700 mb-3">
                        <span className="font-bold text-[#800020]">Horario:</span> {ev.scheduleText}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-stone-100 space-y-2">
                    <button
                      onClick={() => handleServiceSelect(ev)}
                      className="w-full py-2.5 px-4 bg-purple-900 hover:bg-purple-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5" /> Solicitar Reserva
                    </button>
                    <div className="flex items-center justify-between text-[11px] text-stone-500">
                      <span>Duración: {durationDisplay}</span>
                      {ev.whatsappBookingUrl ? (
                        <a
                          href={ev.whatsappBookingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-700 font-bold hover:underline"
                        >
                          WhatsApp
                        </a>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedService(ev.name);
                            setWaModalOpen(true);
                          }}
                          className="text-emerald-700 font-bold hover:underline cursor-pointer"
                        >
                          WhatsApp
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 text-xs py-10 border-t border-stone-800 space-y-5">
        <div className="max-w-6xl mx-auto px-4 text-center space-y-2">
          <p className="font-semibold text-stone-300">
            CENTRO DE YOGA & BIENESTAR SALVADORA CONESA · FUENLABRADA
          </p>
          <p>Actividades en Club Social Parque Granada y Sede Principal.</p>
          <p className="text-stone-400 text-[11px]">
            Consultas y reservas por WhatsApp: <strong>695 172 625</strong> · Pagos directos en el centro y registro en CRM.
          </p>
        </div>

        <div className="max-w-6xl mx-auto px-4 pt-4 border-t border-stone-800 text-center space-y-3">
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-stone-400">
            <a
              href="/politica-de-privacidad"
              className="hover:underline hover:text-amber-400 transition"
            >
              Política de Privacidad
            </a>
            <span className="text-stone-600 select-none">•</span>
            <a
              href="/politica-de-cookies"
              className="hover:underline hover:text-amber-400 transition"
            >
              Política de Cookies
            </a>
            <span className="text-stone-600 select-none">•</span>
            <a
              href="/ley-de-proteccion-de-datos"
              className="hover:underline hover:text-amber-400 transition"
            >
              Ley de Protección de Datos (RGPD)
            </a>
          </div>

          <div className="max-w-2xl mx-auto px-3 py-2 rounded-lg bg-stone-800/60 border border-stone-700/60 text-[11px] text-stone-400 leading-relaxed">
            🛡️ <strong>Cumplimiento RGPD (UE 2016/679) y LOPDGDD 3/2018</strong>: Tratamiento seguro y confidencial de datos personales y uso responsable de Asistente Virtual con Inteligencia Artificial.
          </div>

          <p className="text-[11px] text-stone-500">
            © 2026 Centro de Yoga Fuenlabrada Salvadora Conesa. Todos los derechos reservados.
          </p>
        </div>
      </footer>

      {/* ─── MODAL WHATSAPP HANDOFF (RESPONSIVE & TOUCH FRIENDLY) ─── */}
      {waModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setWaModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-stone-200 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setWaModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-emerald-600 mb-2">
              <span className="p-2 rounded-xl bg-emerald-100">
                <Phone className="w-5 h-5" />
              </span>
              <span className="text-xs font-extrabold uppercase tracking-wider">
                Traspaso directo a WhatsApp
              </span>
            </div>

            <h3 className="font-serif text-xl font-bold text-stone-900 mb-1.5">
              Continuar Consulta por WhatsApp
            </h3>
            <p className="text-xs text-stone-600 mb-4 leading-relaxed">
              Introduce tu nombre y teléfono móvil. <strong>Te registraremos automáticamente en el CRM</strong> y abriremos WhatsApp con tu consulta.
            </p>

            {selectedService && (
              <div className="mb-4 p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs flex items-center justify-between">
                <span className="text-stone-500">Actividad:</span>
                <span className="font-bold text-[#800020]">{selectedService}</span>
              </div>
            )}

            {waSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2 text-emerald-800 animate-in zoom-in-95">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="text-xs font-bold">¡Registro completado en el CRM!</p>
                <p className="text-[11px] text-emerald-700">Abriendo WhatsApp...</p>
              </div>
            ) : (
              <form onSubmit={handleWhatsAppHandoff} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Tu Nombre y Apellidos
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={waName}
                      onChange={(e) => setWaName(e.target.value)}
                      placeholder="Ej: Carmen Moreno"
                      className="w-full bg-stone-50 border border-stone-300 focus:border-emerald-600 focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-xs text-stone-800 outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Número de WhatsApp
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      required
                      value={waPhone}
                      onChange={(e) => setWaPhone(e.target.value)}
                      placeholder="Ej: 611 22 33 44"
                      className="w-full bg-stone-50 border border-stone-300 focus:border-emerald-600 focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-xs text-stone-800 outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span>Correo Electrónico</span>
                    <span className="text-amber-800 bg-amber-50 text-[10px] font-medium px-2 py-0.5 rounded-full border border-amber-200">
                      🕊️ Solicitado con respeto
                    </span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      value={waEmail}
                      onChange={(e) => setWaEmail(e.target.value)}
                      placeholder="Ej: carmen@ejemplo.com (para justificantes)"
                      className="w-full bg-stone-50 border border-stone-300 focus:border-emerald-600 focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-xs text-stone-800 outline-none transition"
                    />
                  </div>
                  <p className="text-[10px] text-stone-500 mt-1">
                    Solo lo utilizaremos con respeto para enviarte la confirmación formal de tu actividad.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={waLoading}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {waLoading ? (
                      "Registrando en CRM..."
                    ) : (
                      <>
                        <span>Abrir WhatsApp y Enviar Consulta</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                <div className="text-[10px] text-stone-400 text-center flex items-center justify-center gap-1 pt-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Tus datos quedan registrados de forma segura y privada.</span>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ─── FLOATING ANALIZAIA SIMULATOR BUBBLE ─── */}
      {showAnalizaIA && !isCrmChatOpen && (
        <button
          onClick={() => setSimuladorOpen(true)}
          aria-label="Abrir Simulador de Diagnóstico IA"
          title="Diagnóstico Visual con IA"
          className="fixed bottom-24 right-4 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-linear-to-tr from-sky-600 to-indigo-600 text-white shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 z-40 flex items-center justify-center border-2 border-white/60 group cursor-pointer"
        >
          <div className="relative flex items-center justify-center">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300 animate-pulse" />
          </div>
        </button>
      )}

      {/* ─── SIMULADOR DE DIAGNÓSTICO POR IA (MODAL) ─── */}
      {showAnalizaIA && (
        <SimuladorDiagnosticoModal
          open={simuladorOpen}
          onClose={() => setSimuladorOpen(false)}
        />
      )}
    </div>
  );
}
