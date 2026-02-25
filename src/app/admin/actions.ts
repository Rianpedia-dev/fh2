"use server";

import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { saveFile, deleteFile, validateAndUploadImage } from "@/lib/upload-utils";
import { createSuperAdmin } from "@/lib/admin-init";

export async function uploadImageAction(formData: FormData) {
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as string || "";
    return await validateAndUploadImage(file, folder);
}

// ============================================================
// ANNOUNCEMENTS (Berita)
// ============================================================
export async function createAnnouncement(data: {
    title: string; excerpt?: string; content?: string; date?: string;
    category?: string; imageUrl?: string;
}) {
    if (!data.title?.trim()) throw new Error("Judul wajib diisi");
    if (!data.content?.trim()) throw new Error("Konten wajib diisi");
    if (data.title.length > 200) throw new Error("Judul terlalu panjang (maks 200 karakter)");

    await db.insert(schema.announcements).values(data);
    revalidatePath("/admin/berita");
    revalidatePath("/berita");
    revalidatePath("/");
}

export async function updateAnnouncement(id: number, data: {
    title?: string; excerpt?: string; content?: string; date?: string;
    category?: string; imageUrl?: string;
}) {
    if (data.title !== undefined && !data.title?.trim()) throw new Error("Judul wajib diisi");
    if (data.content !== undefined && !data.content?.trim()) throw new Error("Konten wajib diisi");
    if (data.title && data.title.length > 200) throw new Error("Judul terlalu panjang");

    // Jika ada gambar baru, hapus gambar lama
    if (data.imageUrl) {
        const old = await db.select().from(schema.announcements).where(eq(schema.announcements.id, id)).limit(1);
        if (old[0]?.imageUrl && old[0].imageUrl !== data.imageUrl) {
            await deleteFile(old[0].imageUrl);
        }
    }
    await db.update(schema.announcements).set(data).where(eq(schema.announcements.id, id));
    revalidatePath("/admin/berita");
    revalidatePath("/berita");
    revalidatePath("/");
}

export async function deleteAnnouncement(id: number) {
    const old = await db.select().from(schema.announcements).where(eq(schema.announcements.id, id)).limit(1);
    if (old[0]?.imageUrl) {
        await deleteFile(old[0].imageUrl);
    }
    await db.delete(schema.announcements).where(eq(schema.announcements.id, id));
    revalidatePath("/admin/berita");
    revalidatePath("/berita");
    revalidatePath("/");
}

// ============================================================
// LECTURERS (Dosen)
// ============================================================
export async function createLecturer(data: {
    name: string; nidn: string; position: string; specialization: string;
    education: string; email?: string; imageUrl?: string;
}) {
    if (!data.name?.trim()) throw new Error("Nama wajib diisi");
    if (!data.nidn?.trim()) throw new Error("NIDN wajib diisi");
    if (data.nidn.length < 10) throw new Error("NIDN minimal 10 digit");

    await db.insert(schema.lecturers).values(data);
    revalidatePath("/admin/dosen");
    revalidatePath("/civitas");
}

export async function updateLecturer(id: number, data: {
    name?: string; nidn?: string; position?: string; specialization?: string;
    education?: string; email?: string; imageUrl?: string;
}) {
    if (data.name !== undefined && !data.name?.trim()) throw new Error("Nama wajib diisi");
    if (data.nidn !== undefined && !data.nidn?.trim()) throw new Error("NIDN wajib diisi");
    if (data.nidn && data.nidn.length < 10) throw new Error("NIDN minimal 10 digit");

    if (data.imageUrl) {
        const old = await db.select().from(schema.lecturers).where(eq(schema.lecturers.id, id)).limit(1);
        if (old[0]?.imageUrl && old[0].imageUrl !== data.imageUrl) {
            await deleteFile(old[0].imageUrl);
        }
    }
    await db.update(schema.lecturers).set(data).where(eq(schema.lecturers.id, id));
    revalidatePath("/admin/dosen");
    revalidatePath("/civitas");
}

export async function deleteLecturer(id: number) {
    const old = await db.select().from(schema.lecturers).where(eq(schema.lecturers.id, id)).limit(1);
    if (old[0]?.imageUrl) {
        await deleteFile(old[0].imageUrl);
    }
    await db.delete(schema.lecturers).where(eq(schema.lecturers.id, id));
    revalidatePath("/admin/dosen");
    revalidatePath("/civitas");
}

