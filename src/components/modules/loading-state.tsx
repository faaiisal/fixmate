import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  label?: string;
  className?: string;
}

/**
 * Consistent, accessible loading indicator for dashboard and catalog views.
 * role="status" announces the label to assistive technology without moving focus.
 */
export function LoadingState({ label = "Loading", className }: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("flex items-center justify-center gap-2 py-8 text-sm text-[#8C9098]", className)}
    >
      <Loader2 className="h-4 w-4 animate-spin text-[#F26A36]" aria-hidden="true" />
      <span>{label}…</span>
    </div>
  );
}
