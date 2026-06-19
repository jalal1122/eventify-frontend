"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { MapPin, Globe, Plus, Calendar, Users, Trophy } from "lucide-react";
import { organizerApi, attendeeApi } from "@/lib/api";
import { type OrganizerProfile } from "@/types/user";
import { type Event } from "@/types/event";
import { EventCard } from "@/components/events/EventCard";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TwitterIcon = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);

const InstagramIcon = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
);

export default function OrganizerProfilePage() {
  const params = useParams();
  const organizerId = params.id as string;
  const { isAuthenticated, user } = useAuth();
  
  const [profile, setProfile] = useState<OrganizerProfile | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await organizerApi.getPublicProfile(organizerId);
        setProfile(res.data.profile);
        setEvents(res.data.events);
        
        // If user is logged in, check if they are following
        if (isAuthenticated && user) {
          const followingRes = await attendeeApi.getFollowing();
          const followingIds = followingRes.data.following.map((p: any) => p._id);
          setIsFollowing(followingIds.includes(res.data.profile._id));
        }
      } catch (error) {
        console.error("Failed to load organizer profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [organizerId, isAuthenticated, user]);

  const handleFollowToggle = async () => {
    if (!isAuthenticated) {
      alert("Please sign in to follow organizers.");
      return;
    }
    
    try {
      setFollowLoading(true);
      await attendeeApi.toggleFollow(organizerId);
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Follow toggle failed", error);
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Navbar />
        <main className="flex-1 max-w-[1280px] w-full mx-auto px-8 py-12">
           <div className="h-64 bg-gray-200 rounded-3xl animate-pulse mb-12" />
        </main>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
           <div className="text-center">
             <h2 className="text-2xl font-bold mb-2">Organizer Not Found</h2>
             <p className="text-gray-500">This profile may have been deleted or doesn't exist.</p>
           </div>
        </main>
      </div>
    );
  }

  const upcomingEvents = events.filter(e => e.status === "posted" && new Date(e.dateTime) >= new Date());
  const pastEvents = events.filter(e => e.status === "completed" || new Date(e.dateTime) < new Date());

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />
      
      <main className="flex-1 pb-20">
        
        {/* Profile Header Card */}
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 mt-12 mb-12">
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden">
            {/* Cyan top border indicator */}
            <div className="absolute top-0 left-0 w-full h-2 bg-[#006782]" />
            
            <div className="p-8 md:p-10 flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8">
              
              {/* Left Side: Avatar & Details */}
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2rem] bg-gray-50 overflow-hidden shrink-0 border-2 border-gray-100 shadow-sm flex items-center justify-center">
                  {profile.logoUrl ? (
                    <img src={profile.logoUrl} alt={profile.brandName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[#006782]/5 flex items-center justify-center text-4xl font-black text-[#006782]">
                      ORG
                    </div>
                  )}
                </div>
                
                <div className="text-center md:text-left mt-2">
                  <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2 flex items-center justify-center md:justify-start gap-2">
                    {profile.brandName}
                    {profile.isVerified && (
                      <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm shadow-sm">✓</span>
                    )}
                  </h1>
                  
                  <div className="flex items-center justify-center md:justify-start gap-4 text-sm font-semibold text-gray-500 mb-4">
                    {profile.city && (
                      <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-full"><MapPin size={14} /> {profile.city}</span>
                    )}
                    <span className="bg-gray-50 px-3 py-1 rounded-full">{profile.followersCount || 0} Followers</span>
                  </div>

                  {profile.bio && (
                    <p className="text-gray-600 leading-relaxed max-w-xl text-sm mb-4">
                      {profile.bio}
                    </p>
                  )}

                  {profile.socialLinks && (
                    <div className="flex items-center justify-center md:justify-start gap-3">
                      {profile.socialLinks.website && (
                        <a href={profile.socialLinks.website} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:text-[#006782] hover:bg-[#006782]/10 transition-colors"><Globe size={18} /></a>
                      )}
                      {profile.socialLinks.twitter && (
                        <a href={profile.socialLinks.twitter} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:text-[#006782] hover:bg-[#006782]/10 transition-colors"><TwitterIcon size={18} /></a>
                      )}
                      {profile.socialLinks.instagram && (
                        <a href={profile.socialLinks.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:text-[#006782] hover:bg-[#006782]/10 transition-colors"><InstagramIcon size={18} /></a>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side: Stats & Action */}
              <div className="flex flex-col items-center lg:items-end gap-6 w-full lg:w-auto">
                <div className="flex items-center gap-4 bg-gray-50 rounded-2xl p-4 w-full md:w-auto border border-gray-100">
                  <div className="flex flex-col items-center px-4">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2"><Calendar size={16} /></div>
                    <span className="text-2xl font-black text-gray-900 leading-none mb-1">{events.length}</span>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Events Created</span>
                  </div>
                  <div className="w-[1px] h-12 bg-gray-200" />
                  <div className="flex flex-col items-center px-4">
                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-2"><Trophy size={16} /></div>
                    <span className="text-2xl font-black text-gray-900 leading-none mb-1">{pastEvents.length}</span>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Events Hosted</span>
                  </div>
                  <div className="w-[1px] h-12 bg-gray-200" />
                  <div className="flex flex-col items-center px-4">
                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-2"><Users size={16} /></div>
                    <span className="text-2xl font-black text-gray-900 leading-none mb-1">{profile.followersCount || 0}</span>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Followers</span>
                  </div>
                </div>

                {user?._id !== profile._id && (
                  <Button 
                    onClick={handleFollowToggle} 
                    disabled={followLoading}
                    variant={isFollowing ? "outline" : "default"}
                    className={`w-full md:w-[240px] h-12 rounded-xl text-base font-bold shadow-sm ${isFollowing ? "border-gray-300 text-gray-700 bg-white" : "bg-[#006782] hover:bg-[#004E63] text-white"}`}
                  >
                    {isFollowing ? "Following" : <><Plus size={18} className="mr-2" /> Follow Organizer</>}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Events Grid Area with Tabs */}
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
          <Tabs defaultValue="upcoming" className="w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-gray-200 pb-4">
              <h2 className="text-2xl font-black text-gray-900">Events</h2>
              <TabsList className="bg-gray-100/80 p-1 rounded-xl h-auto">
                <TabsTrigger value="upcoming" className="rounded-lg px-6 py-2.5 font-bold data-[state=active]:bg-white data-[state=active]:text-[#006782] data-[state=active]:shadow-sm">
                  Upcoming ({upcomingEvents.length})
                </TabsTrigger>
                <TabsTrigger value="past" className="rounded-lg px-6 py-2.5 font-bold data-[state=active]:bg-white data-[state=active]:text-[#006782] data-[state=active]:shadow-sm">
                  Past Events ({pastEvents.length})
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="upcoming" className="mt-0 outline-none">
              {upcomingEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {upcomingEvents.map(event => (
                    <EventCard key={event._id} event={event} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <Calendar size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">No upcoming events</h3>
                  <p className="text-sm font-medium text-gray-500">This organizer doesn't have any scheduled events at the moment.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="past" className="mt-0 outline-none">
              {pastEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {pastEvents.map(event => (
                    <div key={event._id} className="opacity-80 hover:opacity-100 transition-opacity grayscale-[30%] hover:grayscale-0">
                      <EventCard event={event} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <Trophy size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">No past events</h3>
                  <p className="text-sm font-medium text-gray-500">This organizer hasn't hosted any events yet.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