// ============================================================
// GALLERY (Galeri)
// ============================================================
export async function createGalleryItem(data: {
    title: string; description?: string; filePath: string;
    thumbnailPath?: string; mediaType?: string; categoryName?: string;
}) {
    if (!data.title?.trim()) throw new Error("Judul wajib diisi");
    if (!data.filePath?.trim()) throw new Error("File atau URL wajib diisi");

    await db.insert(schema.gallery).values(data);
    revalidatePath("/admin/galeri");
    revalidatePath("/galeri");
}

export async function updateGalleryItem(id: number, data: {
    title?: string; description?: string; filePath?: string;
    thumbnailPath?: string; mediaType?: string; categoryName?: string;
}) {
    if (data.title !== undefined && !data.title?.trim()) throw new Error("Judul wajib diisi");
    if (data.filePath !== undefined && !data.filePath?.trim()) throw new Error("File atau URL wajib diisi");

    if (data.filePath || data.thumbnailPath) {
        const old = await db.select().from(schema.gallery).where(eq(schema.gallery.id, id)).limit(1);
        if (data.filePath && old[0]?.filePath && old[0].filePath !== data.filePath) {
            await deleteFile(old[0].filePath);
        }
        if (data.thumbnailPath && old[0]?.thumbnailPath && old[0].thumbnailPath !== data.thumbnailPath) {
            await deleteFile(old[0].thumbnailPath);
        }
    }
    await db.update(schema.gallery).set(data).where(eq(schema.gallery.id, id));
    revalidatePath("/admin/galeri");
    revalidatePath("/galeri");
}

export async function deleteGalleryItem(id: number) {
    const old = await db.select().from(schema.gallery).where(eq(schema.gallery.id, id)).limit(1);
    if (old[0]?.filePath) await deleteFile(old[0].filePath);
    if (old[0]?.thumbnailPath) await deleteFile(old[0].thumbnailPath);
    await db.delete(schema.gallery).where(eq(schema.gallery.id, id));
    revalidatePath("/admin/galeri");
    revalidatePath("/galeri");
}

// ============================================================
// HERO SLIDES
// ============================================================
export async function createHeroSlide(data: {
    imageUrl: string; title?: string; subtitle?: string;
    buttonText?: string; buttonLink?: string; order?: number; isActive?: boolean;
}) {
    await db.insert(schema.heroSlides).values(data);
    revalidatePath("/admin/hero");
    revalidatePath("/");
}

export async function updateHeroSlide(id: number, data: {
    imageUrl?: string; title?: string; subtitle?: string;
    buttonText?: string; buttonLink?: string; order?: number; isActive?: boolean;
}) {
    if (data.imageUrl) {
        const old = await db.select().from(schema.heroSlides).where(eq(schema.heroSlides.id, id)).limit(1);
        if (old[0]?.imageUrl && old[0].imageUrl !== data.imageUrl) {
            await deleteFile(old[0].imageUrl);
        }
    }
    await db.update(schema.heroSlides).set(data).where(eq(schema.heroSlides.id, id));
    revalidatePath("/admin/hero");
    revalidatePath("/");
}

export async function deleteHeroSlide(id: number) {
    const old = await db.select().from(schema.heroSlides).where(eq(schema.heroSlides.id, id)).limit(1);
    if (old[0]?.imageUrl) {
        await deleteFile(old[0].imageUrl);
    }
    await db.delete(schema.heroSlides).where(eq(schema.heroSlides.id, id));
    revalidatePath("/admin/hero");
    revalidatePath("/");
}

// ============================================================
// TESTIMONIALS
// ============================================================
export async function createTestimonial(data: {
    name: string; role: string; content: string; image?: string; rating?: number;
}) {
    if (!data.name?.trim()) throw new Error("Nama wajib diisi");
    if (!data.content?.trim()) throw new Error("Isi testimonial wajib diisi");
    if (data.rating && (data.rating < 1 || data.rating > 5)) throw new Error("Rating harus antara 1-5");

    await db.insert(schema.testimonials).values(data);
    revalidatePath("/admin/testimonial");
    revalidatePath("/");
}

