// ── User types matching backend schema ────────────────────────────────────

export type UserRole = "attendee" | "organizer" | "admin" | "speaker";
export type AuthProvider = "local" | "google";

export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  portfolio?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  authProvider: AuthProvider;
  role: UserRole;
  city: string;
  profilePicture?: string;
  bio?: string;
  phoneNumber?: string;
  socialLinks?: SocialLinks;
  interestedEvents: string[];
  followedOrganizers: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizerProfile {
  _id: string;
  ownerId: string;
  brandName: string;
  logoUrl?: string;
  bio?: string;
  contactEmail?: string;
  city?: string;
  followersCount?: number;
  socialLinks?: {
    website?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
