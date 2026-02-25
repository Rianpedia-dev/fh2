"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { MotionDiv } from "./motion-wrapper";
import { Scale } from "lucide-react";

interface HeroMediaSliderProps {
    images: string[];
    universityName: string;
}

export function HeroMediaSlider({ images, universityName }: HeroMediaSliderProps) {
    const [emblaRef] = useEmblaCarousel({ loop: true }, [
        Autoplay({ delay: 5000, stopOnInteraction: false }),
    ]);

    if (images.length === 0) {
        return (
            <div className="w-full h-full bg-gradient-to-br from-brand-navy to-brand-navy-light flex items-center justify-center p-12">
                <div className="relative text-center">
                    <MotionDiv
                        className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                        <Scale className="w-10 h-10 text-brand-gold" />
                    </MotionDiv>
                    <div className="space-y-2">
                        <p className="text-2xl font-bold text-white tracking-widest">{universityName}</p>
                        <div className="h-1 w-12 bg-brand-red mx-auto rounded-full"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-full overflow-hidden" ref={emblaRef}>
            <div className="flex w-full h-full">
                {images.map((src, index) => (
                    <div key={index} className="relative flex-[0_0_100%] h-full">
                        <img
                            src={src}
                            alt={`Hero slide ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                        {/* Subtle overlay to blend with the UI */}
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/40 to-transparent" />
                    </div>
                ))}
            </div>


        </div>
    );
}
