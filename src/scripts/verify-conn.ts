import * as dotenv from "dotenv";
import { join } from "path";
import { Client } from "pg";

// Memuat .env.local secara eksplisit
dotenv.config({ path: join(process.cwd(), ".env.local") });

async function verify() {
    const url = process.env.DATABASE_URL;

    console.log("--------------------------------------------------");
    console.log("🚀 MEMULAI VERIFIKASI KONEKSI DATABASE POSTGRESQL");
    console.log("--------------------------------------------------");

    if (!url) {
        console.error("❌ ERROR: DATABASE_URL tidak ditemukan di .env.local!");
        process.exit(1);
    }

    try {
        console.log("📡 Menghubungkan ke Supabase PostgreSQL...");

        const client = new Client({ connectionString: url });
        await client.connect();

        const startTime = Date.now();
        const result = await client.query("SELECT 1 as test");
        const duration = Date.now() - startTime;

        console.log("✅ KONEKSI BERHASIL!");
        console.log(`⏱️  Waktu respon: ${duration}ms`);
        console.log("📊 Hasil Query Test:", result.rows);

        // Cek struktur tabel
        try {
            const tablesResult = await client.query(
                `SELECT tablename FROM pg_tables WHERE schemaname = 'public'`
            );
            console.log(`📋 Terdeteksi ${tablesResult.rows.length} tabel di database.`);
        } catch (e) {
            console.log("ℹ️ Tidak dapat mengambil daftar tabel, tapi koneksi inti OK.");
        }

        await client.end();
        console.log("--------------------------------------------------");
        process.exit(0);
    } catch (error: any) {
        console.error("❌ KONEKSI GAGAL!");
        console.error("--------------------------------------------------");
        console.error("Detail Error:");
        console.error(`- Code: ${error.code}`);
        console.error(`- Message: ${error.message}`);
        console.error("--------------------------------------------------");

        if (error.code === 'ETIMEDOUT') {
            console.error("💡 SARAN: Timeout terjadi. Periksa koneksi internet dan pengaturan Supabase.");
        } else if (error.code === '28P01') {
            console.error("💡 SARAN: Akses ditolak. Periksa kembali username dan password di .env.local.");
        }

        process.exit(1);
    }
}

verify();
