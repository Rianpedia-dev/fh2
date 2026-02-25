import { getAnnouncements } from "@/db/queries";
import BeritaClient from "./berita-client";

export default async function AdminBeritaPage() {
    const data = await getAnnouncements();
    return <BeritaClient data={data} />;
}
