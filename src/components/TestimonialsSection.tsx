"use client";

export default function TestimonialsSection() {
  const testimonials = [
    {
      id: "1",
      name: "Marijose Jiménez",
      quote:
        '"Llevo 18 años practicando en la Escuela de Salvadora Conesa. Su escuela es más que eso, es un lugar acogedor donde realizar la práctica de yoga en un entorno seguro y amoroso. Salvadora es una gran maestra, sabe escuchar a todos sus alumn@s, adaptando las asanas a cada necesidad particular. Además, puedes contar con su apoyo y consejo en cualquier momento. "Es una suerte que nuestros caminos se encontraran."',
    },
    {
      id: "2",
      name: "Araceli Carrillo",
      quote:
        '"Me llamo Araceli Carrillo, hace años empecé a buscar algo donde conseguir más elasticidad en mi cuerpo. Tuve la gran suerte de encontrar la escuela de Salvadora Conesa y allí sigo desde hace 22 años.\n\nNo solo he conseguido esa elasticidad en mi cuerpo, sino también en mi mente, mejorando mi forma de ver y afrontar la vida. De mejorar el día a día. De las clases me gusta todo, la gimnasia, las asanas, la relajación, y también los consejos que siempre nos da Salvadora, para cuidar nuestro cuerpo, nuestra alimentación, nuestras relaciones con los demás.',
    },
    {
      id: "3",
      name: "I. Vaz",
      quote:
        'Soy I. Vaz, llevo 4 años practicando en la Escuela de de Yoga de Salvadora Conesa.\n\nPara mi descubrir el yoga ha sido un cambio radical tanto a nivel físico como mental dándome un tiempo único y exclusivo solo para mi . Siempre agradecida de que la pusieran en mi camino.',
    },
  ];

  return (
    <section id="testimonios" className="py-20 bg-[#FAF9F6] border-t border-[#C5A059]/20 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div>
          <h2 className="font-sans text-2xl sm:text-3xl font-bold text-[#1C1C1C] tracking-tight">
            Testimonios de los Alumnos/as
          </h2>
        </div>

        {/* 3 Testimonial Cards (matching Image 2) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-[#EAEAEA] rounded-2xl p-6 sm:p-8 shadow-sm border border-stone-300/60 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <h3 className="font-sans text-base sm:text-lg font-bold text-[#1C1C1C]">
                  {t.name}
                </h3>
                <p className="text-xs sm:text-sm text-[#1C1C1C]/80 leading-relaxed whitespace-pre-line font-sans">
                  {t.quote}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
