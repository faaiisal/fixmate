import Link from "next/link";
import { CardContainer } from "@/components/ui/card-container";
import { TelemetryBadge } from "@/components/ui/telemetry-badge";
import { formatCurrency } from "@/lib/utils";

interface ServiceCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  technician?: { name: string; rating: number; verified?: boolean };
  status?: "pending" | "approved" | "rejected";
  available?: boolean;
}

export function ServiceCard({ id, title, description, price, category, technician, status, available = true }: ServiceCardProps) {
  return (
    <Link href={`/services/${id}`}>
      <CardContainer hoverable className="overflow-hidden p-0 h-full flex flex-col">
        <div className="h-48 bg-[#F6F3F2] relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center text-[#C4C0C0] text-xs">Service Image</div>
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur text-[10px] font-mono border border-[#E5E0DF]">{category}</span>
            {status && <TelemetryBadge type={status === "approved" ? "success" : status === "pending" ? "warning" : "error"} label={status.toUpperCase()} mono />}
          </div>
          {!available && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
              <span className="px-3 py-1 rounded-full bg-[#FEF2F2] text-[#DC2626] text-xs font-medium border border-[#FECACA]">Unavailable</span>
            </div>
          )}
        </div>
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="font-heading font-semibold text-[#14121B] line-clamp-1">{title}</h3>
          <p className="mt-1 text-sm text-[#55595F] line-clamp-2 flex-1">{description}</p>
          {technician && (
            <div className="mt-3 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#F6F3F2] border border-[#E5E0DF] flex items-center justify-center text-[10px]">{technician.name[0]}</div>
              <span className="text-xs text-[#55595F]">{technician.name}</span>
              {technician.verified && <span className="w-3 h-3 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[8px]">✓</span>}
              <span className="text-xs font-mono text-[#8C9098]">★ {technician.rating}</span>
            </div>
          )}
          <div className="mt-4 flex items-center justify-between">
            <span className="font-bold text-[#14121B]">{formatCurrency(price)}</span>
            <span className="text-[10px] font-mono px-2 py-1 rounded-full bg-[#FFF1EC] text-[#F26A36] border border-[#FFD6C2]">BOOK NOW →</span>
          </div>
        </div>
      </CardContainer>
    </Link>
  );
}
