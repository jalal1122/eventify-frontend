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
  hasSubmenu?: boolean;
}

const SidebarItem = ({ href, icon: Icon, label, isActive, hasSubmenu }: SidebarItemProps) => (
  <Link 
    href={href}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-semibold ${
      isActive 
        ? "text-white" 
        : "text-gray-400 hover:text-white hover:bg-[#1E293B]"
    }`}
  >
    <Icon size={18} />
    <span className="flex-1">{label}</span>
    {hasSubmenu && <ChevronDown size={14} className="opacity-50" />}
  </Link>
);

function DashboardInner({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { profiles, activeProfile, activeProfileId, setActiveProfileId } = useOrganizer();

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/dashboard/events", icon: Calendar, label: "Events", hasSubmenu: true },
    { href: "/dashboard/approvals", icon: UserCheck, label: "Attendee Approvals" },
    { href: "/dashboard/qr-scanner", icon: ScanLine, label: "QR Scanner" },
    { href: "/dashboard/attendees", icon: Users, label: "Attendees" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Dark Sidebar matching the Figma Design */}
      <aside className="w-[280px] bg-[#0B1120] border-r border-[#1E293B] flex flex-col fixed h-full z-10 text-white">
        
        <div className="p-4">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="flex w-full items-center justify-between gap-3 px-4 py-3 bg-[#111827] hover:bg-[#1f2937] transition-colors rounded-xl border border-gray-800 outline-none">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-lg bg-[#006782] text-white flex items-center justify-center font-bold shrink-0">
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
                <ChevronDown size={16} className="text-gray-500 shrink-0" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content align="start" className="w-[240px] bg-[#111827] border border-gray-800 rounded-xl shadow-xl p-2 z-50 text-white">
                <DropdownMenu.Item 
                  className={`flex flex-col px-3 py-2 outline-none cursor-pointer rounded-lg hover:bg-[#1f2937] ${activeProfileId === "all" ? "bg-[#1E293B] text-white" : "text-gray-300"}`}
                  onClick={() => setActiveProfileId("all")}
                >
                  <span className="font-medium text-sm">All Pages</span>
                  <span className="text-xs text-gray-500">View aggregate data</span>
                </DropdownMenu.Item>
                <DropdownMenu.Separator className="h-px bg-gray-800 my-1" />
                {profiles.map(p => (
                  <DropdownMenu.Item 
                    key={p._id || p.id}
                    className={`flex flex-col px-3 py-2 outline-none cursor-pointer rounded-lg hover:bg-[#1f2937] ${(p._id || p.id) === activeProfileId ? "bg-[#1E293B] text-white" : "text-gray-300"}`}
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
            <div className="grid grid-cols-3 gap-2 mt-3">
              <Link href={`/dashboard/settings/edit`} className="flex flex-col items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-800 bg-transparent hover:bg-[#1E293B] text-gray-400 transition-colors">
                <Edit size={16} />
                <span className="text-[10px] font-medium">Edit page</span>
              </Link>
              <Link href={`/organizers/${activeProfileId}`} target="_blank" className="flex flex-col items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-800 bg-transparent hover:bg-[#1E293B] text-gray-400 transition-colors">
                <Eye size={16} />
                <span className="text-[10px] font-medium">Preview</span>
              </Link>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/organizers/${activeProfileId}`);
                  alert("URL Copied!");
                }}
                className="flex flex-col items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-800 bg-transparent hover:bg-[#1E293B] text-gray-400 transition-colors"
              >
                <Copy size={16} />
                <span className="text-[10px] font-medium">Copy URL</span>
              </button>
            </div>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
          {navItems.map((item) => (
            <SidebarItem 
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              hasSubmenu={item.hasSubmenu}
              isActive={pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))}
            />
          ))}
        </nav>

        <div className="p-4 space-y-3">
          <Link 
            href="/dashboard/settings"
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border ${
              pathname.startsWith("/dashboard/settings") 
                ? "border-[#006782] text-[#006782] bg-[#006782]/10" 
                : "border-[#006782] text-[#006782] hover:bg-[#006782]/10"
            } transition-colors font-semibold justify-center`}
          >
            <Settings size={18} />
            <span>Settings</span>
          </Link>
          
          <button 
            onClick={logout}
            className="flex w-full items-center gap-3 px-3 py-3 rounded-xl bg-[#111827] hover:bg-[#1f2937] border border-gray-800 transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center shrink-0 overflow-hidden">
               {user?.avatarUrl ? (
                 <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
               ) : (
                 <UserCheck size={14} className="text-gray-400" />
               )}
            </div>
            <div className="flex flex-col flex-1 truncate">
               <span className="text-sm font-semibold text-white truncate">{user?.name || "User Admin"}</span>
               <span className="text-[10px] text-gray-500">Logout</span>
            </div>
            <LogOut size={14} className="text-gray-500 shrink-0" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-[280px]">
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
