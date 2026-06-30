"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { eventsApi, organizerApi } from "@/lib/api";
import { Event } from "@/types/event";
import { EventCard } from "@/components/events/EventCard";
import { Search, Loader2, X, Plus, LayoutGrid, List, ChevronDown, Home, MapPin, Calendar, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

function getStartAndEndDate(tab: string) {
  const now = new Date();
  if (tab === "Today") {
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    return { startDate: start.toISOString(), endDate: end.toISOString() };
  }
  if (tab === "Tomorrow") {
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 23, 59, 59, 999);
    return { startDate: start.toISOString(), endDate: end.toISOString() };
  }
  if (tab === "This Weekend") {
    const day = now.getDay();
    const diffToSat = day === 0 ? -1 : 6 - day; // If sunday (0), go back to saturday (-1), else forward to saturday
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diffToSat);
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diffToSat + 1, 23, 59, 59, 999);
    return { startDate: start.toISOString(), endDate: end.toISOString() };
  }
  return {};
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  const locationType = searchParams.get("locationType") || "";

  const [events, setEvents] = useState<Event[]>([]);
  const [organizers, setOrganizers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [activeDateTab, setActiveDateTab] = useState("All");
  const [sort, setSort] = useState<"relevance" | "soonest" | "trending">("relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const { startDate, endDate } = getStartAndEndDate(activeDateTab);
        const [eventsRes, orgsRes] = await Promise.all([
          eventsApi.discover({ 
            search: query, 
            ...(locationType && { locationType }),
            ...(startDate && { startDate }),
            ...(endDate && { endDate }),
            sort
          } as any),
          query ? organizerApi.searchOrganizers(query) : Promise.resolve({ data: { profiles: [] } })
        ]);

        if (eventsRes.data.success) {
          setEvents(eventsRes.data.events);
        } else {
          setError("Failed to fetch events.");
        }
        
        if (orgsRes.data.success) {
          setOrganizers(orgsRes.data.profiles);
        }
        } else {
          setError("Failed to fetch events.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "An error occurred while fetching results.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, locationType, activeDateTab, sort]);

  const dateTabs = ["All", "Today", "Tomorrow", "This Weekend"];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header section */}
      <div className="bg-[#111827] text-white py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="bg-white/10 text-white/80 text-xs font-bold px-4 py-1.5 rounded-full mb-6 tracking-widest uppercase">
            Showing results for
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold mb-8 text-white">
            "{query || "All Events"}" <span className="font-normal text-white/90">in {locationType || "All Formats"}</span>
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {query && (
              <div className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors px-4 py-2 rounded-full text-sm font-medium cursor-pointer border border-white/5">
                <Search size={14} className="text-white/70" />
                <span>Search: {query}</span>
              </div>
            )}
            {locationType && (
              <div className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors px-4 py-2 rounded-full text-sm font-medium cursor-pointer border border-white/5">
                <MapPin size={14} className="text-white/70" />
                <span>Format: {locationType.charAt(0).toUpperCase() + locationType.slice(1).toLowerCase()}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Results Toolbar */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-white p-2 rounded-2xl shadow-sm mb-8 gap-4 border border-gray-100">
          
          <div className="px-4">
            <span className="text-[#006782] font-bold text-xl mr-2">{events.length}</span>
            <span className="text-gray-500 font-medium">Events Found</span>
          </div>

          <div className="flex items-center gap-1 bg-gray-50/50 p-1 rounded-xl">
            {dateTabs.map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveDateTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeDateTab === tab 
                  ? "bg-white text-[#006782] shadow-sm" 
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 px-2">
            <div className="relative">
              <div 
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-gray-50 px-4 py-2 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
              >
                Sort by: {sort.charAt(0).toUpperCase() + sort.slice(1)}
                <ChevronDown size={16} className="text-gray-400" />
              </div>
              
              {sortDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden z-10">
                  <div className="py-1">
                    <button 
                      onClick={() => { setSort("relevance"); setSortDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${sort === "relevance" ? "text-[#006782] font-semibold bg-blue-50/50" : "text-gray-700"}`}
                    >
                      Relevance
                    </button>
                    <button 
                      onClick={() => { setSort("soonest"); setSortDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${sort === "soonest" ? "text-[#006782] font-semibold bg-blue-50/50" : "text-gray-700"}`}
                    >
                      Soonest
                    </button>
                    <button 
                      onClick={() => { setSort("trending"); setSortDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between ${sort === "trending" ? "text-[#006782] font-semibold bg-blue-50/50" : "text-gray-700"}`}
                    >
                      Trending <Flame size={14} className={sort === "trending" ? "text-orange-500" : "text-gray-400"} />
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-1 border border-gray-200 rounded-xl p-1">
              <button 
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === "grid" ? "bg-gray-100 text-[#006782]" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"}`}
              >
                <LayoutGrid size={18} />
              </button>
              <button 
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === "list" ? "bg-gray-100 text-[#006782]" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"}`}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Organizers Results (if any) */}
        {!loading && !error && organizers.length > 0 && (
          <div className="mb-10">
            <h3 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">Organizers matching "{query}"</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {organizers.map(org => (
                <div 
                  key={org._id} 
                  onClick={() => router.push(`/organizers/${org._id}`)}
                  className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:border-[#006782] hover:shadow-md transition-all group"
                >
                  <div className="w-14 h-14 rounded-full bg-blue-50 shrink-0 overflow-hidden flex items-center justify-center text-blue-600 font-bold text-lg">
                    {org.logoUrl ? (
                      <img src={org.logoUrl} alt={org.brandName} className="w-full h-full object-cover" />
                    ) : (
                      org.brandName.substring(0, 2).toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 truncate group-hover:text-[#006782] transition-colors">{org.brandName}</h4>
                    <p className="text-sm text-gray-500 truncate">Organizer Profile</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results Grid / List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-[#006782]">
            <Loader2 className="w-12 h-12 animate-spin mb-4" />
            <p className="font-medium text-gray-500">Discovering events...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-8 rounded-3xl border border-red-100 flex flex-col items-center justify-center text-center">
            <Search className="w-12 h-12 text-red-300 mb-4" />
            <p className="font-bold text-lg mb-1">Oops! Something went wrong</p>
            <p className="text-red-500">{error}</p>
          </div>
        ) : events.length > 0 ? (
          <>
            <div className={`grid ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "grid-cols-1 md:grid-cols-2 gap-4"} mb-12`}>
              {events.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
            <div className="flex justify-center">
              <Button className="bg-[#006782] hover:bg-[#004E63] text-white px-8 h-12 rounded-full font-bold">
                Load More Events
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="bg-gray-50 p-6 rounded-full mb-6 border border-gray-100">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-500 max-w-md font-medium">
              We couldn't find any events matching your current search criteria. Try adjusting your filters or search terms.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-[#006782] mb-4" />
        <p className="font-medium text-gray-500">Loading Search...</p>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
