import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, isAuthError } from "@/lib/auth";
import { contactSchema } from "@/lib/validations/settings";
import { sendContactEmail } from "@/lib/mailer";
import { z } from "zod";

// POST /api/contact — public endpoint
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = contactSchema.parse(body);

    const inquiry = await prisma.contactInquiry.create({ data });

    // Send email notification (non-blocking — don't fail the request if email fails)
    sendContactEmail({
      name: data.name,
      email: data.email,
      projectType: data.projectType ?? undefined,
      budget: data.budget ?? undefined,
      message: data.message,
    }).catch((err) => {
      console.error("[mailer] Failed to send contact email:", err);
    });

    return NextResponse.json(
      { message: "Message received! I'll get back to you soon.", inquiry: { id: inquiry.id } },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET /api/contact — admin only
export async function GET(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (isAuthError(authResult)) return authResult;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const where: Record<string, unknown> = {};
  if (status) where.status = status;

  const [inquiries, total] = await Promise.all([
    prisma.contactInquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.contactInquiry.count({ where }),
  ]);

  return NextResponse.json({
    inquiries,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
}
