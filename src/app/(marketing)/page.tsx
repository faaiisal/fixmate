import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CardContainer } from "@/components/ui/card-container";
import { TelemetryBadge } from "@/components/ui/telemetry-badge";
import { CategoryCard } from "@/components/modules/category-card";
import { ServiceCard } from "@/components/modules/service-card";
import { StatCard } from "@/components/modules/stat-card";

const categories = [
  { icon: "❄️", label: "Refrigerator", count: 24 },
  { icon: "👕", label: "Washing Machine", count: 18 },
  { icon: "❄️", label: "Air Conditioner", count: 32 },
  { icon: "📺", label: "Television", count: 14 },
  { icon: "💻", label: "Laptop", count: 28 },
  { icon: "📱", label: "Smartphone", count: 22 },
  { icon: "🔧", label: "Appliance", count: 16 },
  { icon: "🛠️", label: "Hardware", count: 12 },
];

const featuredServices = [
  { id: "1", title: "Samsung Bespoke Refrigerator Repair", description: "Inverter Linear Compressor OEM replacement with R600a recharge", price: 280, category: "Refrigerator", technician: { name: "Marcus Vance", rating: 4.97, verified: true } },
  { id: "2", title: "LG Front Load Washing Machine Fix", description: "Drum bearing replacement & water inlet valve diagnostic", price: 120, category: "Washing Machine", technician: { name: "Sarah Chen", rating: 4.9, verified: true } },
  { id: "3", title: "MacBook Pro Logic Board Repair", description: "Precision microsoldering & thermal paste replacement", price: 350, category: "Laptop", technician: { name: "Alex Kumar", rating: 5.0, verified: true } },
];

export default function HomePage() {
  return (
    <div className="bg-[#FCF9F8]">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 right-20 w-96 h-96 bg-[#F26A36]/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#00C4D6]/10 rounded-full blur-[120px]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E5E0DF] shadow-sm text-xs">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <span className="font-mono text-[#8C9098]">LIVE DISPATCH ACTIVE</span>
                <TelemetryBadge type="success" label="142 TECHNICIANS ONLINE" mono />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-[48px] font-extrabold tracking-tight font-heading leading-[1.1]">
                Smart Repair,<br />
                <span className="text-[#F26A36]">Escrow Secured</span>
              </h1>
              <p className="text-lg text-[#55595F] max-w-xl">
                Connect with verified master technicians. Real-time GPS tracking, FixVault escrow protection, and 90-day warranty guarantee.
              </p>
              <CardContainer className="p-4 max-w-md">
                <div className="flex gap-2">
                  <select className="flex-1 h-11 rounded-lg border border-[#E5E0DF] bg-white px-3 text-sm">
                    <option>Select Appliance</option>
                    <option>Refrigerator</option>
                    <option>Washing Machine</option>
                    <option>Laptop</option>
                  </select>
                  <input placeholder="ZIP Code" className="w-24 h-11 rounded-lg border border-[#E5E0DF] bg-white px-3 text-sm" />
                  <Button className="bg-[#F26A36] hover:bg-[#E05824] h-11 px-6">Find Tech</Button>
                </div>
              </CardContainer>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="flex items-center gap-1.5"><span className="w-5 h-5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#059669]">✓</span> Escrow Protected $2M</span>
                <span className="flex items-center gap-1.5"><span className="w-5 h-5 rounded-full bg-[#E6FCFD] border border-[#A5F3FC] flex items-center justify-center text-[#0891B2]">✓</span> Live GPS Tracking</span>
                <span className="flex items-center gap-1.5"><span className="w-5 h-5 rounded-full bg-[#F5F3FF] border border-[#DDD6FE] flex items-center justify-center text-[#7C3AED]">✓</span> 90-Day Warranty</span>
              </div>
            </div>
            <div className="lg:col-span-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <StatCard title="Active Dispatches" value="2,847" subtitle="Today" trend="+12%" trendType="positive" />
                <StatCard title="Fix Rate" value="99.1%" subtitle="Last 30 days" trend="+0.3%" trendType="positive" />
              </div>
              <CardContainer className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-[#8C9098]">LIVE DISPATCH #FX-88402</span>
                  <TelemetryBadge type="info" pulse label="EN ROUTE 8min" mono />
                </div>
                <div className="h-32 bg-[#F6F3F2] rounded-lg border border-[#E5E0DF] flex items-center justify-center text-xs text-[#8C9098]">Live Map Placeholder</div>
                <div className="mt-3 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#F6F3F2] border border-[#E5E0DF]" />
                  <div>
                    <div className="text-sm font-medium">Marcus Vance</div>
                    <div className="text-xs text-[#8C9098]">Van #14 • 1.4mi away • PIN 4829</div>
                  </div>
                </div>
              </CardContainer>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold font-heading">Browse by Category</h2>
          <Link href="/services" className="text-sm text-[#F26A36] hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((c) => (
            <CategoryCard key={c.label} icon={c.icon} label={c.label} count={c.count} />
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold font-heading mb-6">Featured Repairs</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {featuredServices.map((s) => (
            <ServiceCard key={s.id} {...s} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#14121B] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold font-heading">Ready for Precision Repair?</h2>
          <p className="mt-3 text-[#8C9098] max-w-2xl mx-auto">Join 10,000+ homeowners protected by FixVault escrow. Zero-risk, 90-day warranty, real-time tracking.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Button asChild size="lg" className="bg-[#F26A36] hover:bg-[#E05824]">
              <Link href="/services">Book Repair</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-transparent border-white/20 text-white hover:bg-white/10">
              <Link href="/about">How Escrow Works</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
