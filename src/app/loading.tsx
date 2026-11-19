import { Skeleton } from "@/components/ui/skeleton";
import { CardContainer } from "@/components/ui/card-container";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FCF9F8] p-6 lg:p-12">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardContainer key={i} className="p-6 space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardContainer>
          ))}
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2 text-sm text-[#8C9098]">
            <div className="w-4 h-4 border-2 border-[#E5E0DF] border-t-[#F26A36] rounded-full animate-spin" />
            Loading FixMate Telemetry...
          </div>
        </div>
      </div>
    </div>
  );
}
