"use client";

import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

interface Testimonial {
    id: string;
    name: string;
    role: string;
    content: string;
    image?: string | null;
    rating: number;
}

interface TestimonialsCarouselProps {
    testimonials: Testimonial[];
}

export function TestimonialsCarousel({ testimonials }: TestimonialsCarouselProps) {
    const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);

    return (
        <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-4 md:-ml-8">
                {testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.33%] pl-4 md:pl-8 py-10">
                        <Card className="h-full bg-[#1A1A1A] border-none shadow-2xl relative pt-12 rounded-[2rem]">
                            <CardContent className="p-8 flex flex-col h-full items-center text-center">
                                {/* Overlapping Avatar */}
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full border-4 border-[#1A1A1A] overflow-hidden bg-muted shadow-xl">
                                    {testimonial.image ? (
                                        <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-brand-red text-white font-bold text-2xl">
                                            {testimonial.name.charAt(0)}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-1 mb-4">
                                    <h4 className="font-bold text-white text-lg tracking-wide uppercase">{testimonial.name}</h4>
                                    <p className="text-brand-red font-bold text-[10px] tracking-[0.2em] uppercase">{testimonial.role}</p>
                                </div>

                                <div className="flex gap-1 mb-6">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            className={cn(
                                                "w-4 h-4",
                                                i < testimonial.rating ? "fill-brand-gold text-brand-gold" : "text-white/10"
                                            )}
                                        />
                                    ))}
                                </div>

                                <div className="relative">
                                    <Quote className="absolute -top-2 -left-4 w-6 h-6 text-white/5 rotate-180" />
                                    <p className="text-white/80 leading-relaxed text-sm relative z-10 italic">
                                        {testimonial.content}
                                    </p>
                                    <Quote className="absolute -bottom-2 -right-4 w-6 h-6 text-white/5" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
}
