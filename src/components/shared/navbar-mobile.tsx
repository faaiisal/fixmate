"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Image from "next/image";

type NavItem = { href: string; label: string; exact?: boolean };

export function NavbarMobile({
  navItems,
  signInHref,
  bookRepairHref,
}: {
  navItems: readonly NavItem[];
  signInHref: string;
  bookRepairHref: string;
}) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" className="rounded-full w-9 h-9 border border-[#E5E0DF] bg-white" aria-label="Open navigation menu">
            <Menu className="w-5 h-5" />
          </Button>
        }
      />

      <SheetContent side="right" className="w-[85%] sm:w-[380px] bg-[#FCF9F8] border-l border-[#E5E0DF] p-0 flex flex-col">
        <SheetHeader className="p-6 pb-4 border-b border-[#E5E0DF] text-left">
          <div className="flex items-center gap-2">
            <Image src="/fixmate-logo.png" alt="FixMate" width={120} height={64} className="w-[120px] h-auto object-contain" />
            <SheetTitle className="font-heading font-bold text-[15px] sr-only">FixMate</SheetTitle>
          </div>
        </SheetHeader>

        <nav className="flex-1 p-4 space-y-1" aria-label="Mobile primary">
          {navItems.map((item) => {
            const isActive = item.exact ? pathname === "/" : pathname === item.href || pathname.startsWith(item.href);
            return (
              <Link
                key={item.href + item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors border",
                  isActive
                    ? "bg-white text-[#F26A36] border-[#FFD6C2] shadow-sm"
                    : "bg-transparent text-[#14121B] border-transparent hover:bg-white hover:border-[#E5E0DF]"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#E5E0DF] bg-white space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F6F3F2] border border-[#E5E0DF]">
            <Avatar className="w-9 h-9 border border-[#FFD6C2] bg-[#FFF1EC]">
              <AvatarFallback className="bg-[#FFF1EC] text-[#F26A36]">A</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="text-sm font-medium text-[#14121B]">Guest Account</div>
              <div className="text-xs text-[#8C9098] font-mono">FixVault Protected</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button asChild variant="outline" className="rounded-full bg-white border-[#E5E0DF] w-full">
              <Link href={signInHref} onClick={() => setOpen(false)}>
                Sign In
              </Link>
            </Button>
            <Button asChild className="rounded-full bg-[#F26A36] hover:bg-[#E05824] text-white w-full">
              <Link href={bookRepairHref} onClick={() => setOpen(false)}>
                Get Started
              </Link>
            </Button>
          </div>

          <div className="flex items-center justify-center gap-2 pt-2 text-[10px] font-mono text-[#8C9098]">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            SYSTEM OPERATIONAL 99.98%
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
