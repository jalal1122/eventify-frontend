"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Calendar, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { eventsApi } from "@/lib/api";
import { type Event } from "@/types/event";
import { formatShortDate } from "@/lib/utils";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  
  const [results, setResults] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
      return;
    }
  }, [open]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        return;
      }
      
      try {
        setLoading(true);
        const res = await eventsApi.discover({ q: debouncedQuery, limit: 5 });
        setResults(res.data.events);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  const handleSelect = (eventId: string) => {
    onClose();
    router.push(`/events/${eventId}`);
  };

  const handleSeeAll = () => {
    onClose();
    router.push(`/discover?q=${encodeURIComponent(query)}`);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 overflow-hidden rounded-2xl top-[10%] translate-y-0 shadow-2xl">
        <DialogTitle className="sr-only">Search Events</DialogTitle>
        <div className="brand-bar w-full" />
        
        <div className="p-4 border-b border-[#F3F4F6] flex items-center gap-3">
          <Search size={20} className="text-gray-400 shrink-0" />
          <Input 
            autoFocus
            placeholder="Search events, organizers, cities..." 
            className="border-none shadow-none focus-visible:ring-0 text-base h-12 px-0 rounded-none bg-transparent"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {!query.trim() ? (
            <div className="p-6 text-center text-sm text-gray-500">
              Start typing to search for amazing local events...
            </div>
          ) : loading ? (
             <div className="p-6 text-center text-sm text-gray-500">
               Searching...
             </div>
          ) : results.length > 0 ? (
            <div className="flex flex-col gap-1">
              {results.map((event) => (
                <button
                  key={event._id}
                  onClick={() => handleSelect(event._id)}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#F8FAFC] transition-colors text-left w-full group"
                >
                  <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                    {event.cardImageUrl || event.bannerUrl ? (
                      <img src={event.cardImageUrl || event.bannerUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-[#006782]/10" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate group-hover:text-[#006782] transition-colors">{event.title}</h4>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Calendar size={12} /> {formatShortDate(event.dateTime)}</span>
                      <span className="flex items-center gap-1 truncate"><MapPin size={12} /> {event.city}</span>
                    </div>
                  </div>
                </button>
              ))}
              
              <div className="p-2 mt-2 border-t border-[#F3F4F6]">
                <button 
                  onClick={handleSeeAll}
                  className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold text-[#006782] hover:bg-[#F8FAFC] rounded-lg transition-colors"
                >
                  See all results for "{query}" <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ) : (
             <div className="p-8 text-center">
               <p className="text-gray-900 font-medium mb-1">No results found</p>
               <p className="text-sm text-gray-500">Try adjusting your search terms.</p>
             </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
