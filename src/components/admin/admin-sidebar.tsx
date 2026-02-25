"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Newspaper,
    GraduationCap,
    Image as ImageIcon,
    Phone,
    BookOpen,
    Sparkles,
    Quote,
    Handshake,
    Settings,
    ChevronLeft,
    Menu,
    X,
    LogOut,
    Users,
} from "lucide-react";
import { logout } from "@/lib/auth";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
    { id: "dashboard", title: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { id: "berita", title: "Berita", href: "/admin/berita", icon: Newspaper },
    { id: "dosen", title: "Civitas", href: "/admin/dosen", icon: GraduationCap },
    { id: "galeri", title: "Galeri", href: "/admin/galeri", icon: ImageIcon },
    { id: "hero", title: "Hero Slider", href: "/admin/hero", icon: Sparkles },
    { id: "testimonial", title: "Testimonial", href: "/admin/testimonial", icon: Quote },
    { id: "partner", title: "Partner", href: "/admin/partner", icon: Handshake },
    { id: "kontak", title: "Kontak", href: "/admin/kontak", icon: Phone },
    { id: "pmb", title: "PMB", href: "/admin/pmb", icon: BookOpen },
    { id: "settings", title: "Pengaturan", href: "/admin/settings", icon: Settings },
];

interface AdminSidebarProps {
    user: {
        name: string;
        email: string;
        role: string;
        permissions: string[];
    };
}

export function AdminSidebar({ user }: AdminSidebarProps) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Enforce permission filtering
    const filteredNavItems = navItems.filter((item) => {
        if (user.role === "superadmin") return true;
        // Dashboard always visible or based on permission
        if (item.id === "dashboard") return true;
        return user.permissions.includes(item.id);
    });

    return (
        <>
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-card border-r border-border flex flex-col transition-transform duration-300 lg:translate-x-0 shrink-0",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Logo */}
                <div className="p-6 border-b border-border flex items-center justify-between">
                    <Link href="/admin" className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-brand-red flex items-center justify-center">
                            <LayoutDashboard className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <span className="font-bold text-foreground block text-sm">Admin Panel</span>
                            <span className="text-[10px] text-muted-foreground font-medium">FH UNPAL</span>
                        </div>
                    </Link>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-muted-foreground hover:text-foreground">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                    {filteredNavItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-brand-red/10 text-brand-red border border-brand-red/20"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <item.icon className="w-4 h-4" />
                                {item.title}
                            </Link>
                        );
                    })}

                    {/* Superadmin specific item */}
                    {user.role === "superadmin" && (
                        <Link
                            href="/admin/admins"
                            onClick={() => setSidebarOpen(false)}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                                pathname.startsWith("/admin/admins")
                                    ? "bg-brand-red/10 text-brand-red border border-brand-red/20"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <Users className="w-4 h-4" />
                            Kelola Admin
                        </Link>
                    )}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-border space-y-2">
                    <div className="px-4 py-2 bg-muted/50 rounded-xl mb-2">
                        <p className="text-[10px] font-bold text-foreground truncate">{user.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate italic capitalize">{user.role}</p>
                    </div>

                    <button
                        onClick={async () => {
                            await logout();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-500/10 rounded-xl transition-all duration-200"
                    >
                        <LogOut className="w-4 h-4" />
                        Keluar (Logout)
                    </button>
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-[10px] text-muted-foreground hover:text-foreground transition-colors px-4 py-1"
                    >
                        <ChevronLeft className="w-3 h-3" />
                        Kembali ke Website
                    </Link>
                </div>
            </aside>

            {/* Mobile top bar */}
            <header className="lg:hidden sticky top-0 z-30 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => setSidebarOpen(true)} className="text-foreground">
                        <Menu className="w-5 h-5" />
                    </button>
                    <span className="font-bold text-sm">Admin Panel</span>
                </div>
            </header>
        </>
    );
}
