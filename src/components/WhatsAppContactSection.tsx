"use client";

import React from "react";
import { MessageCircle, UserPlus, Sparkles, ShieldCheck, CalendarCheck, Info, CheckCircle2 } from "lucide-react";

interface WhatsAppContactSectionProps {
  numeroWassap?: string;
}

export default function WhatsAppContactSection({
  numeroWassap,
}: WhatsAppContactSectionProps) {
  // Configured WhatsApp number from environment variable (default: 34 646 03 42 31)
  const rawNumber =
    numeroWassap ||
    process.env.NEXT_PUBLIC_NUMEROWASSAP ||
    process.env.NUMEROWASSAP ||
    "34 646 03 42 31";

  // Clean numeric string for wa.me URL
  const cleanNumber = rawNumber.replace(/\D/g, "");
  const formattedDisplay = rawNumber.trim().startsWith("+")
    ? rawNumber.trim()
    : `+${rawNumber.trim()}`;

  const wassapChatUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
    "Hola, deseo consultar información y disponibilidad de citas y actividades de la Escuela de Yoga Salvadora Conesa."
  )}`;

  const handleDownloadVCard = () => {
    const vcardData = `BEGIN:VCARD
VERSION:3.0
N:Yoga;Asistente Escuela;;;
FN:Asistente Escuela Yoga
ORG:Centro de Yoga y Bienestar Salvadora Conesa
TEL;TYPE=CELL,VOICE,WHATSAPP:${formattedDisplay}
EMAIL:salvadoraconesa@gmail.com
NOTE:Canal Oficial de WhatsApp de la Escuela de Yoga Salvadora Conesa (Fuenlabrada). Reservas, eventos y consultas 24/7.
URL:https://salvadora.jigretera.com
END:VCARD`;

    const blob = new Blob([vcardData], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Asistente_Escuela_Yoga.vcf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section
      id="atencion-whatsapp"
      className="py-20 sm:py-24 bg-gradient-to-b from-white via-[#FAF9F6] to-white border-t border-[#C5A059]/25 scroll-mt-20 font-sans"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado de Sección */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#25D366]/10 border border-[#25D366]/25 text-[#128C7E] text-[11px] font-bold uppercase tracking-wider mb-3">
            <MessageCircle className="w-4 h-4 text-[#25D366]" />
            <span>Canal Oficial de WhatsApp • Atención 24/7</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#800020] mb-3">
            Asistente Escuela Yoga por WhatsApp
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Puedes dar de alta en tus contactos el número de WhatsApp oficial de la Escuela de Yoga y solicitar cualquier tipo de cita, evento o consulta de forma ágil y directa.
          </p>
        </div>

        {/* Tarjeta de Contacto (Perfil WhatsApp Oficial) */}
        <div className="max-w-xl mx-auto bg-white border border-[#C5A059]/35 rounded-3xl p-6 sm:p-8 shadow-xl shadow-[#800020]/5 relative overflow-hidden text-center mb-10">
          <div className="absolute top-0 right-0 w-36 h-36 bg-[#25D366]/5 rounded-bl-full pointer-events-none" />

          {/* Avatar circular con badge WhatsApp */}
          <div className="relative inline-block mb-4">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto bg-stone-100 flex items-center justify-center">
              <img
                src="/imagenes/asistente_whatsapp.png"
                alt="Asistente Escuela Yoga"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "/imagenes/yoga/facebooksalvadora.jpeg";
                }}
              />
            </div>
            <div
              className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-md border-2 border-white"
              title="Canal WhatsApp Activo"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
            </div>
          </div>

          {/* Nombre y Número */}
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-1">
            Asistente Escuela Yoga
          </h3>
          <p className="text-lg sm:text-xl font-mono font-semibold text-[#128C7E] tracking-wide mb-6">
            {formattedDisplay}
          </p>

          {/* Botones de Acción */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6">
            <a
              href={wassapChatUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-[#25D366]/25 hover:scale-102 active:scale-98 transition duration-200 cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>Abrir WhatsApp y Chatear</span>
            </a>

            <button
              type="button"
              onClick={handleDownloadVCard}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-stone-50 hover:bg-stone-100 text-stone-800 border border-stone-200 font-bold text-xs uppercase tracking-wider rounded-xl transition duration-200 cursor-pointer"
              title="Descargar vCard para guardar en la agenda de tu teléfono"
            >
              <UserPlus className="w-4 h-4 text-[#800020]" />
              <span>Guardar Contacto (.vcf)</span>
            </button>
          </div>

          <p className="text-xs text-stone-500">
            Responde de inmediato 24 horas al día, los 7 días de la semana.
          </p>
        </div>

        {/* Qué puedes consultar y solicitar por WhatsApp */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-white/80 border border-[#C5A059]/25 rounded-2xl p-4.5 text-center shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#800020]/10 text-[#800020] flex items-center justify-center mx-auto mb-2.5">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-stone-900 mb-1">
              Reservar Plazas y Citas
            </h4>
            <p className="text-[11.5px] text-stone-600 leading-relaxed">
              Hatha Yoga, Terapia Gestalt, Baños y Pujas de Gong, Constelaciones y Retiros.
            </p>
          </div>

          <div className="bg-white/80 border border-[#C5A059]/25 rounded-2xl p-4.5 text-center shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#96680E]/10 text-[#96680E] flex items-center justify-center mx-auto mb-2.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-stone-900 mb-1">
              Vídeos, Flyers y Horarios
            </h4>
            <p className="text-[11.5px] text-stone-600 leading-relaxed">
              Solicita descargar los vídeos explicativos y flyers oficiales de cada actividad.
            </p>
          </div>

          <div className="bg-white/80 border border-[#C5A059]/25 rounded-2xl p-4.5 text-center shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 text-[#128C7E] flex items-center justify-center mx-auto mb-2.5">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-stone-900 mb-1">
              Atención Personalizada
            </h4>
            <p className="text-[11.5px] text-stone-600 leading-relaxed">
              Resuelve cualquier duda o solicita hablar directamente con el equipo humano.
            </p>
          </div>
        </div>

        {/* Bloque Legal Normativo de Primera Toma de Contacto y Consentimiento */}
        <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-5 sm:p-6 text-left">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#800020] shrink-0 mt-0.5" />
            <div className="space-y-1.5 text-xs text-stone-700 leading-relaxed">
              <h4 className="font-bold text-stone-900 text-xs sm:text-sm">
                Información sobre el consentimiento en la primera toma de contacto (RGPD y LOPDGDD)
              </h4>
              <p>
                La primera vez que un usuario accede por WhatsApp (cuando <code className="bg-stone-200 px-1 py-0.5 rounded text-[11px] font-mono">contactadowassap = &apos;N&apos;</code> o no consta consulta previa registrada), nuestro asistente le solicitará su <strong>consentimiento explícito previo</strong> conforme al <strong>Reglamento General de Protección de Datos (RGPD UE 2016/679, Artículos 6.1.a y 13)</strong> y a la <strong>Ley Orgánica 3/2018 (LOPDGDD)</strong> para tratar sus datos exclusivamente para la gestión de reservas, citas e información solicitada.
              </p>
              <p className="text-[11px] text-stone-500 pt-1 border-t border-stone-200/60">
                • <strong>Responsable:</strong> Salvadora Conesa Martínez (Centro de Yoga y Bienestar Salvadora Conesa). <br />
                • <strong>Finalidad:</strong> Atención de consultas, gestión de reservas y recordatorios de actividades. <br />
                • <strong>Derechos:</strong> En cualquier momento puedes revocar tu consentimiento, pedir la baja o solicitar restricción técnica escribiendo <code className="bg-stone-200 px-1 py-0.5 rounded text-[10.5px] font-mono">BAJA</code> por WhatsApp o desde la sección inferior de baja del servicio.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
