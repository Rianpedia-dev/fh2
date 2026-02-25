import { db } from "./index";
import * as schema from "./schema";
import { eq, asc, sql } from "drizzle-orm";

// ============================================================
// PENGUMUMAN (Berita)
// ============================================================
export async function getAnnouncements() {
    try {
        return await db.select().from(schema.announcements).orderBy(schema.announcements.id);
    } catch (e) {
        return [];
    }
}

export async function getAnnouncementById(id: number) {
    try {
        const rows = await db.select().from(schema.announcements).where(eq(schema.announcements.id, id));
        return rows[0] ?? undefined;
    } catch (e) {
        return undefined;
    }
}

// ============================================================
// DOSEN
// ============================================================
export async function getLecturers() {
    try {
        return await db.select().from(schema.lecturers).orderBy(schema.lecturers.id);
    } catch (e) {
        return [];
    }
}

export async function getLecturerById(id: number) {
    try {
        const rows = await db.select().from(schema.lecturers).where(eq(schema.lecturers.id, id));
        return rows[0] ?? undefined;
    } catch (e) {
        return undefined;
    }
}

// ============================================================
// STAFF
// ============================================================
export async function getStaff() {
    try {
        return await db.select().from(schema.staff).orderBy(schema.staff.id);
    } catch (e) {
        return [];
    }
}

export async function getStaffById(id: number) {
    try {
        const rows = await db.select().from(schema.staff).where(eq(schema.staff.id, id));
        return rows[0] ?? undefined;
    } catch (e) {
        return undefined;
    }
}

// ============================================================
// ORGANISASI
// ============================================================
export async function getOrganizations() {
    try {
        return await db.select().from(schema.organizations).orderBy(schema.organizations.id);
    } catch (e) {
        return [];
    }
}

export async function getOrganizationById(id: number) {
    try {
        const rows = await db.select().from(schema.organizations).where(eq(schema.organizations.id, id));
        return rows[0] ?? undefined;
    } catch (e) {
        return undefined;
    }
}

// ============================================================
// GALERI
// ============================================================
export async function getGallery() {
    try {
        return await db.select().from(schema.gallery).orderBy(schema.gallery.id);
    } catch (e) {
        return [];
    }
}

export async function getGalleryById(id: number) {
    try {
        const rows = await db.select().from(schema.gallery).where(eq(schema.gallery.id, id));
        return rows[0] ?? undefined;
    } catch (e) {
        return undefined;
    }
}

// ============================================================
// PMB TIMELINE
// ============================================================
export async function getPmbTimeline() {
    try {
        return await db.select().from(schema.pmbTimeline).orderBy(asc(schema.pmbTimeline.step));
    } catch (e) {
        return [];
    }
}

export async function getPmbTimelineById(id: number) {
    try {
        const rows = await db.select().from(schema.pmbTimeline).where(eq(schema.pmbTimeline.id, id));
        return rows[0] ?? undefined;
    } catch (e) {
        return undefined;
    }
}

// ============================================================
// BIAYA KULIAH
// ============================================================
export async function getTuitionFees() {
    try {
        return await db.select().from(schema.tuitionFees).orderBy(schema.tuitionFees.id);
    } catch (e) {
        return [];
    }
}

export async function getTuitionFeeById(id: number) {
    try {
        const rows = await db.select().from(schema.tuitionFees).where(eq(schema.tuitionFees.id, id));
        return rows[0] ?? undefined;
    } catch (e) {
        return undefined;
    }
}

// ============================================================
// PROFIL (Key-Value)
// ============================================================
export async function getProfileValue(key: string): Promise<string> {
    try {
        const rows = await db.select().from(schema.profile).where(eq(schema.profile.key, key));
        return rows[0]?.value ?? "";
    } catch (e) {
        return "";
    }
}

export async function getAllProfile() {
    try {
        return await db.select().from(schema.profile);
    } catch (e) {
        return [];
    }
}

