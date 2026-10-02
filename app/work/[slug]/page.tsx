import { prisma } from "@/lib/db";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

async function getProject(slug: string) {
  return prisma.project.findUnique({
    where: { slug, published: true },
    include: {
      category: true,
      media: { orderBy: { sortOrder: "asc" } },
    },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: "Project Not Found" };

  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  const siteName = settings?.siteName || "Portfolio";

  return {
    title: `${project.title} | ${siteName}`,
    description: project.description?.slice(0, 160),
    openGraph: {
      title: project.title,
      description: project.description?.slice(0, 160),
      images: project.thumbnailUrl ? [{ url: project.thumbnailUrl }] : [],
    },
  };
}

export async function generateStaticParams() {
  const projects = await prisma.project.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const [project, settings, socialLinks] = await Promise.all([
    getProject(slug),
    prisma.siteSettings.findUnique({ where: { id: "singleton" } }),
    prisma.socialLink.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  if (!project) notFound();

  const images = project.media.filter((m) => m.type === "IMAGE");
  const videos = project.media.filter((m) => m.type === "VIDEO");
  const heroMedia = project.media[0];

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      <Navbar settings={settings} socialLinks={socialLinks} />

      <main>
        {/* ── Hero ────────────────────────────────────── */}
        <section className="relative min-h-[70vh] flex items-end bg-[#111111] overflow-hidden">
          {heroMedia?.type === "VIDEO" ? (
            <video
              src={heroMedia.url}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
          ) : (project.thumbnailUrl || heroMedia?.url) ? (
            <Image
              src={project.thumbnailUrl || heroMedia!.url}
              alt={project.title}
              fill
              className="object-cover opacity-50"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#111111]" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent" />

          <div className="relative z-10 container-editorial pb-16 pt-40">
            {project.category && (
              <p className="text-[11px] font-semibold tracking-[0.2em] text-[#9B9B9B] uppercase mb-4">
                {project.category.name}
              </p>
            )}
            <h1
              className="text-display text-white"
              style={{ fontSize: "clamp(3rem, 8vw, 8rem)", lineHeight: 0.9 }}
            >
              {project.title}
            </h1>

            <div className="flex flex-wrap gap-8 mt-8">
              {project.client && (
                <div>
                  <p className="text-[10px] tracking-[0.2em] text-[#6B6B6B] uppercase mb-1">Client</p>
                  <p className="text-sm text-white font-medium">{project.client}</p>
                </div>
              )}
              {project.year && (
                <div>
                  <p className="text-[10px] tracking-[0.2em] text-[#6B6B6B] uppercase mb-1">Year</p>
                  <p className="text-sm text-white font-medium">{project.year}</p>
                </div>
              )}
              {project.duration && (
                <div>
                  <p className="text-[10px] tracking-[0.2em] text-[#6B6B6B] uppercase mb-1">Duration</p>
                  <p className="text-sm text-white font-medium">{project.duration}</p>
                </div>
              )}
              {project.role && (
                <div>
                  <p className="text-[10px] tracking-[0.2em] text-[#6B6B6B] uppercase mb-1">Role</p>
                  <p className="text-sm text-white font-medium">{project.role}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Description ─────────────────────────────── */}
        <section className="container-editorial py-20 border-b border-[#E5E5E5]">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold tracking-[0.2em] text-[#9B9B9B] uppercase mb-6">
              Overview
            </p>
            <p className="text-xl text-[#333333] leading-relaxed font-light">{project.description}</p>
          </div>
        </section>

        {/* ── Approach ────────────────────────────────── */}
        {project.editingApproach && (
          <section className="container-editorial py-20 border-b border-[#E5E5E5]">
            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-12">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.2em] text-[#9B9B9B] uppercase">
                  Editing Approach
                </p>
              </div>
              <p className="text-[#333333] leading-relaxed">{project.editingApproach}</p>
            </div>
          </section>
        )}

        {/* ── Video Gallery ────────────────────────────── */}
        {videos.length > 0 && (
          <section className="container-editorial py-20 border-b border-[#E5E5E5]">
            <p className="text-[11px] font-semibold tracking-[0.2em] text-[#9B9B9B] uppercase mb-8">
              Video
            </p>
            <div className="space-y-8">
              {videos.map((v) => (
                <div key={v.id} className="flex justify-center bg-[#111111] rounded-sm overflow-hidden">
                  {/* No forced aspect ratio — video uses its native size (portrait or landscape) */}
                  <video
                    src={v.url}
                    controls
                    preload="metadata"
                    className="max-h-[80vh] max-w-full w-auto h-auto"
                    poster={v.thumbnailUrl || undefined}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Image Gallery ────────────────────────────── */}

        {images.length > 1 && (
          <section className="container-editorial py-20 border-b border-[#E5E5E5]">
            <p className="text-[11px] font-semibold tracking-[0.2em] text-[#9B9B9B] uppercase mb-8">
              Gallery
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {images.map((img) => (
                <div key={img.id} className="aspect-video-thumb relative rounded-sm overflow-hidden bg-[#F0F0F0]">
                  <Image
                    src={img.url}
                    alt={img.altText || project.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Case Study ───────────────────────────────── */}
        {project.caseStudy && (
          <section className="container-editorial py-20 border-b border-[#E5E5E5]">
            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-12">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.2em] text-[#9B9B9B] uppercase">
                  Case Study
                </p>
              </div>
              <p className="text-[#333333] leading-relaxed whitespace-pre-line">{project.caseStudy}</p>
            </div>
          </section>
        )}

        {/* ── CTA ──────────────────────────────────────── */}
        <section className="container-editorial py-24">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.2em] text-[#9B9B9B] uppercase mb-2">
                Next Step
              </p>
              <h2 className="text-display text-[#111111]" style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}>
                READY TO START<br />YOUR PROJECT?
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 bg-[#111111] text-white text-[11px] tracking-[0.2em] font-semibold uppercase px-8 py-4 hover:bg-[#333333] transition-colors"
              >
                GET IN TOUCH
              </Link>
              <Link
                href="/#work"
                className="inline-flex items-center gap-2 border border-[#E5E5E5] text-[#111111] text-[11px] tracking-[0.2em] font-semibold uppercase px-8 py-4 hover:border-[#111111] transition-colors"
              >
                MORE WORK
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer settings={settings} socialLinks={socialLinks} />
    </div>
  );
}