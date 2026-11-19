export type BookingStatus = "requested" | "accepted" | "in-progress" | "completed" | "rejected" | "cancelled";
export type EscrowStatus = "requires_auth" | "held" | "released" | "refunded" | "failed";

export interface Booking {
  id: string;
  serviceId: string;
  customerId: string;
  technicianId?: string;
  applianceType: string;
  faultDescription: string;
  scheduleDate: string;
  timeSlot: string;
  address: string;
  phone: string;
  status: BookingStatus;
  escrowStatus: EscrowStatus;
  pin?: string;
  amount: number;
  idempotencyKey: string;
  createdAt: string;
  updatedAt: string;
  service?: { title: string; price: number };
  customer?: { name: string };
  technician?: { name: string; rating: number };
}
