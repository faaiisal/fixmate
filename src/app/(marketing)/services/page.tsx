import { ServiceGrid } from "@/components/modules/service-grid";
import { CardContainer } from "@/components/ui/card-container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const mockServices = [
  { id: "1", title: "Samsung Refrigerator Repair", description: "Compressor replacement & refrigerant recharge", price: 280, category: "Refrigerator", technician: { name: "Marcus Vance", rating: 4.97, verified: true }, status: "approved" as const, available: true },
  { id: "2", title: "LG Washing Machine Drum Fix", description: "Bearing & seal replacement", price: 120, category: "Washing Machine", technician: { name: "Sarah Chen", rating: 4.9, verified: true }, status: "approved" as const, available: true },
  { id: "3", title: "MacBook Pro Logic Board", description: "Microsoldering repair", price: 350, category: "Laptop", technician: { name: "Alex Kumar", rating: 5.0, verified: true }, status: "approved" as const, available: true },
  { id: "4", title: "iPhone 14 Screen Replacement", description: "OEM OLED display", price: 199, category: "Smartphone", technician: { name: "Jane Doe", rating: 4.8, verified: true }, status: "approved" as const, available: true },
  { id: "5", title: "Daikin AC Gas Refill", description: "R32 gas recharge & coil cleaning", price: 150, category: "AC", technician: { name: "John Smith", rating: 4.9, verified: true }, status: "approved" as const, available: true },
  { id: "6", title: "Sony TV Panel Repair", description: "Backlight & panel fix", price: 220, category: "TV", technician: { name: "Mike Wilson", rating: 4.7, verified: true }, status: "approved" as const, available: true },
];

export default function ServicesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-2 text-xs font-mono text-[#8C9098] mb-4">
        <span>HOME</span>
        <span>/</span>
        <span className="text-[#14121B]">SERVICES</span>
        <span className="ml-2 px-2 py-0.5 rounded-full bg-[#E6FCFD] text-[#0891B2] border border-[#A5F3FC]">LIVE: 6 SERVICES</span>
      </div>

      <CardContainer className="p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-heading">Service Hub</h1>
            <p className="text-sm text-[#55595F]">Browse verified repairs with escrow protection</p>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1 lg:w-80">
              <Input placeholder="Search services, e.g. Refrigerator" className="pl-9" />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C9098]">🔍</span>
            </div>
            <Button variant="outline">Filters</Button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {["All", "Refrigerator", "Washing Machine", "Laptop", "Smartphone", "AC", "TV"].map((cat) => (
            <button key={cat} className="px-3 py-1.5 rounded-full text-xs font-medium border bg-white border-[#E5E0DF] hover:border-[#F26A36] hover:bg-[#FFF1EC] transition-colors">
              {cat}
            </button>
          ))}
        </div>
      </CardContainer>

      <ServiceGrid services={mockServices} />
    </div>
  );
}
