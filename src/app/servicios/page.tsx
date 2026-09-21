"use client";

import { useState, useEffect, useMemo, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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
  PhoneCall,
  User,
  Mail,
  ArrowUpRight,
  ShieldCheck,
  Users,
  Film,
  Image as ImageIcon,
  Maximize2,
} from "lucide-react";
import { SimuladorDiagnosticoModal } from "@/components/SimuladorDiagnosticoModal";
import { triggerCrmChat } from "@/components/ChatBubbleWidget";
import { VapiVoiceBookingButton } from "@/components/VapiVoiceBookingButton";
import { triggerVapiCall } from "@/components/VapiCallModal";
import { isPorWassapEnabled, isPorVapiEnabled } from "@/lib/featureFlags";
import {
  CrmCategory,
  CrmService,
  FALLBACK_CRM_CATEGORIES,
  FALLBACK_CRM_SERVICES,
  formatServicePrice,
  formatDuration,
  categorizeCrmServices,
  serviceMatchesCategory,
} from "@/lib/crmServices";

function ServiceMediaPreview({ act }: { act: CrmService }) {
  const rawVideo = act.videoParticularUrl || act.videoParticularPath;
  const videoSrc = rawVideo
    ? (rawVideo.startsWith("/") || rawVideo.startsWith("http")
        ? rawVideo
        : `/videos/${rawVideo.replace(/\\/g, "/").split("/").pop()}`)
    : null;

  const rawFlyer =
    act.flyerParticularUrl ||
    act.flyerParticularPath ||
    act.flyerUrl ||
    act.flyerPath;
  const flyerSrc = rawFlyer
    ? (rawFlyer.startsWith("/") || rawFlyer.startsWith("http")
        ? rawFlyer
        : `/${rawFlyer.replace(/\\/g, "/").replace(/^public\//, "")}`)
    : null;

  const hasBoth = Boolean(videoSrc && flyerSrc);

  // Inicialmente sacar siempre el vídeo (si existe) y su poster para identificarlo
  const [activeTab, setActiveTab] = useState<"video" | "flyer">(videoSrc ? "video" : "flyer");
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [zoomMedia, setZoomMedia] = useState<"video" | "flyer">(videoSrc ? "video" : "flyer");

  const openZoom = (type: "video" | "flyer") => {
    setZoomMedia(type);
    setIsZoomOpen(true);
  };

  if (!videoSrc && !flyerSrc) return null;

  return (
    <div className="mb-4">
      {hasBoth && (
        <div className="flex items-center justify-between gap-2 mb-2 px-0.5">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            Contenido
          </span>
          <div className="inline-flex rounded-lg bg-stone-100 p-0.5 border border-stone-200 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("video")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                activeTab === "video"
                  ? "bg-white text-[#800020] shadow-xs border border-stone-200/80"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Ver Vídeo</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("flyer")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                activeTab === "flyer"
                  ? "bg-white text-[#0B4A72] shadow-xs border border-stone-200/80"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Ver Flyer</span>
            </button>
          </div>
        </div>
      )}

      {/* Visor Multimedia Principal: Vídeo por defecto si existe con su poster, o Flyer */}
      {activeTab === "video" && videoSrc ? (
        <div className="relative group overflow-hidden rounded-2xl border border-stone-200 bg-stone-950 aspect-video w-full shadow-xs flex items-center justify-center">
          <video
            src={videoSrc}
            poster={flyerSrc || undefined}
            controls
            playsInline
            preload="metadata"
            className="w-full h-full object-contain max-h-full"
          />
          <button
            type="button"
            onClick={() => openZoom("video")}
            className="absolute bottom-2.5 right-2.5 bg-black/75 hover:bg-black/95 text-white text-[11px] font-medium px-2.5 py-1 rounded-lg backdrop-blur-xs flex items-center gap-1 shadow-sm transition opacity-90 group-hover:opacity-100 cursor-pointer z-10"
            title="Ampliar vídeo"
          >
            <Maximize2 className="w-3 h-3" /> Ampliar vídeo
          </button>
        </div>
      ) : flyerSrc ? (
        <div className="relative group overflow-hidden rounded-2xl border border-stone-200 bg-stone-100 aspect-video w-full shadow-xs flex items-center justify-center">
          <img
            src={flyerSrc}
            alt={act.name}
            className="w-full h-full object-contain cursor-pointer transition-transform duration-300 group-hover:scale-102"
            onClick={() => openZoom("flyer")}
            onError={(e) => {
              (e.target as HTMLElement).style.display = "none";
            }}
          />
          <button
            type="button"
            onClick={() => openZoom("flyer")}
            className="absolute bottom-2.5 right-2.5 bg-black/75 hover:bg-black/95 text-white text-[11px] font-medium px-2.5 py-1 rounded-lg backdrop-blur-xs flex items-center gap-1 shadow-sm transition opacity-90 group-hover:opacity-100 cursor-pointer z-10"
            title="Ampliar flyer"
          >
            <Maximize2 className="w-3 h-3" /> Ampliar flyer
          </button>
        </div>
      ) : null}

      {/* Modal Zoom / Lightbox adaptable a cualquier tamaño de pantalla o ventana */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-2 sm:p-4 md:p-6 backdrop-blur-sm transition-opacity"
          onClick={() => setIsZoomOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl max-h-[92vh] bg-stone-950 rounded-2xl overflow-hidden shadow-2xl border border-stone-800 p-2.5 sm:p-4 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between pb-2 px-1 text-white border-b border-stone-800 mb-2 gap-2">
              <span className="text-xs sm:text-sm font-semibold text-stone-200 truncate">
                {act.name} {zoomMedia === "video" ? "— Vídeo" : "— Flyer Informativo"}
              </span>

              <div className="flex items-center gap-2 shrink-0">
                {hasBoth && (
                  <div className="inline-flex rounded-lg bg-stone-900 p-0.5 border border-stone-700 text-xs">
                    <button
                      type="button"
                      onClick={() => setZoomMedia("video")}
                      className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition ${
                        zoomMedia === "video"
                          ? "bg-[#800020] text-white shadow-xs"
                          : "text-stone-300 hover:text-white"
                      }`}
                    >
                      Vídeo
                    </button>
                    <button
                      type="button"
                      onClick={() => setZoomMedia("flyer")}
                      className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition ${
                        zoomMedia === "flyer"
                          ? "bg-[#0B4A72] text-white shadow-xs"
                          : "text-stone-300 hover:text-white"
                      }`}
                    >
                      Flyer
                    </button>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setIsZoomOpen(false)}
                  className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition cursor-pointer"
                  title="Cerrar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="w-full flex-1 min-h-0 flex items-center justify-center overflow-hidden">
              {zoomMedia === "video" && videoSrc ? (
                <div className="w-full h-full max-h-[80vh] flex items-center justify-center">
                  <video
                    src={videoSrc}
                    poster={flyerSrc || undefined}
                    controls
                    autoPlay
                    playsInline
                    className="w-full max-h-[78vh] object-contain rounded-xl bg-black shadow-2xl"
                  />
                </div>
              ) : flyerSrc ? (
                <div className="overflow-auto max-h-[78vh] flex items-center justify-center w-full">
                  <img
                    src={flyerSrc}
                    alt={act.name}
                    className="max-h-[76vh] w-auto max-w-full object-contain rounded-xl shadow-md"
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ServiciosContent() {
  const showAnalizaIA =
    process.env.NEXT_PUBLIC_ENABLE_ANALIZAIA !== "N" &&
    process.env.NEXT_PUBLIC_ENABLE_ANALIZAIA !== "n" &&
    process.env.NEXT_PUBLIC_SHOW_ANALIZAIA !== "N" &&
    process.env.NEXT_PUBLIC_SHOW_ANALIZAIA !== "n";

  const showPorWassap = isPorWassapEnabled();
  const showPorVapi = isPorVapiEnabled();

  const searchParams = useSearchParams();
  const paramCategory = searchParams.get("categoria") || searchParams.get("category") || "all";
  const paramType = searchParams.get("tipo") || searchParams.get("type") || "all";

  const [simuladorOpen, setSimuladorOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [isCrmChatOpen, setIsCrmChatOpen] = useState(false);

  // Categories & Dynamic services from CRM
  const [categories, setCategories] = useState<CrmCategory[]>(FALLBACK_CRM_CATEGORIES);
  const [selectedCategoryCode, setSelectedCategoryCode] = useState<string>(paramCategory);
  const [selectedType, setSelectedType] = useState<string>(paramType);
  const [services, setServices] = useState<CrmService[]>(FALLBACK_CRM_SERVICES);
  const [whatsappPhone, setWhatsappPhone] = useState("+34695172625");
  const [crmLoading, setCrmLoading] = useState(true);

  useEffect(() => {
    const cat = searchParams.get("categoria") || searchParams.get("category");
    const typ = searchParams.get("tipo") || searchParams.get("type");
    if (cat) setSelectedCategoryCode(cat);
    if (typ) setSelectedType(typ);
  }, [searchParams]);

  const updateFilters = (newCat: string, newType: string) => {
    setSelectedCategoryCode(newCat);
    setSelectedType(newType);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (newCat !== "all") {
        url.searchParams.set("categoria", newCat);
      } else {
        url.searchParams.delete("categoria");
        url.searchParams.delete("category");
      }
      if (newType !== "all") {
        url.searchParams.set("tipo", newType);
      } else {
        url.searchParams.delete("tipo");
        url.searchParams.delete("type");
      }
      window.history.replaceState(null, "", url.toString());
    }
  };

  useEffect(() => {
    async function loadServices() {
      try {
        const res = await fetch("/api/crm/services");
        if (res.ok) {
          const data = await res.json();
          if (data && data.services && Array.isArray(data.services) && data.services.length > 0) {
            setServices([...data.services].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)));
            if (data.categories && Array.isArray(data.categories) && data.categories.length > 0) {
              setCategories([...data.categories].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)));
            }
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

  // Helper to identify special activities
  const isSpecialService = useCallback((s: CrmService) => {
    const lower = (s.name || "").toLowerCase();
    return (
      s.serviceType === "special" ||
      s.categoryCode === "longevidad_artes" ||
      s.categoryCode === "actividades_especiales" ||
      lower.includes("bienestar experience") ||
      lower.includes("longevidad")
    );
  }, []);

  const serviceMatchesType = useCallback(
    (s: CrmService, type: string) => {
      if (type === "all") return true;
      const isSpecial = isSpecialService(s);
      if (type === "special" || type === "especiales") {
        return isSpecial;
      }
      if (type === "recurring") {
        return s.serviceType === "recurring" && !isSpecial;
      }
      if (type === "event") {
        return s.serviceType === "event" && !isSpecial;
      }
      return s.serviceType === type;
    },
    [isSpecialService]
  );

  // Sorted categories by displayOrder
  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  }, [categories]);

  // Total counts by type
  const recurringCount = useMemo(
    () => services.filter((s) => serviceMatchesType(s, "recurring")).length,
    [services, serviceMatchesType]
  );
  const eventCount = useMemo(
    () => services.filter((s) => serviceMatchesType(s, "event")).length,
    [services, serviceMatchesType]
  );
  const specialCount = useMemo(
    () => services.filter((s) => serviceMatchesType(s, "special")).length,
    [services, serviceMatchesType]
  );

  // Smart selection handlers that prevent 0-match traps
  const handleSelectCategory = (catCode: string) => {
    if (catCode === "all") {
      updateFilters("all", selectedType);
      return;
    }
    const catObj = sortedCategories.find((c) => c.code === catCode || c.id === catCode);
    const catServices = services.filter((s) =>
      serviceMatchesCategory(s, catObj || { id: catCode, code: catCode, name: "", displayOrder: 0 })
    );
    // If current selectedType would produce 0 results in this category, relax type to "all"!
    const hasMatchesWithCurrentType =
      selectedType === "all" || catServices.some((s) => serviceMatchesType(s, selectedType));
    const nextType = hasMatchesWithCurrentType ? selectedType : "all";
    updateFilters(catCode, nextType);
  };

  const handleSelectType = (typeVal: string) => {
    if (typeVal === "all") {
      updateFilters(selectedCategoryCode, "all");
      return;
    }
    // If a category is selected, check if it has any services of this type
    if (selectedCategoryCode !== "all") {
      const catObj = sortedCategories.find(
        (c) => c.code === selectedCategoryCode || c.id === selectedCategoryCode
      );
      const catServices = services.filter((s) =>
        serviceMatchesCategory(s, catObj || { id: selectedCategoryCode, code: selectedCategoryCode, name: "", displayOrder: 0 })
      );
      const hasMatchesInCat = catServices.some((s) => serviceMatchesType(s, typeVal));
      if (!hasMatchesInCat) {
        // If current category does not have services of this type, relax category to "all"
        updateFilters("all", typeVal);
        return;
      }
    }
    updateFilters(selectedCategoryCode, typeVal);
  };

  // Auto-relax incompatible combinations loaded from URL (e.g. ?tipo=special&categoria=yoga_meditacion)
  useEffect(() => {
    if (selectedCategoryCode !== "all" && selectedType !== "all" && services.length > 0) {
      const catObj = sortedCategories.find(
        (c) => c.code === selectedCategoryCode || c.id === selectedCategoryCode
      );
      const catServices = services.filter((s) =>
        serviceMatchesCategory(s, catObj || { id: selectedCategoryCode, code: selectedCategoryCode, name: "", displayOrder: 0 })
      );
      const hasMatches = catServices.some((s) => serviceMatchesType(s, selectedType));
      if (!hasMatches) {
        // Automatically relax the type filter so the selected category's activities are displayed
        updateFilters(selectedCategoryCode, "all");
      }
    }
  }, [services, selectedCategoryCode, selectedType, sortedCategories, serviceMatchesType]);

  // Filter services by selectedType
  const filterByType = (list: CrmService[]) =>
    list.filter((s) => serviceMatchesType(s, selectedType));

  // Dynamic sections by category according to category.displayOrder
  const groupedSections = useMemo(() => {
    const sections: { category: CrmCategory; services: CrmService[] }[] = [];
    for (const cat of sortedCategories) {
      if (selectedCategoryCode !== "all" && selectedCategoryCode !== cat.code && selectedCategoryCode !== cat.id) {
        continue;
      }
      const catSvcs = filterByType(
        services.filter((s) => serviceMatchesCategory(s, cat))
      ).sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

      if (catSvcs.length > 0) {
        sections.push({ category: cat, services: catSvcs });
      }
    }
    return sections;
  }, [services, sortedCategories, selectedCategoryCode, selectedType, serviceMatchesType]);

  const uncategorizedServices = useMemo(() => {
    if (selectedCategoryCode !== "all") return [];
    return filterByType(
      services.filter((s) => !sortedCategories.some((cat) => serviceMatchesCategory(s, cat)))
    ).sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  }, [services, sortedCategories, selectedCategoryCode, selectedType, serviceMatchesType]);

  const totalFilteredCount =
    groupedSections.reduce((acc, g) => acc + g.services.length, 0) + uncategorizedServices.length;

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
    if (lower.includes("hatha")) return { icon: "🧘", label: "Yoga & Salud Postural" };
    if (lower.includes("meditaci")) return { icon: "✨", label: "Conciencia & Silencio" };
    if (lower.includes("gestalt")) return { icon: "🌱", label: "Psicoterapia Gestalt" };
    if (lower.includes("gong") && lower.includes("puja")) return { icon: "🌙", label: "Inmersión Nocturna Anual" };
    if (lower.includes("gong")) return { icon: "🔔", label: "Sonoterapia Mensual" };
    if (lower.includes("constelaci")) return { icon: "🕊️", label: "Taller Vivencial" };
    if (lower.includes("ayuno")) return { icon: "🏕️", label: "Retiro Residencial" };
    if (lower.includes("mujeres")) return { icon: "🌸", label: "Círculo Femenino" };
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
              <strong>Catálogo Sincronizado en Vivo con CRM Salvadora</strong>
              {showPorWassap && " · Traspaso directo a WhatsApp"}
              {showPorVapi && !showPorWassap && " · Asistente Telefónico IA"}
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
        {showPorWassap && (
          <button
            onClick={() => setWaModalOpen(true)}
            className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 px-3 py-0.5 rounded-full text-white font-semibold transition shadow-xs cursor-pointer"
          >
            📱 Continuar por WhatsApp
          </button>
        )}
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
            {showPorWassap && (
              <button
                onClick={() => setWaModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" /> WhatsApp Alta Rápida
              </button>
            )}
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
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Yoga, Longevidad, Sonoterapia y Bienestar Integral
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-[#800020] leading-tight">
            Descubre tus Actividades de Salud, Conciencia y Armonía
          </h2>
          <p className="text-stone-700 text-sm sm:text-base max-w-3xl leading-relaxed">
            Catálogo completo actualizado en vivo desde nuestra base de datos. Consulta las clases regulares de <strong>Hatha Yoga Terapéutico</strong>, el programa <strong>Bienestar Experience</strong>, meditaciones, sonoterapia y retiros, y <strong>Actividades Especiales</strong>.
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
            <button
              onClick={() => triggerCrmChat("Hola, me gustaría consultar los servicios y actividades del Centro de Yoga Salvadora Conesa.", false)}
              className="bg-[#800020] hover:bg-[#800020]/90 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Calendar className="w-4 h-4" /> Consultar Disponibilidad en Vivo
            </button>
            {showPorVapi && (
              <VapiVoiceBookingButton
                buttonText="📞 Reservar por Teléfono (Llamada IA + SMS)"
                serviceHint="Consulta y reserva de clases de Yoga y actividades"
                className="!py-2.5 !px-5 !rounded-xl !text-xs !bg-[#800020] hover:!bg-[#660019]"
              />
            )}
            {showPorWassap && (
              <button
                onClick={() => setWaModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <Phone className="w-4 h-4" /> Traspasar Consulta a WhatsApp
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ─── BARRA DE FILTRADO POR CATEGORÍA Y TIPO ─── */}
      <section className="max-w-6xl mx-auto px-4 pt-2 pb-4">
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-3">
          {/* Fila 1: Filtro por Categoría */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-700 shrink-0">
              <span className="text-base">📁</span>
              <span>Categoría:</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => handleSelectCategory("all")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategoryCode === "all"
                    ? "bg-[#800020] text-white shadow-xs"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                Todas las Categorías ({services.length})
              </button>

              {sortedCategories.map((cat) => {
                const count = services.filter((s) => serviceMatchesCategory(s, cat)).length;

                return (
                  <button
                    key={cat.id || cat.code}
                    onClick={() => handleSelectCategory(cat.code || cat.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      selectedCategoryCode === cat.code || selectedCategoryCode === cat.id
                        ? "bg-[#800020] text-white shadow-xs"
                        : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                    }`}
                  >
                    <span className="font-mono text-[10px] opacity-75">#{cat.displayOrder}</span>
                    <span>{cat.name}</span>
                    <span className="opacity-80">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fila 2: Filtro por Tipo de Servicio */}
          <div className="pt-2.5 border-t border-stone-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-700 shrink-0">
              <span className="text-base">🏷️</span>
              <span>Tipo de Actividad:</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleSelectType("all")}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  selectedType === "all"
                    ? "bg-[#0B4A72] text-white font-bold shadow-xs"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                Todos los tipos ({services.length})
              </button>
              <button
                onClick={() => handleSelectType("recurring")}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  selectedType === "recurring"
                    ? "bg-[#0B4A72] text-white font-bold shadow-xs"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                🗓️ Clases y Citas Periódicas Regulares ({recurringCount})
              </button>
              <button
                onClick={() => handleSelectType("event")}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  selectedType === "event"
                    ? "bg-purple-700 text-white font-bold shadow-xs"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                ✨ Eventos, Talleres y Retiros Regulares ({eventCount})
              </button>
              <button
                onClick={() => handleSelectType("special")}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  selectedType === "special" || selectedType === "especiales"
                    ? "bg-amber-600 text-white font-bold shadow-xs"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                🌟 Actividades Especiales ({specialCount})
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECCIONES DINÁMICAS POR CATEGORÍA EN ORDEN ESPECIFICADO (displayOrder) ─── */}
      {groupedSections.map(({ category: cat, services: catServices }) => {
        const isYogaCategory =
          cat.code === "yoga_meditacion" ||
          cat.code === "yoga" ||
          cat.name.toLowerCase().includes("yoga");

        const isSaludCategory =
          cat.code === "salud_terapeutica" ||
          cat.name.toLowerCase().includes("salud") ||
          cat.name.toLowerCase().includes("gestalt") ||
          cat.name.toLowerCase().includes("individual");

        const isTalleresCategory =
          cat.code === "talleres_eventos" ||
          cat.name.toLowerCase().includes("taller") ||
          cat.name.toLowerCase().includes("retiro") ||
          cat.name.toLowerCase().includes("gong");

        const isEspecialesCategory =
          cat.code === "longevidad_artes" ||
          cat.code === "longevidad" ||
          cat.code === "actividades_especiales" ||
          cat.name.toLowerCase().includes("especiales") ||
          cat.name.toLowerCase().includes("longevidad");

        // Border & Accent coloring per category
        const borderTopColor = isYogaCategory
          ? "border-[#800020]"
          : isSaludCategory
          ? "border-emerald-700"
          : isTalleresCategory
          ? "border-purple-600"
          : isEspecialesCategory
          ? "border-[#0B4A72]"
          : "border-stone-400";

        const tagColor = isYogaCategory
          ? "text-[#800020]"
          : isSaludCategory
          ? "text-emerald-800"
          : isTalleresCategory
          ? "text-purple-900"
          : isEspecialesCategory
          ? "text-[#0B4A72]"
          : "text-stone-700";

        return (
          <section key={cat.id || cat.code} className="max-w-6xl mx-auto px-4 py-8">
            <div className={`mb-6 pb-3 border-b-2 ${borderTopColor}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-mono text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                      Orden #{cat.displayOrder}
                    </span>
                    <span className={`text-[11px] font-extrabold uppercase tracking-widest ${tagColor} flex items-center gap-1.5`}>
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      ESCUELA SALVADORA CONESA · {isEspecialesCategory ? "ACTIVIDADES ESPECIALES" : isSaludCategory ? "SALUD & TERAPIAS INDIVIDUALES" : "SEDE OFICIAL"}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
                    {cat.name}
                  </h3>
                  {cat.description && (
                    <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl whitespace-pre-line">
                      {cat.description}
                    </p>
                  )}
                </div>
                <span className="text-xs text-stone-600 font-medium whitespace-nowrap">
                  {crmLoading ? "Sincronizando..." : `${catServices.length} ${catServices.length === 1 ? "actividad" : "actividades"}`}
                </span>
              </div>
            </div>

            {/* Banner Informativo Políticas de Yoga (si corresponde a Yoga) */}
            {isYogaCategory && (
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
            )}

            {/* Grid de Servicios de esta Categoría */}
            <div
              className={`grid ${
                isEspecialesCategory
                  ? "grid-cols-1 lg:grid-cols-2 gap-6"
                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
              }`}
            >
              {catServices.map((act) => {
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
                          {act.freeForYogaStudents && (
                            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-300">
                              ✨ ¡Gratis Alumnos Yoga!
                            </span>
                          )}
                          {act.maxCapacity && (
                            <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200 flex items-center gap-1">
                              <Users className="w-3 h-3" /> Aforo: {act.maxCapacity} {act.maxCapacity === 1 ? "plaza" : "plazas"}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Visor Multimedia Inteligente (Vídeo / Flyer / Selector) */}
                      <ServiceMediaPreview act={act} />

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
                                {priceDisplay} • {act.allowedModalities?.map((m) => m === "in_person" ? "Presencial" : m === "virtual" ? "Online" : m).join(" · ") || "Presencial y Online"}
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
                          <div className="flex justify-between items-start mb-2 gap-2">
                            <h4 className="font-serif text-lg sm:text-xl font-bold text-stone-900 group-hover:text-[#800020] transition-colors leading-snug">
                              {act.name}
                            </h4>
                            <span className="font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg text-xs border border-emerald-200 shrink-0 ml-2">
                              {priceDisplay}
                            </span>
                          </div>

                          {act.eventDatesText && (
                            <div className="mb-2 inline-block bg-purple-100 text-purple-950 font-bold text-[11px] px-2.5 py-0.5 rounded-md">
                              🗓️ {act.eventDatesText}
                            </div>
                          )}

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
                            {act.maxCapacity && <span>Aforo: {act.maxCapacity} plazas</span>}
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
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                          {showPorWassap && (
                            act.whatsappBookingUrl ? (
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
                                type="button"
                                onClick={() => {
                                  setSelectedService(act.name);
                                  setWaModalOpen(true);
                                }}
                                className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 cursor-pointer"
                              >
                                <Phone className="w-3.5 h-3.5" /> Pedir por WhatsApp
                              </button>
                            )
                          )}

                          {showPorVapi && (
                            <button
                              type="button"
                              onClick={() => triggerVapiCall({ inquiry: `Consulta y reserva para ${act.name}` })}
                              className="text-[#800020] hover:text-[#660019] font-bold flex items-center gap-1 cursor-pointer transition hover:underline"
                              title="Pedir llamada con nuestro Asistente de Voz IA"
                            >
                              <PhoneCall className="w-3.5 h-3.5 text-[#C5A059]" /> Pedir por Teléfono
                            </button>
                          )}
                        </div>
                        <span className="text-stone-500 font-medium text-[11px] shrink-0">Pago en centro</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      {/* ─── SECCIÓN PARA OTRAS ACTIVIDADES SIN CATEGORÍA ─── */}
      {uncategorizedServices.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-8">
          <div className="mb-6 pb-3 border-b-2 border-stone-400">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Otras Actividades y Consultas
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {uncategorizedServices.map((act) => {
              const meta = getCategoryMeta(act);
              const priceDisplay = formatServicePrice(act);
              const durationDisplay = formatDuration(act.durationMinutes);

              return (
                <div
                  key={act.id}
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

                    <ServiceMediaPreview act={act} />

                    <h4 className="font-serif text-base font-bold text-stone-900 mb-1.5 leading-snug">
                      {act.name}
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed mb-3 whitespace-pre-line">
                      {act.description}
                    </p>

                    {act.scheduleText && (
                      <div className="bg-[#FAF9F6] rounded-xl p-3 border border-stone-200 text-xs space-y-1 mb-3">
                        <div className="font-bold text-[#800020] text-[11px] uppercase flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> Horario:
                        </div>
                        <div className="text-[11px] text-stone-800">
                          {act.scheduleText}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-stone-100 space-y-2">
                    <button
                      onClick={() => handleServiceSelect(act)}
                      className="w-full py-2 px-3 bg-[#800020] hover:bg-[#800020]/90 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5" /> Reservar Plaza
                    </button>
                    <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                      <span>{durationDisplay}</span>
                      <div className="flex items-center gap-2">
                        {showPorWassap && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedService(act.name);
                              setWaModalOpen(true);
                            }}
                            className="text-emerald-700 font-bold hover:underline cursor-pointer flex items-center gap-0.5"
                          >
                            <Phone className="w-3 h-3" /> WhatsApp
                          </button>
                        )}
                        {showPorVapi && (
                          <button
                            type="button"
                            onClick={() => triggerVapiCall({ inquiry: `Consulta y reserva para ${act.name}` })}
                            className="text-[#800020] font-bold hover:underline cursor-pointer flex items-center gap-0.5"
                            title="Pedir llamada con Asistente de Voz IA"
                          >
                            <PhoneCall className="w-3 h-3 text-[#C5A059]" /> Pedir por Teléfono
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ─── MENSAJE CUANDO NINGUNA ACTIVIDAD COINCIDE CON LOS FILTROS ─── */}
      {totalFilteredCount === 0 && (
        <section className="max-w-6xl mx-auto px-4 py-12 text-center">
          <div className="bg-white rounded-3xl border border-stone-200 p-10 max-w-lg mx-auto shadow-sm space-y-3">
            <span className="text-3xl">🔍</span>
            <h4 className="font-serif text-lg font-bold text-stone-900">
              No se han encontrado actividades con estos filtros
            </h4>
            <p className="text-xs text-stone-500">
              Prueba a seleccionar &quot;Todas las Categorías&quot; o &quot;Todos los tipos&quot; para ver las actividades disponibles.
            </p>
            <button
              onClick={() => updateFilters("all", "all")}
              className="mt-2 px-4 py-2 bg-[#800020] text-white rounded-xl text-xs font-bold hover:bg-[#660019] transition cursor-pointer"
            >
              Restablecer todos los filtros
            </button>
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
      {showPorWassap && waModalOpen && (
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

export default function DemoLandingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center p-8 text-stone-500 text-sm">
          Cargando catálogo de servicios...
        </div>
      }
    >
      <ServiciosContent />
    </Suspense>
  );
}
