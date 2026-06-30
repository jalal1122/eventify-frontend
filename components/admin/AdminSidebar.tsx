"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  ShieldCheck,
  Flag,
  TrendingUp,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Moderation Hub", href: "/admin/moderation", icon: ShieldCheck },
  { name: "Spam & Reports", href: "/admin/spam-reports", icon: Flag },
  { name: "Trending", href: "/admin/trending", icon: TrendingUp },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-800 bg-[#020617] text-slate-300">
      <div className="flex h-full flex-col">
        {/* Logo Area */}
        <div className="flex h-16 items-center px-6 border-b border-slate-800">
          <Link
            href="/admin"
            className="flex items-center gap-2 font-bold text-white text-xl"
          >
            <span className="text-teal-500">Eventify</span> Admin
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-6">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                  isActive
                    ? "bg-slate-800 text-white"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 ${
                    isActive
                      ? "text-teal-500"
                      : "text-slate-500 group-hover:text-teal-500"
                  }`}
                  aria-hidden="true"
                />
                {item.name}

                {/* Visual active indicator bar */}
                {isActive && (
                  <div className="absolute left-0 h-6 w-1 rounded-r-full bg-teal-500" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile / Logout Area */}
        <div className="border-t border-slate-800 p-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 overflow-hidden rounded-full bg-slate-800 flex items-center justify-center">
              <span className="text-sm font-medium text-teal-500">
                {user?.name?.[0]?.toUpperCase() || "A"}
              </span>
            </div>
            <div className="flex flex-1 flex-col truncate">
              <span className="truncate text-sm font-medium text-white">
                {user?.name || "Admin User"}
              </span>
              <span className="truncate text-xs text-slate-500">
                {user?.email || "admin@eventify.com"}
              </span>
            </div>
            <button
              onClick={logout}
              className="text-slate-500 hover:text-white transition-colors"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
