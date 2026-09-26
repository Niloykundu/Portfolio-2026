"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Film,
  Image,
  Tag,
  Briefcase,
  User,
  Monitor,
  Share2,
  Settings,
  Calendar,
  MessageSquare,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/projects", label: "Projects", icon: Film },
  { href: "/admin/media", label: "Media Library", icon: Image },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/services", label: "Services", icon: Briefcase },
  { href: "/admin/about", label: "About", icon: User },
  { href: "/admin/software", label: "Software", icon: Monitor },
  { href: "/admin/social-links", label: "Social Links", icon: Share2 },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
  { href: "/admin/bookings", label: "Bookings", icon: Calendar },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (item: (typeof navItems)[0]) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const NavContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-[#E5E5E5]">
        <Link href="/admin" className="block">
          <div className="text-xs font-semibold tracking-widest text-[#9B9B9B] uppercase mb-1">
            Admin Panel
          </div>
          <div className="text-sm font-bold text-[#111111] tracking-tight">
            Portfolio CMS
          </div>
        </Link>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                  active
                    ? "bg-[#111111] text-white"
                    : "text-[#6B6B6B] hover:bg-[#F5F5F3] hover:text-[#111111]"
                }`}
              >
                <item.icon
                  size={16}
                  className={active ? "text-white" : "text-[#9B9B9B] group-hover:text-[#111111]"}
                />
                <span className="flex-1">{item.label}</span>
                {active && <ChevronRight size={12} className="text-white/60" />}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-[#E5E5E5]">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#6B6B6B] hover:bg-[#F5F5F3] hover:text-[#111111] transition-all mb-1"
        >
          <Film size={16} className="text-[#9B9B9B]" />
          View Portfolio
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#6B6B6B] hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-56 min-h-screen bg-white border-r border-[#E5E5E5] fixed top-0 left-0 z-40">
        <NavContent />
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-[#E5E5E5] flex items-center justify-between px-4 h-14">
        <span className="text-sm font-bold tracking-tight text-[#111111]">
          Portfolio CMS
        </span>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-[#6B6B6B] hover:text-[#111111]"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed top-14 left-0 bottom-0 z-40 w-56 bg-white border-r border-[#E5E5E5] transform transition-transform duration-200 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <NavContent />
      </aside>
    </>
  );
}
