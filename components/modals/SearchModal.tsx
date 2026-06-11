"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, X, History, Flame, ChevronDown } from "lucide-react";
import { useState } from "react";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [format, setFormat] = useState<"online" | "offline" | null>("online");
  const [date, setDate] = useState<"today" | "tomorrow" | "weekend" | "month" | null>("today");

  const recentSearches = ["Web3 Seminar", "University Sports", "Peshawar Food Fest"];
  
  const trendingEvents = [
    { title: "Tech Summit 2024", interested: "450+ interested", icon: "bg-gray-900" },
    { title: "Millions of modern", interested: "Trending Now", icon: "bg-gray-800" },
    { title: "AI Workshop Series", interested: "120+ interested", icon: "bg-gray-900" }
  ];

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[750px] p-0 gap-0 overflow-hidden rounded-[2rem] shadow-2xl">
        <DialogTitle className="sr-only">Search Filters</DialogTitle>
        
        {/* Header Search Input */}
        <div className="p-4 px-6 border-b border-[#F3F4F6] flex items-center gap-3 relative">
          <Search size={20} className="text-gray-400 shrink-0" />
          <Input 
            autoFocus
            placeholder="Search for events, workshops or organizers..." 
            className="border-none shadow-none focus-visible:ring-0 text-base h-12 px-0 rounded-none bg-transparent"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={16} />
            </button>
          )}
        </div>

        <div className="p-6">
          {/* Toggles Row */}
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            
            {/* Format Toggles */}
            <div className="flex bg-white border border-[#E5E7EB] rounded-full p-1 w-fit shadow-sm">
              <button 
                onClick={() => setFormat("online")}
                className={`px-5 py-2 text-xs font-semibold rounded-full transition-colors ${format === "online" ? "bg-[#E6F0F3] text-[#006782]" : "text-gray-500 hover:text-gray-700"}`}
              >
                Online
              </button>
              <button 
                onClick={() => setFormat("offline")}
                className={`px-5 py-2 text-xs font-semibold rounded-full transition-colors ${format === "offline" ? "bg-[#E6F0F3] text-[#006782]" : "text-gray-500 hover:text-gray-700"}`}
              >
                Offline
              </button>
            </div>

            {/* Date Toggles */}
            <div className="flex bg-white border border-[#E5E7EB] rounded-full p-1 w-fit shadow-sm overflow-x-auto">
              <button 
                onClick={() => setDate("today")}
                className={`px-4 py-2 text-xs font-semibold rounded-full transition-colors whitespace-nowrap ${date === "today" ? "bg-[#E6F0F3] text-[#006782]" : "text-gray-500 hover:text-gray-700"}`}
              >
                Today
              </button>
              <button 
                onClick={() => setDate("tomorrow")}
                className={`px-4 py-2 text-xs font-semibold rounded-full transition-colors whitespace-nowrap ${date === "tomorrow" ? "bg-[#E6F0F3] text-[#006782]" : "text-gray-500 hover:text-gray-700"}`}
              >
                Tomorrow
              </button>
              <button 
                onClick={() => setDate("weekend")}
                className={`px-4 py-2 text-xs font-semibold rounded-full transition-colors whitespace-nowrap ${date === "weekend" ? "bg-[#E6F0F3] text-[#006782]" : "text-gray-500 hover:text-gray-700"}`}
              >
                This weekend
              </button>
              <button 
                onClick={() => setDate("month")}
                className={`px-4 py-2 text-xs font-semibold rounded-full transition-colors whitespace-nowrap ${date === "month" ? "bg-[#E6F0F3] text-[#006782]" : "text-gray-500 hover:text-gray-700"}`}
              >
                This month
              </button>
            </div>
          </div>

          {/* Select Dropdowns Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="flex items-center justify-between border border-[#E5E7EB] rounded-2xl px-4 py-3 cursor-pointer hover:border-[#006782] transition-colors">
              <span className="text-sm text-gray-700 font-medium">Select Category</span>
              <ChevronDown size={16} className="text-gray-400" />
            </div>
            <div className="flex items-center justify-between border border-[#E5E7EB] rounded-2xl px-4 py-3 cursor-pointer hover:border-[#006782] transition-colors bg-[#F8FAFC]">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-gray-400" />
                <span className="text-sm text-gray-700 font-medium">City or Area</span>
              </div>
              <ChevronDown size={16} className="text-gray-400" />
            </div>
          </div>

          {/* Lists Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Recent Searches */}
            <div>
              <h4 className="text-xs font-bold text-gray-400 mb-4 tracking-wider">RECENT SEARCHES</h4>
              <ul className="space-y-4">
                {recentSearches.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 group cursor-pointer">
                    <History size={16} className="text-gray-400 group-hover:text-[#006782] transition-colors" />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Trending in City */}
            <div>
              <h4 className="text-xs font-bold text-gray-400 mb-4 tracking-wider">TRENDING IN CITY</h4>
              <ul className="space-y-4">
                {trendingEvents.map((item, i) => (
                  <li key={i} className="flex items-center gap-4 group cursor-pointer">
                    <div className={`w-12 h-12 rounded-xl ${item.icon} shrink-0`} />
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
        <div className="p-4 px-6 border-t border-[#F3F4F6] flex items-center justify-between">
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
          <Button onClick={onClose} className="bg-[#006782] hover:bg-[#004E63] text-white rounded-full px-6 shadow-md">
            Show 24 Results
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
