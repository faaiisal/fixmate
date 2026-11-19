import { CardContainer } from "@/components/ui/card-container";
import { EmptyState } from "@/components/modules/empty-state";

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading">Repair Requests</h1>
        <p className="text-sm text-[#55595F] mt-1">Accept/Reject/In-Progress/Completed pipeline</p>
      </div>
      <CardContainer className="p-8">
        <EmptyState title="Repair Requests Coming Soon" description="Accept/Reject/In-Progress/Completed pipeline - This is a frontend placeholder. Integration with backend API will be added later." />
      </CardContainer>
    </div>
  );
}
