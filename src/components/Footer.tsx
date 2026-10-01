"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#1C1C1C] text-white py-14 font-sans border-t-2 border-[#C5A059]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center">
        
        {/* Legal Links (matching Image 1) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm sm:text-base font-medium text-white/90">
          <Link
            href="/politica-de-privacidad"
            className="hover:text-[#E9C168] transition duration-200 underline-offset-4 hover:underline"
          >
            Política de Privacidad
          </Link>
          <span className="hidden sm:inline text-white/30">•</span>
          <Link
            href="/politica-de-cookies"
            className="hover:text-[#E9C168] transition duration-200 underline-offset-4 hover:underline"
          >
            Política de Cookies
          </Link>
          <span className="hidden sm:inline text-white/30">•</span>
          <Link
            href="/ley-de-proteccion-de-datos"
            className="hover:text-[#E9C168] transition duration-200 underline-offset-4 hover:underline"
          >
            Ley de Protección de Datos (RGPD)
          </Link>
        </div>

        {/* RGPD & AI Compliance Note */}
        <div className="max-w-3xl mx-auto px-4 py-2.5 rounded-xl bg-white/5 border border-[#C5A059]/20 text-xs text-white/75 leading-relaxed">
          <p className="flex items-center justify-center gap-1.5 font-medium text-[#E9C168] mb-1">
            <span>🛡️</span>
            <span>Cumplimiento Normativo RGPD (Reglamento UE 2016/679) y LOPDGDD 3/2018</span>
          </p>
          <p className="text-[11px] text-white/60">
            Garantizamos la máxima confidencialidad, seguridad y transparencia en el tratamiento de sus datos personales, así como en el uso responsable de nuestros canales de asistencia interactiva y Asistente Virtual con Inteligencia Artificial.
          </p>
        </div>

        {/* Social Media Icons */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <a
            href="https://www.instagram.com/escuelayogasalvadoraconesa/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram de Escuela Yoga Salvadora Conesa"
            title="Instagram Escuela Yoga Salvadora Conesa"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-linear-to-r from-pink-500/20 via-rose-500/20 to-purple-500/20 hover:from-pink-500/30 hover:to-purple-500/30 border border-pink-500/30 text-pink-300 hover:text-white transition duration-300 text-xs font-semibold shadow-sm"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            <span>Instagram</span>
          </a>
          <a
            href="https://www.facebook.com/salvadoraconesa?rdid=6uiPQDgBUxQ7KTQ3&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1EhbRPtem8%2F#"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook de Centro de Yoga Salvadora Conesa"
            title="Facebook Centro de Yoga Salvadora Conesa"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 hover:text-white transition duration-300 text-xs font-semibold shadow-sm"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span>Facebook</span>
          </a>
        </div>

        <div className="w-24 h-px bg-[#C5A059]/40 mx-auto" />

        {/* Copyright & WebMaster Credit */}
        <div className="space-y-2 text-xs sm:text-sm text-white/60 font-light">
          <p>
            © {new Date().getFullYear()} Centro de Yoga Fuenlabrada Salvadora Conesa. Todos los derechos reservados.
          </p>
          <p className="text-white/40">
            WebMaster ReagrupamientoAI{" "}
            <a
              href="mailto:contacto@reagrupamientoAI.com"
              className="text-[#E9C168]/80 hover:text-[#E9C168] transition underline"
            >
              @reagrupamientoAI.com
            </a>
          </p>
        </div>

      </div>
    </footer>
  );
}
