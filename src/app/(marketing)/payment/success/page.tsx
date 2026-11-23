"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CardContainer } from "@/components/ui/card-container";
import { Button } from "@/components/ui/button";
import { paymentsApi, useAuthToken } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";

export default function Page() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const bookingId = searchParams.get("booking_id");
  const { data: session } = useSession();
  const token = useAuthToken(session);
  const router = useRouter();
  const [status, setStatus] = useState<"verifying" | "success" | "failed" | "no_session">("verifying");
  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    if (!sessionId) {
      setStatus("no_session");
      return;
    }
    if (!token) return;

    async function verify() {
      try {
        setStatus("verifying");
        // IMPORTANT: Do NOT mark paid merely because browser opens success page.
        // We call backend verify endpoint which does server-side Stripe verification
        const res = await paymentsApi.verify(token!, sessionId!);
        setDetails(res.data);
        if ((res.data as any)?.verified) {
          setStatus("success");
          toast.success("Payment verified and marked paid via server");
        } else {
          setStatus("failed");
          toast.error("Payment verification failed");
        }
      } catch (err: any) {
        console.error(err);
        setStatus("failed");
        toast.error(err.message || "Verification failed");
      }
    }

    verify();
  }, [sessionId, token]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading">Payment {status === "success" ? "Success" : status === "failed" ? "Verification Failed" : status === "no_session" ? "Missing Session" : "Verifying..."}</h1>
        <p className="text-sm text-[#55595F] mt-1">
          {status === "verifying" ? "Verifying payment via backend /api/payments/verify (server-side Stripe check, not just success page)..." : 
           status === "success" ? "Escrow locked, payment verified via backend server-side check" :
           status === "no_session" ? "No session_id found in URL — payment cannot be verified. Redirect from Stripe should include session_id." :
           "Payment verification failed — check logs, may be already paid or session invalid"}
        </p>
        <p className="text-xs font-mono text-[#8C9098] mt-2">Session: {sessionId || "none"} • Booking: {bookingId || "none"} • API: {process.env.NEXT_PUBLIC_API_URL}</p>
      </div>

      <CardContainer className="p-8">
        {status === "verifying" && <div className="text-center py-8 text-[#8C9098]">Verifying payment server-side... Do not mark paid merely because browser opens success page.</div>}
        {status === "success" && (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
            <h3 className="font-bold text-lg">Payment Verified</h3>
            <p className="text-sm text-[#55595F] mt-2">Amount: {details?.payment?.amount ? `$${details.payment.amount} ${details.payment.currency}` : ""} • Status: {details?.status} • Transaction: {details?.payment?.transactionId}</p>
            <p className="text-xs text-[#8C9098] mt-2">Booking {bookingId} marked paid via backend verification (not just success page). Prevent duplicate via unique bookingId index.</p>
            <div className="mt-6 flex gap-2 justify-center">
              <Button className="bg-[#F26A36]" onClick={() => router.push("/dashboard/customer/bookings")}>Go to My Bookings</Button>
              <Button variant="outline" onClick={() => router.push("/dashboard/customer/payments")}>Payment History</Button>
            </div>
          </div>
        )}
        {status === "failed" && (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-center mx-auto mb-4 text-xl">✗</div>
            <h3 className="font-bold">Verification Failed</h3>
            <p className="text-sm text-[#55595F] mt-2">Session {sessionId} could not be verified. May be invalid or already paid.</p>
            <pre className="text-xs bg-[#F6F3F2] p-3 rounded mt-4 text-left overflow-auto">{JSON.stringify(details, null, 2)}</pre>
            <Button className="mt-4" variant="outline" onClick={() => router.push("/dashboard/customer/bookings")}>Back to Bookings</Button>
          </div>
        )}
        {status === "no_session" && (
          <div className="text-center py-8 text-sm text-[#8C9098]">
            <p>No session_id in URL. This page should be accessed via Stripe redirect with ?session_id=xxx&booking_id=xxx</p>
            <p className="mt-2">Mock checkout also uses session_id: mock_...</p>
            <Button className="mt-4" variant="outline" onClick={() => router.push("/dashboard/customer/bookings")}>Back</Button>
          </div>
        )}
      </CardContainer>

      <CardContainer className="p-4">
        <h4 className="font-semibold text-sm mb-2">Security Note — Backend Enforcement</h4>
        <ul className="text-xs text-[#55595F] space-y-1 list-disc ml-4">
          <li>Do NOT mark booking paid merely because browser opens success page — backend verifies via Stripe server-side.</li>
          <li>Amount read from DB (finalAmount || basePrice), never from frontend.</li>
          <li>Prevent duplicate payments via unique bookingId index (payments_bookingId_uidx).</li>
          <li>Mock mode when Stripe placeholder keys: verify endpoint still required to mark paid (server verification).</li>
          <li>Real Stripe: stripe.checkout.sessions.retrieve to confirm payment_status=paid, plus webhook verification.</li>
        </ul>
      </CardContainer>
    </div>
  );
}
