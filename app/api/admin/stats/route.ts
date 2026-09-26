import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, isAuthError } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (isAuthError(authResult)) return authResult;

  const now = new Date();

  const [
    totalProjects,
    publishedProjects,
    draftProjects,
    totalBookings,
    upcomingBookings,
    totalInquiries,
    unreadInquiries,
    recentProjects,
    recentInquiries,
    nextBookings,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { published: true } }),
    prisma.project.count({ where: { published: false } }),
    prisma.booking.count(),
    prisma.booking.count({
      where: { scheduledAt: { gte: now }, status: "ACTIVE" },
    }),
    prisma.contactInquiry.count(),
    prisma.contactInquiry.count({ where: { status: "UNREAD" } }),
    prisma.project.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),
    prisma.contactInquiry.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
    prisma.booking.findMany({
      where: { scheduledAt: { gte: now }, status: "ACTIVE" },
      orderBy: { scheduledAt: "asc" },
      take: 5,
    }),
  ]);

  return NextResponse.json({
    stats: {
      totalProjects,
      publishedProjects,
      draftProjects,
      totalBookings,
      upcomingBookings,
      totalInquiries,
      unreadInquiries,
    },
    recentProjects,
    recentInquiries,
    nextBookings,
  });
}
