"use client";

import { useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/events/EventCard";
import { type Event } from "@/types/event";
import { useState } from "react";

// Helper to capitalize city name
function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

const mockEvents: Partial<Event>[] = [
  {
    _id: "c1",
    title: "Innovation Summit",
    organizerProfileId: { _id: "org1", brandName: "UAP IT Soc", logoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80" } as any,
    category: "Technology",
    venueName: "Expo Center",
    city: "Karachi",
    dateTime: "2026-01-25T10:00:00.000Z",
    isPaid: true,
    ticketPrice: 1500,
    status: "posted",
    cardImageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
  },
  {
    _id: "c2",
    title: "Clifton Beach Music Fest",
    organizerProfileId: { _id: "org2", brandName: "Beach Vibes", logoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" } as any,
    category: "Music",
    venueName: "Clifton Beach",
    city: "Karachi",
    dateTime: "2026-01-12T19:00:00.000Z",
    isPaid: true,
    ticketPrice: 2000,
    status: "posted",
    cardImageUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80",
  },
  {
    _id: "c3",
    title: "Eat Festival 2026",
    organizerProfileId: { _id: "org3", brandName: "OK Foods", logoUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=100&q=80" } as any,
    category: "Food",
    venueName: "Beach View Park",
    city: "Karachi",
    dateTime: "2026-02-05T17:00:00.000Z",
    isPaid: false,
    ticketPrice: 0,
    status: "posted",
    cardImageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
  },
  {
    _id: "c4",
    title: "Art Biennale",
    organizerProfileId: { _id: "org4", brandName: "Art Council", logoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" } as any,
    category: "Art",
    venueName: "Frere Hall",
    city: "Karachi",
    dateTime: "2026-02-12T11:00:00.000Z",
    isPaid: true,
    ticketPrice: 500,
    status: "posted",
    cardImageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80",
  },
  {
    _id: "c5",
    title: "Global Education Expo",
    organizerProfileId: { _id: "org5", brandName: "EduCons", logoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80" } as any,
    category: "Education",
    venueName: "Pearl Continental",
    city: "Karachi",
    dateTime: "2026-02-20T09:00:00.000Z",
    isPaid: false,
    ticketPrice: 0,
    status: "posted",
    cardImageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
  },
  {
    _id: "c6",
    title: "Fashion Week",
    organizerProfileId: { _id: "org6", brandName: "Glamour PK", logoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80" } as any,
    category: "Lifestyle",
    venueName: "Marriott Hotel",
    city: "Karachi",
    dateTime: "2026-02-28T20:00:00.000Z",
    isPaid: true,
    ticketPrice: 5000,
    status: "posted",
    cardImageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80",
  },
  {
    _id: "c7",
    title: "City Marathon",
    organizerProfileId: { _id: "org7", brandName: "Run PK", logoUrl: "https://images.unsplash.com/photo-1526809462580-0a2a16d847b3?w=100&q=80" } as any,
    category: "Sports",
    venueName: "Sea View",
    city: "Karachi",
    dateTime: "2026-03-05T06:00:00.000Z",
    isPaid: true,
    ticketPrice: 1000,
    status: "posted",
    cardImageUrl: "https://images.unsplash.com/photo-1552674605-15c2145eba67?w=800&q=80",
  },
  {
    _id: "c8",
    title: "Literature Festival",
    organizerProfileId: { _id: "org8", brandName: "KLF Team", logoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80" } as any,
    category: "Literature",
    venueName: "Beach Luxury Hotel",
    city: "Karachi",
    dateTime: "2026-03-15T10:00:00.000Z",
    isPaid: false,
    ticketPrice: 0,
    status: "posted",
    cardImageUrl: "https://images.unsplash.com/photo-1474932430478-367dbb6832c1?w=800&q=80",
  },
];

export default function CityPage() {
  const params = useParams();
  const city = capitalizeFirstLetter(decodeURIComponent(params.city as string));
  const [activeFilter, setActiveFilter] = useState("all");

  // Modify dummy events so that the title is prepended with the city name
  // This gives the illusion that the events are specific to whatever city was clicked
  const cityEvents = mockEvents.map(e => ({
    ...e,
    title: `${city} ${e.title}`,
    city: city,
  })) as Event[];

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
              <select className="h-10 rounded-xl border border-[#D1D5DB] bg-white px-4 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#006782]">
                <option value="">Select Category</option>
                <option value="Technology">Technology</option>
                <option value="Music">Music</option>
                <option value="Food">Food</option>
                <option value="Art">Art</option>
              </select>
            </div>
          </div>

          {/* Event Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cityEvents.map(event => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
          
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
