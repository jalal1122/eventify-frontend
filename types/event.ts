// ── Event types matching backend schema ────────────────────────────────────

export type EventStatus =
  | "draft"
  | "under_review"
  | "posted"
  | "completed"
  | "cancelled";

export type RegistrationMethod = "native" | "external";

export interface CustomFormField {
  fieldId: string;
  type: "text" | "select" | "file";
  label: string;
  isRequired: boolean;
  options?: string[];
}

export interface AgendaItem {
  time: string;
  activity: string;
}

export interface OrganizerSummary {
  _id: string;
  brandName: string;
  logoUrl?: string;
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  bannerUrl?: string;
  cardImageUrl?: string;
  status: EventStatus;
  category?: string;
  tags: string[];
  dateTime: string;
  venueName: string;
  city: string;
  coordinates: {
    type: "Point";
    coordinates: [number, number];
  };
  organizerProfileId: string | OrganizerSummary;
  isAiGenerated: boolean;
  viewsCount: number;
  interestedCount: number;
  capacityLimit?: number;
  remainingCapacity?: number;
  locationType: "VENUE" | "ONLINE";
  platform?: string;
  virtualLink?: string;
  tickets: {
    id: string;
    type: "PAID" | "FREE";
    name: string;
    quantity: number;
    price?: number;
    paymentAccountType?: string;
    paymentAccountNumber?: string;
    salesStartDate?: string;
    salesEndDate?: string;
  }[];
  registrationMethod: RegistrationMethod;
  externalUrl?: string;
  externalVerificationCode?: string;
  customFormSchema: CustomFormField[];
  speakers: string[];
  agenda: AgendaItem[];
  createdAt: string;
  updatedAt: string;
}

export interface EventsResponse {
  success: boolean;
  sort: "soonest" | "trending";
  count: number;
  events: Event[];
}

export interface EventDetailResponse {
  success: boolean;
  event: Event;
}

export interface CitiesResponse {
  success: boolean;
  count: number;
  cities: string[];
}
