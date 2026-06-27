"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Calendar, 
  UserCheck, 
  ScanLine, 
  Users, 
  Settings,
  LogOut
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface SidebarItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
}

const SidebarItem = ({ href, icon: Icon, label, isActive }: SidebarItemProps) => (
  <Link 
    href={href}
    className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors font-semibold ${
      isActive 
        ? "bg-[#006782] text-white" 
        : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
    }`}
  >
    <Icon size={20} />
    <span>{label}</span>
  </Link>
);

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
    { href: "/dashboard/events", icon: Calendar, label: "Events Manager" },
    { href: "/dashboard/approvals", icon: UserCheck, label: "Attendee Approvals" },
    { href: "/dashboard/qr-scanner", icon: ScanLine, label: "QR Check-in" },
    { href: "/dashboard/attendees", icon: Users, label: "Attendees List" },
    { href: "/dashboard/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-100 flex flex-col fixed h-full z-10">
        <div className="p-6">
          <Link href="/" className="inline-block">
            <h1 className="text-2xl font-black text-[#006782] tracking-tight">
              Nextt<span className="text-orange-500">Event</span>
            </h1>
            <p className="text-xs text-gray-400 font-bold tracking-widest mt-1">ORGANIZER</p>
          </Link>
        </div>

        <div className="px-4 py-2">
          <div className="flex items-center gap-3 px-2 py-3 mb-6 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-[#006782] text-white flex items-center justify-center font-bold">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm leading-tight">{user?.name || "Organizer"}</p>
              <p className="text-xs text-gray-500">{(user as any)?.brandName || "Premium Account"}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <SidebarItem 
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={logout}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-2xl transition-colors font-semibold text-red-500 hover:bg-red-50"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-72">
        {children}
      </main>
    </div>
  );
}
