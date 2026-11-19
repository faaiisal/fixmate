import { CardContainer } from "@/components/ui/card-container";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  trendType?: "positive" | "negative" | "neutral";
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({ title, value, subtitle, trend, trendType = "neutral", icon, className }: StatCardProps) {
  return (
    <CardContainer className={cn("p-5", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-[#8C9098] uppercase tracking-wide">{title}</span>
        {icon && <div className="w-8 h-8 rounded-lg bg-[#F6F3F2] flex items-center justify-center">{icon}</div>}
      </div>
      <div className="mt-3 text-2xl font-bold font-heading text-[#14121B]">{value}</div>
      {(subtitle || trend) && (
        <div className="mt-2 flex items-center gap-2 text-xs">
          {subtitle && <span className="text-[#55595F]">{subtitle}</span>}
          {trend && (
            <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-mono border", trendType === "positive" ? "bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]" : trendType === "negative" ? "bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]" : "bg-[#F6F3F2] text-[#8C9098] border-[#E5E0DF]")}>
              {trend}
            </span>
          )}
        </div>
      )}
    </CardContainer>
  );
}
