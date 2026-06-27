// ── Generic API response wrappers ─────────────────────────────────────────

export interface ApiSuccess<T = unknown> {
  success: true;
  message?: string;
  data?: T;
}

export interface ApiError {
  success: false;
  message: string;
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;

// ── Registration ──────────────────────────────────────────────────────────

export type PaymentStatus = "free" | "pending_review" | "approved" | "rejected";
export type RegistrationStatus = "registered" | "cancelled";

export interface Registration {
  _id: string;
  eventId: string | import("./event").Event;
  userId?: string;
  guestDetails?: {
    name: string;
    email: string;
  };
  customAnswers?: Record<string, unknown>;
  ticketId?: string;
  ticketCode: string;
  scannedAt?: string;
  paymentStatus: PaymentStatus;
  status: RegistrationStatus;
  paymentScreenshotUrl?: string;
  rejectionReason?: string;
  isVerifiedExternal: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RegistrationResponse {
  success: boolean;
  message: string;
  registration: Registration;
}
