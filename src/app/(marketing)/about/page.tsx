import { CardContainer } from "@/components/ui/card-container";
import { TelemetryBadge } from "@/components/ui/telemetry-badge";

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <div className="flex items-center gap-2 text-xs font-mono text-[#8C9098]">
        <span>HOME</span>/<span className="text-[#14121B]">ABOUT</span>
        <TelemetryBadge type="success" label="SYSTEM OPERATIONAL 99.98%" mono />
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <h1 className="text-4xl font-extrabold font-heading">
            Precision Repair,<br />Architected for Trust
          </h1>
          <p className="mt-4 text-[#55595F] max-w-2xl">
            FixMate couples surgical technical precision with inviting ultra-clean light aesthetic. 
            Eliminating heavy clutter while retaining real-time telemetry, escrow security, and warranty guarantees.
          </p>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { k: "10,000+", v: "Repairs Completed" },
              { k: "142", v: "Verified Techs" },
              { k: "99.1%", v: "Fix Rate" },
              { k: "90-day", v: "Warranty" },
            ].map((s) => (
              <CardContainer key={s.k} className="p-4 text-center">
                <div className="text-xl font-bold">{s.k}</div>
                <div className="text-xs text-[#8C9098]">{s.v}</div>
              </CardContainer>
            ))}
          </div>
        </div>
        <div className="lg:col-span-4">
          <CardContainer className="p-6">
            <h3 className="font-semibold mb-3">FixVault Smart Escrow</h3>
            <div className="space-y-3 text-sm text-[#55595F]">
              <div className="flex gap-2"><span className="text-[#10B981]">✓</span> $2M bonded protection pool</div>
              <div className="flex gap-2"><span className="text-[#10B981]">✓</span> Pay only after completion sign-off</div>
              <div className="flex gap-2"><span className="text-[#10B981]">✓</span> Cryptographic ledger seal TX: 0x8F2A...991C</div>
              <div className="flex gap-2"><span className="text-[#10B981]">✓</span> 90-day warranty & 24/7 priority</div>
            </div>
          </CardContainer>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          { title: "Traditional Nightmare", points: ["No escrow, pay upfront", "No tracking, unknown ETA", "No warranty, no recourse"], negative: true },
          { title: "FixMate Standard", points: ["Escrow hold secured, pay after", "Live GPS + Dynamic Island ETA", "90-day warranty + $2M bonded"], negative: false },
          { title: "Live Dispatch Network", points: ["142 verified technicians", "Avg 2h response", "Real-time van GPS"], negative: false },
        ].map((card) => (
          <CardContainer key={card.title} className="p-6">
            <h3 className="font-semibold mb-3">{card.title}</h3>
            <ul className="space-y-2 text-sm">
              {card.points.map((p) => (
                <li key={p} className="flex gap-2">
                  <span className={card.negative ? "text-[#EF4444]" : "text-[#10B981]"}>{card.negative ? "✗" : "✓"}</span>
                  <span className="text-[#55595F]">{p}</span>
                </li>
              ))}
            </ul>
          </CardContainer>
        ))}
      </div>
    </div>
  );
}
