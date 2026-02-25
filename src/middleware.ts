import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const session = request.cookies.get("admin_session");

    // Jika akses halaman admin (bukan login) tanpa session, redirect ke login
    if (pathname.startsWith("/admin") && pathname !== "/admin/login" && !session) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Jika sudah login dan akses halaman login, redirect ke dashboard
    if (pathname === "/admin/login" && session) {
        return NextResponse.redirect(new URL("/admin", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
