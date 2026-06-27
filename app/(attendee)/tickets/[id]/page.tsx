"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Download, QrCode } from "lucide-react";
import { attendeeApi } from "@/lib/api";
import { formatEventCardDate } from "@/lib/utils";

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.id as string;

  const [ticketData, setTicketData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await attendeeApi.getTicket(ticketId);
        setTicketData({ ticket: res.data.ticket, event: res.data.ticket.eventId });
      } catch (err) {
        console.error(err);
        setError("Ticket not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [ticketId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-64 h-[400px] bg-gray-200 rounded-3xl mb-4"></div>
            <div className="w-48 h-12 bg-gray-200 rounded-full"></div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !ticketData) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <h2 className="text-2xl font-bold mb-2">Error</h2>
            <p>{error || "Ticket not found."}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { ticket, event } = ticketData;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />
      
      <main className="flex-1 py-12 px-4 sm:px-8">
        <div className="max-w-md mx-auto flex flex-col items-center">
          
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-8 text-center">
            Your Ticket For {event.title}
          </h1>

          {/* Ticket Card */}
          <div className="w-full max-w-[340px] bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden flex flex-col relative mb-8">
            
            {/* Top Header */}
            <div className="bg-[#0f172a] py-4 text-center">
              <span className="text-white font-black tracking-[0.2em] text-sm">EVENTIFY</span>
            </div>

            {/* QR Section */}
            <div className="bg-white p-8 flex justify-center">
              <div className="w-48 h-48 bg-gray-100 rounded-xl flex items-center justify-center p-4">
                {/* Real QR would go here, using an icon as placeholder */}
                <QrCode size={140} className="text-gray-800" strokeWidth={1} />
              </div>
            </div>

            {/* Perforated Line Effect */}
            <div className="relative flex items-center justify-between px-[-10px]">
              <div className="absolute left-[-12px] w-6 h-6 bg-[#F8FAFC] rounded-full border-r border-gray-100"></div>
              <div className="w-full border-t-[3px] border-dashed border-gray-200 mx-3"></div>
              <div className="absolute right-[-12px] w-6 h-6 bg-[#F8FAFC] rounded-full border-l border-gray-100"></div>
            </div>

            {/* Event Details */}
            <div className="bg-white px-6 py-6 text-center">
              <h2 className="text-2xl font-black text-gray-900 mb-3">{event.title}</h2>
              <div className="flex flex-col gap-2 items-center text-gray-500 font-medium text-sm mb-6">
                <div className="flex items-center gap-1.5">
                  <Calendar size={16} />
                  <span>{formatEventCardDate(event.dateTime)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin size={16} />
                  <span>{event.venueName || "Online"}</span>
                </div>
              </div>

              {/* Attendee & Ticket ID */}
              <div className="flex justify-between text-left border-t border-gray-100 pt-4">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Attendee</span>
                  <span className="text-sm font-bold text-gray-900 block">{ticket.attendeeName}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Ticket ID</span>
                  <span className="text-sm font-black text-gray-900 block uppercase">#{ticket._id}</span>
                </div>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="bg-[#006782] p-4 text-white">
              <div className="flex justify-between items-center mb-3 px-2">
                <span className="text-xs font-bold uppercase tracking-wider opacity-90">General Admission</span>
                <span className="text-lg font-black">{event.ticketPrice > 0 ? `Rs ${event.ticketPrice}` : "Free"}</span>
              </div>
              <div className="text-center opacity-60 text-[10px] font-bold tracking-widest uppercase">
                Ticket Generated With Eventify
              </div>
            </div>

          </div>

          {/* Actions */}
          <div className="w-full max-w-[340px] flex flex-col gap-8 items-center">
            <Button className="w-full h-12 rounded-xl bg-[#0f172a] hover:bg-black text-white font-bold flex items-center justify-center gap-2">
              <Download size={18} /> Download Ticket
            </Button>

            <div className="text-center w-full">
              <p className="text-sm font-bold text-gray-900 mb-4">Invite your friends and create memories together.</p>
              
              {/* Social Buttons Placeholder */}
              <div className="flex justify-center gap-4 mb-8">
                {/* These are placeholder buttons visually matching the design */}
                <button className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors bg-white shadow-sm">
                  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                </button>
                <button className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors bg-white shadow-sm">
                  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </button>
                <button className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors bg-white shadow-sm">
                  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </button>
                <button className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors bg-white shadow-sm">
                  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="4" x2="20" y2="20"></line><line x1="20" y1="4" x2="4" y2="20"></line></svg>
                </button>
              </div>

              <Link href="/discover" className="block w-full">
                <Button variant="outline" className="w-full h-12 rounded-full border-gray-200 font-bold text-gray-700 hover:bg-gray-50 shadow-sm">
                  Explore More Events
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
