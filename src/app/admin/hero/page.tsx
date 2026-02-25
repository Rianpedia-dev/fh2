import { getHeroSlides } from "@/db/queries";
import HeroClient from "./hero-client";

export default async function AdminHeroPage() {
    const data = await getHeroSlides();
    return <HeroClient data={data} />;
}
