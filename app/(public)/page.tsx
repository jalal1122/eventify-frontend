"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Trophy, Monitor, Music, Briefcase, Palette, ChevronRight, Plus, Search, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { EventCard } from "@/components/events/EventCard";
import { EventCardSkeleton } from "@/components/ui/skeletons";
import { EmptyState } from "@/components/ui/EmptyState";
import { CalendarX } from "lucide-react";
import { type Event } from "@/types/event";
import LoginToCreateModal from "@/components/modals/LoginToCreateModal";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { eventsApi } from "@/lib/api";

// Mock data to match the screenshot layout
const categories = [
  { name: "Education", icon: BookOpen },
  { name: "Sports", icon: Trophy },
  { name: "Technology", icon: Monitor },
  { name: "Entertainment", icon: Music },
  { name: "Corporate", icon: Briefcase },
  { name: "Culture", icon: Palette },
];


const defaultCityImages: Record<string, string> = {
  "karachi": "/karachi.png",
  "lahore": "/lahore.png",
  "islamabad": "/islamabad.png",
  "peshawar": "/peshawar.png",
  "quetta": "/quetta.png"
};

export default function Home() {
  const [loginToCreateOpen, setLoginToCreateOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [topCities, setTopCities] = useState<{name: string, count: string, img: string}[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [pastLoading, setPastLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        let params: any = { sort: "trending" };
        const now = new Date();
        if (activeTab === "today") {
          params.startDate = new Date(now.setHours(0, 0, 0, 0)).toISOString();
          params.endDate = new Date(now.setHours(23, 59, 59, 999)).toISOString();
        } else if (activeTab === "week") {
          const currentDay = now.getDay();
          const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
          const firstDay = new Date(now.setDate(now.getDate() + distanceToMonday));
          const lastDay = new Date(firstDay);
          lastDay.setDate(lastDay.getDate() + 6);
          params.startDate = new Date(firstDay.setHours(0, 0, 0, 0)).toISOString();
          params.endDate = new Date(lastDay.setHours(23, 59, 59, 999)).toISOString();
        } else if (activeTab === "month") {
          const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
          const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          params.startDate = new Date(firstDay.setHours(0, 0, 0, 0)).toISOString();
          params.endDate = new Date(lastDay.setHours(23, 59, 59, 999)).toISOString();
        }

        const res = await eventsApi.discover(params);
        if (res.data.success) {
          // get top 4 events for the popular section
          setEvents(res.data.events.slice(0, 4));
        }
      } catch (err) {
        console.error("Failed to fetch events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [activeTab]);

  useEffect(() => {
    const fetchTopCities = async () => {
      try {
        const res = await eventsApi.getTopCities(5);
        if (res.data.success) {
          const formatted = res.data.topCities.map((c: any) => ({
            name: c.name,
            count: `${c.count} Event${c.count !== 1 ? 's' : ''}`,
            img: defaultCityImages[c.name.toLowerCase()] || "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80"
          }));
          setTopCities(formatted);
        }
      } catch (err) {
        console.error("Failed to fetch top cities:", err);
      }
    };
    
    const fetchPastEvents = async () => {
      setPastLoading(true);
      try {
        const res = await eventsApi.discover({ status: "completed", sort: "recent", limit: 4 } as any);
        if (res.data.success) {
          setPastEvents(res.data.events.slice(0, 4));
        }
      } catch (err) {
        console.error("Failed to fetch past events:", err);
      } finally {
        setPastLoading(false);
      }
    };

    fetchTopCities();
    fetchPastEvents();
  }, []);

  const handleCreateEventClick = () => {
    if (isAuthenticated) {
      router.push("/events/create");
    } else {
      setLoginToCreateOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">

      
      <main className="flex-1 pb-16">
        
        {/* 1. Hero Section */}
        <section className="max-w-[1280px] mx-auto px-8 pt-8 mb-16">
          <div className="relative w-full h-[400px] md:h-[480px] rounded-[2rem] overflow-hidden">
            {/* Hero Background - using local image placed in public/ */}
            <img 
              src="/hero-bg.png" 
              alt="Crowd at event" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Gradient Overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#003B4C]/90 via-[#004E63]/60 to-transparent" />
            
            <div className="absolute inset-0 flex flex-col justify-center px-12 md:px-20">
              <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold text-white max-w-[600px] leading-[1.1] mb-6">
                Discover Events Across Pakistan
              </h1>
              <p className="text-white/90 text-lg max-w-[500px] mb-8">
                Find student events, workshops, seminars, and meetups inside and near your local community.
              </p>
              <Button 
                onClick={handleCreateEventClick}
                className="w-fit bg-white text-[#006782] hover:bg-gray-100 rounded-full px-6 py-6 text-base font-semibold shadow-lg"
              >
                Create Event <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* 2. Browse by Category */}
        <section className="max-w-[1280px] mx-auto px-8 mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Browse by Category</h2>
            <Link href="/search" className="text-sm font-semibold text-[#006782] hover:underline">
              See all categories
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 flex flex-col items-center justify-center gap-4 border border-[#F3F4F6] shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-[#E6F0F3] flex items-center justify-center text-[#006782]">
                  <cat.icon size={24} />
                </div>
                <span className="text-sm font-medium text-gray-900">{cat.name}</span>
              </div>
            ))}
          </div>
        </section>


        {/* 3. Most Popular Upcoming Events */}
        <section className="max-w-[1280px] mx-auto px-8 mb-20">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <h2 className="text-2xl font-bold text-gray-900">Most Popular Upcoming Events</h2>
              <TabsList className="bg-transparent gap-2 h-auto">
                <TabsTrigger value="all" className="rounded-none shadow-none px-4 py-2 border-b-2 border-transparent data-[state=active]:border-[#006782] data-[state=active]:shadow-none data-[state=active]:bg-transparent">All</TabsTrigger>
                <TabsTrigger value="today" className="rounded-none shadow-none px-4 py-2 border-b-2 border-transparent data-[state=active]:border-[#006782] data-[state=active]:shadow-none data-[state=active]:bg-transparent">Today</TabsTrigger>
                <TabsTrigger value="week" className="rounded-none shadow-none px-4 py-2 border-b-2 border-transparent data-[state=active]:border-[#006782] data-[state=active]:shadow-none data-[state=active]:bg-transparent">This Week</TabsTrigger>
                <TabsTrigger value="month" className="rounded-none shadow-none px-4 py-2 border-b-2 border-transparent data-[state=active]:border-[#006782] data-[state=active]:shadow-none data-[state=active]:bg-transparent">This Month</TabsTrigger>
              </TabsList>
            </div>
            
            {["all", "today", "week", "month"].map(tabValue => (
              <TabsContent key={tabValue} value={tabValue} className="mt-0">
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <EventCardSkeleton key={i} />)}
                  </div>
                ) : events.length === 0 ? (
                  <EmptyState 
                    icon={CalendarX} 
                    title="No events yet" 
                    description="Be the first to create an amazing event for the community." 
                    actionLabel="Create Event" 
                    onAction={handleCreateEventClick} 
                  />
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {events.map((event) => (
                        <EventCard key={event._id} event={event} />
                      ))}
                    </div>
                    <div className="flex justify-center mt-10">
                      <Link href="/search">
                        <Button className="bg-[#006782] hover:bg-[#004E63] text-white rounded-full px-8 py-6 text-base shadow-md">
                          View all Events
                        </Button>
                      </Link>
                    </div>
                  </>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </section>

        {/* 3.5. Past Events
        <section className="max-w-[1280px] mx-auto px-8 mb-20">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <h2 className="text-2xl font-bold text-gray-900">Past Events</h2>
          </div>
          
          {pastLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => <EventCardSkeleton key={i} />)}
            </div>
          ) : pastEvents.length === 0 ? (
            <EmptyState 
              icon={CalendarX} 
              title="No past events" 
              description="There are no past events to show right now." 
              actionLabel="View Upcoming Events"
              onAction={() => window.scrollTo(0, 0)}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pastEvents.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          )}
        </section>
        */}

        {/* 4. Trending in Top Cities */}
        <section className="max-w-[1280px] mx-auto px-8 mb-24">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Trending in Top Cities</h2>
          {topCities.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 h-[320px]">
              {topCities.map((city, i) => (
                <Link key={i} href={`/cities/${city.name.toLowerCase()}`}>
                  <div className="relative rounded-3xl overflow-hidden group cursor-pointer border border-[#F3F4F6] shadow-sm w-full h-full">
                    <img src={city.img} alt={city.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-6 left-6 text-left">
                      <h3 className="text-xl font-bold text-white mb-1">{city.name}</h3>
                      <p className="text-sm text-gray-300">{city.count}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="w-full h-[320px] bg-gray-100 rounded-3xl animate-pulse"></div>
          )}
        </section>

        {/* 5. Proud Community Partners */}
        <section className="max-w-[1280px] mx-auto px-8 mb-24 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 uppercase tracking-wide">Proud Community Partners</h2>
          <p className="text-gray-500 text-sm mb-10 max-w-2xl mx-auto">
            Collaborating with trusted brands, innovators, and organizations to bring you the best events.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {["PTC Foundation", "Peshawar 2.0", "Google Developer Groups", "NIC Pakistan"].map((partner, i) => (
              <div key={i} className="w-[200px] h-24 bg-white rounded-3xl border border-[#F3F4F6] shadow-sm flex flex-col items-center justify-center">
                <div className="w-8 h-8 bg-gray-200 mb-2 rounded-sm" /> {/* Placeholder for logo */}
                <span className="text-xs font-semibold text-gray-600">{partner}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Organizer CTA */}
        <section className="max-w-[1280px] mx-auto px-8 mb-24">
          <div className="bg-[#006782] rounded-[2rem] overflow-hidden flex flex-col md:flex-row relative">
            <div className="flex-1 p-12 md:p-16 flex flex-col justify-center text-white z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Do You Organize Events?</h2>
              <p className="text-white/80 mb-8 max-w-md text-sm leading-relaxed">
                Let's shape Pakistan's UI happenings... together. Reach thousands of target attendees with our seamless platform tools.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Button 
                  onClick={handleCreateEventClick}
                  className="bg-white text-[#006782] hover:bg-gray-100 rounded-full px-6 py-6 text-base font-semibold shadow-md"
                >
                  Create an Event <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Link href="/about">
                  <Button variant="outline" className="border-white text-white hover:bg-white hover:text-[#006782] bg-transparent rounded-full px-6 py-6 text-base font-semibold transition-colors">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            {/* Right side graphic mockup */}
            <div className="w-full md:w-[45%] h-[300px] md:h-auto relative bg-[#004E63] overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
                alt="Event organizer dashboard"
                className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-overlay hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#006782] to-transparent md:block hidden" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#006782] to-transparent md:hidden block" />
            </div>
          </div>
        </section>

        {/* 7. FAQs */}
        <section className="max-w-3xl mx-auto px-8 mb-24 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-10">Frequently Asked Questions</h2>
          <div className="text-left">
            <Accordion type="multiple" defaultValue={["item-1"]}>
              <AccordionItem value="item-1">
                <AccordionTrigger>FAQ (For Organizers)</AccordionTrigger>
                <AccordionContent>
                  As an organizer, you can easily create, manage, and promote your events using our intuitive dashboard. Track registrations in real-time, scan tickets at the gate, and analyze attendee data to make your next event even better.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>FAQ (For Attendees)</AccordionTrigger>
                <AccordionContent>
                  Attendees can search for events by city, category, or date. Register instantly with your Google account or check out as a guest. Your digital tickets are stored safely in your profile, ready to be scanned at the venue.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

      </main>

      {/* 8. Newsletter Section (Pre-Footer) */}
      <section className="w-full bg-[#006782] py-12 px-8">
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
            <Button className="bg-[#111827] hover:bg-black text-white h-12 px-8 rounded-md font-semibold shrink-0">
              Subscribe
            </Button>
          </div>
        </div>
      </section>


      <LoginToCreateModal open={loginToCreateOpen} onClose={() => setLoginToCreateOpen(false)} />
    </div>
  );
}
