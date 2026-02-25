import { supabaseAdmin, STORAGE_BUCKET } from "./supabase";

/**
 * Upload gambar ke Supabase Storage bucket.
 * @param file The file from FormData
 * @param folder Optional subfolder inside bucket (e.g. 'dosen', 'galeri')
 * @returns The public URL of the saved file or null if failed
 */
export async function uploadImage(file: File | null, folder: string = ""): Promise<string | null> {
    if (!file || file.size === 0 || !(file instanceof File)) {
        return null;
    }

    // Basic validation
    if (!file.type.startsWith("image/")) {
        throw new Error("File harus berupa gambar.");
    }

    if (file.size > 5 * 1024 * 1024) {
        throw new Error("Ukuran gambar maksimal 5MB.");
    }

    try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate unique filename
        const timestamp = Date.now();
        const sanitizedName = file.name.replace(/\s+/g, "-").toLowerCase();
        const fileName = `${timestamp}-${sanitizedName}`;
        const storagePath = folder ? `${folder}/${fileName}` : fileName;

        // Upload ke Supabase Storage
        const { data, error } = await supabaseAdmin.storage
            .from(STORAGE_BUCKET)
            .upload(storagePath, buffer, {
                contentType: file.type,
                upsert: false,
            });

        if (error) {
            console.error("Supabase upload error:", error.message);
            return null;
        }

        // Dapatkan public URL
        const { data: urlData } = supabaseAdmin.storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(data.path);

        return urlData.publicUrl;
    } catch (error) {
        console.error("Error uploading image:", error);
        return null;
    }
}
