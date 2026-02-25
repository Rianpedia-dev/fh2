import { getPublishedGalleryMedia } from '@/lib/db';

export const dynamic = "force-dynamic";
import GalleryGrid from './GalleryGrid';
import PageHeader from '@/components/layout/page-header';

export default async function GaleriPage({ params }: { params: Promise<{ locale: string }> }) {
    // Await params di awal sesuai spek Next.js 15
    const resolvedParams = await params;
    const locale = resolvedParams?.locale || 'id';

    let mediaItems: any[] = [];
    try {
        // Ambil data dari database (langsung dari gallery_media)
        const result = await getPublishedGalleryMedia();
        mediaItems = Array.isArray(result) ? result : [];
    } catch (error) {
        console.error('Error in GaleriPage:', error);
        mediaItems = [];
    }
    return (
        <div className="min-h-screen bg-background overflow-hidden relative">

            <PageHeader
                category="GALERI"
                title="Galeri"
                titleHighlight="Fakultas Hukum"
                description="Dokumentasi kegiatan akademik, kemahasiswaan, dan seremonial di lingkungan Fakultas Hukum Universitas Palembang."
            />

            <div className="container mx-auto px-4 relative z-10">
                {/* Gallery Grid (Client Component) */}
                <GalleryGrid mediaItems={mediaItems} />
            </div>
        </div>
    );
}
