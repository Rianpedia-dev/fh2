import Link from "next/link";

export const dynamic = "force-dynamic";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Users,
  ChevronRight,
  Play,
  Award,
  BookOpen,
  Calendar,
  MapPin,
  Scale,
  Sparkles,
  ArrowRight,
  Quote
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TestimonialsCarousel } from "@/components/testimonials-carousel";
import { MotionDiv } from "@/components/motion-wrapper";
import {
  getAnnouncements,
  getFullSiteConfig,
  getHeroSlides,
  getFullProfile,
  getLecturers,
  getPartners,
  getTestimonials,
} from '@/db/queries';
import { HomeNewsSection } from "@/components/home-news-section";
import { PartnersCarousel } from "@/components/partners-carousel";
import { HeroMediaSlider } from "@/components/hero-media-slider";

export default async function Home() {
  // Ambil data dari database
  const announcements = await getAnnouncements();
  const latestNews = [...announcements].reverse().slice(0, 3).map(n => ({
    id: n.id,
    title: n.title,
    excerpt: n.excerpt ?? "",
    content: n.content ?? "",
    date: n.date ?? "",
    category: n.category ?? "Berita",
    imageUrl: n.imageUrl
  }));
  const siteConfig = await getFullSiteConfig();
  const slides = await getHeroSlides();
  const profile = await getFullProfile();
  const lecturers = await getLecturers();
  const partnersData = await getPartners();
  const testimonialsData = await getTestimonials();

  // Map hero slides
  const heroImages = slides.length > 0
    ? slides.map(s => s.imageUrl)
    : [];

  const mainHeroSlide = slides[0];

  // Data hero (Gunakan teks statis, gambar tetap dinamis dari DB)
  const heroData = {
    title: "Selamat Datang di Fakultas Hukum Universitas Palembang",
    subtitle: "Membangun generasi ahli hukum yang cerdas, berintegritas, dan berdedikasi dalam menegakkan keadilan serta menjunjung tinggi nilai-nilai hukum.",
    imageUrls: heroImages,
    buttonText: "Mulai Menjelajah",
    buttonLink: "/profil"
  };

  // Data partner dinamis
  const partners = partnersData.map(p => ({
    id: p.id.toString(),
    name: p.name,
    logo: p.logo
  }));

  // Jika partner kosong, gunakan data cadangan agar tidak kosong (opsional, tapi bagus untuk visual awal)
  const finalPartners = partners.length > 0 ? partners : [
    { id: '1', name: 'Intel Indonesia', logo: null },
    { id: '2', name: 'Institut Teknologi Bandung', logo: null },
    { id: '3', name: 'Harvard University', logo: null },
  ];

  // Data testimonial dinamis
  const testimonials = testimonialsData.map(t => ({
    id: t.id.toString(),
    name: t.name,
    role: t.role,
    content: t.content,
    image: t.image,
    rating: t.rating
  }));

  const finalTestimonials = testimonials.length > 0 ? testimonials : [
    {
      id: "1",
      name: "Budi Santoso, S.H.",
      role: "Alumni 2018 - Advokat",
      content: "Fakultas Hukum UNPAL memberikan pondasi teori dan praktik yang sangat kuat bagi karir profesional saya.",
      image: null,
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-transparent overflow-hidden relative">
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="relative pt-8 pb-6 md:pt-20 md:pb-32 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-4 lg:gap-10 items-start">
              <MotionDiv
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 text-left lg:h-auto"
              >
                <h1 className="text-3xl md:text-6xl font-extrabold text-white mb-8 leading-[1.1] tracking-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 via-red-500 to-red-700 bg-[length:200%_auto] animate-gradient-x drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] [-webkit-text-stroke:1px_#7f1d1d]">
                    {heroData.title}
                  </span>
                </h1>

                <p className="text-lg text-foreground/60 mb-6 max-w-xl leading-relaxed">
                  {heroData.subtitle}
                </p>
              </MotionDiv>

              <MotionDiv
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="relative z-10 lg:row-span-2"
              >
                <div className="relative group">
                  {/* Decorative Frames & Glow */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyber-blue to-electric-purple rounded-2xl md:rounded-[2.6rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

                  <div className="relative aspect-video rounded-xl md:rounded-[2.5rem] overflow-hidden glass-card border-2 border-white/20 dark:border-white/5 shadow-[0_40px_80px_rgba(0,0,0,0.3)] dark:shadow-[0_40px_80px_rgba(0,0,0,0.6)] transform transition-all duration-700 group-hover:scale-[1.01]">
                    <HeroMediaSlider images={heroData.imageUrls} universityName={siteConfig.shortName} />
                  </div>
                </div>
              </MotionDiv>

              <MotionDiv
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative z-10 text-left lg:col-start-1 lg:row-start-2"
              >
                <div className="grid grid-cols-2 sm:flex sm:flex-row gap-3 sm:gap-4 mt-4 lg:mt-0">
                  <Button asChild size="lg" className="w-full sm:w-auto rounded-full px-10 h-12 font-bold group shadow-2xl hover:scale-105 transition-all duration-300 bg-white text-black hover:bg-gray-200">
                    <Link href={heroData.buttonLink || "/pmb"}>
                      {heroData.buttonText}
                      <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" className="w-full sm:w-auto rounded-full px-10 h-12 font-bold group shadow-2xl hover:scale-105 transition-all duration-300 bg-brand-red text-white hover:bg-red-700">
                    <Link href="/pmb">
                      Info PMB
                      <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </MotionDiv>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 pt-12 pb-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: GraduationCap, value: `${profile.stats.yearsStanding}`, label: "Tahun Berdiri", color: "text-blue-500", bg: "bg-blue-500/10" },
            { icon: Users, value: `${profile.stats.successfulAlumni}+`, label: "Alumni", color: "text-purple-500", bg: "bg-purple-500/10" },
            { icon: Award, value: profile.akreditasi.grade, label: "Akreditasi BAN-PT", color: "text-emerald-500", bg: "bg-emerald-500/10" },
            { icon: BookOpen, value: `${lecturers.length}+`, label: "Tenaga Pendidik", color: "text-orange-500", bg: "bg-orange-500/10" }
          ].map((stat, i) => (
            <MotionDiv
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="glass-card p-8 rounded-[2rem] border border-brand-red shadow-[0_0_15px_rgba(239,68,68,0.2)] text-center group hover:border-brand-red/80 transition-all duration-500"
            >
              <div className={cn("w-14 h-14 rounded-2xl mx-auto mb-6 flex items-center justify-center transition-transform duration-500 group-hover:rotate-6", stat.bg)}>
                <stat.icon className={cn("w-7 h-7", stat.color)} />
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-1">{stat.value}</h3>
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">{stat.label}</p>
            </MotionDiv>
          ))}
        </div>
      </div>

      {/* Sambutan Section */}
      <div className="container mx-auto px-4 pt-12 pb-20 relative z-10">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          {/* Section Title */}
          <MotionDiv
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight">
              Kata Sambutan Dekan
            </h2>
            <div className="w-24 h-1.5 bg-brand-red mx-auto mt-4 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.5)]"></div>
          </MotionDiv>

          {/* Profile Photo */}
          <MotionDiv
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative z-20 mb-[-64px]" // Negative margin to overlap with container
          >
            <div className="group relative">
              <div className="absolute inset-0 bg-brand-red rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <div className="relative w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-border shadow-2xl flex items-center justify-center bg-muted">
                {profile.dekanImage ? (
                  <img src={profile.dekanImage} alt={profile.dekanName} className="w-full h-full object-cover" />
                ) : (
                  <Users className="w-20 h-20 text-muted-foreground/10" />
                )}
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-navy/20 to-transparent"></div>
              </div>
              {/* Decorative Ring */}
              <div className="absolute -inset-2 border border-white/5 rounded-full animate-[spin_20s_linear_infinite]"></div>
            </div>
          </MotionDiv>

          {/* Welcome Card */}
          <MotionDiv
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full"
          >
            <div className="relative pt-20 pb-12 px-6 md:pt-24 md:pb-16 md:px-20 rounded-[2.5rem] md:rounded-[3.rem] overflow-hidden bg-card/50 backdrop-blur-xl border border-brand-red shadow-[0_0_40px_rgba(185,28,28,0.2)] dark:shadow-[0_40px_80px_rgba(0,0,0,0.4)]">
              {/* Grid Pattern Overlay */}
              <div className="absolute inset-0 pattern-grid opacity-[0.03] dark:opacity-10"></div>

              {/* Quote Icons - Adjusted for mobile */}
              <Quote className="absolute top-8 left-6 w-8 h-8 md:top-12 md:left-12 md:w-12 md:h-12 text-muted-foreground/10 rotate-180" />
              <Quote className="absolute bottom-8 right-6 w-8 h-8 md:bottom-12 md:right-12 md:w-12 md:h-12 text-muted-foreground/10" />

              <div className="relative z-10 text-left space-y-6 md:space-y-8">
                <p className="text-base md:text-xl font-bold text-foreground italic">
                  Assalamualaikum Wr. Wb.
                </p>

                <p className="text-sm md:text-lg text-muted-foreground leading-relaxed max-w-2xl mr-auto whitespace-pre-wrap text-left">
                  {profile.sambutan || "Selamat datang di website resmi Fakultas Hukum Universitas Palembang."}
                </p>

                <p className="text-base md:text-xl font-bold text-foreground italic">
                  Wassalamualaikum Wr. Wb.
                </p>

                <div className="pt-4 md:pt-8 space-y-2">
                  <p className="text-[10px] md:text-sm font-bold text-brand-red uppercase tracking-[0.2em] mb-1 md:mb-2">Hormat Kami,</p>
                  <h4 className="text-xl md:text-3xl font-extrabold text-foreground tracking-wide">
                    {profile.dekanName}
                  </h4>
                  <p className="text-brand-red font-bold uppercase tracking-[0.3em] text-[10px] md:text-sm">
                    Dekan Fakultas Hukum
                  </p>
                </div>
              </div>
            </div>
          </MotionDiv>
        </div>
      </div>

      {/* News Section */}
      <HomeNewsSection latestNews={latestNews} locale="id" />

      {/* Testimonials */}
      <div className="container mx-auto px-4 py-16 relative z-10 overflow-hidden">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-foreground mb-4">Apa Kata Mereka?</h2>
          <div className="w-24 h-1 bg-brand-red mx-auto rounded-full mb-6"></div>
          <p className="text-muted-foreground">Kesan bimbingan dan pengalaman belajar dari alumni kami.</p>
        </MotionDiv>
        <TestimonialsCarousel testimonials={finalTestimonials} />
      </div>

      {/* Partners section */}
      <div className="container mx-auto px-4 py-16 relative z-10 mb-8">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-foreground mb-4">Kemitraan & Kerjasama Kami</h2>
          <div className="w-24 h-1 bg-brand-red mx-auto rounded-full"></div>
        </MotionDiv>
        <PartnersCarousel partners={finalPartners} />
      </div>

    </div>
  );
}

