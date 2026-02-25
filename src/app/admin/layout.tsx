import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const user = await getCurrentUser();

    // Skip auth check for login page handled by the page itself or middleware
    // but we can enforce it here for everything else
    if (!user) {
        // We allow the login page to be handled
        return (
            <div className="min-h-screen bg-background">
                <main className="min-h-screen">
                    {children}
                </main>
                <Toaster richColors position="top-right" />
            </div>
        );
    }

    // Filter permissions
    const permissions = user.permissions ? JSON.parse(user.permissions as string) as string[] : [];
    const isSuperAdmin = user.role === "superadmin";

    return (
        <div className="min-h-screen bg-background flex">
            <AdminSidebar
                user={{
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    permissions: permissions
                }}
            />

            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full">
                    {children}
                </main>
            </div>
            <Toaster richColors position="top-right" />
        </div>
    );
}
