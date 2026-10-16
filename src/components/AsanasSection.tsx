"use client";

export default function AsanasSection() {
  const videos = [
    {
      id: "1",
      num: "I.",
      title: "Corrección básica",
      description:
        "Un ajuste sencillo que marca la diferencia en la base de la postura: cómo colocar bien los apoyos para sostener el resto del cuerpo con menos esfuerzo y más estabilidad.",
      src: "/videos/el_espacio_para_mejorar_las_asanas/correccion1.mp4",
    },
    {
      id: "2",
      num: "II.",
      title: "Corrección básica",
      description:
        "Seguimos afinando el detalle: una segunda corrección muy sencilla para ganar estabilidad y evitar compensaciones innecesarias en la postura.",
      src: "/videos/el_espacio_para_mejorar_las_asanas/correccion2.mp4",
    },
    {
      id: "3",
      num: "III.",
      title: "Saludo al sol",
      description:
        "La secuencia completa del saludo al sol, paso a paso, para integrar estas correcciones en una práctica fluida, consciente y bien alineada de principio a fin.",
      src: "/videos/el_espacio_para_mejorar_las_asanas/saludo_al_sol.mp4",
    },
  ];

  return (
    <section id="mejorar-asanas" className="scroll-mt-24 pt-8 border-t border-[#C5A059]/20">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* Section Header */}
        <div className="space-y-4">
          <span className="text-xs uppercase tracking-widest text-[#C5A059] font-bold block">
            Correcciones y Ajustes Técnicos
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#800020]">
            EL ESPACIO PARA MEJORAR LAS ASANAS
          </h2>
          <div className="space-y-4 text-sm sm:text-base text-[#1C1C1C]/80 leading-relaxed font-sans bg-white p-6 sm:p-8 rounded-xl border border-[#C5A059]/20 shadow-sm">
            <p>
              El espacio para mejorar las asanas es justamente eso: un lugar donde detenernos en el detalle. A veces, la diferencia entre una postura que nos sostiene y otra que nos genera tensión no está en hacer "más", sino en ajustar "mejor". Aquí iré compartiendo correcciones breves y muy prácticas — pequeños gestos técnicos que, aplicados con constancia, cambian por completo cómo sentimos cada asana en el cuerpo.
            </p>
            <p>
              Son vídeos cortos, pensados para revisar antes o después de tu práctica, o para volver a ellos cada vez que notes que "algo no termina de encajar" en una postura. No sustituyen la atención de una clase en directo, pero sí te dan una herramienta sencilla para observarte con más precisión y seguir avanzando entre sesión y sesión.
            </p>
          </div>
        </div>

        {/* Videos Subsection */}
        <div className="space-y-8 pt-4">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#800020]">
            Vídeos
          </h3>

          {/* Video Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
              Iré ampliando poco a poco esta colección con nuevas correcciones. Si hay alguna postura concreta que te cuesta encajar, dímelo en clase: seguro que merece su propio vídeo.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
