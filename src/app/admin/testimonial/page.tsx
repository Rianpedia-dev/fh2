import { getTestimonials } from "@/db/queries";
import TestimonialClient from "./testimonial-client";

export default async function AdminTestimonialPage() {
    const data = await getTestimonials();
    return <TestimonialClient data={data} />;
}
