"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AtmosphereCardProps {
    dayNum: number;
    title: string;
    subtitle: string;
    href: string;
    mainImage: string;
    subImages: string[];
}

export default function AtmosphereCard({
    dayNum,
    title,
    subtitle,
    href,
    mainImage,
    subImages
}: AtmosphereCardProps) {
    const [viewMode, setViewMode] = useState<"main" | "list">("main");
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrev = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentIndex((prev) => (prev === 0 ? subImages.length - 1 : prev - 1));
    };

    const handleNext = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentIndex((prev) => (prev === subImages.length - 1 ? 0 : prev + 1));
    };

    const activeImage = viewMode === "main" ? mainImage : subImages[currentIndex];

    return (
        <div className="flex flex-col overflow-hidden rounded-xl border border-[#C5A059]/20 shadow-sm hover:shadow-md transition bg-white font-sans">
            {/* Visual Image container / link wrapper */}
            <a
                href={href}
                className="relative aspect-[4/3] overflow-hidden group/img block select-none bg-stone-100"
            >
                <img
                    src={`${activeImage}?v=2`}
                    alt={title}
                    className="w-full h-full object-cover group-hover/img:scale-105 transition duration-700"
                />

                {/* Ambient Dark/Red Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent group-hover/img:from-[#800020]/90 group-hover/img:via-[#800020]/25 group-hover/img:to-transparent transition duration-300 flex flex-col justify-end p-5 text-white">
                    <h4 className="font-serif text-base sm:text-lg font-bold text-white tracking-wide leading-snug">
                        {title}
                    </h4>
                    <p className="text-[10px] sm:text-xs italic text-stone-200 mt-1 font-serif">
                        {subtitle} &rarr;
                    </p>
                </div>

                {/* Slideshow Arrows (only in list mode if there's more than one sub-image) */}
                {viewMode === "list" && subImages.length > 1 && (
                    <>
                        <button
                            onClick={handlePrev}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-[#800020] text-white flex items-center justify-center transition z-20"
                            aria-label="Imagen anterior"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleNext}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-[#800020] text-white flex items-center justify-center transition z-20"
                            aria-label="Siguiente imagen"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                        {/* Slide page label */}
                        <span className="absolute top-3 right-3 bg-black/70 px-2 py-0.5 rounded text-[8px] text-white font-bold font-sans uppercase tracking-wider z-20">
                            Foto {currentIndex + 1} de {subImages.length}
                        </span>
                    </>
                )}
            </a>

            {/* Horizontal thumbnail list (only showing if viewMode is list) */}
            {viewMode === "list" && subImages.length > 0 && (
                <div className="flex gap-1.5 overflow-x-auto p-2 bg-stone-50 border-t border-stone-200 scrollbar-none select-none">
                    {subImages.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setCurrentIndex(idx);
                            }}
                            className={`w-12 h-9 rounded overflow-hidden flex-shrink-0 border-2 transition ${currentIndex === idx
                                ? "border-[#800020] opacity-100"
                                : "border-transparent opacity-50 hover:opacity-100"
                                }`}
                        >
                            <img src={img} alt="" className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}

            {/* Selector at the foot of each card */}
            <div className="bg-stone-50 border-t border-stone-150 p-2.5 rounded-b-xl flex items-center justify-between text-xs select-none">
                <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">
                    Selección:
                </span>
                <div className="flex border border-stone-300 rounded overflow-hidden text-[9px] font-bold uppercase tracking-wider">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setViewMode("main");
                        }}
                        className={`px-3 py-1 transition ${viewMode === "main"
                            ? "bg-[#800020] text-white"
                            : "bg-white text-stone-600 hover:text-[#800020]"
                            }`}
                    >
                        Foto Principal
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setViewMode("list");
                        }}
                        className={`px-3 py-1 transition ${viewMode === "list"
                            ? "bg-[#800020] text-white"
                            : "bg-white text-stone-600 hover:text-[#800020]"
                            }`}
                        disabled={subImages.length === 0}
                    >
                        Galeria ({subImages.length})
                    </button>
                </div>
            </div>
        </div>
    );
}
