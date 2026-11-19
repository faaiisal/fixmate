import { CardContainer } from "@/components/ui/card-container";
import { StatusBadge } from "./status-badge";
import { formatCurrency } from "@/lib/utils";

interface BookingCardProps {
  id: string;
  serviceTitle: string;
  customerName: string;
  technicianName?: string;
  status: string;
  amount: number;
  date: string;
}

export function BookingCard({ id, serviceTitle, customerName, technicianName, status, amount, date }: BookingCardProps) {
  return (
    <CardContainer className="p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono text-[#8C9098]">WO-{id.slice(0, 6).toUpperCase()}</span>
        <StatusBadge status={status} />
      </div>
      <h4 className="font-semibold text-[#14121B]">{serviceTitle}</h4>
      <div className="mt-2 text-sm text-[#55595F] space-y-1">
        <div>Customer: {customerName}</div>
        {technicianName && <div>Technician: {technicianName}</div>}
        <div className="font-mono text-xs text-[#8C9098]">{date}</div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="font-bold">{formatCurrency(amount)}</span>
        <span className="text-[10px] font-mono px-2 py-1 rounded-full bg-[#F6F3F2] border border-[#E5E0DF]">View →</span>
      </div>
    </CardContainer>
  );
}
