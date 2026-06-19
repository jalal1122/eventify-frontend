import Link from "next/link";
import { type Event } from "@/types/event";
import { formatEventCardDate } from "@/lib/utils";
import { CheckCircle2, Clock, XCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

export type TicketStatus = "confirmed" | "pending" | "rejected";

interface TicketCardProps {
  event: Event;
  ticket: {
    _id: string;
    status: TicketStatus;
    attendeeName: string;
    message?: string;
  };
}

export function TicketCard({ event, ticket }: TicketCardProps) {
  const isConfirmed = ticket.status === "confirmed";
  const isPending = ticket.status === "pending";
  const isRejected = ticket.status === "rejected";

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row p-3 gap-6 transition-shadow hover:shadow-md">
      {/* Left Image */}
      <div className="w-full md:w-[240px] h-[200px] shrink-0 rounded-2xl overflow-hidden relative">
        <img 
          src={event.cardImageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80"} 
          alt={event.title} 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Middle Content */}
      <div className="flex-1 py-2 flex flex-col justify-center">
        {/* Status Badge */}
        <div className="mb-2">
          {isConfirmed && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold">
              <CheckCircle2 size={14} /> Ticket Confirmed
            </span>
          )}
          {isPending && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-bold">
              <Clock size={14} /> Payment Verification Pending
            </span>
          )}
          {isRejected && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold">
              <XCircle size={14} /> Rejected
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-1">{event.title}</h3>
        <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">#{ticket._id}</p>

        {/* Alert Message */}
        {ticket.message && (
          <div className={`mb-4 p-3 rounded-xl flex items-start gap-2 text-sm font-medium ${
            isPending ? "bg-orange-50/50 text-orange-800 border border-orange-100" : 
            isRejected ? "bg-red-50/50 text-red-800 border border-red-100" : ""
          }`}>
            <Info size={16} className="mt-0.5 shrink-0" />
            <p>{ticket.message}</p>
          </div>
        )}

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-4 mt-auto">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Date & Time</span>
            <span className="text-sm font-semibold text-gray-900 block truncate">{formatEventCardDate(event.dateTime)}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Venue</span>
            <span className="text-sm font-semibold text-gray-900 block truncate">{event.venueName || "Online"}</span>
          </div>
          <div className="col-span-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Attendee</span>
            <span className="text-sm font-semibold text-gray-900 block truncate">{ticket.attendeeName}</span>
          </div>
        </div>
      </div>

      {/* Right Action */}
      <div className="w-full md:w-[200px] shrink-0 flex items-center justify-center p-4 md:border-l border-gray-100 mt-4 md:mt-0">
        {isConfirmed && (
          <Link href={`/tickets/${ticket._id}`} className="w-full">
            <Button className="w-full h-12 rounded-xl bg-[#006782] hover:bg-[#004E63] text-white font-bold text-sm">
              View Ticket
            </Button>
          </Link>
        )}
        {isPending && (
          <Button disabled className="w-full h-12 rounded-xl bg-gray-100 text-gray-400 font-bold text-sm">
            Ticket Pending
          </Button>
        )}
        {isRejected && (
          <Link href={`/events/${event._id}`} className="w-full">
            <Button variant="outline" className="w-full h-12 rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-bold text-sm">
              View Details
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
