import { getLecturers } from "@/db/queries";
import DosenClient from "./dosen-client";

export default async function AdminDosenPage() {
    const data = await getLecturers();
    return <DosenClient data={data} />;
}
