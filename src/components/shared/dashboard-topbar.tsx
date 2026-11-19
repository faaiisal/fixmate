"use client";

import { TelemetryBadge } from "@/components/ui/telemetry-badge";
import { Button } from "@/components/ui/button";
import { Bell, Search } from "lucide-react";

export function DashboardTopbar({ title = "Dashboard", subtitle }: { title?: string; subtitle?: string }) {
  return (
    <div className="h-16 bg-white border-b border-[#E5E0DF] flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
      <div>
        <h1 className="font-heading font-semibold text-[#14121B]">{title}</h1>
        {subtitle && <p className="text-xs text-[#8C9098] font-mono">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2">
          <div className="flex items-center gap-1 text-[10px] font-mono text-[#8C9098]">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            CLUSTER-US-WEST-2B
          </div>
          <TelemetryBadge type="success" label="99.98% UPTIME" mono />
        </div>
        <Button variant="ghost" size="icon-sm">
          <Search className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon-sm">
          <Bell className="w-4 h-4" />
        </Button>
        <div className="w-8 h-8 rounded-full bg-[#F6F3F2] border border-[#E5E0DF] flex items-center justify-center text-xs font-medium">AC</div>
      </div>
    </div>
  );
}
