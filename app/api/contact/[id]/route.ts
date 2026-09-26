import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, isAuthError } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const authResult = await requireAuth(req);
  if (isAuthError(authResult)) return authResult;

  const { id } = await params;
  const { status } = await req.json();

  const validStatuses = ["UNREAD", "READ", "REPLIED", "ARCHIVED"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const inquiry = await prisma.contactInquiry.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json({ inquiry });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const authResult = await requireAuth(req);
  if (isAuthError(authResult)) return authResult;

  const { id } = await params;
  await prisma.contactInquiry.delete({ where: { id } });
  return NextResponse.json({ message: "Deleted" });
}
