import { supabaseAdmin, STORAGE_BUCKET } from "./supabase";
import sharp from "sharp";

export const MAX_UPLOAD_SIZE = 2.5 * 1024 * 1024; // 2.5MB

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
 * Memvalidasi dan menyimpan file ke Supabase Storage.
 * @param file Objek File dari FormData
 * @param subFolder Subfolder opsional
 * @param maxSize Ukuran maksimal dalam bytes (default 4MB)
 * @returns Public URL file
 */
export async function validateAndUploadImage(
    file: File | null,
    subFolder: string = "",
    maxSize: number = MAX_UPLOAD_SIZE
): Promise<string> {
    if (!file) throw new Error("File gambar wajib diisi");

    if (!file.type.startsWith("image/")) {
        throw new Error("File harus berupa gambar");
    }

    let bytes = await file.arrayBuffer();
    let buffer: Buffer = Buffer.from(bytes);

    // Jika ukuran melebihi batas, lakukan kompresi otomatis
    if (buffer.length > maxSize) {
        console.log(`File size ${buffer.length} exceeds ${maxSize}, compressing...`);

        // Kompresi tahap 1: Resize (max width 1920) + Quality 80
        let compressedBuffer = await sharp(buffer)
            .resize({ width: 1920, withoutEnlargement: true })
            .jpeg({ quality: 80, progressive: true, force: false })
            .webp({ quality: 80, lossless: false, force: false })
            .png({ quality: 80, palette: true, force: false })
            .toBuffer();

        // Jika masih terlalu besar, kurangi kualitas lebih lanjut (kualitas 60)
        if (compressedBuffer.length > maxSize) {
            compressedBuffer = await sharp(compressedBuffer)
                .jpeg({ quality: 60, force: false })
                .webp({ quality: 60, force: false })
                .png({ quality: 60, palette: true, force: false })
                .toBuffer();
        }

        buffer = compressedBuffer;
        console.log(`Compressed to ${buffer.length} bytes`);
    }

    // Gunakan fungsi saveFile internal tapi dengan buffer yang mungkin sudah dikompres
    return await saveCompressedFile(buffer, file.name, file.type, subFolder);
}

/**
 * Versi internal saveFile yang menerima Buffer secara langsung (untuk gambar yang sudah dikompres)
 */
async function saveCompressedFile(buffer: Buffer, originalName: string, contentType: string, subFolder: string = ""): Promise<string> {
    // Buat nama file unik
    const timestamp = Date.now();
    const cleanFileName = originalName.replace(/[^a-zA-Z0-9.]/g, "-");
    const fileName = `${timestamp}-${cleanFileName}`;
    const storagePath = subFolder ? `${subFolder}/${fileName}` : fileName;

    // Upload ke Supabase Storage
    const { data, error } = await supabaseAdmin.storage
        .from(STORAGE_BUCKET)
        .upload(storagePath, buffer as any, {
            contentType: contentType,
            upsert: false,
        });

    if (error) {
        console.error("Supabase upload error:", error.message);
        throw new Error(`Upload gagal: ${error.message}`);
    }

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
