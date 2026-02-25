import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function run() {
    const url = process.env.DATABASE_URL;
    if (!url) {
        console.error('DATABASE_URL is not set');
        process.exit(1);
    }

    console.log('Connecting to database...');
    const client = new Client({ connectionString: url });
    await client.connect();

    const sql = `
    CREATE TABLE IF NOT EXISTS "admin_users" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(255) NOT NULL,
        "email" VARCHAR(191) NOT NULL UNIQUE,
        "password" VARCHAR(255) NOT NULL,
        "role" VARCHAR(50) NOT NULL DEFAULT 'staff',
        "permissions" TEXT,
        "is_active" BOOLEAN NOT NULL DEFAULT true,
        "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `;

    try {
        console.log('Creating admin_users table...');
        await client.query(sql);
        console.log('Table admin_users created successfully (or already exists).');
    } catch (err) {
        console.error('Failed to create table:', err);
    } finally {
        await client.end();
    }
}

run();
