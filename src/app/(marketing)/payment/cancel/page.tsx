"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { CardContainer } from "@/components/ui/card-container";
import { Button } from "@/components/ui/button";

export default function Page() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("booking_id");
  const router = useRouter();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading">Payment Cancelled</h1>
        <p className="text-sm text-[#55595F] mt-1">Gateway timeout or user aborted — booking remains completed but unpaid, Pay Now allowed again</p>
        <p className="text-xs font-mono text-[#8C9098] mt-2">Booking: {bookingId || "none"} • No payment marked — safe per backend rules</p>
      </div>
      <CardContainer className="p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-center mx-auto mb-4 text-xl">!</div>
        <h3 className="font-bold">Payment Cancelled</h3>
        <p className="text-sm text-[#55595F] mt-2">You cancelled the Stripe checkout. Booking remains completed with payment pending — you can Pay Now again from My Bookings.</p>
        <p className="text-xs text-[#8C9098] mt-2">Backend prevents duplicate successful payments via unique bookingId index, but allows retry when pending.</p>
        <div className="mt-6 flex gap-2 justify-center">
          <Button className="bg-[#F26A36]" onClick={() => router.push("/dashboard/customer/bookings")}>Back to Bookings — Pay Again</Button>
          <Button variant="outline" onClick={() => router.push("/services")}>Browse Services</Button>
        </div>
      </CardContainer>
    </div>
  );
}