export async function getFullProfile() {
    const rows = await getAllProfile();
    const map: Record<string, string> = {};
    for (const row of rows) {
        map[row.key] = row.value;
    }

    return {
        sejarah: map["sejarah"] ?? "Fakultas Hukum merupakan salah satu fakultas yang berdiri sejak awal berdirinya Universitas Palembang. Kehadiran Fakultas Hukum dilatarbelakangi oleh kebutuhan masyarakat Sumatera Selatan akan pendidikan tinggi di bidang hukum yang mampu mencetak sarjana hukum yang profesional,berintegritas, serta berwawasan kebangsaan. Secara kelembagaan, Universitas Palembang memperoleh izin pendirian berdasarkan Surat Keputusan Nomor 79/Kop.II/N.IV/82 tanggal 8 April 1982 yang ditandatangani oleh Koordinator Perguruan Tinggi Swasta Wilayah II. SK tersebut menjadi dasar hukum berdirinya Universitas Palembang sebagai perguruan tinggi swasta yang sah dan diakui. Selanjutnya, Fakultas Hukum resmi memperoleh izin pembukaan Program Studi berdasarkan Surat Keputusan Nomor 06/I/0/1985 tanggal 2 Desember 1985 yang ditandatangani oleh Sekretaris Jenderal Departemen Pendidikan dan Kebudayaan Republik Indonesia. Dengan terbitnya SK tersebut, Fakultas Hukum secara resmi menyelenggarakan pendidikan tinggi di bidang ilmu hukum.",
        visi: map["visi"] ?? "Menjadi program studi ilmu hukum yang menghasilkan sarjana hukum profesional di bidang praktisi hukum yang mampu bersaing di masyarakat.",
        misi: (() => {
            try {
                return JSON.parse(map["misi"] ?? "[]") as string[];
            } catch (e) {
                console.error("Failed to parse misi:", e);
                return [];
            }
        })(),
        akreditasi: {
            grade: map["akreditasi_grade"] ?? "B",
            sk: map["akreditasi_sk"] ?? "",
            validUntil: map["akreditasi_validUntil"] ?? "",
            description: map["akreditasi_description"] ?? "",
        },
        tujuan: map["tujuan"] ?? "Menghasilkan lulusan ilmu hukum yang memiliki kemampuan akademik,profesional, dan berdaya saing serta mampu menerapkan teori dan praktik hukum di bidang pemerintahan maupun swasta. Lulusan juga diharapkan memiliki sikap dan perilaku yang baik serta mampu mengabdikan ilmunya untuk pengembangan ilmu hukum, profesi hukum, dan kesejahteraan masyarakat. Selain itu, menghasilkan penelitian hukum yang berkualitas dengan melibatkan mahasiswa guna mendukung penegakan hukum dan memberikan manfaat bagi masyarakat melalui kegiatan pengabdian.",
        motto: map["motto"] ?? "Mencetak generasi ahli hukum yang berintegritas, kritis, dan siap menegakkan keadilan bagi masyarakat.",
        dekanName: map["dekan_name"] ?? "Dr. Ardiana Hidayah, S.H., M.H.",
        sambutan: map["sambutan"] ?? "Puji dan syukur kita panjatkan ke hadirat Tuhan Yang Maha Esa atas rahmat dan karunia-Nya, sehinggaFakultas Hukum Universitas Palembang terus berkembang dan berkontribusi dalam mencetak sumber daya manusia yang unggul di bidang hukum.Fakultas Hukum Universitas Palembang hadir sebagai bagian dari komitmen institusi dalam menyelenggarakan pendidikan tinggi yang berkualitas, profesional, dan berintegritas. Sejak berdiri,Fakultas Hukum berupaya membangun tradisi akademik yang kuat melalui pelaksanaan Tri Dharma Perguruan Tinggi, yaitu pendidikan dan pengajaran, penelitian, serta pengabdian kepada masyarakat. Kami berkomitmen untuk menghasilkan lulusan yang tidak hanya memiliki kompetensi akademik yang mumpuni, tetapi juga memiliki karakter, etika profesi, serta kepekaan sosial yang tinggi. Di tengah dinamika perkembangan hukum nasional dan global, Fakultas Hukum terus melakukan pembaruan kurikulum, peningkatan kualitas sumber daya dosen, serta penguatan kerja sama dengan berbagai lembaga pemerintah maupun swasta. Kami menyadari bahwa tantangan dunia hukum ke depan semakin kompleks. Oleh karena itu, kami mendorong seluruh civitas akademika untuk senantiasa adaptif, inovatif, dan menjunjung tinggi nilai-nilai keadilan serta supremasi hukum.Akhir kata, kami mengucapkan terima kasih kepada seluruh pihak yang telah memberikan dukungan dan kepercayaan kepada Fakultas Hukum Universitas Palembang. Semoga ke depan, Fakultas Hukum semakin maju dan mampu memberikan kontribusi nyata bagi masyarakat, bangsa, dan negara.",
        dekanImage: map["dekan_image"] ?? null,
        stats: {
            students: map["stats_students"] ?? "2000",
            studyPrograms: map["stats_study_programs"] ?? "1",
            partners: map["stats_partners"] ?? "10",
            yearsStanding: map["stats_years"] ?? "1985",
            successfulAlumni: map["stats_alumni"] ?? "1000",
        }
    };
}

