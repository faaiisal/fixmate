import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { NavbarDesktop } from "./navbar-desktop";
import { NavbarMobile } from "./navbar-mobile";

// --- Constants: follows header order from screenshot + pricing requirement ---
const NAV_ITEMS = [
  { href: "/", label: "Home", exact: true },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
] as const;

const AUTH_ACTIONS = {
  signInHref: "/sign-in",
  bookRepairHref: "/sign-up", // Book Repair → signup per fix
} as const;

// --- Logo: 120px as requested, real public/fixmate-logo.png ---
function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 shrink-0 group" aria-label="FixMate Home">
      <Image
        src="/fixmate-logo.png"
        alt="FixMate"
        width={120}
        height={64}
        className="w-[120px] h-auto object-contain"
        priority
      />
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

// --- Main Server Component: simple name "navbar" per clean convention ---
// Why server wrapper? Logo + layout static, fast LCP, only pill active + Sheet need client islands.
// Visible on all public pages: home, services, service-details, about, pricing, payment, tracking

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-[#E5E0DF] supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between gap-4">
        <Logo />

        <div className="hidden lg:flex flex-1 justify-center">
          <NavbarDesktop navItems={[...NAV_ITEMS]} />
        </div>

        <Actions />

        <div className="lg:hidden">
          <NavbarMobile navItems={[...NAV_ITEMS]} signInHref={AUTH_ACTIONS.signInHref} bookRepairHref={AUTH_ACTIONS.bookRepairHref} />
        </div>
      </div>
    </header>
  );
}

// Keep backward compatibility for old import name PublicNavbar
export const PublicNavbar = Navbar;
