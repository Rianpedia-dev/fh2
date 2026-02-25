"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { type SiteConfig } from "@/db/queries";

export default function PublicLayout({
    children,
    siteConfig,
    visitorCount
}: {
    children: React.ReactNode;
    siteConfig: SiteConfig;
    visitorCount: number;
}) {
    const pathname = usePathname();
    const isAdmin = pathname.startsWith("/admin");

    if (isAdmin) {
        return <>{children}</>;
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar siteConfig={siteConfig} />
            <main className="flex-1">{children}</main>
            <Footer siteConfig={siteConfig} visitorCount={visitorCount} />
        </div>
    );
}
