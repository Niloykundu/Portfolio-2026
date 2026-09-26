import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, isAuthError } from "@/lib/auth";
import { softwareSchema } from "@/lib/validations/settings";
import { z } from "zod";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  const authResult = await requireAuth(req);
  if (isAuthError(authResult)) return authResult;
  const { id } = await params;
  try {
    const data = softwareSchema.partial().parse(await req.json());
    const sw = await prisma.software.update({ where: { id }, data });
    return NextResponse.json({ software: sw });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const authResult = await requireAuth(req);
  if (isAuthError(authResult)) return authResult;
  const { id } = await params;
  await prisma.software.delete({ where: { id } });
  return NextResponse.json({ message: "Deleted" });
}
