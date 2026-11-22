"use client";

import { useEffect, useState, use } from "react";
import { CardContainer } from "@/components/ui/card-container";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/modules/status-badge";
import { bookingsApi, paymentsApi, useAuthToken } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";

export default function BookingDetailsPage({ params }: { params: { id: string } | Promise<{ id: string }> }) {
  const resolvedParams = params instanceof Promise ? use(params as Promise<{ id: string }>) : params;
  const id = resolvedParams.id;

  const { data: session } = useSession();
  const token = useAuthToken(session);
  const router = useRouter();

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payLoading, setPayLoading] = useState(false);

  const fetchBooking = async () => {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);
      const res = await bookingsApi.getById(token, id);
      setBooking(res.data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch booking");
      toast.error(err.message || "Failed to fetch booking");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [id, token]);

  const handleCancel = async () => {
    if (!token || !booking) return;
    if (!confirm("Cancel this booking? Only requested bookings can be cancelled.")) return;
    try {
      await bookingsApi.cancel(token, booking._id);
      toast.success("Booking cancelled");
      fetchBooking();
    } catch (err: any) {
      toast.error(err.message || "Failed to cancel");
    }
  };

  const handlePay = async () => {
    if (!token || !booking) return;
    setPayLoading(true);
    try {
      const res = await paymentsApi.createCheckout(token, booking._id);
      const data = res.data as any;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast.error("Failed to create checkout session");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to create checkout");
    } finally {
      setPayLoading(false);
    }
  };

  if (loading) {
    return (
      <CardContainer className="p-8 text-center text-sm text-[#8C9098]">
        Loading booking details from backend...
      </CardContainer>
    );
  }

  if (error) {
    return (
      <CardContainer className="p-8 text-center">
        <h3 className="font-semibold text-[#ba1a1a]">Error</h3>
        <p className="text-sm text-[#8C9098] mt-2">{error}</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/dashboard/customer/bookings")}>
          Back to My Bookings
        </Button>
      </CardContainer>
    );
  }

  if (!booking) {
    return (
      <CardContainer className="p-8 text-center text-sm text-[#8C9098]">Booking not found</CardContainer>
    );
  }

  const statusSteps = ["requested", "accepted", "in-progress", "completed"];
  const currentStepIndex = statusSteps.indexOf(booking.status);
  const isCancelled = booking.status === "cancelled" || booking.status === "rejected";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading">Booking Details</h1>
          <p className="text-sm text-[#55595F] mt-1">
            ID: {booking._id?.slice(-8)} • Created: {new Date(booking.createdAt).toLocaleDateString()}
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push("/dashboard/customer/bookings")}>
          Back to Bookings
        </Button>
      </div>

      {/* Status Timeline */}
      <CardContainer className="p-6">
        <h3 className="font-semibold mb-4">Repair Progress</h3>
        <div className="flex items-center gap-2 overflow-x-auto">
          {statusSteps.map((step, idx) => {
            const isCompleted = !isCancelled && idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex && !isCancelled;
            return (
              <div key={step} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border ${
                    isCompleted
                      ? "bg-[#ECFDF5] border-[#A7F3D0] text-[#059669]"
                      : "bg-[#F6F3F2] border-[#E5E0DF] text-[#8C9098]"
                  } ${isCurrent ? "ring-2 ring-[#F26A36] ring-offset-2" : ""}`}
                >
                  {isCompleted ? "✓" : idx + 1}
                </div>
                <span className={`text-xs font-mono ${isCompleted ? "text-[#14121B]" : "text-[#8C9098]"}`}>
                  {step.toUpperCase()}
                </span>
                {idx < statusSteps.length - 1 && (
                  <div className={`w-8 h-0.5 ${isCompleted && idx < currentStepIndex ? "bg-[#A7F3D0]" : "bg-[#E5E0DF]"}`} />
                )}
              </div>
            );
          })}
          {isCancelled && (
            <div className="flex items-center gap-2 ml-4">
              <div className="w-8 h-8 rounded-full bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-center text-xs text-[#DC2626]">
                ✕
              </div>
              <span className="text-xs font-mono text-[#DC2626]">{booking.status.toUpperCase()}</span>
            </div>
          )}
        </div>
        <div className="mt-4 flex gap-2">
          <StatusBadge status={booking.status} />
          <span className={`text-xs px-2.5 py-1 rounded-full border ${booking.paymentStatus === "paid" ? "bg-[#ECFDF5] border-[#A7F3D0] text-[#059669]" : "bg-[#FFFBEB] border-[#FDE68A] text-[#92400E]"}`}>
            {booking.paymentStatus?.toUpperCase() || "PENDING"}
          </span>
        </div>
      </CardContainer>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left - Service & Customer */}
        <div className="lg:col-span-7 space-y-6">
          <CardContainer className="p-6">
            <h3 className="font-semibold mb-4">Service Details</h3>
            <div className="flex gap-4">
              <div className="w-24 h-24 bg-[#F6F3F2] rounded border overflow-hidden flex items-center justify-center flex-shrink-0">
                {booking.serviceImage ? (
                  <img src={booking.serviceImage} alt={booking.serviceTitle || "Service"} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs text-[#8C9098]">No image</span>
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">{booking.serviceTitle || "Service"}</h4>
                <p className="text-xs font-mono text-[#8C9098] mt-1">{booking.category || "Category"} • ID: {booking.serviceId?.toString().slice(-8)}</p>
                <p className="text-sm text-[#55595F] mt-2">Base Price: {formatCurrency(booking.basePrice)}</p>
                {booking.finalAmount && booking.finalAmount !== booking.basePrice && (
                  <p className="text-sm font-bold text-[#14121B] mt-1">Final Amount: {formatCurrency(booking.finalAmount)}</p>
                )}
              </div>
            </div>
          </CardContainer>

          <CardContainer className="p-6">
            <h3 className="font-semibold mb-4">Customer & Service Address</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="font-mono text-xs text-[#8C9098]">CUSTOMER</span>
                <span>{booking.customerName} • {booking.customerEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-mono text-xs text-[#8C9098]">PHONE</span>
                <span>{booking.customerPhone || booking.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-mono text-xs text-[#8C9098]">ADDRESS</span>
                <span className="text-right max-w-[60%]">{booking.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-mono text-xs text-[#8C9098]">PREFERRED DATE</span>
                <span>{new Date(booking.preferredDate).toLocaleDateString()}</span>
              </div>
              <div className="mt-4">
                <span className="font-mono text-xs text-[#8C9098]">PROBLEM DESCRIPTION</span>
                <p className="mt-1 text-sm bg-[#F9F7F6] border border-[#E7E7E9] rounded p-3">{booking.problemDescription}</p>
              </div>
            </div>
          </CardContainer>

          <CardContainer className="p-6">
            <h3 className="font-semibold mb-4">Technician Dossier</h3>
            <div className="flex gap-3">
              <div className="w-12 h-12 rounded-full bg-[#F6F3F2] border flex items-center justify-center">
                {booking.technicianName ? booking.technicianName[0] : "T"}
              </div>
              <div>
                <div className="font-medium">{booking.technicianName || `Technician ${booking.technicianId?.toString().slice(-6)}`}</div>
                <div className="text-xs text-[#8C9098]">{booking.technicianEmail || "Email not available"}</div>
                <div className="text-xs text-[#8C9098] mt-1">ID: {booking.technicianId?.toString().slice(-8)}</div>
              </div>
            </div>
          </CardContainer>
        </div>

        {/* Right - Payment & Actions */}
        <div className="lg:col-span-5 space-y-6">
          <CardContainer className="p-6">
            <h3 className="font-semibold mb-4">Escrow & Invoice</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#8C9098]">Base Price</span>
                <span>{formatCurrency(booking.basePrice)}</span>
              </div>
              {booking.finalAmount && (
                <div className="flex justify-between text-sm font-bold">
                  <span>Final Amount</span>
                  <span>{formatCurrency(booking.finalAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-[#8C9098]">Payment Status</span>
                <span className={booking.paymentStatus === "paid" ? "text-[#059669]" : "text-[#92400E]"}>{booking.paymentStatus}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#FFFBEB] border border-[#FDE68A] text-xs text-[#92400E]">
                <strong>FixVault Protection:</strong> $2M bonded escrow, 90-day warranty. Pay only after completion.
              </div>

              {booking.status === "requested" && (
                <Button variant="outline" className="w-full text-[#ba1a1a] border-[#FECACA] hover:bg-[#FEF2F2]" onClick={handleCancel}>
                  Cancel Booking (Only Requested)
                </Button>
              )}

              {booking.status === "completed" && booking.paymentStatus !== "paid" && (
                <Button className="w-full bg-[#F26A36] hover:bg-[#E05824]" onClick={handlePay} disabled={payLoading}>
                  {payLoading ? "Creating Checkout..." : `Pay Now ${booking.finalAmount ? formatCurrency(booking.finalAmount) : ""} →`}
                </Button>
              )}

              {booking.paymentStatus === "paid" && (
                <div className="w-full p-3 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] text-center text-sm text-[#059669] font-medium">
                  ✓ Paid — Escrow Released
                </div>
              )}
            </div>
          </CardContainer>

          <CardContainer className="p-4">
            <h4 className="font-semibold text-sm mb-2">Security Note</h4>
            <ul className="text-xs text-[#55595F] space-y-1 list-disc ml-4">
              <li>Amount from DB (finalAmount || basePrice), never from client.</li>
              <li>Pay Now only when completed + unpaid.</li>
              <li>Cancel only when requested.</li>
              <li>Escrow protected, 90-day warranty.</li>
            </ul>
          </CardContainer>
        </div>
      </div>
    </div>
  );
}
