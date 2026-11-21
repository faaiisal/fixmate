"use client";

import { useEffect, useState } from "react";
import { CardContainer } from "@/components/ui/card-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [filter, setFilter] = useState("All");
  const [finalAmounts, setFinalAmounts] = useState<Record<string, number>>({});

  const fetchAssigned = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const params: Record<string, any> = {};
      if (filter !== "All") params.status = filter;
      const res = await bookingsApi.assigned(token, params);
      setBookings(res.data as any[] || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch assigned bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAssigned(); }, [token, filter]);

  const handleAction = async (id: string, action: "accept" | "reject" | "start") => {
    if (!token) return;
    try {
      if (action === "accept") await bookingsApi.accept(token, id);
      if (action === "reject") await bookingsApi.reject(token, id);
      if (action === "start") await bookingsApi.start(token, id);
      toast.success(`Booking ${action}ed`);
      fetchAssigned();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleComplete = async (id: string) => {
    if (!token) return;
    const amount = finalAmounts[id];
    if (!amount || amount <= 0) {
      toast.error("Final amount required and must be positive");
      return;
    }
    try {
      await bookingsApi.complete(token, id, amount);
      toast.success("Repair completed with final amount");
      fetchAssigned();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading">Repair Requests</h1>
          <p className="text-sm text-[#55595F] mt-1">Accept/Reject/In-Progress/Completed pipeline — backend /api/bookings/assigned</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", "requested", "accepted", "in-progress", "completed", "rejected", "cancelled"].map(s => (
            <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1 rounded-full text-xs border ${filter === s ? "bg-[#FFF1EC] border-[#FFD6C2] text-[#F26A36]" : "bg-white border-[#E5E0DF]"}`}>{s}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <CardContainer className="p-8 text-center text-sm text-[#8C9098]">Loading assigned requests...</CardContainer>
      ) : bookings.length === 0 ? (
        <CardContainer className="p-8 text-center text-[#8C9098]">No assigned bookings. When customers book your approved services, they appear here.</CardContainer>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {bookings.map((b: any) => (
            <CardContainer key={b._id} className="p-5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-mono text-[#8C9098]">ID {b._id.slice(-6)}</span>
                <StatusBadge status={b.status} />
              </div>
              <h4 className="font-semibold">{b.problemDescription?.slice(0, 80)}</h4>
              <div className="text-sm text-[#55595F] mt-2 space-y-1">
                <div>Customer: {b.customerName} ({b.customerEmail})</div>
                <div>Phone: {b.phone}</div>
                <div>Address: {b.address}</div>
                <div>Date: {new Date(b.preferredDate).toLocaleString()}</div>
                <div>Base: {formatCurrency(b.basePrice)} {b.finalAmount ? `• Final: ${formatCurrency(b.finalAmount)}` : ""} • Payment: {b.paymentStatus}</div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {b.status === "requested" && (
                  <>
                    <Button size="sm" className="bg-[#10B981] text-xs" onClick={() => handleAction(b._id, "accept")}>Accept</Button>
                    <Button variant="outline" size="sm" className="text-xs" onClick={() => handleAction(b._id, "reject")}>Reject</Button>
                  </>
                )}
                {b.status === "accepted" && (
                  <Button size="sm" className="bg-[#0EA5E9] text-xs" onClick={() => handleAction(b._id, "start")}>Start Repair → In-Progress</Button>
                )}
                {b.status === "in-progress" && (
                  <div className="flex items-center gap-2">
                    <Input type="number" placeholder="Final amount" className="w-28 h-8 text-xs" value={finalAmounts[b._id] || ""} onChange={(e) => setFinalAmounts({ ...finalAmounts, [b._id]: Number(e.target.value) })} />
                    <Button size="sm" className="bg-[#F26A36] text-xs" onClick={() => handleComplete(b._id)}>Complete</Button>
                  </div>
                )}
              </div>
            </CardContainer>
          ))}
        </div>
      )}
    </div>
  );
}
