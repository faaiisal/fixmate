export type ServiceStatus = "pending" | "approved" | "rejected";
export type ServiceCategory = "refrigerator" | "washing-machine" | "ac" | "tv" | "laptop" | "smartphone" | "other";

export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  category: ServiceCategory;
  technicianId: string;
  technician?: { name: string; rating: number; verified: boolean };
  status: ServiceStatus;
  isAvailable: boolean;
  images: string[];
  createdAt: string;
  updatedAt: string;
}
