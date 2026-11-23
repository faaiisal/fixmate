"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/shared/dashboard-sidebar";
import { DashboardTopbar } from "@/components/shared/dashboard-topbar";

type Role = "customer" | "technician" | "admin";

export function DashboardShell({ role, children }: { role: Role; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // The server layout verifies the session. Redirect the dashboard root to
    // the user's own dashboard, and keep a client fallback for role mismatches.
    if (pathname === "/dashboard") {
      router.replace(`/dashboard/${role}`);
      return;
    }

    const isCustomerPath = pathname.startsWith("/dashboard/customer");
    const isTechnicianPath = pathname.startsWith("/dashboard/technician");
    const isAdminPath = pathname.startsWith("/dashboard/admin");

    if (
      (role === "customer" && (isTechnicianPath || isAdminPath)) ||
      (role === "technician" && (isCustomerPath || isAdminPath)) ||
      (role === "admin" && (isCustomerPath || isTechnicianPath))
    ) {
      router.replace(`/dashboard/${role}`);
    }
  }, [pathname, role, router]);

  return (
    <div className="min-h-screen flex bg-[#FCF9F8]">
      <div className="hidden md:flex">
        <DashboardSidebar role={role} />
      </div>
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardTopbar
          title="Dashboard"
          subtitle={`ROLE: ${role.toUpperCase()} • SERVER-VERIFIED SESSION`}
          role={role}
        />
        <main className="flex-1 p-4 lg:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
