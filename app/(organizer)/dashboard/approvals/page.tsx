"use client";

import { useEffect, useState } from "react";
import { organizerApi } from "@/lib/api";
import { type Event } from "@/types/event";
import { Loader2, UserCheck, Calendar, ArrowRight, CheckCircle2 } from "lucide-react";
import { formatShortDate } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ApprovalsHubPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await organizerApi.getMyEvents();
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
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Attendee Approvals</h1>
        <p className="text-gray-500 font-medium text-lg">Select an active event to review pending registrations and verify payment receipts.</p>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-900">Live & Upcoming Events</h2>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#006782]" />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 text-gray-500 font-medium">
            No events found.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {events.map((event) => {
              const pendingCount = event.pendingApprovalsCount || 0;
              const hasPending = pendingCount > 0;

              return (
                <div key={event._id} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-6 flex-1">
                    <div className="w-16 h-16 rounded-2xl bg-[#006782] shrink-0 flex items-center justify-center text-white overflow-hidden shadow-inner">
                      {event.cardImageUrl ? (
                        <img src={event.cardImageUrl} alt={event.title} className="w-full h-full object-cover" />
                      ) : (
                        <Calendar size={28} />
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-bold text-gray-900 text-xl mb-1.5">{event.title}</h3>
                      <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                          Live
                        </Badge>
                        <span>{formatShortDate(event.dateTime)}</span>
                        <span>•</span>
                        <span>{event.city || 'Virtual Event'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 w-full md:w-auto">
                    {hasPending ? (
                      <div className="px-4 py-2 bg-orange-50 border border-orange-200 rounded-xl text-orange-700 text-sm font-bold flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                        {pendingCount} Pending Approvals
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm px-4 py-2">
                        <CheckCircle2 size={18} />
                        All caught up
                      </div>
                    )}
                    
                    <Link href={`/dashboard/approvals/${event._id}`}>
                      <Button className={hasPending ? "bg-[#006782] hover:bg-[#00556b] text-white rounded-xl px-6 h-11 shadow-sm" : "bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl px-6 h-11"}>
                        {hasPending ? "Review" : "View List"}
                        {hasPending && <ArrowRight size={16} className="ml-2" />}
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
