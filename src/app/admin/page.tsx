import { getDashboardCounts, getViews } from "@/db/queries";
import { ResetVisitorButton } from "./ResetVisitorButton";
import {
    Newspaper,
    GraduationCap,
    Image as ImageIcon,
    Building2,
    Users,
    Eye,
    Quote,
    Handshake,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default async function AdminDashboard() {
    const counts = await getDashboardCounts();
    const views = await getViews();

    const stats = [
        { label: "Berita", value: counts.announcements, icon: Newspaper, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Civitas", value: counts.lecturers, icon: GraduationCap, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { label: "Galeri", value: counts.gallery, icon: ImageIcon, color: "text-orange-500", bg: "bg-orange-500/10" },
        { label: "Testimonial", value: counts.testimonials, icon: Quote, color: "text-pink-500", bg: "bg-pink-500/10" },
        { label: "Partner", value: counts.partners, icon: Handshake, color: "text-amber-500", bg: "bg-amber-500/10" },
        { label: "Pengunjung", value: views, icon: Eye, color: "text-red-500", bg: "bg-red-500/10" },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground mt-1">Ringkasan data website FH UNPAL</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {stats.map((stat) => (
                    <Card key={stat.label} className="border-border hover:border-brand-red hover:shadow-[0_0_20px_rgba(185,28,28,0.2)] transition-all duration-300">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between gap-3 mb-3">
                                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                </div>
                                {stat.label === "Pengunjung" && <ResetVisitorButton />}
                            </div>
                            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                            <p className="text-xs text-muted-foreground font-medium mt-0.5">{stat.label}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
