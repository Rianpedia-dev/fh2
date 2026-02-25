import Link from "next/link";
import Image from "next/image";
import {
    MapPin,
    Phone,
    Mail,
    Globe,
    Zap,
    Shield,
    TrendingUp,
    Instagram,
    Facebook,
    Youtube,
    Twitter
} from "lucide-react";
import { type SiteConfig } from "@/db/queries";

export default function Footer({
    siteConfig,
    visitorCount
}: {
    siteConfig: SiteConfig;
    visitorCount: number;
}) {
    const quickLinks = [
        { title: "Beranda", href: "/" },
        { title: "Profil", href: "/profil" },
        { title: "Civitas Akademika", href: "/civitas" },
        { title: "Galeri", href: "/galeri" },
        { title: "Info PMB", href: "/pmb" },
    ];

    const socialMedia = [
        { icon: Facebook, href: siteConfig.socialMedia.facebook, label: "Facebook" },
        { icon: Twitter, href: "#", label: "Twitter" },
        { icon: Instagram, href: siteConfig.socialMedia.instagram, label: "Instagram" },
        { icon: Youtube, href: siteConfig.socialMedia.youtube, label: "YouTube" },
    ];

    return (
        <footer className="relative bg-background text-foreground overflow-hidden border-t border-border">
            {/* Decorative pattern */}
            <div className="absolute inset-0 pattern-grid opacity-[0.03] dark:opacity-20 pointer-events-none" />

            {/* Decorative glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-red/5 rounded-full blur-[120px] -z-10"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-red/5 rounded-full blur-[120px] -z-10"></div>

            <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-20 z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                    {/* Logo dan Deskripsi */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="relative w-16 h-16 transform hover:rotate-6 transition-transform">
                                <Image
                                    src="/logofh.png"
                                    alt="Logo FH UNPAL"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div>
                                <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-b from-[#FFF5C3] via-[#FFD700] to-[#B8860B] drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] block dark:filter dark:brightness-110">
                                    Fakultas Hukum
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground block mt-0.5">
                                    {siteConfig.university || "Universitas Palembang"}
                                </span>
                            </div>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                            Membangun masa depan hukum Indonesia yang berkeadilan melalui pendidikan berkualitas dan integritas tinggi.
                        </p>
                        <div className="flex gap-3">
                            {socialMedia.map((social, index) => (
                                <Link
                                    key={index}
                                    href={social.href}
                                    className="p-3 rounded-xl bg-muted border border-border hover:bg-brand-red/10 hover:border-brand-red/30 transition-all duration-300 group"
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-5 h-5 text-muted-foreground group-hover:text-brand-red group-hover:scale-110 transition-all" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Tautan Cepat */}
                    <div>
                        <h3 className="text-lg font-bold mb-8 text-foreground flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                <Zap className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                            </div>
                            Tautan Cepat
                        </h3>
                        <ul className="space-y-4">
                            {quickLinks.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        href={link.href}
                                        className="group flex items-center gap-3 text-muted-foreground hover:text-foreground transition-all duration-300"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-brand-red/40 group-hover:w-3 group-hover:bg-brand-red transition-all" />
                                        <span className="text-sm font-medium">{link.title}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Kontak */}
                    <div>
                        <h3 className="text-lg font-bold mb-8 text-foreground flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                <Shield className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                            </div>
                            Hubungi Kami
                        </h3>
                        <div className="space-y-6">
                            {[
                                { icon: MapPin, text: siteConfig.address, color: "text-emerald-500 dark:text-emerald-400" },
                                { icon: Phone, text: siteConfig.phone, color: "text-blue-500 dark:text-blue-400" },
                                { icon: Mail, text: siteConfig.email, color: "text-orange-500 dark:text-orange-400" },
                            ].map((contact, index) => (
                                <div key={index} className="flex gap-4">
                                    <div className="mt-1">
                                        <contact.icon className={`w-5 h-5 ${contact.color}`} />
                                    </div>
                                    <span className="text-sm text-muted-foreground leading-relaxed font-medium">
                                        {contact.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Informasi / Visitor Counter */}
                    <div className="space-y-10 flex flex-col items-start lg:items-end">
                        <div className="w-full">
                            <div className="lg:flex lg:justify-end">
                                <h3 className="text-lg font-bold mb-8 text-foreground flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-brand-red/10 flex items-center justify-center">
                                        <TrendingUp className="w-5 h-5 text-brand-red" />
                                    </div>
                                    Informasi
                                </h3>
                            </div>
                            <ul className="space-y-4 lg:flex lg:flex-col lg:items-end">
                                <li>
                                    <Link href="/akreditasi" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
                                        Akreditasi BAN-PT
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/admin/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
                                        Portal Akademik
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Visitor Counter - Ultra Compact Pulse Design */}
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-muted/20 border border-border/50 backdrop-blur-md group hover:bg-muted/30 transition-all duration-500">
                            <div className="flex items-center gap-3">
                                <div className="relative flex items-center justify-center">
                                    <div className="absolute inset-0 bg-green-500/20 rounded-full blur-sm scale-150 animate-pulse"></div>
                                    <div className="w-2 h-2 rounded-full bg-green-500 relative z-10"></div>
                                    <div className="ml-3 h-4 w-px bg-border/50"></div>
                                </div>
                                <div className="flex flex-col -space-y-1">
                                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Pengunjung</span>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-sm font-black tabular-nums tracking-tight text-foreground">
                                            {visitorCount.toLocaleString('id-ID')}
                                        </span>
                                        <span className="text-[8px] font-bold uppercase tracking-wider text-muted-foreground/40">Total</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-20 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-xs font-medium text-muted-foreground text-center md:text-left">
                        © {new Date().getFullYear()} {siteConfig.name} {siteConfig.university}. Hak Cipta Dilindungi.
                    </p>
                    <div className="flex gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/30 dark:text-white/20">
                        <span>Designed & Developed by Jemi Arian</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
