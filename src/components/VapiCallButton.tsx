"use client";

import React from "react";
import { PhoneCall } from "lucide-react";
import { triggerVapiCall, VapiCallOptions } from "@/components/VapiCallModal";
import { isPorVapiEnabled } from "@/lib/featureFlags";

interface VapiCallButtonProps {
  className?: string;
  children?: React.ReactNode;
  inquiry?: string;
  name?: string;
  phone?: string;
  showIcon?: boolean;
}

export default function VapiCallButton({
  className = "w-full sm:w-auto flex items-center justify-center gap-2 h-12 px-6 border border-[#C5A059] text-xs font-bold uppercase tracking-widest rounded-md text-[#800020] hover:text-white bg-white hover:bg-[#800020] shadow-sm hover:scale-102 transition duration-200 cursor-pointer select-none",
  children = "Te Llamamos Gratis (IA)",
  inquiry = "Consulta general sobre clases y retiros",
  name,
  phone,
  showIcon = true,
}: VapiCallButtonProps) {
  if (!isPorVapiEnabled()) {
    return null;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    triggerVapiCall({ inquiry, name, phone });
  };

  return (
    <button type="button" onClick={handleClick} className={className}>
      {showIcon && <PhoneCall className="w-4 h-4 text-[#C5A059] group-hover:text-white" />}
      <span>{children}</span>
    </button>
  );
}
