import { getAdminUsers } from "@/db/queries";
import { requireSuperAdmin } from "@/lib/auth";
import AdminsClient from "./admins-client";

export default async function AdminsPage() {
    await requireSuperAdmin();
    const data = await getAdminUsers();

    return <AdminsClient initialData={data} />;
}
