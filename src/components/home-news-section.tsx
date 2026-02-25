"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MotionDiv } from "@/components/motion-wrapper";
import { NewsCard } from "@/components/news-card";

interface NewsItem {
    id: number;
    title: string;
    excerpt: string;
    content: string;
    date: string;
    category: string;
    imageUrl?: string | null;
}

interface HomeNewsSectionProps {
    latestNews: NewsItem[];
    locale?: string;
}

export function HomeNewsSection({ latestNews }: HomeNewsSectionProps) {
    return (
        <div className="container mx-auto px-4 py-20 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
                <MotionDiv
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl font-bold text-foreground mb-4">Berita & Pengumuman</h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-brand-red to-orange-400 rounded-full"></div>
                </MotionDiv>
                <Button asChild variant="outline" className="rounded-full px-8 h-11 font-bold group shadow-xl hover:bg-brand-red hover:text-white transition-all duration-300">
                    <Link href="/berita">
                        Lihat Semua Berita
                        <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {latestNews.map((news, index) => (
                    <NewsCard key={news.id} news={news} delay={index * 0.1} />
                ))}
            </div>
        </div>
    );
}
