import { prisma } from "@/lib/db";
import type { Metadata } from "next";
import Navbar from "@/components/public/Navbar";
import Hero from "@/components/public/Hero";
import SelectedWork from "@/components/public/SelectedWork";
import AboutSection from "@/components/public/AboutSection";
import ServicesSection from "@/components/public/ServicesSection";
import ContactCTA from "@/components/public/ContactCTA";
import Footer from "@/components/public/Footer";

export const revalidate = 60; // ISR — revalidate every 60 seconds

async function getPageData() {
  const [settings, about, categories, services, socialLinks] =
    await Promise.all([
      prisma.siteSettings.findUnique({ where: { id: "singleton" } }),
      prisma.about.findFirst(),
      prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.service.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } }),
      prisma.socialLink.findMany({ orderBy: { sortOrder: "asc" } }),
    ]);

  const hardcodedSocialLinks = [
    { platform: "LinkedIn", label: "LinkedIn", url: "https://www.linkedin.com/in/niloykundu01/", sortOrder: 1 }
  ];

  return { settings, about, categories, services, socialLinks: socialLinks.length > 0 ? socialLinks : hardcodedSocialLinks };
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  return {
    title: settings?.seoTitle || settings?.siteName || "Video Editor Portfolio",
    description: settings?.seoDescription || "Professional video editor portfolio",
    openGraph: {
      title: settings?.seoTitle || settings?.siteName || "Video Editor Portfolio",
      description: settings?.seoDescription || "",
      images: settings?.ogImageUrl ? [{ url: settings.ogImageUrl }] : [],
    },
  };
}

export default async function HomePage() {
  const { settings, about, categories, services, socialLinks } =
    await getPageData();

  return (
    <div className="bg-[#FAFAFA]">
      <Navbar settings={settings} socialLinks={socialLinks} />
      <main>
        <Hero settings={settings} />
        <SelectedWork categories={categories} />
        <AboutSection about={about} />
        <ServicesSection services={services} />
        <ContactCTA settings={settings} socialLinks={socialLinks} />
      </main>
      <Footer settings={settings} socialLinks={socialLinks} />
    </div>
  );
}


