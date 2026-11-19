import { Button } from "@/components/ui/button";
import Link from "next/link";

export function EmptyState({ title = "No data", description, actionLabel, actionHref }: { title?: string; description?: string; actionLabel?: string; actionHref?: string }) {
  return (
    <div className="py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#F6F3F2] border border-[#E5E0DF] flex items-center justify-center mx-auto mb-4 text-2xl">📦</div>
      <h3 className="font-heading font-semibold text-[#14121B]">{title}</h3>
      {description && <p className="mt-2 text-sm text-[#55595F] max-w-sm mx-auto">{description}</p>}
      {actionLabel && actionHref && (
        <Button asChild className="mt-4 bg-[#F26A36] hover:bg-[#E05824]">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  );
}
