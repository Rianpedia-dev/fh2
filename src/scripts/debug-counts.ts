import { db } from "../db";
import * as schema from "../db/schema";

async function debugCounts() {
    console.log("--- Debugging Dashboard Counts ---");

    const queries = [
        { name: "announcements", table: schema.announcements },
        { name: "lecturers", table: schema.lecturers },
        { name: "staff", table: schema.staff },
        { name: "organizations", table: schema.organizations },
        { name: "gallery", table: schema.gallery },
        { name: "testimonials", table: schema.testimonials },
        { name: "partners", table: schema.partners },
        { name: "siteStats", table: schema.siteStats },
    ];

    for (const q of queries) {
        try {
            const result = await db.select().from(q.table);
            console.log(`✅ ${q.name}: ${result.length} rows`);
        } catch (err: any) {
            console.error(`❌ ${q.name} failed:`, err.message);
        }
    }

    process.exit(0);
}

debugCounts();
