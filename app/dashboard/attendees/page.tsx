"use client";

import { useEffect, useState } from "react";
import { eventsApi, organizerApi, registrationsApi } from "@/lib/api";
import { type Event } from "@/types/event";
import { type Registration } from "@/types/api";
import { Loader2, Search, CheckCircle, Clock, Download, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as Select from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";

export default function AttendeesPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [attendees, setAttendees] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [verifying, setVerifying] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await eventsApi.discover();
        if (res.data.success && res.data.events.length > 0) {
          setEvents(res.data.events);
          setSelectedEventId(res.data.events[0]._id);
        }
      } catch (error) {
        console.error("Failed to fetch events", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    if (!selectedEventId) return;
    const fetchAttendees = async () => {
      try {
        const res = await organizerApi.getEventAttendees(selectedEventId);
        if (res.data.success) {
          // Only show approved attendees for the guest list
          setAttendees(res.data.attendees.filter((r: Registration) => r.status === "approved"));
        }
      } catch (error) {
        console.error("Failed to fetch attendees", error);
      }
    };
    fetchAttendees();
  }, [selectedEventId]);

  const handleManualCheckIn = async (ticketCode: string) => {
    try {
      setVerifying(ticketCode);
      const res = await registrationsApi.verifyQr(ticketCode);
      if (res.data.success) {
        // Update local state to mark as checked in
        setAttendees(prev => prev.map(a => a.ticketCode === ticketCode ? { ...a, checkedIn: true } : a));
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Check-in failed");
    } finally {
      setVerifying(null);
    }
  };

  const filteredAttendees = attendees.filter(r => {
    const name = r.guestDetails?.name || (r.userId as any)?.name || "";
    const email = r.guestDetails?.email || (r.userId as any)?.email || "";
    const ticketCode = r.ticketCode || "";
    const q = searchQuery.toLowerCase();
    return name.toLowerCase().includes(q) || email.toLowerCase().includes(q) || ticketCode.toLowerCase().includes(q);
  });

  const checkedInCount = attendees.filter(a => a.checkedIn).length;

  if (loading) {
    return (
      <div className="min-h-[600px] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#006782]" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Attendees</h1>
          <p className="text-gray-500 font-medium mt-1">Manage guest lists and manual check-ins.</p>
        </div>
        
        {events.length > 0 && (
          <Select.Root value={selectedEventId} onValueChange={setSelectedEventId}>
            <Select.Trigger className="inline-flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 outline-none w-full md:w-64 shadow-sm">
              <Select.Value />
              <Select.Icon>
                <ChevronDown size={16} className="text-gray-400" />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                <Select.Viewport className="p-1">
                  {events.map((e) => (
                    <Select.Item key={e._id} value={e._id} className="relative flex items-center px-8 py-2 text-sm font-semibold text-gray-700 rounded-lg outline-none cursor-pointer hover:bg-gray-50 focus:bg-[#006782] focus:text-white">
                      <Select.ItemText>{e.title}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        )}
      </div>

      {!selectedEventId ? (
        <div className="text-center py-20 bg-white rounded-[2rem] border border-gray-100 shadow-sm text-gray-500">
          No events available.
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/50">
            <div className="flex items-center gap-6 w-full sm:w-auto">
              <div className="relative w-full sm:w-80">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input 
                  placeholder="Search name, email, or ticket code..." 
                  className="pl-11 h-12 rounded-2xl bg-white border-gray-200 w-full shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="hidden md:flex flex-col">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Checked In</span>
                <span className="text-lg font-black text-gray-900">{checkedInCount} <span className="text-sm font-medium text-gray-500">/ {attendees.length}</span></span>
              </div>
            </div>
            
            <Button variant="outline" className="rounded-xl border-gray-200 text-gray-700 h-12 px-6 shadow-sm w-full sm:w-auto bg-white">
              <Download size={18} className="mr-2" /> Export CSV
            </Button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-100 text-xs text-gray-500 font-bold uppercase tracking-wider">
                  <th className="p-6 font-bold">Attendee Info</th>
                  <th className="p-6 font-bold">Ticket Code</th>
                  <th className="p-6 font-bold">Status</th>
                  <th className="p-6 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAttendees.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-20 text-center text-gray-500 font-medium">
                      No attendees found.
                    </td>
                  </tr>
                ) : (
                  filteredAttendees.map((attendee) => {
                    const name = attendee.guestDetails?.name || (attendee.userId as any)?.name || "Unknown";
                    const email = attendee.guestDetails?.email || (attendee.userId as any)?.email || "Unknown";
                    const isCheckedIn = attendee.checkedIn;

                    return (
                      <tr key={attendee._id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#006782]/10 text-[#006782] flex items-center justify-center font-bold shrink-0">
                              {name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 text-sm">{name}</p>
                              <p className="text-xs text-gray-500">{email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-6">
                          <code className="px-2 py-1 bg-gray-100 rounded text-xs font-mono text-gray-700">
                            {attendee.ticketCode}
                          </code>
                        </td>
                        <td className="p-6">
                          {isCheckedIn ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg bg-green-50 text-green-600 border border-green-100">
                              <CheckCircle size={14} /> Checked In
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg bg-gray-100 text-gray-600 border border-gray-200">
                              <Clock size={14} /> Pending Arrival
                            </span>
                          )}
                        </td>
                        <td className="p-6 text-right">
                          <Button 
                            disabled={isCheckedIn || verifying === attendee.ticketCode}
                            onClick={() => handleManualCheckIn(attendee.ticketCode!)}
                            className={\`rounded-xl px-6 h-10 \${
                              isCheckedIn 
                                ? "bg-gray-100 text-gray-400" 
                                : "bg-[#006782] hover:bg-[#004E63] text-white shadow-md"
                            }\`}
                          >
                            {verifying === attendee.ticketCode ? (
                              <Loader2 className="animate-spin w-4 h-4" />
                            ) : isCheckedIn ? (
                              "Checked In"
                            ) : (
                              <>
                                <QrCode size={16} className="mr-2" />
                                Manual Check-in
                              </>
                            )}
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
