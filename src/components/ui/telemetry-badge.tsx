import * as React from "react";
import { cn } from "@/lib/utils";

export type TelemetryType = "success" | "info" | "warning" | "error" | "purple" | "neutral";

interface TelemetryBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  type?: TelemetryType;
  pulse?: boolean;
  mono?: boolean;
  label: string;
}

const typeStyles: Record<TelemetryType, string> = {
  success: "bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]",
  info: "bg-[#E6FCFD] text-[#0891B2] border-[#A5F3FC]",
  warning: "bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]",
  error: "bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]",
  purple: "bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]",
  neutral: "bg-[#F6F3F2] text-[#55595F] border-[#E5E0DF]",
};

const dotStyles: Record<TelemetryType, string> = {
  success: "bg-[#10B981]",
  info: "bg-[#00C4D6]",
  warning: "bg-[#F59E0B]",
  error: "bg-[#EF4444]",
  purple: "bg-[#8B5CF6]",
  neutral: "bg-[#8C9098]",
};

export function TelemetryBadge({
  type = "neutral",
  pulse = false,
  mono = true,
  label,
  className,
  ...props
}: TelemetryBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
        mono && "font-mono",
        typeStyles[type],
        className
      )}
      {...props}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", dotStyles[type], pulse && "animate-pulse")} />
      {label}
    </span>
  );
}
