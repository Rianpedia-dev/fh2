import { getPartners } from "@/db/queries";
import PartnerClient from "./partner-client";

export default async function AdminPartnerPage() {
    const data = await getPartners();
    return <PartnerClient data={data} />;
}
