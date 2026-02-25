import { getGallery } from "@/db/queries";
import GaleriClient from "./galeri-client";

export default async function AdminGaleriPage() {
    const data = await getGallery();
    return <GaleriClient data={data} />;
}
