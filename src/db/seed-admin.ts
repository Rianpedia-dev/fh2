import { Client } from 'pg';
import * as dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config({ path: '.env.local' });

function hashPassword(password: string): string {
    return crypto.createHash("sha256").update(password).digest("hex");
}

async function run() {
    const url = process.env.DATABASE_URL;
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!url || !adminEmail || !adminPassword) {
        console.error('Environment variables are not set');
        process.exit(1);
    }

    console.log('Connecting to database...');
    const client = new Client({ connectionString: url });
    await client.connect();

    const hashedLabel = hashPassword(adminPassword);

    try {
        console.log(`Checking if admin user ${adminEmail} exists...`);
        const result = await client.query('SELECT id FROM admin_users WHERE email = $1', [adminEmail]);

        if (result.rows.length > 0) {
            console.log('Admin user already exists. Updating password...');
            await client.query(
                'UPDATE admin_users SET password = $1, name = $2, role = $3 WHERE email = $4',
                [hashedLabel, 'Super Admin', 'superadmin', adminEmail]
            );
        } else {
            console.log('Creating initial Super Admin...');
            await client.query(
                'INSERT INTO admin_users (name, email, password, role, permissions) VALUES ($1, $2, $3, $4, $5)',
                ['Super Admin', adminEmail, hashedLabel, 'superadmin', JSON.stringify(['dashboard', 'berita', 'dosen', 'galeri', 'hero', 'testimonial', 'partner', 'kontak', 'pmb', 'settings', 'admins'])]
            );
        }
        console.log('Seed completed successfully.');
    } catch (err) {
        console.error('Seed failed:', err);
    } finally {
        await client.end();
    }
}

run();
