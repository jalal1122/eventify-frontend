"use client";

import { useEffect, useState } from "react";
import { organizerApi } from "@/lib/api";
import { type Event } from "@/types/event";
import { Loader2, Calendar, MoreVertical, Search, Plus, Eye, Edit, Trash2 } from "lucide-react";
import { formatShortDate } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function EventsManagerPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter States
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterLocationType, setFilterLocationType] = useState("All");
  const [filterTicketType, setFilterTicketType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  // Action State for Modals
  const [actionEvent, setActionEvent] = useState<{ id: string; title: string; action: "publish" | "delete" } | null>(null);

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

  const confirmAction = async () => {
    if (!actionEvent) return;
    try {
      if (actionEvent.action === "delete") {
        await eventsApi.delete(actionEvent.id);
        setEvents(prev => prev.filter(e => e._id !== actionEvent.id));
      } else if (actionEvent.action === "publish") {
        await eventsApi.updateStatus(actionEvent.id, "posted");
        setEvents(prev => prev.map(e => e._id === actionEvent.id ? { ...e, status: "posted" } : e));
      }
    } catch (error: any) {
      console.error(`Failed to ${actionEvent.action} event:`, error);
      alert(error?.response?.data?.message || `Failed to ${actionEvent.action} event. Please try again.`);
    } finally {
      setActionEvent(null);
    }
  };

  const filteredEvents = events.filter(e => {
    // Search Query
    if (searchQuery && (!e.title || !e.title.toLowerCase().includes(searchQuery.toLowerCase()))) return false;
    
    // Category Filter
    if (filterCategory !== "All" && e.category !== filterCategory) return false;

    // Location Type Filter (Mode)
    if (filterLocationType !== "All" && e.locationType !== filterLocationType) return false;

    // Status Filter
    if (filterStatus !== "All" && e.status !== filterStatus) return false;

    // Ticket Type Filter
    if (filterTicketType !== "All") {
      const hasPaid = e.tickets?.some(t => t.type === "PAID");
      const hasFree = e.tickets?.some(t => t.type === "FREE");
      if (filterTicketType === "PAID" && !hasPaid) return false;
      if (filterTicketType === "FREE" && !hasFree) return false;
    }

    return true;
  });

  // Extract unique categories from events to populate filter
  const uniqueCategories = Array.from(new Set(events.map(e => e.category).filter(Boolean))) as string[];

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
        <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="relative w-full lg:max-w-md">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Search events..." 
              className="pl-11 h-12 rounded-2xl bg-gray-50 border-gray-200 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <select 
              value={filterCategory} 
              onChange={e => setFilterCategory(e.target.value)}
              className="h-10 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white text-gray-700 outline-none hover:bg-gray-50 transition-colors"
            >
              <option value="All">All Categories</option>
              {uniqueCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>

            <select 
              value={filterLocationType} 
              onChange={e => setFilterLocationType(e.target.value)}
              className="h-10 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white text-gray-700 outline-none hover:bg-gray-50 transition-colors"
            >
              <option value="All">All Venue Types</option>
              <option value="VENUE">In Person</option>
              <option value="ONLINE">Online</option>
            </select>

            <select 
              value={filterTicketType} 
              onChange={e => setFilterTicketType(e.target.value)}
              className="h-10 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white text-gray-700 outline-none hover:bg-gray-50 transition-colors"
            >
              <option value="All">All Ticket Types</option>
              <option value="FREE">Free</option>
              <option value="PAID">Paid</option>
            </select>

            <select 
              value={filterStatus} 
              onChange={e => setFilterStatus(e.target.value)}
              className="h-10 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white text-gray-700 outline-none hover:bg-gray-50 transition-colors"
            >
              <option value="All">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="posted">Posted</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {(filterCategory !== "All" || filterLocationType !== "All" || filterTicketType !== "All" || filterStatus !== "All") && (
              <button 
                onClick={() => {
                  setFilterCategory("All");
                  setFilterLocationType("All");
                  setFilterTicketType("All");
                  setFilterStatus("All");
                }}
                className="h-10 px-3 text-sm text-red-500 hover:text-red-600 font-medium ml-auto lg:ml-0"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#006782]" />
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              No events found matching your filters.
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
                            <Link href={`/dashboard/events/${event._id}`} className="font-bold text-gray-900 text-base hover:text-[#006782] transition-colors line-clamp-1">
                              {event.title || "Untitled Event"}
                            </Link>
                            <span className="text-xs text-gray-500 font-medium">ID: {event._id.slice(-6).toUpperCase()}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className={`px-3 py-1 text-xs font-bold rounded-lg border ${
                          event.status === 'posted' ? 'bg-green-50 text-green-600 border-green-100' :
                          event.status === 'draft' ? 'bg-gray-100 text-gray-600 border-gray-200' :
                          event.status === 'completed' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                          'bg-orange-50 text-orange-600 border-orange-100'
                        }`}>
                          {event.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-6">
                        <p className="font-bold text-gray-900 text-sm">{event.dateTime ? formatShortDate(event.dateTime) : "Not Set"}</p>
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
                                <Link href={`/events/${event._id}`} className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer outline-none" target="_blank">
                                  <Eye size={16} className="text-gray-400" /> View Live
                                </Link>
                              </DropdownMenu.Item>
                              <DropdownMenu.Item asChild>
                                <Link href={`/dashboard/events/${event._id}`} className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer outline-none">
                                  <Calendar size={16} className="text-[#006782]" /> Dashboard
                                </Link>
                              </DropdownMenu.Item>
                              <DropdownMenu.Item asChild>
                                <Link href={`/events/${event._id}/edit`} className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer outline-none">
                                  <Edit size={16} className="text-gray-400" /> Edit Event
                                </Link>
                              </DropdownMenu.Item>
                              {event.status === "draft" && (
                                <DropdownMenu.Item asChild>
                                  <button onClick={() => setActionEvent({ id: event._id, title: event.title || "Untitled Event", action: "publish" })} className="w-full flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer outline-none">
                                    <span className="text-[#006782]">🚀</span> Publish Event
                                  </button>
                                </DropdownMenu.Item>
                              )}
                              <DropdownMenu.Separator className="h-px bg-gray-100 my-1" />
                              <DropdownMenu.Item asChild>
                                <button onClick={() => setActionEvent({ id: event._id, title: event.title || "Untitled Event", action: "delete" })} className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer outline-none">
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

      <Dialog open={!!actionEvent} onOpenChange={(open) => !open && setActionEvent(null)}>
        <DialogContent className="bg-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#001F29] text-xl">
              {actionEvent?.action === "publish" ? "Publish Event" : "Delete Event"}
            </DialogTitle>
            <DialogDescription className="pt-2 text-gray-600">
              {actionEvent?.action === "publish"
                ? `Are you sure you want to publish "${actionEvent?.title}"? It will become visible to the public.`
                : `Are you sure you want to delete "${actionEvent?.title}"? This action cannot be undone and all data will be permanently lost.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex gap-3 sm:justify-end">
            <Button variant="outline" className="rounded-xl border-gray-300" onClick={() => setActionEvent(null)}>
              Cancel
            </Button>
            <Button 
              className={`rounded-xl text-white ${actionEvent?.action === 'delete' ? 'bg-red-600 hover:bg-red-700' : 'bg-[#006782] hover:bg-[#004E63]'}`}
              onClick={confirmAction}
            >
              {actionEvent?.action === "publish" ? "Publish Event" : "Delete Event"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
