"use client";

import { useFormContext } from "react-hook-form";
import { EventFormValues } from "../schema";
import { CheckCircle2, Copy, Users, ExternalLink, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SuccessScreen() {
  const { watch } = useFormContext<EventFormValues>();
  const title = watch("title");
  
  // Dummy event ID for demo purposes
  const eventUrl = `https://eventify.com/e/preview-123`;

  const handleCopy = () => {
    navigator.clipboard.writeText(eventUrl);
    alert("Link copied to clipboard!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#F8FAFC]">
      {/* Background decoration */}
      <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-[#006782]/10 to-transparent" />
      
      <div className="bg-white max-w-2xl w-full mx-4 rounded-3xl shadow-xl overflow-hidden relative z-10 animate-in zoom-in-95 duration-500">
        <div className="h-2 w-full bg-gradient-to-r from-[#006782] to-[#004E63]" />
        
        <div className="p-10 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          
          <h1 className="text-3xl font-bold text-[#001F29] mb-2">Event is sent for review</h1>
          <p className="text-gray-500 mb-8 max-w-md">
            "{title || "Your event"}" has been submitted successfully. Our team will review it shortly. Once approved, it will be live!
          </p>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {/* Share Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-left">
              <div className="flex items-center gap-2 mb-2">
                <ExternalLink className="w-4 h-4 text-[#006782]" />
                <h3 className="font-semibold text-[#001F29]">Share Event Link</h3>
              </div>
              <p className="text-xs text-gray-500 mb-3">Copy your event link to share with your audience.</p>
              <div className="flex bg-white border border-gray-300 rounded-lg overflow-hidden">
                <input 
                  type="text" 
                  readOnly 
                  value={eventUrl} 
                  className="px-3 py-2 text-sm text-gray-600 flex-1 outline-none bg-transparent"
                />
                <button 
                  onClick={handleCopy}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border-l border-gray-300"
                  title="Copy link"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Manage Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-left flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <Settings className="w-4 h-4 text-[#006782]" />
                <h3 className="font-semibold text-[#001F29]">Manage Event</h3>
              </div>
              <p className="text-xs text-gray-500 mb-3 flex-1">Access your dashboard to view analytics, manage attendees, and make updates.</p>
              <Button variant="outline" className="w-full border-gray-300 text-[#006782]">
                <Users className="w-4 h-4 mr-2" />
                View Dashboard
              </Button>
            </div>
          </div>

          <div className="flex gap-4">
            <Button variant="ghost" className="text-gray-500 hover:text-[#001F29]">
              Create another event
            </Button>
            <Button className="bg-[#006782] hover:bg-[#004E63] text-white px-8">
              View Public Page
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

