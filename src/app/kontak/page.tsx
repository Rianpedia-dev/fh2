import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Bus,
  Train,
  Car,
  Facebook,
  Instagram,
  Youtube,
} from "lucide-react";
import { MotionDiv } from "@/components/motion-wrapper";
import PageHeader from "@/components/layout/page-header";

import { getFullSiteConfig, getContactInfo } from "@/db/queries";

// ============================================================
// HALAMAN KONTAK
// ============================================================
export default async function KontakPage() {
  const [siteConfig, contactInfo] = await Promise.all([
    getFullSiteConfig(),
    getContactInfo(),
  ]);

  const mainContact = {
    name: contactInfo.name,
    address: contactInfo.address,
    city: contactInfo.city,
    province: contactInfo.province,
    postalCode: contactInfo.postalCode,
    phone: contactInfo.phone,
    fax: contactInfo.fax,
    email: contactInfo.email,
    website: contactInfo.website,
    operatingHours: contactInfo.operatingHours,
    mapUrl: contactInfo.mapUrl,
  };

  const aksesKampus = [
    {
      nama: "Transportasi Umum",
      icon: Bus,
      deskripsi: "Mudah diakses dengan angkutan kota dan bus kota",
    },
    {
      nama: "Stasiun Terdekat",
      icon: Train,
      deskripsi: "Stasiun Kertapati berjarak beberapa km dari kampus",
    },
    {
      nama: "Kendaraan Pribadi",
      icon: Car,
      deskripsi: "Tersedia area parkir yang luas di lingkungan kampus",
    },
  ];

  const mediaSosial = [
    {
      nama: "Facebook",
      icon: Facebook,
      url: siteConfig.socialMedia.facebook,
      username: "@fhunpal",
    },
    {
      nama: "Instagram",
      icon: Instagram,
      url: siteConfig.socialMedia.instagram,
      username: "@fh_unpal",
    },
    {
      nama: "Youtube",
      icon: Youtube,
      url: siteConfig.socialMedia.youtube,
      username: "FH UNPAL Official",
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Header Section */}
      <PageHeader
        category="KONTAK"
        title="Hubungi"
        titleHighlight="Kami"
        description="Kami siap membantu Anda. Jangan ragu untuk menghubungi kami melalui berbagai saluran komunikasi yang tersedia."
      />

      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Main Contact Card */}
          <MotionDiv
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="rounded-3xl p-8 md:p-12 h-full relative overflow-hidden group border-brand-red shadow-[0_0_20px_rgba(185,28,28,0.2)] transition-all duration-500 hover:border-brand-red/80 hover:shadow-[0_0_30px_rgba(185,28,28,0.3)]">
              <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-brand-navy to-brand-navy-light rounded-xl flex items-center justify-center mr-4 shadow-lg group-hover:rotate-6 transition-transform">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                Kontak Utama
              </h2>

              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-brand-navy/10 flex items-center justify-center mr-6 flex-shrink-0">
                    <MapPin className="w-5 h-5 text-brand-navy" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Alamat Kampus
                    </h3>
                    <p className="text-muted-foreground">
                      {mainContact.address}
                    </p>
                    {(mainContact.city || mainContact.province || mainContact.postalCode) && (
                      <p className="text-muted-foreground">
                        {mainContact.city}{mainContact.city && (mainContact.province || mainContact.postalCode) ? ", " : ""}{mainContact.province} {mainContact.postalCode}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-brand-red/10 flex items-center justify-center mr-6 flex-shrink-0">
                    <Phone className="w-5 h-5 text-brand-red" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Telepon
                    </h3>
                    <p className="text-muted-foreground">
                      {mainContact.phone}
                    </p>
                    {mainContact.fax && (
                      <p className="text-muted-foreground">
                        Fax: {mainContact.fax}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center mr-6 flex-shrink-0">
                    <Mail className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Email Resmi
                    </h3>
                    <p className="text-muted-foreground">
                      {mainContact.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-brand-navy/10 flex items-center justify-center mr-6 flex-shrink-0">
                    <Clock className="w-5 h-5 text-brand-navy" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Jam Operasional
                    </h3>
                    <p className="text-muted-foreground">
                      {mainContact.operatingHours}
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Media Icons */}
              <div className="mt-12 flex gap-4">
                {mediaSosial.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-xl flex items-center justify-center border border-border hover:border-brand-navy hover:text-brand-navy hover:bg-brand-navy/5 transition-all"
                    aria-label={social.nama}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </Card>
          </MotionDiv>

          {/* Map Section */}
          <MotionDiv
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="rounded-3xl border border-brand-red shadow-[0_0_20px_rgba(185,28,28,0.2)] h-full min-h-[450px] overflow-hidden relative group transition-all duration-500 hover:shadow-2xl">
              <div className="absolute inset-0 w-full h-full">
                {mainContact.mapUrl ? (
                  <iframe
                    src={mainContact.mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="grayscale group-hover:grayscale-0 transition-all duration-700 opacity-70 group-hover:opacity-100"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground italic">
                    Peta belum diatur
                  </div>
                )}
              </div>

              {/* Overlay Gradient */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60" />

              <div className="absolute bottom-8 left-8 right-8 p-6 bg-background/90 backdrop-blur-sm rounded-2xl border border-border pointer-events-none group-hover:translate-y-20 transition-transform duration-500">
                <h3 className="font-bold text-foreground mb-2 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-brand-red" />
                  Lokasi Kampus
                </h3>
                <p className="text-sm text-muted-foreground truncate">
                  {mainContact.address}
                </p>
                <p className="text-[10px] text-muted-foreground/60 mt-1 italic">
                  Klik peta untuk berinteraksi
                </p>
              </div>
            </Card>
          </MotionDiv>
        </div>

        {/* Access Info */}
        <div className="mb-16">
          <MotionDiv
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Aksesibilitas Kampus
            </h2>
            <p className="text-muted-foreground">
              Pilihan sarana transportasi untuk menuju ke lokasi kampus kami
            </p>
          </MotionDiv>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {aksesKampus.map((akses, index) => (
              <MotionDiv
                key={index}
                className="text-center group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-8 rounded-3xl border border-brand-red shadow-[0_0_15px_rgba(185,28,28,0.15)] transition-all duration-300 hover:shadow-lg hover:border-brand-red/80">
                  <div className="w-16 h-16 bg-gradient-to-br from-brand-navy to-brand-navy-light rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                    <akses.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-xl text-foreground mb-3">
                    {akses.nama}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {akses.deskripsi}
                  </p>
                </Card>
              </MotionDiv>
            ))}
          </div>
        </div>
      </div >
    </div >
  );
}