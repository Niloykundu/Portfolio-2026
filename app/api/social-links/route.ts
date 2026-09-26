import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, isAuthError } from "@/lib/auth";
import { socialLinkSchema } from "@/lib/validations/settings";
import { z } from "zod";

export async function GET() {
  const socialLinks = await prisma.socialLink.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ socialLinks });
}

export async function POST(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (isAuthError(authResult)) return authResult;
  try {
    const data = socialLinkSchema.parse(await req.json());
    const link = await prisma.socialLink.create({ data });
    return NextResponse.json({ socialLink: link }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
