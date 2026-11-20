import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PublicNavbarMobile } from "./public-navbar-mobile";
import { PublicNavbarDesktop } from "./public-navbar-desktop";

// --- Constants: single source of truth for nav order (follows screenshot order) ---
const NAV_ITEMS = [
  { href: "/", label: "Home", exact: true },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About & How It Works" },
  { href: "/about#pricing", label: "Pricing & Guarantee" },
] as const;

const AUTH_ACTIONS = {
  signInHref: "/sign-in",
  bookRepairHref: "/sign-up", // Fixed: Book Repair should redirect to signup, not services (per user request)
} as const;

// --- Subcomponents: Logo (server, no JS) ---

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="FixMate Home">
      <div className="w-8 h-8 rounded-lg bg-[#F26A36] flex items-center justify-center text-white font-bold font-heading text-sm leading-none">
        F
      </div>
      <span className="font-heading font-bold text-[15px] tracking-tight text-[#14121B]">FixMate</span>
    </Link>
  );
}

function Actions() {
  return (
    <div className="hidden lg:flex items-center gap-2">
      <Button asChild variant="outline" size="sm" className="rounded-full bg-white border-[#E5E0DF] text-[#14121B] hover:bg-[#F6F3F2] px-5 h-9">
        <Link href={AUTH_ACTIONS.signInHref}>Sign In</Link>
      </Button>
      <Button asChild size="sm" className="rounded-full bg-[#F26A36] hover:bg-[#E05824] text-white px-5 h-9 shadow-sm">
        <Link href={AUTH_ACTIONS.bookRepairHref}>Book Repair</Link>
      </Button>
      <Avatar className="w-8 h-8 border border-[#FFD6C2] bg-[#FFF1EC]">
        <AvatarFallback className="bg-[#FFF1EC] text-[#F26A36] text-xs">A</AvatarFallback>
      </Avatar>
    </div>
  );
}

// --- Main Server Component (used in (marketing)/layout.tsx) ---
// Why server wrapper?
// - Navbar shell (logo, layout, backdrop-blur, border) is static, no client JS, fast LCP.
// - Interactive islands (Desktop pill active via usePathname, Mobile Sheet) are client components.
// - This follows shadcn pattern: server layout + client islands.
// - Visible on all public pages: home, services, service-details (/services/[id]), about, payment/success, payment/cancel, tracking — because (marketing) layout covers them.

export function PublicNavbar() {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-[#E5E0DF] supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[64px] flex items-center justify-between gap-4">
        <Logo />

        {/* Center pill nav - desktop only, client island for active route */}
        <div className="hidden lg:flex flex-1 justify-center">
          <PublicNavbarDesktop navItems={[...NAV_ITEMS]} />
        </div>

        <Actions />

        {/* Mobile: client island with Sheet drawer */}
        <div className="lg:hidden">
          <PublicNavbarMobile navItems={[...NAV_ITEMS]} signInHref={AUTH_ACTIONS.signInHref} bookRepairHref={AUTH_ACTIONS.bookRepairHref} />
        </div>
      </div>
    </header>
  );
}
