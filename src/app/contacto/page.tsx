import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactQueryForm from "@/components/ContactQueryForm";
import { fetchCrmServices } from "@/lib/crmServices";
import { Mail, Phone, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Centro de Yoga Fuenlabrada (Salvadora Conesa) | Formulario de Consultas y Reservas",
  description: "Formulario oficial de consultas y reservas de plaza para clases de yoga, baños de gong, terapias y retiros en Centro de Yoga Fuenlabrada (Salvadora Conesa).",
  openGraph: {
    title: "Centro de Yoga Fuenlabrada (Salvadora Conesa) | Consultas y Reservas",
    description: "Envíanos tu consulta sobre horarios y actividades o solicita tu reserva de plaza.",
    url: "https://salvadora.jigretera.com/contacto",
  },
};

export default async function ContactoPage() {
  const { services, categories } = await fetchCrmServices();

  return (
    <div className="bg-[#FAF9F6] text-[#1C1C1C] min-h-screen flex flex-col justify-between selection:bg-[#800020] selection:text-white">
      <Navbar />

      <main className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="mb-6">
          <Link
            href="/"
            className="text-xs uppercase font-bold tracking-widest text-[#800020] hover:underline inline-flex items-center space-x-1"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            <span>Volver a la página principal</span>
          </Link>
        </div>

        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-widest text-[#96680E] font-extrabold block mb-2">
            Centro de Yoga Fuenlabrada (Salvadora Conesa)
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#800020]">
            Consultas y Reservas Oficiales
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-stone-600 max-w-xl mx-auto leading-relaxed">
            Formulario directo para solicitar plaza en clases de yoga, baños de gong, terapias y retiros, o resolver cualquier duda sobre horarios y aportaciones.
          </p>
        </div>

        <ContactQueryForm initialServices={services} initialCategories={categories} />

        <div className="mt-12 text-center pt-8 border-t border-[#C5A059]/20">
          <p className="text-xs text-stone-500 mb-4">¿Prefieres contactarnos por teléfono o correo?</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold uppercase tracking-wider">
            <a
              href="tel:695172625"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:border-[#800020] hover:text-[#800020] transition shadow-2xs"
            >
              <Phone className="w-3.5 h-3.5 text-[#800020]" />
              <span>695 17 26 25</span>
            </a>
            <a
              href="mailto:salvadoraconesa@gmail.com"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:border-[#800020] hover:text-[#800020] transition shadow-2xs"
            >
              <Mail className="w-3.5 h-3.5 text-[#800020]" />
              <span>salvadoraconesa@gmail.com</span>
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
