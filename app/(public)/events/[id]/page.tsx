"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Globe, Share2, Heart, ExternalLink, CalendarPlus, UserCheck, Star, AlertCircle } from "lucide-react";
import { eventsApi, registrationsApi } from "@/lib/api";
import { type Event } from "@/types/event";
import { formatShortDate } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { ShareEventModal } from "@/components/ShareEventModal";
import { GuestRegistrationModal } from "@/components/GuestRegistrationModal";
import { ReportClaimModal } from "@/components/events/ReportClaimModal";

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params.id as string;
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isInterested, setIsInterested] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const [isReportClaimOpen, setIsReportClaimOpen] = useState(false);
  
  const currentUserId = user?._id || (user as any)?.id;
  const isOrganizer = !!currentUserId && (
    (event?.organizerProfileId as any)?._id === currentUserId || 
    (event?.organizerProfileId as any)?.ownerId === currentUserId
  );

  const handleInterestClick = async () => {
    if (!isAuthenticated) {
      router.push(`/auth/signin?callbackUrl=/events/${eventId}`);
      return;
    }
    
    try {
      setIsInterested(!isInterested);
      await eventsApi.toggleInterest(eventId);
    } catch (error) {
      console.error("Failed to toggle interest", error);
      setIsInterested(prev => !prev);
    }
  };

  const handleAddToCalendarClick = () => {
    if (!event) return;
    
    const startDate = new Date(event.dateTime).toISOString().replace(/-|:|\.\d\d\d/g, "");
    
    const endDateObj = new Date(event.dateTime);
    endDateObj.setHours(endDateObj.getHours() + 1);
    const endDate = endDateObj.toISOString().replace(/-|:|\.\d\d\d/g, "");

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(event.description || '')}&location=${encodeURIComponent(event.venueName || '')}`;
    
    window.open(googleCalendarUrl, "_blank");
  };

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await eventsApi.getById(eventId);
        setEvent(res.data.event);
      } catch (error) {
        console.error("Failed to load event from API", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  const handleRegisterClick = () => {
    if (!isAuthenticated) {
      setIsGuestModalOpen(true);
    } else {
      router.push(`/events/${eventId}/register`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">

        <main className="flex-1 max-w-[1280px] w-full mx-auto px-8 py-12">
           <div className="h-[400px] bg-gray-200 rounded-3xl animate-pulse mb-12" />
           <div className="flex flex-col lg:flex-row gap-12">
             <div className="flex-1 space-y-6">
                <div className="h-12 bg-gray-200 rounded w-3/4 animate-pulse" />
                <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse" />
                <div className="h-32 bg-gray-200 rounded w-full animate-pulse" />
             </div>
             <div className="w-full lg:w-[400px] h-[300px] bg-gray-200 rounded-3xl animate-pulse" />
           </div>
        </main>

      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">

        <main className="flex-1 flex items-center justify-center">
           <div className="text-center">
             <h2 className="text-2xl font-bold mb-2 text-gray-900">Event Not Found</h2>
             <p className="text-gray-500 mb-6">This event may have been deleted or doesn't exist.</p>
             <Button onClick={() => router.push("/discover")} className="bg-[#006782] hover:bg-[#004E63]">
               Back to Events
             </Button>
           </div>
        </main>
      </div>
    );
  }

  const isFree = !event.tickets || !event.tickets.some(t => t.type === "PAID");
  const isPastEvent = new Date() > new Date(event.dateTime);

  const getDisplayPrice = () => {
    if (!event.tickets || event.tickets.length === 0) return "Free";
    const paidTickets = event.tickets.filter(t => t.type === "PAID" && t.price);
    if (paidTickets.length === 0) return "Free";
    const minPrice = Math.min(...paidTickets.map(t => t.price || 0));
    return paidTickets.length > 1 ? `From Rs ${minPrice}` : `Rs ${minPrice}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">

      
      <main className="flex-1 pb-20">
        {/* Banner Section */}
        <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 mt-8">
          <div className="w-full relative shadow-md rounded-[2rem] overflow-hidden bg-[#006782]/5 flex items-center justify-center">
            {event.bannerUrl || event.cardImageUrl ? (
              <img 
                src={event.bannerUrl || event.cardImageUrl} 
                alt={event.title}
                className="w-full h-auto max-h-[600px] object-contain"
              />
            ) : (
              <div className="w-full h-full bg-[#006782]/20 flex items-center justify-center">
                <span className="text-gray-400">No Image Available</span>
              </div>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Left Column - Details */}
            <div className="flex-1 flex flex-col gap-8">
              
              {/* Header Info */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-4 py-1.5 bg-blue-50 text-blue-700 font-bold text-sm rounded-full border border-blue-100 shadow-sm">
                    {Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(event.viewsCount || 0)} Views
                  </span>
                  <span className="px-4 py-1.5 bg-yellow-50 text-yellow-800 font-bold text-sm rounded-full border border-yellow-100 shadow-sm">
                    {event.interestedCount || 0} interested
                  </span>
                  <span className="px-4 py-1.5 bg-[#006782]/10 text-[#006782] font-black tracking-wide text-sm rounded-full border border-[#006782]/20 shadow-sm uppercase">
                    {new Date(event.dateTime) > new Date() ? "UPCOMING" : "COMPLETED"}
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-[#0F172A] leading-[1.1]">
                  {event.title}
                </h1>
                
                <div className="flex items-center gap-4 mt-2">
                  <Link href={`/organizers/${(event.organizerProfileId as any)?._id || ''}`} className="flex items-center gap-3 p-1.5 pr-4 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                      {(event.organizerProfileId as any)?.logoUrl ? (
                         <img src={(event.organizerProfileId as any).logoUrl} alt="Organizer" className="w-full h-full object-cover" />
                      ) : (
                         <span className="text-gray-400 font-semibold text-sm">ORG</span>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500 font-medium">Organized by</span>
                      <span className="text-sm font-bold text-gray-900 leading-tight">
                        {(event.organizerProfileId as any)?.brandName || "Unknown Organizer"}
                      </span>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 py-4 border-y border-gray-200">
                <Button 
                  variant="outline" 
                  className={`rounded-xl border-gray-300 h-12 px-6 ${isInterested ? 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100 border-yellow-200' : 'text-gray-700 hover:bg-gray-50'}`}
                  onClick={handleInterestClick}
                >
                  <Star size={18} className={`mr-2 ${isInterested ? 'fill-yellow-500 text-yellow-500' : 'text-gray-500'}`} /> I am interested
                </Button>
                <Button 
                  variant="outline" 
                  className="rounded-xl border-gray-300 text-gray-700 hover:bg-gray-50 h-12 px-6"
                  onClick={handleAddToCalendarClick}
                >
                  <CalendarPlus size={18} className="mr-2 text-gray-500" /> Add to Calendar
                </Button>
                <Button 
                  variant="outline" 
                  className="rounded-xl border-gray-300 text-gray-700 hover:bg-gray-50 h-12 px-6"
                  onClick={() => setIsShareModalOpen(true)}
                >
                  <Share2 size={18} className="mr-2 text-gray-500" /> Share Event
                </Button>
              </div>

              {/* Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 flex flex-col gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-2">
                    <Calendar size={20} />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">Date & Registration</h3>
                  <p className="text-gray-600 text-sm">{formatShortDate(event.dateTime)}</p>
                  <p className="text-gray-500 text-xs mt-1">Registration closes soon.</p>
                </div>
                <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 flex flex-col gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 mb-2">
                    {event.locationType === "ONLINE" ? <Globe size={20} /> : <MapPin size={20} />}
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">Location</h3>
                  {event.locationType === "ONLINE" ? (
                    <>
                      <p className="text-gray-600 text-sm">Online Event</p>
                      {event.platform && <p className="text-gray-500 text-xs mt-1">via {event.platform}</p>}
                    </>
                  ) : (
                    <>
                      <p className="text-gray-600 text-sm">{event.venueName}</p>
                      <p className="text-gray-500 text-xs mt-1">{event.city}</p>
                    </>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Description</h2>
                <div 
                  className="prose prose-gray max-w-none text-gray-600 leading-relaxed overflow-hidden"
                  dangerouslySetInnerHTML={{ __html: event.description }}
                />
              </div>
            </div>

            {/* Right Column - Sticky Sidebar */}
            <div className="w-full lg:w-[400px]">
              <div className="sticky top-28 space-y-6">
                
                {/* Registration Card */}
                <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-lg">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <p className="text-sm text-gray-500 font-medium mb-1">Registration</p>
                      <p className="text-4xl font-black text-gray-900">
                        {getDisplayPrice()}
                      </p>
                    </div>
                    {event.capacityLimit && (
                      <div className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold border border-red-100 flex items-center gap-1">
                        <AlertCircle size={14} /> Limited Slots
                      </div>
                    )}
                  </div>

                  {event.status === "completed" || event.status === "cancelled" || isPastEvent ? (
                    <Button disabled className="w-full h-14 text-base font-bold rounded-xl bg-gray-200 text-gray-500">
                      {event.status === "cancelled" ? "Event Cancelled" : "Registration Closed"}
                    </Button>
                  ) : isOrganizer ? (
                    <Button className="w-full h-14 text-base font-bold rounded-xl bg-[#006782] hover:bg-[#004E63] text-white" onClick={() => router.push(`/organizers/dashboard/events/${event._id}`)}>
                      Manage Event
                    </Button>
                  ) : (
                    <Button 
                      className="w-full h-14 text-base font-bold shadow-md rounded-xl bg-[#006782] hover:bg-[#004E63] text-white"
                      onClick={handleRegisterClick}
                      disabled={isRegistering}
                    >
                      {isRegistering ? "Processing..." : "Register Now"}
                    </Button>
                  )}
                  
                  <p className="text-center text-xs text-gray-400 mt-4 font-medium">Secure checkout via Eventify</p>
                </div>

                {/* Organizer Info Summary Card */}
                <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4">Organizer</h3>
                  <Link href={`/organizers/${(event.organizerProfileId as any)?._id || ''}`} className="flex items-center gap-4 mb-4 hover:opacity-80 transition-opacity">
                    <div className="w-14 h-14 rounded-2xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                      {(event.organizerProfileId as any)?.logoUrl ? (
                         <img src={(event.organizerProfileId as any).logoUrl} alt="Organizer" className="w-full h-full object-cover" />
                      ) : (
                         <div className="w-full h-full bg-[#006782]/10 flex items-center justify-center font-bold text-gray-400">ORG</div>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 leading-tight mb-1">
                        {(event.organizerProfileId as any)?.brandName || "Unknown Organizer"}
                      </p>
                      <p className="text-xs text-gray-500 font-medium">12.5k Followers • 42 Events</p>
                    </div>
                  </Link>
                  <Button variant="outline" className="w-full rounded-xl border-[#006782] text-[#006782] hover:bg-[#006782]/5 font-semibold">
                    Follow
                  </Button>
                  <div className="mt-4 text-center">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setIsReportClaimOpen(true);
                      }}
                      className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2 bg-transparent border-none p-0 cursor-pointer"
                    >
                      Report or Claim Event
                    </button>
                  </div>
                </div>

                {/* Event Location Map - Right Sidebar */}
                {event.locationType !== "ONLINE" && (
                  <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm mt-6">
                    <h3 className="font-bold text-gray-900 mb-4">Event Location</h3>
                    <div className="w-full h-[250px] rounded-xl overflow-hidden border border-slate-200 relative bg-slate-50">
                       <iframe 
                         title="Location Map"
                         width="100%" 
                         height="100%" 
                         frameBorder="0" 
                         scrolling="no" 
                         src={`https://maps.google.com/maps?q=${encodeURIComponent(event.venueName ? `${event.venueName}, ${event.city}` : event.city)}&t=&z=15&ie=UTF8&iwloc=&output=embed`} 
                         className="absolute inset-0"
                       />
                       <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-[10px] text-gray-500 shadow-sm opacity-70 pointer-events-none">
                         Map Preview
                       </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </main>

      <ShareEventModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        eventTitle={event?.title || ''} 
        eventUrl={typeof window !== 'undefined' ? window.location.href : ''} 
      />
      <GuestRegistrationModal
        isOpen={isGuestModalOpen}
        onClose={() => setIsGuestModalOpen(false)}
        eventId={eventId}
      />
      <ReportClaimModal
        isOpen={isReportClaimOpen}
        onClose={() => setIsReportClaimOpen(false)}
        eventId={eventId}
      />
    </div>
  );
}
