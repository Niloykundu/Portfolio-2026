import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, isAuthError } from "@/lib/auth";
import { softwareSchema } from "@/lib/validations/settings";
import { z } from "zod";

export async function GET() {
  const software = await prisma.software.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ software });
}

export async function POST(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (isAuthError(authResult)) return authResult;
  try {
    const data = softwareSchema.parse(await req.json());
    const sw = await prisma.software.create({ data });
    return NextResponse.json({ software: sw }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
