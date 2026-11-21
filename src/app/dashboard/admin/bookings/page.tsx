"use client";

import { useEffect, useState } from "react";
import { CardContainer } from "@/components/ui/card-container";
import { StatusBadge } from "@/components/modules/status-badge";
import { bookingsApi } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";

export default function Page() {
  const { data: session } = useSession();
  const token = (session?.user as any)?.id || null;
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchAll = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const params: Record<string, any> = { limit: 50 };
      if (statusFilter !== "All") params.status = statusFilter;
      const res = await bookingsApi.adminAll(token, params);
      setBookings(res.data as any[] || []);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, [token, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading">All Bookings</h1>
          <p className="text-sm text-[#55595F] mt-1">System-wide bookings overview — backend /api/bookings (admin)</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", "requested", "accepted", "in-progress", "completed", "rejected", "cancelled"].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1 rounded-full text-xs border ${statusFilter === s ? "bg-[#FFF1EC] border-[#FFD6C2] text-[#F26A36]" : "bg-white border-[#E5E0DF]"}`}>{s}</button>
          ))}
        </div>
      </div>

      {loading ? <CardContainer className="p-8 text-center text-sm text-[#8C9098]">Loading all bookings...</CardContainer> :
        bookings.length === 0 ? <CardContainer className="p-8 text-center text-[#8C9098]">No bookings found</CardContainer> :
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookings.map((b: any) => (
              <CardContainer key={b._id} className="p-5">
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-mono text-[#8C9098]">{b._id.slice(-6)}</span>
                  <StatusBadge status={b.status} />
                </div>
                <h4 className="font-semibold line-clamp-1">{b.problemDescription?.slice(0, 80)}</h4>
                <div className="text-xs text-[#55595F] mt-2 space-y-1">
                  <div>Customer: {b.customerName} ({b.customerEmail})</div>
                  <div>Tech: {b.technicianId?.toString().slice(-6)}</div>
                  <div>Service: {b.serviceId?.toString().slice(-6)} • Base {formatCurrency(b.basePrice)} {b.finalAmount ? `Final ${formatCurrency(b.finalAmount)}` : ""}</div>
                  <div>Payment: {b.paymentStatus} • Preferred: {new Date(b.preferredDate).toLocaleDateString()}</div>
                </div>
              </CardContainer>
            ))}
          </div>
      }
    </div>
  );
}
