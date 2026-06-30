"use client";

import { useState } from "react";

import { EventBannerCard } from "@/components/events/EventBannerCard";
import { type Event } from "@/types/event";
import { ChevronDown, Search } from "lucide-react";
import { EventBannerCardSkeleton } from "@/components/ui/skeletons";
import { EmptyState } from "@/components/ui/EmptyState";
import { useEvents } from "@/hooks/useEvents";
import Link from "next/link";
export default function DiscoverPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const { events, loading, error } = useEvents();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">

      
      <main className="flex-1">
        {/* Hero Section */}
        <div className="max-w-[1280px] mx-auto px-8 pt-12 pb-8">
          <div className="w-full bg-gradient-to-r from-[#003B4C] to-[#006782] rounded-[2rem] p-12 md:p-16 flex flex-col justify-center min-h-[280px] shadow-lg relative overflow-hidden">
            <div className="absolute right-0 top-0 w-1/2 h-full bg-white/5 blur-3xl rounded-full translate-x-1/4 -translate-y-1/4 pointer-events-none" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 relative z-10 tracking-tight">
              Discover Events
            </h1>
            <p className="text-white/90 text-lg md:text-xl max-w-[600px] relative z-10">
              Explore the best tech meetups, seminars, and local happenings tailored for you.
            </p>
          </div>
        </div>

        {/* Filters Row */}
        <div className="max-w-[1280px] mx-auto px-8 mb-8">
          <div className="flex flex-wrap items-center gap-3 border-b border-[#F3F4F6] pb-6">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-6 h-10 rounded-full text-sm font-semibold transition-colors ${
                activeFilter === "all" ? "bg-[#006782] text-white" : "border border-[#D1D5DB] text-gray-700 hover:bg-gray-50"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter("today")}
              className={`px-6 h-10 rounded-full text-sm font-semibold transition-colors ${
                activeFilter === "today" ? "bg-[#006782] text-white" : "border border-transparent text-gray-700 hover:bg-gray-50"
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setActiveFilter("this-week")}
              className={`px-6 h-10 rounded-full text-sm font-semibold transition-colors ${
                activeFilter === "this-week" ? "bg-[#006782] text-white" : "border border-transparent text-gray-700 hover:bg-gray-50"
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setActiveFilter("next-week")}
              className={`px-6 h-10 rounded-full text-sm font-semibold transition-colors ${
                activeFilter === "next-week" ? "bg-[#006782] text-white" : "border border-transparent text-gray-700 hover:bg-gray-50"
              }`}
            >
              Next Week
            </button>

            <div className="h-6 w-[1px] bg-gray-200 mx-2 hidden md:block" />

            <button className="px-5 h-10 rounded-full border border-[#D1D5DB] text-gray-700 text-sm font-semibold flex items-center gap-2 hover:bg-gray-50 transition-colors ml-auto md:ml-0">
              Select Category <ChevronDown size={16} className="text-gray-400" />
            </button>
            <button className="px-5 h-10 rounded-full border border-[#D1D5DB] text-gray-700 text-sm font-semibold flex items-center gap-2 hover:bg-gray-50 transition-colors">
              Format <ChevronDown size={16} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Events Stack */}
        <div className="max-w-[1280px] mx-auto px-8 pb-12">
          <div className="flex flex-col gap-6 max-w-3xl mx-auto">
            {loading ? (
              <>
                <EventBannerCardSkeleton />
                <EventBannerCardSkeleton />
                <EventBannerCardSkeleton />
              </>
            ) : events.length === 0 ? (
              <EmptyState 
                icon={Search} 
                title="No events match your filters" 
                description="Try adjusting your filters or search criteria." 
                actionLabel="Clear Filters"
                onAction={() => setActiveFilter("all")}
              />
            ) : (
              events.map(event => (
                <EventBannerCard key={event._id} event={event as Event} />
              ))
            )}
          </div>
        </div>
      </main>

      {/* Newsletter Section (Pre-Footer) */}
      <section className="w-full bg-[#006782] py-12 px-8 mt-auto">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-white max-w-xl">
            <h3 className="text-2xl font-bold mb-2">Best of Peshawar Events in Your Inbox</h3>
            <p className="text-sm text-white/80">
              Don't miss your favorite concert again. We deliver best of the city happenings and hand-picked content to you every week. Subscribe to the weekly email newsletter for Peshawar!
            </p>
          </div>
          <div className="w-full max-w-md flex flex-col sm:flex-row gap-2">
            <div className="flex-1 bg-white rounded-md flex items-center px-4 h-12 shadow-inner">
              <input 
                type="email" 
                placeholder="Enter Your Email" 
                className="w-full outline-none text-gray-900 text-sm bg-transparent"
              />
            </div>
            <button className="bg-[#111827] hover:bg-black text-white h-12 px-8 rounded-md font-semibold shrink-0 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>


    </div>
  );
}
