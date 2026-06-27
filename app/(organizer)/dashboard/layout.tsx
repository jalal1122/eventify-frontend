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
        : "text-gray-400 hover:bg-[#1E293B] hover:text-white"
    }`}
  >
    <Icon size={20} />
    <span>{label}</span>
  </Link>
);

function DashboardInner({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { profiles, activeProfile, activeProfileId, setActiveProfileId, isLoadingProfiles } = useOrganizer();

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
    { href: "/dashboard/events", icon: Calendar, label: "Events Manager" },
    { href: "/dashboard/approvals", icon: UserCheck, label: "Attendee Approvals" },
    { href: "/dashboard/qr-scanner", icon: ScanLine, label: "QR Check-in" },
    { href: "/dashboard/attendees", icon: Users, label: "Attendees List" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Dark Sidebar */}
      <aside className="w-72 bg-[#0B1120] border-r border-gray-800 flex flex-col fixed h-full z-10 text-white">
        <div className="p-6">
          <Link href="/" className="inline-block">
            <h1 className="text-2xl font-black tracking-tight text-white">
              Nextt<span className="text-orange-500">Event</span>
            </h1>
            <p className="text-xs text-gray-400 font-bold tracking-widest mt-1">ORGANIZER</p>
          </Link>
        </div>

        <div className="px-4 py-2 mb-4">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="flex w-full items-center justify-between gap-3 px-3 py-3 bg-[#1E293B] hover:bg-[#273549] transition-colors rounded-2xl border border-gray-700 outline-none">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-xl bg-[#006782] text-white flex items-center justify-center font-bold shrink-0">
                    {activeProfile?.brandName?.charAt(0) || user?.name?.charAt(0) || "U"}
                  </div>
                  <div className="text-left overflow-hidden">
                    <p className="font-bold text-white text-sm leading-tight truncate">
                      {activeProfileId === "all" ? "All Pages" : activeProfile?.brandName || "Select Page"}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {activeProfileId === "all" ? `${profiles.length} profiles` : `${activeProfile?.followers || 0} followers`}
                    </p>
                  </div>
                </div>
                <ChevronDown size={16} className="text-gray-400 shrink-0" />
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
            <div className="flex items-center justify-between gap-2 mt-4 px-1">
              <Link href={`/dashboard/settings/edit`} className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors group">
                <div className="w-10 h-10 rounded-full border border-gray-700 bg-[#1E293B] group-hover:bg-[#273549] flex items-center justify-center">
                  <Edit size={16} />
                </div>
                <span className="text-[10px] font-medium">Edit page</span>
              </Link>
              <Link href={`/organizers/${activeProfileId}`} target="_blank" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors group">
                <div className="w-10 h-10 rounded-full border border-gray-700 bg-[#1E293B] group-hover:bg-[#273549] flex items-center justify-center">
                  <Eye size={16} />
                </div>
                <span className="text-[10px] font-medium">Preview</span>
              </Link>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/organizers/${activeProfileId}`);
                  alert("URL Copied!");
                }}
                className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors group"
              >
                <div className="w-10 h-10 rounded-full border border-gray-700 bg-[#1E293B] group-hover:bg-[#273549] flex items-center justify-center">
                  <Copy size={16} />
                </div>
                <span className="text-[10px] font-medium">Copy URL</span>
              </button>
            </div>
          )}
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

        <div className="p-4 border-t border-gray-800 space-y-2">
          <SidebarItem 
            href="/dashboard/settings"
            icon={Settings}
            label="Settings"
            isActive={pathname.startsWith("/dashboard/settings")}
          />
          <button 
            onClick={logout}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-2xl transition-colors font-semibold text-gray-400 hover:text-white hover:bg-[#1E293B]"
          >
            <div className="w-8 h-8 rounded-full bg-[#1E293B] flex items-center justify-center shrink-0 border border-gray-700 overflow-hidden">
               {user?.avatarUrl ? (
                 <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
               ) : (
                 <UserCheck size={14} className="text-gray-400" />
               )}
            </div>
            <div className="flex flex-col text-left truncate flex-1">
               <span className="text-sm text-white truncate">{user?.name || "User"}</span>
               <span className="text-xs text-gray-500">Logout</span>
            </div>
            <LogOut size={16} className="text-gray-500 shrink-0" />
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
