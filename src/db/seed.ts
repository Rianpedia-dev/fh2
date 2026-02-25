import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { db } from "./index";
import * as schema from "./schema";

async function main() {
    console.log("Starting seed process...");

    try {
        // ============================================================
        // CLEAR EXISTING DATA
        // ============================================================
        console.log("Cleaning existing data...");
        await db.delete(schema.announcements);
        await db.delete(schema.lecturers);
        await db.delete(schema.staff);
        await db.delete(schema.organizations);
        await db.delete(schema.gallery);
        await db.delete(schema.heroSlides);
        await db.delete(schema.pmbTimeline);
        await db.delete(schema.tuitionFees);
        await db.delete(schema.profile);
        await db.delete(schema.siteConfig);
        await db.delete(schema.siteStats);
        await db.delete(schema.testimonials);
        await db.delete(schema.partners);
        await db.delete(schema.contactInfo);
        await db.delete(schema.socialMedia);
        await db.delete(schema.campusAccess);
        await db.delete(schema.pmbTracks);
        await db.delete(schema.pmbClasses);
        await db.delete(schema.pmbFeeItems); // Delete items first
        await db.delete(schema.pmbFeeCategories);
        await db.delete(schema.pmbRequirements);
        await db.delete(schema.pmbTeam);

        // ============================================================
        // 1. SITE CONFIG (Konfigurasi Situs)
        // ============================================================
        console.log("Seeding site config...");
        await db.insert(schema.siteConfig).values([
            { key: "name", value: "Fakultas Hukum" },
            { key: "university", value: "Universitas Palembang" },
            { key: "shortName", value: "FH UNPAL" },
            { key: "description", value: "Mencetak praktisi hukum yang cerdas, berintegritas, dan profesional." },
            { key: "address", value: "Jl. Dharmapala No.31.A, Bukit Baru, Kec. Ilir Bar. I, Kota Palembang, Sumatera Selatan 30153" },
            { key: "phone", value: "(0711) 441735" },
            { key: "email", value: "hukum@unpal.ac.id" },
            { key: "instagram", value: "https://instagram.com/fh_unpal" },
            { key: "facebook", value: "https://facebook.com/fhunpal" },
            { key: "youtube", value: "https://youtube.com/fhunpal" },
        ]);

        // ============================================================
        // 2. PROFILE (Profil Fakultas)
        // ============================================================
        console.log("Seeding profile...");
        await db.insert(schema.profile).values([
            { key: "sejarah", value: "Fakultas Hukum Universitas Palembang didirikan pada tahun 1982 sebagai salah satu fakultas pionir dalam pengembangan ilmu hukum di Sumatera Selatan..." },
            { key: "visi", value: "Menjadi Fakultas Hukum yang Unggul, Berkarakter, dan Berdaya Saing Global dalam Penegakan Keadilan pada Tahun 2030." },
            {
                key: "misi", value: JSON.stringify([
                    "Menyelenggarakan pendidikan hukum yang berkualitas berbasis teknologi informasi.",
                    "Melaksanakan penelitian hukum yang inovatif dan solutif bagi masyarakat.",
                    "Melakukan pengabdian masyarakat untuk meningkatkan kesadaran hukum.",
                    "Menjalin kerjasama strategis dengan instansi hukum nasional dan internasional."
                ])
            },
            { key: "akreditasi_grade", value: "B" },
            { key: "akreditasi_sk", value: "No. 123/SK/BAN-PT/Akred/S/I/2024" },
            { key: "akreditasi_validUntil", value: "2029-01-01" },
            { key: "akreditasi_description", value: "Terakreditasi B oleh Badan Akreditasi Nasional Perguruan Tinggi." },
            { key: "struktur_dekan", value: "Dr. Ali Dahwir, S.H., M.H." },
            { key: "struktur_wakil1", value: "Hj. Maimunah, S.H., M.H." },
            { key: "struktur_wakil2", value: "Zulbahri, S.H., M.H." },
            { key: "struktur_kaprodi", value: "Dr. (C) Edy Hermawan, S.H., M.H." },
            { key: "struktur_sekretarisProdi", value: "Siti Fatimah, S.H., M.H." },
            { key: "struktur_katuTataUsaha", value: "M. Yunus, S.H." },
        ]);

        // ============================================================
        // 3. CONTACT INFO (Info Kontak)
        // ============================================================
        console.log("Seeding contact info...");
        await db.insert(schema.contactInfo).values([
            { key: "name", value: "Fakultas Hukum Universitas Palembang" },
            { key: "address", value: "Jl. Dharmapala No.31.A, Bukit Baru" },
            { key: "city", value: "Palembang" },
            { key: "province", value: "Sumatera Selatan" },
            { key: "postalCode", value: "30153" },
            { key: "phone", value: "(0711) 441735" },
            { key: "fax", value: "(0711) 441436" },
            { key: "email", value: "hukum@unpal.ac.id" },
            { key: "website", value: "https://fh.unpal.ac.id" },
            { key: "operatingHours", value: "Senin - Jumat: 08:00 - 16:00, Sabtu: 08:00 - 12:00" },
            { key: "mapUrl", value: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.455246738918!2d104.723!3d-2.988" },
        ]);

        // ============================================================
        // 4. ANNOUNCEMENTS (Berita)
        // ============================================================
        console.log("Seeding announcements...");
        await db.insert(schema.announcements).values([
            {
                title: "Kuliah Umum: Tantangan Hukum Cyber di Era AI",
                excerpt: "Mengundang seluruh mahasiswa FH UNPAL untuk mengikuti kuliah umum yang akan membahas regulasi AI.",
                content: "Isi lengkap pengumuman tentang tantangan hukum cyber di era artificial intelligence...",
                date: "25 Feb 2026",
                category: "Akademik",
                imageUrl: "/uploads/news/cyber-law.jpg"
            },
            {
                title: "Pembukaan Pendaftaran Mahasiswa Baru Gelombang 1",
                excerpt: "PMB FH UNPAL tahun akademik 2026/2027 telah resmi dibuka. Daftar sekarang untuk masa depan gemilang.",
                content: "Rincian prosedur pendaftaran, persyaratan, dan jadwal seleksi PMB gelombang pertama...",
                date: "20 Feb 2026",
                category: "PMB",
                imageUrl: "/uploads/news/pmb-open.jpg"
            }
        ]);

        // ============================================================
        // 5. LECTURERS (Dosen)
        // ============================================================
        console.log("Seeding lecturers...");
        await db.insert(schema.lecturers).values([
            {
                name: "Dr. Ali Dahwir, S.H., M.H.",
                nidn: "0215046201",
                position: "Dekan / Lektor Kepala",
                specialization: "Hukum Administrasi Negara",
                education: "S1 UNSRI, S2 UNSRI, S3 UNSRI",
                email: "ali_dahwir@unpal.ac.id",
                imageUrl: "/uploads/dosen/dekan.jpg"
            },
            {
                name: "Hj. Maimunah, S.H., M.H.",
                nidn: "0210057002",
                position: "Wakil Dekan I",
                specialization: "Hukum Pidana",
                education: "S1 UNS, S2 UNSRI",
                email: "maimunah@unpal.ac.id",
                imageUrl: "/uploads/dosen/wd1.jpg"
            }
        ]);

        // ============================================================
        // 6. STAFF
        // ============================================================
        console.log("Seeding staff...");
        await db.insert(schema.staff).values([
            { name: "M. Yunus, S.H.", position: "Kepala Tata Usaha", imageUrl: "/uploads/staff/yunus.jpg" },
            { name: "Siska, B.A.", position: "Admin Akademik", imageUrl: "/uploads/staff/siska.jpg" }
        ]);

        // ============================================================
        // 7. ORGANIZATIONS (Ormawa)
        // ============================================================
        console.log("Seeding organizations...");
        await db.insert(schema.organizations).values([
            { name: "BEM FH UNPAL", description: "Badan Eksekutif Mahasiswa Fakultas Hukum.", imageUrl: "/uploads/org/bem.png" },
            { name: "DPM FH UNPAL", description: "Dewan Perwakilan Mahasiswa.", imageUrl: "/uploads/org/dpm.png" }
        ]);

        // ============================================================
        // 8. TESTIMONIALS
        // ============================================================
        console.log("Seeding testimonials...");
        await db.insert(schema.testimonials).values([
            {
                name: "Rian Saputra, S.H.",
                role: "Alumni 2020 - Lawyer",
                content: "FH UNPAL tidak hanya mengajarkan teori hukum, tapi juga integritas sebagai praktisi hukum sejati.",
                image: "/uploads/testi/rian.jpg",
                rating: 5
            },
            {
                name: "Indah Permata, S.H.",
                role: "Alumni 2019 - Staf Legal",
                content: "Lingkungan belajar yang kondusif dan dosen yang sangat peduli dengan perkembangan mahasiswa.",
                image: "/uploads/testi/indah.jpg",
                rating: 5
            }
        ]);

        // ============================================================
        // 9. PARTNERS
        // ============================================================
        console.log("Seeding partners...");
        await db.insert(schema.partners).values([
            { name: "Kementerian Hukum dan HAM", logo: "/uploads/partner/kemkumham.png", url: "https://kemenkumham.go.id", order: 1 },
            { name: "Pengadilan Negeri Palembang", logo: "/uploads/partner/pn.png", url: "#", order: 2 },
            { name: "PERADI", logo: "/uploads/partner/peradi.png", url: "#", order: 3 }
        ]);

        // ============================================================
        // 10. HERO SLIDES
        // ============================================================
        console.log("Seeding hero slides...");
        await db.insert(schema.heroSlides).values([
            {
                imageUrl: "/uploads/hero/campus-front.jpg",
                title: "Masa Depan Hukum di Tangan Anda",
                subtitle: "Bergabunglah dengan Fakultas Hukum Universitas Palembang.",
                buttonText: "Daftar PMB",
                buttonLink: "/pmb",
                order: 1
            },
            {
                imageUrl: "/uploads/hero/moot-court.jpg",
                title: "Laboratorium Hukum Terlengkap",
                subtitle: "Praktik peradilan semu untuk pengalaman nyata.",
                buttonText: "Lihat Fasilitas",
                buttonLink: "/profil",
                order: 2
            }
        ]);

        // ============================================================
        // 11. SOCIAL MEDIA
        // ============================================================
        console.log("Seeding social media...");
        await db.insert(schema.socialMedia).values([
            { platform: "Instagram", url: "https://instagram.com/fh_unpal", username: "@fh_unpal", icon: "instagram", order: 1 },
            { platform: "Facebook", url: "https://facebook.com/fhunpal", username: "FH UNPAL", icon: "facebook", order: 2 }
        ]);

        // ============================================================
        // 12. CAMPUS ACCESS
        // ============================================================
        console.log("Seeding campus access...");
        await db.insert(schema.campusAccess).values([
            { name: "Trans Musi", description: "Gunakan Koridor rute Bukit Besar dan turun di Dharmapala.", icon: "bus", order: 1 },
            { name: "Ojek Online", description: "Cari 'Universitas Palembang' di aplikasi.", icon: "bike", order: 2 }
        ]);

        // ============================================================
        // 13. PMB TRACKS (Jalur)
        // ============================================================
        console.log("Seeding PMB tracks...");
        await db.insert(schema.pmbTracks).values([
            { trackId: "murni", title: "Lulusan Baru (Murni)", description: "Jalur bagi lulusan SMA/SMK/MA sederajat.", order: 1 },
            { trackId: "transisi", title: "Pindahan / Lanjutan (Transisi)", description: "Jalur bagi mahasiswa pindahan atau lulusan D3 ke S1.", order: 2 }
        ]);

        // ============================================================
        // 14. PMB CLASSES (Jenis Kelas)
        // ============================================================
        console.log("Seeding PMB classes...");
        await db.insert(schema.pmbClasses).values([
            { title: "Kelas Pagi", type: "Reguler", description: "Kuliah setiap hari kerja.", schedule: "08:00 - 12:00", duration: "8 Semester", icon: "sun", order: 1 },
            { title: "Kelas Sore", type: "Karyawan", description: "Bagi yang bekerja di siang hari.", schedule: "17:00 - 21:00", duration: "8 Semester", icon: "moon", order: 2 },
            { title: "Kelas Eksekutif", type: "Sabtu-Minggu", description: "Kuliah di akhir pekan.", schedule: "08:00 - 17:00", duration: "7 Semester", icon: "calendar", order: 3 }
        ]);

        // ============================================================
        // 15. PMB FEE CATEGORIES & ITEMS
        // ============================================================
        console.log("Seeding PMB fees...");
        const [catMurni] = await db.insert(schema.pmbFeeCategories).values({
            title: "Biaya Jalur Murni",
            studentType: "Murni",
            total: "Rp 4.500.000",
            order: 1
        }).returning({ id: schema.pmbFeeCategories.id });

        await db.insert(schema.pmbFeeItems).values([
            { categoryId: catMurni.id, label: "Biaya Pendaftaran", amount: "Rp 350.000", order: 1 },
            { categoryId: catMurni.id, label: "Uang Pangkal", amount: "Rp 2.500.000", order: 2 },
            { categoryId: catMurni.id, label: "SPP Semester 1", amount: "Rp 1.650.000", order: 3 }
        ]);

        const [catTransisi] = await db.insert(schema.pmbFeeCategories).values({
            title: "Biaya Jalur Pindahan",
            studentType: "Transisi",
            total: "Rp 5.200.000",
            order: 2
        }).returning({ id: schema.pmbFeeCategories.id });

        await db.insert(schema.pmbFeeItems).values([
            { categoryId: catTransisi.id, label: "Biaya Konversi Matkul", amount: "Rp 1.000.000", order: 1 },
            { categoryId: catTransisi.id, label: "Uang Pangkal", amount: "Rp 2.500.000", order: 2 },
            { categoryId: catTransisi.id, label: "SPP Semester 1", amount: "Rp 1.700.000", order: 3 }
        ]);

        // ============================================================
        // 16. PMB REQUIREMENTS
        // ============================================================
        console.log("Seeding PMB requirements...");
        await db.insert(schema.pmbRequirements).values([
            { studentType: "Murni", requirement: "Fotokopi Ijazah SMA/Sederajat yang dilegalisir (2 lembar)", order: 1 },
            { studentType: "Murni", requirement: "Pas Foto 3x4 Latar Belakang Merah (4 lembar)", order: 2 },
            { studentType: "Transisi", requirement: "Transkrip Nilai dari Kampus Asal", order: 1 },
            { studentType: "Transisi", requirement: "Surat Keterangan Pindah", order: 2 }
        ]);

        // ============================================================
        // 17. PMB TEAM
        // ============================================================
        console.log("Seeding PMB team...");
        await db.insert(schema.pmbTeam).values([
            { name: "Admin PMB 1", role: "Information Desk", phone: "08123456789", email: "pmb1@unpal.ac.id", order: 1 },
            { name: "Admin PMB 2", role: "Finance Desk", phone: "08987654321", email: "pmb2@unpal.ac.id", order: 2 }
        ]);

        // ============================================================
        // 18. PMB TIMELINE
        // ============================================================
        console.log("Seeding PMB timeline...");
        await db.insert(schema.pmbTimeline).values([
            { step: 1, title: "Pendaftaran Online", description: "Buka website pmb.unpal.ac.id atau daftar di kampus.", date: "Februari - Mei 2026" },
            { step: 2, title: "Tes Potensi Akademik", description: "Dilaksanakan secara CBT.", date: "Juni 2026" },
            { step: 3, title: "Pengumuman Kelulusan", description: "Diumumkan di website.", date: "Juli 2026" }
        ]);

        // ============================================================
        // 19. TUITION FEES (Umum)
        // ============================================================
        console.log("Seeding general tuition fees...");
        await db.insert(schema.tuitionFees).values([
            { category: "S1 Hukum", name: "SPP Reguler / Semester", amount: "Rp 1.650.000", description: "Flat sampai lulus." },
            { category: "S1 Hukum", name: "SKS", amount: "Gratis", description: "Sudah termasuk dalam SPP." }
        ]);

        // ============================================================
        // 20. GALLERY
        // ============================================================
        console.log("Seeding gallery...");
        await db.insert(schema.gallery).values([
            { title: "Gedung Fakultas Hukum", description: "Tampak depan kampus UNPAL.", filePath: "/uploads/gallery/campus.jpg", mediaType: "image", categoryName: "Fasilitas" },
            { title: "Suasana Perkuliahan", description: "Kegiatan belajar mengajar di kelas.", filePath: "/uploads/gallery/class.jpg", mediaType: "image", categoryName: "Kegiatan" }
        ]);

        // ============================================================
        // 21. SITE STATS
        // ============================================================
        console.log("Seeding site stats...");
        await db.insert(schema.siteStats).values({ views: 1250 });

        console.log("Seed process completed successfully!");
    } catch (e) {
        console.error("Seed process failed:", e);
        process.exit(1);
    }
}

main().then(() => process.exit(0));
