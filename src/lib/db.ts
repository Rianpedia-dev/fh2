import { db } from "@/db";
import * as schema from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import {
    getPmbTracks,
    getPmbClasses,
    getPmbFeeCategories,
    getPmbFeeItemsByCategoryId,
    getPmbRequirements,
    getPmbTeam,
    getFullProfile,
    getFullSiteConfig,
} from "@/db/queries";

// ============================================================
// GALLERY MEDIA
// ============================================================
export async function getPublishedGalleryMedia() {
    try {
        const items = await db.select().from(schema.gallery).orderBy(schema.gallery.id);
        return items.map(item => ({
            id: String(item.id),
            title: item.title,
            description: item.description,
            filePath: item.filePath,
            thumbnailPath: item.thumbnailPath,
            mediaType: item.mediaType,
            categoryName: item.categoryName,
            createdAt: item.createdAt,
        }));
    } catch (e) {
        console.error("Failed to get gallery media:", e);
        return [];
    }
}

// ============================================================
// PMB DATA (Aggregated)
// ============================================================
export async function getPublishedPmbData() {
    try {
        const [tracks, classes, feeCategories, requirements, team] = await Promise.all([
            getPmbTracks(),
            getPmbClasses(),
            getPmbFeeCategories(),
            getPmbRequirements(),
            getPmbTeam(),
        ]);

        // Get fee items for each category
        const murniCategories = feeCategories.filter(c => c.studentType.toLowerCase() === "murni");
        const transisiCategories = feeCategories.filter(c => c.studentType.toLowerCase() === "transisi");

        const murniFeesWithItems = await Promise.all(
            murniCategories.map(async (cat) => {
                const items = await getPmbFeeItemsByCategoryId(cat.id);
                return {
                    title: cat.title,
                    total: cat.total ?? "0",
                    items: items.map(i => ({ label: i.label, amount: i.amount })),
                };
            })
        );

        const transisiFeesWithItems = await Promise.all(
            transisiCategories.map(async (cat) => {
                const items = await getPmbFeeItemsByCategoryId(cat.id);
                return {
                    title: cat.title,
                    total: cat.total ?? "0",
                    items: items.map(i => ({ label: i.label, amount: i.amount })),
                };
            })
        );

        const murniRequirements = requirements
            .filter(r => r.studentType.toLowerCase() === "murni")
            .map(r => r.requirement);

        const transisiRequirements = requirements
            .filter(r => r.studentType.toLowerCase() === "transisi")
            .map(r => r.requirement);

        return {
            tracks: tracks.map(t => ({
                id: t.trackId.toLowerCase(),
                title: t.title,
                description: t.description ?? "",
            })),
            classes: classes.map(c => ({
                id: String(c.id),
                title: c.title,
                type: c.type,
                description: c.description ?? "",
                schedule: c.schedule ?? "",
                duration: c.duration ?? "",
                icon: c.icon ?? "sun",
            })),
            fees: {
                murni: murniFeesWithItems,
                transisi: transisiFeesWithItems,
            },
            requirements: {
                murni: murniRequirements,
                transisi: transisiRequirements,
            },
            team: team.map(t => ({
                name: t.name,
                role: t.role,
                phone: t.phone,
                email: t.email,
                image: t.image ?? "/images/dosen/placeholder.jpg",
            })),
        };
    } catch (e) {
        console.error("Failed to get PMB data:", e);
        return {
            tracks: [],
            classes: [],
            fees: { murni: [], transisi: [] },
            requirements: { murni: [], transisi: [] },
            team: [],
        };
    }
}

// ============================================================
// UNIVERSITY PROFILE & CAMPUS STATISTICS
// ============================================================

export async function getPublishedUniversityProfile() {
    try {
        const [profile, siteConfig] = await Promise.all([
            getFullProfile(),
            getFullSiteConfig(),
        ]);

        return [{
            name: siteConfig.name || "Fakultas Hukum",
            shortName: siteConfig.shortName || "FH",
            vision: profile.visi || "",
            mission: profile.misi.join("\n") || "",
            objectives: profile.tujuan || "",
            values: "Integritas, Inovasi, Kolaborasi, Unggul",
            history: profile.sejarah || "",
            logo: "/images/logo_univ.png",
            motto: profile.motto || "",
            establishedYear: 1960,
            accreditation: profile.akreditasi.grade || "B",
        }];
    } catch (e) {
        console.error("Failed to get university profile:", e);
        return [];
    }
}

export async function getPublishedCampusStatistics() {
    try {
        const profile = await getFullProfile();
        return {
            totalStudents: parseInt(profile.stats.students) || 0,
            totalStudyPrograms: parseInt(profile.stats.studyPrograms) || 0,
            accreditation: profile.akreditasi.grade || "B",
            internationalPartners: parseInt(profile.stats.partners) || 0,
        };
    } catch (e) {
        console.error("Failed to get campus statistics:", e);
        return null;
    }
}
