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
  LogOut,
  ChevronDown,
  Edit,
  Eye,
  Copy
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { OrganizerProvider, useOrganizer } from "@/context/OrganizerContext";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

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

function DashboardInner({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { profiles, activeProfile, activeProfileId, setActiveProfileId } = useOrganizer();

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
    { href: "/dashboard/events", icon: Calendar, label: "Events Manager" },
    { href: "/dashboard/approvals", icon: UserCheck, label: "Attendee Approvals" },
    { href: "/dashboard/qr-scanner", icon: ScanLine, label: "QR Check-in" },
    { href: "/dashboard/attendees", icon: Users, label: "Attendees List" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Light Sidebar */}
      <aside className="w-72 bg-[#F8FAFC] border-r border-gray-200 flex flex-col fixed h-full z-10">
        <div className="p-6">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-black tracking-tight text-orange-500">
              Eventify
            </h1>
            <p className="text-xs text-gray-400 font-bold tracking-widest mt-1">ORGANIZER</p>
          </Link>
        </div>

        <div className="px-4 py-2 mb-4">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="flex w-full items-center justify-between gap-3 px-3 py-3 bg-white hover:bg-gray-50 transition-colors rounded-3xl border border-gray-200 outline-none shadow-sm">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-full bg-[#006782] text-white flex items-center justify-center font-bold shrink-0">
                    {activeProfile?.brandName?.charAt(0) || user?.name?.charAt(0) || "U"}
                  </div>
                  <div className="text-left overflow-hidden">
                    <p className="font-bold text-gray-900 text-sm leading-tight truncate">
                      {activeProfileId === "all" ? "All Pages" : activeProfile?.brandName || "Select Page"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {activeProfileId === "all" ? `${profiles.length} profiles` : `${activeProfile?.followers || 0} followers`}
                    </p>
                  </div>
                </div>
                <ChevronDown size={16} className="text-gray-400 shrink-0 mr-1" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content align="start" className="w-[240px] bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-50">
                <DropdownMenu.Item 
                  className={`flex flex-col px-3 py-2 outline-none cursor-pointer rounded-lg hover:bg-gray-50 ${activeProfileId === "all" ? "bg-blue-50 text-[#006782]" : ""}`}
                  onClick={() => setActiveProfileId("all")}
                >
                  <span className="font-medium text-sm">All Pages</span>
                  <span className="text-xs text-gray-500">View aggregate data</span>
                </DropdownMenu.Item>
                <DropdownMenu.Separator className="h-px bg-gray-100 my-1" />
                {profiles.map(p => (
                  <DropdownMenu.Item 
                    key={p._id || p.id}
                    className={`flex flex-col px-3 py-2 outline-none cursor-pointer rounded-lg hover:bg-gray-50 ${(p._id || p.id) === activeProfileId ? "bg-blue-50 text-[#006782]" : ""}`}
                    onClick={() => setActiveProfileId(p._id || p.id as string)}
                  >
                    <span className="font-medium text-sm">{p.brandName}</span>
                    <span className="text-xs text-gray-500">{p.followers || 0} followers</span>
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          {activeProfileId !== "all" && activeProfile && (
            <div className="flex items-center justify-around gap-2 mt-6 px-2">
              <Link href={`/dashboard/settings/edit`} className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#006782] transition-colors group">
                <div className="w-12 h-12 rounded-full border border-gray-200 bg-white group-hover:border-[#006782] flex items-center justify-center shadow-sm">
                  <Edit size={18} />
                </div>
                <span className="text-[11px] font-medium mt-1">Edit page</span>
              </Link>
              <Link href={`/organizers/${activeProfileId}`} target="_blank" className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#006782] transition-colors group">
                <div className="w-12 h-12 rounded-full border border-gray-200 bg-white group-hover:border-[#006782] flex items-center justify-center shadow-sm">
                  <Eye size={18} />
                </div>
                <span className="text-[11px] font-medium mt-1">Preview</span>
              </Link>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/organizers/${activeProfileId}`);
                  alert("URL Copied!");
                }}
                className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#006782] transition-colors group"
              >
                <div className="w-12 h-12 rounded-full border border-gray-200 bg-white group-hover:border-[#006782] flex items-center justify-center shadow-sm">
                  <Copy size={18} />
                </div>
                <span className="text-[11px] font-medium mt-1">Copy URL</span>
              </button>
            </div>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
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

        <div className="p-4 border-t border-gray-200 space-y-2 bg-[#F8FAFC]">
          <SidebarItem 
            href="/dashboard/settings"
            icon={Settings}
            label="Settings"
            isActive={pathname.startsWith("/dashboard/settings")}
          />
          <button 
            onClick={logout}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-2xl transition-colors font-semibold text-gray-500 hover:text-gray-900 hover:bg-gray-100"
          >
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0 border border-gray-300 overflow-hidden">
               {user?.avatarUrl ? (
                 <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
               ) : (
                 <UserCheck size={14} className="text-gray-500" />
               )}
            </div>
            <div className="flex flex-col text-left truncate flex-1">
               <span className="text-sm text-gray-900 truncate">{user?.name || "User"}</span>
               <span className="text-xs text-gray-500">Logout</span>
            </div>
            <LogOut size={16} className="text-gray-400 shrink-0" />
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

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <OrganizerProvider>
      <DashboardInner>{children}</DashboardInner>
    </OrganizerProvider>
  );
}
