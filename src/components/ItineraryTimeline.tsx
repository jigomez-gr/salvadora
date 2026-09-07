"use client";

import { useState, useEffect } from "react";
import { Music, MapPin, Calendar, Clock, Utensils, CheckCircle, MessageSquare, Maximize2, X, Sparkles } from "lucide-react";
import { triggerCrmChat } from "@/components/ChatBubbleWidget";

interface TimelineDay {
    id: number;
    date: string;
    dayName: string;
    title: string;
    desc: string;
    events: {
        time?: string;
        title: string;
        description: string;
        type: "visit" | "concert" | "meal" | "transport";
        venue?: string;
    }[];
}

const ITIN_DATA: TimelineDay[] = [
    {
        id: 1,
        date: "Yoga",
        dayName: "Hatha Yoga & Yoga Nidra",
        title: "Prácticas de Alineación Física, Respiración y Relajación Mental Consciente",
        desc: "",
        events: [
            {
                time: "Semanal",
                title: "Hatha Yoga",
                description: "Hatha Yoga con enfoque terapéutico: consiste en una primera parte de activación, gimnasia o estiramientos; una segunda parte de práctica de asanas (posturas que se mantienen estáticas durante un minuto aproximadamente y te aporta diferentes beneficios); y terminamos siempre con una relajación.",
                type: "visit",
                venue: "Sala Principal",
            },
            {
                time: "Vídeos",
                title: "Yoga del Conocimiento",
                description: "Actualmente solo se realiza a través de vídeos informativos.",
                type: "visit",
                venue: "Online",
            },
            {
                time: "Sesiones",
                title: "Yoga Nidra",
                description: "El yoga del sueño psíquico. Una técnica de meditación y relajación profunda que equivale a varias horas de sueño para regenerar el sistema nervioso.",
                type: "visit",
                venue: "Sala Principal",
            },
        ],
    },
    {
        id: 2,
        date: "Meditación",
        dayName: "Kundalini Yoga & Meditación",
        title: "Tecnología de la Consciencia para la Energía Vital y el Silencio",
        desc: "",
        events: [
            {
                time: "Semanal",
                title: "Kriyas y Mantras",
                description: "Sesiones de yoga energético que combinan asanas dinámicas, pranayamas potentes, mudras y cantos de mantras sagrados.",
                type: "visit",
                venue: "Sala Principal",
            },
            {
                time: "Meditación",
                title: "Práctica de Silencio y Presencia",
                description: "Técnicas de observación y concentración mental orientadas al autoconocimiento, la atención plena y la reducción del estrés diario.",
                type: "visit",
                venue: "Sala de Silencio",
            },
        ],
    },
    {
        id: 3,
        date: "Baños de Gong",
        dayName: "Baños de Gong",
        title: "Terapia Vibracional con Gong y Cuencos Celestiales",
        desc: "",
        events: [
            {
                time: "Taller mensual",
                title: "Bañarse en Sonido",
                description: "Inmersión en ondas sonoras de frecuencias sanadoras producidas por gongs y cuencos tibetanos de cuarzo.",
                type: "concert",
                venue: "Sala Principal",
            },
            {
                time: "Efectos",
                title: "Armonización Integral",
                description: "Disolución de bloqueos físicos e inestabilidad emocional induciendo estados alfa y theta cerebrales.",
                type: "concert",
            },
        ],
    },
    {
        id: 4,
        date: "Puja de Gong",
        dayName: "La Puja de Gong",
        title: "Celebración Sagrada del Sonido Eterno y Transformación Espiritual",
        desc: "",
        events: [
            {
                time: "22:00 h",
                title: "Preparación y Bienvenida",
                description: "Recepción de los participantes, preparación de los espacios de descanso y meditación preliminar grupal.",
                type: "visit",
                venue: "Sala Principal",
            },
            {
                time: "23:00 h",
                title: "Comienzo de la Puja",
                description: "Inicio del toque ininterrumpido de múltiples gongs por relevos a lo largo de toda la noche (8 horas).",
                type: "concert",
                venue: "Sala Principal",
            },
            {
                time: "07:00 h",
                title: "Despertar y Compartir",
                description: "Finalización de la vibración del gong, retorno suave a la consciencia y desayuno compartido de integración.",
                type: "meal",
                venue: "Patio Interior",
            },
        ],
    },
    {
        id: 5,
        date: "Gestalt",
        dayName: "Terapia Gestalt",
        title: "Espacio de Presencia, Autoconocimiento y Acompañamiento Gestáltico",
        desc: "",
        events: [
            {
                time: "Consulta",
                title: "Sesión Individual de Terapia",
                description: "Espacio terapéutico personalizado enfocado en el aquí y ahora, ayudando a resolver bloqueos y potenciar la automaternidad.",
                type: "visit",
                venue: "Sala de Terapia",
            },
            {
                time: "Gestalt",
                title: "Acompañamiento en Procesos",
                description: "Enfoque humanista para transitar duelos, relaciones conflictivas, ansiedad o procesos de cambio personal.",
                type: "visit",
                venue: "Sala de Terapia",
            },
        ],
    },
    {
        id: 6,
        date: "Constelaciones",
        dayName: "Constelaciones Familiares",
        title: "Sanación Transgeneracional y Ordenación de los Vínculos del Corazón",
        desc: "",
        events: [
            {
                time: "Talleres",
                title: "Taller para Constelar y Participar",
                description: "Representación grupal de dinámicas familiares inconscientes para traer claridad, orden y reconciliación a los lazos.",
                type: "visit",
                venue: "Sala Principal",
            },
            {
                time: "Sistémica",
                title: "Mirada y Comprensión Familiar",
                description: "Ejercicios sistémicos de integración y reconciliación para sanar implicaciones profundas transgeneracionales.",
                type: "visit",
                venue: "Sala Principal",
            },
        ],
    },
    {
        id: 7,
        date: "Encuentros",
        dayName: "Encuentros de Mujeres",
        title: "Espacios de Sororidad, Cuidado Compartido y Reconexión Femenina",
        desc: "",
        events: [
            {
                time: "Círculos",
                title: "Dinámica y Diálogos al Fuego",
                description: "Espacio circular de escucha empática, silencio y rituales compartidos frente a la hoguera en naturaleza.",
                type: "visit",
                venue: "Hospedería del Retiro",
            },
            {
                time: "Naturaleza",
                title: "Movimiento y Senderismo Consciente",
                description: "Paseos grupales combinando respiración, expresión corporal y conexión profunda con los elementos terrestres.",
                type: "visit",
                venue: "Entorno Natural",
            },
        ],
    },
    {
        id: 8,
        date: "Ayuno",
        dayName: "Ayuno Terapéutico y Retiros",
        title: "Procesos de Depuración Orgánica, Desintoxicación y Meditación en la Naturaleza",
        desc: "",
        events: [
            {
                time: "Retiros",
                title: "Fin de Semana Consciente",
                description: "Encuentros residenciales en plena naturaleza dedicados a la sanación, el ayuno, el yoga y la introspección guiada.",
                type: "visit",
                venue: "Hospedería del Retiro",
            },
            {
                time: "Limpieza",
                title: "Nutrición Celular y Caldos",
                description: "Acompañamiento integrativo con caldos depurativos ecológicos, zumos verdes de temporada e infusiones de hierbas orgánicas.",
                type: "meal",
            },
        ],
    },
    {
        id: 9,
        date: "Varios",
        dayName: "Colaboradores y Otras Disciplinas",
        title: "Formaciones Complementarias y Salud con Diversos Especialistas",
        desc: "",
        events: [
            {
                time: "Salud",
                title: "Entrenamiento Funcional, Ninjutsú y Taichí",
                description: "Sesiones especiales impartidas por distinguidos colaboradores para cultivar fuerza, autodefensa consciente, flexibilidad y equilibrio dinámico.",
                type: "visit",
                venue: "Zonas específicas",
            },
            {
                time: "Formación",
                title: "Talleres Temáticos Especiales",
                description: "Seminarios mensuales sobre salud integral, terapias alternativas, Kai sai Budo y técnicas avanzadas de meditación y consciencia.",
                type: "visit",
                venue: "Sala Multiusos",
            },
        ],
    },
];

