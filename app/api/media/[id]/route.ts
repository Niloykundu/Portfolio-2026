import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, isAuthError } from "@/lib/auth";
import { deleteFromCloudinary } from "@/lib/cloudinary";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(req: NextRequest, { params }: Params) {
  const authResult = await requireAuth(req);
  if (isAuthError(authResult)) return authResult;

  const { id } = await params;

  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) {
    return NextResponse.json({ error: "Media not found" }, { status: 404 });
  }

  try {
    // Delete from Cloudinary
    const resourceType = media.resourceType as "image" | "video" | "raw";
    await deleteFromCloudinary(media.publicId, resourceType);
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    // Continue to delete from DB even if Cloudinary fails
  }

  await prisma.media.delete({ where: { id } });

  return NextResponse.json({ message: "Media deleted successfully" });
}
