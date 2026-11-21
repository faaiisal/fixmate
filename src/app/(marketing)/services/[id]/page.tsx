"use client";

import { useEffect, useState, use } from "react";
import { CardContainer } from "@/components/ui/card-container";
import { TelemetryBadge } from "@/components/ui/telemetry-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { servicesApi, bookingsApi } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ServiceDetailsPage({ params }: { params: { id: string } | Promise<{ id: string }> }) {
  const resolvedParams = params instanceof Promise ? use(params as Promise<{ id: string }>) : params;
  const id = resolvedParams.id;

  const { data: session } = useSession();
  const sessionUser = session?.user as any;
  const token = sessionUser?.id || null;
  const router = useRouter();

  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("tomorrow");
  const [timeSlot, setTimeSlot] = useState("morning");
  const [fault, setFault] = useState("");

  const fetchService = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await servicesApi.details(id, token || undefined);
      setService(res.data);
    } catch (err: any) {
      console.error("Failed to fetch service details:", err);
      const msg = err.message || "Failed to load service";
      setError(msg);
      // Show fallback mock for UI preservation when backend down or extension blocks fetch
      setService({
        _id: id,
        title: "Samsung Bespoke 4-Door French Door Refrigerator Repair (Fallback - Backend Unreachable)",
        description:
          "Backend not reachable at " +
          (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api") +
          ". Please ensure backend server is running (cd fixmate-server && npm run dev on port 5000). " +
          "If you see chrome-extension://hoklmmgfnpapgjgcpechhaamimifchmp/frame_ant error, disable ad-blocker / frame_ant extension that blocks fetch to localhost:5000. Original error: " +
          msg,
        basePrice: 280,
        category: "Refrigerator",
        approvalStatus: "approved",
        isAvailable: true,
        serviceMode: "doorstep",
        serviceArea: "San Francisco, Bay Area",
        image: "",
        estimatedDuration: "2-3 hours",
        technicianId: "fallback",
      });
      // Only toast if it's not a network error already explained in UI
      if (!msg.includes("Backend not reachable")) {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchService();
  }, [id]); // Don't depend on token for public fetch to avoid extra requests when session loads

  // Refetch with token when token becomes available to get owner/admin view of pending services
  useEffect(() => {
    if (token && service && service.approvalStatus === "pending") {
      // If service was fetched without auth and is pending, try refetch with token to see if owner/admin can view
      fetchService();
    }
  }, [token]);

  const handleBooking = async () => {
    if (!token) {
      toast.error("Please sign in to book a repair");
      router.push("/sign-in");
      return;
    }
    if (!phone || phone.length < 10) {
      toast.error("Phone must be at least 10 digits");
      return;
    }
    if (!address || address.length < 5) {
      toast.error("Address required");
      return;
    }
    if (!fault || fault.length < 10) {
      toast.error("Fault description must be at least 10 characters");
      return;
    }

    setBookingLoading(true);
    try {
      const preferredDate = new Date();
      if (date === "tomorrow") preferredDate.setDate(preferredDate.getDate() + 1);
      else {
        const parsed = new Date(date);
        if (!isNaN(parsed.getTime())) {
          preferredDate.setTime(parsed.getTime());
        }
      }

      const description = `${fault} [Time pref: ${timeSlot}]`;

      await bookingsApi.create(token, {
        serviceId: id,
        phone,
        address,
        preferredDate: preferredDate.toISOString(),
        problemDescription: description,
      });

      toast.success("Repair request created! Status: requested");
      router.push("/dashboard/customer/bookings");
    } catch (err: any) {
      toast.error(err.message || "Failed to create booking");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-sm text-[#8C9098]">
        Loading service details from backend {process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}...
      </div>
    );
  }

  const displayTitle = service?.title || "Service Not Found";
  const displayPrice = service?.basePrice ? `$${service.basePrice}` : "$280";
  const displayCategory = service?.category || "REFRIGERATOR SERVICES";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-2 text-xs font-mono text-[#8C9098] mb-6">
        <span>HOME</span>/<span>SERVICES</span>/<span className="text-[#14121B]">{id.toUpperCase()}</span>
      </div>

      {error && (
        <CardContainer className="p-4 mb-6 bg-[#FFFBEB] border-[#FDE68A]">
          <h4 className="font-semibold text-sm text-[#92400E]">Backend Connection Issue — Showing Fallback Data</h4>
          <p className="text-xs text-[#92400E] mt-1 whitespace-pre-wrap">{error}</p>
          <p className="text-xs text-[#92400E] mt-2">
            <strong>Fix:</strong> 1) Ensure backend is running: <code>cd fixmate-server && npm run build && node dist/server.js</code> or <code>npm run dev</code> on port 5000. 2) Check
            <code> NEXT_PUBLIC_API_URL={process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}</code> in <code>fixmate/.env</code>. 3) Disable Chrome extensions that block fetch to localhost (the error stack shows{" "}
            <code>chrome-extension://hoklmmgfnpapgjgcpechhaamimifchmp/frame_ant</code> which is an ad-blocker/anti-fingerprint extension intercepting fetch). Try incognito without extensions. 4) Check backend CORS allows
            <code> {process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}</code>.
          </p>
          <Button variant="outline" size="sm" className="mt-3" onClick={fetchService}>
            Retry Fetch
          </Button>
        </CardContainer>
      )}

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <div className="flex flex-wrap gap-2">
            <TelemetryBadge type="info" label={displayCategory.toUpperCase()} mono />
            <TelemetryBadge type="success" label={service?.serviceMode ? `${service.serviceMode.toUpperCase()} VISIT` : "DOORSTEP VISIT"} mono />
            <span className="px-2.5 py-1 rounded-full bg-[#F6F3F2] border border-[#E5E0DF] text-xs">★ 4.9 (128 reviews)</span>
            <span className="px-2.5 py-1 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-xs text-[#059669]">90-day Guarantee</span>
            {service && (
              <span className={`px-2.5 py-1 rounded-full text-xs border ${service.approvalStatus === "approved" ? "bg-[#ECFDF5] border-[#A7F3D0] text-[#059669]" : "bg-[#FFFBEB] border-[#FDE68A] text-[#92400E]"}`}>
                {service.approvalStatus?.toUpperCase()} • {service.isAvailable ? "AVAILABLE" : "UNAVAILABLE"}
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold font-heading">{displayTitle}</h1>

          <CardContainer className="p-0 overflow-hidden">
            <div className="h-80 bg-[#F6F3F2] relative flex items-center justify-center">
              {service?.image ? (
                <img src={service.image} alt={displayTitle} className="w-full h-full object-cover" />
              ) : (
                <span className="text-[#8C9098] text-sm">Diagnostic Visual with Telemetry Overlay</span>
              )}
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
                <li>✓ Backend: {service?.serviceMode || "doorstep"} mode, {service?.serviceArea || "San Francisco"}</li>
              </ul>
            </CardContainer>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Starting Price", value: displayPrice },
              { label: "SLA", value: "24h" },
              { label: "Warranty", value: "90 days" },
              { label: "Response", value: service?.estimatedDuration || "2h avg" },
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
                <div className="font-medium">
                  {service?.technicianId ? `Technician ${service.technicianId.toString().slice(-6)}` : "Marcus Vance • Master Certified • 4.97 ★"}
                </div>
                <div className="text-xs text-[#8C9098]">Sector: {service?.serviceArea || "San Francisco"} • Van #14 • 1.4mi away</div>
                <div className="mt-2 text-sm text-[#55595F]">15+ years appliance repair, Samsung OEM certified, Fluke & Rigol calibrated bench.</div>
              </div>
            </div>
          </CardContainer>
        </div>

        <div className="lg:col-span-5">
          <div className="sticky top-24 space-y-4">
            <CardContainer className="p-6">
              <h3 className="font-semibold mb-4">Get Started — Backend Integrated</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-mono text-[#8C9098]">PHONE • DISPATCH SMS SECURED</label>
                  <Input placeholder="+1 (555) 000-0000" className="mt-1" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-mono text-[#8C9098]">SERVICE ADDRESS</label>
                  <Input placeholder="742 Montgomery St, San Francisco" className="mt-1" value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-mono text-[#8C9098]">DATE</label>
                    <Select value={date} onValueChange={(v) => setDate(v || "tomorrow")}>
                      <SelectTrigger className="mt-1"><SelectValue placeholder="Select date" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="tomorrow">Tomorrow</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs font-mono text-[#8C9098]">TIME SLOT</label>
                    <Select value={timeSlot} onValueChange={(v) => setTimeSlot(v || "morning")}>
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
                  <Textarea placeholder="Describe the issue... at least 10 chars" className="mt-1" value={fault} onChange={(e) => setFault(e.target.value)} />
                </div>
                <div className="p-3 rounded-lg bg-[#FFFBEB] border border-[#FDE68A] text-xs text-[#92400E]">
                  <strong>FixVault Protection:</strong> $2M bonded escrow, 90-day warranty, real-time tracking. Pay only after completion. Backend: POST /api/bookings with customer role
                </div>
                <Button
                  className="w-full bg-[#F26A36] hover:bg-[#E05824] h-12 text-base"
                  onClick={handleBooking}
                  disabled={bookingLoading || !service}
                >
                  {bookingLoading ? "Requesting..." : "Confirm & Request Repair →"}
                </Button>
                {!token && <div className="text-xs text-[#ba1a1a] text-center">Please sign in as customer to book</div>}
                <div className="text-center text-[10px] font-mono text-[#8C9098]">ESCROW HOLD SECURED • TLS 1.3 • Backend integrated • API: {process.env.NEXT_PUBLIC_API_URL}</div>
              </div>
            </CardContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