export async function updateTestimonial(id: number, data: {
    name?: string; role?: string; content?: string; image?: string; rating?: number;
}) {
    if (data.name !== undefined && !data.name?.trim()) throw new Error("Nama wajib diisi");
    if (data.content !== undefined && !data.content?.trim()) throw new Error("Isi testimonial wajib diisi");
    if (data.rating !== undefined && (data.rating < 1 || data.rating > 5)) throw new Error("Rating harus antara 1-5");

    if (data.image) {
        const old = await db.select().from(schema.testimonials).where(eq(schema.testimonials.id, id)).limit(1);
        if (old[0]?.image && old[0].image !== data.image) {
            await deleteFile(old[0].image);
        }
    }
    await db.update(schema.testimonials).set(data).where(eq(schema.testimonials.id, id));
    revalidatePath("/admin/testimonial");
    revalidatePath("/");
}

export async function deleteTestimonial(id: number) {
    const old = await db.select().from(schema.testimonials).where(eq(schema.testimonials.id, id)).limit(1);
    if (old[0]?.image) {
        await deleteFile(old[0].image);
    }
    await db.delete(schema.testimonials).where(eq(schema.testimonials.id, id));
    revalidatePath("/admin/testimonial");
    revalidatePath("/");
}

// ============================================================
// PARTNERS
// ============================================================
export async function createPartner(data: {
    name: string; logo?: string; url?: string; order?: number;
}) {
    await db.insert(schema.partners).values(data);
    revalidatePath("/admin/partner");
    revalidatePath("/");
}

export async function updatePartner(id: number, data: {
    name?: string; logo?: string; url?: string; order?: number;
}) {
    if (data.logo) {
        const old = await db.select().from(schema.partners).where(eq(schema.partners.id, id)).limit(1);
        if (old[0]?.logo && old[0].logo !== data.logo) {
            await deleteFile(old[0].logo);
        }
    }
    await db.update(schema.partners).set(data).where(eq(schema.partners.id, id));
    revalidatePath("/admin/partner");
    revalidatePath("/");
}

export async function deletePartner(id: number) {
    const old = await db.select().from(schema.partners).where(eq(schema.partners.id, id)).limit(1);
    if (old[0]?.logo) {
        await deleteFile(old[0].logo);
    }
    await db.delete(schema.partners).where(eq(schema.partners.id, id));
    revalidatePath("/admin/partner");
    revalidatePath("/");
}

// ============================================================
// CONTACT INFO
// ============================================================
export async function upsertContactInfo(key: string, value: string) {
    const existing = await db.select().from(schema.contactInfo).where(eq(schema.contactInfo.key, key));
    if (existing.length > 0) {
        await db.update(schema.contactInfo).set({ value }).where(eq(schema.contactInfo.key, key));
    } else {
        await db.insert(schema.contactInfo).values({ key, value });
    }
    revalidatePath("/admin/kontak");
    revalidatePath("/kontak");
}

// ============================================================
// SOCIAL MEDIA
// ============================================================
export async function createSocialMedia(data: {
    platform: string; url: string; username?: string; icon?: string; order?: number;
}) {
    await db.insert(schema.socialMedia).values(data);
    revalidatePath("/admin/kontak");
    revalidatePath("/kontak");
}

export async function updateSocialMedia(id: number, data: {
    platform?: string; url?: string; username?: string; icon?: string; order?: number;
}) {
    await db.update(schema.socialMedia).set(data).where(eq(schema.socialMedia.id, id));
    revalidatePath("/admin/kontak");
    revalidatePath("/kontak");
}

export async function deleteSocialMedia(id: number) {
    await db.delete(schema.socialMedia).where(eq(schema.socialMedia.id, id));
    revalidatePath("/admin/kontak");
    revalidatePath("/kontak");
}

// ============================================================
// CAMPUS ACCESS
// ============================================================
export async function createCampusAccess(data: {
    name: string; description: string; icon?: string; order?: number;
}) {
    await db.insert(schema.campusAccess).values(data);
    revalidatePath("/admin/kontak");
    revalidatePath("/kontak");
}

export async function updateCampusAccess(id: number, data: {
    name?: string; description?: string; icon?: string; order?: number;
}) {
    await db.update(schema.campusAccess).set(data).where(eq(schema.campusAccess.id, id));
    revalidatePath("/admin/kontak");
    revalidatePath("/kontak");
}

export async function deleteCampusAccess(id: number) {
    await db.delete(schema.campusAccess).where(eq(schema.campusAccess.id, id));
    revalidatePath("/admin/kontak");
    revalidatePath("/kontak");
}

