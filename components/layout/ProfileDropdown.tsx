"use client";

import React, { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { User, Ticket, Star, Plus, LayoutGrid, Settings, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function ProfileDropdown() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <button className="flex items-center gap-2 outline-none hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-[#006782] text-white flex items-center justify-center font-semibold text-sm">
            {user.name?.charAt(0) || "U"}
          </div>
          <ChevronDown size={14} className="text-gray-600 hidden sm:block" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="w-[280px] bg-white rounded-xl shadow-lg border border-gray-100 p-2 mt-2 z-50 text-sm animate-in fade-in-80 zoom-in-95 data-[side=bottom]:slide-in-from-top-2"
          sideOffset={5}
          align="end"
        >
          {/* Main Profile Section */}
          <div className="px-3 py-3 border-b border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#006782] text-white flex items-center justify-center font-semibold text-base">
              {user.name?.charAt(0) || "U"}
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-900">{user.name || "User"}</span>
              <span className="text-gray-500 text-xs">{user.email}</span>
            </div>
          </div>

          <div className="py-1 mt-1 border-b border-gray-100">
            <DropdownMenu.Item asChild>
              <Link
                href="/profile"
                className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer outline-none transition-colors"
                onClick={() => setOpen(false)}
              >
                <User size={16} className="text-gray-400" />
                Main Profile
              </Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild>
              <Link
                href="/profile?tab=tickets"
                className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer outline-none transition-colors"
                onClick={() => setOpen(false)}
              >
                <Ticket size={16} className="text-gray-400" />
                My tickets
              </Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild>
              <Link
                href="/profile?tab=interested"
                className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer outline-none transition-colors"
                onClick={() => setOpen(false)}
              >
                <Star size={16} className="text-gray-400" />
                Interested Events
              </Link>
            </DropdownMenu.Item>
          </div>

          {/* Organizer Control Section - Hidden for Attendees */}
          {user.role !== "attendee" && (
            <div className="py-1 border-b border-gray-100">
              <div className="px-3 py-2 text-xs font-semibold text-gray-400 tracking-wider">
                ORGANIZER CONTROL
              </div>
              <DropdownMenu.Item asChild>
                <Link
                  href="/organizers/onboarding"
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer outline-none transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <Plus size={16} className="text-gray-400" />
                  Create An Event
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Item asChild>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer outline-none transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <LayoutGrid size={16} className="text-gray-400" />
                  Organizer Dashboard
                </Link>
              </DropdownMenu.Item>
            </div>
          )}

          {/* Settings & Logout Section */}
          <div className="py-1">
            <DropdownMenu.Item asChild>
              <Link
                href="/settings"
                className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer outline-none transition-colors"
                onClick={() => setOpen(false)}
              >
                <Settings size={16} className="text-gray-400" />
                Account Settings
              </Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild>
              <button
                className="flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer outline-none transition-colors w-full text-left"
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
              >
                <LogOut size={16} className="text-red-500" />
                Log out
              </button>
            </DropdownMenu.Item>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
