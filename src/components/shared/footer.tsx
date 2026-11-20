import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-[#E5E0DF] bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity" aria-label="FixMate Home">
              <Image src="/fixmate-logo.png" alt="FixMate" width={120} height={64} className="w-[120px] h-auto object-contain" />
            </Link>
            <p className="text-sm text-[#55595F] max-w-xs">
              Smart Device & Home Appliance Repair with Real-time Telemetry & Escrow Protection.
            </p>
            <div className="mt-4 flex items-center gap-2 text-[10px] font-mono">
              <span className="px-2 py-1 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">99.98% UPTIME</span>
              <span className="px-2 py-1 rounded-full bg-[#F6F3F2] border border-[#E5E0DF] text-[#8C9098]">TLS 1.3</span>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Platform</h4>
            <ul className="space-y-2 text-sm text-[#55595F]">
              <li><Link href="/services" className="hover:text-[#14121B]">Browse Services</Link></li>
              <li><Link href="/about" className="hover:text-[#14121B]">How Escrow Works</Link></li>
              <li><Link href="/pricing" className="hover:text-[#14121B]">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Resources</h4>
            <ul className="space-y-2 text-sm text-[#55595F]">
              <li><Link href="/about" className="hover:text-[#14121B]">About</Link></li>
              <li><Link href="/pricing" className="hover:text-[#14121B]">Warranty</Link></li>
              <li><Link href="/about" className="hover:text-[#14121B]">Compliance</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Compliance</h4>
            <div className="space-y-2 text-xs font-mono text-[#8C9098]">
              <div>TX: 0x8F2A...991C</div>
              <div>ISO-9001 CERTIFIED</div>
              <div>SOC-2 COMPLIANT</div>
              <div>FixVault Bonded $2M</div>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-[#E5E0DF] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#8C9098]">
          <span>© 2024 FixMate Precision Repair Platform. All rights reserved.</span>
          <span className="font-mono">NODE: CLUSTER-US-WEST-2B // LATENCY 12ms</span>
        </div>
      </div>
    </footer>
  );
}

// Backward compatibility
export const PublicFooter = Footer;
