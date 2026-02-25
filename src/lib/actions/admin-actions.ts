"use server";

import { db } from "@/db";
import { adminUsers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import crypto from "crypto";
import { requireSuperAdmin } from "@/lib/auth";

function hashPassword(password: string): string {
    return crypto.createHash("sha256").update(password).digest("hex");
}

export async function createAdminUser(formData: FormData) {
    await requireSuperAdmin();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as string;
    const permissions = formData.get("permissions") as string; // JSON string

    try {
        await db.insert(adminUsers).values({
            name,
            email,
            password: hashPassword(password),
            role: role as any,
            permissions,
        });

        revalidatePath("/admin/admins");
        return { success: true };
    } catch (error: any) {
        console.error("Failed to create admin:", error);
        return { error: error.message || "Gagal membuat pengguna admin." };
    }
}

export async function updateAdminUser(id: number, formData: FormData) {
    await requireSuperAdmin();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const role = formData.get("role") as string;
    const permissions = formData.get("permissions") as string;
    const password = formData.get("password") as string;

    try {
        const updateData: any = {
            name,
            email,
            role: role as any,
            permissions,
        };

        if (password && password.trim() !== "") {
            updateData.password = hashPassword(password);
        }

        await db.update(adminUsers)
            .set(updateData)
            .where(eq(adminUsers.id, id));

        revalidatePath("/admin/admins");
        return { success: true };
    } catch (error: any) {
        console.error("Failed to update admin:", error);
        return { error: error.message || "Gagal memperbarui pengguna admin." };
    }
}

export async function deleteAdminUser(id: number) {
    const session = await requireSuperAdmin();

    // Don't allow deleting self
    if (session.id === id) {
        return { error: "Anda tidak dapat menghapus akun Anda sendiri." };
    }

    try {
        await db.delete(adminUsers).where(eq(adminUsers.id, id));
        revalidatePath("/admin/admins");
        return { success: true };
    } catch (error: any) {
        console.error("Failed to delete admin:", error);
        return { error: "Gagal menghapus pengguna admin." };
    }
}

export async function toggleAdminStatus(id: number, isActive: boolean) {
    const session = await requireSuperAdmin();

    if (session.id === id) {
        return { error: "Anda tidak dapat menonaktifkan akun Anda sendiri." };
    }

    try {
        await db.update(adminUsers)
            .set({ isActive })
            .where(eq(adminUsers.id, id));

        revalidatePath("/admin/admins");
        return { success: true };
    } catch (error: any) {
        console.error("Failed to toggle admin status:", error);
        return { error: "Gagal mengubah status pengguna admin." };
    }
}
