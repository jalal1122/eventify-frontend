"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Globe, Camera, Edit2, Share2, Ticket, Star, Users, Loader2, X, Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { EventCard } from "@/components/events/EventCard";
import { OrganizerCard } from "@/components/organizers/OrganizerCard";
import { EventCardSkeleton, OrganizerCardSkeleton } from "@/components/ui/skeletons";
import { attendeeApi, authApi } from "@/lib/api";
import { ProfileHeader } from "@/components/profile/ProfileHeader";

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab") || "attended";
  const { user, isAuthenticated, logout, refresh } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<any[]>([]); 
  const [interested, setInterested] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/signin");
      return;
    }
    
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const [profileRes, ticketsRes, interestedRes, followingRes] = await Promise.all([
          authApi.getProfile(),
          attendeeApi.getTickets(),
          attendeeApi.getInterestedEvents(),
          attendeeApi.getFollowing(),
        ]);
        
        const profileData = profileRes.data.user;
        setProfile(profileData);
        
        // Ensure tickets exist in response, backend returns { success: true, registrations: [...] }
        setTickets(ticketsRes.data.registrations || ticketsRes.data.tickets || []);
        
        // Ensure interested exist
        setInterested(interestedRes.data.events || []);

        setFollowing(followingRes.data.following || []);
      } catch (err) {
        console.error("Failed to fetch profile data:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />
      
      <main className="flex-1 pb-24">
        
        <ProfileHeader user={user} profile={profile} setProfile={setProfile} />

        {/* Dashboard Tabs Content */}
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 mt-6">
          <Tabs defaultValue={defaultTab} className="w-full">
            <div className="flex justify-center mb-8 border-b border-gray-200 pb-0">
              <TabsList className="bg-transparent p-0 h-auto flex gap-8 md:gap-12 overflow-x-auto justify-center w-full">
                <TabsTrigger 
                  value="interested" 
                  className="rounded-none px-0 py-4 font-bold text-gray-500 data-[state=active]:bg-transparent data-[state=active]:text-[#006782] data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#006782]"
                >
                  Interested Events
                </TabsTrigger>
                <TabsTrigger 
                  value="attended" 
                  className="rounded-none px-0 py-4 font-bold text-gray-500 data-[state=active]:bg-transparent data-[state=active]:text-[#006782] data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#006782]"
                >
                  Attended Events
                </TabsTrigger>
                <TabsTrigger 
                  value="following" 
                  className="rounded-none px-0 py-4 font-bold text-gray-500 data-[state=active]:bg-transparent data-[state=active]:text-[#006782] data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#006782]"
                >
                  Following
                </TabsTrigger>
              </TabsList>
            </div>
            
            {loading ? (
              <>
                <TabsContent value="attended" className="mt-0 outline-none">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <EventCardSkeleton key={i} />)}
                  </div>
                </TabsContent>
                <TabsContent value="interested" className="mt-0 outline-none">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <EventCardSkeleton key={i} />)}
                  </div>
                </TabsContent>
                <TabsContent value="following" className="mt-0 outline-none">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <OrganizerCardSkeleton key={i} />)}
                  </div>
                </TabsContent>
              </>
            ) : (
              <>
                <TabsContent value="attended" className="mt-0 outline-none">
                  {tickets.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {tickets
                        .filter((ticket: any, index: number, self: any[]) => 
                          index === self.findIndex((t: any) => (t.eventId?._id || t.eventId) === (ticket.eventId?._id || ticket.eventId))
                        )
                        .map((registration: any) => (
                        <EventCard key={registration._id} event={registration.eventId} attended={true} href={`/tickets/${registration.ticketCode || registration._id}`} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center">
                      <div className="w-16 h-16 bg-[#006782]/10 rounded-full flex items-center justify-center mb-4 text-[#006782]">
                        <Ticket size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">No attended events yet</h3>
                      <p className="text-gray-500 mb-6 max-w-sm font-medium">You haven't attended any events. Discover what's happening near you.</p>
                      <Button onClick={() => router.push("/discover")} className="h-12 px-8 rounded-xl bg-[#006782] hover:bg-[#004E63] font-bold">
                        Browse Events
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="interested" className="mt-0 outline-none">
                  {interested.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {interested.map((event: any) => (
                        <EventCard key={event._id} event={event} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
                        <Star size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">No saved events</h3>
                      <p className="text-gray-500 font-medium">Events you mark as interested will appear here.</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="following" className="mt-0 outline-none">
                  {following.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {following.map((org: any) => (
                        <OrganizerCard 
                          key={org._id} 
                          organizer={org} 
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
                        <Users size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Not following anyone</h3>
                      <p className="text-gray-500 font-medium">Follow organizers to stay updated on their latest events.</p>
                    </div>
                  )}
                </TabsContent>
              </>
            )}
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
