import * as z from "zod";

export const eventFormSchema = z.object({
  // STEP 1: BASICS
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  categoryId: z.string().min(1, "Please select a category"),
  bannerUrl: z.string().optional(),
  cardImageUrl: z.string().optional(),
  organizerProfileId: z.string().min(1, "Please select an organizer page"),
  locationType: z.enum(["VENUE", "ONLINE"]),
  
  // Venue fields
  venueName: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  
  // Online fields
  platform: z.string().optional(),
  virtualLink: z.string().optional(),
  
  // Dates
  startDate: z.date().optional(),
  startTime: z.string().optional(),
  endDate: z.date().optional(),
  endTime: z.string().optional(),
  
  // Description
  overview: z.string().min(10, "Overview is too short").optional(),

  // STEP 2: REGISTRATION
  registrationMethod: z.enum(["INTERNAL", "EXTERNAL"]).default("INTERNAL"),
  externalUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  
  // Internal custom questions
  customQuestions: z.array(
    z.object({
      id: z.string(),
      type: z.enum(["SHORT_ANSWER", "LONG_ANSWER", "MULTIPLE_CHOICE", "FILE_UPLOAD"]),
      label: z.string().min(1, "Question label is required"),
      options: z.array(z.string()).optional(),
      required: z.boolean().default(false),
    })
  ).default([]),

  // STEP 3: TICKETS
  tickets: z.array(
    z.object({
      id: z.string(),
      type: z.enum(["PAID", "FREE"]),
      name: z.string().min(1, "Ticket name is required"),
      quantity: z.number().min(1, "Quantity must be at least 1"),
      price: z.number().optional(), // 0 or undefined for FREE
      paymentAccountType: z.string().optional(),
      paymentAccountNumber: z.string().optional(),
      salesStartDate: z.date().optional(),
      salesStartTime: z.string().optional(),
      salesEndDate: z.date().optional(),
      salesEndTime: z.string().optional(),
    })
  ).default([]),

  // STEP 4: PUBLISH
  visibility: z.enum(["PUBLIC", "PRIVATE"]).default("PUBLIC"),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;

