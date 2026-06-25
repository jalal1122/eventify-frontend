"use client";

import { useFormContext } from "react-hook-form";
import { EventFormValues } from "../schema";
import { CheckCircle2, Copy, Users, ExternalLink, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";

export default function SuccessScreen({ 
  title, 
  eventId,
  organizerProfileId
}: { 
  title?: string;
  eventId?: string;
  organizerProfileId?: string;
}) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#F8FAFC]">
      {/* Background decoration */}
      <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-[#006782]/10 to-transparent" />
      
      <div className="bg-white max-w-lg w-full mx-4 rounded-3xl shadow-xl overflow-hidden relative z-10 animate-in zoom-in-95 duration-500">
        <div className="h-2 w-full bg-gradient-to-r from-[#006782] to-[#004E63]" />
        
        <div className="p-10 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          
          <h1 className="text-3xl font-bold text-[#001F29] mb-2">Event is sent for review</h1>
          <p className="text-gray-500 mb-8 max-w-md">
            "{title || "Your event"}" has been submitted successfully. Our team will review it shortly. Once approved, it will be live!
          </p>

          <div className="w-full mb-8">
            {/* Manage Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-left flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <Settings className="w-4 h-4 text-[#006782]" />
                <h3 className="font-semibold text-[#001F29]">Manage Event</h3>
              </div>
              <p className="text-xs text-gray-500 mb-3 flex-1">Access your dashboard to view analytics, manage attendees, and make updates.</p>
              <Button onClick={() => router.push(`/organizers/${organizerProfileId}`)} variant="outline" className="w-full border-gray-300 text-[#006782]">
                <Users className="w-4 h-4 mr-2" />
                View Dashboard
              </Button>
            </div>
          </div>

          <div className="flex gap-4 w-full flex-col sm:flex-row">
            <Button onClick={() => window.location.href = '/events/create'} variant="ghost" className="flex-1 text-gray-500 hover:text-[#001F29]">
              Create another event
            </Button>
            <Button onClick={() => router.push(`/events/${eventId}`)} className="flex-1 bg-[#006782] hover:bg-[#004E63] text-white">
              View Public Page
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

