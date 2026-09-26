import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, isAuthError } from "@/lib/auth";
import { categorySchema } from "@/lib/validations/settings";
import { z } from "zod";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { projects: true } } },
  });
  return NextResponse.json({ categories });
}

export async function POST(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (isAuthError(authResult)) return authResult;

  try {
    const body = await req.json();
    const data = categorySchema.parse(body);
    const existing = await prisma.category.findUnique({ where: { slug: data.slug } });
    if (existing) {
      return NextResponse.json({ error: "Category with this slug already exists" }, { status: 409 });
    }
    const category = await prisma.category.create({ data });
    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
