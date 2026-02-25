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
        date: string;
        category: string;
        imageUrl?: string;
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
                className="group bg-black border border-brand-red shadow-[0_0_15px_rgba(185,28,28,0.2)] rounded-[2rem] overflow-hidden flex flex-col h-full transition-all duration-300 hover:border-brand-red/80 hover:shadow-[0_0_30px_rgba(185,28,28,0.3)]"
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
                    <div className="flex items-center gap-2 text-white/50 text-xs mb-4">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{news.date}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-4 leading-tight line-clamp-2 group-hover:text-brand-red transition-colors duration-300">
                        {news.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-white/60 text-sm mb-8 line-clamp-3 leading-relaxed">
                        {news.excerpt}
                    </p>

                    {/* Footer Button - Trigger Dialog */}
                    <div className="mt-auto">
                        <DialogTrigger asChild>
                            <button
                                className="inline-flex items-center justify-center gap-2 bg-white text-black font-bold px-8 py-3.5 rounded-full hover:bg-gray-100 transition-all duration-300 group/btn"
                            >
                                <span className="text-sm">Baca Selengkapnya</span>
                                <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                            </button>
                        </DialogTrigger>
                    </div>
                </div>
            </MotionDiv>

            {/* Dialog Content */}
            <DialogContent className="sm:max-w-2xl bg-zinc-950 border border-brand-red shadow-[0_0_30px_rgba(185,28,28,0.3)] text-white p-0 overflow-hidden">
                <div className="relative aspect-video w-full">
                    <Image
                        src={news.imageUrl || "/images/backround_profil.png"}
                        alt={news.title}
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                    <div className="absolute bottom-6 left-8">
                        <span className="bg-[#b47a3c] text-white text-[10px] font-bold px-4 py-1.5 rounded-lg uppercase tracking-wider">
                            {news.category}
                        </span>
                    </div>
                </div>

                <div className="p-8 sm:p-10">
                    <DialogHeader className="mb-6 space-y-4">
                        <div className="flex items-center gap-2 text-white/50 text-xs">
                            <Clock className="w-4 h-4" />
                            <span>{news.date}</span>
                        </div>
                        <DialogTitle className="text-2xl sm:text-3xl font-bold leading-tight">
                            {news.title}
                        </DialogTitle>
                    </DialogHeader>

                    <DialogDescription className="text-white/70 text-base sm:text-lg leading-relaxed space-y-4">
                        {/* Currently using excerpt as content, could be replaced with full content if available */}
                        {news.excerpt}
                    </DialogDescription>
                </div>
            </DialogContent>
        </Dialog>
    );
}
