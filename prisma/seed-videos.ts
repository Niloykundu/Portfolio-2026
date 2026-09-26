/**
 * seed-videos.ts
 * Inserts real local video projects into the SQLite database.
 * Run with: npx tsx prisma/seed-videos.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Video files in public/videos/ — URL-encoded for browser access
const VIDEO_PROJECTS = [
  {
    slug: "commercial-ad-1",
    title: "Commercial Ad — I",
    description: "High-impact commercial edit with dynamic pacing, precise sound design, and cinematic colour grading.",
    categorySlug: "commercial",
    year: 2026,
    role: "Lead Editor & Colorist",
    tools: "DaVinci Resolve, Premiere Pro, iZotope RX",
    videoFile: "/videos/AD1.mp4",
    featured: true,
    sortOrder: 1,
  },
  {
    slug: "commercial-ad-2",
    title: "Commercial Ad — II",
    description: "High-energy commercial edit with dynamic cuts, branded motion graphics, and premium sound design.",
    categorySlug: "commercial",
    year: 2026,
    role: "Lead Editor",
    tools: "Premiere Pro, After Effects, DaVinci Resolve",
    videoFile: "/videos/AD%202.mp4",
    featured: false,
    sortOrder: 2,
  },
  {
    slug: "cinematic-short-film",
    title: "Cinematic Short Film",
    description: "Cinematic short film with colour space transformation, precise pacing, and tension-building narrative cuts.",
    categorySlug: "cinematic",
    year: 2025,
    role: "Film Editor",
    tools: "Premiere Pro, After Effects, DaVinci Resolve",
    videoFile: "/videos/Cinematic%20.mp4",
    featured: false,
    sortOrder: 3,
  },
  {
    slug: "parallax-brand-film",
    title: "Parallax Brand Film",
    description: "Minimalist brand documentary with parallax motion design, smooth transitions, and editorial pacing.",
    categorySlug: "brand",
    year: 2025,
    role: "Editor & Story Producer",
    tools: "Premiere Pro, DaVinci Resolve, Audition",
    videoFile: "/videos/paralx%20motion.mp4",
    featured: false,
    sortOrder: 4,
  },
  {
    slug: "youtube-review-edit",
    title: "YouTube Review Edit",
    description: "High-retention YouTube-style short review edit with clean pacing, sound design, and engaging on-screen text.",
    categorySlug: "youtube",
    year: 2026,
    role: "Lead Editor",
    tools: "Premiere Pro, After Effects",
    videoFile: "/videos/review%20short.mp4",
    featured: false,
    sortOrder: 5,
  },
  {
    slug: "reel-2-music-video",
    title: "Reel II — Music Video Edit",
    description: "High-energy music video edit with beat-synced match cuts, rhythm-driven transitions, and cinematic colour grading.",
    categorySlug: "cinematic",
    year: 2025,
    role: "Music Video Editor",
    tools: "Premiere Pro, After Effects, DaVinci Resolve",
    videoFile: "/videos/reel%202.mp4",
    featured: false,
    sortOrder: 6,
  },
  {
    slug: "motion-graphics-reel",
    title: "Motion Graphics Reel",
    description: "2D/3D motion graphics reel — kinetic typography, logo animation, and dynamic visual compositions.",
    categorySlug: "short-form",
    year: 2026,
    role: "Motion Graphics Designer & Editor",
    tools: "After Effects, DaVinci Resolve, Premiere Pro",
    videoFile: "/videos/motion%20graphics.mp4",
    featured: false,
    sortOrder: 7,
  },
  {
    slug: "motion-informative-reel",
    title: "Motion Graphic + Informative Edit",
    description: "Informative edit combining motion graphics with engaging storytelling for digital platforms.",
    categorySlug: "short-form",
    year: 2026,
    role: "Editor & Motion Designer",
    tools: "After Effects, Premiere Pro",
    videoFile: "/videos/motion%20graphic%20%2B%20informative.mp4",
    featured: false,
    sortOrder: 8,
  },
  {
    slug: "wedding-cinematic-film",
    title: "Wedding Cinematic Film",
    description: "Emotional, cinematic wedding film blending intimate moments with sweeping wide shots and a bespoke colour grade.",
    categorySlug: "cinematic",
    year: 2026,
    role: "Wedding Film Editor & Colorist",
    tools: "Premiere Pro, DaVinci Resolve, iZotope RX",
    videoFile: "/videos/Weeding%20Card.mp4",
    featured: false,
    sortOrder: 9,
  },
  {
    slug: "directors-reel-1",
    title: "Director's Reel I",
    description: "Curated cinematic reel showcasing narrative editing, precision pacing, and visual storytelling.",
    categorySlug: "cinematic",
    year: 2026,
    role: "Director & Editor",
    tools: "Premiere Pro, DaVinci Resolve, After Effects",
    videoFile: "/videos/reel%201.mp4",
    featured: false,
    sortOrder: 10,
  },
  {
    slug: "directors-reel-3",
    title: "Director's Reel III",
    description: "Curated cinematic reel showcasing editorial range, precise pacing, and visual storytelling across diverse projects.",
    categorySlug: "cinematic",
    year: 2026,
    role: "Director & Editor",
    tools: "Premiere Pro, DaVinci Resolve, After Effects",
    videoFile: "/videos/reel%203.mp4",
    featured: false,
    sortOrder: 11,
  },
];

async function main() {
  console.log("🎬 Seeding video projects...\n");

  // Ensure categories exist
  const categoryDefs = [
    { name: "Commercial", slug: "commercial", sortOrder: 1 },
    { name: "Cinematic", slug: "cinematic", sortOrder: 2 },
    { name: "Brand", slug: "brand", sortOrder: 3 },
    { name: "YouTube", slug: "youtube", sortOrder: 4 },
    { name: "Short Form", slug: "short-form", sortOrder: 5 },
    { name: "Social Media", slug: "social-media", sortOrder: 6 },
  ];

  const catMap: Record<string, string> = {};
  for (const cat of categoryDefs) {
    const result = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    catMap[cat.slug] = result.id;
  }
  console.log("✅ Categories ready\n");

  // Insert each video project
  for (const p of VIDEO_PROJECTS) {
    const existing = await prisma.project.findUnique({ where: { slug: p.slug } });

    if (existing) {
      console.log(`⏭️  Skipping "${p.title}" — already exists`);
      // Update media to point to local video if missing
      const mediaCount = await prisma.projectMedia.count({ where: { projectId: existing.id } });
      if (mediaCount === 0) {
        await prisma.projectMedia.create({
          data: {
            projectId: existing.id,
            type: "VIDEO",
            url: p.videoFile,
            publicId: p.slug,
            sortOrder: 0,
          },
        });
        console.log(`   → Added video media for "${p.title}"`);
      }
      continue;
    }

    const project = await prisma.project.create({
      data: {
        slug: p.slug,
        title: p.title,
        description: p.description,
        categoryId: catMap[p.categorySlug] ?? null,
        year: p.year,
        role: p.role,
        editingApproach: p.tools,
        published: true,
        featured: p.featured,
        sortOrder: p.sortOrder,
        thumbnailUrl: null,
      },
    });

    // Create the video media entry
    await prisma.projectMedia.create({
      data: {
        projectId: project.id,
        type: "VIDEO",
        url: p.videoFile,
        publicId: p.slug,
        sortOrder: 0,
      },
    });

    console.log(`✅ Created: "${p.title}"`);
  }

  console.log("\n🎉 Done! All video projects seeded.");
  console.log("📌 Open http://localhost:3000 to see them in the portfolio.");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
