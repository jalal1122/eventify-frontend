"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Ticket } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { TicketCard } from "@/components/events/TicketCard";
import { TicketCardSkeleton } from "@/components/ui/skeletons";
import { attendeeApi, authApi } from "@/lib/api";
function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab") || "upcoming";
  const { user, isAuthenticated } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<any[]>([]); 
  const [profile, setProfile] = useState<any>(null);
  const [visibleUpcoming, setVisibleUpcoming] = useState(5);
  const [visiblePast, setVisiblePast] = useState(5);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/signin");
      return;
    }
    
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const [profileRes, ticketsRes] = await Promise.all([
          authApi.getProfile(),
          attendeeApi.getTickets(),
        ]);
        setProfile(profileRes.data.user);
        
        const backendTickets = ticketsRes.data.registrations || ticketsRes.data.tickets || [];
        const mappedTickets = backendTickets.map((t: any) => {
          let mappedStatus = "pending";
          if (t.status === "cancelled") {
            mappedStatus = "rejected";
          } else if (t.paymentStatus === "approved" || t.paymentStatus === "free") {
            mappedStatus = "confirmed";
          } else if (t.paymentStatus === "rejected") {
            mappedStatus = "rejected";
          } else if (t.paymentStatus === "pending_review") {
            mappedStatus = "pending";
          }

          return {
            event: t.eventId,
            ticket: {
              ...t,
              status: mappedStatus,
              attendeeName: t.guestDetails?.name || profileRes.data.user?.name || "Attendee",
              message: t.rejectionReason || "",
            }
          };
        });

        setTickets(mappedTickets);
      } catch (err) {
        console.error("Failed to fetch tickets", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) return null;

  const now = new Date();
  const upcomingTickets = tickets.filter(t => t.event?.dateTime && new Date(t.event.dateTime) >= now);
  const pastTickets = tickets.filter(t => t.event?.dateTime && new Date(t.event.dateTime) < now);

  const displayedUpcoming = upcomingTickets.slice(0, visibleUpcoming);
  const displayedPast = pastTickets.slice(0, visiblePast);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />
      
      <main className="flex-1 pb-24">
        
        {/* Simplified Profile Header */}
        <div className="pt-12 pb-8 flex flex-col items-center relative max-w-xl mx-auto px-4">
          {/* Avatar */}
          <div className="relative mb-4">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-[4px] border-white shadow-sm overflow-hidden bg-gray-200 shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80" 
                alt={profile?.name || user.name} 
                className="w-full h-full object-cover" 
              />
            </div>
            {/* Small settings badge could go here if needed */}
          </div>

          {/* User Info */}
          <h1 className="text-2xl font-black text-gray-900 mb-1">{profile?.name || user.name || "User Name"}</h1>
          <p className="text-gray-500 font-medium text-sm mb-6">{profile?.email || user.email || "email@example.com"}</p>

          {/* Action */}
          <Link href="/profile/edit">
            <Button variant="outline" className="h-9 px-6 rounded-full font-bold border-gray-200 hover:bg-gray-50 text-gray-700 shadow-sm text-sm">
              Edit Profile
            </Button>
          </Link>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-[#006782]">My Tickets</h2>
        </div>

        {/* Tickets Tabs Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-8">
          <Tabs defaultValue={defaultTab} className="w-full flex flex-col items-center">
            <TabsList className="bg-gray-100/50 p-1 rounded-full h-auto flex gap-1 mb-8">
              <TabsTrigger 
                value="upcoming" 
                className="rounded-full px-6 py-2.5 font-bold text-gray-500 data-[state=active]:bg-[#006782] data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
              >
                Upcoming Events Tickets
              </TabsTrigger>
              <TabsTrigger 
                value="past" 
                className="rounded-full px-6 py-2.5 font-bold text-gray-500 data-[state=active]:bg-[#006782] data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
              >
                Past Tickets
              </TabsTrigger>
            </TabsList>
            
            <div className="w-full">
              {loading ? (
                <div className="flex flex-col gap-6">
                  {[1,2,3].map(i => <TicketCardSkeleton key={i} />)}
                </div>
              ) : (
                <>
                  <TabsContent value="upcoming" className="mt-0 outline-none w-full flex flex-col gap-6">
                    {upcomingTickets.length > 0 ? (
                      <>
                        {displayedUpcoming.map((item: any) => (
                          <TicketCard key={item.ticket._id} event={item.event} ticket={item.ticket} />
                        ))}
                        {visibleUpcoming < upcomingTickets.length && (
                          <div className="flex justify-center mt-6">
                            <Button onClick={() => setVisibleUpcoming(prev => prev + 5)} variant="outline" className="rounded-full px-8 h-12 font-bold text-gray-700 hover:bg-gray-50 shadow-sm border-gray-200">
                              See More
                            </Button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center">
                        <div className="w-16 h-16 bg-[#006782]/10 rounded-full flex items-center justify-center mb-4 text-[#006782]">
                          <Ticket size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No upcoming tickets</h3>
                        <p className="text-gray-500 mb-6 max-w-sm font-medium">You don't have any tickets for upcoming events.</p>
                        <Button onClick={() => router.push("/discover")} className="h-12 px-8 rounded-xl bg-[#006782] hover:bg-[#004E63] font-bold">
                          Browse Events
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="past" className="mt-0 outline-none w-full flex flex-col gap-6">
                    {pastTickets.length > 0 ? (
                      <>
                        {displayedPast.map((item: any) => (
                          <TicketCard key={item.ticket._id} event={item.event} ticket={item.ticket} />
                        ))}
                        {visiblePast < pastTickets.length && (
                          <div className="flex justify-center mt-6">
                            <Button onClick={() => setVisiblePast(prev => prev + 5)} variant="outline" className="rounded-full px-8 h-12 font-bold text-gray-700 hover:bg-gray-50 shadow-sm border-gray-200">
                              See More
                            </Button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center opacity-70">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                          <Ticket size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No past tickets</h3>
                        <p className="text-gray-500 font-medium">Your past event tickets will appear here.</p>
                      </div>
                    )}
                  </TabsContent>
                </>
              )}
            </div>
          </Tabs>
        </div>
        
      </main>
      <Footer />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfileContent />
    </Suspense>
  );
}
