"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, Menu, X, ChevronDown, Ticket, LogOut, User, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import SearchModal from "@/components/modals/SearchModal";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropOpen, setProfileDropOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setProfileDropOpen(false);
  };

  return (
    <>
      {/* ── Navbar ──────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 w-full bg-white border-b border-[#F3F4F6]">
        <div className="flex items-center justify-between gap-8 px-8 h-[83px] max-w-[1280px] mx-auto">

          {/* Left — Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-xl font-bold gradient-text">Nextt</span>
            <span className="text-xl font-bold text-[#006782]">Event</span>
          </Link>

          {/* Center — Search bar */}
          <button
            id="navbar-search-trigger"
            onClick={() => setSearchOpen(true)}
            className="hidden md:flex items-center gap-3 flex-1 max-w-[576px] h-[50px] px-4 
                       bg-[#F8FAFC] border border-[#F3F4F6] rounded-2xl text-left 
                       text-gray-400 text-sm transition-all duration-200
                       hover:border-[#006782] hover:bg-white hover:shadow-sm cursor-text"
          >
            <Search size={18} className="text-gray-400 shrink-0" />
            <span>Search events, categories, cities...</span>
          </button>

          {/* Right — Nav + Auth */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/discover"
              className="text-sm font-medium text-gray-600 hover:text-[#006782] transition-colors"
            >
              Discover
            </Link>
            <Link
              href="/categories"
              className="text-sm font-medium text-gray-600 hover:text-[#006782] transition-colors"
            >
              Categories
            </Link>

            {isAuthenticated && user ? (
              /* Profile dropdown */
              <div className="relative">
                <button
                  id="navbar-profile-btn"
                  onClick={() => setProfileDropOpen((v) => !v)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl 
                             hover:bg-[#F8FAFC] transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#006782] flex items-center justify-center text-white text-sm font-semibold">
                    {user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      user.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">
                    {user.name.split(" ")[0]}
                  </span>
                  <ChevronDown
                    size={14}
                    className={cn("text-gray-400 transition-transform", profileDropOpen && "rotate-180")}
                  />
                </button>

                {profileDropOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl 
                                  shadow-xl border border-[#F3F4F6] py-2 animate-scale-in z-50">
                    <div className="px-4 py-3 border-b border-[#F3F4F6]">
                      <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>

                    {user.role === "organizer" || user.role === "admin" ? (
                      <Link
                        href={user.role === "admin" ? "/admin" : "/dashboard/organizer"}
                        onClick={() => setProfileDropOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 
                                   hover:bg-[#F8FAFC] hover:text-[#006782] transition-colors"
                      >
                        <LayoutDashboard size={16} />
                        Dashboard
                      </Link>
                    ) : null}

                    <Link
                      href="/dashboard/attendee/tickets"
                      onClick={() => setProfileDropOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 
                                 hover:bg-[#F8FAFC] hover:text-[#006782] transition-colors"
                    >
                      <Ticket size={16} />
                      My Tickets
                    </Link>

                    <Link
                      href="/dashboard/attendee/profile"
                      onClick={() => setProfileDropOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 
                                 hover:bg-[#F8FAFC] hover:text-[#006782] transition-colors"
                    >
                      <User size={16} />
                      Profile
                    </Link>

                    <div className="border-t border-[#F3F4F6] mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm 
                                   text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Guest auth buttons */
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/signin"
                  className="text-sm font-semibold text-[#006782] hover:text-[#004E63] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-5 py-2.5 bg-[#006782] text-white text-sm font-semibold 
                             rounded-xl hover:bg-[#004E63] transition-colors shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-[#F8FAFC] transition-colors"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#F3F4F6] bg-white px-6 py-4 space-y-3 animate-slide-up">
            <button
              onClick={() => { setSearchOpen(true); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 w-full py-2 text-gray-600 text-sm"
            >
              <Search size={16} />
              Search events...
            </button>
            <Link href="/discover" className="block py-2 text-sm text-gray-600" onClick={() => setMobileMenuOpen(false)}>
              Discover
            </Link>
            <Link href="/categories" className="block py-2 text-sm text-gray-600" onClick={() => setMobileMenuOpen(false)}>
              Categories
            </Link>
            {!isAuthenticated && (
              <div className="flex gap-3 pt-2">
                <Link href="/auth/signin" className="flex-1 text-center py-2.5 border border-[#006782] text-[#006782] rounded-xl text-sm font-semibold">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="flex-1 text-center py-2.5 bg-[#006782] text-white rounded-xl text-sm font-semibold">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Click-outside for dropdown */}
      {profileDropOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setProfileDropOpen(false)}
        />
      )}

      {/* Search modal */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
