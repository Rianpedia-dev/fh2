import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { getFullProfile, getFullSiteConfig } from "./queries";

async function main() {
    console.log("🚀 Memulai verifikasi fitur admin...");

    try {
        console.log("\n1. Menguji Full Profile...");
        const profile = await getFullProfile();
        console.log("✅ Full Profile retrieved.");
        console.log("   - Dekan Name:", profile.dekanName);
        console.log("   - Tujuan:", profile.tujuan);
        console.log("   - Sambutan length:", profile.sambutan.length);

        console.log("\n2. Menguji Site Config...");
        const siteConfig = await getFullSiteConfig();
        console.log("✅ Site Config retrieved.");
        console.log("   - Map URL:", siteConfig.mapUrl ? "Sedia" : "Tidak sedia");

        if (siteConfig.mapUrl && !siteConfig.mapUrl.includes("/embed")) {
            console.warn("⚠️ PERINGATAN: mapUrl terdeteksi bukan URL Embed.");
        }

        console.log("\n3. Menguji Statistik...");
        console.log("   - Students:", profile.stats.students);
        console.log("   - Alumni:", profile.stats.successfulAlumni);

        console.log("\n✨ Verifikasi selesai!");
    } catch (e) {
        console.error("❌ Verifikasi gagal karena error:", e);
    }
}

main();
