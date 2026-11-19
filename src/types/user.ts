export type UserRole = "customer" | "technician" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  image?: string;
  emailVerified?: boolean;
  createdAt: string;
}
