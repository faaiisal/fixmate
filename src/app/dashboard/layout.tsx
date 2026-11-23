import { DashboardShell } from "@/components/shared/dashboard-shell";
import { normalizeRole, requireServerSession } from "@/lib/server-auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireServerSession();
  const role = normalizeRole((session.user as { role?: unknown }).role);

  return <DashboardShell role={role}>{children}</DashboardShell>;
}
