import { getFullSiteConfig, getFullProfile } from "@/db/queries";
import SettingsClient from "./settings-client";

export default async function AdminSettingsPage() {
    const [siteConfig, profile] = await Promise.all([
        getFullSiteConfig(),
        getFullProfile(),
    ]);

    return <SettingsClient siteConfig={siteConfig} profile={profile} />;
}
