import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, isAuthError } from "@/lib/auth";
import { updateProjectSchema } from "@/lib/validations/project";
import { z } from "zod";

type Params = { params: Promise<{ id: string }> };

// ─── GET /api/projects/[id] ────────────────────────────────────────────────────
// Public: accessible by slug OR id (for admin preview)
export async function GET(req: NextRequest, { params }: Params) {
  const { id } = await params;

  const project = await prisma.project.findFirst({
    where: { OR: [{ id }, { slug: id }] },
    include: {
      category: true,
      media: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json({ project });
}

// ─── PUT /api/projects/[id] ────────────────────────────────────────────────────
export async function PUT(req: NextRequest, { params }: Params) {
  const authResult = await requireAuth(req);
  if (isAuthError(authResult)) return authResult;

  const { id } = await params;

  try {
    const body = await req.json();
    const data = updateProjectSchema.parse(body);

    // If slug is being changed, check uniqueness
    if (data.slug) {
      const existing = await prisma.project.findFirst({
        where: { slug: data.slug, NOT: { id } },
      });
      if (existing) {
        return NextResponse.json({ error: "A project with this slug already exists" }, { status: 409 });
      }
    }

    const project = await prisma.project.update({
      where: { id },
      data,
      include: { category: true, media: true },
    });

    return NextResponse.json({ project });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    console.error("Update project error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ─── DELETE /api/projects/[id] ─────────────────────────────────────────────────
export async function DELETE(req: NextRequest, { params }: Params) {
  const authResult = await requireAuth(req);
  if (isAuthError(authResult)) return authResult;

  const { id } = await params;

  try {
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ message: "Project deleted successfully" });
  } catch {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }
}
