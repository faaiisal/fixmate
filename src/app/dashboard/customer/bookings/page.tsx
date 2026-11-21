"use client";

import { useEffect, useState } from "react";
import { CardContainer } from "@/components/ui/card-container";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/modules/status-badge";
import { bookingsApi, paymentsApi } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";

export default function Page() {
  const { data: session } = useSession();
  const token = (session?.user as any)?.id || null;
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("All");

  const fetchBookings = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const params: Record<string, string | number> = {};
      if (filterStatus !== "All") params.status = filterStatus;
      const res = await bookingsApi.myBookings(token, params);
      setBookings(res.data as any[] || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [token, filterStatus]);

  const handleCancel = async (id: string) => {
    if (!token) return;
    try {
      await bookingsApi.cancel(token, id);
      toast.success("Booking cancelled");
      fetchBookings();
    } catch (err: any) {
      toast.error(err.message || "Failed to cancel");
    }
  };

  const handlePay = async (bookingId: string) => {
    if (!token) return;
    try {
      const res = await paymentsApi.createCheckout(token, bookingId);
      const data = res.data as any;
      toast.success("Checkout session created");
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to create payment session");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold font-heading">My Bookings</h1>
          <p className="text-sm text-[#55595F] mt-1">
            Track and manage your repair bookings, status pipeline requested → accepted → in-progress → completed — integrated with backend {process.env.NEXT_PUBLIC_API_URL}
          </p>
        </div>
        <div className="flex gap-2">
          {["All", "requested", "accepted", "in-progress", "completed", "cancelled", "rejected"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1 rounded-full text-xs border ${filterStatus === s ? "bg-[#FFF1EC] border-[#FFD6C2] text-[#F26A36]" : "bg-white border-[#E5E0DF]"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <CardContainer className="p-8 text-center text-sm text-[#8C9098]">Loading bookings from backend...</CardContainer>
      ) : bookings.length === 0 ? (
        <CardContainer className="p-8 text-center">
          <p className="text-[#55595F]">No bookings found. Data is live from backend /api/bookings/my-bookings</p>
        </CardContainer>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookings.map((b: any) => (
            <CardContainer key={b._id} className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-[#8C9098]">ID: {b._id.slice(-6).toUpperCase()}</span>
                <StatusBadge status={b.status} />
              </div>
              <h4 className="font-semibold text-[#14121B] line-clamp-1">{b.problemDescription?.slice(0, 60) || "Repair Booking"}</h4>
              <div className="mt-2 text-sm text-[#55595F] space-y-1">
                <div>Service: {b.serviceId?.toString().slice(-6) || "Service"}</div>
                <div>Customer: {b.customerName}</div>
                <div>Technician: {b.technicianId?.toString().slice(-6) || "Assigned"}</div>
                <div className="font-mono text-xs text-[#8C9098]">{new Date(b.preferredDate).toLocaleDateString()} • {new Date(b.createdAt).toLocaleDateString()}</div>
                <div className="text-xs">Base: {formatCurrency(b.basePrice)} {b.finalAmount ? `• Final: ${formatCurrency(b.finalAmount)}` : ""}</div>
                <div className="text-xs font-mono">Payment: {b.paymentStatus}</div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="font-bold">{formatCurrency(b.finalAmount || b.basePrice)}</span>
                {b.status === "requested" && (
                  <Button variant="outline" size="sm" className="text-xs rounded-full" onClick={() => handleCancel(b._id)}>Cancel</Button>
                )}
                {b.status === "completed" && b.paymentStatus === "pending" && (
                  <Button size="sm" className="bg-[#F26A36] text-xs rounded-full" onClick={() => handlePay(b._id)}>Pay Now →</Button>
                )}
              </div>
            </CardContainer>
          ))}
        </div>
      )}
    </div>
  );
}