// ============================================================
// PMB TRACKS
// ============================================================
export async function createPmbTrack(data: {
    trackId: string; title: string; description?: string; order?: number;
}) {
    if (!data.trackId?.trim()) throw new Error("ID Jalur wajib diisi");
    if (!data.title?.trim()) throw new Error("Judul wajib diisi");

    await db.insert(schema.pmbTracks).values(data);
    revalidatePath("/admin/pmb");
    revalidatePath("/pmb");
}

export async function updatePmbTrack(id: number, data: {
    trackId?: string; title?: string; description?: string; order?: number;
}) {
    if (data.trackId !== undefined && !data.trackId?.trim()) throw new Error("ID Jalur wajib diisi");
    if (data.title !== undefined && !data.title?.trim()) throw new Error("Judul wajib diisi");

    await db.update(schema.pmbTracks).set(data).where(eq(schema.pmbTracks.id, id));
    revalidatePath("/admin/pmb");
    revalidatePath("/pmb");
}

export async function deletePmbTrack(id: number) {
    await db.delete(schema.pmbTracks).where(eq(schema.pmbTracks.id, id));
    revalidatePath("/admin/pmb");
    revalidatePath("/pmb");
}

// ============================================================
// PMB CLASSES
// ============================================================
export async function createPmbClass(data: {
    title: string; type: string; description?: string; schedule?: string;
    duration?: string; icon?: string; order?: number;
}) {
    if (!data.title?.trim()) throw new Error("Nama kelas wajib diisi");
    if (!data.type?.trim()) throw new Error("Tipe kelas wajib diisi");

    await db.insert(schema.pmbClasses).values(data);
    revalidatePath("/admin/pmb");
    revalidatePath("/pmb");
}

export async function updatePmbClass(id: number, data: {
    title?: string; type?: string; description?: string; schedule?: string;
    duration?: string; icon?: string; order?: number;
}) {
    if (data.title !== undefined && !data.title?.trim()) throw new Error("Nama kelas wajib diisi");
    if (data.type !== undefined && !data.type?.trim()) throw new Error("Tipe kelas wajib diisi");

    await db.update(schema.pmbClasses).set(data).where(eq(schema.pmbClasses.id, id));
    revalidatePath("/admin/pmb");
    revalidatePath("/pmb");
}

export async function deletePmbClass(id: number) {
    await db.delete(schema.pmbClasses).where(eq(schema.pmbClasses.id, id));
    revalidatePath("/admin/pmb");
    revalidatePath("/pmb");
}

// ============================================================
// PMB FEE CATEGORIES
// ============================================================
export async function createPmbFeeCategory(data: {
    title: string; studentType: string; total?: string; order?: number;
}) {
    await db.insert(schema.pmbFeeCategories).values(data);
    revalidatePath("/admin/pmb");
    revalidatePath("/pmb");
}

export async function updatePmbFeeCategory(id: number, data: {
    title?: string; studentType?: string; total?: string; order?: number;
}) {
    await db.update(schema.pmbFeeCategories).set(data).where(eq(schema.pmbFeeCategories.id, id));
    revalidatePath("/admin/pmb");
    revalidatePath("/pmb");
}

export async function deletePmbFeeCategory(id: number) {
    // Also delete child items
    await db.delete(schema.pmbFeeItems).where(eq(schema.pmbFeeItems.categoryId, id));
    await db.delete(schema.pmbFeeCategories).where(eq(schema.pmbFeeCategories.id, id));
    revalidatePath("/admin/pmb");
    revalidatePath("/pmb");
}

// ============================================================
// PMB FEE ITEMS
// ============================================================
export async function createPmbFeeItem(data: {
    categoryId: number; label: string; amount: string; order?: number;
}) {
    await db.insert(schema.pmbFeeItems).values(data);
    revalidatePath("/admin/pmb");
    revalidatePath("/pmb");
}

export async function updatePmbFeeItem(id: number, data: {
    categoryId?: number; label?: string; amount?: string; order?: number;
}) {
    await db.update(schema.pmbFeeItems).set(data).where(eq(schema.pmbFeeItems.id, id));
    revalidatePath("/admin/pmb");
    revalidatePath("/pmb");
}

export async function deletePmbFeeItem(id: number) {
    await db.delete(schema.pmbFeeItems).where(eq(schema.pmbFeeItems.id, id));
    revalidatePath("/admin/pmb");
    revalidatePath("/pmb");
}

