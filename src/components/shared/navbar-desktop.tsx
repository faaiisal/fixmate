"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string; exact?: boolean };

export function NavbarDesktop({ navItems }: { navItems: readonly NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-[#F6F3F2] border border-[#E5E0DF]">
      {navItems.map((item) => {
        const isActive = item.exact ? pathname === "/" : pathname === item.href || pathname.startsWith(item.href);
        const active = item.href === "/" ? pathname === "/" : isActive;
        return (
          <Link
            key={item.href + item.label}
            href={item.href}
            className={cn(
              "px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors",
              active
                ? "bg-white text-[#F26A36] shadow-sm border border-[#E5E0DF]/60"
                : "text-[#55595F] hover:text-[#14121B] hover:bg-white/60"
            )}
            aria-current={active ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
