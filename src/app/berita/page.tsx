import { db } from "@/db";

export const dynamic = "force-dynamic";
import { announcements } from "@/db/schema";
import { desc } from "drizzle-orm";
import PageHeader from "@/components/layout/page-header";
import { NewsCard } from "@/components/news-card";

export const metadata = {
    title: "Berita & Pengumuman - FH UNPAL",
    description: "Berita terkini dan pengumuman resmi dari Fakultas Hukum Universitas Palembang.",
};

async function getNewsData() {
    try {
        const data = await db.select().from(announcements).orderBy(desc(announcements.id));
        return data.map(item => ({
            ...item,
            // Ensure data types match expected props in NewsCard
            id: Number(item.id),
            title: item.title || "",
            excerpt: item.excerpt || "",
            date: item.date || "",
            category: item.category || "Berita",
        }));
    } catch (error) {
        console.error("Error fetching news:", error);
        return [];
    }
}

export default async function BeritaPage() {
    const newsList = await getNewsData();

    return (
        <div className="min-h-screen bg-background">
            <PageHeader
                category="BERITA & MEDIA"
                title="Berita"
                titleHighlight="Terkini"
                description="Dapatkan informasi terbaru seputar kegiatan akademik, pengabdian masyarakat, dan pengumuman resmi dari Fakultas Hukum Universitas Palembang."
            />

            <div className="container mx-auto px-4 pb-20 pt-0">
                {newsList.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {newsList.map((news, index) => (
                            <NewsCard
                                key={news.id}
                                news={news}
                                delay={index * 0.1}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground">Belum ada berita atau pengumuman saat ini.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
