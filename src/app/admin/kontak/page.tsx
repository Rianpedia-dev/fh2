import { getContactInfo, getSocialMedia, getCampusAccess } from "@/db/queries";
import KontakClient from "./kontak-client";

export default async function AdminKontakPage() {
    const [contactInfo, socialMedia, campusAccess] = await Promise.all([
        getContactInfo(),
        getSocialMedia(),
        getCampusAccess(),
    ]);

    return (
        <KontakClient
            contactInfo={contactInfo}
            socialMedia={socialMedia}
            campusAccess={campusAccess}
        />
    );
}
