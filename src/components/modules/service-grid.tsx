import { ServiceCard } from "./service-card";

interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  technician?: { name: string; rating: number; verified?: boolean };
  status?: "pending" | "approved" | "rejected";
  available?: boolean;
}

export function ServiceGrid({ services }: { services: Service[] }) {
  if (!services.length) {
    return (
      <div className="py-12 text-center">
        <div className="w-12 h-12 rounded-full bg-[#F6F3F2] border border-[#E5E0DF] flex items-center justify-center mx-auto mb-3">🔍</div>
        <p className="text-[#55595F]">No services found</p>
      </div>
    );
  }
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((s) => (
        <ServiceCard key={s.id} {...s} />
      ))}
    </div>
  );
}
