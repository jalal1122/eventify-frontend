"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Share2, Heart, Clock, AlertCircle } from "lucide-react";
import { eventsApi, registrationsApi } from "@/lib/api";
import { type Event } from "@/types/event";
import { formatShortDate, formatRelativeTime } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { RegisterModal } from "@/components/modals/RegisterModal";
import { GuestCheckoutModal } from "@/components/modals/GuestCheckoutModal";

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params.id as string;
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  
  // A simplistic check to see if current user is the organizer. 
  // Normally backend returns boolean flags or we check IDs.
  const isOrganizer = user?._id === event?.organizerId || (event?.organizerProfileId as any)?._id === user?._id;

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await eventsApi.getById(eventId);
        setEvent(res.data.event);
      } catch (error) {
        console.error("Failed to load event", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  const handleRegisterClick = () => {
    if (isAuthenticated) {
      // Direct register
      handleDirectRegistration();
    } else {
      // Open auth gate
      setRegisterModalOpen(true);
    }
  };

  const handleDirectRegistration = async () => {
    try {
      setIsRegistering(true);
      await registrationsApi.register({ eventId });
      setRegistrationSuccess(true);
    } catch (err: any) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setIsRegistering(false);
    }
  };

  const handleGuestSuccess = () => {
    setGuestModalOpen(false);
    setRegistrationSuccess(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Navbar />
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
        <Footer />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
           <div className="text-center">
             <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
             <p className="text-gray-500 mb-6">This event may have been deleted or doesn't exist.</p>
             <Button onClick={() => router.push("/discover")}>Back to Events</Button>
           </div>
        </main>
      </div>
    );
  }

  const isFree = !event.isPaid || event.ticketPrice === 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />
      
      <main className="flex-1">
        {/* Banner Section */}
        <div className="w-full h-[400px] md:h-[500px] bg-gray-900 relative">
          {event.bannerUrl || event.cardImageUrl ? (
            <img 
              src={event.bannerUrl || event.cardImageUrl} 
              alt={event.title}
              className="w-full h-full object-cover opacity-60"
            />
          ) : (
             <div className="w-full h-full bg-[#006782]/20" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-90" />
          
          <div className="absolute bottom-0 left-0 w-full p-8 pb-12">
            <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row gap-6 md:items-end justify-between">
              <div className="max-w-3xl animate-slide-up">
                {event.category && (
                   <Badge variant="secondary" className="mb-4 bg-white/20 text-white hover:bg-white/30 backdrop-blur border-none">
                     {event.category}
                   </Badge>
                )}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight mb-4">
                  {event.title}
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-gray-200 font-medium">
                  <div className="flex items-center gap-2">
                    <Calendar size={20} className="text-[#BAEAFF]" />
                    <span>{formatShortDate(event.dateTime)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={20} className="text-[#BAEAFF]" />
                    <span>{event.venueName}, {event.city}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-[1280px] mx-auto px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-12 relative">
            
            {/* Left Column - Details */}
            <div className="flex-1">
              <div className="bg-white rounded-3xl p-8 border border-[#F3F4F6] mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">About this event</h2>
                <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {event.description}
                </div>
              </div>

              {event.agenda && event.agenda.length > 0 && (
                <div className="bg-white rounded-3xl p-8 border border-[#F3F4F6] mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Agenda</h2>
                  <div className="space-y-6">
                    {event.agenda.map((item, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="w-20 text-sm font-semibold text-[#006782] shrink-0 pt-1">
                          {item.startTime}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{item.title}</h4>
                          {item.description && <p className="text-sm text-gray-500 mt-1">{item.description}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Sticky Sidebar */}
            <div className="w-full lg:w-[400px]">
              <div className="sticky top-32 space-y-6">
                
                {/* Booking Card */}
                <div className="bg-white rounded-3xl p-8 border border-[#F3F4F6] shadow-sm">
                  <div className="flex justify-between items-center mb-6 pb-6 border-b border-[#F3F4F6]">
                    <div>
                      <p className="text-sm text-gray-500 font-medium mb-1">Price</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {isFree ? "Free" : `Rs ${event.ticketPrice}`}
                      </p>
                    </div>
                    {event.capacity && (
                      <div className="text-right">
                        <p className="text-sm text-gray-500 font-medium mb-1">Capacity</p>
                        <p className="font-semibold text-gray-900">{event.capacity} spots</p>
                      </div>
                    )}
                  </div>

                  {registrationSuccess ? (
                    <div className="bg-green-50 border border-green-100 rounded-2xl p-6 text-center">
                      <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        ✓
                      </div>
                      <h4 className="font-bold text-green-900 mb-1">You're Registered!</h4>
                      <p className="text-sm text-green-700">Check your email for tickets.</p>
                      <Button className="w-full mt-4" variant="outline" onClick={() => router.push("/attendee/tickets")}>
                        View My Tickets
                      </Button>
                    </div>
                  ) : event.status === "completed" || event.status === "cancelled" ? (
                    <Button disabled className="w-full h-14 text-base rounded-xl bg-gray-200 text-gray-500">
                      Event {event.status === "completed" ? "Ended" : "Cancelled"}
                    </Button>
                  ) : isOrganizer ? (
                    <Button className="w-full h-14 text-base rounded-xl" onClick={() => router.push(`/organizer/events/${event._id}`)}>
                      Manage Event
                    </Button>
                  ) : (
                    <Button 
                      className="w-full h-14 text-base font-semibold shadow-md rounded-xl"
                      onClick={handleRegisterClick}
                      disabled={isRegistering}
                    >
                      {isRegistering ? "Processing..." : "Register Now"}
                    </Button>
                  )}

                  <div className="flex items-center justify-center gap-4 mt-6">
                    <button className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#006782] transition-colors">
                      <Share2 size={16} /> Share
                    </button>
                    <div className="w-1 h-1 rounded-full bg-gray-300" />
                    <button className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-red-500 transition-colors">
                      <Heart size={16} /> Save
                    </button>
                  </div>
                </div>

                {/* Organizer Info */}
                <div className="bg-white rounded-3xl p-6 border border-[#F3F4F6] flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden shrink-0">
                    {/* Assuming populated organizerProfileId */}
                    {(event.organizerProfileId as any)?.logoUrl ? (
                       <img src={(event.organizerProfileId as any).logoUrl} alt="Organizer" className="w-full h-full object-cover" />
                    ) : (
                       <div className="w-full h-full bg-[#006782]/10" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Organized by</p>
                    <p className="font-bold text-gray-900 group-hover:text-[#006782] transition-colors">
                      {(event.organizerProfileId as any)?.brandName || "Organizer"}
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />

      {/* Modals */}
      <RegisterModal 
        open={registerModalOpen} 
        onClose={() => setRegisterModalOpen(false)}
        onContinueAsGuest={() => {
          setRegisterModalOpen(false);
          setGuestModalOpen(true);
        }}
        eventName={event.title}
      />

      <GuestCheckoutModal 
        open={guestModalOpen} 
        onClose={() => setGuestModalOpen(false)}
        eventId={event._id}
        eventName={event.title}
        onSuccess={handleGuestSuccess}
      />
    </div>
  );
}
