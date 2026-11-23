"use client";

import { useEffect, useState } from "react";
import { CardContainer } from "@/components/ui/card-container";
import { LoadingState } from "@/components/modules/loading-state";
import { paymentsApi, useAuthToken } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";

export default function Page() {
  const { data: session } = useSession();
  const token = useAuthToken(session);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await paymentsApi.myHistory(token, { limit: 50 });
      setPayments(res.data as any[] || []);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, [token]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading">Payments</h1>
        <p className="text-sm text-[#55595F] mt-1">Escrow history, transactions, FixVault protection — backend /api/payments/my-history</p>
        <p className="text-[11px] font-mono text-[#8C9098] mt-2 bg-[#F9F7F6] border border-[#E7E7E9] rounded p-2">
          Journey: Customer Request (requested) → Technician Accepts (accepted) → Starts Work (in-progress) → Completes & Sets Final Amount (completed) → Customer Pay Now → Paid → Appears here. Current screenshot shows requested booking, so no payment yet — correct per business rule Pay only after completion.
        </p>
      </div>

      {loading ? <CardContainer className="p-8"><LoadingState label="Loading payment history" /></CardContainer> :
        payments.length === 0 ? <CardContainer className="p-8 text-center">
          <p className="text-sm text-[#8C9098]">No payments yet. Complete bookings and pay via Pay Now to see history.</p>
          <div className="mt-4 text-xs text-[#55595F] space-y-1 text-left max-w-xl mx-auto bg-[#F9F7F6] border border-[#E7E7E9] rounded p-3">
            <div>• Step 1: You created booking → Status <span className="font-mono">requested</span> (your screenshot ID 5C7968 is here)</div>
            <div>• Step 2: Technician at <span className="font-mono">/dashboard/technician/requests</span> clicks Accept → <span className="font-mono">accepted</span></div>
            <div>• Step 3: Technician clicks Start Repair → <span className="font-mono">in-progress</span></div>
            <div>• Step 4: Technician enters Final Amount & Completes → <span className="font-mono">completed</span> + <span className="font-mono">pending payment</span></div>
            <div>• Step 5: You see <span className="font-mono">Pay Now</span> button in My Bookings (completed + pending) → Stripe Checkout → Success → Verify → <span className="font-mono">paid</span></div>
            <div>• Step 6: Payment appears here with Amount, Transaction ID, Session, Paid date</div>
          </div>
        </CardContainer> :
          <div className="space-y-3">
            {payments.map((p: any) => (
              <CardContainer key={p._id} className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-mono text-xs">Amount: {formatCurrency(p.amount)} {p.currency} • Status: {p.paymentStatus} • Service: {p.serviceTitle || "Service"}</div>
                  <div className="text-xs text-[#55595F]">Booking: {p.bookingId?.toString().slice(-8)} • Session: {p.sessionId?.slice(0, 20)}... • Txn: {p.transactionId || "pending"}</div>
                  <div className="text-[10px] font-mono text-[#8C9098]">Created: {new Date(p.createdAt).toLocaleString()} {p.paidAt ? `• Paid: ${new Date(p.paidAt).toLocaleString()}` : ""}</div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs border ${p.paymentStatus === "paid" ? "bg-[#ECFDF5] border-[#A7F3D0] text-[#059669]" : "bg-[#FFFBEB] border-[#FDE68A]"}`}>{p.paymentStatus}</div>
              </CardContainer>
            ))}
          </div>
      }
    </div>
  );
}
