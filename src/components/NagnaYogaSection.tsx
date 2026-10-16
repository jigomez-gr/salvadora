"use client";

import AsanasSection from "@/components/AsanasSection";

export default function NagnaYogaSection() {
  const videos = [
    {
      id: "1",
      num: "I.",
      title: "El origen del conocimiento",
      description:
        "Una primera toma de contacto con el espíritu del Nagna Yoga: de dónde viene, y qué sentido tiene detenerse a comprender antes de practicar.",
      src: "/videos/nagna_yoga/nagnayoga1.mp4",
    },
    {
      id: "2",
      num: "II.",
      title: "La respiración consciente",
      description:
        "Claves sencillas sobre el papel de la respiración en la práctica, y cómo convertirla en la guía silenciosa de cada movimiento.",
      src: "/videos/nagna_yoga/nagnayoga2.mp4",
    },
    {
      id: "3",
      num: "III.",
      title: "Anatomía del cuerpo en movimiento",
      description:
        "Nociones de anatomía aplicadas a la práctica, para entender qué le estamos pidiendo al cuerpo en cada postura.",
      src: "/videos/nagna_yoga/nagnayoga3.mp4",
    },
    {
      id: "4",
      num: "IV.",
      title: "El silencio como maestro",
      description:
        "Un acercamiento a la quietud y a la escucha interior como parte esencial del aprendizaje del yoga.",
      src: "/videos/nagna_yoga/nagnayoga4.mp4",
    },
  ];

  return (
    <div className="space-y-16 my-12">
      {/* 1. Sección Detallada 1: NAGNA YOGA */}
      <section id="nagna-yoga" className="scroll-mt-24 pt-8 border-t border-[#C5A059]/20">
        <div className="max-w-5xl mx-auto space-y-10">

          {/* Section Header */}
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#C5A059] font-bold block">
              Yoga del Conocimiento
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#800020]">
              NAGNA YOGA
            </h2>
            <div className="space-y-4 text-sm sm:text-base text-[#1C1C1C]/80 leading-relaxed font-sans bg-white p-6 sm:p-8 rounded-xl border border-[#C5A059]/20 shadow-sm">
              <p>
                Nagna Yoga es el yoga del conocimiento. Es un espacio que he creado con mucho cariño para seguir haciendo, poco a poco, pequeños vídeos de unos cinco minutos con los que enseñar y compartir conocimientos de yoga: anatomía aplicada a la práctica, claves de la respiración, fundamentos de la filosofía yóguica y esos pequeños matices que marcan la diferencia entre hacer una postura y habitarla de verdad.
              </p>
              <p>
                Cada vídeo es una semilla de conocimiento pensada para acompañarte más allá de la esterilla: puedes volver a verla las veces que necesites, a tu ritmo, y dejar que poco a poco vaya calando en tu propia práctica. Iré ampliando esta colección con nuevas entregas, así que este es un espacio que crecerá contigo.
              </p>
            </div>
          </div>

          {/* Videos Subsection */}
          <div className="space-y-8 pt-4">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#800020]">
              Vídeos de NAGNA YOGA
            </h3>

            {/* 2x2 Video Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {videos.map((vid) => (
                <div
                  key={vid.id}
                  className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-md hover:shadow-xl transition duration-300 flex flex-col"
                >
                  <div className="relative aspect-video bg-stone-900 border-b border-stone-100">
                    <video
                      src={vid.src}
                      controls
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-contain bg-black"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="font-serif text-base sm:text-lg font-bold text-[#800020] mb-2">
                        {vid.num} {vid.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-[#1C1C1C]/75 leading-relaxed">
                        {vid.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Concluding Note */}
            <div className="bg-[#FAF9F6] p-6 rounded-xl border border-[#C5A059]/30 text-center space-y-2 mt-8">
              <p className="text-xs sm:text-sm text-[#1C1C1C]/85 font-medium leading-relaxed max-w-3xl mx-auto">
                Muy pronto iré añadiendo más vídeos y contenidos a esta colección. Si alguno de ellos despierta en ti una pregunta, tráela a clase: el Nagna Yoga también se sigue construyendo entre tod@s.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Sección Detallada 2: EL ESPACIO PARA MEJORAR LAS ASANAS */}
      <AsanasSection />
    </div>
  );
}
