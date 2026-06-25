"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Lock, Info } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { authApi } from "@/lib/api";

export default function EditProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (user) {
      const parts = user.name ? user.name.split(" ") : [""];
      setFirstName(parts[0] || "");
      setLastName(parts.slice(1).join(" ") || "");
      setCity((user as any).city || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authApi.updateProfile({ 
        name: `${firstName} ${lastName}`.trim(),
        city
      });
      router.push("/profile");
    } catch (err) {
      console.error("Failed to update profile", err);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />
      
      <main className="flex-1 py-12 px-4 sm:px-8">
        <div className="max-w-3xl mx-auto">
          
          <div className="mb-8">
            <h1 className="text-3xl font-black text-gray-900 mb-2">Edit Profile</h1>
            <p className="text-gray-500 font-medium">Manage your public information and account settings.</p>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-10">
            
            {/* Avatar Section */}
            <div className="flex items-center gap-6 mb-10 pb-10 border-b border-gray-100">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80" 
                  alt="Profile" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div>
                <Button variant="outline" className="rounded-full px-6 mb-2 font-bold text-sm h-10">
                  Change Picture
                </Button>
                <p className="text-xs font-medium text-gray-500">JPG, GIF or PNG. Max size of 2MB.</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="flex flex-col gap-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                  <input 
                    type="text" 
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#006782] focus:ring-1 focus:ring-[#006782] outline-none transition-all font-medium text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                  <input 
                    type="text" 
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#006782] focus:ring-1 focus:ring-[#006782] outline-none transition-all font-medium text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock size={18} />
                  </div>
                  <input 
                    type="email" 
                    value={email}
                    disabled
                    className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 font-medium cursor-not-allowed outline-none"
                  />
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-gray-500">
                  <Info size={14} />
                  <span>Email cannot be changed from here, visit account setting.</span>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">City</label>
                <input 
                  type="text" 
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#006782] focus:ring-1 focus:ring-[#006782] outline-none transition-all font-medium text-gray-900"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-100">
                <Button 
                  type="button" 
                  onClick={() => router.back()} 
                  variant="ghost" 
                  className="font-bold text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="h-11 px-8 rounded-xl bg-[#006782] hover:bg-[#004E63] text-white font-bold"
                >
                  Save Changes
                </Button>
              </div>

            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
