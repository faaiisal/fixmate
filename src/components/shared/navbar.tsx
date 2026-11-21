'use client';

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { NavbarDesktop } from "./navbar-desktop";
import { NavbarMobile } from "./navbar-mobile";
import { useSession } from "@/lib/auth-client";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

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
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const user = session?.user as { name?: string; email?: string; role?: string } | undefined;
  const userName = user?.name || "Hasan Ali";
  const userEmail = user?.email || "hasan@epyra.com";
  const userRole = (user?.role as string) || "customer";
  const initials = userName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed out");
            setDropdownOpen(false);
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
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-xl border-b border-[#E7E7E9] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[80px] flex items-center justify-between gap-4">
        <Logo />

        <div className="hidden lg:flex flex-1 justify-center">
          <NavbarDesktop navItems={[...NAV_ITEMS]} />
        </div>

        <div className="hidden lg:flex items-center gap-3">
          {isPending ? (
            <div className="w-8 h-8 rounded-full bg-[#F6F3F2] animate-pulse" />
          ) : session?.user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-white border border-[#E7E7E9] hover:border-orange-300 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#F26A36]/20"
              >
                <div className="w-8 h-8 rounded-full bg-[#F26A36] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  {initials || "HA"}
                </div>
                <span className="text-sm font-semibold text-[#171717] hidden sm:inline">{userName.split(" ")[0] || "Hasan"}</span>
                <span className="relative flex h-2 w-2 ml-0.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
              </button>

              {dropdownOpen && (
                <div className="absolute top-full mt-2.5 right-0 w-80 bg-white rounded-2xl shadow-xl border border-[#E7E7E9] p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-3.5 bg-[#F7F7F8] rounded-xl border border-[#E7E7E9] mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F26A36] to-[#aa3700] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                        {initials}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-[#171717] leading-none">{userName}</span>
                          <span className="text-emerald-600 text-[15px]">✔️</span>
                        </div>
                        <span className="text-xs text-[#737373] truncate block mt-0.5">{userEmail}</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-[#E7E7E9]/80 flex items-center justify-between text-xs">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#047857] font-mono text-[11px] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Verified Client
                      </div>
                      <span className="font-mono text-[11px] text-[#737373]">Tier 1 Escrow</span>
                    </div>
                    <div className="mt-2.5 p-2 rounded-lg bg-[#FFF3ED] border border-orange-200 flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-[#F26A36] text-[17px]">🧾</span>
                        <div className="min-w-0">
                          <p className="font-mono text-[11px] font-semibold text-[#F26A36] truncate leading-tight">Job #FXM-98214</p>
                          <p className="text-[10px] text-[#737373] truncate leading-tight">Fridge Diagnostics (Escrow)</p>
                        </div>
                      </div>
                      <span className="font-mono text-[10px] font-bold text-emerald-700 bg-white/90 px-1.5 py-0.5 rounded border border-green-200">Active</span>
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <Link href={getDashboardHref()} onClick={() => setDropdownOpen(false)} className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-[#171717] hover:bg-[#F7F7F8] hover:text-[#F26A36] transition-colors group">
                      <span>Customer Dashboard</span>
                      <span>›</span>
                    </Link>
                    <Link href="/services" onClick={() => setDropdownOpen(false)} className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold hover:bg-orange-50 hover:text-[#F26A36] group">
                      <span>Book New Repair</span>
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#F26A36] text-white">New</span>
                    </Link>
                    <Link href="/dashboard/customer/bookings" onClick={() => setDropdownOpen(false)} className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold hover:bg-[#F7F7F8] group">
                      <span>Active Bookings & GPS</span>
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#047857]">1 Live</span>
                    </Link>
                    <Link href="/dashboard/profile" onClick={() => setDropdownOpen(false)} className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold hover:bg-[#F7F7F8] group">
                      <span>Saved Addresses & Gear</span>
                      <span>›</span>
                    </Link>
                    <Link href="/dashboard/customer/payments" onClick={() => setDropdownOpen(false)} className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold hover:bg-[#F7F7F8] group">
                      <span>Escrow & Invoices</span>
                      <span>›</span>
                    </Link>
                    <Link href="/dashboard/profile" onClick={() => setDropdownOpen(false)} className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold hover:bg-[#F7F7F8] group">
                      <span>Account & Telemetry Settings</span>
                      <span>›</span>
                    </Link>
                  </div>

                  <div className="border-t border-[#E7E7E9] my-1.5" />
                  <button onClick={handleSignOut} className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 group">
                    <span>Sign Out</span>
                    <span className="font-mono text-[10px] text-red-400">End Session</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Button asChild variant="outline" size="sm" className="rounded-full bg-white border-[#E7E7E9] text-[#14121B] hover:bg-[#F6F3F2] px-5 h-9">
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
