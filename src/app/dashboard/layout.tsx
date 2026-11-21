"use client";

import { DashboardSidebar } from "@/components/shared/dashboard-sidebar";
import { DashboardTopbar } from "@/components/shared/dashboard-topbar";
import { useSession } from "@/lib/auth-client";

type Role = "customer" | "technician" | "admin";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const sessionUser = session?.user as { role?: Role } | undefined;
  const role = (sessionUser?.role as Role) || "customer";

  return (
    <div className="min-h-screen flex bg-[#FCF9F8]">
      <div className="hidden md:flex">
        <DashboardSidebar role={role} />
      </div>
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardTopbar title="Dashboard" subtitle={`ROLE: ${role.toUpperCase()} • CLUSTER-US-WEST-2B // 99.98% UPTIME • API: ${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}`} role={role} />
        <main className="flex-1 p-4 lg:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