interface ItineraryTimelineProps {
    videosExist: {
        "itinerario-1": boolean;
        "itinerario-2": boolean;
        "itinerario-3": boolean;
        "itinerario-4": boolean;
        "itinerario-5": boolean;
        "itinerario-6": boolean;
        "itinerario-7": boolean;
        "itinerario-8": boolean;
        "itinerario-9": boolean;
        resumen: boolean;
    };
}

const DAY_THUMBNAILS: { [key: number]: { src: string; caption: string } } = {
    1: {
        src: "/imagenes/gong/01_presentacion_terapeutas_1920x1080.jpg",
        caption: "Nagna Yoga & Yoga Nidra"
    },
    2: {
        src: "/imagenes/meditacion/01_meditacion_silencio_ventana_1920x1080.jpg",
        caption: "Kundalini & Meditación diaria"
    },
    3: {
        src: "/imagenes/gong/04_maria_con_cuenco_y_gong_1920x1080.jpg",
        caption: "Sesiones y Baños de Gong"
    },
    4: {
        src: "/imagenes/gong/06_experiencia_de_relajacion_sonora_1920x1080.jpg",
        caption: "La Ceremonia de la Puja de Gong"
    },
    5: {
        src: "/imagenes/gestalt/01_gestalt_consulta_intima_1920x1080.jpg",
        caption: "Acompañamiento Gestalt"
    },
    6: {
        src: "/imagenes/constelaciones/101_constelaciones_circulo_sereno_1920x1080.jpg",
        caption: "Constelaciones Familiares"
    },
    7: {
        src: "/imagenes/encuentro_mujeres/01_encuentro_mujeres_movimiento_naturaleza.jpeg",
        caption: "Encuentros de Mujeres"
    },
    8: {
        src: "/imagenes/ayuno_terapeutico/ayunos_arreglados/201_ayuno_bienvenida_y_colores_1920x1080.jpg",
        caption: "Retiros de Ayuno Terapéutico"
    },
    9: {
        src: "/imagenes/centro/401_interior_centro_yoga_1920x1080.jpg",
        caption: "Nuestros Colaboradores y Centro"
    }
};

