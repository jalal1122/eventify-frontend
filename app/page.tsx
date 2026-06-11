"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Trophy, Monitor, Music, Briefcase, Palette, ChevronRight, Plus } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { EventCard } from "@/components/events/EventCard";
import { type Event } from "@/types/event";

// Mock data to match the screenshot layout
const categories = [
  { name: "Education", icon: BookOpen },
  { name: "Sports", icon: Trophy },
  { name: "Technology", icon: Monitor },
  { name: "Entertainment", icon: Music },
  { name: "Corporate", icon: Briefcase },
  { name: "Culture", icon: Palette },
];

const mockEvents: Event[] = [
  {
    _id: "1",
    title: "Margalla Trail...",
    organizerId: "org1",
    organizerProfileId: { _id: "org1", brandName: "AANT Becker", logoUrl: "" } as any,
    categoryId: "c1",
    category: "Education",
    type: "physical",
    venueName: "Secretariat forest",
    address: "Islamabad",
    city: "Islamabad",
    dateTime: "2024-04-26T10:00:00.000Z",
    timezone: "Asia/Karachi",
    isPaid: true,
    ticketPrice: 1500,
    status: "published",
    bannerUrl: "",
    cardImageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
  },
  {
    _id: "2",
    title: "Wealth Expo 2026",
    organizerId: "org2",
    organizerProfileId: { _id: "org2", brandName: "Finance Advisor", logoUrl: "" } as any,
    categoryId: "c2",
    category: "Technology",
    type: "virtual",
    venueName: "Online Webinar",
    address: "",
    city: "Online Webinar",
    dateTime: "2024-04-24T14:00:00.000Z",
    timezone: "Asia/Karachi",
    isPaid: false,
    ticketPrice: 0,
    status: "published",
    bannerUrl: "",
    cardImageUrl: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&q=80",
  },
  {
    _id: "3",
    title: "Peshawar Music...",
    organizerId: "org3",
    organizerProfileId: { _id: "org3", brandName: "Sound Line", logoUrl: "" } as any,
    categoryId: "c3",
    category: "Entertainment",
    type: "physical",
    venueName: "Hayatabad Park",
    address: "Peshawar",
    city: "Peshawar",
    dateTime: "2024-04-25T18:00:00.000Z",
    timezone: "Asia/Karachi",
    isPaid: true,
    ticketPrice: 500,
    status: "published",
    bannerUrl: "",
    cardImageUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80",
  },
  {
    _id: "4",
    title: "Karakoram Cycling",
    organizerId: "org4",
    organizerProfileId: { _id: "org4", brandName: "AdventurePK", logoUrl: "" } as any,
    categoryId: "c4",
    category: "Sports",
    type: "physical",
    venueName: "Gilgit",
    address: "Pakistan",
    city: "Gilgit",
    dateTime: "2024-04-26T06:00:00.000Z",
    timezone: "Asia/Karachi",
    isPaid: true,
    ticketPrice: 2000,
    status: "published",
    bannerUrl: "",
    cardImageUrl: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800&q=80",
  },
];

const cities = [
  { name: "Karachi", count: "120+ Events", img: "https://images.unsplash.com/photo-1620619741029-d576a92f03c0?w=800&q=80" },
  { name: "Lahore", count: "95+ Events", img: "https://images.unsplash.com/photo-1586015555655-bd35d10d65b7?w=800&q=80" },
  { name: "Islamabad", count: "80+ Events", img: "https://images.unsplash.com/photo-1582294437463-228fc4a2b270?w=800&q=80" },
  { name: "Peshawar", count: "45+ Events", img: "https://images.unsplash.com/photo-1626014493390-349f2b84eb44?w=800&q=80" },
  { name: "Quetta", count: "30+ Events", img: "https://images.unsplash.com/photo-1601362624564-9602fa9bc5e5?w=800&q=80" },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />
      
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
              <Button className="w-fit bg-white text-[#006782] hover:bg-gray-100 rounded-full px-6 py-6 text-base font-semibold shadow-lg">
                Create Event <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* 2. Browse by Category */}
        <section className="max-w-[1280px] mx-auto px-8 mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Browse by Category</h2>
            <Link href="/categories" className="text-sm font-semibold text-[#006782] hover:underline">
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
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <h2 className="text-2xl font-bold text-gray-900">Most Popular Upcoming Events</h2>
              <TabsList className="bg-transparent gap-2 h-auto">
                <TabsTrigger value="all" className="rounded-none shadow-none px-4 py-2 border-b-2 border-transparent data-[state=active]:border-[#006782] data-[state=active]:shadow-none data-[state=active]:bg-transparent">All</TabsTrigger>
                <TabsTrigger value="today" className="rounded-none shadow-none px-4 py-2 border-b-2 border-transparent data-[state=active]:border-[#006782] data-[state=active]:shadow-none data-[state=active]:bg-transparent">Today</TabsTrigger>
                <TabsTrigger value="week" className="rounded-none shadow-none px-4 py-2 border-b-2 border-transparent data-[state=active]:border-[#006782] data-[state=active]:shadow-none data-[state=active]:bg-transparent">This Week</TabsTrigger>
                <TabsTrigger value="month" className="rounded-none shadow-none px-4 py-2 border-b-2 border-transparent data-[state=active]:border-[#006782] data-[state=active]:shadow-none data-[state=active]:bg-transparent">This Month</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {mockEvents.map((event) => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
              <div className="flex justify-center mt-10">
                <Button className="bg-[#006782] hover:bg-[#004E63] text-white rounded-full px-8 py-6 text-base shadow-md">
                  View all Events
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* 4. Trending in Top Cities */}
        <section className="max-w-[1280px] mx-auto px-8 mb-24">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Trending in Top Cities</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 h-[320px]">
            {cities.map((city, i) => (
              <div key={i} className="relative rounded-3xl overflow-hidden group cursor-pointer border border-[#F3F4F6] shadow-sm">
                <img src={city.img} alt={city.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 text-left">
                  <h3 className="text-xl font-bold text-white mb-1">{city.name}</h3>
                  <p className="text-sm text-gray-300">{city.count}</p>
                </div>
              </div>
            ))}
          </div>
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
                <Button className="bg-white text-[#006782] hover:bg-gray-100 rounded-full px-6 py-6 text-base font-semibold shadow-md">
                  Create an Event <Plus className="ml-2 w-5 h-5" />
                </Button>
                <Button variant="outline" className="border-white text-[#006782] hover:bg-white hover:text-[#006782] rounded-full px-6 py-6 text-base font-semibold">
                  Learn More
                </Button>
              </div>
            </div>
            {/* Right side graphic mockup */}
            <div className="w-full md:w-[45%] h-[300px] md:h-auto relative bg-[#004E63]">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-2xl flex flex-col">
                <div className="w-full h-8 flex gap-2 border-b border-white/10 pb-2 mb-4">
                  <div className="w-full h-full bg-white/20 rounded" />
                  <div className="w-1/2 h-full bg-white/20 rounded" />
                </div>
                <div className="flex-1 flex items-end gap-2 px-4 pb-4">
                   <div className="w-full bg-blue-400 h-[30%] rounded-t-sm" />
                   <div className="w-full bg-[#006782] h-[70%] rounded-t-sm" />
                   <div className="w-full bg-blue-300 h-[50%] rounded-t-sm" />
                   <div className="w-full bg-[#006782] h-[90%] rounded-t-sm" />
                   <div className="w-full bg-blue-400 h-[60%] rounded-t-sm" />
                </div>
              </div>
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

      <Footer />
    </div>
  );
}
