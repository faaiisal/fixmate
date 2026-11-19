"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TelemetryBadge } from "@/components/ui/telemetry-badge";
import { Menu, X } from "lucide-react";
import * as React from "react";

const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
];

export function PublicNavbar() {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-[#E5E0DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#F26A36] flex items-center justify-center text-white font-bold font-heading">F</div>
          <span className="font-heading font-bold text-[#14121B] text-lg">FixMate</span>
          <span className="hidden sm:inline-flex text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#F6F3F2] border border-[#E5E0DF] text-[#8C9098]">v2.4 LUMINOUS</span>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 rounded-full bg-[#F6F3F2] border border-[#E5E0DF]">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className="px-4 py-1.5 rounded-full text-sm font-medium text-[#55595F] hover:text-[#14121B] hover:bg-white transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
          <TelemetryBadge type="success" pulse label="SYSTEM OPERATIONAL" className="ml-2 hidden lg:inline-flex" />
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/sign-in">Sign In</Link>
          </Button>
          <Button asChild size="sm" className="bg-[#F26A36] hover:bg-[#E05824] text-white">
            <Link href="/sign-up">Get Started</Link>
          </Button>
        </div>

        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-[#E5E0DF] bg-white p-4 space-y-3">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="block py-2 text-[#14121B] font-medium" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <div className="flex gap-2 pt-2">
            <Button asChild variant="outline" className="flex-1">
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button asChild className="flex-1 bg-[#F26A36]">
              <Link href="/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
