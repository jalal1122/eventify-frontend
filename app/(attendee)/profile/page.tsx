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
import { attendeeApi, authApi, eventsApi } from "@/lib/api";
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

  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editCity, setEditCity] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(true);
    try {
      const res = await eventsApi.uploadImage(e.target.files[0]);
      if (res.data.imageUrl) {
        setProfilePicture(res.data.imageUrl);
      }
    } catch (err) {
      console.error("Failed to upload image", err);
      alert("Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await authApi.updateProfile({ name: editName, city: editCity, profilePicture });
      await refresh();
      setProfile((prev: any) => ({ ...prev, name: editName, city: editCity, profilePicture }));
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to save profile", err);
      alert("Failed to save profile.");
    } finally {
      setIsSaving(false);
    }
  };

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
        setEditName(profileData?.name || user?.name || "");
        setEditCity(profileData?.city || profileData?.location || "");
        setProfilePicture(profileData?.profilePicture || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80");
        
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
        
        {/* Profile Header section - Centered Design */}
        <div className="pt-16 pb-10 flex flex-col items-center relative">
          {/* Avatar */}
          <div className="relative mb-6">
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border-[6px] border-white shadow-sm overflow-hidden bg-gray-200 shrink-0">
              <img src={profilePicture || profile?.profilePicture || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"} alt={profile?.name || user?.name} className="w-full h-full object-cover" />
            </div>
            {/* Camera icon button */}
            {isEditing && (
              <>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                <button disabled={isUploading} onClick={() => fileInputRef.current?.click()} className="absolute bottom-1 right-1 w-8 h-8 bg-[#006782] text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm hover:bg-[#004E63] transition-colors disabled:opacity-50">
                  {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
                </button>
              </>
            )}
          </div>

          {/* User Info */}
          {isEditing ? (
            <div className="flex flex-col gap-3 w-full max-w-xs mb-4">
              <input 
                type="text" 
                value={editName} 
                onChange={e => setEditName(e.target.value)}
                className="w-full text-center text-xl font-bold border-b-2 border-[#006782] focus:outline-none bg-transparent pb-1"
                placeholder="Full Name"
              />
              <div className="flex items-center gap-2 border-b-2 border-gray-200 focus-within:border-[#006782] transition-colors pb-1">
                <Globe size={16} className="text-gray-400" />
                <input 
                  type="text" 
                  value={editCity} 
                  onChange={e => setEditCity(e.target.value)}
                  className="w-full text-center text-sm font-medium focus:outline-none bg-transparent"
                  placeholder="City"
                />
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-black text-gray-900 mb-2">{profile?.name || user?.name || "User Name"}</h1>
              <div className="flex items-center gap-1.5 text-gray-500 font-medium text-sm mb-4">
                <Globe size={14} />
                <span>{profile?.city || profile?.location || "Location not set"}</span>
              </div>
            </>
          )}

          {/* Stats */}
          <div className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-6">
            <span>{profile?.stats?.attended || 0} Events Attended</span>
            <span className="text-gray-400">•</span>
            <span>{profile?.stats?.followers || 0} Followers</span>
            <span className="text-gray-400">•</span>
            <span>{profile?.stats?.following || 0} Following</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {isEditing ? (
              <>
                <Button onClick={() => setIsEditing(false)} variant="outline" className="h-10 px-4 rounded-full font-bold border-gray-200 hover:bg-gray-50 text-gray-700 shadow-sm flex items-center gap-2">
                  <X size={16} /> Cancel
                </Button>
                <Button disabled={isSaving || isUploading} onClick={handleSaveProfile} className="h-10 px-6 rounded-full font-bold bg-[#006782] hover:bg-[#004E63] text-white shadow-sm flex items-center gap-2">
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} Save
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => setIsEditing(true)} variant="outline" className="h-10 px-6 rounded-full font-bold border-gray-200 hover:bg-gray-50 text-gray-700 shadow-sm flex items-center gap-2">
                  <Edit2 size={16} /> Edit Profile
                </Button>
                <Button variant="outline" className="w-10 h-10 rounded-full border-gray-200 hover:bg-gray-50 text-gray-700 shadow-sm p-0 flex items-center justify-center shrink-0">
                  <Share2 size={18} />
                </Button>
              </>
            )}
          </div>
        </div>

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
                      {tickets.map((registration: any) => (
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
