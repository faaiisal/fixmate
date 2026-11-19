"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Wrench, ShoppingBag, Users, Settings, CreditCard, Package, ClipboardList, Shield } from "lucide-react";

type Role = "customer" | "technician" | "admin";

const navByRole: Record<Role, { label: string; href: string; icon: React.ElementType }[]> = {
  customer: [
    { label: "Overview", href: "/dashboard/customer", icon: LayoutDashboard },
    { label: "My Bookings", href: "/dashboard/customer/bookings", icon: ClipboardList },
    { label: "Payments", href: "/dashboard/customer/payments", icon: CreditCard },
    { label: "Profile", href: "/dashboard/profile", icon: Settings },
  ],
  technician: [
    { label: "Dispatch", href: "/dashboard/technician", icon: LayoutDashboard },
    { label: "Add Service", href: "/dashboard/technician/add-service", icon: Wrench },
    { label: "My Services", href: "/dashboard/technician/my-services", icon: Package },
    { label: "Requests", href: "/dashboard/technician/requests", icon: ShoppingBag },
    { label: "Profile", href: "/dashboard/profile", icon: Settings },
  ],
  admin: [
    { label: "Operations", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Users", href: "/dashboard/admin/users", icon: Users },
    { label: "Services", href: "/dashboard/admin/services", icon: Package },
    { label: "Bookings", href: "/dashboard/admin/bookings", icon: ClipboardList },
    { label: "Transactions", href: "/dashboard/admin/transactions", icon: CreditCard },
    { label: "Profile", href: "/dashboard/profile", icon: Settings },
  ],
};

export function DashboardSidebar({ role = "customer" as Role }) {
  const pathname = usePathname();
  const items = navByRole[role] || navByRole.customer;

  return (
    <div className="w-full md:w-64 bg-white border-r border-[#E5E0DF] flex flex-col h-full">
      <div className="h-16 px-6 flex items-center gap-3 border-b border-[#E5E0DF]">
        <div className="w-8 h-8 rounded-lg bg-[#F26A36] flex items-center justify-center text-white font-bold">F</div>
        <span className="font-heading font-bold">FixMate</span>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#F6F3F2] border border-[#E5E0DF]">{role.toUpperCase()}</span>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active ? "bg-[#FFF1EC] text-[#F26A36] border border-[#FFD6C2]" : "text-[#55595F] hover:bg-[#F6F3F2] hover:text-[#14121B]"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-[#E5E0DF]">
        <div className="rounded-xl bg-[#FCF9F8] border border-[#E5E0DF] p-3">
          <div className="flex items-center gap-2 text-xs font-mono text-[#8C9098]">
            <Shield className="w-3 h-3" />
            FixVault Escrow Protected
          </div>
          <div className="mt-2 text-[10px] font-mono text-[#8C9098]">TX: 0x8F2A...991C</div>
        </div>
      </div>
    </div>
  );
}
