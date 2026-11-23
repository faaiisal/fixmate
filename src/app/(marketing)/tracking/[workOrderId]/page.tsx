"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CardContainer } from "@/components/ui/card-container";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/modules/status-badge";
import { bookingsApi, useAuthToken } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { getCategoryImage } from "@/lib/category-image";
import { formatCurrency } from "@/lib/utils";

interface BookingRecord {
  _id: string;
  serviceId?: string;
  status: "requested" | "accepted" | "in-progress" | "completed" | "rejected" | "cancelled";
  paymentStatus?: "pending" | "paid" | "failed";
  serviceTitle?: string;
  serviceImage?: string;
  category?: string;
  problemDescription?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  phone?: string;
  technicianName?: string;
  technicianEmail?: string;
  preferredDate?: string;
  address?: string;
  basePrice?: number;
  finalAmount?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface PageError {
  message: string;
  status?: number;
}

const STAGES = [
  { key: "requested", label: "Requested", detail: "Repair request submitted" },
  { key: "accepted", label: "Accepted", detail: "Technician accepted the job" },
  { key: "in-progress", label: "In progress", detail: "Repair work started" },
  { key: "completed", label: "Completed", detail: "Work finished and final amount set" },
  { key: "paid", label: "Paid", detail: "Payment verified server-side" },
] as const;

function statusStepIndex(status: BookingRecord["status"]): number {
  return ["requested", "accepted", "in-progress", "completed"].indexOf(status);
}

function TerminalNotice({ status }: { status: BookingRecord["status"] }) {
  const cancelled = status === "cancelled";
  return (
    <CardContainer className={`p-5 ${cancelled ? "bg-[#FFFBEB] border-[#FDE68A]" : "bg-[#FEF2F2] border-[#FECACA]"}`}>
      <div className="flex items-start gap-3">
        <span className="text-xl" aria-hidden="true">{cancelled ? "⏹" : "✕"}</span>
        <div>
          <h2 className={`font-semibold ${cancelled ? "text-[#92400E]" : "text-[#991B1B]"}`}>
            Booking {cancelled ? "cancelled" : "rejected"}
          </h2>
          <p className={`mt-1 text-sm ${cancelled ? "text-[#92400E]" : "text-[#991B1B]"}`}>
            {cancelled
              ? "This booking was cancelled before work was completed. No payment is due for a cancelled job."
              : "The technician rejected this request before work was completed. Please book another service or choose a different technician."}
          </p>
          <p className="mt-2 text-xs font-mono opacity-80">
            This is a terminal state. The recorded status does not include earlier transition timestamps, so only the final state is shown.
          </p>
        </div>
      </div>
    </CardContainer>
  );
}

function ProgressTimeline({ booking }: { booking: BookingRecord }) {
  const currentIndex = statusStepIndex(booking.status);
  const isTerminal = booking.status === "cancelled" || booking.status === "rejected";
  const isPaid = booking.paymentStatus === "paid";

  return (
    <CardContainer className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5">
        <div>
          <h2 className="font-semibold">Repair Progress</h2>
          <p className="text-xs text-[#8C9098] mt-1">Status values come from the booking record — no GPS, movement, or ETA is inferred.</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={booking.status} />
          <span className={`text-xs px-2.5 py-1 rounded-full border ${isPaid ? "bg-[#ECFDF5] border-[#A7F3D0] text-[#059669]" : "bg-[#FFFBEB] border-[#FDE68A] text-[#92400E]"}`}>
            {(booking.paymentStatus || "pending").toUpperCase()}
          </span>
        </div>
      </div>

      <ol className="grid grid-cols-1 gap-3 sm:grid-cols-5">
        {STAGES.map((stage, index) => {
          let state: "complete" | "current" | "upcoming" = "upcoming";

          if (stage.key === "paid") {
            state = isPaid ? "complete" : booking.status === "completed" ? "current" : "upcoming";
          } else if (isTerminal) {
            state = index === 0 ? "complete" : "upcoming";
          } else if (index < currentIndex) {
            state = "complete";
          } else if (index === currentIndex) {
            state = "current";
          }

          return (
            <li key={stage.key} className="flex items-start gap-3 sm:flex-col sm:items-stretch" aria-current={state === "current" ? "step" : undefined}>
              <div className="flex items-center sm:w-full">
                <span
                  className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-xs font-medium border ${
                    state === "complete"
                      ? "bg-[#ECFDF5] border-[#A7F3D0] text-[#059669]"
                      : state === "current"
                        ? "bg-white border-[#F26A36] text-[#F26A36] ring-2 ring-[#F26A36]/20"
                        : "bg-[#F6F3F2] border-[#E5E0DF] text-[#8C9098]"
                  }`}
                >
                  {state === "complete" ? "✓" : state === "current" ? "●" : index + 1}
                </span>
                {index < STAGES.length - 1 && (
                  <span className={`hidden sm:block h-0.5 flex-1 ml-2 ${state === "complete" ? "bg-[#A7F3D0]" : "bg-[#E5E0DF]"}`} aria-hidden="true" />
                )}
              </div>
              <div className="pb-2 sm:pt-2">
                <p className={`text-xs font-semibold ${state === "upcoming" ? "text-[#8C9098]" : "text-[#14121B]"}`}>{stage.label}</p>
                <p className="text-[10px] text-[#8C9098] mt-0.5">{stage.detail}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </CardContainer>
  );
}

export default function TrackingPage({ params }: { params: Promise<{ workOrderId: string }> | { workOrderId: string } }) {
  const resolvedParams = params instanceof Promise ? use(params) : params;
  const workOrderId = resolvedParams.workOrderId;

  const { data: session, isPending } = useSession() as any;
  const token = useAuthToken(session);
  const role = (session as any)?.user?.role as string | undefined;
  const authenticated = Boolean(session);

  const [booking, setBooking] = useState<BookingRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<PageError | null>(null);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    if (isPending) return;

    if (!authenticated) {
      setLoading(false);
      return;
    }

    if (!token) {
      setLoading(false);
      setError({ message: "Your session could not be verified. Please sign in again.", status: 401 });
      return;
    }

    let cancelled = false;

    async function loadBooking() {
      try {
        setLoading(true);
        setError(null);
        setImageFailed(false);
        const res = await bookingsApi.getById(token as string, workOrderId);
        if (!cancelled) setBooking(res.data as BookingRecord);
      } catch (err: unknown) {
        if (cancelled) return;
        const apiError = err as { message?: string; status?: number };
        setError({ message: apiError.message || "Unable to load this work order.", status: apiError.status });
        setBooking(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadBooking();
    return () => {
      cancelled = true;
    };
  }, [authenticated, isPending, token, workOrderId]);

  if (isPending || loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6" aria-busy="true" aria-live="polite">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96 max-w-full" />
        <CardContainer className="p-6 space-y-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-24 w-full" />
        </CardContainer>
        <div className="grid lg:grid-cols-2 gap-6">
          <CardContainer className="p-6 space-y-3">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </CardContainer>
          <CardContainer className="p-6 space-y-3">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </CardContainer>
        </div>
        <span className="sr-only">Loading work order tracking</span>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <CardContainer className="p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#FFF1EC] border border-[#FFD6C2] flex items-center justify-center mx-auto mb-4 text-2xl" aria-hidden="true">🔐</div>
          <h1 className="font-heading text-2xl font-bold">Sign in to track this work order</h1>
          <p className="mt-2 text-sm text-[#55595F]">
            Work order details are visible only to the customer who owns the booking, the assigned technician, or an administrator.
          </p>
          <Button asChild className="mt-6 bg-[#F26A36] hover:bg-[#E05824]">
            <Link href="/sign-in">Sign in to continue</Link>
          </Button>
        </CardContainer>
      </div>
    );
  }

  if (error) {
    const notFound = error.status === 404;
    const forbidden = error.status === 403;
    const invalid = error.status === 400;

    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <CardContainer className={`p-8 text-center ${forbidden || notFound ? "border-[#FECACA]" : ""}`} role="alert">
          <div className="w-14 h-14 rounded-2xl bg-[#F6F3F2] border border-[#E5E0DF] flex items-center justify-center mx-auto mb-4 text-2xl" aria-hidden="true">
            {notFound ? "🔎" : forbidden ? "⛔" : "⚠️"}
          </div>
          <h1 className="font-heading text-2xl font-bold">
            {notFound ? "Work order not found" : forbidden ? "You cannot view this work order" : invalid ? "Invalid work order ID" : "Unable to load work order"}
          </h1>
          <p className="mt-2 text-sm text-[#55595F]">{error.message}</p>
          {forbidden && (
            <p className="mt-2 text-xs text-[#8C9098]">Only the booking owner, assigned technician, or an admin can access this record.</p>
          )}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button asChild variant="outline">
              <Link href="/services">Browse Services</Link>
            </Button>
            {error.status === 401 && (
              <Button asChild className="bg-[#F26A36] hover:bg-[#E05824]">
                <Link href="/sign-in">Sign in</Link>
              </Button>
            )}
          </div>
        </CardContainer>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <CardContainer className="p-8 text-center">
          <p className="text-sm text-[#55595F]">No booking record was returned for this work order.</p>
        </CardContainer>
      </div>
    );
  }

  const isTerminal = booking.status === "cancelled" || booking.status === "rejected";
  const amount = booking.finalAmount ?? booking.basePrice;
  const backHref = role === "technician" ? "/dashboard/technician/requests" : role === "admin" ? "/dashboard/admin/bookings" : "/dashboard/customer/bookings";
  const fallbackImage = getCategoryImage(booking.category);
  const hasRemoteImage = Boolean(booking.serviceImage && /^https?:\/\//.test(booking.serviceImage) && !imageFailed);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold">Work Order Tracking</h1>
          <p className="text-sm text-[#55595F] mt-1">
            Work order <span className="font-mono">#{booking._id.slice(-8).toUpperCase()}</span>
            {booking.createdAt ? ` • Created ${new Date(booking.createdAt).toLocaleDateString()}` : ""}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href={backHref}>Back to bookings</Link>
        </Button>
      </div>

      {isTerminal && <TerminalNotice status={booking.status} />}

      <ProgressTimeline booking={booking} />

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          <CardContainer className="p-6">
            <h2 className="font-semibold mb-4">Service</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative w-full sm:w-32 h-32 shrink-0 rounded-lg border border-[#E5E0DF] overflow-hidden bg-[#F6F3F2]">
                {hasRemoteImage ? (
                  <img
                    src={booking.serviceImage}
                    alt={booking.serviceTitle || "Repair service"}
                    className="w-full h-full object-cover"
                    onError={() => setImageFailed(true)}
                  />
                ) : (
                  <Image
                    src={fallbackImage}
                    alt={`${booking.category || "Repair"} service`}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                )}
              </div>
              <div className="min-w-0">
                <h3 className="font-heading text-lg font-semibold">{booking.serviceTitle || "Repair service"}</h3>
                <p className="text-xs font-mono text-[#8C9098] mt-1">
                  {booking.category || "Service"}
                  {booking.serviceId ? ` • Service ID ${String(booking.serviceId).slice(-6).toUpperCase()}` : ""}
                </p>
                <p className="mt-3 text-sm text-[#55595F] whitespace-pre-line">{booking.problemDescription || "No problem description recorded."}</p>
              </div>
            </div>
          </CardContainer>

          <CardContainer className="p-6">
            <h2 className="font-semibold mb-4">People &amp; Access</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                <dt className="font-mono text-xs text-[#8C9098]">CUSTOMER</dt>
                <dd className="sm:text-right">{booking.customerName || "Not recorded"}</dd>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                <dt className="font-mono text-xs text-[#8C9098]">TECHNICIAN</dt>
                <dd className="sm:text-right">{booking.technicianName || "Not assigned yet"}</dd>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                <dt className="font-mono text-xs text-[#8C9098]">CONTACT</dt>
                <dd className="sm:text-right">{booking.customerPhone || booking.phone || "Not recorded"}</dd>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                <dt className="font-mono text-xs text-[#8C9098]">SERVICE ADDRESS</dt>
                <dd className="sm:text-right sm:max-w-[65%]">{booking.address || "Not recorded"}</dd>
              </div>
            </dl>
            <p className="mt-4 text-[10px] font-mono text-[#8C9098]">
              Contact and address fields are shown only after the backend confirms that you own or are assigned to this work order.
            </p>
          </CardContainer>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <CardContainer className="p-6">
            <h2 className="font-semibold mb-4">Schedule &amp; Amount</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-[#8C9098]">Preferred date</dt>
                <dd className="text-right">{booking.preferredDate ? new Date(booking.preferredDate).toLocaleDateString() : "Not recorded"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[#8C9098]">Base price</dt>
                <dd>{typeof booking.basePrice === "number" ? formatCurrency(booking.basePrice) : "Not recorded"}</dd>
              </div>
              <div className="flex justify-between gap-3 font-semibold">
                <dt>Final amount</dt>
                <dd>{typeof amount === "number" ? formatCurrency(amount) : "Not set"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[#8C9098]">Payment status</dt>
                <dd className={booking.paymentStatus === "paid" ? "text-[#059669] font-medium" : "text-[#92400E] font-medium"}>
                  {(booking.paymentStatus || "pending").toUpperCase()}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[#8C9098]">Last updated</dt>
                <dd className="text-right">{booking.updatedAt ? new Date(booking.updatedAt).toLocaleString() : "Not recorded"}</dd>
              </div>
            </dl>
            <p className="mt-4 text-[10px] font-mono text-[#8C9098]">
              {booking.status === "completed" && booking.paymentStatus !== "paid"
                ? "The repair is complete. Payment becomes available from the customer booking page."
                : "Payment is confirmed only after server-side verification; opening a success page alone does not mark a booking paid."}
            </p>
          </CardContainer>

          {role === "customer" ? (
            <CardContainer className="p-6">
              <h2 className="font-semibold mb-2">Manage this booking</h2>
              <p className="text-sm text-[#55595F] mb-4">
                Open the full booking page to cancel a requested booking or pay after the technician completes the repair.
              </p>
              <Button asChild className="w-full bg-[#F26A36] hover:bg-[#E05824]">
                <Link href={`/dashboard/customer/bookings/${booking._id}`}>Open customer booking details</Link>
              </Button>
            </CardContainer>
          ) : (
            <CardContainer className="p-6">
              <h2 className="font-semibold mb-2">Need to update the job?</h2>
              <p className="text-sm text-[#55595F]">
                Status changes are controlled by the assigned technician. Admins can monitor this booking but cannot approve it, assign technicians, or change its status.
              </p>
              <Button asChild variant="outline" className="mt-4 w-full">
                <Link href={backHref}>Go to {role === "admin" ? "admin bookings" : "assigned requests"}</Link>
              </Button>
            </CardContainer>
          )}
        </div>
      </div>
    </div>
  );
}
