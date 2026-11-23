import { requireServerRole } from "@/lib/server-auth";

export default async function CustomerDashboardLayout({ children }: { children: React.ReactNode }) {
  await requireServerRole("customer");
  return children;
}
