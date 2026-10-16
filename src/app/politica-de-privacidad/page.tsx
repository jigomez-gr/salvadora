import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function PoliticaPrivacidadPage() {
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
            Aviso Legal
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#800020]">
            Política de Privacidad
          </h1>
        </header>

        <article className="prose prose-stone max-w-none space-y-6 text-sm sm:text-base text-[#1C1C1C]/80 leading-relaxed font-sans bg-white p-6 sm:p-10 rounded-2xl border border-[#C5A059]/20 shadow-sm">
          <p>
            En cumplimiento de lo dispuesto en el Reglamento General de Protección de Datos (RGPD 2016/679) y la Ley Orgánica 3/2018 de Protección de Datos Personales y garantía de los derechos digitales, le informamos sobre el tratamiento de sus datos de carácter personal.
          </p>
          
          <h2 className="font-serif text-xl font-bold text-[#800020] pt-4">1. Responsable del Tratamiento</h2>
          <p>
            <strong>Titular:</strong> Centro de Yoga Fuenlabrada Salvadora Conesa<br />
            <strong>Finalidad:</strong> Gestión de reservas de clases, talleres, atención a consultas y envío de información sobre actividades del centro.<br />
            <strong>Contacto:</strong> salvadora@centrodeyogasalvadoraconesa.es
          </p>

          <h2 className="font-serif text-xl font-bold text-[#800020] pt-4">2. Finalidad del Tratamiento de Datos</h2>
          <p>
            Los datos personales facilitados a través de formularios web o reservas son utilizados exclusivamente para coordinar sus sesiones de yoga, talleres de baños de gong, retiros y responder a sus solicitudes directas.
          </p>

          <h2 className="font-serif text-xl font-bold text-[#800020] pt-4">3. Derechos del Usuario</h2>
          <p>
            Usted tiene derecho a acceder, rectificar, suprimir, limitar u oponerse al tratamiento de sus datos personales enviando una solicitud a nuestro correo de contacto de Salvadora Conesa.
          </p>

          <h2 className="font-serif text-xl font-bold text-[#800020] pt-4">4. Asistente Virtual con Inteligencia Artificial</h2>
          <p>
            En nuestra plataforma ponemos a su disposición un asistente virtual interactivo dotado de Inteligencia Artificial para facilitar la resolución de dudas frecuentes sobre horarios, servicios y gestión de reservas. El usuario consiente de forma informada y previa la interacción con dicho sistema automatizado. Las conversaciones pueden ser tratadas con la exclusiva finalidad de prestar el servicio solicitado y gestionar su cita, pudiendo el usuario en cualquier momento borrar su historial de conversación directamente desde la propia interfaz del chat o ejercitar sus derechos reconocidos por el RGPD.
          </p>
        </article>
      </main>

      <Footer />
    </div>
  );
}
