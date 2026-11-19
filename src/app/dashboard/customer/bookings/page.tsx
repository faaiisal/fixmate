import { CardContainer } from "@/components/ui/card-container";
import { EmptyState } from "@/components/modules/empty-state";

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading">My Bookings</h1>
        <p className="text-sm text-[#55595F] mt-1">Track and manage your repair bookings, status pipeline requested → accepted → in-progress → completed</p>
      </div>
      <CardContainer className="p-8">
        <EmptyState title="My Bookings Coming Soon" description="Track and manage your repair bookings, status pipeline requested → accepted → in-progress → completed - This is a frontend placeholder. Integration with backend API will be added later." />
      </CardContainer>
    </div>
  );
}
