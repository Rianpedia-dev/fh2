import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PublicLayout from "@/components/layout/public-layout";
import { ThemeProvider } from "@/components/theme-provider";
import { getFullSiteConfig, getViews, incrementViews } from "@/db/queries";
import { OfflineDetector } from "@/components/offline-detector";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Fakultas Hukum — Universitas Palembang",
    template: "%s | Fakultas Hukum UNPAL",
  },
  description:
    "Website resmi Fakultas Hukum Universitas Palembang — Mencetak Sarjana Hukum yang Berintegritas, Profesional, dan Berdaya Saing.",
  keywords: [
    "Fakultas Hukum",
    "Universitas Palembang",
    "UNPAL",
    "Sarjana Hukum",
    "PMB",
    "Pendaftaran",
  ],
  icons: {
    icon: "/logofh.png",
    shortcut: "/logofh.png",
    apple: "/logofh.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Increment visitor count on each request (Server Component)
  await incrementViews();

  const siteConfig = await getFullSiteConfig();
  const visitorCount = await getViews();

  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PublicLayout siteConfig={siteConfig} visitorCount={visitorCount}>
            {children}
            <OfflineDetector />
          </PublicLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}



