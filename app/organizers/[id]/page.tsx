"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { MapPin, Globe, Plus } from "lucide-react";
import { organizerApi, attendeeApi } from "@/lib/api";
import { type OrganizerProfile } from "@/types/user";
import { type Event } from "@/types/event";
import { EventCard } from "@/components/events/EventCard";
import { useAuth } from "@/hooks/useAuth";

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
      
      <main className="flex-1">
        {/* Profile Header */}
        <div className="bg-white border-b border-[#F3F4F6] pt-16 pb-12">
          <div className="max-w-[1280px] mx-auto px-8">
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
              
              <div className="flex items-center gap-6">
                <div className="w-32 h-32 rounded-3xl bg-gray-100 overflow-hidden shrink-0 border-4 border-white shadow-lg">
                  {profile.logoUrl ? (
                    <img src={profile.logoUrl} alt={profile.brandName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[#006782]/10 flex items-center justify-center text-3xl font-bold text-[#006782]">
                      {profile.brandName.charAt(0)}
                    </div>
                  )}
                </div>
                
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                    {profile.brandName}
                    {profile.isVerified && (
                      <span className="w-5 h-5 bg-[#006782] text-white rounded-full flex items-center justify-center text-xs">✓</span>
                    )}
                  </h1>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    {profile.city && (
                      <span className="flex items-center gap-1"><MapPin size={14} /> {profile.city}</span>
                    )}
                    <span className="font-semibold text-gray-900">{profile.followersCount} followers</span>
                  </div>

                  {profile.socialLinks && (
                    <div className="flex items-center gap-3">
                      {profile.socialLinks.website && (
                        <a href={profile.socialLinks.website} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#006782] transition-colors"><Globe size={18} /></a>
                      )}
                      {profile.socialLinks.twitter && (
                        <a href={profile.socialLinks.twitter} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#006782] transition-colors"><TwitterIcon size={18} /></a>
                      )}
                      {profile.socialLinks.instagram && (
                        <a href={profile.socialLinks.instagram} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#006782] transition-colors"><InstagramIcon size={18} /></a>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Follow Button */}
              {user?._id !== profile._id && (
                <Button 
                  onClick={handleFollowToggle} 
                  disabled={followLoading}
                  variant={isFollowing ? "outline" : "default"}
                  className={`min-w-[140px] shadow-sm ${isFollowing ? "border-gray-300 text-gray-700" : ""}`}
                >
                  {isFollowing ? "Following" : <><Plus size={16} className="mr-1" /> Follow</>}
                </Button>
              )}
            </div>

            {profile.bio && (
              <div className="mt-8 max-w-3xl">
                <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
              </div>
            )}
          </div>
        </div>

        {/* Events Section */}
        <div className="max-w-[1280px] mx-auto px-8 py-12">
          
          {upcomingEvents.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Events ({upcomingEvents.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {upcomingEvents.map(event => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
            </div>
          )}

          {pastEvents.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Past Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 opacity-70">
                {pastEvents.map(event => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
            </div>
          )}

          {events.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-[#F3F4F6]">
              <p className="text-gray-500">This organizer hasn't published any events yet.</p>
            </div>
          )}
          
        </div>
      </main>

      <Footer />
    </div>
  );
}
