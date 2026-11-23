import { requireServerRole } from "@/lib/server-auth";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  await requireServerRole("admin");
  return children;
}
