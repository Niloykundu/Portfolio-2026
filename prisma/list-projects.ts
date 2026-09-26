import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
async function main() {
  const projects = await p.project.findMany({ select: { id: true, title: true, slug: true, published: true, sortOrder: true } });
  console.log(JSON.stringify(projects, null, 2));
}
main().finally(() => p.$disconnect());
