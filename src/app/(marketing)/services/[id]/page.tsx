"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import { CardContainer } from "@/components/ui/card-container";
import { TelemetryBadge } from "@/components/ui/telemetry-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { servicesApi, bookingsApi, useAuthToken } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Local WebP fallbacks - all .webp from src/app/images/ (clean architecture, no duplicates)
import refrigeratorImg from "@/app/images/refrigerator.webp";
import washingMachineImg from "@/app/images/washing-machine.webp";
import laptopImg from "@/app/images/laptop.webp";
import smartphoneImg from "@/app/images/smartphone.webp";
import acImg from "@/app/images/ac.webp";
import tvImg from "@/app/images/tv.webp";
import electricalImg from "@/app/images/electrical-appliances.webp";
import desktopImg from "@/app/images/desktop.webp";
import toolsImg from "@/app/images/tools.webp";

// Specific product mapping for real original images - avoids duppy image
function getLocalImageForService(service: any) {
  if (!service) return toolsImg;
  const title = (service.title || "").toLowerCase();
  const category = (service.category || "").toLowerCase();

  // Product-specific mapping for Microwave example and others
  if (title.includes("microwave") || title.includes("magnetron")) return electricalImg;
  if (title.includes("ro water") || title.includes("purifier") || title.includes("filter") || title.includes("membrane")) return toolsImg;
  if (title.includes("washing") || title.includes("washer") || title.includes("drum") || title.includes("bearing")) return washingMachineImg;
  if (title.includes("top load") && title.includes("washer")) return washingMachineImg;
  if (title.includes("refrigerator") || title.includes("fridge") || title.includes("freezer") || title.includes("compressor")) return refrigeratorImg;
  if (title.includes("ac") || title.includes("air conditioner") || title.includes("inverter") && (title.includes("gas") || title.includes("pcb"))) {
    return acImg;
  }
  if (title.includes("tv") || title.includes("television") || title.includes("qled") || title.includes("bravia") || title.includes("panel") || title.includes("motherboard")) {
    return tvImg;
  }
  if (title.includes("laptop") || title.includes("macbook") || title.includes("dell") || title.includes("xps") || title.includes("keyboard") || title.includes("logic board") || title.includes("microsolder")) {
    // Distribute laptop & pc into two images to avoid duplicate
    if (title.includes("dell") || title.includes("keyboard")) return laptopImg;
    if (title.includes("macbook") || title.includes("logic board")) return desktopImg;
    return laptopImg;
  }
  if (title.includes("smartphone") || title.includes("galaxy") || title.includes("iphone") || title.includes("screen") || title.includes("battery")) {
    return smartphoneImg;
  }

  // Fallback by category
  if (category.includes("refrigerator")) return refrigeratorImg;
  if (category.includes("washing")) return washingMachineImg;
  if (category.includes("laptop") || category.includes("pc") || category.includes("desktop")) return laptopImg;
  if (category.includes("smartphone")) return smartphoneImg;
  if (category.includes("air conditioner") || category.includes("ac")) return acImg;
  if (category.includes("television") || category.includes("tv")) return tvImg;
  if (category.includes("electrical")) return electricalImg;

  return toolsImg;
}

