"use client";

import { useEffect, useState } from "react";
import { eventsApi } from "@/lib/api";
import { type Event } from "@/types/event";
import { Loader2, Calendar, MoreVertical, Search, Filter, Plus, Eye, BarChart3, Edit, Trash2 } from "lucide-react";
import { formatShortDate } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export default function EventsManagerPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Again, assuming discover can fetch our events or we just show a list
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

  const filteredEvents = events.filter(e => e.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Events Manager</h1>
          <p className="text-gray-500 font-medium mt-1">Manage your upcoming and past events.</p>
        </div>
        <Link href="/events/create">
          <Button className="bg-[#006782] hover:bg-[#004E63] text-white rounded-full px-6 shadow-md h-12 text-base font-bold">
            <Plus size={20} className="mr-2" /> Create New Event
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Search events..." 
              className="pl-11 h-12 rounded-2xl bg-gray-50 border-gray-200 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="rounded-xl border-gray-200 text-gray-700 h-12 px-6 w-full sm:w-auto">
            <Filter size={18} className="mr-2" /> Filter
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#006782]" />
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              No events found matching your search.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 font-bold uppercase tracking-wider">
                  <th className="p-6 font-bold">Event Details</th>
                  <th className="p-6 font-bold">Status</th>
                  <th className="p-6 font-bold">Date & Location</th>
                  <th className="p-6 font-bold text-right">Tickets Sold</th>
                  <th className="p-6 font-bold text-right">Revenue</th>
                  <th className="p-6 font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEvents.map((event) => {
                  const ticketsSold = event.capacityLimit ? event.capacityLimit - (event.remainingCapacity || 0) : 0;
                  // Mock revenue
                  const revenue = ticketsSold * (event.tickets?.[0]?.price || 500);

                  return (
                    <tr key={event._id} className="hover:bg-gray-50 transition-colors group">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                            {event.cardImageUrl ? (
                              <img src={event.cardImageUrl} alt={event.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <Calendar size={24} />
                              </div>
                            )}
                          </div>
                          <div>
                            <Link href={\`/events/\${event._id}\`} className="font-bold text-gray-900 text-base hover:text-[#006782] transition-colors line-clamp-1">
                              {event.title}
                            </Link>
                            <span className="text-xs text-gray-500 font-medium">ID: {event._id.slice(-6).toUpperCase()}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className={\`px-3 py-1 text-xs font-bold rounded-lg border \${
                          event.status === 'published' || event.status === 'posted' ? 'bg-green-50 text-green-600 border-green-100' :
                          event.status === 'draft' ? 'bg-gray-100 text-gray-600 border-gray-200' :
                          'bg-orange-50 text-orange-600 border-orange-100'
                        }\`}>
                          {event.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-6">
                        <p className="font-bold text-gray-900 text-sm">{formatShortDate(event.dateTime)}</p>
                        <p className="text-xs text-gray-500 truncate max-w-[150px]">{event.venueName || "Online"}</p>
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex flex-col items-end">
                          <span className="font-bold text-gray-900 text-sm">{ticketsSold}</span>
                          <span className="text-xs text-gray-500">/ {event.capacityLimit || '∞'}</span>
                        </div>
                      </td>
                      <td className="p-6 text-right">
                        <span className="font-bold text-[#006782]">PKR {revenue.toLocaleString()}</span>
                      </td>
                      <td className="p-6 text-center">
                        <DropdownMenu.Root>
                          <DropdownMenu.Trigger asChild>
                            <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors outline-none">
                              <MoreVertical size={20} />
                            </button>
                          </DropdownMenu.Trigger>
                          <DropdownMenu.Portal>
                            <DropdownMenu.Content align="end" className="w-48 bg-white rounded-xl shadow-lg border border-gray-100 p-2 z-50 text-sm">
                              <DropdownMenu.Item asChild>
                                <Link href={\`/events/\${event._id}\`} className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer outline-none">
                                  <Eye size={16} className="text-gray-400" /> View Live
                                </Link>
                              </DropdownMenu.Item>
                              <DropdownMenu.Item asChild>
                                <Link href={\`/dashboard/events/\${event._id}/analytics\`} className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer outline-none">
                                  <BarChart3 size={16} className="text-[#006782]" /> Analytics
                                </Link>
                              </DropdownMenu.Item>
                              <DropdownMenu.Item asChild>
                                <Link href={\`/events/create?edit=\${event._id}\`} className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer outline-none">
                                  <Edit size={16} className="text-gray-400" /> Edit Event
                                </Link>
                              </DropdownMenu.Item>
                              <DropdownMenu.Separator className="h-px bg-gray-100 my-1" />
                              <DropdownMenu.Item asChild>
                                <button className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer outline-none">
                                  <Trash2 size={16} className="text-red-500" /> Delete
                                </button>
                              </DropdownMenu.Item>
                            </DropdownMenu.Content>
                          </DropdownMenu.Portal>
                        </DropdownMenu.Root>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
