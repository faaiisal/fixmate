import { CardContainer } from "@/components/ui/card-container";
import { EmptyState } from "@/components/modules/empty-state";

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading">Add Custom Service</h1>
        <p className="text-sm text-[#55595F] mt-1">Create new service with pending approval workflow</p>
      </div>
      <CardContainer className="p-8">
        <EmptyState title="Add Custom Service Coming Soon" description="Create new service with pending approval workflow - This is a frontend placeholder. Integration with backend API will be added later." />
      </CardContainer>
    </div>
  );
}
