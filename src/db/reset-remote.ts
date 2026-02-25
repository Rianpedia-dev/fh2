import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { Client } from "pg";

async function resetDatabase() {
    const url = process.env.DATABASE_URL;
    if (!url) {
        console.error("DATABASE_URL is not set");
        process.exit(1);
    }

    console.log("Connecting to database...");
    const client = new Client({ connectionString: url });
    await client.connect();

    try {
        const result = await client.query(
            `SELECT tablename FROM pg_tables WHERE schemaname = 'public'`
        );
        const tables = result.rows.map((row: any) => row.tablename);

        if (tables.length === 0) {
            console.log("No tables found in database.");
            return;
        }

        console.log(`Found ${tables.length} tables. Dropping...`);

        for (const table of tables) {
            console.log(`Dropping table: ${table}`);
            await client.query(`DROP TABLE IF EXISTS "${table}" CASCADE`);
        }

        console.log("Database reset successfully.");
    } catch (error) {
        console.error("Error resetting database:", error);
    } finally {
        await client.end();
    }
}

resetDatabase();
