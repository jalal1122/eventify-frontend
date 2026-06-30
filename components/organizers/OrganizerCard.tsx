import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin, Users, CheckCircle2 } from "lucide-react";

interface OrganizerCardProps {
  organizer: {
    _id: string;
    brandName: string;
    logoUrl?: string;
    city?: string;
    followersCount?: number;
    bio?: string;
    isVerified?: boolean;
  };
  onUnfollow?: (id: string) => void;
}

export function OrganizerCard({ organizer, onUnfollow }: OrganizerCardProps) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative flex flex-col h-full">
      <Link href={`/organizers/${organizer._id}`} className="flex-1">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gray-50 overflow-hidden shrink-0 border border-gray-100 flex items-center justify-center">
            {organizer.logoUrl ? (
              <img src={organizer.logoUrl} alt={organizer.brandName} className="w-full h-full object-cover" />
            ) : (
              <span className="font-black text-[#006782] text-xl">
                {organizer.brandName.charAt(0)}
              </span>
            )}
          </div>
          <div className="flex-1 pt-1">
            <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-1 mb-1 flex items-center gap-1.5">
              {organizer.brandName}
              {organizer.isVerified && (
                <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
              )}
            </h3>
            <div className="flex items-center gap-3 text-xs font-semibold text-gray-500">
              {organizer.city && (
                <span className="flex items-center gap-1">
                  <MapPin size={12} /> {organizer.city}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Users size={12} /> {organizer.followersCount || 0} Followers
              </span>
            </div>
          </div>
        </div>
        
        {organizer.bio && (
          <p className="text-sm text-gray-600 line-clamp-2 font-medium mb-6">
            {organizer.bio}
          </p>
        )}
      </Link>
      
      <div className="mt-auto pt-4 border-t border-gray-100">
        {onUnfollow ? (
          <Button 
            variant="outline" 
            className="w-full h-10 rounded-xl text-sm font-bold border-gray-200 text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              onUnfollow(organizer._id);
            }}
          >
            Following
          </Button>
        ) : (
          <Link href={`/organizers/${organizer._id}`} className="w-full">
            <Button className="w-full h-10 rounded-xl text-sm font-bold bg-[#006782] hover:bg-[#004E63] text-white">
              View Profile
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
