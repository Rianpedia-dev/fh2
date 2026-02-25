"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

interface HeroSlide {
    id: number;
    title: string;
    subtitle?: string | null;
    description?: string | null;
    buttonText?: string | null;
    buttonLink?: string | null;
    imageUrl?: string | null;
}

interface HeroSliderProps {
    slides: HeroSlide[];
    universityName: string;
}

export default function HeroSlider({ slides, universityName }: HeroSliderProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
        Autoplay({ delay: 5000, stopOnInteraction: false }),
    ]);

    const scrollPrev = React.useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = React.useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    if (slides.length === 0) {
        return (
            <section className="relative overflow-hidden bg-brand-navy text-white min-h-[85vh] flex items-center">
                <div className="absolute inset-0 pattern-grid" />
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center w-full">
                    <h1 className="text-4xl font-bold">{universityName}</h1>
                </div>
            </section>
        );
    }

    return (
        <section className="relative overflow-hidden bg-brand-navy min-h-[85vh] flex items-center">
            {/* Background pattern (shared) */}
            <div className="absolute inset-0 pattern-grid z-10 pointer-events-none" />

            <div className="overflow-hidden w-full h-full" ref={emblaRef}>
                <div className="flex">
                    {slides.map((slide) => (
                        <div key={slide.id} className="relative flex-[0_0_100%] min-h-[85vh] flex items-center">
                            {/* Background Image */}
                            <div className="absolute inset-0 z-0">
                                {slide.imageUrl && (
                                    <Image
                                        src={slide.imageUrl}
                                        alt={slide.title}
                                        fill
                                        className="object-cover opacity-30"
                                        priority
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-r from-brand-navy via-brand-navy/80 to-transparent" />
                            </div>

                            <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32 w-full">
                                <div className="max-w-2xl">
                                    {/* Subtitle Badge */}
                                    {slide.subtitle && (
                                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                            <span className="flex h-2 w-2 rounded-full bg-brand-red animate-pulse" />
                                            <span className="text-sm text-white/80 font-medium">{slide.subtitle}</span>
                                        </div>
                                    )}

                                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08] mb-6 text-white animate-in fade-in slide-in-from-bottom-6 duration-1000">
                                        <span className="text-brand-gold">{slide.title}</span>
                                        <span className="block text-2xl sm:text-3xl lg:text-4xl font-normal text-white/70 mt-3 italic">
                                            {universityName}
                                        </span>
                                    </h1>

                                    {slide.description && (
                                        <p className="text-lg text-white/60 leading-relaxed mb-10 max-w-lg animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                                            {slide.description}
                                        </p>
                                    )}

                                    <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
                                        {slide.buttonText && slide.buttonLink && (
                                            <Button size="lg" asChild className="bg-gradient-to-r from-brand-red to-red-600 hover:from-red-700 hover:to-red-600 text-white text-base font-semibold px-8 shadow-lg shadow-red-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/30">
                                                <Link href={slide.buttonLink}>
                                                    {slide.buttonText}
                                                    <ArrowRight className="ml-2 h-4 w-4" />
                                                </Link>
                                            </Button>
                                        )}
                                        <Button size="lg" variant="outline" asChild className="text-base border-white/20 hover:bg-white/10 text-white bg-white/5 backdrop-blur-sm">
                                            <Link href="/profil">Tentang Kami</Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Controls */}
            {slides.length > 1 && (
                <div className="absolute bottom-8 right-8 z-30 flex items-center gap-3">
                    <button
                        onClick={scrollPrev}
                        className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-brand-red transition-all group shadow-xl"
                    >
                        <ChevronLeft className="h-6 w-6 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <button
                        onClick={scrollNext}
                        className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-brand-red transition-all group shadow-xl"
                    >
                        <ChevronRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            )}
        </section>
    );
}
