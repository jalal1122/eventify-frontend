"use client";

import { useState, useEffect, useCallback } from "react";
import { eventsApi } from "@/lib/api";
import { type Event } from "@/types/event";

export interface DiscoverFilters {
  q?: string;
  category?: string;
  city?: string;
  sort?: "soonest" | "trending";
  startDate?: string;
  endDate?: string;
  locationType?: string;
}

export function useEvents(initialFilters: DiscoverFilters = {}) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<DiscoverFilters>(initialFilters);

  const fetchEvents = useCallback(async (currentFilters: DiscoverFilters) => {
    try {
      setLoading(true);
      setError(null);
      const res = await eventsApi.discover({
        q: currentFilters.q,
        category: currentFilters.category && currentFilters.category !== "All" ? currentFilters.category : undefined,
        city: currentFilters.city && currentFilters.city !== "All" ? currentFilters.city : undefined,
        sort: currentFilters.sort,
        startDate: currentFilters.startDate,
        endDate: currentFilters.endDate,
        locationType: currentFilters.locationType && currentFilters.locationType !== "All" ? currentFilters.locationType : undefined,
        limit: 20, // Example fixed limit
      });
      setEvents(res.data.events);
    } catch (err) {
      console.error(err);
      setError("Failed to load events. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents(filters);
  }, [filters, fetchEvents]);

  const updateFilters = useCallback((newFilters: Partial<DiscoverFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  return { events, loading, error, filters, updateFilters, refetch: () => fetchEvents(filters) };
}
