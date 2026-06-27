"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { useEffect, useState } from "react";
import { eventsApi } from "@/lib/api";
import { MapPin, ArrowRight } from "lucide-react";

export default function CitiesPage() {
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await eventsApi.getCities();
        setCities(res.data.cities);
      } catch (err) {
        console.error("Failed to load cities", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCities();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />
      
      <main className="flex-1 py-16 md:py-24">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="max-w-2xl mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4">Popular Cities</h1>
            <p className="text-lg text-gray-600">Discover incredible events happening in top cities across the region.</p>
          </div>

          {loading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded-3xl animate-pulse" />
                ))}
             </div>
          ) : cities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-slide-up">
              {cities.map((city) => (
                <Link key={city} href={`/cities/${encodeURIComponent(city.toLowerCase())}`}>
                  <div className="group relative bg-white rounded-3xl p-6 overflow-hidden border border-[#F3F4F6] hover:shadow-lg transition-all duration-300">
                    {/* Decorative gradient blob */}
                    <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#006782]/5 rounded-full blur-2xl group-hover:bg-[#006782]/10 transition-colors" />
                    
                    <div className="flex items-center gap-4 relative z-10">
                      <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-[#006782] group-hover:bg-[#006782] group-hover:text-white transition-colors duration-300">
                        <MapPin size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-gray-900 truncate">{city}</h3>
                        <p className="text-sm text-gray-500 mt-1 flex items-center group-hover:text-[#006782] transition-colors">
                          View events <ArrowRight size={14} className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-[#F3F4F6]">
              <p className="text-gray-500">No cities with active events found right now.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
