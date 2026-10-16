import Navbar from "@/components/Navbar";
import NagnaYogaSection from "@/components/NagnaYogaSection";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function NagnaYogaPage() {
  return (
    <div className="bg-[#FAF9F6] text-[#1C1C1C] min-h-screen flex flex-col justify-between selection:bg-[#800020] selection:text-white">
      <Navbar />

      <main className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/"
            className="text-xs uppercase font-bold tracking-widest text-[#800020] hover:underline inline-flex items-center space-x-1"
          >
            <span>← Volver al Inicio</span>
          </Link>
        </div>

        <NagnaYogaSection />
      </main>

      <Footer />
    </div>
  );
}
