import Link from "next/link";
import { CardContainer } from "@/components/ui/card-container";
import { TelemetryBadge } from "@/components/ui/telemetry-badge";
import { Button } from "@/components/ui/button";

const pricingTiers = [
  { service: "Screen Replacement", price: "$99", desc: "OEM OLED, TrueTone programming, IP68 reseal", badge: "Smartphone" },
  { service: "Battery Replacement", price: "$49", desc: "High-capacity cells, health calibration", badge: "Smartphone" },
  { service: "Water Damage Repair", price: "$149", desc: "Ultrasonic cleaning, corrosion microsoldering", badge: "Laptop & PC" },
  { service: "Software Troubleshooting", price: "$79", desc: "Diagnostics, OS reinstall, malware removal", badge: "All Devices" },
  { service: "Refrigerator Diagnostics", price: "$35", desc: "Sensor loop, inverter fix, frost defrost", badge: "Refrigerator" },
  { service: "AC Deep Chemical Wash", price: "$40", desc: "Jet wash, coil conditioning, gas top-up", badge: "Air Conditioners" },
];

const guarantees = [
  { title: "90-Day Warranty", desc: "If same issue recurs within 90 days, we fix free. Parts & labor fully escrowed." },
  { title: "Transparent Upfront", desc: "Zero hidden fees. Itemized quote approved before screwdriver touches device." },
  { title: "FixVault $2M Bonded", desc: "Funds remain in escrow until you inspect operation. Cryptographic ledger TX: 0x8F2A...991C" },
  { title: "OEM Compatible", desc: "Guaranteed OEM parts, calibrated toolset, ISO-9001 certified labs." },
];

export default function PricingPage() {
  return (
    <div className="bg-[#F7F7F8] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono">
            <Link href="/" className="text-[#8C9098] hover:text-[#14121B]">HOME</Link>
            <span className="text-[#C4C0C0]">/</span>
            <span className="text-[#14121B]">PRICING</span>
            <TelemetryBadge type="success" label="FLAT RATES • NO HIDDEN FEES" mono className="ml-2" />
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7">
              <h1 className="text-3xl sm:text-4xl font-bold font-heading tracking-tight leading-[1.1]">
                Transparent Pricing for <span className="text-[#F26A36]">Precision Repair</span>
              </h1>
              <p className="mt-4 text-[#55595F] max-w-2xl">
                Flat-rate baseline fees including on-site telemetry diagnostic verification. Pay only after completion, protected by FixVault escrow.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild className="bg-[#F26A36] hover:bg-[#E05824] rounded-full px-6">
                  <Link href="/services">Explore All 22 Services</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full bg-white border-[#E5E0DF]">
                  <Link href="/about">How Escrow Works</Link>
                </Button>
              </div>
            </div>

            <CardContainer className="lg:col-span-5 p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <span className="font-mono text-xs font-semibold">LIVE PRICING VERIFIED</span>
                <span className="ml-auto text-[10px] font-mono px-2 py-1 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">ISO-9001</span>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-[#8C9098]">Avg Response</span><span className="font-semibold">28 min</span></div>
                <div className="flex justify-between"><span className="text-[#8C9098]">First-Visit Fix Rate</span><span className="font-semibold text-[#10B981]">99.4% Verified</span></div>
                <div className="flex justify-between"><span className="text-[#8C9098]">Warranty</span><span className="font-semibold">90-Day</span></div>
                <div className="flex justify-between"><span className="text-[#8C9098]">Escrow</span><span className="font-semibold">FixVault $2M</span></div>
              </div>
            </CardContainer>
          </div>
        </div>

        {/* Service Pricing */}
        <section>
          <h2 className="text-xl font-bold font-heading mb-2">Service Pricing</h2>
          <p className="text-sm text-[#55595F] mb-6">Transparent baseline fees — final quote after diagnostic, no hidden surcharges.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pricingTiers.map((tier) => (
              <CardContainer key={tier.service} className="p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-full bg-[#FFF1EC] text-[#F26A36] text-[10px] font-mono border border-[#FFD6C2]">{tier.badge}</span>
                    <span className="font-heading text-xl font-bold">{tier.price}</span>
                  </div>
                  <h3 className="font-semibold text-sm">{tier.service}</h3>
                  <p className="text-xs text-[#737373] mt-1">{tier.desc}</p>
                </div>
                <Button asChild size="sm" variant="outline" className="mt-4 rounded-full w-full">
                  <Link href="/services">View Details & Book</Link>
                </Button>
              </CardContainer>
            ))}
          </div>
        </section>

        {/* Guarantee */}
        <section>
          <h2 className="text-xl font-bold font-heading mb-2">Guarantee</h2>
          <p className="text-sm text-[#55595F] mb-6">All repairs come with a 90-day warranty. If same issue recurs, we fix free.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {guarantees.map((g) => (
              <CardContainer key={g.title} className="p-5 space-y-2">
                <h4 className="font-semibold text-sm">{g.title}</h4>
                <p className="text-xs text-[#55595F] leading-relaxed">{g.desc}</p>
              </CardContainer>
            ))}
          </div>
        </section>

        {/* Contact */}
        <CardContainer className="p-8 text-center">
          <h2 className="text-lg font-semibold font-heading">Contact Us & Support</h2>
          <p className="mt-2 text-sm text-[#55595F] max-w-2xl mx-auto">
            For any questions regarding pricing or services, reach out to our support team at{" "}
            <a href="mailto:support@fixmate.com" className="text-[#F26A36] hover:underline font-medium">
              support@fixmate.com
            </a>{" "}
            or call emergency dispatch <span className="font-mono">1-800-FIX-MATE</span>.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button asChild className="rounded-full bg-[#F26A36] hover:bg-[#E05824]">
              <Link href="/sign-up">Get Started</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full bg-white">
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </CardContainer>
      </div>
    </div>
  );
}
