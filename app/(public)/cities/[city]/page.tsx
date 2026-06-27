"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/events/EventCard";
import { EventCardSkeleton } from "@/components/ui/skeletons";
import { EmptyState } from "@/components/ui/EmptyState";
import { MapPinOff } from "lucide-react";
import { type Event } from "@/types/event";
function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

import { useEvents } from "@/hooks/useEvents";
import { useEffect } from "react";

export default function CityPage() {
  const params = useParams();
  const city = capitalizeFirstLetter(decodeURIComponent(params.city as string));
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeCategory, setActiveCategory] = useState("All");

  const { events, loading, updateFilters } = useEvents({ city });

  useEffect(() => {
    let startDate: string | undefined;
    let endDate: string | undefined;
    const now = new Date();

    if (activeFilter === "today") {
      startDate = new Date(now.setHours(0, 0, 0, 0)).toISOString();
      endDate = new Date(now.setHours(23, 59, 59, 999)).toISOString();
    } else if (activeFilter === "this week") {
      const currentDay = now.getDay();
      const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
      const firstDay = new Date(now.setDate(now.getDate() + distanceToMonday));
      const lastDay = new Date(firstDay);
      lastDay.setDate(lastDay.getDate() + 6);
      startDate = new Date(firstDay.setHours(0, 0, 0, 0)).toISOString();
      endDate = new Date(lastDay.setHours(23, 59, 59, 999)).toISOString();
    } else if (activeFilter === "next week") {
      const currentDay = now.getDay();
      const distanceToNextMonday = currentDay === 0 ? 1 : 8 - currentDay;
      const firstDay = new Date(now.setDate(now.getDate() + distanceToNextMonday));
      const lastDay = new Date(firstDay);
      lastDay.setDate(lastDay.getDate() + 6);
      startDate = new Date(firstDay.setHours(0, 0, 0, 0)).toISOString();
      endDate = new Date(lastDay.setHours(23, 59, 59, 999)).toISOString();
    }

    updateFilters({ startDate, endDate, category: activeCategory });
  }, [activeFilter, activeCategory, updateFilters]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      <main className="flex-1 py-12 px-8">
        <div className="max-w-[1280px] mx-auto">
          {/* Hero Banner */}
          <div className="relative w-full h-[320px] md:h-[400px] rounded-[2rem] overflow-hidden mb-12 shadow-sm">
            <img 
              src="https://images.unsplash.com/photo-1542224566-6e85f2e6772f?w=1600&q=80" 
              alt={`${city} landscape`} 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            
            <div className="absolute inset-0 flex flex-col justify-center px-10 md:px-16">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                Discover Events Across {city}
              </h1>
              <p className="text-white/90 text-lg md:text-xl max-w-[600px]">
                Explore the vibrant energy of Pakistan, from tech summits to cultural festivals in the city.
              </p>
            </div>
          </div>

          {/* Filters and Title Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Upcoming in {city}</h2>
            
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex bg-transparent border-b border-[#E5E7EB]">
                {["all", "today", "this week", "next week"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-4 py-2 text-sm font-semibold capitalize border-b-2 transition-colors ${
                      activeFilter === filter 
                        ? "border-[#006782] text-[#006782]" 
                        : "border-transparent text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
              <select 
                value={activeCategory} 
                onChange={(e) => setActiveCategory(e.target.value)}
                className="h-10 rounded-xl border border-[#D1D5DB] bg-white px-4 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#006782]"
              >
                <option value="All">Select Category</option>
                <option value="Technology">Technology</option>
                <option value="Music">Music</option>
                <option value="Food">Food</option>
                <option value="Art">Art</option>
              </select>
            </div>
          </div>

          {/* Event Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => <EventCardSkeleton key={i} />)}
            </div>
          ) : events.length === 0 ? (
            <div className="mt-8">
              <EmptyState 
                icon={MapPinOff} 
                title={`No events in ${city}`} 
                description="We couldn't find any events matching your criteria in this city." 
                actionLabel="View All Cities"
                actionHref="/"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {events.map(event => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          )}
          
          <div className="flex justify-center mt-12">
            <Button className="bg-[#006782] hover:bg-[#004E63] text-white rounded-full px-8 py-6 text-base font-semibold shadow-md">
              View all Events
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
