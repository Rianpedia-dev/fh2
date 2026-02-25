import { MotionDiv } from "@/components/motion-wrapper";

interface PageHeaderProps {
    /** Category label shown above the title, e.g. "PROFIL", "GALERI" */
    category: string;
    /** Main title text (plain part) */
    title: string;
    /** Highlighted part of the title (shown in gold/yellow) */
    titleHighlight: string;
    /** Description text below the title */
    description: string;
}

export default function PageHeader({
    category,
    title,
    titleHighlight,
    description,
}: PageHeaderProps) {
    return (
        <div className="relative bg-[url('/images/bg.png')] bg-cover bg-center bg-no-repeat overflow-hidden mb-6 md:mb-12 border-b border-brand-red/50">
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/60" />

            <div className="relative z-10 py-20 md:py-32 px-4 sm:px-6">
                <div className="container mx-auto max-w-6xl">
                    <MotionDiv
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Category label with red dash */}
                        <div className="flex items-center gap-3 mb-4">
                            <span className="block w-8 h-[3px] bg-brand-red rounded-full" />
                            <span className="text-brand-red text-xs font-bold tracking-[0.2em] uppercase">
                                {category}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 leading-tight tracking-tight">
                            {title}{" "}
                            <span
                                className="bg-clip-text text-transparent"
                                style={{
                                    backgroundImage:
                                        "linear-gradient(to right, #f9cd5e, #ecd735)",
                                }}
                            >
                                {titleHighlight}
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="text-white/60 text-sm md:text-base max-w-xl leading-relaxed">
                            {description}
                        </p>
                    </MotionDiv>
                </div>
            </div>
        </div>
    );
}
