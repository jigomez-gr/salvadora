import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BajaServiciosSection from "@/components/BajaServiciosSection";
import WhatsAppContactSection from "@/components/WhatsAppContactSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Baja de Servicios por Restricción Técnica • Centro de Yoga Salvadora Conesa",
  description:
    "Formulario oficial para solicitar la baja de los servicios de la clínica por restricción técnica mediante verificación por email y teléfono móvil.",
};

export default function BajaPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 pt-24">
        <BajaServiciosSection />
        <WhatsAppContactSection />
      </main>
      <Footer />
    </div>
  );
}
