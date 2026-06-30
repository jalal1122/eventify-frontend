"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, Globe, CheckCircle2, Star, Share2 } from "lucide-react";
import { type Event } from "@/types/event";
import { formatEventCardDate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { eventsApi } from "@/lib/api";

interface EventCardProps {
  event: Event;
  attended?: boolean;
  href?: string;
}

export function EventCard({ event, attended, href }: EventCardProps) {
  const router = useRouter();
  const { user } = useAuth();
  
  // Local state for interest to allow optimistic UI updates
  const [isInterested, setIsInterested] = useState(false);

  useEffect(() => {
    if (user?.interestedEvents) {
      setIsInterested(user.interestedEvents.includes(event._id));
    } else {
      setIsInterested(false);
    }
  }, [user, event._id]);
  
  // If organizer is populated (it might be an object), extract its properties
  const orgName = typeof event.organizerProfileId === 'object' ? event.organizerProfileId.brandName : "Organizer";
  const orgLogo = typeof event.organizerProfileId === 'object' ? event.organizerProfileId.logoUrl : undefined;
  
  // Create a placeholder string for the avatar if logo is missing (e.g., "UA" from "UAP IT Society")
  const orgInitials = orgName.substring(0, 3).toUpperCase();

  const linkHref = href || `/events/${event._id}`;

  const handleInterestClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.push("/auth/signin");
      return;
    }
    
    setIsInterested((prev) => !prev); // Optimistic UI
    try {
      await eventsApi.toggleInterest(event._id);
    } catch (error) {
      console.error("Failed to toggle interest", error);
      setIsInterested((prev) => !prev); // Revert on failure
    }
  };

  const handleShareClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const eventUrl = `${window.location.origin}/events/${event._id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: `Check out ${event.title} on Eventify!`,
          url: eventUrl,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(eventUrl);
        alert("Event link copied to clipboard!");
      } catch (err) {
        console.error("Failed to copy link:", err);
      }
    }
  };

  return (
    <Link href={linkHref} className="block h-full">
      <Card className="h-full flex flex-col group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer border-gray-100/50 shadow-sm rounded-3xl relative bg-white">
        
        {/* Image Header */}
        <div className="relative w-full overflow-hidden bg-gray-100 shrink-0">
          {event.cardImageUrl || event.bannerUrl ? (
            <img
              src={event.cardImageUrl || event.bannerUrl}
              alt={event.title}
              className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#006782]/5">
              <span className="text-gray-400 font-medium">No Image</span>
            </div>
          )}

          {/* Top Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            {attended ? (
              <Badge variant="secondary" className="bg-[#E6F4EA] text-[#1E8E3E] font-bold text-[10px] tracking-wider px-3 py-1 rounded-full border-none shadow-sm uppercase">
                ATTENDED
              </Badge>
            ) : event.category && (
              <Badge variant="secondary" className="bg-white/40 backdrop-blur-md text-[#BAEAFF] font-bold text-xs px-4 py-1.5 rounded-full border border-white/20 shadow-sm">
                {event.category}
              </Badge>
            )}
          </div>
          
          {/* Subtle gradient overlay to make text pop if we ever place text on it, or just for styling */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <CardContent className="p-6 flex flex-col flex-1">
          {/* Date */}
          <div className="text-[#006782] font-semibold text-sm mb-2 tracking-wide">
            {formatEventCardDate(event.dateTime)}
          </div>

          {/* Title */}
          <h3 className="line-clamp-1 text-[22px] font-black leading-tight text-gray-900 mb-2">
            {event.title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 line-clamp-2 leading-relaxed text-sm mb-4 flex-1">
            {event.description?.replace(/<[^>]*>?/gm, '')}
          </p>

          {/* Location */}
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-5 font-medium">
            {event.locationType === "ONLINE" ? (
              <Globe size={18} className="shrink-0" />
            ) : (
              <MapPin size={18} className="shrink-0" />
            )}
            <span className="truncate">
              {event.locationType === "ONLINE"
                ? `Online${event.platform ? ` via ${event.platform}` : ''}`
                : [event.venueName, event.city].filter(Boolean).join(", ")}
            </span>
          </div>

          {/* Divider */}
          <div className="w-full h-[1px] bg-gray-100 mb-4" />

          {/* Bottom Section: Organizer & Actions */}
          <div className="flex items-center justify-between mt-auto">
            <div 
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              onClick={(e) => {
                e.preventDefault();
                const orgId = typeof event.organizerProfileId === 'object' ? event.organizerProfileId._id : event.organizerProfileId;
                if (orgId) router.push(`/organizers/${orgId}`);
              }}
            >
              <div className="w-10 h-10 rounded-full bg-[#BAEAFF] text-[#006782] flex items-center justify-center font-black text-xs shrink-0 overflow-hidden">
                {orgLogo ? (
                   <img src={orgLogo} alt={orgName} className="w-full h-full object-cover" />
                ) : (
                   orgInitials
                )}
              </div>
              <span className="text-gray-900 font-bold text-sm line-clamp-1">
                {orgName}
              </span>
            </div>
            
            <div className="flex items-center gap-3 text-gray-500">
              {attended ? (
                <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center">
                  <CheckCircle2 size={14} />
                </div>
              ) : (
                <button 
                  className={`transition-colors p-1 ${isInterested ? 'text-yellow-400' : 'hover:text-[#006782]'}`} 
                  onClick={handleInterestClick}
                  aria-label={isInterested ? "Remove interest" : "Mark as interested"}
                >
                  <Star size={20} className={isInterested ? "fill-current" : ""} />
                </button>
              )}
              <button 
                className="hover:text-[#006782] transition-colors p-1" 
                onClick={handleShareClick}
                aria-label="Share event"
              >
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
