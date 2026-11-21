'use client';

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { NavbarDesktop } from "./navbar-desktop";
import { NavbarMobile } from "./navbar-mobile";
import { useSession } from "@/lib/auth-client";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { LogOut, LayoutDashboard } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NAV_ITEMS = [
  { href: "/", label: "Home", exact: true },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
] as const;

const AUTH_ACTIONS = {
  signInHref: "/sign-in",
  signUpHref: "/sign-up",
} as const;

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 shrink-0 group" aria-label="FixMate Home">
      <Image src="/fixmate-logo.png" alt="FixMate" width={120} height={64} className="w-[120px] h-auto object-contain" priority />
    </Link>
  );
}

export function Navbar() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const user = session?.user as { name?: string; email?: string; role?: string } | undefined;
  const userName = user?.name || "User";
  const userRole = (user?.role as string) || "customer";

  const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed out");
            router.push("/");
            router.refresh();
          },
        },
      });
    } catch {
      toast.error("Failed to sign out");
    }
  };

  const getDashboardHref = () => {
    if (userRole === "technician") return "/dashboard/technician";
    if (userRole === "admin") return "/dashboard/admin";
    return "/dashboard/customer";
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-[#E5E0DF] supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between gap-4">
        <Logo />

        <div className="hidden lg:flex flex-1 justify-center">
          <NavbarDesktop navItems={[...NAV_ITEMS]} />
        </div>

        <div className="hidden lg:flex items-center gap-2">
          {isPending ? (
            <div className="w-8 h-8 rounded-full bg-[#F6F3F2] animate-pulse" />
          ) : session?.user ? (
            <>
              <Button variant="ghost" size="sm" className="rounded-full" onClick={() => router.push(getDashboardHref())}>
                <LayoutDashboard className="w-4 h-4 mr-1.5" />
                Dashboard
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger className="rounded-full focus:outline-none focus:ring-2 focus:ring-[#F26A36]/20">
                  <Avatar className="w-8 h-8 border border-[#FFD6C2] bg-[#FFF1EC] cursor-pointer">
                    <AvatarFallback className="bg-[#FFF1EC] text-[#F26A36] text-xs">
                      {userName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{userName}</span>
                      <span className="text-xs text-[#8C9098] truncate">{user?.email}</span>
                      <span className="text-[10px] font-mono mt-1 px-2 py-0.5 rounded-full bg-[#FFF1EC] text-[#F26A36] border border-[#FFD6C2] w-fit uppercase">
                        {userRole}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push(getDashboardHref())}>Dashboard</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>Profile</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-[#ba1a1a] focus:text-[#ba1a1a]">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button asChild variant="outline" size="sm" className="rounded-full bg-white border-[#E5E0DF] text-[#14121B] hover:bg-[#F6F3F2] px-5 h-9">
                <Link href={AUTH_ACTIONS.signInHref}>Sign In</Link>
              </Button>
              <Button asChild size="sm" className="rounded-full bg-[#F26A36] hover:bg-[#E05824] text-white px-5 h-9 shadow-sm">
                <Link href={AUTH_ACTIONS.signUpHref}>Get Started</Link>
              </Button>
            </>
          )}
        </div>

        <div className="lg:hidden">
          <NavbarMobile navItems={[...NAV_ITEMS]} signInHref={AUTH_ACTIONS.signInHref} signUpHref={AUTH_ACTIONS.signUpHref} />
        </div>
      </div>
    </header>
  );
}
