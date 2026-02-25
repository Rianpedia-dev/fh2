"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "crypto";
import { getAdminUserByEmail, getAdminUserById } from "@/db/queries";

const AUTH_COOKIE = "admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24; // 24 hours

function hashPassword(password: string): string {
    return crypto.createHash("sha256").update(password).digest("hex");
}

export async function login(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const user = await getAdminUserByEmail(email);

    if (!user) {
        return { error: "Email atau password salah." };
    }

    if (!user.isActive) {
        return { error: "Akun Anda dinonaktifkan." };
    }

    const hashedPassword = hashPassword(password);
    if (hashedPassword !== user.password) {
        return { error: "Email atau password salah." };
    }

    // Create session token: userId:timestamp:hash
    const timestamp = Date.now();
    const secret = process.env.AUTH_SECRET || "default_secret";
    const signature = crypto.createHash("sha256").update(`${user.id}:${timestamp}:${secret}`).digest("hex");
    const token = `${user.id}:${timestamp}:${signature}`;

    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: SESSION_MAX_AGE,
        path: "/",
    });

    redirect("/admin");
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_COOKIE);
    redirect("/");
}

export async function getSession() {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(AUTH_COOKIE)?.value;
    if (!sessionToken) return null;

    const [userId, timestamp, signature] = sessionToken.split(":");
    if (!userId || !timestamp || !signature) return null;

    // Verify signature
    const secret = process.env.AUTH_SECRET || "default_secret";
    const expectedSignature = crypto.createHash("sha256").update(`${userId}:${timestamp}:${secret}`).digest("hex");

    if (signature !== expectedSignature) return null;

    // Check expiration
    if (Date.now() - parseInt(timestamp) > SESSION_MAX_AGE * 1000) return null;

    return { userId: parseInt(userId) };
}

export async function getCurrentUser() {
    const session = await getSession();
    if (!session) return null;
    return await getAdminUserById(session.userId);
}

export async function requireAuth() {
    const user = await getCurrentUser();
    if (!user) {
        redirect("/admin/login");
    }
    return user;
}

export async function requireSuperAdmin() {
    const user = await requireAuth();
    if (user.role !== "superadmin") {
        redirect("/admin");
    }
    return user;
}
