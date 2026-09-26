import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, isAuthError } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";

type Params = { params: Promise<{ id: string }> };

// GET /api/projects/[id]/media — list media for a project
export async function GET(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const media = await prisma.projectMedia.findMany({
    where: { projectId: id },
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json({ media });
}

// POST /api/projects/[id]/media — upload and attach media to project
export async function POST(req: NextRequest, { params }: Params) {
  const authResult = await requireAuth(req);
  if (isAuthError(authResult)) return authResult;

  const { id } = await params;

  // Check project exists
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const altText = (formData.get("altText") as string) || "";
  const sortOrderStr = formData.get("sortOrder") as string;
  const sortOrder = sortOrderStr ? parseInt(sortOrderStr) : 0;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const isVideo = file.type.startsWith("video/");
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const result = await uploadToCloudinary(buffer, {
    folder: `portfolio/projects/${id}`,
    resourceType: isVideo ? "video" : "image",
  });

  // Get current max sortOrder
  const maxSort = await prisma.projectMedia.findFirst({
    where: { projectId: id },
    orderBy: { sortOrder: "desc" },
  });

  const media = await prisma.projectMedia.create({
    data: {
      projectId: id,
      type: isVideo ? "VIDEO" : "IMAGE",
      url: result.secureUrl,
      publicId: result.publicId,
      thumbnailUrl: result.thumbnailUrl,
      altText: altText || file.name,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
      sortOrder: sortOrder || (maxSort ? maxSort.sortOrder + 1 : 0),
    },
  });

  return NextResponse.json({ media }, { status: 201 });
}

// PUT /api/projects/[id]/media — reorder or update media items
export async function PUT(req: NextRequest, { params }: Params) {
  const authResult = await requireAuth(req);
  if (isAuthError(authResult)) return authResult;

  const { id } = await params;
  const { items } = await req.json();

  // Bulk update sort order: items = [{ id, sortOrder }, ...]
  await Promise.all(
    (items as { id: string; sortOrder: number }[]).map((item) =>
      prisma.projectMedia.update({
        where: { id: item.id, projectId: id },
        data: { sortOrder: item.sortOrder },
      })
    )
  );

  return NextResponse.json({ message: "Media reordered" });
}