const DAY_OVERLAY_DETAILS: { [key: number]: { title: string; category: string; description: string; date: string } } = {
    1: {
        title: "Nagna Yoga & Nidra",
        category: "ALINEACIÓN Y SUEÑO CONSCIENTE",
        description: "Clases semanales para calmar la mente y reequilibrar el sistema muscular",
        date: "Clases Semanales"
    },
    2: {
        title: "Kundalini & Meditaciones",
        category: "TECNOLOGÍA DE LA CONSCIENCIA",
        description: "Sesiones de pranayama, kriyas y cantos de mantras",
        date: "Clases Semanales"
    },
    3: {
        title: "Baños de Gong",
        category: "TERAPIA VIBRACIONAL DE SONIDO",
        description: "Sumérgete en frecuencias sonoras de sanación y restauración",
        date: "Talleres Mensuales"
    },
    4: {
        title: "La Gran Puja de Gong",
        category: "CEREMONIA NOCTURNA DE 8 HORAS",
        description: "Toque ininterrumpido de gongs por relevos durante la noche",
        date: "Eventos Especiales"
    },
    5: {
        title: "Terapia Gestalt",
        category: "ACOMPAÑAMIENTO HUMANISTA",
        description: "Sesiones terapéuticas presenciales y online de autoconocimiento",
        date: "Consulta Semanal"
    },
    6: {
        title: "Constelaciones Familiares",
        category: "TERAPIA SISTÉMICA",
        description: "Talleres vivenciales para ordenar e integrar los vínculos amorosos",
        date: "Talleres Populares"
    },
    7: {
        title: "Encuentros de Mujeres",
        category: "SENDERISMO Y COMUNIDAD",
        description: "Círculos de diálogo empático, naturaleza, risas y sororidad",
        date: "Encuentros Trimestrales"
    },
    8: {
        title: "Ayuno Terapéutico",
        category: "RETIROS EN LA NATURALEZA",
        description: "Limpieza orgánica, senderismo consciente y descanso integral",
        date: "Retiros Anuales"
    },
    9: {
        title: "Otras Disciplinas y Más",
        category: "COLABORADORES Y FORMACIONES",
        description: "Taichí, Ninjutsú, Defensa personal y talleres de salud",
        date: "Programación Abierta"
    }
};

const ITINERARY_VIDEOS: { [key: number]: { title: string; filePath: string; youtubeUrl?: string }[] } = {
    1: [
        { title: "Vídeo Nagna Yoga", filePath: "/videos/itinerario-1.mp4" }
    ],
    2: [
        { title: "Vídeo Kundalini", filePath: "/videos/itinerario-2.mp4" }
    ],
    3: [
        { title: "Vídeo Baño Gong", filePath: "/videos/itinerario-3.mp4" }
    ],
    4: [
        { title: "Vídeo Puja Gong", filePath: "/videos/itinerario-4.mp4" }
    ],
    5: [
        { title: "Vídeo Gestalt", filePath: "/videos/itinerario-5.mp4" }
    ],
    6: [
        { title: "Vídeo Constelaciones", filePath: "/videos/itinerario-6.mp4" }
    ],
    7: [
        { title: "Vídeo Encuentros", filePath: "/videos/itinerario-7.mp4" }
    ],
    8: [
        { title: "Vídeo Ayuno", filePath: "/videos/itinerario-8.mp4" }
    ],
    9: [
        { title: "Vídeo Centro", filePath: "/videos/itinerario-9.mp4" }
    ]
};

interface ActivityFlyer {
    title: string;
    imagePath: string;
}

const ACTIVITY_FLYERS: { [key: number]: ActivityFlyer[] } = {
    1: [
        { title: "Flyer Yoga", imagePath: "/flyers/yoga.jpeg" }
    ],
    2: [
        { title: "Flyer Meditación", imagePath: "/flyers/meditacion.jpeg" }
    ],
    3: [
        { title: "Flyer Baños de Gong", imagePath: "/flyers/banogong.jpeg" }
    ],
    4: [
        { title: "Flyer Puja de Gong", imagePath: "/flyers/banogong.jpeg" }
    ],
    5: [
        { title: "Flyer Gestalt", imagePath: "/flyers/gestalt.jpeg" }
    ],
    6: [
        { title: "Flyer Constelaciones", imagePath: "/flyers/constalaciones.jpeg" }
    ],
    7: [
        { title: "Flyer Encuentros", imagePath: "/flyers/encuentros_mujeres.jpeg" }
    ],
    8: [
        { title: "Flyer Ayuno Terapéutico", imagePath: "/flyers/ayuno.jpeg" }
    ],
    9: [
        { title: "Iaidō (Katana)", imagePath: "/flyers/iaido.jpg" },
        { title: "Intenta (Salud)", imagePath: "/flyers/intenta.jpeg" },
        { title: "Bienestar", imagePath: "/flyers/bienestar.png" }
    ]
};

