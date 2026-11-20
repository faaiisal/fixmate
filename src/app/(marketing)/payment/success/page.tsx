import { CardContainer } from "@/components/ui/card-container";
import { EmptyState } from "@/components/modules/empty-state";

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading">Payment Success</h1>
        <p className="text-sm text-[#55595F] mt-1">Stripe Checkout success - escrow locked $112</p>
      </div>
      <CardContainer className="p-8">
        <EmptyState title="Payment Success Coming Soon" description="Stripe Checkout success - escrow locked $112 - This is a frontend placeholder. Integration with backend API will be added later." />
      </CardContainer>
    </div>
  );
}
