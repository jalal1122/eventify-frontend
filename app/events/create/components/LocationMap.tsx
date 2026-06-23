"use client";

import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

export default function LocationMap() {
  const { watch } = useFormContext();
  const venueName = watch("venueName");
  const city = watch("city");
  const address = watch("address");
  const [mapUrl, setMapUrl] = useState<string>("");

  useEffect(() => {
    // Debounce the map update slightly so we don't spam the iframe while typing
    const timeoutId = setTimeout(() => {
      const queryParts = [venueName, address, city].filter(Boolean);
      if (queryParts.length > 0) {
        const query = encodeURIComponent(queryParts.join(", "));
        // Using OpenStreetMap for a free static-like embed
        setMapUrl(`https://nominatim.openstreetmap.org/ui/map.html?q=${query}&zoom=14`);
      } else {
        setMapUrl(""); // Or a default location if preferred
      }
    }, 800);

    return () => clearTimeout(timeoutId);
  }, [venueName, city, address]);

  if (!mapUrl) {
    return (
      <div className="w-full h-48 bg-gray-100 border border-gray-200 rounded-xl flex items-center justify-center text-sm text-gray-400 mt-4 overflow-hidden relative group">
        {/* Placeholder image resembling the design */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center opacity-20 filter grayscale"></div>
        <div className="relative z-10 flex items-center gap-2 px-4 py-2 bg-white/90 shadow-sm rounded-full font-medium text-gray-700">
          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
          Static Map Preview
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-64 mt-4 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
      <iframe
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        marginHeight={0}
        marginWidth={0}
        src={mapUrl}
        title="Location Map"
        className="w-full h-full"
      ></iframe>
    </div>
  );
}
