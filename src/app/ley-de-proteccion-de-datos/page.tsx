import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function LeyProteccionDatosPage() {
  return (
    <div className="bg-[#FAF9F6] text-[#1C1C1C] min-h-screen flex flex-col justify-between selection:bg-[#800020] selection:text-white">
      <Navbar />

      <main className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Link
          href="/"
          className="text-xs uppercase font-bold tracking-widest text-[#800020] hover:underline inline-flex items-center space-x-1"
        >
          <span>← Volver al Inicio</span>
        </Link>

        <header className="space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#C5A059] font-bold block">
            Normativa LOPD - GDD
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#800020]">
            Ley de Protección de Datos
          </h1>
        </header>

        <article className="prose prose-stone max-w-none space-y-6 text-sm sm:text-base text-[#1C1C1C]/80 leading-relaxed font-sans bg-white p-6 sm:p-10 rounded-2xl border border-[#C5A059]/20 shadow-sm">
          <p>
            En cumplimiento de la Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y garantía de los derechos digitales (LOPD-GDD), el Centro de Yoga Fuenlabrada Salvadora Conesa garantiza el máximo respeto a la confidencialidad de la información recibida.
          </p>

          <h2 className="font-serif text-xl font-bold text-[#800020] pt-4">1. Medidas de Seguridad</h2>
          <p>
            Adoptamos los niveles de seguridad requeridos por la LOPD para evitar la pérdida, mal uso, alteración o acceso no autorizado de sus datos facilitados durante la matriculación o solicitud de actividades.
          </p>

          <h2 className="font-serif text-xl font-bold text-[#800020] pt-4">2. Ejercicio de Derechos ARCO - POL</h2>
          <p>
            Podrá ejercitar en todo momento sus derechos de Acceso, Rectificación, Cancelación, Oposición, Portabilidad, Olvido y Limitación enviando un mensaje expreso a la dirección del Centro de Yoga Salvadora Conesa.
          </p>
        </article>
      </main>

      <Footer />
    </div>
  );
}
