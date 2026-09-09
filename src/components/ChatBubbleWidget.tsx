"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Bot, Trash2, ShieldCheck, Check, PhoneCall, MessageCircle, Loader2 } from "lucide-react";
import { triggerVapiCall } from "@/components/VapiCallModal";

interface ChatMessage {
  id: string;
  direction: "inbound" | "outbound";
  body: string;
}

interface ChatBubbleProps {
  agentKey?: string;
  apiUrl?: string;
  businessName?: string;
  brandColor?: string;
  welcomeMessage?: string;
}

export function ChatBubbleWidget({
  agentKey = process.env.NEXT_PUBLIC_DEFAULT_AGENT_KEY || "booking",
  apiUrl = process.env.NEXT_PUBLIC_CRM_API_URL || "https://crm-salvadoraconesa.jigretera.com",
  businessName = process.env.NEXT_PUBLIC_BUSINESS_NAME || "Centro de Yoga y Bienestar Salvadora",
  brandColor = "#800020",
  welcomeMessage = "¡Hola! 👋 Soy tu asistente de consultas de nuestros servicios, reservas y citas del Centro de Yoga. ¿En qué puedo ayudarte hoy?",
}: ChatBubbleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [rgpdAccepted, setRgpdAccepted] = useState(true);
  const [clearToast, setClearToast] = useState(false);
  const [showMobileTooltip, setShowMobileTooltip] = useState(true);

  // En pantallas móviles, ocultar el tooltip automáticamente tras 6 segundos para no ocupar espacio permanentemente
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMobileTooltip(false);
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check for duplicate chat bubbles in the DOM before mounting and periodically
  useEffect(() => {
    const cleanupDuplicateBubbles = () => {
      if (typeof document === "undefined") return;
      const existingBubbles = document.querySelectorAll("[data-crm-chat-bubble='true']");
      existingBubbles.forEach((el) => {
        if (containerRef.current && el !== containerRef.current) {
          el.remove();
        }
      });
    };
    cleanupDuplicateBubbles();
    const interval = setInterval(cleanupDuplicateBubbles, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let sid = "";
    try {
      sid = localStorage.getItem("crm_widget_session_id") || "";
      const consent = localStorage.getItem("crm_widget_rgpd_consent");
      setRgpdAccepted(consent === "accepted");

      const saved = localStorage.getItem("crm_widget_messages");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch {}

    if (!sid) {
      sid = "web_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now();
      try {
        localStorage.setItem("crm_widget_session_id", sid);
      } catch {}
    }
    setSessionId(sid);
  }, []);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const initial = [
        {
          id: "welcome-" + Date.now(),
          direction: "inbound" as const,
          body: welcomeMessage,
        },
      ];
      setMessages(initial);
      try {
        localStorage.setItem("crm_widget_messages", JSON.stringify(initial));
      } catch {}
    }
  }, [isOpen, messages.length, welcomeMessage]);

  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem("crm_widget_messages", JSON.stringify(messages));
      } catch {}
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen]);

  // Broadcast chat visibility changes to prevent other floating UI elements from colliding
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("crm-chat-visibility-change", { detail: { isOpen } })
      );
    }
  }, [isOpen]);

  const handleAcceptRgpd = () => {
    try {
      localStorage.setItem("crm_widget_rgpd_consent", "accepted");
    } catch {}
    setRgpdAccepted(true);
  };

  const handleSendMessage = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const text = (customText || inputValue).trim();
    if (!text || isTyping) return;

    if (!rgpdAccepted) {
      handleAcceptRgpd();
    }

    const userMsgId = "user-" + Date.now();
    setMessages((prev) => [...prev, { id: userMsgId, direction: "outbound", body: text }]);
    setInputValue("");
    setIsTyping(true);

    try {
      const res = await fetch(`${apiUrl}/api/widget/chat/${agentKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          sessionId: sessionId || "web_guest",
          channel: "widget",
        }),
      });

      if (!res.ok) throw new Error("Error en el servidor CRM");
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: "bot-" + Date.now(),
          direction: "inbound",
          body: data.reply || "He recibido tu mensaje. ¿Deseas reservar tu plaza?",
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: "err-" + Date.now(),
          direction: "inbound",
          body: "Lo siento, ha habido un problema de conexión con el CRM. Por favor, intenta de nuevo.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessageRef = useRef(handleSendMessage);
  handleSendMessageRef.current = handleSendMessage;

  // Event listener for opening the chat from any button
  useEffect(() => {
    const handleOpenChat = (e: CustomEvent<{ message?: string; autoSend?: boolean }>) => {
      // 1. Clean up any duplicate chat bubbles or launcher traces in DOM
      if (typeof document !== "undefined") {
        document.querySelectorAll("[data-crm-chat-bubble='true']").forEach((el) => {
          if (containerRef.current && el !== containerRef.current) {
            el.remove();
          }
        });
      }

      setIsOpen(true);
      const text = e?.detail?.message;
      const shouldAutoSend = !!e?.detail?.autoSend;

      if (text) {
        if (shouldAutoSend) {
          // Specific activity: auto-send immediately
          handleSendMessageRef.current(undefined, text);
        } else {
          // General consultation: leave message prepared in input box
          setInputValue(text);
        }
      }
    };

    window.addEventListener("open-crm-chat" as any, handleOpenChat as EventListener);
    return () => window.removeEventListener("open-crm-chat" as any, handleOpenChat as EventListener);
  }, []);

  const handleClearHistory = () => {
    const sid = "web_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now();
    try {
      localStorage.setItem("crm_widget_session_id", sid);
      localStorage.removeItem("crm_widget_messages");
    } catch {}
    setSessionId(sid);
    const initial: ChatMessage[] = [
      {
        id: "welcome-" + Date.now(),
        direction: "inbound",
        body: welcomeMessage,
      },
    ];
    setMessages(initial);
    try {
      localStorage.setItem("crm_widget_messages", JSON.stringify(initial));
    } catch {}
    setClearToast(true);
    setTimeout(() => setClearToast(false), 2500);
  };

  const handleWhatsAppClick = () => {
    const text = inputValue.trim() || (messages.length > 1 ? messages[messages.length - 1].body : "Hola, me gustaría información y reservar una plaza en el Centro de Yoga Salvadora Conesa.");
    const waUrl = `https://wa.me/34695172625?text=${encodeURIComponent(text)}`;
    if (typeof window !== "undefined") {
      window.open(waUrl, "_blank");
    }
  };



  const tooltipText = "Asistente para consultar nuestros servicios, reservas de citas, cancelaciones, reprogramaciones y asistencia a eventos";

  return (
    <div
      ref={containerRef}
      data-crm-chat-bubble="true"
      className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-50 flex flex-col items-end"
    >
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-3 flex h-[590px] max-h-[85vh] w-[390px] max-w-[calc(100vw-24px)] flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl transition-all animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div
            className="flex items-center justify-between px-3.5 py-3 text-white shadow-sm gap-2"
            style={{ backgroundColor: brandColor }}
          >
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/20">
                <Bot className="h-5.5 w-5.5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm sm:text-[15px] font-bold leading-tight">{businessName}</h3>
                <p className="flex items-center gap-1.5 text-[11px] text-white/90 font-medium truncate">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-400"></span> En línea (Asistente IA)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleClearHistory}
                title="Borrar historial de conversación"
                aria-label="Borrar historial"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 hover:bg-white/25 text-white/90 hover:text-white transition cursor-pointer"
              >
                <Trash2 className="h-4.5 w-4.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Cerrar chat"
                aria-label="Cerrar chat"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/25 hover:bg-white/40 text-white transition cursor-pointer shadow-xs active:scale-95"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Toast Notification when History is Cleared */}
          {clearToast && (
            <div className="bg-emerald-600 text-white text-xs px-3 py-1.5 text-center font-medium flex items-center justify-center gap-1.5 shadow-sm animate-in fade-in">
              <Check className="w-3.5 h-3.5" /> Historial de conversación borrado
            </div>
          )}

          {/* Messages List */}
          <div className="flex-1 space-y-3 overflow-y-auto bg-stone-50 p-4">
            {/* Friendly Non-Threatening AI Disclaimer Badge */}
            <div className="flex items-center justify-center gap-1.5 py-1 px-3 bg-[#C5A059]/15 text-[#800020] rounded-full text-[11px] font-semibold border border-[#C5A059]/30 mx-auto max-w-fit select-none">
              <Bot className="w-3.5 h-3.5" />
              <span>Asistente virtual con IA · Respuestas inmediatas 24h</span>
            </div>

            {messages.map((m) => {
              const isUser = m.direction === "outbound";
              return (
                <div
                  key={m.id}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-4 py-3 text-base sm:text-sm leading-relaxed shadow-sm font-sans ${
                      isUser
                        ? "rounded-br-none text-white font-medium"
                        : "rounded-bl-none border border-stone-200/90 bg-white text-stone-900"
                    }`}
                    style={isUser ? { backgroundColor: brandColor } : {}}
                  >
                    <p className="whitespace-pre-wrap">{m.body}</p>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-none border border-stone-200/90 bg-white px-4 py-3 shadow-sm">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-stone-400" style={{ animationDelay: "0ms" }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-stone-400" style={{ animationDelay: "150ms" }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-stone-400" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}

            {/* Clear History Link inside message list if conversation ongoing */}
            {messages.length > 2 && (
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={handleClearHistory}
                  className="text-[11px] text-stone-400 hover:text-[#800020] flex items-center gap-1 transition cursor-pointer py-1 px-2.5 rounded-lg hover:bg-stone-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Borrar historial de conversación</span>
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* RGPD Consent Card before sending (if not yet accepted) */}
          {!rgpdAccepted && (
            <div className="mx-3 mb-2 p-3 bg-amber-50/95 border border-amber-300/80 rounded-xl text-xs text-stone-800 space-y-2 shadow-sm animate-in fade-in">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#800020] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-stone-900 text-xs">Aviso de Privacidad y RGPD</p>
                  <p className="text-[11px] leading-relaxed text-stone-600">
                    Este chat utiliza <strong>Inteligencia Artificial</strong> para responder a tus consultas y tramitar reservas. Tus datos serán tratados conforme al RGPD europeo y nuestra{" "}
                    <a
                      href="/politica-de-privacidad"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#800020] underline font-bold hover:text-[#800020]/80"
                    >
                      Política de Privacidad
                    </a>.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={handleAcceptRgpd}
                  className="px-3.5 py-1 bg-[#800020] text-white font-bold rounded-lg text-xs hover:bg-[#800020]/90 transition shadow-xs cursor-pointer"
                >
                  Aceptar y Continuar
                </button>
              </div>
            </div>
          )}

          {/* Input Form */}
          <form
            onSubmit={(e) => handleSendMessage(e)}
            className="flex items-center gap-2 border-t border-stone-200 bg-white p-2.5 sm:p-3"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Escribe tu consulta o reserva..."
              className="flex-1 rounded-xl border border-stone-300 bg-stone-50 px-3.5 py-2 text-sm text-stone-900 outline-none transition-all placeholder:text-stone-400 focus:border-[#800020] focus:bg-white"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              aria-label="Enviar mensaje"
              className="flex h-10 w-10 sm:h-9.5 sm:w-9.5 shrink-0 items-center justify-center rounded-xl text-white transition-opacity disabled:opacity-40 cursor-pointer"
              style={{ backgroundColor: brandColor }}
            >
              <Send className="h-4.5 w-4.5" />
            </button>
          </form>

          {/* Quick Action Bar: Pedir por WhatsApp & Pedir por Teléfono (VAPI) - Más pequeño y justo antes de Cumple RGPD */}
          <div className="flex items-center gap-2 border-t border-stone-100 bg-stone-50/90 px-3 py-1.5">
            <button
              type="button"
              onClick={handleWhatsAppClick}
              className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-[#25D366] hover:bg-[#20ba5a] py-1.5 px-2 text-[11px] font-bold text-white shadow-2xs transition active:scale-98 cursor-pointer"
              title="Pedir por WhatsApp"
            >
              <MessageCircle className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">Pedir por WhatsApp</span>
            </button>
            <button
              type="button"
              onClick={() => {
                triggerVapiCall({
                  inquiry: inputValue.trim() || (messages.length > 1 ? messages[messages.length - 1].body : "Consulta sobre clases y servicios"),
                });
              }}
              className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-[#800020] hover:bg-[#800020]/90 py-1.5 px-2 text-[11px] font-bold text-white shadow-2xs transition active:scale-98 cursor-pointer border border-[#C5A059]/30"
              title="Pedir por Teléfono con Asistente de Voz IA"
            >
              <PhoneCall className="h-3.5 w-3.5 shrink-0 text-[#C5A059]" />
              <span className="truncate">Te Llamamos (IA)</span>
            </button>
          </div>

          {/* Permanent Legal & AI Footer in Chat Window */}
          <div className="px-3.5 py-1.5 bg-stone-100 border-t border-stone-200/80 text-[10px] text-stone-500 flex items-center justify-between select-none">
            <span className="flex items-center gap-1 truncate">
              <ShieldCheck className="w-3 h-3 text-[#800020] shrink-0" />
              Cumple RGPD (UE 2016/679) · Asistente IA
            </span>
            <a
              href="/politica-de-privacidad"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#800020] underline shrink-0 ml-2"
            >
              Privacidad
            </a>
          </div>
        </div>
      )}

      {/* Floating Toggle Button with Tooltip (ALWAYS deployed on desktop; temporary & dismissible on mobile) */}
      {!isOpen && (
        <div className="relative flex items-center">
          {/* Tooltip: permanente en escritorio (sm:flex), temporal (6s) y descartable en móvil */}
          <div
            onClick={() => setIsOpen(true)}
            className={`${
              showMobileTooltip ? "flex" : "hidden sm:flex"
            } items-center cursor-pointer mr-2.5 sm:mr-3 select-none transition-all duration-300 animate-in fade-in`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setIsOpen(true);
              }
            }}
          >
            <div className="bg-stone-900/95 text-white text-[11px] sm:text-xs font-medium px-3.5 py-2 rounded-xl shadow-2xl max-w-[calc(100vw-95px)] sm:max-w-[340px] md:max-w-[420px] text-right sm:text-left leading-snug backdrop-blur-xs border border-white/15 tracking-normal hover:bg-stone-800 transition-colors flex items-start sm:items-center gap-1.5">
              <span>{tooltipText}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMobileTooltip(false);
                }}
                title="Cerrar aviso"
                aria-label="Cerrar aviso"
                className="sm:hidden -mr-1 p-0.5 text-stone-400 hover:text-white shrink-0 rounded hover:bg-white/10"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="w-2 h-2 bg-stone-900/95 rotate-45 -ml-1 shrink-0 border-r border-t border-white/15" />
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label={tooltipText}
            title={tooltipText}
            className="flex h-14 w-14 sm:h-15 sm:w-15 shrink-0 items-center justify-center rounded-full text-white shadow-2xl transition-transform hover:scale-105 active:scale-95 border-2 border-white/30 cursor-pointer"
            style={{ backgroundColor: brandColor }}
          >
            <MessageSquare className="h-7 w-7" />
          </button>
        </div>
      )}
    </div>
  );
}

// Global helper function to trigger the CRM widget from any button or component
export function triggerCrmChat(message?: string, autoSend: boolean = false) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("open-crm-chat", {
        detail: {
          message: message || "Hola, me gustaría consultar los servicios y actividades del Centro de Yoga Salvadora Conesa.",
          autoSend,
        },
      })
    );
  }
}

