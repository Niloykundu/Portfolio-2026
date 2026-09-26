import { getSession } from "@/lib/auth";
import AdminSidebar from "@/components/admin/Sidebar";

export const metadata = {
  title: { default: "Admin", template: "%s | Portfolio Admin" },
  robots: "noindex, nofollow",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Not logged in — render just children (the login page) without the sidebar shell
  // The login page itself handles the redirect after successful auth
  if (!session) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#F8F8F7]">
      <AdminSidebar />
      {/* Main content — offset for sidebar */}
      <main className="lg:pl-56 pt-14 lg:pt-0 min-h-screen">
        <div className="p-6 max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
