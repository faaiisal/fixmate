import { requireServerRole } from "@/lib/server-auth";

export default async function TechnicianDashboardLayout({ children }: { children: React.ReactNode }) {
  await requireServerRole("technician");
  return children;
}