const ACTIVITY_BOOKING_MESSAGES: { [key: number]: { title: string; subtitle: string; queryMessage: string } } = {
    1: {
        title: "Nagna Yoga & Yoga Nidra",
        subtitle: "Prácticas de alineación corporal, respiración terapéutica y sueño psíquico reparador.",
        queryMessage: "Hola, me gustaría consultar horarios y reservar plaza para Nagna Yoga / Yoga Nidra."
    },
    2: {
        title: "Kundalini Yoga & Meditación Guiada",
        subtitle: "Tecnología de la consciencia, kriyas de vitalidad y meditación en el silencio.",
        queryMessage: "Hola, me gustaría consultar y reservar plaza para Kundalini Yoga y Meditaciones Guiadas."
    },
    3: {
        title: "Baños de Gong y Armonización Sonora",
        subtitle: "Taller mensual de inmersión en frecuencias regenerativas de gongs sinfónicos.",
        queryMessage: "Hola, me gustaría consultar disponibilidad y reservar plaza para los Baños de Gong."
    },
    4: {
        title: "La Ceremonia Puja de Gong (11h)",
        subtitle: "Noche sagrada de sonido ininterrumpido con relevo de maestros de gong.",
        queryMessage: "Hola, me gustaría consultar fechas y reservar plaza para la Ceremonia Puja de Gongs."
    },
    5: {
        title: "Terapia Gestalt Individual",
        subtitle: "Espacio terapéutico personalizado de presencia, integración y autoconocimiento.",
        queryMessage: "Hola, me gustaría solicitar cita o información para sesiones de Terapia Gestalt."
    },
    6: {
        title: "Talleres de Constelaciones Familiares",
        subtitle: "Representación sistémica y sanación profunda de los vínculos familiares.",
        queryMessage: "Hola, me gustaría consultar y reservar plaza para el Taller de Constelaciones Familiares."
    },
    7: {
        title: "Encuentros de Mujeres",
        subtitle: "Círculos de palabra, sororidad, cuidado mutuo y reconexión en la naturaleza.",
        queryMessage: "Hola, me gustaría consultar fechas y reservar para los Encuentros de Mujeres."
    },
    8: {
        title: "Retiros de Ayuno Terapéutico",
        subtitle: "Encuentros de desintoxicación, nutrición celular consciente y senderismo pacífico.",
        queryMessage: "Hola, me gustaría consultar disponibilidad y reservar plaza para el Retiro de Ayuno Terapéutico."
    },
    9: {
        title: "Bienestar Experience (Longevidad & Salud Integral)",
        subtitle: "Programa integral de hábitos saludables, longevidad, biohacking y vitalidad.",
        queryMessage: "Hola, me gustaría consultar y reservar para Bienestar Experience (Longevidad & Salud Integral)."
    }
};

