import Link from "next/link";
import { MapPin, CheckCircle2, Star, Share2 } from "lucide-react";
import { type Event } from "@/types/event";
import { formatEventCardDate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface EventCardProps {
  event: Event;
  attended?: boolean;
  href?: string;
}

export function EventCard({ event, attended, href }: EventCardProps) {
  // If organizer is populated (it might be an object), extract its properties
  const orgName = typeof event.organizerProfileId === 'object' ? event.organizerProfileId.brandName : "Organizer";
  const orgLogo = typeof event.organizerProfileId === 'object' ? event.organizerProfileId.logoUrl : undefined;
  
  // Create a placeholder string for the avatar if logo is missing (e.g., "UA" from "UAP IT Society")
  const orgInitials = orgName.substring(0, 3).toUpperCase();

  const linkHref = href || `/events/${event._id}`;

  return (
    <Link href={linkHref} className="block h-full">
      <Card className="h-full flex flex-col group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer border-gray-100/50 shadow-sm rounded-3xl relative bg-white">
        
        {/* Image Header */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 shrink-0">
          {event.cardImageUrl || event.bannerUrl ? (
            <img
              src={event.cardImageUrl || event.bannerUrl}
              alt={event.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
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
            {event.description}
          </p>

          {/* Location */}
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-5 font-medium">
            <MapPin size={18} className="shrink-0" />
            <span className="truncate">{event.venueName}, {event.city}</span>
          </div>

          {/* Divider */}
          <div className="w-full h-[1px] bg-gray-100 mb-4" />

          {/* Bottom Section: Organizer & Actions */}
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-3">
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
                <button className="hover:text-[#006782] transition-colors p-1" onClick={(e) => e.preventDefault()}>
                  <Star size={20} />
                </button>
              )}
              <button className="hover:text-[#006782] transition-colors p-1" onClick={(e) => e.preventDefault()}>
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
