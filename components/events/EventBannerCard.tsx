import Link from "next/link";
import { Calendar, MapPin, Share2, Star, Users } from "lucide-react";
import { type Event } from "@/types/event";
import { formatShortDate } from "@/lib/utils";

interface EventBannerCardProps {
  event: Event;
}

export function EventBannerCard({ event }: EventBannerCardProps) {
  const isFree = !event.tickets || !event.tickets.some(t => t.type === "PAID");
  
  const rawOrg = event.organizerProfileId || (event as any).organizerProfile || (event as any).organizer;
  const isObj = rawOrg && typeof rawOrg === 'object';
  const orgName = (isObj ? rawOrg.brandName : null) || "Organizer";

  return (
    <div className="w-full bg-white rounded-3xl border border-[#F3F4F6] shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col group">
      {/* Banner Image Area */}
      <div className="w-full aspect-video md:aspect-[21/9] relative bg-gray-900 overflow-hidden shrink-0">
        <img 
          src={event.bannerUrl || event.cardImageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=80"} 
          alt={event.title}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        
        <div className="absolute top-4 left-4">
          <div className="bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center shadow-sm">
            <span className="w-2 h-2 rounded-full bg-blue-600 mr-2" />
            {orgName}
          </div>
        </div>

        <div className="absolute bottom-4 left-4">
          <div className="bg-white text-gray-900 text-xs font-bold px-3 py-1.5 rounded-md shadow-sm uppercase tracking-wide">
            {event.category || "Event"}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center text-xs font-semibold text-gray-500">
            <Users size={14} className="mr-1.5 text-gray-400" />
            {event.interestedCount || "100+"} interested
          </div>
          <div className={`text-[10px] font-bold px-2.5 py-1 rounded-md ${isFree ? "bg-[#E6F0F3] text-[#006782]" : "bg-orange-100 text-orange-700"}`}>
            {isFree ? "Free" : "Paid"}
          </div>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-1.5 leading-tight">
          {event.title}
        </h3>
        
        <p className="text-xs text-gray-600 mb-4 line-clamp-2 leading-relaxed">
          {event.description || "Join us for an amazing event experience."}
        </p>

        <div className="space-y-2 mb-4 mt-auto">
          <div className="flex items-center text-xs text-gray-500 font-medium">
            <Calendar size={14} className="mr-2 shrink-0" />
            <span>{formatShortDate(event.dateTime)}</span>
          </div>
          <div className="flex items-center text-xs text-gray-500 font-medium">
            <MapPin size={14} className="mr-2 shrink-0" />
            <span className="truncate">{event.venueName}, {event.city}</span>
          </div>
        </div>

        <div className="h-[1px] w-full bg-[#F3F4F6] mb-4" />

        <div className="flex items-center gap-2">
          <button className="flex-1 md:flex-none md:w-[120px] h-9 rounded-xl border border-[#D1D5DB] text-gray-700 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-gray-50 transition-colors">
            <Star size={14} />
            Interested
          </button>
          <Link href={`/events/${event._id}`} className="flex-1">
            <button className="w-full h-9 rounded-xl bg-[#006782] text-white text-xs font-semibold flex items-center justify-center hover:bg-[#004E63] transition-colors">
              View & Register
            </button>
          </Link>
          <button className="w-9 h-9 shrink-0 rounded-xl border border-[#D1D5DB] text-gray-500 flex items-center justify-center hover:bg-gray-50 transition-colors">
            <Share2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
