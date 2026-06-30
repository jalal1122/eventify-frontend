"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useAuth } from "@/hooks/useAuth";
import { Bell } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "admin")) {
      router.push("/auth/login");
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (!mounted || isLoading || !user || user.role !== "admin") {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-500 border-t-transparent"></div>
      </div>
    );
  }

  // Determine current page title
  const getPageTitle = () => {
    if (pathname === "/admin") return "Overview";
    if (pathname.includes("/admin/analytics")) return "Platform Analytics";
    if (pathname.includes("/admin/moderation")) return "Moderation Hub";
    if (pathname.includes("/admin/spam-reports")) return "Spam & Reports";
    if (pathname.includes("/admin/trending")) return "Trending Management";
    if (pathname.includes("/admin/settings")) return "System Settings";
    return "Dashboard";
  };

  // Format current date
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <AdminSidebar />

      <div className="pl-64 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1 items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                {getPageTitle()}
              </h1>
            </div>

            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Date display */}
              <div className="hidden lg:block text-sm text-gray-500 font-medium">
                {today}
              </div>

              {/* Separator */}
              <div
                className="hidden lg:block h-6 w-px bg-gray-200"
                aria-hidden="true"
              />

              {/* Status Button (for specific pages or general) */}
              <Link
                href="/admin/settings"
                className="hidden sm:block rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 ring-1 ring-inset ring-teal-600/20 hover:bg-teal-100"
              >
                System Operational
              </Link>

              {/* Notification bell */}
              <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500 relative"
              >
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" aria-hidden="true" />
                <span className="absolute top-2 right-2.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
