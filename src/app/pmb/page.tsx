import type { Metadata } from "next";

export const dynamic = "force-dynamic";
import Link from "next/link";
import {
    ArrowRight,
    CheckCircle2,
    Clock,
    CalendarDays,
    FileText,
    GraduationCap,
    Sparkles,
    RefreshCw,
    Sun,
    Briefcase,
    ShieldCheck,
    Users,
    BookOpen,
    MapPin,
    Phone
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MotionDiv } from "@/components/motion-wrapper";
import { getPublishedPmbData } from "@/lib/db";

import { TeamMemberCard } from './TeamMemberCard';
import PageHeader from '@/components/layout/page-header';

export const metadata: Metadata = {
    title: "Info PMB - FH UNPAL",
    description: "Informasi Penerimaan Mahasiswa Baru (PMB) Fakultas Hukum Universitas Palembang.",
};

/* ─── Reusable Section Header ─── */
function SectionHeader({ number, title, subtitle }: { number: string; title: string; subtitle: string }) {
    return (
        <div className="text-center mb-14">
            <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <span className="inline-block text-xs font-black tracking-[0.3em] text-cyber-blue/60 uppercase mb-3">
                    {number}
                </span>
                <h2 className="text-2xl md:text-4xl font-extrabold text-foreground tracking-tight mb-3 uppercase">
                    {title}
                </h2>
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-1 bg-gradient-to-r from-transparent via-cyber-blue to-transparent rounded-full"></div>
                </div>
                <p className="text-muted-foreground font-medium max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
                    {subtitle}
                </p>
            </MotionDiv>
        </div>
    );
}

