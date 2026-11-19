import { DashboardSidebar } from "@/components/shared/dashboard-sidebar";
import { DashboardTopbar } from "@/components/shared/dashboard-topbar";

// For frontend-only, we mock role as customer. In production, get from auth session.
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // TODO: get role from BetterAuth session
  const role = "customer" as "customer" | "technician" | "admin";

  return (
    <div className="min-h-screen flex bg-[#FCF9F8]">
      <div className="hidden md:flex">
        <DashboardSidebar role={role} />
      </div>
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardTopbar title="Dashboard" subtitle="CLUSTER-US-WEST-2B // 99.98% UPTIME" />
        <main className="flex-1 p-4 lg:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
