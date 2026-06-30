import Link from "next/link";
import { Calendar, MapPin, Share2, Star, Users } from "lucide-react";
import { type Event } from "@/types/event";
import { formatShortDate } from "@/lib/utils";

interface EventBannerCardProps {
  event: Event;
}

export function EventBannerCard({ event }: EventBannerCardProps) {
  const isFree = !event.tickets || !event.tickets.some(t => t.type === "PAID");

  return (
    <div className="w-full bg-white rounded-3xl border border-[#F3F4F6] shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col group">
      {/* Banner Image Area */}
      <div className="w-full aspect-[16/9] md:aspect-[21/9] relative bg-gray-100 overflow-hidden shrink-0">
        <img 
          src={event.bannerUrl || event.cardImageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=80"} 
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        
        <div className="absolute top-4 left-4">
          <div className="bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center shadow-sm">
            <span className="w-2 h-2 rounded-full bg-blue-600 mr-2" />
            {(event.organizerProfileId as any)?.brandName || "Organizer"}
          </div>
        </div>

        <div className="absolute bottom-4 left-4">
          <div className="bg-white text-gray-900 text-xs font-bold px-3 py-1.5 rounded-md shadow-sm uppercase tracking-wide">
            {event.category || "Event"}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center text-sm font-semibold text-gray-500">
            <Users size={16} className="mr-1.5 text-gray-400" />
            {event.interestedCount || "100+"} interested
          </div>
          <div className={`text-xs font-bold px-3 py-1.5 rounded-md ${isFree ? "bg-[#E6F0F3] text-[#006782]" : "bg-orange-100 text-orange-700"}`}>
            {isFree ? "Free" : "Paid"}
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
          {event.title}
        </h3>
        
        <p className="text-sm text-gray-600 mb-6 line-clamp-2 leading-relaxed">
          {event.description || "Join us for an amazing event experience."}
        </p>

        <div className="space-y-3 mb-6 mt-auto">
          <div className="flex items-center text-sm text-gray-500 font-medium">
            <Calendar size={16} className="mr-3 shrink-0" />
            <span>{formatShortDate(event.dateTime)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500 font-medium">
            <MapPin size={16} className="mr-3 shrink-0" />
            <span className="truncate">{event.venueName}, {event.city}</span>
          </div>
        </div>

        <div className="h-[1px] w-full bg-[#F3F4F6] mb-6" />

        <div className="flex items-center gap-3">
          <button className="flex-1 md:flex-none md:w-[160px] h-12 rounded-xl border border-[#D1D5DB] text-gray-700 font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
            <Star size={18} />
            Interested
          </button>
          <Link href={`/events/${event._id}`} className="flex-1">
            <button className="w-full h-12 rounded-xl bg-[#006782] text-white font-semibold flex items-center justify-center hover:bg-[#004E63] transition-colors">
              View & Register
            </button>
          </Link>
          <button className="w-12 h-12 shrink-0 rounded-xl border border-[#D1D5DB] text-gray-500 flex items-center justify-center hover:bg-gray-50 transition-colors">
            <Share2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
