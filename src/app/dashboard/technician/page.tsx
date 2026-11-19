import { CardContainer } from "@/components/ui/card-container";
import { EmptyState } from "@/components/modules/empty-state";

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading">Technician Dashboard</h1>
        <p className="text-sm text-[#55595F] mt-1">Dispatch, route, job workspace, today dispatches, payouts, fix rate</p>
      </div>
      <CardContainer className="p-8">
        <EmptyState title="Technician Dashboard Coming Soon" description="Dispatch, route, job workspace, today dispatches, payouts, fix rate - This is a frontend placeholder. Integration with backend API will be added later." />
      </CardContainer>
    </div>
  );
}
