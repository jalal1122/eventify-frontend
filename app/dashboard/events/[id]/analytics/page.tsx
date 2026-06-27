"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { eventsApi } from "@/lib/api";
import { type Event } from "@/types/event";
import { Loader2, ArrowLeft, Download, TrendingUp, Users, Ticket, Activity, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EventAnalyticsPage() {
  const params = useParams();
  const eventId = params.id as string;
  const router = useRouter();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await eventsApi.getById(eventId);
        setEvent(res.data.event);
      } catch (err) {
        console.error("Failed to fetch event", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  if (loading) {
    return (
      <div className="min-h-[600px] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#006782]" />
      </div>
    );
  }

  if (!event) {
    return <div className="p-8">Event not found.</div>;
  }

  const ticketsSold = event.capacityLimit ? event.capacityLimit - (event.remainingCapacity || 0) : 0;
  const revenue = ticketsSold * (event.tickets?.[0]?.price || 0);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium mb-4 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Events
          </button>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Event Analytics</h1>
          <p className="text-gray-500 font-medium mt-1">{event.title}</p>
        </div>
        <Button className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl px-6 h-12 shadow-sm">
          <Download size={18} className="mr-2" /> Export Report
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-full -z-0 opacity-50" />
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mb-4">
              <TrendingUp size={24} />
            </div>
            <p className="text-gray-500 font-medium text-sm mb-1">Total Revenue</p>
            <h3 className="text-3xl font-black text-gray-900">PKR {revenue.toLocaleString()}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-0 opacity-50" />
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Ticket size={24} />
            </div>
            <p className="text-gray-500 font-medium text-sm mb-1">Tickets Sold</p>
            <h3 className="text-3xl font-black text-gray-900">{ticketsSold} <span className="text-sm font-medium text-gray-400">/ {event.capacityLimit || '∞'}</span></h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -z-0 opacity-50" />
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <Eye size={24} />
            </div>
            <p className="text-gray-500 font-medium text-sm mb-1">Page Views</p>
            <h3 className="text-3xl font-black text-gray-900">{event.viewsCount || 0}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full -z-0 opacity-50" />
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mb-4">
              <Activity size={24} />
            </div>
            <p className="text-gray-500 font-medium text-sm mb-1">Conversion Rate</p>
            <h3 className="text-3xl font-black text-gray-900">
              {event.viewsCount ? ((ticketsSold / event.viewsCount) * 100).toFixed(1) : 0}%
            </h3>
          </div>
        </div>
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-gray-900">Sales Over Time</h2>
            <div className="flex gap-2">
              <button className="px-4 py-1.5 text-xs font-bold rounded-full bg-[#006782] text-white">Daily</button>
              <button className="px-4 py-1.5 text-xs font-bold rounded-full text-gray-500 hover:bg-gray-50 border border-gray-200">Weekly</button>
            </div>
          </div>
          <div className="h-[300px] w-full flex items-end justify-between gap-2 px-2 pb-6 border-b border-gray-100 relative">
            {/* Mock Chart Bars */}
            {[40, 25, 60, 45, 80, 55, 90, 70, 100, 85, 40, 65, 80, 50].map((h, i) => (
              <div key={i} className="w-full bg-[#006782]/10 rounded-t-lg relative group transition-all hover:bg-[#006782]/20" style={{ height: \`\${h}%\` }}>
                <div className="absolute top-0 w-full bg-[#006782] rounded-t-lg transition-all" style={{ height: \`\${h * 0.7}%\` }} />
                
                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded-lg pointer-events-none transition-opacity whitespace-nowrap">
                  {h * 2} tickets
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs text-gray-400 font-medium px-2">
            <span>Day 1</span>
            <span>Day 7</span>
            <span>Day 14</span>
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-8">Traffic Sources</h2>
          
          <div className="flex justify-center mb-8 relative">
            {/* Simple CSS Donut Chart Mock */}
            <div className="w-48 h-48 rounded-full border-[16px] border-[#006782] relative flex items-center justify-center" 
                 style={{ borderRightColor: '#F97316', borderBottomColor: '#F97316', borderLeftColor: '#E2E8F0', transform: 'rotate(-45deg)' }}>
              <div className="transform rotate-45 text-center">
                <span className="block text-3xl font-black text-gray-900">12.5k</span>
                <span className="text-xs text-gray-500 font-medium">Total Visits</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#006782]" />
                <span className="text-sm font-bold text-gray-700">Direct</span>
              </div>
              <span className="text-sm font-bold text-gray-900">45%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#F97316]" />
                <span className="text-sm font-bold text-gray-700">Social Media</span>
              </div>
              <span className="text-sm font-bold text-gray-900">35%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-200" />
                <span className="text-sm font-bold text-gray-700">Referral</span>
              </div>
              <span className="text-sm font-bold text-gray-900">20%</span>
            </div>
          </div>
        </div>

      </div>

      {/* Attendee Demographics (Placeholder) */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Attendee Demographics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Age Group</h4>
            {[
              { label: "18-24", pct: 40 },
              { label: "25-34", pct: 35 },
              { label: "35-44", pct: 15 },
              { label: "45+", pct: 10 }
            ].map(d => (
              <div key={d.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-bold text-gray-700">{d.label}</span>
                  <span className="font-bold text-gray-900">{d.pct}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-[#006782] h-2 rounded-full" style={{ width: \`\${d.pct}%\` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="col-span-2 flex items-center justify-center bg-gray-50 rounded-2xl border border-gray-100 p-8 text-center text-gray-400">
            <div>
              <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="font-medium">Map visualization requires advanced integration.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
