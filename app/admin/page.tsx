import { prisma } from "@/lib/db";
import Link from "next/link";
import { format } from "date-fns";
import {
  Film,
  Eye,
  FileText,
  Calendar,
  MessageSquare,
  Clock,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export const metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

async function getStats() {
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
    prisma.booking.count({ where: { scheduledAt: { gte: now }, status: "ACTIVE" } }),
    prisma.contactInquiry.count(),
    prisma.contactInquiry.count({ where: { status: "UNREAD" } }),
    prisma.project.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),
    prisma.contactInquiry.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
    prisma.booking.findMany({
      where: { scheduledAt: { gte: now }, status: "ACTIVE" },
      orderBy: { scheduledAt: "asc" },
      take: 5,
    }),
  ]);
  return {
    stats: { totalProjects, publishedProjects, draftProjects, totalBookings, upcomingBookings, totalInquiries, unreadInquiries },
    recentProjects, recentInquiries, nextBookings,
  };
}

export default async function AdminDashboard() {
  const { stats, recentProjects, recentInquiries, nextBookings } = await getStats();

  const statCards = [
    { label: "Total Projects", value: stats.totalProjects, sub: `${stats.publishedProjects} published`, icon: Film, href: "/admin/projects", color: "text-[#111111]" },
    { label: "Draft Projects", value: stats.draftProjects, sub: "unpublished", icon: FileText, href: "/admin/projects", color: "text-[#6B6B6B]" },
    { label: "Upcoming Bookings", value: stats.upcomingBookings, sub: `${stats.totalBookings} total`, icon: Calendar, href: "/admin/bookings", color: "text-green-600" },
    { label: "Unread Messages", value: stats.unreadInquiries, sub: `${stats.totalInquiries} total`, icon: MessageSquare, href: "/admin/messages", color: stats.unreadInquiries > 0 ? "text-red-500" : "text-[#6B6B6B]" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#111111]">Dashboard</h1>
          <p className="text-sm text-[#6B6B6B] mt-1">Welcome back. Here's what's happening.</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#111111] text-white text-sm font-medium hover:bg-[#333333] transition-colors"
        >
          <Film size={14} />
          Add Project
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white border border-[#E5E5E5] p-5 hover:border-[#D1D1D1] transition-colors group"
          >
            <div className="flex items-start justify-between mb-3">
              <card.icon size={16} className="text-[#9B9B9B]" />
              <ArrowRight size={12} className="text-[#D1D1D1] group-hover:text-[#9B9B9B] transition-colors" />
            </div>
            <div className={`text-3xl font-black tracking-tight ${card.color}`}>
              {card.value}
            </div>
            <div className="text-xs font-semibold text-[#111111] mt-1">{card.label}</div>
            <div className="text-xs text-[#9B9B9B] mt-0.5">{card.sub}</div>
          </Link>
        ))}
      </div>

      {/* Three columns */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming Bookings */}
        <div className="bg-white border border-[#E5E5E5] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-[#111111] tracking-tight uppercase">
              Upcoming Bookings
            </h2>
            <Link href="/admin/bookings" className="text-xs text-[#6B6B6B] hover:text-[#111111] flex items-center gap-1">
              View all <ArrowRight size={10} />
            </Link>
          </div>
          {nextBookings.length === 0 ? (
            <div className="text-center py-8">
              <Calendar size={20} className="text-[#D1D1D1] mx-auto mb-2" />
              <p className="text-xs text-[#9B9B9B]">No upcoming bookings</p>
            </div>
          ) : (
            <div className="space-y-3">
              {nextBookings.map((b) => (
                <div key={b.id} className="flex items-start gap-3 py-2 border-b border-[#F5F5F3] last:border-0">
                  <div className="w-8 h-8 bg-green-50 flex items-center justify-center flex-shrink-0">
                    <Calendar size={12} className="text-green-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#111111] truncate">{b.name}</p>
                    <p className="text-xs text-[#6B6B6B]">{b.email}</p>
                    <p className="text-xs text-[#9B9B9B] flex items-center gap-1 mt-0.5">
                      <Clock size={10} />
                      {format(new Date(b.scheduledAt), "MMM d, yyyy · h:mm a")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Projects */}
        <div className="bg-white border border-[#E5E5E5] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-[#111111] tracking-tight uppercase">
              Recent Projects
            </h2>
            <Link href="/admin/projects" className="text-xs text-[#6B6B6B] hover:text-[#111111] flex items-center gap-1">
              View all <ArrowRight size={10} />
            </Link>
          </div>
          {recentProjects.length === 0 ? (
            <div className="text-center py-8">
              <Film size={20} className="text-[#D1D1D1] mx-auto mb-2" />
              <p className="text-xs text-[#9B9B9B]">No projects yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentProjects.map((p) => (
                <Link
                  key={p.id}
                  href={`/admin/projects/${p.id}`}
                  className="flex items-start gap-3 py-2 border-b border-[#F5F5F3] last:border-0 group"
                >
                  <div className="w-8 h-8 bg-[#F5F5F3] flex items-center justify-center flex-shrink-0">
                    <Film size={12} className="text-[#9B9B9B]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[#111111] truncate group-hover:text-[#6B6B6B] transition-colors">
                      {p.title}
                    </p>
                    <p className="text-xs text-[#9B9B9B]">
                      {p.category?.name || "Uncategorized"}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 flex-shrink-0 ${p.published ? "bg-green-50 text-green-600" : "bg-[#F5F5F3] text-[#9B9B9B]"}`}>
                    {p.published ? "Live" : "Draft"}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Messages */}
        <div className="bg-white border border-[#E5E5E5] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-[#111111] tracking-tight uppercase">
              Recent Messages
            </h2>
            <Link href="/admin/messages" className="text-xs text-[#6B6B6B] hover:text-[#111111] flex items-center gap-1">
              View all <ArrowRight size={10} />
            </Link>
          </div>
          {recentInquiries.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare size={20} className="text-[#D1D1D1] mx-auto mb-2" />
              <p className="text-xs text-[#9B9B9B]">No messages yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentInquiries.map((inq) => (
                <div key={inq.id} className="py-2 border-b border-[#F5F5F3] last:border-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-[#111111] truncate">{inq.name}</p>
                    {inq.status === "UNREAD" && (
                      <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-[#6B6B6B] truncate">{inq.email}</p>
                  <p className="text-xs text-[#9B9B9B] line-clamp-1 mt-0.5">{inq.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
