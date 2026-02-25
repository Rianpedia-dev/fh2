"use client";

import { useState, useMemo } from "react";
import { Search, Mail, User, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import PageHeader from "@/components/layout/page-header";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface Lecturer {
    id: number;
    name: string;
    nidn: string;
    position: string;
    specialization: string;
    education: string;
    email?: string | null;
    imageUrl?: string | null;
}

export default function CivitasContent({
    lecturers,
}: {
    lecturers: Lecturer[];
}) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredLecturers = useMemo(() => {
        if (!searchQuery) return lecturers;
        const q = searchQuery.toLowerCase();
        return lecturers.filter(
            (d) =>
                d.name.toLowerCase().includes(q) ||
                d.specialization.toLowerCase().includes(q) ||
                d.nidn.toLowerCase().includes(q)
        );
    }, [searchQuery, lecturers]);

    return (
        <div className="min-h-screen bg-background">
            {/* Header / Hero */}
            <PageHeader
                category="CIVITAS AKADEMIKA"
                title="Civitas"
                titleHighlight="Akademika"
                description="Mengenal lebih dekat dengan jajaran dosen yang berdedikasi tinggi di lingkungan Fakultas Hukum."
            />

            {/* Main Content */}
            <section className="pb-16 pt-0">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-8">
                        {filteredLecturers.map((dosen) => (
                            <div
                                key={dosen.id}
                                className="group relative bg-card border border-brand-red shadow-[0_0_15px_rgba(185,28,28,0.2)] rounded-xl md:rounded-2xl p-3 md:p-6 text-center hover:border-brand-red/80 hover:shadow-[0_0_30px_rgba(185,28,28,0.3)] transition-all duration-500"
                            >
                                {/* Photo */}
                                <div className="flex justify-center mb-5">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <div className="relative w-full aspect-square md:w-44 md:h-44 rounded-lg md:rounded-2xl overflow-hidden bg-muted border border-border cursor-zoom-in">
                                                {dosen.imageUrl ? (
                                                    <Image
                                                        src={dosen.imageUrl}
                                                        alt={dosen.name}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <User className="w-14 h-14 text-muted-foreground/30" />
                                                    </div>
                                                )}
                                            </div>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-xl bg-transparent border-none p-0 overflow-hidden shadow-none close-button-white">
                                            <DialogTitle className="sr-only">Foto {dosen.name}</DialogTitle>
                                            <DialogDescription className="sr-only">
                                                Tampilan foto profil {dosen.name}
                                            </DialogDescription>
                                            <div className="relative aspect-[3/4] w-full max-h-[80vh]">
                                                <Image
                                                    src={dosen.imageUrl || "/images/dosen/placeholder.jpg"}
                                                    alt={dosen.name}
                                                    fill
                                                    className="object-contain"
                                                    priority
                                                />
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>

                                {/* Name */}
                                <h3 className="text-foreground font-bold text-sm md:text-lg mb-1 md:mb-2 leading-snug">
                                    {dosen.name}
                                </h3>

                                {/* Position Badge */}
                                <div className="flex justify-center mb-3">
                                    <span className="inline-block bg-muted text-foreground text-[8px] md:text-[10px] font-bold px-2 py-1 md:px-4 md:py-1.5 rounded-full border border-border uppercase tracking-wider">
                                        {dosen.position}
                                    </span>
                                </div>

                                {/* NIDN */}
                                <p className="text-muted-foreground text-[10px] md:text-xs font-mono tracking-wider mb-2 md:mb-3">
                                    NIDN: {dosen.nidn}
                                </p>

                                {/* Details List */}
                                <div className="space-y-2 border-t border-border pt-4 mt-2 text-left">
                                    {/* Specialization */}
                                    <div className="flex items-start justify-start gap-1.5 text-muted-foreground/90 text-[10px] md:text-xs">
                                        <Search className="w-3 h-3 shrink-0 mt-0.5" />
                                        <p className="md:line-clamp-1">{dosen.specialization}</p>
                                    </div>

                                    {/* Education */}
                                    <div className="flex items-start justify-start gap-1.5 text-muted-foreground/90 text-[10px] md:text-xs">
                                        <GraduationCap className="w-3 h-3 shrink-0 mt-0.5" />
                                        <p className="md:line-clamp-1">{dosen.education}</p>
                                    </div>

                                    {/* Email */}
                                    {dosen.email && (
                                        <div className="flex items-start justify-start gap-1.5 text-brand-red/80 text-[10px] md:text-xs font-medium">
                                            <Mail className="w-3 h-3 shrink-0 mt-0.5" />
                                            <p className="break-all md:line-clamp-1">{dosen.email}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredLecturers.length === 0 && (
                        <div className="text-center py-20">
                            <div className="bg-muted inline-flex p-6 rounded-3xl mb-4 border border-border">
                                <Search className="h-8 w-8 text-muted-foreground/30" />
                            </div>
                            <h3 className="text-foreground font-bold text-xl">Tidak ditemukan</h3>
                            <p className="text-muted-foreground max-w-xs mx-auto mt-2">Maaf, dosen yang Anda cari tidak ada dalam daftar kami.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
