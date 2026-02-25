import { db } from "./index";
import { profile } from "./schema";
import { like } from "drizzle-orm";

async function main() {
    console.log("⏳ Menghapus data Struktur Organisasi dari database...");

    try {
        const result = await db.delete(profile).where(like(profile.key, "struktur_%"));
        console.log("✅ Berhasil menghapus data struktur organisasi.");
    } catch (error) {
        console.error("❌ Gagal menghapus data:", error);
    }
}

main();