// ============================================================
// PMB REQUIREMENTS
// ============================================================
export async function createPmbRequirement(data: {
    studentType: string; requirement: string; order?: number;
}) {
    await db.insert(schema.pmbRequirements).values(data);
    revalidatePath("/admin/pmb");
    revalidatePath("/pmb");
}

export async function updatePmbRequirement(id: number, data: {
    studentType?: string; requirement?: string; order?: number;
}) {
    await db.update(schema.pmbRequirements).set(data).where(eq(schema.pmbRequirements.id, id));
    revalidatePath("/admin/pmb");
    revalidatePath("/pmb");
}

export async function deletePmbRequirement(id: number) {
    await db.delete(schema.pmbRequirements).where(eq(schema.pmbRequirements.id, id));
    revalidatePath("/admin/pmb");
    revalidatePath("/pmb");
}

// ============================================================
// PMB TEAM
// ============================================================
export async function createPmbTeamMember(data: {
    name: string; role: string; phone: string; email: string; image?: string; order?: number;
}) {
    if (!data.name?.trim()) throw new Error("Nama wajib diisi");
    if (!data.role?.trim()) throw new Error("Jabatan wajib diisi");

    await db.insert(schema.pmbTeam).values(data);
    revalidatePath("/admin/pmb");
    revalidatePath("/pmb");
}

export async function updatePmbTeamMember(id: number, data: {
    name?: string; role?: string; phone?: string; email?: string; image?: string; order?: number;
}) {
    if (data.name !== undefined && !data.name?.trim()) throw new Error("Nama wajib diisi");
    if (data.role !== undefined && !data.role?.trim()) throw new Error("Jabatan wajib diisi");

    if (data.image) {
        const old = await db.select().from(schema.pmbTeam).where(eq(schema.pmbTeam.id, id)).limit(1);
        if (old[0]?.image && old[0].image !== data.image) {
            await deleteFile(old[0].image);
        }
    }
    await db.update(schema.pmbTeam).set(data).where(eq(schema.pmbTeam.id, id));
    revalidatePath("/admin/pmb");
    revalidatePath("/pmb");
}

export async function deletePmbTeamMember(id: number) {
    const old = await db.select().from(schema.pmbTeam).where(eq(schema.pmbTeam.id, id)).limit(1);
    if (old[0]?.image) {
        await deleteFile(old[0].image);
    }
    await db.delete(schema.pmbTeam).where(eq(schema.pmbTeam.id, id));
    revalidatePath("/admin/pmb");
    revalidatePath("/pmb");
}

// ============================================================
// SITE CONFIG
// ============================================================
export async function upsertSiteConfig(key: string, value: string) {
    const existing = await db.select().from(schema.siteConfig).where(eq(schema.siteConfig.key, key));
    if (existing.length > 0) {
        // Jika key adalah logo atau image, hapus file lama
        if (key.toLowerCase().includes('logo') || key.toLowerCase().includes('image')) {
            if (existing[0].value && existing[0].value !== value) {
                await deleteFile(existing[0].value);
            }
        }
        await db.update(schema.siteConfig).set({ value }).where(eq(schema.siteConfig.key, key));
    } else {
        await db.insert(schema.siteConfig).values({ key, value });
    }
    revalidatePath("/admin/settings");
    revalidatePath("/profil");
    revalidatePath("/");
}

// ============================================================
// PROFILE
// ============================================================
export async function upsertProfile(key: string, value: string) {
    const existing = await db.select().from(schema.profile).where(eq(schema.profile.key, key));
    if (existing.length > 0) {
        // Jika key adalah logo atau image, hapus file lama
        if (key.toLowerCase().includes('logo') || key.toLowerCase().includes('image')) {
            if (existing[0].value && existing[0].value !== value) {
                await deleteFile(existing[0].value);
            }
        }
        await db.update(schema.profile).set({ value }).where(eq(schema.profile.key, key));
    } else {
        await db.insert(schema.profile).values({ key, value });
    }
    revalidatePath("/admin/settings");
    revalidatePath("/profil");
    revalidatePath("/");
}

// ============================================================
// ADMIN SETUP
// ============================================================
export async function resetViewsAction() {
    const { resetViews } = await import("@/db/queries");
    await resetViews();
    revalidatePath("/");
    revalidatePath("/admin");
}

export async function setupInitialSuperAdmin() {
    return await createSuperAdmin();
}
