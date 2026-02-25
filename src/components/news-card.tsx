"use client";

import { Clock, ArrowRight } from "lucide-react";
import { MotionDiv } from "@/components/motion-wrapper";
import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface NewsCardProps {
    news: {
        id: number;
        title: string;
        excerpt: string;
        content: string | null;
        date: string;
        category: string;
        imageUrl?: string | null;
    };
    delay?: number;
}

export function NewsCard({ news, delay = 0 }: NewsCardProps) {
    return (
        <Dialog>
            <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay }}
                whileHover={{ y: -5 }}
                className="group bg-card border border-brand-red shadow-[0_0_15px_rgba(185,28,28,0.2)] rounded-[2rem] overflow-hidden flex flex-col h-full transition-all duration-300 hover:border-brand-red/80 hover:shadow-[0_0_30px_rgba(185,28,28,0.3)]"
            >
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                        src={news.imageUrl || "/images/backround_profil.png"}
                        alt={news.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {/* Category Badge */}
                    <div className="absolute top-6 left-6">
                        <span className="bg-[#b47a3c] text-white text-[10px] font-bold px-4 py-1.5 rounded-lg uppercase tracking-wider backdrop-blur-md">
                            {news.category}
                        </span>
                    </div>
                </div>

                {/* Content Container */}
                <div className="p-8 flex flex-col flex-grow">
                    {/* Date */}
                    <div className="flex items-center gap-2 text-muted-foreground text-xs mb-4">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{news.date}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-foreground mb-4 leading-tight line-clamp-2 group-hover:text-brand-red transition-colors duration-300">
                        {news.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-muted-foreground text-sm mb-8 line-clamp-3 leading-relaxed">
                        {news.excerpt}
                    </p>

                    {/* Footer Button - Trigger Dialog */}
                    <div className="mt-auto">
                        <DialogTrigger asChild>
                            <button
                                className="inline-flex items-center justify-center gap-2 bg-foreground text-background font-bold px-8 py-3.5 rounded-full hover:bg-foreground/90 transition-all duration-300 group/btn"
                            >
                                <span className="text-sm">Baca Selengkapnya</span>
                                <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                            </button>
                        </DialogTrigger>
                    </div>
                </div>
            </MotionDiv>

            {/* Dialog Content */}
            <DialogContent className="sm:max-w-3xl max-h-[90vh] bg-background border border-brand-red shadow-[0_0_40px_rgba(185,28,28,0.4)] text-foreground p-0 overflow-hidden flex flex-col">
                <div className="flex-grow overflow-y-auto custom-scrollbar">
                    <div className="relative aspect-video w-full">
                        <Image
                            src={news.imageUrl || "/images/backround_profil.png"}
                            alt={news.title}
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
                        <div className="absolute bottom-6 left-8">
                            <span className="bg-[#b47a3c] text-white text-[10px] font-bold px-4 py-1.5 rounded-lg uppercase tracking-wider shadow-lg">
                                {news.category}
                            </span>
                        </div>
                    </div>

                    <div className="p-8 sm:p-12">
                        <DialogHeader className="mb-8 space-y-4">
                            <div className="flex items-center gap-2 text-brand-red font-bold text-xs uppercase tracking-widest">
                                <Clock className="w-4 h-4" />
                                <span>{news.date}</span>
                            </div>
                            <DialogTitle className="text-3xl sm:text-4xl font-black leading-tight tracking-tight text-foreground">
                                {news.title}
                            </DialogTitle>
                        </DialogHeader>

                        <div className="w-16 h-1 bg-brand-red rounded-full mb-8"></div>

                        <div className="text-muted-foreground text-lg sm:text-xl leading-relaxed whitespace-pre-wrap">
                            {news.content || news.excerpt}
                        </div>
                    </div>
                </div>

                {/* Decorative border at bottom */}
                <div className="h-2 bg-brand-red w-full"></div>
            </DialogContent>
        </Dialog>
    );
}
