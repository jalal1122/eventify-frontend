import api from "./api";
import {
  SnapshotStats,
  AdminEvent,
  AdminClaim,
  ActiveReport,
  AdminOrganizerProfile,
  AdminUser,
  AdminReport,
  FlaggedEvent,
  SystemSettings,
  TrendingConfig,
} from "@/types/admin";

export const adminApi = {
  // --- Dashboard Overview ---
  getSnapshot: async () => {
    const res = await api.get<{
      success: boolean;
      stats: SnapshotStats;
      pendingEvents: AdminEvent[];
      pendingClaims: AdminClaim[];
      activeReports: ActiveReport[];
    }>("/admin/snapshot");
    return res.data;
  },

  getAnalytics: async () => {
    const res = await api.get<{
      success: boolean;
      totalAttendees: number;
      totalOrganizers: number;
      liveEvents: number;
      totalRegistrations: number;
      timeSeries: {
        date: string;
        attendees: number;
        events: number;
        organizers: number;
      }[];
      cities: { name: string; count: number; pct: number }[];
      categories: { name: string; count: number; pct: number }[];
    }>("/admin/analytics");
    return res.data;
  },

  // --- Moderation Hub ---
  getPendingEvents: async (page = 1, limit = 10) => {
    const res = await api.get<{
      success: boolean;
      events: AdminEvent[];
      total: number;
      page: number;
      pages: number;
    }>(`/admin/events/pending?page=${page}&limit=${limit}`);
    return res.data;
  },

  reviewEvent: async (
    eventId: string,
    decision: "approved" | "rejected",
    reason?: string,
  ) => {
    const res = await api.put<{
      success: boolean;
      event: AdminEvent;
      message: string;
    }>(`/admin/events/${eventId}/review`, { decision, reason });
    return res.data;
  },

  getPendingOrganizers: async (page = 1, limit = 10) => {
    const res = await api.get<{
      success: boolean;
      organizers: AdminOrganizerProfile[];
      total: number;
      page: number;
      pages: number;
    }>(`/admin/organizers/pending?page=${page}&limit=${limit}`);
    return res.data;
  },

  reviewOrganizer: async (
    id: string,
    decision: "approved" | "rejected",
    reason?: string,
  ) => {
    const res = await api.put<{
      success: boolean;
      profile: AdminOrganizerProfile;
      message: string;
    }>(`/admin/organizers/${id}/review`, { decision, reason });
    return res.data;
  },

  // --- User CRM ---
  getUsers: async (params: {
    page?: number;
    limit?: number;
    role?: string;
    status?: string;
    search?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.role && params.role !== "all")
      searchParams.append("role", params.role);
    if (params.status && params.status !== "all")
      searchParams.append("status", params.status);
    if (params.search) searchParams.append("search", params.search);

    const res = await api.get<{
      success: boolean;
      users: AdminUser[];
      total: number;
      page: number;
      pages: number;
    }>(`/admin/users?${searchParams.toString()}`);
    return res.data;
  },

  updateUserRole: async (userId: string, role: string) => {
    const res = await api.put<{ success: boolean; message: string }>(
      `/admin/users/${userId}/role`,
      { role },
    );
    return res.data;
  },

  banUser: async (userId: string, ban: boolean) => {
    const res = await api.put<{ success: boolean; message: string }>(
      `/admin/users/${userId}/ban`,
      { ban },
    );
    return res.data;
  },

  // --- Spam & Reports ---
  getCommunityReports: async (page = 1, limit = 10) => {
    const res = await api.get<{
      success: boolean;
      reports: AdminReport[];
      total: number;
      page: number;
      pages: number;
    }>(`/admin/reports/community?page=${page}&limit=${limit}`);
    return res.data;
  },

  resolveReport: async (
    reportId: string,
    action: "dismiss" | "warn" | "takedown" | "freeze",
    notes?: string,
  ) => {
    const res = await api.put<{ success: boolean; message: string }>(
      `/admin/reports/community/${reportId}/resolve`,
      { action, notes },
    );
    return res.data;
  },

  getFlaggedEvents: async () => {
    const res = await api.get<{
      success: boolean;
      flaggedEvents: FlaggedEvent[];
      count: number;
    }>("/admin/reports/flagged");
    return res.data;
  },

  resolveFlaggedEvent: async (
    eventId: string,
    action: "dismiss_reports" | "takedown",
  ) => {
    const res = await api.put<{ success: boolean; message: string }>(
      `/admin/reports/flagged/${eventId}/resolve`,
      { action },
    );
    return res.data;
  },

  getClaimsDisputes: async (page = 1, limit = 10) => {
    const res = await api.get<{
      success: boolean;
      claims: AdminClaim[];
      total: number;
      page: number;
      pages: number;
    }>(`/admin/reports/claims?page=${page}&limit=${limit}`);
    return res.data;
  },

  resolveClaim: async (
    claimId: string,
    decision: "approved" | "rejected",
    explanation?: string,
  ) => {
    const res = await api.post<{ success: boolean; message: string }>(
      `/admin/claims/${claimId}/process`,
      { decision, explanation },
    );
    return res.data;
  },

  // --- Trending Management ---
  getTrendingQueue: async () => {
    const res = await api.get<{
      success: boolean;
      pinnedEvents: AdminEvent[];
      organicQueue: {
        eventId: string;
        title: string;
        score: number;
        velocity: string;
      }[];
    }>("/admin/trending");
    return res.data;
  },

  updateTrendingConfig: async (config: Partial<TrendingConfig>) => {
    const res = await api.put<{ success: boolean; config: TrendingConfig }>(
      "/admin/trending",
      config,
    );
    return res.data;
  },

  // --- System Settings ---
  getSystemSettings: async () => {
    const res = await api.get<{ success: boolean; settings: SystemSettings }>(
      "/admin/settings",
    );
    return res.data;
  },

  updateSystemSettings: async (settings: Partial<SystemSettings>) => {
    const res = await api.put<{ success: boolean; settings: SystemSettings }>(
      "/admin/settings",
      settings,
    );
    return res.data;
  },
};
