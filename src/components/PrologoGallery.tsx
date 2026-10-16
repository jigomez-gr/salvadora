"use client";

import { useState } from "react";
import { ChevronRight, Play } from "lucide-react";

interface PrologueItem {
    src: string;
    title: string;
    category: string;
    isVideo?: boolean;
    poster?: string;
}

const PROLOGUE_ITEMS: PrologueItem[] = [
    {
        src: "/imagenes/yoga/01_05_yoga_sala_centro_1920x1080.jpg",
        title: "Nuestra Sala de Práctica",
        category: "ESPACIO DE YOGA FUENLABRADA"
    },
    {
        src: "/imagenes/yoga/03_02_yoga_postura_brazos_arriba_1920x1080.jpg",
        title: "Nagna Yoga y Respiración",
        category: "EQUILIBRIO, FUERZA Y APERTURA"
    },
    {
        src: "/imagenes/yoga/02_08_yoga_sonrisa_1920x1080.jpg",
        title: "Armonía Interior",
        category: "BIENESTAR Y SALUD INTEGRAL"
    },
    {
        src: "/imagenes/gong/04_maria_con_cuenco_y_gong_1920x1080.jpg",
        title: "Sesión de Baño de Gong",
        category: "RELAJACIÓN CON TERAPIA DE SONIDO"
    },
    {
        src: "/imagenes/ayuno_terapeutico/301_ayuno_terapeutico_bienestar_natural_1920x1080.jpg",
        title: "Retiro y Ayuno Terapéutico",
        category: "DEPURACIÓN FÍSICA Y DESCONEXIÓN"
    }
];

export default function PrologoGallery() {
    const [selectedItem, setSelectedItem] = useState<PrologueItem>(PROLOGUE_ITEMS[0]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full items-stretch">
            {/* Main Container */}
            <div className="md:col-span-8 relative rounded-2xl overflow-hidden shadow-2xl border border-[#C5A059]/30 min-h-[400px] bg-black flex items-center justify-center">
                <img
                    src={selectedItem.src}
                    alt={selectedItem.title}
                    className="w-full h-full object-cover transition-all duration-700 hover:scale-105"
                />
                {/* Dark red gradient cover at the bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#800020]/95 via-black/20 to-transparent pointer-events-none" />

                {/* Rounded crown overlay style */}
                <div className="absolute bottom-6 left-6 right-6 flex items-center gap-4 text-white">
                    <div className="flex-shrink-0 w-11 h-11 rounded-full border border-[#E9C168] bg-[#800020]/60 flex items-center justify-center text-[#E9C168] shadow-md">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                            <path d="M12 2l2.5 5.5L20 8.5l-4.5 4 1.5 6-5-3-5 3 1.5-6-4.5-4 5.5-1z" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="font-serif text-xl sm:text-2xl font-bold tracking-wide">{selectedItem.title}</h4>
                        <p className="text-[9px] sm:text-[10px] tracking-[0.15em] text-[#E9C168] uppercase font-semibold font-sans mt-0.5">
                            {selectedItem.category}
                        </p>
                    </div>
                </div>
            </div>

            {/* Sidebar List of Items (al lado) */}
            <div className="md:col-span-4 flex flex-col h-[400px]">
                <h4 className="font-serif text-xs uppercase tracking-widest text-[#800020] font-bold mb-3 select-none">
                    Diapositivas
                </h4>
                <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar" style={{ maxHeight: "365px" }}>
                    {PROLOGUE_ITEMS.map((item, idx) => {
                        const isSelected = selectedItem.src === item.src;
                        return (
                            <button
                                key={idx}
                                onClick={() => setSelectedItem(item)}
                                className={`flex items-center gap-3 w-full p-2 rounded-lg border text-left transition duration-200 ${isSelected
                                    ? "bg-[#800020]/5 border-[#800020] shadow-sm shadow-[#800020]/5"
                                    : "bg-white border-stone-150 hover:bg-stone-50 hover:border-[#C5A059]/30"
                                    }`}
                            >
                                <div className="relative w-16 h-12 rounded overflow-hidden flex-shrink-0 bg-stone-100 border border-stone-200">
                                    <img
                                        src={item.src}
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0 pr-1">
                                    <h5 className="font-serif text-xs font-bold text-stone-900 truncate">
                                        {item.title}
                                    </h5>
                                    <span className="block text-[8px] tracking-wider text-[#C5A059] font-bold uppercase truncate mt-0.5">
                                        {item.category}
                                    </span>
                                </div>
                                <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? "text-[#800020]" : "text-stone-400"
                                    }`} />
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