export default function ServiceDetailsPage({ params }: { params: { id: string } | Promise<{ id: string }> }) {
  const resolvedParams = params instanceof Promise ? use(params as Promise<{ id: string }>) : params;
  const id = resolvedParams.id;

  const { data: session } = useSession();
  const router = useRouter();

  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("tomorrow");
  const [timeSlot, setTimeSlot] = useState("morning");
  const [fault, setFault] = useState("");

  const fetchService = async () => {
    try {
      setLoading(true);
      setError(null);
      setImageError(false);
      const res = await servicesApi.details(id);
      setService(res.data);
    } catch (err: any) {
      console.error("Failed to fetch service details:", err);
      setError(err.message || "Failed to load service");
      // Fallback for UI preservation - sanitized, no path leak
      setService({
        _id: id,
        title: "Service Details",
        description: "This service information is currently unavailable. Please retry later.",
        basePrice: 100,
        category: "General",
        approvalStatus: "approved",
        isAvailable: true,
        serviceMode: "doorstep",
        serviceArea: "Dhaka, Bangladesh",
        image: "",
        estimatedDuration: "2 hours",
        technicianId: "fallback",
      });
      toast.error(err.message || "Failed to load service");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchService();
  }, [id]);

  const handleBooking = async () => {
    const sessionData = session as any;
    if (!sessionData?.user) {
      toast.error("Please sign in to book a repair");
      router.push("/sign-in");
      return;
    }
    const realToken = useAuthToken(session);
    if (!realToken) {
      toast.error("Session expired, please sign in again");
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

      const description = `${fault} [Time pref: ${timeSlot}]`;

      await bookingsApi.create(realToken, {
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
        Loading service details...
      </div>
    );
  }

  const displayTitle = service?.title || "Service Not Found";
  const displayPrice = service?.basePrice ? `$${service.basePrice}` : "$100";
  const displayCategory = service?.category || "Service";
  const localImage = getLocalImageForService(service);
  const hasRemoteImage = service?.image && service.image.startsWith("http") && !imageError;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-2 text-xs font-mono text-[#8C9098] mb-6">
        <span>HOME</span>/<span>SERVICES</span>/<span className="text-[#14121B] truncate max-w-[200px]">{displayTitle.slice(0, 30)}</span>
      </div>

      {error && (
        <CardContainer className="p-4 mb-6 bg-[#FFFBEB] border-[#FDE68A]">
          <h4 className="font-semibold text-sm text-[#92400E]">Unable to load fresh data — Showing fallback</h4>
          <p className="text-xs text-[#92400E] mt-1">Backend not reachable. Please retry.</p>
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

          {/* Real original image from backend server → client, with local WebP fallback for 404 */}
          <CardContainer className="p-0 overflow-hidden">
            <div className="h-80 bg-[#F6F3F2] relative flex items-center justify-center overflow-hidden group">
              {hasRemoteImage ? (
                <img
                  src={service.image}
                  alt={displayTitle}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={() => setImageError(true)}
                />
              ) : (
                <Image
                  src={localImage}
                  alt={`${displayTitle} - ${displayCategory} repair`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              )}
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="px-2 py-1 rounded-full bg-white/90 backdrop-blur text-[10px] font-mono border border-[#E5E0DF] shadow-sm">S/N: FX-APPL-8821</span>
                <TelemetryBadge type="info" label="LIVE TELEMETRY" pulse mono />
              </div>
              <div className="absolute bottom-3 right-3 px-2 py-1 rounded-full bg-black/70 text-white text-[10px] font-mono">
                {hasRemoteImage ? "Backend ImgBB • Real Image" : "Local WebP Fallback • Category Matched"}
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
                <li>✓ {service?.serviceMode || "doorstep"} mode, {service?.serviceArea || "Dhaka, Bangladesh"}</li>
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
                <div className="text-xs text-[#8C9098]">Sector: {service?.serviceArea || "Dhaka, Bangladesh"} • Van #14 • 1.4mi away</div>
                <div className="mt-2 text-sm text-[#55595F]">15+ years appliance repair, Samsung OEM certified, Fluke & Rigol calibrated bench.</div>
              </div>
            </div>
          </CardContainer>
        </div>

        <div className="lg:col-span-5">
          <div className="sticky top-24 space-y-4">
            <CardContainer className="p-6">
              <h3 className="font-semibold mb-4">Book This Service — Backend Integrated</h3>
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
                  <strong>FixVault Protection:</strong> $2M bonded escrow, 90-day warranty, real-time tracking. Pay only after completion.
                </div>
                <Button className="w-full bg-[#F26A36] hover:bg-[#E05824] h-12 text-base" onClick={handleBooking} disabled={bookingLoading || !service}>
                  {bookingLoading ? "Requesting..." : "Confirm & Request Repair →"}
                </Button>
                <div className="text-center text-[10px] font-mono text-[#8C9098]">ESCROW HOLD SECURED • TLS 1.3</div>
              </div>
            </CardContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
