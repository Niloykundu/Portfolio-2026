import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, isAuthError } from "@/lib/auth";
import { aboutSchema } from "@/lib/validations/settings";
import { z } from "zod";

export async function GET() {
  let about = await prisma.about.findFirst();
  if (!about) {
    about = await prisma.about.create({
      data: {
        description: "Add your bio in the admin panel.",
      },
    });
  }
  return NextResponse.json({ about });
}

export async function PUT(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (isAuthError(authResult)) return authResult;
  try {
    const data = aboutSchema.partial().parse(await req.json());
    let about = await prisma.about.findFirst();
    if (!about) {
      about = await prisma.about.create({ data: { description: "", ...data } });
    } else {
      about = await prisma.about.update({ where: { id: about.id }, data });
    }
    return NextResponse.json({ about });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