export default async function PMBPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const pmbData = await getPublishedPmbData();

    return (
        <div className="min-h-screen bg-background overflow-hidden relative">
            {/* ═══════════════════════════════════════════════════════
                HERO SECTION
            ═══════════════════════════════════════════════════════ */}
            <PageHeader
                category="INFO PMB"
                title="Penerimaan"
                titleHighlight="Mahasiswa Baru"
                description="Fakultas Hukum Universitas Palembang membuka kesempatan bagi calon mahasiswa baru untuk bergabung dan meraih masa depan cemerlang di bidang hukum."
            />

            <div className="container mx-auto px-4 relative z-10 space-y-28 mb-28">

                {/* ═══════════════════════════════════════════════════════
                    01 — JALUR PENDAFTARAN
                ═══════════════════════════════════════════════════════ */}
                <section id="jalur-pendaftaran">
                    <SectionHeader
                        number="01"
                        title="Pilihan Jalur Pendaftaran"
                        subtitle="Pilih jalur yang paling sesuai dengan kualifikasi dan prestasi Anda"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {pmbData.tracks.map((track, i) => (
                            <MotionDiv
                                key={track.id}
                                initial={{ opacity: 0, x: i === 0 ? -30 : 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -8 }}
                                className="glass-card p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-brand-red shadow-[0_0_20px_rgba(185,28,28,0.2)] group cursor-default relative overflow-hidden"
                            >
                                {/* Glow accent */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-blue/5 blur-3xl rounded-full group-hover:bg-cyber-blue/10 transition-all duration-500"></div>

                                <div className="relative z-10 space-y-4 md:space-y-5">
                                    <div className="flex items-start gap-3 md:gap-4">
                                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-cyber-blue/10 flex items-center justify-center border border-cyber-blue/20 flex-shrink-0 group-hover:bg-cyber-blue/20 transition-all duration-300">
                                            {track.id === 'murni'
                                                ? <GraduationCap className="w-6 h-6 md:w-7 md:h-7 text-cyber-blue" />
                                                : <RefreshCw className="w-6 h-6 md:w-7 md:h-7 text-cyan-400" />
                                            }
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                <h3 className="text-xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60 transition-all duration-300 group-hover:from-cyber-blue group-hover:to-cyan-400">
                                                    {track.title}
                                                </h3>
                                                {track.id === 'murni' && (
                                                    <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/20 text-[9px] md:text-[10px] font-bold tracking-wider uppercase h-5">
                                                        Populer
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="w-12 h-1 bg-cyber-blue/30 rounded-full group-hover:w-full group-hover:bg-cyber-blue transition-all duration-500"></div>
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground leading-relaxed text-sm md:text-base md:pl-[72px]">
                                        {track.description}
                                    </p>
                                </div>
                            </MotionDiv>
                        ))}
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════
                    02 — JENIS KELAS
                ═══════════════════════════════════════════════════════ */}
                <section>
                    <SectionHeader
                        number="02"
                        title="Pilihan Jenis Kelas"
                        subtitle="Berbagai pilihan waktu dan metode pembelajaran yang fleksibel sesuai kebutuhan Anda"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {pmbData.classes.map((item, i) => (
                            <MotionDiv
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -8 }}
                                className="glass-card p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-brand-red shadow-[0_0_20px_rgba(185,28,28,0.2)] group h-full relative overflow-hidden"
                            >
                                {/* Active Accent Bar */}
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-16 bg-cyber-blue rounded-r-full group-hover:h-32 transition-all duration-500 shadow-[0_0_20px_rgba(0,240,255,0.8)]"></div>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-foreground/5 flex items-center justify-center border border-foreground/10 group-hover:bg-cyber-blue/10 group-hover:border-cyber-blue/40 transition-all duration-300">
                                            {item.icon === 'sun' ? <Sun className="w-6 h-6 md:w-7 md:h-7 text-cyber-blue" /> : <Briefcase className="w-6 h-6 md:w-7 md:h-7 text-cyber-blue" />}
                                        </div>
                                        <div>
                                            <h3 className="text-lg md:text-xl font-bold">{item.title}</h3>
                                            <Badge variant="secondary" className="bg-foreground/5 text-foreground/60 text-[9px] md:text-[10px] uppercase tracking-wider h-5 flex items-center px-2">
                                                {item.type}
                                            </Badge>
                                        </div>
                                    </div>

                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {item.description}
                                    </p>

                                    {/* Divider */}
                                    <div className="w-full h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent"></div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 glass-card bg-foreground/3 shadow-none p-3.5 rounded-2xl border border-foreground/5">
                                            <CalendarDays className="w-4 h-4 text-cyber-blue flex-shrink-0" />
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Jadwal</span>
                                                <span className="text-xs font-bold">{item.schedule}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 glass-card bg-foreground/3 shadow-none p-3.5 rounded-2xl border border-foreground/5">
                                            <Clock className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Durasi</span>
                                                <span className="text-xs font-bold">{item.duration}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </MotionDiv>
                        ))}
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════
                    03 — BIAYA PENDIDIKAN
                ═══════════════════════════════════════════════════════ */}
                <section>
                    <SectionHeader
                        number="03"
                        title="Biaya Pendidikan"
                        subtitle="Informasi lengkap rincian biaya pendidikan untuk setiap kategori mahasiswa"
                    />

                    <div className="space-y-20 max-w-6xl mx-auto">
                        {/* ── Mahasiswa Murni ── */}
                        <div className="space-y-8">
                            <MotionDiv
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="flex items-center gap-4 border-b border-foreground/10 pb-4"
                            >
                                <div className="w-10 h-10 rounded-xl bg-cyber-blue/10 flex items-center justify-center border border-cyber-blue/20">
                                    <GraduationCap className="w-5 h-5 text-cyber-blue" />
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold text-cyber-blue/80 tracking-tight uppercase">Mahasiswa Murni</h3>
                            </MotionDiv>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {pmbData.fees.murni.map((fee, i) => (
                                    <MotionDiv
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        viewport={{ once: true }}
                                        className="group bg-card border border-brand-red shadow-[0_0_20px_rgba(185,28,28,0.2)] rounded-2xl overflow-hidden flex flex-col h-full hover:border-brand-red hover:shadow-[0_0_30px_rgba(185,28,28,0.15)] transition-all duration-500"
                                    >
                                        {/* Card Header */}
                                        <div className="bg-brand-red/5 px-6 py-5 border-b border-brand-red/10">
                                            <h4 className="text-foreground font-bold text-lg">{fee.title}</h4>
                                        </div>

                                        {/* Fee Items */}
                                        <div className="px-6 py-6 flex-grow">
                                            <div className="space-y-1">
                                                {fee.items.map((item, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={`flex justify-between items-center text-sm gap-2 py-3.5 ${idx !== fee.items.length - 1 ? 'border-b border-border/50' : ''
                                                            }`}
                                                    >
                                                        <span className="text-muted-foreground">{item.label}</span>
                                                        <span className="text-foreground font-black whitespace-nowrap text-right">Rp {item.amount}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Total */}
                                        <div className="mx-4 mb-4 bg-muted/50 border border-brand-red/20 p-5 rounded-2xl flex justify-between items-center group-hover:bg-brand-red/10 transition-colors duration-500">
                                            <span className="text-brand-red font-black uppercase text-xs tracking-[0.2em]">Total</span>
                                            <span className="text-brand-red font-black text-xl">Rp {fee.total}</span>
                                        </div>
                                    </MotionDiv>
                                ))}
                            </div>
                        </div>

                        {/* ── Mahasiswa Transisi ── */}
                        <div className="space-y-8">
                            <MotionDiv
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="flex items-center gap-4 border-b border-foreground/10 pb-4"
                            >
                                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                                    <Users className="w-5 h-5 text-cyan-400" />
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold text-cyan-400/80 tracking-tight uppercase">Mahasiswa Transisi</h3>
                            </MotionDiv>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {pmbData.fees.transisi.map((fee, i) => (
                                    <MotionDiv
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        viewport={{ once: true }}
                                        className="group bg-card border border-brand-red shadow-[0_0_20px_rgba(185,28,28,0.2)] rounded-2xl overflow-hidden flex flex-col h-full hover:border-brand-red hover:shadow-[0_0_30px_rgba(185,28,28,0.15)] transition-all duration-500"
                                    >
                                        {/* Card Header */}
                                        <div className="bg-brand-red/5 px-6 py-5 border-b border-brand-red/10">
                                            <h4 className="text-foreground font-bold text-lg">{fee.title}</h4>
                                        </div>

                                        {/* Fee Items */}
                                        <div className="px-6 py-6 flex-grow">
                                            <div className="space-y-1">
                                                {fee.items.map((item, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={`flex justify-between items-center text-sm gap-2 py-3.5 ${idx !== fee.items.length - 1 ? 'border-b border-border/50' : ''
                                                            }`}
                                                    >
                                                        <span className="text-muted-foreground">{item.label}</span>
                                                        <span className="text-foreground font-black whitespace-nowrap text-right">Rp {item.amount}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Total */}
                                        <div className="mx-4 mb-4 bg-muted/50 border border-brand-red/20 p-5 rounded-2xl flex justify-between items-center group-hover:bg-brand-red/10 transition-all duration-500">
                                            <span className="text-brand-red font-black uppercase text-xs tracking-[0.2em]">Total</span>
                                            <span className="text-brand-red font-black text-xl">Rp {fee.total}</span>
                                        </div>
                                    </MotionDiv>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════
                    04 — SYARAT PENDAFTARAN
                ═══════════════════════════════════════════════════════ */}
                <section className="relative">
                    <div className="absolute inset-0 bg-cyan-500/5 blur-[120px] -z-10 rounded-full"></div>

                    <SectionHeader
                        number="04"
                        title="Syarat Pendaftaran"
                        subtitle="Pastikan dokumen berikut telah siap sebelum melakukan pendaftaran"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
                        {/* Mahasiswa Murni Requirements */}
                        <MotionDiv
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="glass-card p-8 md:p-10 rounded-[3rem] border border-brand-red shadow-[0_0_20px_rgba(185,28,28,0.2)] relative overflow-hidden h-full hover:border-brand-red/50 transition-colors duration-500"
                        >
                            <div className="space-y-6 relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-cyber-blue/10 rounded-2xl flex items-center justify-center border border-cyber-blue/20">
                                        <GraduationCap className="w-6 h-6 text-cyber-blue" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl md:text-2xl font-bold">Mahasiswa Murni</h3>
                                        <span className="text-xs text-muted-foreground">{pmbData.requirements.murni.length} persyaratan</span>
                                    </div>
                                </div>

                                <div className="w-full h-px bg-gradient-to-r from-cyber-blue/20 via-transparent to-transparent"></div>

                                <ul className="space-y-3">
                                    {pmbData.requirements.murni.map((req, i) => (
                                        <li key={i} className="flex items-start gap-3 group/item">
                                            <span className="w-6 h-6 rounded-lg bg-cyber-blue/10 flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-black text-cyber-blue border border-cyber-blue/20 group-hover/item:bg-cyber-blue/20 transition-colors">
                                                {i + 1}
                                            </span>
                                            <span className="text-foreground/70 text-sm leading-relaxed group-hover/item:text-foreground transition-colors">{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </MotionDiv>

                        {/* Mahasiswa Transisi Requirements */}
                        <MotionDiv
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="glass-card p-8 md:p-10 rounded-[3rem] border border-brand-red shadow-[0_0_20px_rgba(185,28,28,0.2)] relative overflow-hidden h-full hover:border-brand-red/50 transition-colors duration-500"
                        >
                            <div className="space-y-6 relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center border border-cyan-500/20">
                                        <RefreshCw className="w-6 h-6 text-cyan-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl md:text-2xl font-bold">Mahasiswa Transisi</h3>
                                        <span className="text-xs text-muted-foreground">{pmbData.requirements.transisi.length} persyaratan</span>
                                    </div>
                                </div>

                                <div className="w-full h-px bg-gradient-to-r from-cyan-400/20 via-transparent to-transparent"></div>

                                <ul className="space-y-3">
                                    {pmbData.requirements.transisi.map((req, i) => (
                                        <li key={i} className="flex items-start gap-3 group/item">
                                            <span className="w-6 h-6 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-black text-cyan-400 border border-cyan-500/20 group-hover/item:bg-cyan-500/20 transition-colors">
                                                {i + 1}
                                            </span>
                                            <span className="text-foreground/70 text-sm leading-relaxed group-hover/item:text-foreground transition-colors">{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </MotionDiv>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════
                    05 — TIM PMB
                ═══════════════════════════════════════════════════════ */}
                <section id="kontak-tim">
                    <SectionHeader
                        number="05"
                        title="Tim Penerimaan Mahasiswa Baru"
                        subtitle="Hubungi tim kami untuk mendapatkan informasi lebih lanjut mengenai pendaftaran"
                    />

                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8 max-w-5xl mx-auto">
                        {pmbData.team.map((member, i) => (
                            <TeamMemberCard key={member.name} member={member} delay={i * 0.1} />
                        ))}
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════
                    FOOTER CTA
                ═══════════════════════════════════════════════════════ */}
                <section>
                    <MotionDiv
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative glass-card rounded-[3rem] border border-brand-red shadow-[0_0_20px_rgba(185,28,28,0.2)] overflow-hidden"
                    >
                        {/* Background glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-cyber-blue/5 via-transparent to-cyan-500/5"></div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-cyber-blue/5 blur-[100px] rounded-full"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/5 blur-[80px] rounded-full"></div>

                        <div className="relative z-10 py-16 md:py-20 px-8 md:px-16 text-center">
                            <Sparkles className="w-10 h-10 text-cyber-blue mx-auto mb-6 animate-pulse" />
                            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-4">
                                Siap Bergabung dengan Kami?
                            </h2>
                            <p className="text-muted-foreground max-w-xl mx-auto mb-8 text-sm md:text-base leading-relaxed">
                                Jangan lewatkan kesempatan untuk menjadi bagian dari Fakultas Hukum Universitas Palembang.
                                Daftar sekarang dan mulai perjalanan akademik Anda.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href="#kontak-tim"
                                    className="inline-flex items-center justify-center gap-2 bg-cyber-blue text-black font-bold px-8 py-3.5 rounded-2xl hover:bg-cyber-blue/90 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] text-sm"
                                >
                                    Hubungi Tim PMB
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                                <Link
                                    href="/profil"
                                    className="inline-flex items-center justify-center gap-2 border border-foreground/20 text-foreground font-bold px-8 py-3.5 rounded-2xl hover:bg-foreground/5 transition-all duration-300 text-sm"
                                >
                                    <MapPin className="w-4 h-4" />
                                    Lihat Profil Fakultas
                                </Link>
                            </div>
                        </div>
                    </MotionDiv>
                </section>
            </div>
        </div>
    );
}
