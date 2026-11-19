import { CardContainer } from "@/components/ui/card-container";
import { TelemetryBadge } from "@/components/ui/telemetry-badge";
import { StatCard } from "@/components/modules/stat-card";
import { Button } from "@/components/ui/button";

export default function CustomerDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold font-heading">Welcome back, Alex Chen</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-2 py-1 rounded-full bg-[#FFF1EC] text-[#F26A36] text-xs border border-[#FFD6C2]">FixPass Gold</span>
            <span className="text-xs font-mono text-[#8C9098]">6 Verified Assets • Real-time telemetry</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Filter</Button>
          <Button size="sm" className="bg-[#F26A36]">Book New Repair</Button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Active Dispatches" value="2" subtitle="In-flight" trend="Live" trendType="positive" />
        <StatCard title="Escrow Protected" value="$345" subtitle="Locked" trend="Secured" trendType="positive" />
        <StatCard title="Completed Repairs" value="14" subtitle="Lifetime" trend="+2" trendType="positive" />
        <StatCard title="Passports" value="6" subtitle="Linked" trend="3 Active" trendType="neutral" />
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <CardContainer className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00C4D6] animate-pulse" />
                <span className="text-xs font-mono">LIVE REPAIR DISPATCH JOB-88412</span>
                <TelemetryBadge type="info" label="EN ROUTE 8min" pulse mono />
              </div>
              <TelemetryBadge type="success" label="ESCROW SECURED $112" mono />
            </div>
            <div className="h-40 bg-[#F6F3F2] rounded-lg border border-[#E5E0DF] flex items-center justify-center text-xs text-[#8C9098]">Live GPS Map + Mobile Lab #12</div>
            <div className="mt-4 grid grid-cols-4 gap-2 text-[10px] font-mono">
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#10B981]" />ESCROW AUTHORIZED 10:02</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#10B981]" />PARTS PRE-LOADED 10:08</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#00C4D6] animate-pulse" />EN ROUTE 2.1mi ACTIVE</div>
              <div className="flex items-center gap-1 opacity-60"><div className="w-2 h-2 rounded-full bg-[#E5E0DF]" />DIAGNOSTIC</div>
            </div>
          </CardContainer>

          <CardContainer className="p-6">
            <h3 className="font-semibold mb-4">Recent Work Orders & Equipment Logs</h3>
            <div className="space-y-3">
              {[
                { id: "WO-88412", title: "Samsung Refrigerator", status: "In Progress", price: "$280", icon: "❄️" },
                { id: "WO-88123", title: "MacBook Pro 16", status: "Completed", price: "$350", icon: "💻" },
                { id: "WO-87999", title: "LG Washing Machine", status: "Scheduled", price: "$120", icon: "👕" },
              ].map((w) => (
                <div key={w.id} className="flex items-center justify-between p-3 rounded-xl border border-[#E5E0DF] hover:bg-[#F6F3F2]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#F6F3F2] flex items-center justify-center">{w.icon}</div>
                    <div>
                      <div className="text-sm font-medium">{w.title}</div>
                      <div className="text-xs font-mono text-[#8C9098]">{w.id} • {w.price}</div>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full border ${w.status === "Completed" ? "bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]" : w.status === "In Progress" ? "bg-[#E6FCFD] text-[#0891B2] border-[#A5F3FC]" : "bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]"}`}>{w.status}</span>
                </div>
              ))}
            </div>
          </CardContainer>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <CardContainer className="p-5">
            <h4 className="font-semibold mb-3">Digital Passports</h4>
            <div className="space-y-2">
              {[
                { name: "Samsung Bespoke Fridge", status: "Active Fix", color: "bg-[#FFF1EC]" },
                { name: "MacBook Pro 16 M2", status: "Optimal", color: "bg-[#ECFDF5]" },
                { name: "LG WashTower", status: "Idle", color: "bg-[#F6F3F2]" },
              ].map((p) => (
                <div key={p.name} className="flex items-center justify-between p-3 rounded-lg border border-[#E5E0DF]">
                  <span className="text-sm">{p.name}</span>
                  <span className={`text-[10px] px-2 py-1 rounded-full border ${p.color}`}>{p.status}</span>
                </div>
              ))}
            </div>
          </CardContainer>

          <CardContainer className="p-5">
            <h4 className="font-semibold mb-2">FixVault Protection</h4>
            <p className="text-xs text-[#55595F]">Bonded pool $2M • 90-day warranty • 24/7 priority • TX: 0x8F2A...991C</p>
            <div className="mt-3 space-y-1 text-xs">
              <div className="flex gap-2"><span className="text-[#10B981]">✓</span> Escrow release only after sign-off</div>
              <div className="flex gap-2"><span className="text-[#10B981]">✓</span> Cryptographic ledger seal</div>
            </div>
          </CardContainer>

          <div className="rounded-full bg-white border border-[#E5E0DF] p-2 flex items-center gap-2 shadow-sm">
            <span className="text-xs flex-1 px-3 text-[#8C9098]">Ask AI: diagnose my appliance...</span>
            <Button size="icon-sm" className="rounded-full bg-[#F26A36]">↑</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
