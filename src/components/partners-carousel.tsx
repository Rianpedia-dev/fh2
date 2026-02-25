"use client";

import * as React from "react";
import { MotionDiv } from "./motion-wrapper";
import { cn } from "@/lib/utils";
import { Image as ImageIcon } from "lucide-react";

interface Partner {
    id: string;
    name: string;
    logo?: string | null;
}

interface PartnersCarouselProps {
    partners: Partner[];
}

export function PartnersCarousel({ partners }: PartnersCarouselProps) {
    return (
        <div className="relative">
            {/* Grid layout - 5 columns on desktop */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                {partners.map((partner, index) => (
                    <MotionDiv
                        key={partner.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.5 }}
                        viewport={{ once: true }}
                        className="group relative"
                    >
                        {/* Logo and Name Container (No Card) */}
                        <div className="relative flex flex-col items-center justify-center p-4 transition-all duration-500 group">
                            {/* Icon/Logo container */}
                            <div className="w-24 h-24 md:w-32 md:h-32 mb-6 flex items-center justify-center rounded-3xl bg-muted/30 group-hover:bg-muted/50 transition-all duration-500 overflow-hidden p-6">
                                {partner.logo ? (
                                    <img
                                        src={partner.logo}
                                        alt={partner.name}
                                        className="h-full w-full object-contain opacity-100 transition-all duration-500 transform group-hover:scale-110"
                                    />
                                ) : (
                                    <ImageIcon className="w-10 h-10 text-muted-foreground/30 group-hover:text-brand-red transition-colors duration-500" />
                                )}
                            </div>

                            {/* Partner Name */}
                            <p className="text-[10px] md:text-xs font-bold text-center text-muted-foreground group-hover:text-foreground transition-colors duration-500 tracking-wider uppercase">
                                {partner.name}
                            </p>
                        </div>
                    </MotionDiv>
                ))}
            </div>


        </div>
    );
}
