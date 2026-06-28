"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { organizerApi, eventsApi } from "@/lib/api";
import { type Event } from "@/types/event";
import { Loader2, ArrowLeft, Ticket, Eye, Star, Calendar } from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import { format } from "date-fns";

export default function EventAnalyticsPage() {
  const params = useParams();
  const eventId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<Event | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    if (!eventId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [eventRes, analyticsRes] = await Promise.all([
          eventsApi.getById(eventId),
          organizerApi.getEventAnalytics(eventId)
        ]);

        if (eventRes.data.success) {
          setEvent(eventRes.data.event);
        }
        if (analyticsRes.data.success) {
          setAnalytics(analyticsRes.data.analytics);
        }
      } catch (error) {
        console.error("Failed to fetch analytics data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId]);

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-full min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-[#006782]" />
      </div>
    );
  }

  if (!event || !analytics) {
    return (
      <div className="p-8 text-center text-gray-500 min-h-[60vh] flex items-center justify-center">
        Event analytics not found.
      </div>
    );
  }

  // Calculate totals from timeSeriesData for traffic sources
  const totalDiscovery = analytics.timeSeriesData.reduce((acc: number, curr: any) => acc + curr.sources.discoveryFeed, 0);
  const totalDirect = analytics.timeSeriesData.reduce((acc: number, curr: any) => acc + curr.sources.directLink, 0);
  const totalSearch = analytics.timeSeriesData.reduce((acc: number, curr: any) => acc + curr.sources.search, 0);
  const totalOther = analytics.timeSeriesData.reduce((acc: number, curr: any) => acc + curr.sources.other, 0);

  const trafficData = [
    { name: "Discovery Feed", value: totalDiscovery, fill: "#006782" },
    { name: "Direct Link", value: totalDirect, fill: "#14B8A6" },
    { name: "Search", value: totalSearch, fill: "#F59E0B" },
    { name: "Other", value: totalOther, fill: "#9CA3AF" },
  ].sort((a, b) => b.value - a.value);

  const COLORS = ['#006782', '#14B8A6', '#F59E0B', '#9CA3AF'];

  return (
    <div className="p-8 max-w-[1400px] mx-auto min-h-screen bg-[#F8FAFC]">
      <div className="mb-8">
        <Link href="/dashboard/analytics" className="inline-flex items-center text-[#006782] hover:text-[#004e63] font-medium text-sm mb-4 transition-colors">
          <ArrowLeft size={16} className="mr-1" /> Back to Analytics Hub
        </Link>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">EVENTS &gt; ANALYTICS / {event.title}</p>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Event Analytics</h1>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Tickets Sold</p>
            <div className="flex items-end gap-2">
              <h3 className="text-3xl font-black text-gray-900">{analytics.ticketsSold}</h3>
              <span className="text-sm font-bold text-gray-400 mb-1">/ {analytics.capacity}</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#006782]/10 flex items-center justify-center text-[#006782]">
            <Ticket size={24} />
          </div>
        </div>
        <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total Reach</p>
            <h3 className="text-3xl font-black text-gray-900">{analytics.totalReach}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <Eye size={24} />
          </div>
        </div>
        <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Interested</p>
            <h3 className="text-3xl font-black text-gray-900">{analytics.interested}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
            <Star size={24} />
          </div>
        </div>
        <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Added to Calendar</p>
            <h3 className="text-3xl font-black text-gray-900">{analytics.addedToCalendar}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
            <Calendar size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Traffic Sources Chart */}
        <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-black text-gray-900 mb-6">How attendees are finding your event</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trafficData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 'bold' }} width={120} />
                <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Funnel */}
        <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-black text-gray-900 mb-6">Attendee Conversion Funnel</h3>
          <div className="flex flex-col gap-4">
            <div className="flex items-center">
              <div className="w-full bg-[#006782]/10 rounded-xl p-4 flex items-center justify-between border border-[#006782]/20">
                <span className="font-bold text-[#006782]">Views</span>
                <span className="font-black text-xl text-[#006782]">{analytics.totalReach}</span>
              </div>
            </div>
            <div className="flex items-center pl-8">
              <div className="w-full bg-orange-50 rounded-xl p-4 flex items-center justify-between border border-orange-100">
                <span className="font-bold text-orange-600">Interested</span>
                <span className="font-black text-xl text-orange-600">{analytics.interested}</span>
              </div>
            </div>
            <div className="flex items-center pl-16">
              <div className="w-full bg-green-50 rounded-xl p-4 flex items-center justify-between border border-green-100">
                <span className="font-bold text-green-600">Tickets Sold</span>
                <span className="font-black text-xl text-green-600">{analytics.ticketsSold}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Line Chart */}
        <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm lg:col-span-2">
          <h3 className="text-lg font-black text-gray-900 mb-6">Weekly Page Reach Trend</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.timeSeriesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#006782" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#006782" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tickFormatter={(val) => format(new Date(val), 'MMM d')}
                  tick={{ fill: '#9CA3AF', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9CA3AF', fontSize: 12 }} 
                />
                <Tooltip 
                  labelFormatter={(val) => format(new Date(val), 'MMMM d, yyyy')}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="views" stroke="#006782" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* View Distribution Pie */}
        <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-black text-gray-900 mb-6">View Distribution</h3>
          <div className="h-[220px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trafficData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {trafficData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
              <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Total Views</span>
              <span className="text-2xl font-black text-gray-900">{analytics.totalReach}</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-y-3">
            {trafficData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="text-xs font-bold text-gray-600">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
