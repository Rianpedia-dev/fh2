import { supabaseAdmin, STORAGE_BUCKET } from "./supabase";

/**
 * Menyimpan file ke Supabase Storage bucket 'uploads'.
 * @param file Objek File dari FormData
 * @param subFolder Subfolder opsional (misal: "news", "dosen")
 * @returns Public URL file di Supabase Storage
 */
export async function saveFile(file: File, subFolder: string = ""): Promise<string> {
    if (!file) throw new Error("No file uploaded");

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Buat nama file unik
    const timestamp = Date.now();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, "-");
    const fileName = `${timestamp}-${cleanFileName}`;
    const storagePath = subFolder ? `${subFolder}/${fileName}` : fileName;

    // Upload ke Supabase Storage
    const { data, error } = await supabaseAdmin.storage
        .from(STORAGE_BUCKET)
        .upload(storagePath, buffer, {
            contentType: file.type,
            upsert: false,
        });

    if (error) {
        console.error("Supabase upload error:", error.message);
        throw new Error(`Upload gagal: ${error.message}`);
    }

    // Dapatkan public URL
    const { data: urlData } = supabaseAdmin.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(data.path);

    return urlData.publicUrl;
}

/**
 * Menghapus file dari Supabase Storage bucket.
 * @param fileUrl Public URL atau path relatif file
 */
export async function deleteFile(fileUrl: string) {
    if (!fileUrl) return;

    try {
        // Ekstrak path dari public URL atau path relatif
        let storagePath = fileUrl;

        // Jika berupa full URL Supabase, ekstrak path-nya
        const bucketSegment = `/storage/v1/object/public/${STORAGE_BUCKET}/`;
        if (fileUrl.includes(bucketSegment)) {
            storagePath = fileUrl.split(bucketSegment)[1];
        } else if (fileUrl.startsWith("/uploads/")) {
            // Backward compatibility: path lama dari filesystem lokal
            storagePath = fileUrl.replace("/uploads/", "");
        }

        if (!storagePath) return;

        const { error } = await supabaseAdmin.storage
            .from(STORAGE_BUCKET)
            .remove([storagePath]);

        if (error) {
            console.error(`Error deleting file from storage: ${storagePath}`, error.message);
        } else {
            console.log(`Successfully deleted file: ${storagePath}`);
        }
    } catch (error) {
        console.error(`Error deleting file: ${fileUrl}`, error);
    }
}
