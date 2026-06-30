export interface SnapshotStats {
  newAttendeesToday: number;
  newAttendeesGrowth: number; // percentage
  newOrganizersToday: number;
  newOrganizersGrowth: number;
  newEventsToday: number;
  newEventsGrowth: number;
}

export interface AdminEvent {
  _id: string;
  title: string;
  status: "draft" | "under_review" | "posted" | "completed" | "cancelled";
  bannerUrl?: string;
  createdAt: string;
  organizerProfileId?: {
    _id: string;
    brandName: string;
  };
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: "attendee" | "organizer" | "admin";
  isActive: boolean;
  createdAt: string;
  city?: string;
}

export interface AdminOrganizerProfile {
  _id: string;
  brandName: string;
  isVerified: boolean;
  createdAt: string;
  ownerId?: {
    _id: string;
    name: string;
    email: string;
    city?: string;
    createdAt: string;
  };
}

export interface AdminClaim {
  _id: string;
  eventId: {
    _id: string;
    title: string;
    status: string;
  };
  requesterId: {
    _id: string;
    name: string;
    email: string;
  };
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  createdAt: string;
}

export interface AdminReport {
  _id: string;
  eventId: {
    _id: string;
    title: string;
    status: string;
    bannerUrl?: string;
  };
  reporterId: {
    _id: string;
    name: string;
    email: string;
  };
  reason: string;
  status: "pending" | "reviewed" | "action_taken";
  createdAt: string;
}

export interface FlaggedEvent {
  eventId: string;
  event: AdminEvent;
  reportCount: number;
  latestReportAt: string;
  severity: "CRITICAL" | "HIGH" | "LOW";
}

export interface ActiveReport {
  _id: string;
  eventId: string;
  eventTitle: string;
  reportCount: number;
  badgeType: "CRITICAL" | "HIGH";
}

export interface SystemSettings {
  general: {
    platformName: string;
    supportEmail: string;
    maintenanceMode: boolean;
  };
  financial: {
    platformFeePercent: number;
    payoutSchedule: "Weekly" | "Bi-Weekly" | "Monthly";
    minPayoutThreshold: number;
  };
  moderation: {
    autoApproveOrganizers: boolean;
    flaggingSensitivity: "Low" | "Medium" | "Strict";
  };
  features: {
    aiMagicFill: boolean;
    guestCheckout: boolean;
  };
}

export interface TrendingConfig {
  pinnedEventIds: string[];
  algorithmWeights: {
    views: number;
    saves: number;
    registrations: number;
    shares: number;
  };
  velocityThresholds: {
    superHot: number;
    rising: number;
    breakout: number;
  };
}
