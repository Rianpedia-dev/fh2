import { createClient } from "@supabase/supabase-js";

// Next.js handles .env.local automatically in production/dev.
// Standalone scripts should load dotenv before importing this file if needed.
const finalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const finalServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!finalUrl || !finalServiceKey) {
    throw new Error("Supabase credentials missing in .env.local");
}

/**
 * Supabase admin client menggunakan service_role key.
 * Digunakan di server-side saja untuk operasi storage (upload / delete).
 */
export const supabaseAdmin = createClient(finalUrl, finalServiceKey, {
    auth: { persistSession: false },
});

/**
 * Nama bucket storage yang digunakan untuk semua upload.
 */
export const STORAGE_BUCKET = "uploads";
