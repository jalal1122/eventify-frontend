"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { ArrowRight, Music, Laptop, Utensils, Briefcase, Palette, Dumbbell, HeartPulse, Sparkles } from "lucide-react";

// In a real app, this would come from a backend endpoint
const CATEGORIES_DATA = [
  { name: "Music", icon: Music, color: "bg-purple-100 text-purple-600", desc: "Concerts, festivals, and live performances." },
  { name: "Technology", icon: Laptop, color: "bg-blue-100 text-blue-600", desc: "Tech meetups, hackathons, and conferences." },
  { name: "Food & Drink", icon: Utensils, color: "bg-orange-100 text-orange-600", desc: "Food festivals, tastings, and pop-ups." },
  { name: "Business", icon: Briefcase, color: "bg-gray-100 text-gray-700", desc: "Networking, seminars, and corporate events." },
  { name: "Arts", icon: Palette, color: "bg-pink-100 text-pink-600", desc: "Exhibitions, theater, and creative workshops." },
  { name: "Sports", icon: Dumbbell, color: "bg-green-100 text-green-600", desc: "Matches, tournaments, and active meetups." },
  { name: "Health", icon: HeartPulse, color: "bg-red-100 text-red-600", desc: "Wellness retreats, yoga, and fitness classes." },
  { name: "Other", icon: Sparkles, color: "bg-yellow-100 text-yellow-600", desc: "Everything else amazing happening near you." },
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />
      
      <main className="flex-1 py-16 md:py-24">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="max-w-2xl mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4">Browse Categories</h1>
            <p className="text-lg text-gray-600">Find exactly what you're looking for by exploring our diverse range of event categories.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
            {CATEGORIES_DATA.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link key={cat.name} href={`/discover?category=${encodeURIComponent(cat.name)}`}>
                  <div className="group bg-white rounded-3xl p-8 border border-[#F3F4F6] hover:border-[#006782]/30 hover:shadow-lg transition-all duration-300 h-full flex flex-col cursor-pointer">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${cat.color} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={28} />
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#006782] transition-colors">{cat.name}</h3>
                    <p className="text-sm text-gray-500 flex-1">{cat.desc}</p>
                    
                    <div className="mt-6 flex items-center text-sm font-semibold text-[#006782] opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                      Explore events <ArrowRight size={16} className="ml-1" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
