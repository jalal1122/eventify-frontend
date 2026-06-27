"use client";

import { useFormContext } from "react-hook-form";
import { EventFormValues } from "../schema";

export default function LocationMap() {
  const { watch } = useFormContext<EventFormValues>();
  const venueName = watch("venueName") || "";
  const city = watch("city") || "";
  const address = watch("address") || "";

  const searchQuery = `${venueName} ${address} ${city}`.trim();
  
  if (!searchQuery) {
    return (
      <div className="w-full h-[250px] bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200">
        <p className="text-gray-400 font-medium">Enter an address to see the map</p>
      </div>
    );
  }

  // Using a simple OpenStreetMap iframe embed for demonstration
  return (
    <div className="w-full h-[250px] rounded-xl overflow-hidden border border-slate-200 relative bg-slate-50">
       <iframe 
         title="Location Map"
         width="100%" 
         height="100%" 
         frameBorder="0" 
         scrolling="no" 
         src={`https://maps.google.com/maps?q=${encodeURIComponent(searchQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`} 
         className="absolute inset-0"
       />
       <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-[10px] text-gray-500 shadow-sm opacity-70 pointer-events-none">
         Map Preview
       </div>
    </div>
  );
}

