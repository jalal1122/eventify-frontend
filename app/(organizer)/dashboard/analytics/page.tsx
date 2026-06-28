"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useOrganizer } from "@/context/OrganizerContext";
import { organizerApi } from "@/lib/api";
import { type Event } from "@/types/event";
import { Loader2, TrendingUp, Users, CalendarDays, ExternalLink, ArrowRight } from "lucide-react";
import { format } from "date-fns";

export default function AnalyticsHubPage() {
  const { activeProfileId } = useOrganizer();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({ totalEvents: 0, totalViews: 0, totalInterested: 0, totalRegistrations: 0 });
  const [events, setEvents] = useState<Event[]>([]);
  const [activeTab, setActiveTab] = useState("all"); // "all", "upcoming", "past"

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [metricsRes, eventsRes] = await Promise.all([
          organizerApi.getDashboardMetrics(activeProfileId || undefined),
          organizerApi.getMyEvents(activeProfileId || undefined)
        ]);

        if (metricsRes.data.success) {
          setMetrics(metricsRes.data.metrics);
        }
        if (eventsRes.data.success) {
          setEvents(eventsRes.data.events);
        }
      } catch (error) {
        console.error("Failed to fetch analytics data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeProfileId]);

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-full min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-[#006782]" />
      </div>
    );
  }

  const now = new Date();
  const filteredEvents = events.filter(e => {
    if (activeTab === "all") return true;
    if (!e.dateTime) return false;
    const isPast = new Date(e.dateTime) < now;
    if (activeTab === "upcoming") return !isPast;
    if (activeTab === "past") return isPast;
    return true;
  });

  return (
    <div className="p-8 max-w-[1400px] mx-auto min-h-screen bg-[#F8FAFC]">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Events Analytics</h1>
        <p className="text-gray-500 mt-2">Track the performance of all your events.</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Total Page Reach</p>
            <h3 className="text-3xl font-black text-gray-900">{metrics.totalViews.toLocaleString()}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <TrendingUp size={24} />
          </div>
        </div>
        <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Total Attendees</p>
            <h3 className="text-3xl font-black text-gray-900">{metrics.totalRegistrations.toLocaleString()}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
            <Users size={24} />
          </div>
        </div>
        <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Events Created</p>
            <h3 className="text-3xl font-black text-gray-900">{metrics.totalEvents.toLocaleString()}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
            <CalendarDays size={24} />
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden mb-8">
        <div className="border-b border-gray-100 px-6 py-4 flex items-center gap-6">
          <button 
            className={`pb-4 -mb-[17px] border-b-2 font-bold text-sm transition-colors ${activeTab === 'all' ? 'border-[#006782] text-[#006782]' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
            onClick={() => setActiveTab('all')}
          >
            All Events
          </button>
          <button 
            className={`pb-4 -mb-[17px] border-b-2 font-bold text-sm transition-colors ${activeTab === 'upcoming' ? 'border-[#006782] text-[#006782]' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming
          </button>
          <button 
            className={`pb-4 -mb-[17px] border-b-2 font-bold text-sm transition-colors ${activeTab === 'past' ? 'border-[#006782] text-[#006782]' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
            onClick={() => setActiveTab('past')}
          >
            Past
          </button>
        </div>

        <div className="p-0">
          {filteredEvents.length === 0 ? (
            <div className="p-8 text-center text-gray-500 font-medium">No events found.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredEvents.map(event => {
                // In a real scenario, we might want to fetch exact registrations per event if not in the event model
                // But we'll use interestedCount and capacityLimit for now to show the progress bar.
                const ticketsSold = event.remainingCapacity !== undefined && event.capacityLimit !== undefined 
                  ? event.capacityLimit - event.remainingCapacity 
                  : 0;
                const capacity = event.capacityLimit || 100;
                const progress = Math.min(100, Math.round((ticketsSold / capacity) * 100));

                return (
                  <div key={event._id} className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-lg">{event.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {event.dateTime ? format(new Date(event.dateTime), "MMM d, yyyy") : "TBD"} • {event.locationType === 'VENUE' ? event.city : 'Online'}
                      </p>
                    </div>

                    <div className="w-full md:w-64">
                      <div className="flex justify-between text-xs font-bold mb-2">
                        <span className="text-gray-500">Tickets Sold</span>
                        <span className="text-gray-900">{ticketsSold} / {capacity}</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#006782] rounded-full" style={{ width: `${progress}%` }}></div>
                      </div>
                    </div>

                    <div className="w-full md:w-32 flex flex-col items-end">
                      <span className="text-2xl font-black text-gray-900">{event.interestedCount || 0}</span>
                      <span className="text-xs font-bold text-gray-500 uppercase">Interested</span>
                    </div>

                    <div className="w-full md:w-auto mt-4 md:mt-0">
                      <Link 
                        href={`/dashboard/analytics/${event._id}`}
                        className="inline-flex items-center justify-center h-10 px-6 rounded-xl bg-gray-900 text-white font-bold text-sm hover:bg-gray-800 transition-colors"
                      >
                        View Analytics
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
