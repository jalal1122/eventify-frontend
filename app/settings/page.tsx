"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Settings, CheckCircle2, Trash2 } from "lucide-react";
import { mockUserProfile } from "@/lib/dummyData";

export default function AccountSettingsPage() {
  const [authType, setAuthType] = useState<"email" | "google">("google"); // For demo purposes
  const [emailSent, setEmailSent] = useState(true); // For demo of the green alert

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />
      
      <main className="flex-1 py-12 px-4 sm:px-8">
        <div className="max-w-3xl mx-auto flex flex-col gap-8">
          
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-black text-[#006782] mb-2">Account Settings</h1>
            <p className="text-gray-500 font-medium text-sm">Manage your personal information and security preferences.</p>
          </div>

          {/* Profile Quick Edit */}
          <div className="flex flex-col items-center mb-4">
            <div className="relative mb-4">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 border-2 border-white shadow-sm shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80" 
                  alt={mockUserProfile.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-[#006782] text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                <Settings size={12} />
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">{mockUserProfile.name}</h2>
            <p className="text-gray-500 text-sm font-medium mb-4">{mockUserProfile.email}</p>
            <Link href="/profile/edit">
              <Button variant="outline" className="h-9 px-6 rounded-full font-bold border-gray-200 hover:bg-gray-50 text-gray-700 shadow-sm text-sm">
                Edit Profile
              </Button>
            </Link>
          </div>

          <div className="w-full h-[1px] bg-gray-100" />

          {/* Contact Information */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h3>
            
            <div className="flex flex-col gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <Mail size={18} />
                    </div>
                    <input 
                      type="email" 
                      defaultValue={mockUserProfile.email}
                      className="w-full h-11 pl-12 pr-4 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#006782] outline-none font-medium text-gray-900"
                    />
                  </div>
                  <Button className="h-11 px-8 rounded-xl bg-[#006782] hover:bg-[#004E63] text-white font-bold shrink-0">
                    Save
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <Phone size={18} />
                    </div>
                    <input 
                      type="tel" 
                      defaultValue="+92 300 0000000"
                      className="w-full h-11 pl-12 pr-4 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#006782] outline-none font-medium text-gray-900"
                    />
                  </div>
                  <Button className="h-11 px-8 rounded-xl bg-[#006782] hover:bg-[#004E63] text-white font-bold shrink-0">
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Password Section */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Demo Toggle Banner */}
            <div className="bg-gray-50 px-6 py-2 border-b border-gray-100 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Demo Mode Toggle</span>
              <div className="flex gap-2">
                <button onClick={() => setAuthType("google")} className={`text-xs font-bold px-3 py-1 rounded-md ${authType === "google" ? "bg-[#006782] text-white" : "bg-gray-200 text-gray-600"}`}>Google Auth</button>
                <button onClick={() => setAuthType("email")} className={`text-xs font-bold px-3 py-1 rounded-md ${authType === "email" ? "bg-[#006782] text-white" : "bg-gray-200 text-gray-600"}`}>Email Auth</button>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              {authType === "google" ? (
                // Google Auth State
                <div className="flex flex-col items-start border-l-4 border-[#006782] pl-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Password</h3>
                  <p className="text-gray-500 font-medium text-sm mb-4">
                    You currently sign in using your Google Account. There is no local password set for this account yet.
                  </p>
                  <Button className="h-10 px-6 rounded-lg bg-[#006782] hover:bg-[#004E63] text-white font-bold mb-4 text-sm">
                    Set Password
                  </Button>
                  
                  {emailSent && (
                    <div className="w-full p-4 rounded-xl bg-green-50/50 border border-green-100 flex items-center gap-2 text-green-700 text-sm font-medium">
                      <CheckCircle2 size={18} className="shrink-0" />
                      <span>We've sent you an email with a link to set your password.</span>
                    </div>
                  )}
                </div>
              ) : (
                // Email Auth State
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Set new password</h3>
                  
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Current Password</label>
                      <input 
                        type="password" 
                        defaultValue="••••••••"
                        className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#006782] outline-none font-medium text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
                      <input 
                        type="password" 
                        defaultValue="••••••••"
                        className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#006782] outline-none font-medium text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Repeat Password</label>
                      <input 
                        type="password" 
                        defaultValue="••••••••"
                        className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#006782] outline-none font-medium text-gray-900"
                      />
                    </div>
                    
                    <div className="flex justify-end mt-2">
                      <Button className="h-11 px-8 rounded-xl bg-[#006782] hover:bg-[#004E63] text-white font-bold">
                        Save Password
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Event Notifications</h3>
              <p className="text-gray-500 font-medium text-sm">Receive weekly digests and important updates about your events.</p>
            </div>
            <Button variant="secondary" className="h-10 px-6 rounded-lg font-bold bg-gray-200 hover:bg-gray-300 text-gray-700 shrink-0">
              Unsubscribe
            </Button>
          </div>

          {/* Delete Profile */}
          <div className="flex justify-end pr-2">
            <Button variant="ghost" className="text-gray-500 hover:text-red-600 hover:bg-red-50 font-bold flex items-center gap-2">
              <Trash2 size={16} /> Delete Profile
            </Button>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
