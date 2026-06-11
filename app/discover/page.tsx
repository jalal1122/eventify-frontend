"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useEvents } from "@/hooks/useEvents";
import { EventCard } from "@/components/events/EventCard";
import { CategoryBadge } from "@/components/events/CategoryBadge";
import { Input } from "@/components/ui/input";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

const CATEGORIES = ["All", "Music", "Technology", "Food & Drink", "Business", "Arts", "Sports", "Health"];

export default function DiscoverPage() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "All";
  const cityParam = searchParams.get("city") || "All";
  const sortParam = (searchParams.get("sort") as "soonest" | "trending") || "soonest";

  const { events, loading, filters, updateFilters } = useEvents({
    q: queryParam,
    category: categoryParam,
    city: cityParam,
    sort: sortParam,
  });

  // Debounced search for the local input
  const debouncedSearch = useDebounce(filters.q, 500);

  // Sync debounced local search string to the actual API fetch
  useEffect(() => {
    updateFilters({ q: debouncedSearch });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />
      
      <main className="flex-1">
        {/* Header Section */}
        <div className="bg-white border-b border-[#F3F4F6] pt-12 pb-8">
          <div className="max-w-[1280px] mx-auto px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Discover Events</h1>
            
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input 
                  value={filters.q || ""}
                  onChange={(e) => updateFilters({ q: e.target.value })}
                  placeholder="Search events, organizers, or keywords..." 
                  className="pl-11 h-12 w-full"
                />
              </div>

              <div className="flex gap-4 w-full md:w-auto">
                {/* Simplified City Dropdown - in a real app this would fetch dynamic cities */}
                <select 
                  className="h-12 rounded-xl border border-[#D1D5DB] bg-white px-4 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#006782] focus:border-[#006782] min-w-[140px]"
                  value={filters.city || "All"}
                  onChange={(e) => updateFilters({ city: e.target.value })}
                >
                  <option value="All">All Cities</option>
                  <option value="Karachi">Karachi</option>
                  <option value="Lahore">Lahore</option>
                  <option value="Islamabad">Islamabad</option>
                </select>

                <select 
                  className="h-12 rounded-xl border border-[#D1D5DB] bg-white px-4 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#006782] focus:border-[#006782] min-w-[140px]"
                  value={filters.sort || "soonest"}
                  onChange={(e) => updateFilters({ sort: e.target.value as "soonest" | "trending" })}
                >
                  <option value="soonest">Soonest</option>
                  <option value="trending">Trending</option>
                </select>
              </div>
            </div>

            {/* Categories horizontal list */}
            <div className="flex overflow-x-auto mt-6 pb-2 -mx-8 px-8 md:mx-0 md:px-0 gap-2 no-scrollbar">
              {CATEGORIES.map((cat) => (
                <button 
                  key={cat} 
                  onClick={() => updateFilters({ category: cat })}
                  className="shrink-0"
                >
                  <CategoryBadge 
                    name={cat} 
                    isActive={filters.category === cat || (!filters.category && cat === "All")} 
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="max-w-[1280px] mx-auto px-8 py-12">
          {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="h-[380px] bg-gray-200 rounded-3xl animate-pulse" />
                ))}
             </div>
          ) : events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {events.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-32">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
              <p className="text-gray-500 max-w-md mx-auto">We couldn't find any events matching your current filters. Try adjusting your search or exploring other categories.</p>
              <button 
                onClick={() => updateFilters({ q: "", category: "All", city: "All" })}
                className="mt-6 text-[#006782] font-medium hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
