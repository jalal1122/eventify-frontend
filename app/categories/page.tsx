"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, GraduationCap, Monitor, Trophy, Gamepad2, Briefcase, Palette, Dumbbell, Utensils, Users, BriefcaseBusiness, Music, Code } from "lucide-react";

import { useEffect, useState } from "react";
import { eventsApi } from "@/lib/api";

const ICON_MAP: Record<string, any> = {
  "Education": GraduationCap,
  "Technology": Monitor,
  "Sports": Trophy,
  "Entertainment": Gamepad2,
  "Corporate": Briefcase,
  "Culture & Arts": Palette,
  "Health & Wellness": Dumbbell,
  "Food & Drink": Utensils,
  "Community": Users,
  "Career Fairs": BriefcaseBusiness,
  "Music & Concerts": Music,
  "Hackathons": Code,
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<{name: string, count: string, icon: any}[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await eventsApi.getCategories();
        if (res.data.success) {
          const fetchedCategories = res.data.categories.map((cat: string) => ({
            name: cat,
            count: "10+ Events", // Real counts can be added in backend later
            icon: ICON_MAP[cat] || GraduationCap
          }));
          setCategories(fetchedCategories);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />
      
      <main className="flex-1 pb-24">
        
        {/* Header Banner */}
        <div className="bg-[#006782] pt-20 pb-28 px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Browse All Categories</h1>
          <p className="text-white/80 max-w-2xl mx-auto text-sm md:text-base">
            Discover thousands of events, workshops, and meetups tailored to your interests. From tech summits to cultural festivals, find your next experience.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="max-w-[1280px] mx-auto px-8 -mt-16">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-24">
            {categories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <div key={i} className="bg-white rounded-3xl p-8 flex flex-col items-center text-center shadow-sm border border-[#F3F4F6] hover:shadow-md hover:border-[#006782]/30 transition-all cursor-pointer">
                  <div className="w-14 h-14 rounded-full bg-[#E6F0F3] text-[#006782] flex items-center justify-center mb-6">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{cat.name}</h3>
                  <p className="text-sm text-gray-500">{cat.count}</p>
                </div>
              );
            })}
          </div>

          {/* Host CTA Banner */}
          <div className="bg-[#EBEBEB] rounded-[2rem] overflow-hidden flex flex-col lg:flex-row relative">
            <div className="flex-1 p-12 md:p-16 flex flex-col justify-center relative z-10">
              <span className="bg-[#BAEAFF] text-[#006782] text-xs font-bold px-4 py-1.5 rounded-full w-fit uppercase tracking-wider mb-6">
                Trending Now
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                Host your own event and reach thousands.
              </h2>
              <p className="text-gray-600 mb-8 max-w-md text-sm leading-relaxed">
                From private workshops to global summits, Eventify provides all the tools you need to build, manage, and scale your audience.
              </p>
              <Button className="w-fit bg-[#004E63] hover:bg-[#003B4C] text-white rounded-md px-6 py-6 text-sm font-semibold shadow-md">
                Get Started Today <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
            {/* Right side graphic mockup */}
            <div className="w-full lg:w-[50%] h-[300px] lg:h-auto relative p-8">
              <img 
                src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80" 
                alt="Auditorium stage" 
                className="w-full h-full object-cover rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>

      </main>

      {/* Newsletter Section */}
      <section className="w-full bg-[#006782] py-12 px-8">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-white max-w-xl">
            <h3 className="text-2xl font-bold mb-2">Best of Peshawar Events in Your Inbox</h3>
            <p className="text-sm text-white/80">
              Don't miss your favorite concert again. We deliver best of the city happenings and hand-picked content for you every week. Subscribe to the weekly email newsletter for Peshawar!
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
