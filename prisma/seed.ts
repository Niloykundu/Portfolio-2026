import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ─── Admin User ───────────────────────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL || "admin@portfolio.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "ChangeMe123!";
  const adminName = process.env.ADMIN_NAME || "Portfolio Admin";

  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await prisma.adminUser.create({
      data: {
        name: adminName,
        email: adminEmail,
        passwordHash,
        role: "SUPER_ADMIN",
      },
    });
    console.log(`✅ Admin created: ${adminEmail} / ${adminPassword}`);
    console.log("   ⚠️  CHANGE THIS PASSWORD IMMEDIATELY AFTER FIRST LOGIN");
  } else {
    console.log("⏭️  Admin already exists, skipping");
  }

  // ─── Site Settings ────────────────────────────────────────────
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      siteName: "Niloy Kundu — Video Editor",
      editorName: "NILOY KUNDU",
      headline: "I EDIT STORIES\nTHAT MAKE\nPEOPLE WATCH.",
      subheadline:
        "Crafting visual narratives that hold attention, build brands, and move people. 2+ years turning raw footage into stories worth watching.",
      ctaPrimaryText: "VIEW MY WORK",
      ctaSecondaryText: "LET'S WORK TOGETHER",
      email: "hello@niloykundu.com",
      location: "India",
      availabilityStatus: true,
      availabilityText: "AVAILABLE FOR PROJECTS",
      footerText: "© 2026 Niloy Kundu. All rights reserved.",
      contactHeadline: "LET'S MAKE SOMETHING\nWORTH WATCHING.",
      contactCtaText: "START A PROJECT",
      calendlyUrl: process.env.NEXT_PUBLIC_CALENDLY_URL || "",
      seoTitle: "Niloy Kundu — Video Editor",
      seoDescription:
        "Professional video editor with 2+ years crafting short-form content, brand videos, YouTube edits, commercials and cinematic narratives.",
    },
  });
  console.log("✅ Site settings seeded");

  // ─── About ────────────────────────────────────────────────────
  const aboutCount = await prisma.about.count();
  if (aboutCount === 0) {
    await prisma.about.create({
      data: {
        title: "ABOUT THE EDITOR",
        description:
          "I'm a video editor who believes every frame tells a story. With 2+ years of experience in short-form content, brand storytelling and commercial editing, I've helped brands and creators cut through the noise. I obsess over pacing, colour, and sound design — the invisible craft that makes people stop scrolling. Whether it's a 15-second reel or a 10-minute documentary, I bring the same precision and creative vision to every project.",
        yearsExperience: 2,
        projectsCompleted: 50,
        clientsCount: 10,
        toolsCount: 5,
      },
    });
    console.log("✅ About seeded");
  }

  // ─── Categories ───────────────────────────────────────────────
  const categories = [
    { name: "Short Form", slug: "short-form", sortOrder: 1 },
    { name: "Social Media", slug: "social-media", sortOrder: 2 },
    { name: "Brand", slug: "brand", sortOrder: 3 },
    { name: "Commercial", slug: "commercial", sortOrder: 4 },
    { name: "Cinematic", slug: "cinematic", sortOrder: 5 },
    { name: "YouTube", slug: "youtube", sortOrder: 6 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log("✅ Categories seeded");

  // ─── Services ─────────────────────────────────────────────────
  const services = [
    {
      title: "Video Editing",
      description:
        "End-to-end post-production editing that transforms raw footage into polished, story-driven content with tight pacing and visual coherence.",
      icon: "Film",
      sortOrder: 1,
    },
    {
      title: "Short-form Content",
      description:
        "High-retention vertical video editing optimised for Instagram Reels, TikTok and YouTube Shorts — hooks, pacing and captions included.",
      icon: "Smartphone",
      sortOrder: 2,
    },
    {
      title: "Reels & Shorts",
      description:
        "Platform-native editing with trending transitions, sound design and motion that drives watch time and follower growth.",
      icon: "Play",
      sortOrder: 3,
    },
    {
      title: "YouTube Editing",
      description:
        "Long-form YouTube editing with pacing, B-roll, graphics, lower thirds and chapter-optimised structure for maximum retention.",
      icon: "Youtube",
      sortOrder: 4,
    },
    {
      title: "Commercial Editing",
      description:
        "Brand and product videos, ads and promotional content crafted to convert viewers into customers.",
      icon: "Tv",
      sortOrder: 5,
    },
    {
      title: "Colour Correction",
      description:
        "Professional colour grading and correction to establish mood, brand consistency and cinematic visual quality.",
      icon: "Palette",
      sortOrder: 6,
    },
    {
      title: "Sound Design",
      description:
        "Music selection, sound effect layering, audio cleanup and mixing for a polished, immersive listening experience.",
      icon: "Music",
      sortOrder: 7,
    },
    {
      title: "Motion Graphics",
      description:
        "Animated titles, lower thirds, transitions and infographics that add visual energy and brand personality.",
      icon: "Zap",
      sortOrder: 8,
    },
    {
      title: "Narrative Editing",
      description:
        "Story-first editing for documentaries, testimonials and long-form narratives — finding the emotional arc in raw footage.",
      icon: "BookOpen",
      sortOrder: 9,
    },
  ];

  for (const [i, service] of services.entries()) {
    const existing = await prisma.service.findFirst({
      where: { title: service.title },
    });
    if (!existing) {
      await prisma.service.create({ data: service });
    }
  }
  console.log("✅ Services seeded");

  // ─── Software ─────────────────────────────────────────────────
  const softwareList = [
    { name: "Premiere Pro", description: "Primary NLE for all editing workflows", sortOrder: 1 },
    { name: "After Effects", description: "Motion graphics and visual effects", sortOrder: 2 },
    { name: "DaVinci Resolve", description: "Advanced colour grading and finishing", sortOrder: 3 },
    { name: "Photoshop", description: "Thumbnail design and image editing", sortOrder: 4 },
    { name: "Audition", description: "Audio cleanup, mixing and mastering", sortOrder: 5 },
    { name: "Frame.io", description: "Client review and collaboration platform", sortOrder: 6 },
  ];

  for (const sw of softwareList) {
    const existing = await prisma.software.findFirst({ where: { name: sw.name } });
    if (!existing) {
      await prisma.software.create({ data: sw });
    }
  }
  console.log("✅ Software seeded");

  // ─── Social Links ─────────────────────────────────────────────
  const socialLinks = [
    { platform: "instagram", label: "Instagram", url: "https://instagram.com/niloykundu", sortOrder: 1 },
    { platform: "youtube", label: "YouTube", url: "https://youtube.com/@niloykundu", sortOrder: 2 },
    { platform: "linkedin", label: "LinkedIn", url: "https://linkedin.com/in/niloykundu", sortOrder: 3 },
    { platform: "behance", label: "Behance", url: "https://behance.net/niloykundu", sortOrder: 4 },
  ];

  for (const link of socialLinks) {
    const existing = await prisma.socialLink.findFirst({ where: { platform: link.platform } });
    if (!existing) {
      await prisma.socialLink.create({ data: link });
    }
  }
  console.log("✅ Social links seeded");

  // ─── Sample Projects ──────────────────────────────────────────
  const shortFormCat = await prisma.category.findUnique({ where: { slug: "short-form" } });
  const brandCat = await prisma.category.findUnique({ where: { slug: "brand" } });
  const cinematicCat = await prisma.category.findUnique({ where: { slug: "cinematic" } });
  const commercialCat = await prisma.category.findUnique({ where: { slug: "commercial" } });
  const socialCat = await prisma.category.findUnique({ where: { slug: "social-media" } });
  const youtubeCat = await prisma.category.findUnique({ where: { slug: "youtube" } });

  const sampleProjects = [
    {
      title: "Midnight Motion",
      slug: "midnight-motion",
      description:
        "A cinematic short film exploring urban life after dark. This project required a distinctive visual identity — deep blacks, selective colour pops, and a pulsing sound design that carries the viewer through four city vignettes. Delivered as a festival submission and social series.",
      categoryId: cinematicCat?.id,
      client: "Independent",
      year: 2025,
      duration: "4:32",
      role: "Lead Editor, Colourist",
      editingApproach:
        "We cut against the beat rather than with it — creating tension and release by holding frames slightly longer than comfortable. The colour grade uses a selective desaturation technique to isolate warm practicals against cold blue streets.",
      featured: true,
      published: true,
      sortOrder: 1,
      thumbnailUrl:
        "https://images.unsplash.com/photo-1500042428152-57e5a531be9d?w=800&q=80",
    },
    {
      title: "Brand Stories",
      slug: "brand-stories",
      description:
        "A series of 60-second brand films for a lifestyle clothing label. Each film captures a different customer archetype — the storytelling bridges product and identity without a single word of dialogue.",
      categoryId: brandCat?.id,
      client: "Streetwear Brand",
      year: 2025,
      duration: "0:60",
      role: "Editor, Sound Designer",
      editingApproach:
        "Jump-cut heavy with breathing room at emotional moments. Sound design layered with fabric texture foley to create sensory connection with the product.",
      featured: false,
      published: true,
      sortOrder: 2,
      thumbnailUrl:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    },
    {
      title: "30 Seconds",
      slug: "30-seconds",
      description:
        "A high-energy product launch ad for a consumer tech brand. The brief was simple: make it feel cinematic, not corporate. Three takes, one winner that aired across YouTube pre-rolls and Instagram.",
      categoryId: commercialCat?.id,
      client: "Tech Brand",
      year: 2025,
      duration: "0:30",
      role: "Editor, Motion Graphics",
      editingApproach:
        "Every cut lands on a sound effect or musical hit. The motion graphics were kept minimal — velocity ramping on the reveal shot paid off the campaign's punchline without spelling it out.",
      featured: false,
      published: true,
      sortOrder: 3,
      thumbnailUrl:
        "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80",
    },
    {
      title: "The Daily Cut",
      slug: "the-daily-cut",
      description:
        "Weekly YouTube editorial for a business and productivity channel. Consistent output of 10-15 minute videos with chapter markers, animated lower thirds and retention-optimised pacing.",
      categoryId: youtubeCat?.id,
      client: "YouTube Creator",
      year: 2024,
      duration: "12:00",
      role: "Editor",
      editingApproach:
        "Applied the 30% rule — cut 30% of all pauses, filler words and dead air without removing natural speech rhythm. Added B-roll on every verbal reference to maintain visual variety.",
      featured: false,
      published: true,
      sortOrder: 4,
      thumbnailUrl:
        "https://images.unsplash.com/photo-1600096194534-95cf5ece2e2e?w=800&q=80",
    },
    {
      title: "Urban Frames",
      slug: "urban-frames",
      description:
        "A street photography collective's video lookbook — blending stills and motion in a seamless editorial flow. The brief asked for something that felt like a magazine brought to life.",
      categoryId: shortFormCat?.id,
      client: "Photography Collective",
      year: 2024,
      duration: "2:45",
      role: "Editor, Colourist",
      editingApproach:
        "Alternated between still frames at 24fps and slow-motion handheld video. The rhythmic snap between them creates a tension that mirrors the creative tension between photography and film.",
      featured: false,
      published: true,
      sortOrder: 5,
      thumbnailUrl:
        "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80",
    },
    {
      title: "Launch Film",
      slug: "launch-film",
      description:
        "Product launch film for a DTC food brand entering a crowded market. Needed to communicate premium quality in under 90 seconds without voiceover — visuals and sound design carried everything.",
      categoryId: socialCat?.id,
      client: "Food & Beverage Brand",
      year: 2024,
      duration: "1:20",
      role: "Editor, Sound Designer",
      editingApproach:
        "Macro food cinematography cut to ASMR-style sound design. Extreme close-ups of textures create desire before the product is even revealed. Slow reveal sequence builds anticipation across 45 seconds.",
      featured: false,
      published: true,
      sortOrder: 6,
      thumbnailUrl:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
    },
  ];

  for (const project of sampleProjects) {
    const existing = await prisma.project.findUnique({ where: { slug: project.slug } });
    if (!existing) {
      await prisma.project.create({ data: project });
    }
  }
  console.log("✅ Sample projects seeded");

  console.log("\n🎉 Database seeded successfully!");
  console.log("\n📋 Admin Login:");
  console.log(`   Email:    ${adminEmail}`);
  console.log(`   Password: ${adminPassword}`);
  console.log("   URL:      http://localhost:3000/admin/login");
  console.log(
    "\n⚠️  Remember to:\n   1. Change admin password after first login\n   2. Update site settings in the admin panel\n   3. Replace sample projects with your real work\n   4. Add your Calendly URL in Settings"
  );
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
