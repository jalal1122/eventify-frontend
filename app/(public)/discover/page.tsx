"use client";

import { useState, useEffect } from "react";

import { EventBannerCard } from "@/components/events/EventBannerCard";
import { type Event } from "@/types/event";
import { ChevronDown, Search } from "lucide-react";
import { EventBannerCardSkeleton } from "@/components/ui/skeletons";
import { EmptyState } from "@/components/ui/EmptyState";
import { useEvents } from "@/hooks/useEvents";
import Link from "next/link";
import { eventsApi } from "@/lib/api";

export default function DiscoverPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [visibleEvents, setVisibleEvents] = useState(5);
  const [categories, setCategories] = useState<string[]>([]);
  const [formats, setFormats] = useState<string[]>([]);
  // Default to trending so pinned events show up on top
  const { events, loading, error, updateFilters, filters } = useEvents({ sort: "trending" });

  // Helper to change filter and reset visible events
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setVisibleEvents(5);
    
    const now = new Date();
    let startDate: string | undefined = undefined;
    let endDate: string | undefined = undefined;

    if (filter === "today") {
      startDate = new Date(now.setHours(0, 0, 0, 0)).toISOString();
      endDate = new Date(now.setHours(23, 59, 59, 999)).toISOString();
    } else if (filter === "this-week") {
      const currentDay = now.getDay();
      const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
      const firstDay = new Date(now.setDate(now.getDate() + distanceToMonday));
      const lastDay = new Date(firstDay);
      lastDay.setDate(lastDay.getDate() + 6);
      startDate = new Date(firstDay.setHours(0, 0, 0, 0)).toISOString();
      endDate = new Date(lastDay.setHours(23, 59, 59, 999)).toISOString();
    } else if (filter === "next-week") {
      const currentDay = now.getDay();
      const distanceToNextMonday = currentDay === 0 ? 1 : 8 - currentDay;
      const firstDay = new Date(now.setDate(now.getDate() + distanceToNextMonday));
      const lastDay = new Date(firstDay);
      lastDay.setDate(lastDay.getDate() + 6);
      startDate = new Date(firstDay.setHours(0, 0, 0, 0)).toISOString();
      endDate = new Date(lastDay.setHours(23, 59, 59, 999)).toISOString();
    }

    updateFilters({ startDate, endDate });
  };

  useEffect(() => {
    eventsApi.getCategories().then((res) => {
      if (res.data.success) {
        setCategories(res.data.categories || []);
        setFormats(res.data.formats || []);
      }
    }).catch(console.error);
  }, []);

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
              onClick={() => handleFilterChange("all")}
              className={`px-6 h-10 rounded-full text-sm font-semibold transition-colors ${
                activeFilter === "all" ? "bg-[#006782] text-white" : "border border-[#D1D5DB] text-gray-700 hover:bg-gray-50"
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleFilterChange("today")}
              className={`px-6 h-10 rounded-full text-sm font-semibold transition-colors ${
                activeFilter === "today" ? "bg-[#006782] text-white" : "border border-transparent text-gray-700 hover:bg-gray-50"
              }`}
            >
              Today
            </button>
            <button
              onClick={() => handleFilterChange("this-week")}
              className={`px-6 h-10 rounded-full text-sm font-semibold transition-colors ${
                activeFilter === "this-week" ? "bg-[#006782] text-white" : "border border-transparent text-gray-700 hover:bg-gray-50"
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => handleFilterChange("next-week")}
              className={`px-6 h-10 rounded-full text-sm font-semibold transition-colors ${
                activeFilter === "next-week" ? "bg-[#006782] text-white" : "border border-transparent text-gray-700 hover:bg-gray-50"
              }`}
            >
              Next Week
            </button>

            <div className="h-6 w-[1px] bg-gray-200 mx-2 hidden md:block" />

            <div className="relative ml-auto md:ml-0">
              <select 
                value={filters.category || "All"}
                onChange={(e) => updateFilters({ category: e.target.value })}
                className="appearance-none px-5 h-10 rounded-full border border-[#D1D5DB] text-gray-700 text-sm font-semibold flex items-center bg-transparent gap-2 hover:bg-gray-50 transition-colors pr-10 outline-none focus:border-[#006782] focus:ring-1 focus:ring-[#006782]"
              >
                <option value="All">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <ChevronDown size={16} className="text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="relative">
              <select 
                value={filters.locationType || "All"}
                onChange={(e) => updateFilters({ locationType: e.target.value })}
                className="appearance-none px-5 h-10 rounded-full border border-[#D1D5DB] text-gray-700 text-sm font-semibold flex items-center bg-transparent gap-2 hover:bg-gray-50 transition-colors pr-10 outline-none focus:border-[#006782] focus:ring-1 focus:ring-[#006782]"
              >
                <option value="All">All Formats</option>
                {formats.map((f) => (
                  <option key={f} value={f}>
                    {f === "VENUE" ? "In Person" : f === "ONLINE" ? "Virtual" : f}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
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
              <>
                {events.slice(0, visibleEvents).map(event => (
                  <EventBannerCard key={event._id} event={event as Event} />
                ))}
                {visibleEvents < events.length && (
                  <div className="flex justify-center mt-4">
                    <button 
                      onClick={() => setVisibleEvents(prev => prev + 5)}
                      className="px-8 h-12 rounded-full border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors shadow-sm"
                    >
                      See More Events
                    </button>
                  </div>
                )}
              </>
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
