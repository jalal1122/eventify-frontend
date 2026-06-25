"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, MapPin, Plus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import SearchModal from "@/components/modals/SearchModal";
import LoginToCreateModal from "@/components/modals/LoginToCreateModal";
import { useAuth } from "@/hooks/useAuth";
import ProfileDropdown from "@/components/layout/ProfileDropdown";

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [loginToCreateOpen, setLoginToCreateOpen] = useState(false);
  const { isAuthenticated, user, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleCreateEventClick = () => {
    if (isAuthenticated) {
      router.push("/events/create");
    } else {
      setLoginToCreateOpen(true);
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-40 w-full bg-white border-b border-[#F3F4F6] h-[83px] flex items-center px-8 transition-all">
        <div className="w-full max-w-[1280px] mx-auto flex items-center justify-between">
          
          {/* Left side: Logo & Search */}
          <div className="flex items-center gap-8 flex-1">
            <Link href="/" className="flex items-center text-2xl font-bold text-[#111827]">
              Eventify
            </Link>

            {/* Search Bar (Matches screenshot) */}
            <div 
              onClick={() => setSearchOpen(true)}
              className="hidden md:flex items-center bg-white border border-[#E5E7EB] rounded-full h-11 px-4 cursor-text w-full max-w-[400px] hover:border-[#006782] transition-colors"
            >
              <Search size={16} className="text-gray-400 mr-2" />
              <span className="text-gray-400 text-sm flex-1">Search Events</span>
              
              <div className="flex items-center pl-3 border-l border-[#E5E7EB] ml-2 text-gray-500 text-sm gap-1 hover:text-[#006782]">
                Location <MapPin size={14} />
              </div>
            </div>
          </div>

          {/* Right side: Links & Auth */}
          <div className="flex items-center gap-6">
            <Link href="/" className={`hidden lg:block text-sm pb-0 border-b-2 transition-colors ${pathname === "/" ? "font-semibold text-[#006782] border-[#006782]" : "font-medium text-gray-600 border-transparent hover:text-gray-900"}`}>
              Home
            </Link>
            <Link href="/discover" className={`hidden lg:block text-sm pb-0 border-b-2 transition-colors ${pathname === "/discover" ? "font-semibold text-[#006782] border-[#006782]" : "font-medium text-gray-600 border-transparent hover:text-gray-900"}`}>
              Discover
            </Link>
            <button 
              onClick={handleCreateEventClick} 
              className="hidden md:flex items-center gap-1 text-sm font-medium text-[#006782] hover:text-[#004E63] transition-colors bg-transparent border-none cursor-pointer outline-none"
            >
              <Plus size={16} /> Create Event
            </button>

            <div className="w-[1px] h-6 bg-[#E5E7EB] hidden sm:block mx-2" />

            {isAuthenticated ? (
               <ProfileDropdown />
            ) : (
               <Link href="/auth/signin" className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors">
                 <User size={18} className="text-[#006782]" /> Sign In
               </Link>
            )}
          </div>
        </div>
      </nav>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <LoginToCreateModal open={loginToCreateOpen} onClose={() => setLoginToCreateOpen(false)} />
    </>
  );
}

