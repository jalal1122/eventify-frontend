"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { organizerApi } from "@/lib/api";

export type Profile = {
  _id: string;
  id?: string;
  brandName: string;
  logoUrl?: string;
  bio?: string;
  contactEmail?: string;
  socialLinks?: {
    website?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    youtube?: string;
  };
  followers?: number;
};

interface OrganizerContextType {
  profiles: Profile[];
  activeProfileId: string | "all" | null;
  activeProfile: Profile | null;
  setActiveProfileId: (id: string | "all") => void;
  isLoadingProfiles: boolean;
  refreshProfiles: () => Promise<void>;
}

const OrganizerContext = createContext<OrganizerContextType | undefined>(undefined);

export function OrganizerProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | "all" | null>(null);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(true);

  const fetchProfiles = async () => {
    try {
      setIsLoadingProfiles(true);
      const res = await organizerApi.getProfiles();
      if (res.data.success) {
        const fetchedProfiles = res.data.profiles || [];
        setProfiles(fetchedProfiles);
        
        // Auto-select "all" or the first profile if nothing is selected
        if (!activeProfileId && fetchedProfiles.length > 0) {
          setActiveProfileId("all");
        }
      }
    } catch (error) {
      console.error("Failed to fetch organizer profiles:", error);
    } finally {
      setIsLoadingProfiles(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === "organizer") {
      fetchProfiles();
    } else if (!isAuthenticated) {
      setProfiles([]);
      setActiveProfileId(null);
      setIsLoadingProfiles(false);
    }
  }, [isAuthenticated, user?.role]);

  const activeProfile = profiles.find((p) => (p._id || p.id) === activeProfileId) || null;

  return (
    <OrganizerContext.Provider
      value={{
        profiles,
        activeProfileId,
        activeProfile,
        setActiveProfileId,
        isLoadingProfiles,
        refreshProfiles: fetchProfiles,
      }}
    >
      {children}
    </OrganizerContext.Provider>
  );
}

export function useOrganizer() {
  const context = useContext(OrganizerContext);
  if (context === undefined) {
    throw new Error("useOrganizer must be used within an OrganizerProvider");
  }
  return context;
}
