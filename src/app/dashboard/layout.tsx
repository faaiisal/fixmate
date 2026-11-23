"use client";

import { DashboardSidebar } from "@/components/shared/dashboard-sidebar";
import { DashboardTopbar } from "@/components/shared/dashboard-topbar";
import { useSession } from "@/lib/auth-client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

type Role = "customer" | "technician" | "admin";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession() as any;
  const sessionUser = session?.user as { role?: Role } | undefined;
  const role = (sessionUser?.role as Role) || "customer";
  const pathname = usePathname();
  const router = useRouter();

  // Role-based redirect: logged-in user opening another role's dashboard -> own dashboard
  useEffect(() => {
    if (isPending) return;
    if (!session) {
      // No session, middleware should have redirected, but client fallback
      router.push("/sign-in");
      return;
    }

    const isCustomerPath = pathname.startsWith("/dashboard/customer");
    const isTechnicianPath = pathname.startsWith("/dashboard/technician");
    const isAdminPath = pathname.startsWith("/dashboard/admin");
    const isProfilePath = pathname.startsWith("/dashboard/profile");
    const isDashboardRoot = pathname === "/dashboard";

    // Profile is allowed for all roles
    if (isProfilePath) return;

    // Dashboard root - redirect to own dashboard
    if (isDashboardRoot) {
      if (role === "customer") router.push("/dashboard/customer");
      else if (role === "technician") router.push("/dashboard/technician");
      else if (role === "admin") router.push("/dashboard/admin");
      return;
    }

    // Role mismatch checks
    if (role === "customer" && (isTechnicianPath || isAdminPath)) {
      router.push("/dashboard/customer");
      return;
    }
    if (role === "technician" && (isCustomerPath || isAdminPath)) {
      router.push("/dashboard/technician");
      return;
    }
    if (role === "admin" && (isCustomerPath || isTechnicianPath)) {
      router.push("/dashboard/admin");
      return;
    }
  }, [role, pathname, session, isPending, router]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FCF9F8]">
        <div className="text-sm text-[#8C9098]">Loading session...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#FCF9F8]">
      <div className="hidden md:flex">
        <DashboardSidebar role={role} />
      </div>
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardTopbar title="Dashboard" subtitle={`ROLE: ${role.toUpperCase()} • CLUSTER-US-WEST-2B // 99.98% UPTIME`} role={role} />
        <main className="flex-1 p-4 lg:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
