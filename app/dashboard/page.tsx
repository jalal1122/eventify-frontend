"use client";

import { useEffect, useState } from "react";
import { eventsApi } from "@/lib/api";
import { type Event } from "@/types/event";
import { Loader2, TrendingUp, Users, Ticket, Eye, ArrowUpRight } from "lucide-react";
import { formatShortDate } from "@/lib/utils";
import Link from "next/link";

export default function DashboardOverview() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ideally, we'd have a specific /api/organizer/dashboard endpoint
    // For now, we'll fetch the organizer's events. Assuming /api/events/discover with a filter works
    // or we fetch all and calculate. In a real scenario, the backend should aggregate these metrics.
    const fetchDashboardData = async () => {
      try {
        // Mocking dashboard data fetch by just getting recent events for now
        // In real impl, we need an endpoint that returns exactly the organizer's events
        const res = await eventsApi.discover({ limit: 5 }); 
        if (res.data.success) {
          setEvents(res.data.events);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#006782]" />
      </div>
    );
  }

  // Mock aggregated metrics
  const metrics = [
    { label: "Total Revenue", value: "PKR 124,500", increase: "+14.5%", icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
    { label: "Tickets Sold", value: "842", increase: "+5.2%", icon: Ticket, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Views", value: "12.5k", increase: "+22.1%", icon: Eye, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Active Attendees", value: "1,204", increase: "+8.4%", icon: Users, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Welcome back, Organizer!</h1>
        <p className="text-gray-500 font-medium mt-1">Here's what's happening with your events today.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={\`w-12 h-12 rounded-2xl flex items-center justify-center \${metric.bg} \${metric.color}\`}>
                <metric.icon size={24} />
              </div>
              <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                <ArrowUpRight size={14} className="mr-1" /> {metric.increase}
              </span>
            </div>
            <p className="text-gray-500 font-medium text-sm mb-1">{metric.label}</p>
            <h3 className="text-3xl font-black text-gray-900">{metric.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Area (Placeholder) */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Revenue Overview</h2>
            <select className="bg-gray-50 border border-gray-200 text-sm font-semibold rounded-xl px-4 py-2 outline-none">
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-64 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center text-gray-400 font-medium">
            [Chart Visualization would go here]
          </div>
        </div>

        {/* Recent Events List */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Events</h2>
            <Link href="/dashboard/events" className="text-sm font-bold text-[#006782] hover:underline">
              View All
            </Link>
          </div>
          
          <div className="flex-1 space-y-4">
            {events.length === 0 ? (
              <div className="text-center py-10 text-gray-500 text-sm">No recent events found.</div>
            ) : (
              events.slice(0, 4).map(event => (
                <div key={event._id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                  <div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                    {event.cardImageUrl ? (
                      <img src={event.cardImageUrl} alt={event.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-[#006782]/10 flex items-center justify-center">
                        <Calendar size={20} className="text-[#006782]" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 text-sm truncate">{event.title}</h4>
                    <p className="text-xs text-gray-500 truncate">{formatShortDate(event.dateTime)}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">Active</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