export default function ItineraryTimeline({ videosExist }: ItineraryTimelineProps) {
    const [activeVideoIndexes, setActiveVideoIndexes] = useState<{ [key: number]: number }>({
        1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0
    });
    const [timelineMediaTypes, setTimelineMediaTypes] = useState<{ [key: number]: "completo" | "resumen" }>({
        1: "completo", 2: "completo", 3: "completo", 4: "completo", 5: "completo", 6: "completo", 7: "completo", 8: "completo", 9: "completo"
    });

    const [activeDay, setActiveDay] = useState(1);

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash;
            if (hash.startsWith("#dia-")) {
                const dayNum = parseInt(hash.replace("#dia-", ""), 10);
                if (dayNum >= 1 && dayNum <= 9) {
                    setActiveDay(dayNum);
                    setTimeout(() => {
                        const el = document.getElementById("itinerario");
                        if (el) {
                            el.scrollIntoView({ behavior: "smooth", block: "start" });
                        }
                    }, 80);
                }
            }
        };

        handleHashChange();

        window.addEventListener("hashchange", handleHashChange);
        return () => window.removeEventListener("hashchange", handleHashChange);
    }, []);

    const [selectedModes, setSelectedModes] = useState<{ [key: number]: "summary" | "flyer" | "booking" }>({
        1: "summary",
        2: "summary",
        3: "summary",
        4: "summary",
        5: "summary",
        6: "summary",
        7: "summary",
        8: "summary",
        9: "summary"
    });

    const [activeFlyerIndexes, setActiveFlyerIndexes] = useState<{ [key: number]: number }>({
        1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0
    });

    const [modalFlyer, setModalFlyer] = useState<{ src: string; title: string } | null>(null);

    const currentMode = selectedModes[activeDay] || "summary";

    const setMode = (dayId: number, mode: "summary" | "flyer" | "booking") => {
        setSelectedModes(prev => ({ ...prev, [dayId]: mode }));
    };

    const handleBookingTabClick = (dayId: number) => {
        setMode(dayId, "booking");
        const bookingInfo = ACTIVITY_BOOKING_MESSAGES[dayId];
        if (bookingInfo) {
            triggerCrmChat(bookingInfo.queryMessage, true);
        }
    };

    const getVideoKey = (dayId: number): keyof ItineraryTimelineProps["videosExist"] => {
        return `itinerario-${dayId}` as any;
    };

    const getVideoPath = (dayId: number): string => {
        return `/videos/itinerario-${dayId}.mp4`;
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Mobile Day Selector (Horizontal Scroll) */}
            <div className="flex sm:hidden overflow-x-auto pb-4 gap-2 scrollbar-none px-4 mb-4">
                {ITIN_DATA.map((day) => (
                    <button
                        key={day.id}
                        onClick={() => {
                            setActiveDay(day.id);
                        }}
                        className={`shrink-0 px-4 py-2 text-sm font-semibold rounded-full border transition-all ${activeDay === day.id
                            ? "bg-[#800020] text-white border-[#800020]"
                            : "bg-white text-[#1C1C1C]/75 border-stone-200"
                            }`}
                    >
                        {day.id} ({day.date})
                    </button>
                ))}
            </div>

            {/* Desktop Day Selector (Tabs) */}
            <div className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-9 border-b border-[#C5A059]/30 mb-8 px-4 sm:px-0 gap-2 text-center">
                {ITIN_DATA.map((day) => (
                    <button
                        key={day.id}
                        onClick={() => {
                            setActiveDay(day.id);
                        }}
                        className={`pb-3 text-center border-b-2 text-sm transition-all focus:outline-none w-full ${activeDay === day.id
                            ? "border-[#800020] text-[#800020] font-bold"
                            : "border-transparent text-[#1C1C1C]/60 hover:text-[#800020]"
                            }`}
                    >
                        <span className="block font-serif text-base md:text-lg">{day.id}</span>
                        <span className="block text-[10px] md:text-xs uppercase tracking-wider mt-0.5 font-semibold">{day.date}</span>
                    </button>
                ))}
            </div>

            {/* Selected Day Content with Split Layout */}
            {ITIN_DATA.map((day) => {
                if (day.id !== activeDay) return null;

                const videoKey = getVideoKey(day.id);
                const hasVideo = videosExist?.[videoKey];
                const thumb = DAY_THUMBNAILS[day.id];

                return (
                    <div key={day.id} className="animate-fadeIn grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 sm:px-0 items-start">

                        {/* LEFT COLUMN: Vertical event timeline (col-span-7) */}
                        <div className="lg:col-span-7 space-y-6">
                            {/* Day Header */}
                            <div className="border-l-4 border-[#800020] pl-4 sm:pl-6 py-1 bg-gradient-to-r from-[#FAF9F6] to-transparent rounded-r-md">
                                <span className="text-[#C5A059] font-serif italic text-sm uppercase tracking-wider block">
                                    {day.dayName}
                                </span>
                                <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mt-1 whitespace-pre-wrap">
                                    {day.title}
                                </h3>
                                {day.desc && (
                                    <p className="text-stone-600 mt-2 text-sm italic leading-relaxed">
                                        "{day.desc}"
                                    </p>
                                )}
                            </div>

                            {/* Events Vertical Timeline */}
                            <div className="relative border-l border-stone-200 ml-4 pl-6 sm:pl-8 py-3 space-y-6">
                                {day.events.map((evt, index) => (
                                    <div key={index} className="relative">
                                        {/* Timeline Dot Indicator */}
                                        <span className={`absolute -left-[37px] sm:-left-[41px] top-1.5 flex items-center justify-center w-7 h-7 rounded-full border-2 bg-white transition-all ${evt.type === "concert"
                                            ? "border-[#800020] text-[#800020] shadow-md ring-4 ring-[#800020]/10"
                                            : evt.type === "meal"
                                                ? "border-[#2E5A44] text-[#2E5A44]"
                                                : evt.type === "transport"
                                                    ? "border-[#C5A059] text-[#C5A059]"
                                                    : "border-stone-400 text-stone-600"
                                            }`}>
                                            {evt.type === "concert" ? (
                                                <Music className="w-3.5 h-3.5 animate-pulse" />
                                            ) : evt.type === "meal" ? (
                                                <Utensils className="w-3.5 h-3.5" />
                                            ) : (
                                                <CheckCircle className="w-3.5 h-3.5" />
                                            )}
                                        </span>

                                        {/* Event Details Card */}
                                        <div className={`p-4 rounded-lg border transition duration-200 ${evt.type === "concert"
                                            ? "bg-[#800020]/5 border-[#800020]/20 shadow-md shadow-[#800020]/5"
                                            : evt.type === "meal"
                                                ? "bg-[#2E5A44]/5 border-[#2E5A44]/15"
                                                : "bg-white border-stone-150 hover:border-[#C5A059]/30"
                                            }`}>
                                            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                                <div className="flex items-center space-x-2">
                                                    {evt.time && (
                                                        <span className="flex items-center text-[10px] font-bold uppercase tracking-wider text-[#C5A059] bg-[#C5A059]/10 px-2 py-0.5 rounded">
                                                            <Clock className="w-3 h-3 mr-1" />
                                                            {evt.time}
                                                        </span>
                                                    )}
                                                    <span className={`text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full ${evt.type === "concert"
                                                        ? "bg-[#800020]/15 text-[#800020]"
                                                        : evt.type === "meal"
                                                            ? "bg-[#2E5A44]/10 text-[#2E5A44]"
                                                            : evt.type === "transport"
                                                                ? "bg-[#C5A059]/15 text-[#C5A059]"
                                                                : "bg-stone-100 text-stone-600"
                                                        }`}>
                                                        {evt.type === "concert" ? "Música / Recital" : evt.type === "meal" ? "Gastronomía" : evt.type === "transport" ? "Trayecto" : "Visita Cultural"}
                                                    </span>
                                                </div>

                                                {evt.venue && (
                                                    <span className="inline-flex items-center text-xs text-[#1C1C1C]/65 font-medium">
                                                        <MapPin className="w-3 h-3 mr-1 text-[#C5A059]" />
                                                        {evt.venue}
                                                    </span>
                                                )}
                                            </div>

                                            <h4 className="font-serif text-base font-bold text-stone-900 mb-1">
                                                {evt.title}
                                            </h4>

                                            <p className="text-xs text-[#1C1C1C]/80 leading-relaxed whitespace-pre-wrap">
                                                {evt.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Multimedia display with toggle cards (col-span-5) */}
                        <div className="lg:col-span-5 lg:sticky lg:top-36 space-y-4 w-full">
                            <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#C5A059]/25 shadow-lg shadow-[#800020]/5 w-full">
                                {/* Title of the Multimedia Block */}
                                <div className="text-center pb-3 border-b border-[#C5A059]/10 mb-4 select-none">
                                    <h4 className="font-serif text-[#800020] uppercase font-bold text-xs sm:text-[13px] tracking-wider leading-snug">
                                        VIDEOS RESUMEN ACTIVIDAD , FLYERS Y RESERVAR CONSULTAR/ACTIVIDAD
                                    </h4>
                                </div>

                                {/* Mode Selector Toggle Tabs */}
                                <div className="flex border border-[#C5A059]/25 rounded-lg overflow-hidden text-[9px] sm:text-[10px] uppercase font-bold tracking-wider mb-4">
                                    <button
                                        onClick={() => setMode(day.id, "summary")}
                                        className={`flex-1 py-2 px-1 text-center transition focus:outline-none ${currentMode === "summary"
                                            ? "bg-[#800020] text-white"
                                            : "bg-[#FAF9F6] text-stone-600 hover:text-[#800020]"
                                            }`}
                                    >
                                        VIDEO RESUMEN DE LA ACTIVIDAD
                                    </button>
                                    <button
                                        onClick={() => setMode(day.id, "flyer")}
                                        className={`flex-1 py-2 px-1 text-center transition focus:outline-none border-x border-[#C5A059]/25 ${currentMode === "flyer"
                                            ? "bg-[#800020] text-white"
                                            : "bg-[#FAF9F6] text-stone-600 hover:text-[#800020]"
                                            }`}
                                    >
                                        FLYER
                                    </button>
                                    <button
                                        onClick={() => handleBookingTabClick(day.id)}
                                        className={`flex-1 py-2 px-1 text-center transition focus:outline-none ${currentMode === "booking"
                                            ? "bg-[#800020] text-white"
                                            : "bg-[#FAF9F6] text-stone-600 hover:text-[#800020]"
                                            }`}
                                    >
                                        RESERVAR Y CONSULTAR
                                    </button>
                                </div>

                                {/* Video or Summary Image or Flyer or Booking Box */}
                                <div className="relative aspect-video rounded-md overflow-hidden bg-stone-100 border border-stone-200 shadow-sm">
                                    {currentMode === "summary" ? (
                                        hasVideo ? (
                                            <div className="w-full h-full bg-[#1C1C1C] relative aspect-video">
                                                <video
                                                    src={getVideoPath(day.id)}
                                                    controls
                                                    playsInline
                                                    preload="metadata"
                                                    muted={false}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ) : (
                                            /* SUMMARY IMAGE WITH INTERPRETER-STYLE OVERLAY */
                                            <div
                                                onClick={() => setMode(day.id, "flyer")}
                                                className="relative w-full h-full cursor-pointer group"
                                                title="Haz clic para ver el flyer"
                                            >
                                                <img
                                                    src={thumb.src}
                                                    alt={thumb.caption}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                                />
                                                <div className="absolute inset-0 bg-black/45 group-hover:bg-[#800020]/65 transition-all duration-300 flex flex-col items-center justify-center p-6 text-center text-white">
                                                    <h5 className="text-[17px] sm:text-[19px] font-bold text-white tracking-wide leading-snug drop-shadow-sm">
                                                        {DAY_OVERLAY_DETAILS[day.id].title}
                                                    </h5>
                                                    <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-[#E9C168] mt-1.5 uppercase">
                                                        {DAY_OVERLAY_DETAILS[day.id].category}
                                                    </span>
                                                    <p className="text-[12px] sm:text-[13px] italic text-[#FAF9F6]/90 mt-2 font-serif font-light max-w-[280px]">
                                                        {DAY_OVERLAY_DETAILS[day.id].description}
                                                    </p>
                                                    <span className="text-[10px] text-stone-300 font-sans tracking-wider mt-2.5 opacity-85">
                                                        {DAY_OVERLAY_DETAILS[day.id].date}
                                                    </span>
                                                </div>
                                            </div>
                                        )
                                    ) : currentMode === "flyer" ? (
                                        /* FLYER DISPLAY */
                                        (() => {
                                            const dayFlyers = ACTIVITY_FLYERS[day.id] || [];
                                            const activeFIdx = activeFlyerIndexes[day.id] || 0;
                                            const currentFlyer = dayFlyers[activeFIdx] || dayFlyers[0] || { title: "Flyer", imagePath: "/flyers/yoga.jpeg" };
                                            return (
                                                <div
                                                    onClick={() => setModalFlyer({ src: currentFlyer.imagePath, title: currentFlyer.title })}
                                                    className="relative w-full h-full cursor-pointer group bg-stone-900 flex items-center justify-center overflow-hidden"
                                                    title="Haz clic para ver el flyer en alta resolución"
                                                >
                                                    <img
                                                        src={currentFlyer.imagePath}
                                                        alt={currentFlyer.title}
                                                        className="w-full h-full object-contain group-hover:scale-105 transition duration-500"
                                                    />
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-all duration-300 flex items-center justify-center pointer-events-none">
                                                        <span className="opacity-0 group-hover:opacity-100 bg-stone-950/85 text-white text-[11px] font-bold px-3.5 py-1.5 rounded-full backdrop-blur-xs flex items-center gap-1.5 transition-all transform translate-y-2 group-hover:translate-y-0 shadow-lg border border-white/20">
                                                            <Maximize2 className="w-3.5 h-3.5 text-[#E9C168]" /> Ampliar Flyer
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })()
                                    ) : (
                                        /* RESERVAR Y CONSULTAR CARD */
                                        (() => {
                                            const bookingInfo = ACTIVITY_BOOKING_MESSAGES[day.id] || ACTIVITY_BOOKING_MESSAGES[1];
                                            return (
                                                <div className="w-full h-full flex flex-col justify-between p-4 sm:p-5 bg-gradient-to-br from-[#FAF9F6] via-white to-[#FAF9F6] border border-[#C5A059]/30 rounded-md">
                                                    <div className="space-y-1.5 text-center">
                                                        <span className="inline-flex items-center gap-1 text-[9px] uppercase font-bold tracking-widest text-[#800020] bg-[#800020]/10 px-2.5 py-0.5 rounded-full border border-[#800020]/20">
                                                            <Sparkles className="w-3 h-3 text-[#C5A059]" />
                                                            Consulta & Reserva Inmediata
                                                        </span>
                                                        <h5 className="font-serif text-base sm:text-lg font-bold text-[#800020] leading-tight">
                                                            {bookingInfo.title}
                                                        </h5>
                                                        <p className="text-[11.5px] text-stone-600 leading-relaxed max-w-sm mx-auto">
                                                            {bookingInfo.subtitle}
                                                        </p>
                                                    </div>

                                                    <div className="space-y-2 pt-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => triggerCrmChat(bookingInfo.queryMessage, true)}
                                                            className="w-full py-2.5 px-3 bg-[#800020] hover:bg-[#800020]/90 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                                                        >
                                                            <MessageSquare className="w-4 h-4" />
                                                            <span>Abrir Asistente IA para Reservar</span>
                                                        </button>
                                                        <a
                                                            href={`https://wa.me/34695172625?text=${encodeURIComponent(bookingInfo.queryMessage)}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="w-full py-2 px-3 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-lg text-xs font-bold uppercase tracking-wider transition shadow-xs flex items-center justify-center gap-2 cursor-pointer text-center active:scale-98"
                                                        >
                                                            <span>WhatsApp Directo (695 172 625)</span>
                                                        </a>
                                                    </div>

                                                    <p className="text-[9.5px] text-stone-400 text-center pt-1">
                                                        Atención personalizada las 24 horas · Confirmación instantánea
                                                    </p>
                                                </div>
                                            );
                                        })()
                                    )}
                                </div>

                                {/* Multi-flyer selection buttons (e.g. for Day 9 Varios: iaido, intenta, bienestar) */}
                                {currentMode === "flyer" && (ACTIVITY_FLYERS[day.id]?.length || 0) > 1 && (
                                    <div className="mt-3 border-t border-stone-100 pt-3 select-none">
                                        <span className="block text-[8.5px] uppercase tracking-wider text-stone-400 font-bold mb-1.5">
                                            Seleccionar Flyer de la Actividad:
                                        </span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {ACTIVITY_FLYERS[day.id].map((fl, fIdx) => {
                                                const activeFIdx = activeFlyerIndexes[day.id] || 0;
                                                const isCur = activeFIdx === fIdx;
                                                return (
                                                    <button
                                                        key={fIdx}
                                                        type="button"
                                                        onClick={() => setActiveFlyerIndexes(prev => ({ ...prev, [day.id]: fIdx }))}
                                                        className={`text-[9.5px] uppercase tracking-wider font-bold py-1 px-2.5 rounded-md transition cursor-pointer ${isCur
                                                            ? "bg-[#800020] text-white shadow-xs"
                                                            : "bg-[#FAF9F6] text-stone-600 hover:bg-[#800020]/10 hover:text-[#800020] border border-stone-200"
                                                            }`}
                                                    >
                                                        {fl.title}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Caption at bottom of framed element */}
                                <div className="mt-3 text-center select-none text-[10px] border-t border-[#C5A059]/10 pt-3">
                                    <p className="font-serif italic font-bold text-[#800020] text-[11px]">
                                        "{thumb.caption}"
                                    </p>
                                    <p className="text-[9px] text-stone-400 mt-0.5">
                                        Copyright © Centro de Yoga Fuenlabrada Salvadora Conesa. Todos los derechos reservados.
                                    </p>
                                </div>
                            </div>

                            {/* Green Banners Block inside DIARIO VISUAL column (Only for Activity 1: Yoga) */}
                            {day.id === 1 && (
                                <div className="space-y-4">
                                    {/* Card 1: Nagna Yoga */}
                                    <a
                                        href="#nagna-yoga"
                                        className="block bg-gradient-to-br from-[#1E3E2B] via-[#2E5A44] to-[#1D3D2C] p-5 sm:p-6 rounded-xl border border-[#C5A059]/30 shadow-md hover:shadow-lg hover:scale-[1.01] transition duration-300 text-center text-white relative overflow-hidden group cursor-pointer"
                                    >
                                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
                                        <span className="text-[9px] tracking-[0.25em] text-[#C5A059] uppercase font-bold block mb-1.5">
                                            GNANI YOGA
                                        </span>
                                        <h4 className="font-serif text-lg sm:text-xl font-bold text-white mb-2 leading-tight">
                                            Nagna Yoga, <span className="italic text-[#E9C168]">el yoga del conocimiento</span>
                                        </h4>
                                        <p className="text-xs text-white/90 font-sans font-light mb-4 leading-relaxed">
                                            Un espacio vivo donde sigo compartiendo en pequeñas píldoras todo lo que el yoga me ha enseñando.
                                        </p>
                                        <div className="inline-flex items-center space-x-1 text-[10px] uppercase font-bold tracking-widest text-[#E9C168] group-hover:underline pt-2 border-t border-white/10 w-full justify-center">
                                            <span>ver colección de vídeos de nagna yoga</span>
                                            <span>↓</span>
                                        </div>
                                    </a>

                                    {/* Card 2: Espacio para mejorar las Asanas */}
                                    <a
                                        href="#mejorar-asanas"
                                        className="block bg-gradient-to-br from-[#1E3E2B] via-[#2E5A44] to-[#1D3D2C] p-5 sm:p-6 rounded-xl border border-[#C5A059]/30 shadow-md hover:shadow-lg hover:scale-[1.01] transition duration-300 text-center text-white relative overflow-hidden group cursor-pointer"
                                    >
                                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
                                        <span className="text-[9px] tracking-[0.25em] text-[#C5A059] uppercase font-bold block mb-1.5">
                                            Espacio para mejorar las Asanas
                                        </span>
                                        <h4 className="font-serif text-lg sm:text-xl font-bold text-white mb-2 leading-tight">
                                            El espacio para <span className="italic text-[#E9C168]">mejorar las asanas</span>
                                        </h4>
                                        <p className="text-xs text-white/90 font-sans font-light mb-4 leading-relaxed">
                                            Pequeñas correcciones y gestos técnicos para afinar y transformar cada postura.
                                        </p>
                                        <div className="inline-flex items-center space-x-1 text-[10px] uppercase font-bold tracking-widest text-[#E9C168] group-hover:underline pt-2 border-t border-white/10 w-full justify-center">
                                            <span>ver colección de vídeos para mejorar las asanas</span>
                                            <span>↓</span>
                                        </div>
                                    </a>
                                </div>
                            )}
                        </div>

                    </div>
                );
            })}

            {/* Modal Lightbox for Flyer High-Resolution Viewing */}
            {modalFlyer && (
                <div
                    className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex flex-col items-center justify-center p-3 sm:p-6 animate-in fade-in"
                    onClick={() => setModalFlyer(null)}
                >
                    <div
                        className="relative max-w-4xl w-full max-h-[92vh] bg-stone-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-white/20"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between px-4 py-3 bg-[#800020] text-white">
                            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">{modalFlyer.title}</span>
                            <button
                                type="button"
                                onClick={() => setModalFlyer(null)}
                                aria-label="Cerrar vista previa"
                                className="p-1 rounded-lg hover:bg-white/20 text-white cursor-pointer transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="overflow-auto max-h-[calc(92vh-60px)] p-2 sm:p-4 bg-stone-950 flex items-center justify-center">
                            <img
                                src={modalFlyer.src}
                                alt={modalFlyer.title}
                                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-md"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
