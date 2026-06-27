"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, X, History, Flame, ChevronDown, Loader2, Calendar } from "lucide-react";
import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { eventsApi } from "@/lib/api";
import { Event } from "@/types/event";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);
  
  const [format, setFormat] = useState<"online" | "offline" | null>(null);
  const [date, setDate] = useState<"today" | "tomorrow" | "weekend" | "month" | null>(null);
  
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [liveResults, setLiveResults] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("recentSearches");
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved));
        } catch (e) {}
      }
    }
  }, []);

  const saveRecentSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    const updated = [searchQuery, ...recentSearches.filter(q => q !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const removeRecentSearch = (e: React.MouseEvent, searchQuery: string) => {
    e.stopPropagation();
    const updated = recentSearches.filter(q => q !== searchQuery);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  useEffect(() => {
    if (!open) return;
    
    const fetchLiveResults = async () => {
      setLoading(true);
      try {
        const response = await eventsApi.discover({ 
          search: debouncedQuery,
          locationType: format === "online" ? "ONLINE" : format === "offline" ? "VENUE" : undefined,
          limit: 3,
          sort: "relevance"
        } as any);
        if (response.data.success) {
          setLiveResults(response.data.events);
        }
      } catch (err) {
        console.error("Live search failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveResults();
  }, [debouncedQuery, format, date, open]);

  const trendingEvents = [
    { title: "Tech Summit 2024", interested: "450+ interested", icon: "bg-blue-600" },
    { title: "Millions of modern", interested: "Trending Now", icon: "bg-purple-600" },
    { title: "AI Workshop Series", interested: "120+ interested", icon: "bg-green-600" }
  ];

  const handleSearch = (e?: FormEvent, explicitQuery?: string) => {
    if (e) e.preventDefault();
    const finalQuery = explicitQuery !== undefined ? explicitQuery : query;
    if (finalQuery) saveRecentSearch(finalQuery);
    
    const searchParams = new URLSearchParams();
    if (finalQuery) searchParams.set("q", finalQuery);
    if (format) searchParams.set("locationType", format === "online" ? "ONLINE" : "VENUE");
    // Date mapping can be handled here or inside search page
    router.push(`/search?${searchParams.toString()}`);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[750px] p-0 gap-0 overflow-hidden rounded-[2rem] shadow-2xl bg-white">
        <DialogTitle className="sr-only">Search Filters</DialogTitle>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors z-10 bg-white/80 rounded-full p-1"
        >
          <X size={20} />
        </button>

        {/* Header Search Input */}
        <div className="p-6 px-8 border-b border-[#F3F4F6] relative">
          <form className="relative mt-2" onSubmit={handleSearch}>
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 shrink-0" />
            <Input
              autoFocus
              placeholder="Search for events, workshops or organizers..."
              className="w-full pl-12 pr-12 border border-[#E5E7EB] shadow-sm focus-visible:ring-[#006782] text-base h-14 rounded-2xl bg-white"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>
        </div>

        <div className="p-6 bg-white">
          {/* Toggles Row */}
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            {/* Format Toggles */}
            <div className="flex bg-white border border-[#E5E7EB] rounded-full p-1 w-fit shadow-sm">
              <button
                onClick={() => setFormat(format === "online" ? null : "online")}
                className={`px-5 py-2 text-xs font-semibold rounded-full transition-colors ${format === "online" ? "bg-[#E6F0F3] text-[#006782]" : "text-gray-500 hover:text-gray-700"}`}
              >
                Online
              </button>
              <button
                onClick={() => setFormat(format === "offline" ? null : "offline")}
                className={`px-5 py-2 text-xs font-semibold rounded-full transition-colors ${format === "offline" ? "bg-[#E6F0F3] text-[#006782]" : "text-gray-500 hover:text-gray-700"}`}
              >
                Offline
              </button>
            </div>

            {/* Date Toggles */}
            <div className="flex bg-white border border-[#E5E7EB] rounded-full p-1 w-fit shadow-sm overflow-x-auto">
              <button
                onClick={() => setDate(date === "today" ? null : "today")}
                className={`px-4 py-2 text-xs font-semibold rounded-full transition-colors whitespace-nowrap ${date === "today" ? "bg-[#E6F0F3] text-[#006782]" : "text-gray-500 hover:text-gray-700"}`}
              >
                Today
              </button>
              <button
                onClick={() => setDate(date === "tomorrow" ? null : "tomorrow")}
                className={`px-4 py-2 text-xs font-semibold rounded-full transition-colors whitespace-nowrap ${date === "tomorrow" ? "bg-[#E6F0F3] text-[#006782]" : "text-gray-500 hover:text-gray-700"}`}
              >
                Tomorrow
              </button>
              <button
                onClick={() => setDate(date === "weekend" ? null : "weekend")}
                className={`px-4 py-2 text-xs font-semibold rounded-full transition-colors whitespace-nowrap ${date === "weekend" ? "bg-[#E6F0F3] text-[#006782]" : "text-gray-500 hover:text-gray-700"}`}
              >
                This weekend
              </button>
              <button
                onClick={() => setDate(date === "month" ? null : "month")}
                className={`px-4 py-2 text-xs font-semibold rounded-full transition-colors whitespace-nowrap ${date === "month" ? "bg-[#E6F0F3] text-[#006782]" : "text-gray-500 hover:text-gray-700"}`}
              >
                This month
              </button>
            </div>
          </div>

          {/* Select Dropdowns Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="flex items-center justify-between border border-[#E5E7EB] rounded-2xl px-4 py-3 cursor-pointer hover:border-[#006782] transition-colors">
              <span className="text-sm text-gray-700 font-medium">All Categories</span>
              <ChevronDown size={16} className="text-gray-400" />
            </div>
            <div className="flex items-center justify-between border border-[#E5E7EB] rounded-2xl px-4 py-3 cursor-pointer hover:border-[#006782] transition-colors bg-[#F8FAFC]">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-gray-400" />
                <span className="text-sm text-gray-700 font-medium">Any City</span>
              </div>
              <ChevronDown size={16} className="text-gray-400" />
            </div>
          </div>

          {/* Lists Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Live Search Results / Recent Searches */}
            <div>
              {query || format || date ? (
                <>
                  <h4 className="text-xs font-bold text-[#006782] mb-4 tracking-wider flex items-center gap-2">
                    {loading && <Loader2 size={12} className="animate-spin" />}
                    LIVE RESULTS
                  </h4>
                  <ul className="space-y-4">
                    {liveResults.length === 0 && !loading && (
                      <li className="text-sm text-gray-500 py-2">No matching events found.</li>
                    )}
                    {liveResults.map((event) => (
                      <li 
                        key={event._id} 
                        onClick={() => {
                          router.push(`/events/${event._id}`);
                          onClose();
                        }}
                        className="flex items-center gap-4 group cursor-pointer p-2 hover:bg-gray-50 rounded-xl transition-colors -ml-2"
                      >
                        <div className="w-12 h-12 rounded-xl bg-gray-100 shrink-0 overflow-hidden">
                          <img src={event.cardImageUrl || "/placeholder-event.jpg"} alt={event.title} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h5 className="text-sm font-bold text-gray-900 mb-0.5 group-hover:text-[#006782] transition-colors line-clamp-1">{event.title}</h5>
                          <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                            <Calendar size={12} /> {new Date(event.dateTime).toLocaleDateString()}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <>
                  <h4 className="text-xs font-bold text-gray-400 mb-4 tracking-wider">RECENT SEARCHES</h4>
                  <ul className="space-y-4">
                    {recentSearches.length === 0 && (
                      <li className="text-sm text-gray-400">No recent searches</li>
                    )}
                    {recentSearches.map((item, i) => (
                      <li key={i} className="flex items-center justify-between group cursor-pointer -ml-2 p-2 hover:bg-gray-50 rounded-xl transition-colors">
                        <div className="flex items-center gap-3" onClick={() => handleSearch(undefined, item)}>
                          <History size={16} className="text-gray-400 group-hover:text-[#006782] transition-colors" />
                          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">{item}</span>
                        </div>
                        <button type="button" onClick={(e) => removeRecentSearch(e, item)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 p-1">
                          <X size={14} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            {/* Trending in City */}
            <div>
              <h4 className="text-xs font-bold text-gray-400 mb-4 tracking-wider">TRENDING IN CITY</h4>
              <ul className="space-y-4">
                {trendingEvents.map((item, i) => (
                  <li key={i} className="flex items-center gap-4 group cursor-pointer p-2 hover:bg-gray-50 rounded-xl transition-colors -ml-2">
                    <div className={`w-12 h-12 rounded-xl ${item.icon} shrink-0 text-white flex items-center justify-center font-bold text-xl`}>
                      {i + 1}
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-gray-900 mb-0.5 group-hover:text-[#006782] transition-colors">{item.title}</h5>
                      <div className="flex items-center gap-1 text-xs text-orange-500 font-medium">
                        <Flame size={12} className="fill-orange-500" /> {item.interested}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-[#F3F4F6] flex items-center justify-between bg-gray-50/50">
          <button
            onClick={() => {
              setQuery("");
              setFormat(null);
              setDate(null);
            }}
            className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
          >
            Clear Filters
          </button>
          <Button onClick={() => handleSearch()} className="bg-[#006782] hover:bg-[#004E63] text-white rounded-full px-6 shadow-md">
            View All Results
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
