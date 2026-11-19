import { z } from "zod";

export const bookingStatus = z.enum(["requested", "accepted", "in-progress", "completed", "rejected", "cancelled"]);
export type BookingStatus = z.infer<typeof bookingStatus>;

export const allowedTransitions: Record<BookingStatus, BookingStatus[]> = {
  requested: ["accepted", "rejected", "cancelled"],
  accepted: ["in-progress", "rejected", "cancelled"],
  "in-progress": ["completed", "cancelled"],
  completed: [],
  rejected: [],
  cancelled: [],
};

export const bookingSchema = z.object({
  serviceId: z.string().min(1),
  applianceType: z.string().min(2),
  faultDescription: z.string().min(10),
  scheduleDate: z.string().or(z.date()),
  timeSlot: z.string(),
  address: z.string().min(5),
  phone: z.string().min(10),
  notes: z.string().optional(),
});

export const bookingStatusUpdateSchema = z.object({
  status: bookingStatus,
});

export type BookingInput = z.infer<typeof bookingSchema>;
