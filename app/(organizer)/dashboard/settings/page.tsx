"use client";

import { useState } from "react";
import { Upload, Camera, Save, Globe, Link as LinkIcon, Briefcase, MessageSquare, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrganizerSettingsPage() {
  const [loading, setLoading] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Organizer Settings</h1>
        <p className="text-gray-500 mt-2">Manage your public organizer profile and contact information.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Profile Image Section */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Profile Image</h2>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative w-32 h-32 rounded-full bg-gray-100 border-4 border-white shadow-md flex flex-col items-center justify-center overflow-hidden group cursor-pointer">
              <Camera size={32} className="text-gray-400 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium text-gray-500">Upload Logo</span>
              
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Upload className="text-white w-8 h-8" />
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-1">Upload a new profile image</h3>
              <p className="text-sm text-gray-500 mb-4">
                Recommended size is 512x512 pixels. Maximum file size is 5MB. Supported formats: JPG, PNG, WEBP.
              </p>
              <div className="flex gap-3">
                <Button type="button" variant="outline" className="h-9 px-4 rounded-full font-medium">
                  Choose File
                </Button>
                <Button type="button" variant="ghost" className="h-9 px-4 rounded-full font-medium text-red-500 hover:text-red-600 hover:bg-red-50">
                  Remove
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">Organizer Name</label>
              <input 
                type="text" 
                defaultValue="Nextt Events"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#006782] focus:border-transparent transition-all"
                placeholder="Enter your organization name"
              />
            </div>
            
            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">About / Bio</label>
              <textarea 
                rows={4}
                defaultValue="We create unforgettable tech conferences and networking events."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#006782] focus:border-transparent transition-all resize-none"
                placeholder="Tell attendees about what kind of events you organize..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input 
                type="email" 
                defaultValue="contact@nexttevents.com"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#006782] focus:border-transparent transition-all"
                placeholder="hello@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input 
                type="tel" 
                defaultValue="+1 (555) 123-4567"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#006782] focus:border-transparent transition-all"
                placeholder="+1 (555) 000-0000"
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
                  defaultValue="https://nexttevents.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#006782] focus:border-transparent transition-all"
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
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#006782] focus:border-transparent transition-all"
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
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#006782] focus:border-transparent transition-all"
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
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#006782] focus:border-transparent transition-all"
                  placeholder="LinkedIn Profile URL"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Button type="button" variant="ghost" className="px-6 rounded-full font-medium">
            Cancel
          </Button>
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