// ============================================================
// SITE CONFIG (Key-Value)
// ============================================================
export async function getSiteConfigValue(key: string): Promise<string> {
    try {
        const rows = await db.select().from(schema.siteConfig).where(eq(schema.siteConfig.key, key));
        return rows[0]?.value ?? "";
    } catch (e) {
        return "";
    }
}

export interface SiteConfig {
    name: string;
    university: string;
    shortName: string;
    description: string;
    address: string;
    phone: string;
    email: string;
    socialMedia: {
        instagram: string;
        facebook: string;
        youtube: string;
    };
    mapUrl: string;
}

export async function getFullSiteConfig(): Promise<SiteConfig> {
    const map: Record<string, string> = {};
    try {
        const rows = await db.select().from(schema.siteConfig);
        for (const row of rows) {
            map[row.key] = row.value;
        }
    } catch (e) { }

    return {
        name: map["name"] ?? "Fakultas Hukum",
        university: map["university"] ?? "Universitas Palembang",
        shortName: map["shortName"] ?? "FH UNPAL",
        description: map["description"] ?? "",
        address: map["address"] ?? "",
        phone: map["phone"] ?? "",
        email: map["email"] ?? "",
        socialMedia: {
            instagram: map["instagram"] ?? "",
            facebook: map["facebook"] ?? "",
            youtube: map["youtube"] ?? "",
        },
        mapUrl: map["mapUrl"] ?? "",
    };
}

// ============================================================
// DASHBOARD COUNTS
// ============================================================
export async function getDashboardCounts() {
    try {
        const [
            announcementsList,
            lecturersList,
            staffList,
            organizationsList,
            galleryList,
            testimonialsList,
            partnersList
        ] = await Promise.all([
            db.select().from(schema.announcements).catch(() => []),
            db.select().from(schema.lecturers).catch(() => []),
            db.select().from(schema.staff).catch(() => []),
            db.select().from(schema.organizations).catch(() => []),
            db.select().from(schema.gallery).catch(() => []),
            db.select().from(schema.testimonials).catch(() => []),
            db.select().from(schema.partners).catch(() => []),
        ]);

        return {
            announcements: announcementsList.length,
            lecturers: lecturersList.length,
            staff: staffList.length,
            organizations: organizationsList.length,
            gallery: galleryList.length,
            testimonials: testimonialsList.length,
            partners: partnersList.length,
        };
    } catch (e) {
        console.error("Dashboard counts error:", e);
        return {
            announcements: 0,
            lecturers: 0,
            staff: 0,
            organizations: 0,
            gallery: 0,
            testimonials: 0,
            partners: 0,
        };
    }
}

// ============================================================
// HERO SLIDER
// ============================================================
export async function getHeroSlides() {
    try {
        return await db.select().from(schema.heroSlides).orderBy(asc(schema.heroSlides.order));
    } catch (e) {
        return [];
    }
}

export async function getHeroSlideById(id: number) {
    try {
        const rows = await db.select().from(schema.heroSlides).where(eq(schema.heroSlides.id, id));
        return rows[0] ?? undefined;
    } catch (e) {
        return undefined;
    }
}

// ============================================================
// SITE STATS / VISITOR COUNTER
// ============================================================
export async function incrementViews() {
    try {
        const stats = await db.select().from(schema.siteStats).where(eq(schema.siteStats.id, 1)).limit(1);
        if (stats.length === 0) {
            // Jika belum ada data sama sekali, buat data awal
            await db.insert(schema.siteStats).values({ id: 1, views: 1 });
            return;
        }

        return await db.update(schema.siteStats)
            .set({ views: sql`${schema.siteStats.views} + 1` })
            .where(eq(schema.siteStats.id, 1));
    } catch (e) { }
}

export async function getViews(): Promise<number> {
    try {
        const rows = await db.select().from(schema.siteStats).where(eq(schema.siteStats.id, 1));
        return rows[0]?.views ?? 0;
    } catch (e) {
        return 0;
    }
}

export async function resetViews() {
    try {
        return await db.update(schema.siteStats)
            .set({ views: 0 })
            .where(eq(schema.siteStats.id, 1));
    } catch (e) {
        throw new Error("Gagal mereset jumlah pengunjung");
    }
}


// ============================================================
// TESTIMONIALS (Testimoni Alumni)
// ============================================================
export async function getTestimonials() {
    try {
        return await db.select().from(schema.testimonials).orderBy(schema.testimonials.id);
    } catch (e) {
        return [];
    }
}

export async function getTestimonialById(id: number) {
    try {
        const rows = await db.select().from(schema.testimonials).where(eq(schema.testimonials.id, id));
        return rows[0] ?? undefined;
    } catch (e) {
        return undefined;
    }
}

