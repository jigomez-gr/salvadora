"use client";

import React from "react";
import { Film, FileText, ArrowUpRight, ExternalLink } from "lucide-react";

interface FormattedMessageBlockProps {
  text: string;
}

export function FormattedMessageBlock({ text }: FormattedMessageBlockProps) {
  // Parse inline markdown bold: *bold* or **bold**, and URLs
  // Split text by URLs and markdown links first
  const urlRegex = /(https?:\/\/[^\s\)]+)|(\[[^\]]+\]\([^\)]+\))/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = urlRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      const plainSegment = text.substring(lastIndex, match.index);
      parts.push(renderStyledText(plainSegment, `txt-${lastIndex}`));
    }

    const matchedStr = match[0];
    if (matchedStr.startsWith("[")) {
      // Markdown link [Title](url)
      const mdMatch = matchedStr.match(/\[([^\]]+)\]\(([^\)]+)\)/);
      if (mdMatch) {
        const title = mdMatch[1];
        const href = mdMatch[2];
        parts.push(
          <a
            key={`md-link-${match.index}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#800020] hover:text-[#660019] underline font-bold inline-flex items-center gap-0.5 break-all cursor-pointer"
          >
            {title}
            <ExternalLink className="w-3 h-3 inline-block shrink-0 opacity-80" />
          </a>
        );
      }
    } else {
      // Plain URL
      const url = matchedStr;
      if (url.includes("checkout.stripe.com")) {
        // Stripe payment link anonymized
        parts.push(
          <a
            key={`stripe-${match.index}`}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="my-1.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-2xs transition active:scale-95 no-underline cursor-pointer"
            title="Enlace seguro de pago online"
          >
            <span>💳 Enlace Seguro de Pago Online</span>
            <ArrowUpRight className="w-3.5 h-3.5 shrink-0 opacity-90" />
          </a>
        );
      } else {
        parts.push(
          <a
            key={`url-${match.index}`}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0B4A72] hover:text-[#083654] underline font-semibold break-all inline-flex items-center gap-0.5 cursor-pointer"
          >
            {url}
            <ExternalLink className="w-3 h-3 inline-block shrink-0 opacity-80" />
          </a>
        );
      }
    }

    lastIndex = match.index + matchedStr.length;
  }

  if (lastIndex < text.length) {
    const remaining = text.substring(lastIndex);
    parts.push(renderStyledText(remaining, `txt-rem-${lastIndex}`));
  }

  return <p className="whitespace-pre-wrap leading-relaxed">{parts}</p>;
}

/**
 * Helper to render *bold* or **bold** text in plain text segments
 */
function renderStyledText(text: string, keyPrefix: string): React.ReactNode {
  // Match **bold** or *bold*
  const boldRegex = /(\*\*([^*]+)\*\*|\*([^*]+)\*)/g;
  const elements: React.ReactNode[] = [];
  let lastIdx = 0;
  let match: RegExpExecArray | null;

  while ((match = boldRegex.exec(text)) !== null) {
    if (match.index > lastIdx) {
      elements.push(text.substring(lastIdx, match.index));
    }
    const boldContent = match[2] || match[3];
    elements.push(
      <strong key={`${keyPrefix}-b-${match.index}`} className="font-bold text-stone-900">
        {boldContent}
      </strong>
    );
    lastIdx = match.index + match[0].length;
  }

  if (lastIdx < text.length) {
    elements.push(text.substring(lastIdx));
  }

  return <React.Fragment key={keyPrefix}>{elements}</React.Fragment>;
}

interface BubbleMessageContentProps {
  body: string;
  isUser: boolean;
}

export function BubbleMessageContent({ body, isUser }: BubbleMessageContentProps) {
  if (isUser) {
    return <p className="whitespace-pre-wrap">{body}</p>;
  }

  const lines = body.split("\n");
  const renderedElements: React.ReactNode[] = [];
  let currentTextBuffer: string[] = [];

  const flushTextBuffer = (keyPrefix: string) => {
    if (currentTextBuffer.length === 0) return;
    const blockText = currentTextBuffer.join("\n");
    currentTextBuffer = [];
    renderedElements.push(
      <FormattedMessageBlock key={`${keyPrefix}-${renderedElements.length}`} text={blockText} />
    );
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    // 0. Detect Ficha Multimedia Link (/actividad/...)
    const fichaMatch = trimmed.match(/(?:🎬📄[^\n\r]*:\s*)?(https?:\/\/[^\s\)]+\/actividad\/[^\s\)]+)/i);
    const isFichaLine = Boolean(
      fichaMatch && (trimmed.includes("actividad") || trimmed.includes("Ficha") || trimmed.includes("🎬📄"))
    );

    // 1. Detect Video Link
    // Matches video lines with or without emoji, extracts URL ending in .mp4 or containing /videos/
    const videoMatch = trimmed.match(/(?:🎬[^\n\r]*:\s*)?(https?:\/\/[^\s\)]+(?:\.mp4|\/videos\/[^\s\)]+))/i);
    const isVideoLine = Boolean(
      videoMatch && (trimmed.includes("🎬") || trimmed.toLowerCase().includes("vídeo") || trimmed.toLowerCase().includes("video") || trimmed.includes(".mp4"))
    );

    // 2. Detect Flyer Link
    // Matches flyer lines with or without emoji, extracts URL ending in image extension or containing /flyers/
    const flyerMatch = trimmed.match(/(?:📄[^\n\r]*:\s*)?(https?:\/\/[^\s\)]+(?:\.jpg|\.jpeg|\.png|\.webp|\/flyers\/[^\s\)]+))/i);
    const isFlyerLine = Boolean(
      flyerMatch && (trimmed.includes("📄") || trimmed.toLowerCase().includes("flyer") || trimmed.includes("/flyers/"))
    );

    if (isFichaLine && fichaMatch) {
      flushTextBuffer(`txt-${idx}`);
      const fichaUrl = fichaMatch[1];
      renderedElements.push(
        <a
          key={`ficha-btn-${idx}`}
          href={fichaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="my-2 flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 via-teal-700 to-[#0B4A72] hover:opacity-95 shadow-sm transition active:scale-98 group cursor-pointer border border-emerald-400/40 no-underline"
          title="Ver Ficha Multimedia y Vídeo de la Actividad"
        >
          <span className="flex items-center gap-2 truncate">
            <span className="text-base shrink-0">🎬📄</span>
            <span className="truncate">Ver Ficha Multimedia y Vídeo de la Actividad</span>
          </span>
          <ArrowUpRight className="w-4 h-4 shrink-0 text-emerald-200 opacity-90 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
      );
    } else if (isVideoLine && videoMatch) {
      flushTextBuffer(`txt-${idx}`);
      const videoUrl = videoMatch[1];
      renderedElements.push(
        <a
          key={`video-btn-${idx}`}
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="my-2 flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#800020] to-[#A01135] hover:opacity-95 shadow-xs transition active:scale-98 group cursor-pointer border border-[#C5A059]/40 no-underline"
          title="Consultar / Descargar Vídeo de la Actividad"
        >
          <span className="flex items-center gap-2 truncate">
            <Film className="w-4 h-4 text-amber-300 shrink-0" />
            <span className="truncate">🎬 Consultar / Descargar Vídeo de la Actividad</span>
          </span>
          <ArrowUpRight className="w-4 h-4 shrink-0 text-amber-200 opacity-90 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
      );
    } else if (isFlyerLine && flyerMatch) {
      flushTextBuffer(`txt-${idx}`);
      const flyerUrl = flyerMatch[1];
      renderedElements.push(
        <a
          key={`flyer-btn-${idx}`}
          href={flyerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="my-2 flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#0B4A72] to-[#12689E] hover:opacity-95 shadow-xs transition active:scale-98 group cursor-pointer border border-sky-300/40 no-underline"
          title="Consultar / Descargar Flyer de la Actividad"
        >
          <span className="flex items-center gap-2 truncate">
            <FileText className="w-4 h-4 text-amber-300 shrink-0" />
            <span className="truncate">📄 Consultar / Descargar Flyer de la Actividad</span>
          </span>
          <ArrowUpRight className="w-4 h-4 shrink-0 text-sky-200 opacity-90 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
      );
    } else {
      currentTextBuffer.push(line);
    }
  });

  flushTextBuffer("final");

  return <div className="space-y-1.5">{renderedElements}</div>;
}
