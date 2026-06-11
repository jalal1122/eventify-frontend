import Link from "next/link";
import { Calendar, MapPin, Users } from "lucide-react";
import { type Event } from "@/types/event";
import { formatShortDate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const isFree = !event.isPaid || event.ticketPrice === 0;

  return (
    <Link href={`/events/${event._id}`}>
      <Card className="group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer border-[#F3F4F6]">
        {/* Image Header */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
          {event.cardImageUrl || event.bannerUrl ? (
            <img
              src={event.cardImageUrl || event.bannerUrl}
              alt={event.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-200">
              <span className="text-gray-400">No Image</span>
            </div>
          )}

          {/* Top Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            {event.category && (
              <Badge variant="secondary" className="bg-white/90 backdrop-blur text-xs px-3 shadow-sm text-gray-800">
                {event.category}
              </Badge>
            )}
            <Badge 
              variant="default" 
              className={isFree ? "bg-[#006782] shadow-sm" : "bg-gray-900 shadow-sm"}
            >
              {isFree ? "Free" : `Rs ${event.ticketPrice}`}
            </Badge>
          </div>
        </div>

        <CardContent className="p-5">
          {/* Title */}
          <h3 className="line-clamp-2 text-lg font-bold leading-tight text-gray-900 mb-4 group-hover:text-[#006782] transition-colors">
            {event.title}
          </h3>

          {/* Details */}
          <div className="flex flex-col gap-2.5 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="shrink-0 text-gray-400" />
              <span className="truncate">{formatShortDate(event.dateTime)}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <MapPin size={16} className="shrink-0 text-gray-400" />
              <span className="truncate">{event.venueName}, {event.city}</span>
            </div>

            <div className="flex items-center gap-2">
              <Users size={16} className="shrink-0 text-gray-400" />
              <span>{event.interestedCount} interested</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
