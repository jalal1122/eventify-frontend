"use client";

import { useState } from "react";
import { useOrganizer } from "@/context/OrganizerContext";
import { Edit, Eye, Copy, AlertTriangle, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { organizerApi } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function OrganizerSettingsPage() {
  const { activeProfile, activeProfileId, refreshProfiles, setActiveProfileId, profiles } = useOrganizer();
  const router = useRouter();
  
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  if (activeProfileId === "all" || !activeProfile) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-8 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <Users size={32} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Organizer Settings</h2>
        <p className="text-gray-500 max-w-md mb-8">
          You are currently viewing aggregated data for all pages. Please select a specific organizer page from the sidebar to manage its settings.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl text-left">
          {profiles.map(p => (
            <button
              key={p._id || p.id}
              onClick={() => setActiveProfileId(p._id || p.id as string)}
              className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-[#006782] hover:shadow-sm bg-white transition-all text-left"
            >
              <div className="w-12 h-12 rounded-lg bg-[#006782] text-white flex items-center justify-center font-bold shrink-0">
                {p.brandName.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{p.brandName}</h3>
                <p className="text-sm text-gray-500">{p.followers || 0} followers</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const handleDelete = async () => {
    if (deleteConfirmText !== "DELETE") return;
    
    try {
      setIsDeleting(true);
      await organizerApi.deleteProfile(activeProfile._id || activeProfile.id as string);
      await refreshProfiles();
      setActiveProfileId("all");
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to delete profile:", error);
      alert("Failed to delete the organizer page.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Organizer Settings</h1>
        <p className="text-gray-500 mt-2">Manage your public profile, preferences, and account lifecycle.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-2xl bg-[#1E293B] text-white flex items-center justify-center text-3xl font-bold mb-4 overflow-hidden border-2 border-white shadow-sm">
              {activeProfile.logoUrl ? (
                <img src={activeProfile.logoUrl} alt={activeProfile.brandName} className="w-full h-full object-cover" />
              ) : (
                activeProfile.brandName.substring(0, 4).toUpperCase()
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-900">{activeProfile.brandName}</h2>
            <div className="flex items-center gap-2 text-gray-500 mt-1">
              <Users size={16} />
              <span className="text-sm">{activeProfile.followers || 0} followers</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-1">
            <Link 
              href="/dashboard/settings/edit" 
              className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 text-gray-700 font-medium transition-colors"
            >
              <div className="flex items-center gap-3">
                <Edit size={18} className="text-gray-400" />
                Edit page
              </div>
              <span className="text-gray-300">&gt;</span>
            </Link>
            <Link 
              href={`/organizers/${activeProfile._id || activeProfile.id}`} 
              target="_blank"
              className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 text-gray-700 font-medium transition-colors"
            >
              <div className="flex items-center gap-3">
                <Eye size={18} className="text-gray-400" />
                Preview
              </div>
              <span className="text-gray-300">&gt;</span>
            </Link>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/organizers/${activeProfile._id || activeProfile.id}`);
                alert("URL Copied!");
              }}
              className="flex w-full items-center justify-between p-3 rounded-xl hover:bg-gray-50 text-gray-700 font-medium transition-colors outline-none"
            >
              <div className="flex items-center gap-3">
                <Copy size={18} className="text-gray-400" />
                Copy URL
              </div>
              <span className="text-gray-300">&gt;</span>
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">General Information</h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Organizer Name</label>
                <input 
                  type="text" 
                  disabled
                  value={activeProfile.brandName}
                  className="w-full px-4 py-3 bg-gray-50 text-gray-600 rounded-xl border border-gray-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Email</label>
                <input 
                  type="email" 
                  disabled
                  value={activeProfile.contactEmail || "Not provided"}
                  className="w-full px-4 py-3 bg-gray-50 text-gray-600 rounded-xl border border-gray-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  disabled
                  value="+92315878421221"
                  className="w-full px-4 py-3 bg-gray-50 text-gray-600 rounded-xl border border-gray-200"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-red-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0 text-red-600">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Delete Organizer Page</h2>
                <p className="text-gray-600 mb-6">
                  Permanently remove your organizer profile, all associated events, and analytics data. This action is irreversible and cannot be undone once confirmed.
                </p>

                <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                  <label className="block text-sm font-bold text-gray-900 mb-3">
                    To confirm, type <span className="text-red-600 font-black">"DELETE"</span> below
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input 
                      type="text"
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      placeholder="Type DELETE to confirm"
                      className="flex-1 px-4 py-3 rounded-xl border border-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
                    />
                    <Button 
                      onClick={handleDelete}
                      disabled={deleteConfirmText !== "DELETE" || isDeleting}
                      className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 h-auto rounded-xl font-bold disabled:opacity-50"
                    >
                      {isDeleting ? "Deleting..." : "Delete this page"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
