import axios from "axios";
import { tokenStore, guestTokenStore } from "./auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // We still use true for cross-origin CORS if needed, but we rely on Authorization header for JWT
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Request interceptor — attach JWT from localStorage
api.interceptors.request.use(
  (config) => {
    // 1. Attach JWT Token if it exists
    const token = tokenStore.get();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 2. Attach Guest Token for guest checkout actions if it exists
    const guestToken = guestTokenStore.get();
    if (guestToken && config.headers) {
      config.headers["x-guest-registration-token"] = guestToken;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor — handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token if we hit a 401
      tokenStore.clear();

      // Only redirect if we're on a protected page, not public pages
      if (typeof window !== "undefined") {
        const protectedPaths = ["/dashboard", "/admin"];
        const isProtected = protectedPaths.some((path) =>
          window.location.pathname.startsWith(path),
        );
        if (isProtected) {
          window.location.href = "/auth/signin";
        }
      }
    }
    return Promise.reject(error);
  },
);

export default api;

// ── Auth ────────────────────────────────────────────────────────────────────
export const authApi = {
  login: async (email: string, password: string) => {
    const res = await api.post("/api/auth/login", { email, password });
    if (res.data.token) {
      tokenStore.set(res.data.token);
    }
    return res;
  },

  register: async (data: {
    name: string;
    email: string;
    password: string;
    city?: string;
    role?: string;
  }) => {
    const res = await api.post("/api/auth/register", data);
    if (res.data.token) {
      tokenStore.set(res.data.token);
    }
    return res;
  },

  googleLogin: async (credential: string) => {
    const res = await api.post("/api/auth/google", { credential });
    if (res.data.token) {
      tokenStore.set(res.data.token);
    }
    return res;
  },

  forgotPassword: (email: string) =>
    api.post("/api/auth/forgot-password", { email }),

  resetPassword: (token: string, password: string) =>
    api.post("/api/auth/reset-password", { token, newPassword: password }),

  getProfile: () => api.get("/api/auth/profile"),

  updateProfile: (data: Record<string, unknown>) =>
    api.put("/api/auth/profile", data),

  logout: () => {
    // Backend has no logout endpoint for JWT. We just clear the token.
    tokenStore.clear();
    return Promise.resolve();
  },
};

// ── Events ──────────────────────────────────────────────────────────────────
export const eventsApi = {
  discover: (params?: {
    search?: string;
    q?: string;
    city?: string;
    category?: string;
    sort?: "soonest" | "trending";
    limit?: number;
    page?: number;
    startDate?: string;
    endDate?: string;
  }) => api.get("/api/events/discover", { params }),

  getById: (id: string) => api.get(`/api/events/${id}`),

  toggleInterest: (id: string) => api.post(`/api/events/${id}/interest`),

  getCities: (q?: string) => api.get("/api/events/cities", { params: { q } }),

  getCategories: () => api.get("/api/events/categories"),

  create: (data: any) => api.post("/api/events", data),
  
  update: (id: string, data: any) => api.put(`/api/events/${id}`, data),
  
  delete: (id: string) => api.delete(`/api/events/${id}`),

  updateStatus: (id: string, status: string) => api.patch(`/api/events/${id}/status`, { status }),

  magicFillText: (text: string) => api.post("/api/events/magic-fill/text", { text }),

  magicFillImage: (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    return api.post("/api/events/magic-fill/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

// ── Registrations ─────────────────────────────────────────────────────────
export const registrationsApi = {
  register: async (data: {
    eventId: string;
    guestDetails?: { name: string; email: string };
    customAnswers?: Record<string, unknown>;
  }) => {
    const res = await api.post("/api/registrations/register", data);
    // Store guest access token if it's a guest checkout
    if (res.data.guestAccessToken) {
      guestTokenStore.set(res.data.guestAccessToken);
    }
    return res;
  },

  uploadPaymentProof: (registrationId: string, file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    return api.post(`/api/registrations/${registrationId}/payment-proof`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  sendConfirmationEmail: (registrationId: string) =>
    api.post(`/api/registrations/${registrationId}/confirmation-email`),
    
  verifyQr: (ticketCode: string) => api.post("/api/registrations/verify-qr", { ticketCode }),
};

// ── Attendee ────────────────────────────────────────────────────────────────
export const attendeeApi = {
  getTickets: () => api.get("/api/attendee/tickets"),

  getTicket: (ticketCode: string) => api.get(`/api/attendee/tickets/${ticketCode}`),

  getInterestedEvents: () => api.get("/api/attendee/interested"),

  cancelRegistration: (registrationId: string) =>
    api.post(`/api/attendee/registrations/${registrationId}/cancel`),

  getFollowing: () => api.get("/api/attendee/following"),

  toggleFollow: (organizerId: string) =>
    api.post(`/api/attendee/follow/${organizerId}`),

  upgradeToOrganizer: () => api.post("/api/attendee/upgrade"),

  submitClaim: (eventId: string, reason: string, description: string) =>
    api.post("/api/attendee/claims", { eventId, reason, description }),
};

// ── Organizer ────────────────────────────────────────────────────────────────
export const organizerApi = {
  getPublicProfile: (organizerId: string) =>
    api.get(`/api/organizer/public/${organizerId}`),

  getDashboardMetrics: () => api.get("/api/organizer/dashboard/metrics"),

  getMyEvents: () => api.get("/api/organizer/events"),

  getProfile: () => api.get("/api/organizer/profile"),

  updateProfile: (data: Record<string, unknown>) =>
    api.put("/api/organizer/profile", data),

  getProfiles: () => api.get("/api/organizer/profiles"),

  createProfile: (data: any) => api.post("/api/organizer/profile", data),
};
