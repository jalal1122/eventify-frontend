"use client";

import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { eventsApi } from "@/lib/api";
import { type Event } from "@/types/event";
import { EventCard } from "@/components/events/EventCard";
import { CategoryBadge } from "@/components/events/CategoryBadge";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Temporary mock categories since there isn't a dedicated category endpoint
const CATEGORIES = [
  "Music",
  "Technology",
  "Food & Drink",
  "Business",
  "Arts",
  "Sports",
  "Health",
];

export default function LandingPage() {
  const [trendingEvents, setTrendingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await eventsApi.discover({ sort: "trending", limit: 6 });
        setTrendingEvents(res.data.events);
      } catch (error) {
        console.error("Failed to fetch trending events", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        {/* ── Hero Section ────────────────────────────────────────── */}
        <section className="relative w-full overflow-hidden bg-[#111827]">
          {/* Background Image with Gradient Overlay */}
          <div className="absolute inset-0">
            <img
              src="/hero-crowd.png"
              alt="Exciting event crowd"
              className="w-full h-full object-cover opacity-70"
            />
            {/* The signature hero gradient from Figma */}
            <div className="absolute inset-0 bg-hero-gradient mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent opacity-80" />
          </div>

          <div className="relative max-w-[1280px] mx-auto px-8 py-24 md:py-32 lg:py-48 z-10 flex flex-col items-start animate-slide-up">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight max-w-[800px] leading-[1.1]">
              Uncover the Best <br />
              <span className="text-[#BAEAFF]">Local Experiences</span>
            </h1>
            
            <p className="mt-6 text-lg md:text-xl text-gray-200 max-w-[600px] leading-relaxed">
              Discover concerts, tech meetups, food festivals, and exclusive gatherings happening right now in your city.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full max-w-md">
              <Link href="/discover" className="w-full sm:w-auto">
                <Button size="lg" className="w-full text-base font-semibold shadow-lg">
                  Explore Events
                </Button>
              </Link>
              <Link href="/organizers/onboarding" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full text-base font-semibold bg-transparent border-white text-white hover:bg-white hover:text-[#111827]">
                  Host an Event
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Categories Row ──────────────────────────────────────── */}
        <section className="border-b border-[#F3F4F6] bg-white">
          <div className="max-w-[1280px] mx-auto px-8 py-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Browse by Category</h2>
              <Link href="/categories" className="text-sm font-medium text-[#006782] hover:text-[#004E63] flex items-center gap-1">
                View all <ChevronRight size={16} />
              </Link>
            </div>
            
            {/* Horizontal scrollable categories */}
            <div className="flex overflow-x-auto pb-4 -mx-8 px-8 sm:mx-0 sm:px-0 gap-3 no-scrollbar snap-x">
              {CATEGORIES.map((cat) => (
                <div key={cat} className="snap-start">
                  <CategoryBadge name={cat} href={`/discover?category=${encodeURIComponent(cat)}`} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Trending Events ─────────────────────────────────────── */}
        <section className="py-16 md:py-24 bg-[#F8FAFC]">
          <div className="max-w-[1280px] mx-auto px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Trending Near You</h2>
                <p className="mt-2 text-gray-500">The most popular upcoming events everyone is talking about.</p>
              </div>
              <Link href="/discover?sort=trending" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-[#006782] hover:text-[#004E63]">
                See all trending <ArrowRight size={16} />
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Skeletons */}
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="rounded-3xl border border-[#F3F4F6] bg-white h-[380px] animate-pulse">
                    <div className="w-full h-[200px] bg-gray-200 rounded-t-3xl" />
                    <div className="p-5 space-y-4">
                      <div className="h-6 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                      <div className="h-4 bg-gray-200 rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : trendingEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trendingEvents.map((event) => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-[#F3F4F6]">
                <p className="text-gray-500">No trending events found right now.</p>
              </div>
            )}
            
            <div className="mt-8 sm:hidden flex justify-center">
              <Link href="/discover?sort=trending">
                <Button variant="outline" className="w-full">
                  See all trending
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* ── CTA Section ─────────────────────────────────────────── */}
        <section className="py-24 bg-white">
          <div className="max-w-[1280px] mx-auto px-8">
            <div className="rounded-3xl bg-[#001F29] relative overflow-hidden flex flex-col md:flex-row items-center justify-between p-10 md:p-16">
              {/* Highlight gradient */}
              <div className="absolute top-0 right-0 w-1/2 h-full bg-cta-highlight pointer-events-none" />
              
              <div className="relative z-10 max-w-xl">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Never miss out on what's next.</h2>
                <p className="text-gray-300 text-lg mb-8">Create an account to follow your favorite organizers, save events, and manage your tickets all in one place.</p>
                <Link href="/auth/signup">
                  <Button size="lg" className="text-base">
                    Join Nextt Event Free
                  </Button>
                </Link>
              </div>
              
              <div className="relative z-10 mt-10 md:mt-0 opacity-80 hover:opacity-100 transition-opacity">
                 {/* Decorative element for CTA */}
                 <div className="w-48 h-48 rounded-full border-4 border-[#006782]/30 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full border-4 border-[#006782]/50 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-[#006782] shadow-[0_0_40px_rgba(0,103,130,0.8)]" />
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
