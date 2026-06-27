"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { eventsApi } from "@/lib/api";
import { Event } from "@/types/event";
import { EventCard } from "@/components/events/EventCard";
import { Search, Loader2 } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const locationType = searchParams.get("locationType") || "";

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await eventsApi.discover({ search: query, ...(locationType && { locationType }) });
        if (response.data.success) {
          setEvents(response.data.events);
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
  }, [query, locationType]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header section */}
      <div className="bg-[#004E63] text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Search Results</h1>
          <p className="text-[#A3D3D9]">
            {query ? `Showing results for "${query}"` : "Showing all events"}
            {locationType && ` • ${locationType.charAt(0).toUpperCase() + locationType.slice(1).toLowerCase()}`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Loader2 className="w-10 h-10 animate-spin mb-4" />
            <p>Searching for events...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 flex items-center justify-center">
            <p className="font-medium">{error}</p>
          </div>
        ) : events.length > 0 ? (
          <div>
            <p className="text-gray-600 font-medium mb-6">{events.length} event{events.length === 1 ? '' : 's'} found</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {events.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-white p-6 rounded-full shadow-sm mb-6 border border-gray-100">
              <Search className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-500 max-w-md">
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
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#006782]" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
