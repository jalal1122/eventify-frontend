"use client";

import { useState, useEffect } from "react";
import { Upload, Camera, Save, Globe, Briefcase, MessageSquare, Image as ImageIcon, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOrganizer } from "@/context/OrganizerContext";
import { organizerApi, eventsApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import Link from "next/link";

export default function EditOrganizerProfilePage() {
  const { activeProfile, activeProfileId, refreshProfiles } = useOrganizer();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [formData, setFormData] = useState({
    brandName: "",
    bio: "",
    contactEmail: "",
    logoUrl: "",
    socialLinks: {
      website: "",
      twitter: "",
      instagram: "",
      linkedin: ""
    }
  });

  useEffect(() => {
    if (activeProfileId === "all") {
      router.push("/dashboard/settings");
    } else if (activeProfile) {
      setFormData({
        brandName: activeProfile.brandName || "",
        bio: activeProfile.bio || "",
        contactEmail: activeProfile.contactEmail || "",
        logoUrl: activeProfile.logoUrl || "",
        socialLinks: {
          website: activeProfile.socialLinks?.website || "",
          twitter: activeProfile.socialLinks?.twitter || "",
          instagram: activeProfile.socialLinks?.instagram || "",
          linkedin: activeProfile.socialLinks?.linkedin || ""
        }
      });
    }
  }, [activeProfile, activeProfileId, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProfile) return;
    
    setLoading(true);
    try {
      await organizerApi.updateProfile(activeProfile._id || activeProfile.id as string, formData);
      await refreshProfiles();
      router.push("/dashboard/settings");
    } catch (error) {
      console.error("Failed to update profile", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadingLogo(true);
    try {
      const res = await eventsApi.uploadImage(e.target.files[0]);
      if (res.data.url) {
        setFormData(prev => ({ ...prev, logoUrl: res.data.url }));
      }
    } catch (error) {
      console.error("Failed to upload logo", error);
      alert("Failed to upload logo. Please try again.");
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSocialChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [field]: value
      }
    }));
  };

  if (!activeProfile || activeProfileId === "all") return null;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link href="/dashboard/settings" className="flex items-center gap-2 text-gray-500 hover:text-[#006782] transition-colors mb-4 text-sm font-medium">
          <ArrowLeft size={16} />
          Back to Settings
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Edit Organizer Profile</h1>
        <p className="text-gray-500 mt-2">Update your public presence, contact details, and social links.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Profile Image Section */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Profile Logo</h2>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div 
              className="relative w-32 h-32 rounded-full bg-gray-100 border-4 border-white shadow-md flex flex-col items-center justify-center overflow-hidden group cursor-pointer"
              onClick={() => !uploadingLogo && fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleLogoUpload} 
                accept="image/*" 
                className="hidden" 
              />
              {uploadingLogo ? (
                <div className="flex flex-col items-center text-gray-400">
                  <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mb-2"></div>
                </div>
              ) : formData.logoUrl ? (
                <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <>
                  <Camera size={32} className="text-gray-400 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium text-gray-500">Upload Logo</span>
                </>
              )}
              
              {!uploadingLogo && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Upload className="text-white w-8 h-8" />
                </div>
              )}
            </div>
            
            <div className="flex-1 w-full">
              <h3 className="font-medium text-gray-900 mb-1">Upload Profile Logo</h3>
              <p className="text-sm text-gray-500">
                Recommended size: 500x500px. Max size: 2MB. Click the image placeholder to select a file.
              </p>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Basic Information</h2>
          
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Organizer Name</label>
              <input 
                type="text" 
                required
                value={formData.brandName}
                onChange={e => setFormData({...formData, brandName: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#006782] focus:border-transparent transition-all"
                placeholder="Enter your organization name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">About / Bio</label>
              <textarea 
                rows={4}
                value={formData.bio}
                onChange={e => setFormData({...formData, bio: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#006782] focus:border-transparent transition-all resize-none"
                placeholder="Tell attendees about what kind of events you organize..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
              <input 
                type="email" 
                value={formData.contactEmail}
                onChange={e => setFormData({...formData, contactEmail: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#006782] focus:border-transparent transition-all"
                placeholder="hello@example.com"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Social & Links</h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                <Globe className="w-5 h-5 text-gray-500" />
              </div>
              <div className="flex-1">
                <input 
                  type="url" 
                  value={formData.socialLinks.website}
                  onChange={e => handleSocialChange("website", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#006782]"
                  placeholder="Website URL"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-5 h-5 text-blue-500" />
              </div>
              <div className="flex-1">
                <input 
                  type="url" 
                  value={formData.socialLinks.twitter}
                  onChange={e => handleSocialChange("twitter", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#006782]"
                  placeholder="Twitter Profile URL"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center flex-shrink-0">
                <ImageIcon className="w-5 h-5 text-pink-500" />
              </div>
              <div className="flex-1">
                <input 
                  type="url" 
                  value={formData.socialLinks.instagram}
                  onChange={e => handleSocialChange("instagram", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#006782]"
                  placeholder="Instagram Profile URL"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <input 
                  type="url" 
                  value={formData.socialLinks.linkedin}
                  onChange={e => handleSocialChange("linkedin", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#006782]"
                  placeholder="LinkedIn Profile URL"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Link href="/dashboard/settings">
            <Button type="button" variant="ghost" className="px-6 rounded-full font-medium">
              Cancel
            </Button>
          </Link>
          <Button 
            type="submit" 
            disabled={loading}
            className="bg-[#006782] hover:bg-[#004E63] text-white px-8 h-12 rounded-full font-bold flex items-center gap-2 transition-all"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={18} />
            )}
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