// ============================================================
// PARTNERS (Mitra/Kerjasama)
// ============================================================
export async function getPartners() {
    try {
        return await db.select().from(schema.partners).orderBy(asc(schema.partners.order));
    } catch (e) {
        return [];
    }
}

export async function getPartnerById(id: number) {
    try {
        const rows = await db.select().from(schema.partners).where(eq(schema.partners.id, id));
        return rows[0] ?? undefined;
    } catch (e) {
        return undefined;
    }
}

// ============================================================
// CONTACT INFO (Key-Value)
// ============================================================
export async function getContactInfo() {
    try {
        const rows = await db.select().from(schema.contactInfo);
        const map: Record<string, string> = {};
        for (const row of rows) {
            map[row.key] = row.value;
        }
        return {
            name: map["name"] ?? "Fakultas Hukum Universitas Palembang",
            address: map["address"] ?? "",
            city: map["city"] ?? "",
            province: map["province"] ?? "",
            postalCode: map["postalCode"] ?? "",
            phone: map["phone"] ?? "",
            fax: map["fax"] ?? "",
            email: map["email"] ?? "",
            website: map["website"] ?? "",
            operatingHours: map["operatingHours"] ?? "",
            mapUrl: map["mapUrl"] ?? "",
        };
    } catch (e) {
        return {
            name: "Fakultas Hukum Universitas Palembang",
            address: "", city: "", province: "", postalCode: "",
            phone: "", fax: "", email: "", website: "", operatingHours: "", mapUrl: "",
        };
    }
}

// ============================================================
// SOCIAL MEDIA
// ============================================================
export async function getSocialMedia() {
    try {
        return await db.select().from(schema.socialMedia).orderBy(asc(schema.socialMedia.order));
    } catch (e) {
        return [];
    }
}

// ============================================================
// CAMPUS ACCESS
// ============================================================
export async function getCampusAccess() {
    try {
        return await db.select().from(schema.campusAccess).orderBy(asc(schema.campusAccess.order));
    } catch (e) {
        return [];
    }
}

// ============================================================
// PMB TRACKS (Jalur Pendaftaran)
// ============================================================
export async function getPmbTracks() {
    try {
        return await db.select().from(schema.pmbTracks).orderBy(asc(schema.pmbTracks.order));
    } catch (e) {
        return [];
    }
}

// ============================================================
// PMB CLASSES (Jenis Kelas)
// ============================================================
export async function getPmbClasses() {
    try {
        return await db.select().from(schema.pmbClasses).orderBy(asc(schema.pmbClasses.order));
    } catch (e) {
        return [];
    }
}

// ============================================================
// PMB FEE CATEGORIES
// ============================================================
export async function getPmbFeeCategories() {
    try {
        return await db.select().from(schema.pmbFeeCategories).orderBy(asc(schema.pmbFeeCategories.order));
    } catch (e) {
        return [];
    }
}

// ============================================================
// PMB FEE ITEMS
// ============================================================
export async function getPmbFeeItems() {
    try {
        return await db.select().from(schema.pmbFeeItems).orderBy(asc(schema.pmbFeeItems.order));
    } catch (e) {
        return [];
    }
}

export async function getPmbFeeItemsByCategoryId(categoryId: number) {
    try {
        return await db.select().from(schema.pmbFeeItems)
            .where(eq(schema.pmbFeeItems.categoryId, categoryId))
            .orderBy(asc(schema.pmbFeeItems.order));
    } catch (e) {
        return [];
    }
}

// ============================================================
// PMB REQUIREMENTS (Syarat Pendaftaran)
// ============================================================
export async function getPmbRequirements() {
    try {
        return await db.select().from(schema.pmbRequirements).orderBy(asc(schema.pmbRequirements.order));
    } catch (e) {
        return [];
    }
}

// ============================================================
// ADMIN USERS
// ============================================================
export async function getAdminUsers() {
    try {
        return await db.select().from(schema.adminUsers).orderBy(schema.adminUsers.id);
    } catch (e) {
        return [];
    }
}

export async function getAdminUserByEmail(email: string) {
    try {
        const rows = await db.select().from(schema.adminUsers).where(eq(schema.adminUsers.email, email));
        return rows[0] ?? undefined;
    } catch (e) {
        return undefined;
    }
}

export async function getAdminUserById(id: number) {
    try {
        const rows = await db.select().from(schema.adminUsers).where(eq(schema.adminUsers.id, id));
        return rows[0] ?? undefined;
    } catch (e) {
        return undefined;
    }
}
// ============================================================
// PMB TEAM
// ============================================================
export async function getPmbTeam() {
    try {
        return await db.select().from(schema.pmbTeam).orderBy(asc(schema.pmbTeam.order));
    } catch (e) {
        return [];
    }
}
