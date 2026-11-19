import { CardContainer } from "@/components/ui/card-container";
import { EmptyState } from "@/components/modules/empty-state";

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading">Payments</h1>
        <p className="text-sm text-[#55595F] mt-1">Escrow history, transactions, FixVault protection</p>
      </div>
      <CardContainer className="p-8">
        <EmptyState title="Payments Coming Soon" description="Escrow history, transactions, FixVault protection - This is a frontend placeholder. Integration with backend API will be added later." />
      </CardContainer>
    </div>
  );
}
