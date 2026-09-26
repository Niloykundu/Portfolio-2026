/**
 * Deletes the 6 demo/seed projects (Midnight Motion, Brand Stories, etc.)
 * keeping only the real uploaded video projects.
 */
import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();

const DEMO_SLUGS = [
  "midnight-motion",
  "brand-stories",
  "30-seconds",
  "the-daily-cut",
  "urban-frames",
  "launch-film",
];

async function main() {
  for (const slug of DEMO_SLUGS) {
    const project = await p.project.findUnique({ where: { slug } });
    if (project) {
      await p.projectMedia.deleteMany({ where: { projectId: project.id } });
      await p.project.delete({ where: { slug } });
      console.log(`🗑️  Deleted demo project: "${project.title}"`);
    } else {
      console.log(`⏭️  Not found (already deleted?): ${slug}`);
    }
  }
  console.log("\n✅ Demo projects removed.");
}

main().catch(console.error).finally(() => p.$disconnect());
