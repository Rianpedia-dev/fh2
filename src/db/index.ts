import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import dotenv from "dotenv";

// Manual loading as fallback
if (!process.env.DATABASE_URL) {
    dotenv.config(); // Coba load .env
    dotenv.config({ path: ".env.local" }); // Coba load .env.local
}

const databaseUrl = process.env.DATABASE_URL;

// Debugging sederhana untuk melihat apakah env terbaca (hanya di console server)
if (databaseUrl) {
    console.log("📍 DATABASE_URL terdeteksi di server.");
} else {
    console.error("❌ DATABASE_URL TIDAK TERDETEKSI di server!");
}

// Buat PostgreSQL Pool
let pool: Pool;
try {
    if (databaseUrl) {
        pool = new Pool({
            connectionString: databaseUrl,
            max: 5, // Batasi koneksi
            idleTimeoutMillis: 10000,
            connectionTimeoutMillis: 5000,
        });
    } else {
        // Fallback placeholder agar objek db tetap tercipta
        pool = new Pool({
            connectionString: "postgresql://invalid:invalid@localhost:5432/invalid",
        });
    }
} catch (err) {
    console.error("🔥 Gagal menginisialisasi PostgreSQL Pool:", err);
    pool = new Pool({
        connectionString: "postgresql://invalid:invalid@localhost:5432/invalid",
    });
}

export const db = drizzle(pool, { schema });
