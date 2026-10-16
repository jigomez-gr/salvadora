"use client";

import AtmosphereCard from "./AtmosphereCard";

interface DayData {
    dayNum: number;
    title: string;
    subtitle: string;
    href: string;
    mainImage: string;
    subImages: string[];
}

interface AtmosphereGalleryProps {
    days: DayData[];
}

export default function AtmosphereGallery({ days }: AtmosphereGalleryProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {days.map((day) => (
                <AtmosphereCard
                    key={day.dayNum}
                    dayNum={day.dayNum}
                    title={day.title}
                    subtitle={day.subtitle}
                    href={day.href}
                    mainImage={day.mainImage}
                    subImages={day.subImages}
                />
            ))}
        </div>
    );
}
