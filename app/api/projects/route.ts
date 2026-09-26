import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, isAuthError } from "@/lib/auth";
import { createProjectSchema } from "@/lib/validations/project";
import { z } from "zod";

// ─── GET /api/projects ─────────────────────────────────────────────────────────
// Public: returns only published projects
// Admin: returns all projects (with ?all=true and session)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const all = searchParams.get("all") === "true";
  const categorySlug = searchParams.get("category");
  const featured = searchParams.get("featured") === "true";

  const where: Record<string, unknown> = {};

  if (!all) {
    where.published = true;
  }

  if (categorySlug && categorySlug !== "all") {
    where.category = { slug: categorySlug };
  }

  if (featured) {
    where.featured = true;
  }

  const projects = await prisma.project.findMany({
    where,
    include: {
      category: true,
      media: { orderBy: { sortOrder: "asc" } },
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json({ projects });
}

// ─── POST /api/projects ────────────────────────────────────────────────────────
// Admin only
export async function POST(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (isAuthError(authResult)) return authResult;

  try {
    const body = await req.json();
    const data = createProjectSchema.parse(body);

    // Ensure slug is unique
    const existing = await prisma.project.findUnique({ where: { slug: data.slug } });
    if (existing) {
      return NextResponse.json({ error: "A project with this slug already exists" }, { status: 409 });
    }

    const project = await prisma.project.create({
      data,
      include: { category: true, media: true },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    console.error("Create project error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
