import { CardContainer } from "@/components/ui/card-container";
import { TelemetryBadge } from "@/components/ui/telemetry-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ServiceDetailsPage({ params }: { params: { id: string } }) {
  const id = params.id;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-2 text-xs font-mono text-[#8C9098] mb-6">
        <span>HOME</span>/<span>SERVICES</span>/<span className="text-[#14121B]">{id.toUpperCase()}</span>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <div className="flex flex-wrap gap-2">
            <TelemetryBadge type="info" label="REFRIGERATOR SERVICES" mono />
            <TelemetryBadge type="success" label="DOORSTEP VISIT" mono />
            <span className="px-2.5 py-1 rounded-full bg-[#F6F3F2] border border-[#E5E0DF] text-xs">★ 4.9 (128 reviews)</span>
            <span className="px-2.5 py-1 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-xs text-[#059669]">90-day Guarantee</span>
          </div>

          <h1 className="text-3xl font-bold font-heading">Samsung Bespoke 4-Door French Door Refrigerator Repair</h1>

          <CardContainer className="p-0 overflow-hidden">
            <div className="h-80 bg-[#F6F3F2] relative flex items-center justify-center">
              <span className="text-[#8C9098] text-sm">Diagnostic Visual with Telemetry Overlay</span>
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="px-2 py-1 rounded-full bg-white text-[10px] font-mono border border-[#E5E0DF]">S/N: FX-APPL-8821</span>
                <TelemetryBadge type="info" label="LIVE TELEMETRY" pulse mono />
              </div>
            </div>
          </CardContainer>

          <div className="grid md:grid-cols-2 gap-4">
            <CardContainer className="p-5">
              <h3 className="font-semibold mb-3">Common Malfunctions</h3>
              <ul className="space-y-2 text-sm text-[#55595F]">
                <li>• Compressor failure - no cooling</li>
                <li>• Ice maker not dispensing</li>
                <li>• Water leakage</li>
                <li>• Temperature fluctuation</li>
              </ul>
            </CardContainer>
            <CardContainer className="p-5">
              <h3 className="font-semibold mb-3">Service Scope</h3>
              <ul className="space-y-2 text-sm text-[#55595F]">
                <li>✓ OEM parts & warranty</li>
                <li>✓ Doorstep diagnostic</li>
                <li>✓ 90-day guarantee</li>
                <li>✓ FixVault escrow</li>
              </ul>
            </CardContainer>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Starting Price", value: "$280" },
              { label: "SLA", value: "24h" },
              { label: "Warranty", value: "90 days" },
              { label: "Response", value: "2h avg" },
            ].map((s) => (
              <CardContainer key={s.label} className="p-4 text-center">
                <div className="text-xs font-mono text-[#8C9098]">{s.label}</div>
                <div className="font-bold text-[#14121B]">{s.value}</div>
              </CardContainer>
            ))}
          </div>

          <CardContainer className="p-5">
            <h3 className="font-semibold mb-3">Technician Dossier</h3>
            <div className="flex gap-3">
              <div className="w-12 h-12 rounded-full bg-[#F6F3F2] border border-[#E5E0DF] flex items-center justify-center">MV</div>
              <div>
                <div className="font-medium">Marcus Vance • Master Certified • 4.97 ★</div>
                <div className="text-xs text-[#8C9098]">Sector: San Francisco • Van #14 • 1.4mi away</div>
                <div className="mt-2 text-sm text-[#55595F]">15+ years appliance repair, Samsung OEM certified, Fluke & Rigol calibrated bench.</div>
              </div>
            </div>
          </CardContainer>
        </div>

        <div className="lg:col-span-5">
          <div className="sticky top-24 space-y-4">
            <CardContainer className="p-6">
              <h3 className="font-semibold mb-4">Get Started</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-mono text-[#8C9098]">PHONE • DISPATCH SMS SECURED</label>
                  <Input placeholder="+1 (555) 000-0000" className="mt-1" />
                </div>
                <div>
                  <label className="text-xs font-mono text-[#8C9098]">SERVICE ADDRESS</label>
                  <Input placeholder="742 Montgomery St, San Francisco" className="mt-1" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-mono text-[#8C9098]">DATE</label>
                    <Select>
                      <SelectTrigger className="mt-1"><SelectValue placeholder="Select date" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="tomorrow">Tomorrow</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs font-mono text-[#8C9098]">TIME SLOT</label>
                    <Select>
                      <SelectTrigger className="mt-1"><SelectValue placeholder="Time" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Morning 9-12</SelectItem>
                        <SelectItem value="afternoon">Afternoon 12-5</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-mono text-[#8C9098]">FAULT DESCRIPTION</label>
                  <Textarea placeholder="Describe the issue..." className="mt-1" />
                </div>
                <div className="p-3 rounded-lg bg-[#FFFBEB] border border-[#FDE68A] text-xs text-[#92400E]">
                  <strong>FixVault Protection:</strong> $2M bonded escrow, 90-day warranty, real-time tracking. Pay only after completion.
                </div>
                <Button className="w-full bg-[#F26A36] hover:bg-[#E05824] h-12 text-base">Confirm & Request Repair →</Button>
                <div className="text-center text-[10px] font-mono text-[#8C9098]">ESCROW HOLD SECURED • TLS 1.3 • TX 0x8F2A...991C</div>
              </div>
            </CardContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
