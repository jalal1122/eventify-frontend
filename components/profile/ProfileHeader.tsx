import React, { useRef, useState } from "react";
import { Camera, Globe, Loader2, X, Check, Edit2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authApi, eventsApi } from "@/lib/api";

interface ProfileHeaderProps {
  user: any;
  profile: any;
  setProfile: React.Dispatch<React.SetStateAction<any>>;
}

export function ProfileHeader({ user, profile, setProfile }: ProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editCity, setEditCity] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEditClick = () => {
    setEditName(profile?.name || user?.name || "");
    setEditCity(profile?.city || profile?.location || "");
    setProfilePicture(profile?.profilePicture || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80");
    setIsEditing(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(true);
    try {
      const res = await eventsApi.uploadImage(e.target.files[0]);
      if (res.data.url) {
        setProfilePicture(res.data.url);
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
      setProfile((prev: any) => ({ ...prev, name: editName, city: editCity, profilePicture }));
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to save profile", err);
      alert("Failed to save profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const displayPicture = isEditing ? profilePicture : (profile?.profilePicture || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80");

  return (
    <div className="pt-16 pb-10 flex flex-col items-center relative">
      <div className="relative mb-6">
        <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border-[6px] border-white shadow-sm overflow-hidden bg-gray-200 shrink-0">
          <img src={displayPicture} alt={profile?.name || user?.name} className="w-full h-full object-cover" />
        </div>
        {isEditing && (
          <>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
            <button disabled={isUploading} onClick={() => fileInputRef.current?.click()} className="absolute bottom-1 right-1 w-8 h-8 bg-[#006782] text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm hover:bg-[#004E63] transition-colors disabled:opacity-50">
              {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
            </button>
          </>
        )}
      </div>

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
          <h1 className="text-3xl font-black text-gray-900 mb-1">{profile?.name || user?.name || "User Name"}</h1>
          <div className="flex items-center gap-1.5 text-gray-500 font-medium text-sm mb-4">
            <Globe size={14} />
            <span>{profile?.city || profile?.location || "Location not set"}</span>
          </div>
        </>
      )}

      <div className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-6">
        <span>{profile?.stats?.attended || 0} Events Attended</span>
        <span className="text-gray-400">•</span>
        <span>{profile?.stats?.followers || 0} Followers</span>
        <span className="text-gray-400">•</span>
        <span>{profile?.stats?.following || 0} Following</span>
      </div>

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
            <Button onClick={handleEditClick} variant="outline" className="h-10 px-6 rounded-full font-bold border-gray-200 hover:bg-gray-50 text-gray-700 shadow-sm flex items-center gap-2">
              <Edit2 size={16} /> Edit Profile
            </Button>
            <Button variant="outline" className="w-10 h-10 rounded-full border-gray-200 hover:bg-gray-50 text-gray-700 shadow-sm p-0 flex items-center justify-center shrink-0">
              <Share2 size={18} />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
