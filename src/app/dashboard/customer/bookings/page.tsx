"use client";

import { useEffect, useState } from "react";
import { CardContainer } from "@/components/ui/card-container";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/modules/status-badge";
import { bookingsApi, paymentsApi, useAuthToken } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";

export default function Page() {
  const { data: session } = useSession();
  const token = useAuthToken(session);
  const sessionUser = session as any;
  const role = sessionUser?.user?.role || sessionUser?.role || "customer";
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
    if (role !== "customer") {
      toast.error("Only customers can cancel bookings");
      return;
    }
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
    if (role !== "customer") {
      toast.error("Only customers can pay for bookings");
      return;
    }
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
          <p className="text-[11px] font-mono text-[#8C9098] mt-2 bg-[#F9F7F6] border border-[#E7E7E9] rounded p-2">
            Journey: Browse Services → Request Repair (requested) → Technician Accepts (accepted) → Starts Work (in-progress) → Completes & Sets Final Amount (completed) → Pay Now → Paid → Payment History. Click card for detailed tracking.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
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
          <p className="text-xs font-mono text-[#8C9098] mt-2">Create a booking from Services → Confirm & Request Repair. Then technician must accept → start → complete before Pay Now appears. Payments appear after paid.</p>
        </CardContainer>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookings.map((b: any) => (
            <CardContainer
              key={b._id}
              className="p-5 hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => {
                // Navigate to detail for step-by-step tracking
                window.location.href = `/dashboard/customer/bookings/${b._id}`;
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-[#8C9098]">ID: {b._id.slice(-6).toUpperCase()}</span>
                <StatusBadge status={b.status} />
              </div>
              {/* Service Image + Title from snapshots (Phase 3) */}
              <div className="flex gap-3 mb-3">
                <div className="w-16 h-16 bg-[#F6F3F2] rounded border overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {b.serviceImage ? (
                    <img src={b.serviceImage} alt={b.serviceTitle || "Service"} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[10px] text-[#8C9098]">No image</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-[#14121B] line-clamp-1 group-hover:text-[#F26A36] transition-colors">{b.serviceTitle || b.problemDescription?.slice(0, 60) || "Repair Booking"}</h4>
                  <p className="text-[11px] font-mono text-[#8C9098] mt-1">{b.category || "Category"} • {b.serviceId?.toString().slice(-6) || "Service"}</p>
                </div>
              </div>
              <div className="mt-2 text-sm text-[#55595F] space-y-1">
                <div>Customer: {b.customerName}</div>
                <div>Technician: {b.technicianName || `Tech ${b.technicianId?.toString().slice(-6) || "Assigned"}`}</div>
                <div className="font-mono text-xs text-[#8C9098]">{new Date(b.preferredDate).toLocaleDateString()} • {new Date(b.createdAt).toLocaleDateString()}</div>
                <div className="text-xs">Base: {formatCurrency(b.basePrice)} {b.finalAmount && b.finalAmount !== b.basePrice ? `• Final: ${formatCurrency(b.finalAmount)}` : ""}</div>
                <div className="text-xs font-mono">Payment: {b.paymentStatus} {b.paymentStatus === "pending" ? "(unpaid)" : ""}</div>
                {/* Step-by-step tracking visual */}
                <div className="flex items-center gap-1 mt-2 text-[10px] font-mono">
                  {["requested", "accepted", "in-progress", "completed", "paid"].map((step, idx) => {
                    const steps = ["requested", "accepted", "in-progress", "completed"];
                    const isCompleted = steps.indexOf(b.status) >= idx || (step === "paid" && b.paymentStatus === "paid");
                    const isCurrent = b.status === step || (step === "paid" && b.paymentStatus === "paid");
                    return (
                      <span key={step} className="flex items-center gap-1">
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center border text-[8px] ${isCompleted ? "bg-[#ECFDF5] border-[#A7F3D0] text-[#059669]" : "bg-[#F6F3F2] border-[#E5E0DF] text-[#8C9098]"}`}>
                          {isCompleted ? "✓" : idx + 1}
                        </span>
                        {idx < 4 && <span className={`w-3 h-0.5 ${isCompleted ? "bg-[#A7F3D0]" : "bg-[#E5E0DF]"}`} />}
                      </span>
                    );
                  })}
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 items-center">
                <span className="font-bold">{formatCurrency(b.finalAmount || b.basePrice)}</span>
                {/* Only Customer should see cancellation and payment actions */}
                {role === "customer" && b.status === "requested" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCancel(b._id);
                    }}
                  >
                    Cancel
                  </Button>
                )}
                {role === "customer" && b.status === "completed" && b.paymentStatus === "pending" && (
                  <Button
                    size="sm"
                    className="bg-[#F26A36] text-xs rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePay(b._id);
                    }}
                  >
                    Pay Now →
                  </Button>
                )}
                <span className="text-[10px] font-mono text-[#8C9098] ml-auto">Click for detailed tracking →</span>
              </div>
            </CardContainer>
          ))}
        </div>
      )}
    </div>
  );
}
