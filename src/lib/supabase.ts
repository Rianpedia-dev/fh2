import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    // Jika tidak ada (biasanya saat running script standalone), coba load manual
    const dotenv = require("dotenv");
    const { join } = require("path");
    dotenv.config({ path: join(process.cwd(), ".env.local") });
}

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
