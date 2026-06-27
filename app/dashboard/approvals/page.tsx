"use client";

import { useEffect, useState } from "react";
import { eventsApi } from "@/lib/api";
import { type Event } from "@/types/event";
import { Loader2, UserCheck, Calendar } from "lucide-react";
import { formatShortDate } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ApprovalsHubPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await eventsApi.discover();
        if (res.data.success) {
          setEvents(res.data.events);
        }
      } catch (error) {
        console.error("Failed to fetch events", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Attendee Approvals Hub</h1>
        <p className="text-gray-500 font-medium mt-1">Review and manage registration requests for your events.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#006782]" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[2rem] border border-gray-100 shadow-sm text-gray-500">
          No events found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Link key={event._id} href={\`/dashboard/approvals/\${event._id}\`}>
              <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer group">
                <div className="w-full h-40 bg-gray-100 rounded-xl mb-4 overflow-hidden relative">
                  {event.cardImageUrl ? (
                    <img src={event.cardImageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-[#006782]/5">
                      <Calendar size={32} />
                    </div>
                  )}
                  {/* Badge for Pending Count (mocked for now) */}
                  <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                    <UserCheck size={14} /> Needs Review
                  </div>
                </div>
                
                <h3 className="font-bold text-gray-900 text-lg line-clamp-1 mb-1 group-hover:text-[#006782] transition-colors">{event.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{formatShortDate(event.dateTime)}</p>
                
                <Button className="w-full bg-[#006782]/10 text-[#006782] hover:bg-[#006782]/20 rounded-xl font-bold">
                  View Approvals
                </Button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
