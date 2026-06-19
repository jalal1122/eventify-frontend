"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, LogOut, Ticket, Star, Users, Edit3 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { attendeeApi } from "@/lib/api";
import { EventCard } from "@/components/events/EventCard";
import { OrganizerCard } from "@/components/organizers/OrganizerCard";

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab") || "tickets";
  const { user, isAuthenticated, logout } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<any[]>([]); // API might return registrations
  const [interested, setInterested] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/signin");
      return;
    }
    
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        // Using mock endpoints or the real ones if they exist
        // For demonstration, these assume API endpoints return arrays of events/organizers
        
        try {
          const ticketsRes = await attendeeApi.getTickets();
          // Map registrations to events
          setTickets(ticketsRes.data.registrations?.map((r: any) => r.eventId) || []);
        } catch (e) { console.error(e); }

        try {
          const followingRes = await attendeeApi.getFollowing();
          setFollowing(followingRes.data.following || []);
        } catch (e) { console.error(e); }
        
        // Let's pretend there's a getInterested endpoint, but mock it as empty for now
        setInterested([]);
        
      } catch (error) {
        console.error("Failed to load profile data", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, [isAuthenticated, router]);

  const handleUnfollow = async (organizerId: string) => {
    try {
      await attendeeApi.toggleFollow(organizerId);
      setFollowing(prev => prev.filter(org => org._id !== organizerId));
    } catch (error) {
      console.error("Failed to unfollow", error);
    }
  };

  if (!isAuthenticated || !user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />
      
      <main className="flex-1 pb-24">
        
        {/* Profile Header Header */}
        <div className="bg-white border-b border-[#F3F4F6] pt-12 pb-10 shadow-sm relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#006782]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8 relative z-10">
            <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
              
              <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-[2rem] bg-[#006782] text-white flex items-center justify-center text-4xl font-black shadow-lg border-4 border-white">
                  {user.name?.charAt(0) || "U"}
                </div>
                
                <div className="mb-2">
                  <h1 className="text-3xl font-black text-gray-900 mb-1">{user.name || "User Name"}</h1>
                  <p className="text-gray-500 font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <Button variant="outline" className="flex-1 md:w-auto h-12 rounded-xl font-bold border-gray-200 hover:bg-gray-50">
                  <Edit3 size={18} className="mr-2" /> Edit Profile
                </Button>
                <Button variant="outline" className="w-12 h-12 rounded-xl border-gray-200 hover:bg-gray-50 p-0 shrink-0" onClick={logout}>
                  <LogOut size={18} className="text-red-500" />
                </Button>
              </div>

            </div>
          </div>
        </div>

        {/* Dashboard Tabs Content */}
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 mt-10">
          <Tabs defaultValue={defaultTab} className="w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-gray-200 pb-4">
              <h2 className="text-2xl font-black text-gray-900">My Profile</h2>
              <TabsList className="bg-gray-100/80 p-1 rounded-xl h-auto flex flex-wrap md:flex-nowrap w-full md:w-auto overflow-x-auto justify-start">
                <TabsTrigger value="tickets" className="rounded-lg px-6 py-2.5 font-bold data-[state=active]:bg-white data-[state=active]:text-[#006782] data-[state=active]:shadow-sm">
                  <Ticket size={16} className="mr-2" /> My Tickets
                </TabsTrigger>
                <TabsTrigger value="interested" className="rounded-lg px-6 py-2.5 font-bold data-[state=active]:bg-white data-[state=active]:text-[#006782] data-[state=active]:shadow-sm">
                  <Star size={16} className="mr-2" /> Interested
                </TabsTrigger>
                <TabsTrigger value="following" className="rounded-lg px-6 py-2.5 font-bold data-[state=active]:bg-white data-[state=active]:text-[#006782] data-[state=active]:shadow-sm">
                  <Users size={16} className="mr-2" /> Following
                </TabsTrigger>
              </TabsList>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1,2,3,4].map(i => <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-3xl" />)}
              </div>
            ) : (
              <>
                <TabsContent value="tickets" className="mt-0 outline-none">
                  {tickets.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {tickets.map((event: any) => (
                        <EventCard key={event._id} event={event} attended={true} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center">
                      <div className="w-16 h-16 bg-[#006782]/10 rounded-full flex items-center justify-center mb-4 text-[#006782]">
                        <Ticket size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">No tickets yet</h3>
                      <p className="text-gray-500 mb-6 max-w-sm font-medium">You haven't registered for any events. Discover what's happening near you.</p>
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
                          onUnfollow={handleUnfollow} 
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
