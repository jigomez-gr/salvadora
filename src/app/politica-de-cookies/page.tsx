import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function PoliticaCookiesPage() {
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
            Información Legal
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#800020]">
            Política de Cookies
          </h1>
        </header>

        <article className="prose prose-stone max-w-none space-y-6 text-sm sm:text-base text-[#1C1C1C]/80 leading-relaxed font-sans bg-white p-6 sm:p-10 rounded-2xl border border-[#C5A059]/20 shadow-sm">
          <p>
            Este sitio web utiliza cookies propias y de terceros strictly necesarias para garantizar el correcto funcionamiento del portal, mejorar la navegación y gestionar las reservas de los alumnos.
          </p>

          <h2 className="font-serif text-xl font-bold text-[#800020] pt-4">1. ¿Qué son las Cookies?</h2>
          <p>
            Una cookie es un pequeño archivo de texto que se almacena en su navegador al visitar nuestro sitio web, permitiéndonos recordar sus preferencias de sesión y ofrecerle una experiencia fluida.
          </p>

          <h2 className="font-serif text-xl font-bold text-[#800020] pt-4">2. Cookies Utilizadas</h2>
          <ul className="list-disc pl-5 space-y-2">
            <td><strong>Cookies Técnicas Básicas:</strong> Necesarias para mantener la sesión de usuario y la navegación segura.</td>
            <td><strong>Cookies de Preferencias:</strong> Permiten recordar selecciones previas en los calendarios de clases.</td>
          </ul>

          <h2 className="font-serif text-xl font-bold text-[#800020] pt-4">3. Gestión de Cookies</h2>
          <p>
            Puede permitir, bloquear o eliminar las cookies instaladas en su equipo mediante la configuración de las opciones del navegador instalado en su ordenador o dispositivo móvil.
          </p>
        </article>
      </main>

      <Footer />
    </div>
  );
}
