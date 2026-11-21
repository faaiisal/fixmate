"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ClipboardList,
  Stethoscope,
  Package,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  Users,
  Shield,
} from "lucide-react";
import { authClient, useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type Role = "customer" | "technician" | "admin";

const NAV_CONFIG: Record<Role, { label: string; href: string; icon: React.ElementType }[]> = {
  customer: [
    { label: "Overview", href: "/dashboard/customer", icon: LayoutDashboard },
    { label: "Bookings & Tracking", href: "/dashboard/customer/bookings", icon: ClipboardList },
    { label: "Services Catalog", href: "/services", icon: Package },
    { label: "Financial Escrow", href: "/dashboard/customer/payments", icon: CreditCard },
    { label: "Settings", href: "/dashboard/profile", icon: Settings },
  ],
  technician: [
    { label: "Overview", href: "/dashboard/technician", icon: LayoutDashboard },
    { label: "Diagnostic Dispatch", href: "/dashboard/technician/requests", icon: Stethoscope },
    { label: "Services Catalog", href: "/dashboard/technician/my-services", icon: Package },
    { label: "Financial Escrow", href: "/dashboard/technician", icon: CreditCard },
    { label: "Analytics & Telemetry", href: "/dashboard/technician", icon: BarChart3 },
    { label: "Settings", href: "/dashboard/profile", icon: Settings },
  ],
  admin: [
    { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Bookings & Tracking", href: "/dashboard/admin/bookings", icon: ClipboardList },
    { label: "Diagnostic Dispatch", href: "/dashboard/admin/bookings", icon: Stethoscope },
    { label: "Services Catalog", href: "/dashboard/admin/services", icon: Package },
    { label: "Financial Escrow", href: "/dashboard/admin/transactions", icon: CreditCard },
    { label: "Analytics & Telemetry", href: "/dashboard/admin", icon: BarChart3 },
    { label: "Users", href: "/dashboard/admin/users", icon: Users },
    { label: "Settings", href: "/dashboard/profile", icon: Settings },
  ],
};

export function DashboardSidebar({ role: propRole = "customer" as Role }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const sessionUser = session?.user as { name?: string; email?: string; role?: Role } | undefined;
  const realRole = (sessionUser?.role as Role) || propRole;
  const items = NAV_CONFIG[realRole] || NAV_CONFIG.customer;
  const userName = sessionUser?.name || "Alex Miller";
  const userEmail = sessionUser?.email || `${realRole}@fixmate.io`;

  const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed out");
            router.push("/sign-in");
          },
        },
      });
    } catch {
      toast.error("Failed to sign out");
      router.push("/sign-in");
    }
  };

  return (
    <div className="w-full md:w-64 bg-white border-r border-[#E5E0DF] flex flex-col h-full">
      <div className="h-[72px] px-4 flex items-center gap-3 border-b border-[#E5E0DF] shrink-0">
        <Link href="/" className="flex items-center gap-2" aria-label="FixMate Dashboard Home">
          <Image src="/fixmate-logo.png" alt="FixMate" width={120} height={64} className="w-[120px] h-auto object-contain" priority />
        </Link>
        <span className="ml-auto text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#F6F3F2] border border-[#E5E0DF] text-[#6c6764] uppercase tracking-wider">
          {realRole}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div>
          <span className="px-3 text-[11px] font-mono font-semibold text-[#8C9098] uppercase tracking-wider">Workspace</span>
          <nav className="mt-2 space-y-1">
            {items.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-full text-sm font-medium transition-all",
                    active
                      ? "bg-[#FFF1EC] text-[#F26A36] border border-[#FFD6C2] shadow-sm"
                      : "text-[#55595F] hover:bg-[#F6F3F2] hover:text-[#14121B] border border-transparent"
                  )}
                >
                  <item.icon className="w-[18px] h-[18px]" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="p-3 border-t border-[#E5E0DF] bg-[#FCF9F8] space-y-3 shrink-0">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-white border border-[#E5E0DF]">
          <Avatar className="w-9 h-9 border border-[#E7E7E9]">
            <AvatarFallback className="bg-[#FFF1EC] text-[#F26A36] font-bold text-xs">
              {userName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold truncate">{userName}</div>
            <div className="text-[11px] font-mono text-[#8C9098] truncate">{userEmail}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="flex-1 rounded-full bg-white border-[#E5E0DF] hover:bg-[#FEF2F2] hover:text-[#ba1a1a] hover:border-[#ffdad6] text-xs"
          >
            <LogOut className="w-3.5 h-3.5 mr-1.5" />
            Sign Out
          </Button>
          <div className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-full bg-white border border-[#E5E0DF] text-[10px] font-mono text-[#8C9098]">
            <Shield className="w-3 h-3" />
            Escrow
          </div>
        </div>

        <div className="text-[10px] font-mono text-[#8C9098] text-center">TX: 0x8F2A...991C • TLS 1.3</div>
      </div>
    </div>
  );
}
