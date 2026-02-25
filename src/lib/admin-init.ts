import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

/**
 * Hash password using SHA-256 to match the project's authentication logic.
 */
function hashPassword(password: string): string {
    return crypto.createHash("sha256").update(password).digest("hex");
}

/**
 * Creates or updates the Super Admin account based on environment variables.
 * This function is intended to be used for initial setup or account recovery.
 */
export async function createSuperAdmin() {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
        throw new Error("ADMIN_EMAIL or ADMIN_PASSWORD environment variables are not set");
    }

    const hashedPassword = hashPassword(adminPassword);

    // Default all-access permissions
    const defaultPermissions = JSON.stringify([
        'dashboard',
        'berita',
        'dosen',
        'galeri',
        'hero',
        'testimonial',
        'partner',
        'kontak',
        'pmb',
        'settings',
        'admins'
    ]);

    try {
        console.log(`Checking for admin user: ${adminEmail}`);
        const existing = await db.select()
            .from(schema.adminUsers)
            .where(eq(schema.adminUsers.email, adminEmail))
            .limit(1);

        if (existing.length > 0) {
            console.log("Admin user exists. Updating password and permissions...");
            await db.update(schema.adminUsers)
                .set({
                    password: hashedPassword,
                    role: 'superadmin',
                    permissions: defaultPermissions,
                    isActive: true
                })
                .where(eq(schema.adminUsers.email, adminEmail));

            return { message: "Super Admin updated successfully", email: adminEmail };
        } else {
            console.log("Creating new Super Admin...");
            await db.insert(schema.adminUsers).values({
                name: "Super Admin",
                email: adminEmail,
                password: hashedPassword,
                role: "superadmin",
                permissions: defaultPermissions,
                isActive: true
            });

            return { message: "Super Admin created successfully", email: adminEmail };
        }
    } catch (error) {
        console.error("Failed to create/update Super Admin:", error);
        throw error;
    }
}
