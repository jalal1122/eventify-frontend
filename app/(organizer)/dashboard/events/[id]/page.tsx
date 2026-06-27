"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { organizerApi, eventsApi } from "@/lib/api";
import { type Event } from "@/types/event";
import { Loader2, ArrowLeft, Search, Download, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

export default function EventDashboardPage() {
  const params = useParams();
  const eventId = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [attendees, setAttendees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    if (!eventId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [eventRes, attendeesRes] = await Promise.all([
          eventsApi.getById(eventId),
          organizerApi.getEventAttendees(eventId)
        ]);

        if (eventRes.data.success) {
          setEvent(eventRes.data.event);
        }
        if (attendeesRes.data.success) {
          setAttendees(attendeesRes.data.attendees);
        }
      } catch (error) {
        console.error("Failed to fetch event data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId]);

  const handleExportCSV = () => {
    if (filteredAttendees.length === 0) return;

    const headers = ["Attendee Name", "Email", "Ticket ID", "Status", "Ticket Type", "Registration Date"];
    const rows = filteredAttendees.map(att => {
      const name = att.guestDetails?.name || att.userId?.name || "N/A";
      const email = att.guestDetails?.email || att.userId?.email || "N/A";
      const ticketId = att.ticketCode || "N/A";
      const status = att.paymentStatus === 'pending_review' ? 'Pending' : att.paymentStatus === 'approved' ? 'Approved' : att.paymentStatus === 'rejected' ? 'Rejected' : att.status === 'cancelled' ? 'Cancelled' : 'Free';
      const ticketType = att.paymentStatus === 'free' ? 'Free Pass' : 'Paid Ticket';
      const date = att.createdAt ? format(new Date(att.createdAt), "MMM d, yyyy") : "N/A";
      
      return [name, email, ticketId, status, ticketType, date].map(val => `"${val}"`).join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${event?.title || 'event'}_attendees.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredAttendees = attendees.filter(att => {
    const name = (att.guestDetails?.name || att.userId?.name || "").toLowerCase();
    const email = (att.guestDetails?.email || att.userId?.email || "").toLowerCase();
    const ticketId = (att.ticketCode || "").toLowerCase();
    
    // Search
    if (searchQuery && !name.includes(searchQuery.toLowerCase()) && !email.includes(searchQuery.toLowerCase()) && !ticketId.includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Status Filter
    if (statusFilter !== "All") {
      let currentStatus = "Free";
      if (att.paymentStatus === 'pending_review') currentStatus = "Pending";
      if (att.paymentStatus === 'approved') currentStatus = "Approved";
      if (att.paymentStatus === 'rejected') currentStatus = "Rejected";
      if (att.status === 'cancelled') currentStatus = "Cancelled";
      
      if (currentStatus !== statusFilter) return false;
    }

    return true;
  });

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-full min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-[#006782]" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="p-8 text-center text-gray-500 min-h-[60vh] flex items-center justify-center">
        Event not found or you do not have permission to view it.
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1400px] mx-auto min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="mb-8">
        <Link href="/dashboard/events" className="inline-flex items-center text-[#006782] hover:text-[#004e63] font-medium text-sm mb-4 transition-colors">
          <ArrowLeft size={16} className="mr-1" /> Back to all events
        </Link>
        
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">{event.title}</h1>
          <span className={`px-3 py-1 text-xs font-bold rounded-full border uppercase ${
            event.status === 'posted' ? 'bg-green-50 text-green-600 border-green-200' :
            event.status === 'draft' ? 'bg-gray-100 text-gray-600 border-gray-200' :
            event.status === 'completed' ? 'bg-blue-50 text-blue-600 border-blue-200' :
            'bg-orange-50 text-orange-600 border-orange-200'
          }`}>
            {event.status === 'posted' ? 'LIVE' : event.status}
          </span>
        </div>
        
        <div className="flex items-center text-gray-500 text-sm font-medium gap-4">
          <div className="flex items-center gap-1.5">
            <Calendar size={16} />
            <span>{event.dateTime ? format(new Date(event.dateTime), "EEEE, MMMM d, yyyy") : "Date TBD"}</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-gray-300"></div>
          <div className="flex items-center gap-1.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <span>{event.locationType === "VENUE" ? `${event.venueName || "Venue TBD"}, ${event.city || ""}` : "Online Event"}</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-[400px]">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Search attendees..." 
              className="pl-11 h-12 rounded-2xl bg-gray-50 border-gray-200 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-500">Filter by:</span>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-12 px-4 border border-gray-200 rounded-xl text-sm font-medium bg-white text-gray-700 outline-none hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <option value="All">Status: All</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
                <option value="Free">Free</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            
            <Button 
              variant="outline" 
              onClick={handleExportCSV}
              className="rounded-xl border-gray-200 text-gray-700 h-12 px-6 hover:bg-gray-50 transition-colors"
            >
              <Download size={18} className="mr-2" /> Export CSV
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {filteredAttendees.length === 0 ? (
            <div className="text-center py-20 text-gray-500 font-medium">
              No attendees found.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 font-bold uppercase tracking-wider">
                  <th className="p-6 font-bold w-[25%]">Attendee Name</th>
                  <th className="p-6 font-bold w-[20%]">Email</th>
                  <th className="p-6 font-bold">Ticket ID</th>
                  <th className="p-6 font-bold text-center">Status</th>
                  <th className="p-6 font-bold">Ticket Type</th>
                  <th className="p-6 font-bold">Registration Date</th>
                  <th className="p-6 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAttendees.map((att) => {
                  const name = att.guestDetails?.name || att.userId?.name || "Unknown";
                  const email = att.guestDetails?.email || att.userId?.email || "Unknown";
                  const initials = name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase() || "??";
                  
                  // Status Badge Colors
                  let statusLabel = "Free";
                  let statusClasses = "bg-blue-50 text-blue-600";
                  
                  if (att.status === 'cancelled') {
                    statusLabel = "Cancelled";
                    statusClasses = "bg-gray-100 text-gray-600";
                  } else if (att.paymentStatus === 'pending_review') {
                    statusLabel = "Pending";
                    statusClasses = "bg-orange-50 text-orange-600 border border-orange-100";
                  } else if (att.paymentStatus === 'approved') {
                    statusLabel = "Approved";
                    statusClasses = "bg-green-50 text-green-600 border border-green-100";
                  } else if (att.paymentStatus === 'rejected') {
                    statusLabel = "Rejected";
                    statusClasses = "bg-red-50 text-red-600 border border-red-100";
                  }

                  const isFree = att.paymentStatus === 'free';
                  const ticketType = isFree ? "General Admission" : "VIP Access"; // Can be dynamic based on ticket data if available

                  return (
                    <tr key={att._id} className="hover:bg-gray-50 transition-colors group">
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-800 font-bold text-sm shrink-0">
                            {initials}
                          </div>
                          <span className="font-bold text-gray-900">{name}</span>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className="text-sm text-gray-500">{email}</span>
                      </td>
                      <td className="p-6">
                        <span className="text-sm font-bold text-[#006782]">#{att.ticketCode || "N/A"}</span>
                      </td>
                      <td className="p-6 text-center">
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full ${statusClasses}`}>
                          {statusLabel}
                        </span>
                      </td>
                      <td className="p-6">
                        <span className="text-sm text-gray-700">{ticketType}</span>
                      </td>
                      <td className="p-6">
                        <span className="text-sm text-gray-500">
                          {att.createdAt ? format(new Date(att.createdAt), "MMM d, yyyy") : "N/A"}
                        </span>
                      </td>
                      <td className="p-6 text-right">
                        {statusLabel === 'Pending' ? (
                           <Link href={`/dashboard/approvals`} className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold rounded-lg border border-orange-200 text-orange-600 bg-orange-50 hover:bg-orange-100 transition-colors">
                             Review Approval <ExternalLink size={12} className="ml-1" />
                           </Link>
                        ) : (
                          <button className="text-sm font-bold text-[#006782] hover:text-[#004e63] transition-colors">
                            View Details
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Simple Pagination Footer (Mockup) */}
        {filteredAttendees.length > 0 && (
          <div className="p-6 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm text-gray-500">Showing 1 to {filteredAttendees.length} of {filteredAttendees.length} entries</span>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" className="rounded-lg border-gray-200" disabled>Previous</Button>
              <Button variant="default" size="sm" className="rounded-lg bg-[#006782] hover:bg-[#004e63]">1</Button>
              <Button variant="outline" size="sm" className="rounded-lg border-gray-200" disabled>Next</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
