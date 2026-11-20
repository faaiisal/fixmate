import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CardContainer } from "@/components/ui/card-container";
import { TelemetryBadge } from "@/components/ui/telemetry-badge";
import { Badge } from "@/components/ui/badge";

// WebP images from src/app/images/ - all .webp per requirement
import heroImage from "@/app/images/hero-image.webp";
import techMarcus from "@/app/images/technician-marcus.webp";
import techFarhan from "@/app/images/technician-farhan.webp";
import techElena from "@/app/images/technician-elena.webp";
import techDavid from "@/app/images/technician-david.webp";
import techZubair from "@/app/images/technician-zubair.webp";
import techSarah from "@/app/images/technician-sarah.webp";
import customerDavid from "@/app/images/customer-david-k.webp";
import customerPriya from "@/app/images/customer-priya-mehta.webp";
import customerCarlos from "@/app/images/customer-carlos-rivera.webp";

// --- Mock Data: Backend-ready structure (will be fetched from /api/services later) ---
const categories = [
  { icon: "📱", label: "Smartphone", count: 28, desc: "Screen, battery & logic board", techImg: "smartphone" },
  { icon: "💻", label: "Laptop & PC", count: 34, desc: "Diagnostics, motherboard, display", techImg: "laptop" },
  { icon: "❄️", label: "Air Conditioners", count: 19, desc: "Inverter gas, coils, PCB", techImg: "ac" },
  { icon: "🧊", label: "Refrigerator", count: 22, desc: "Compressor, thermostat, frost fix", techImg: "refrigerator" },
  { icon: "📺", label: "Television", count: 16, desc: "OLED, backlight, power boards", techImg: "tv" },
  { icon: "🌀", label: "Washing Machine", count: 14, desc: "Drum, motor, drainage pump", techImg: "washing" },
  { icon: "⚡", label: "Electrical", count: 21, desc: "Breakers, wiring, surge protection", techImg: "electrical" },
  { icon: "💧", label: "Kitchen & Water", count: 11, desc: "Motors, filters, RO systems", techImg: "kitchen" },
];

const featuredServices = [
  {
    id: "refrigerator-smart-french",
    category: "Refrigerator",
    visit: "Doorstep Visit",
    title: "Smart French-Door Refrigerator Diagnostics & Inverter Fix",
    desc: "Full sensor loop inspection, dual evaporator valve recalibration, inverter compressor board test, and frost defrost heating cycle restore.",
    tech: { name: "Marcus Vance", rating: "4.98 • 412 fixes", image: techMarcus, verified: true },
    price: 35,
  },
  {
    id: "ac-inverter-split",
    category: "Air Conditioners",
    visit: "Doorstep Visit",
    title: "Inverter Split AC Deep Chemical Wash & Gas Top-Up",
    desc: "High-pressure jet wash, antimicrobial coil conditioning, R32/R410A precision digital manifold pressure test, and suction leak fix.",
    tech: { name: "Farhan Ahmed", rating: "4.95 • 380 fixes", image: techFarhan, verified: true },
    price: 40,
  },
  {
    id: "laptop-macbook-microsolder",
    category: "Laptop & PC",
    visit: "Doorstep or Lab",
    title: "MacBook Pro & High-End Laptop Logic Board Microsoldering",
    desc: "Microscope SMD inspection, shorted power rail repair (PPBUS_G3H), GPU reballing, ultrasonic liquid spill cleaning, and thermal pad upgrade.",
    tech: { name: "Elena Rostova", rating: "4.99 • 620 fixes", image: techElena, verified: true },
    price: 45,
  },
  {
    id: "washing-machine-front-load",
    category: "Washing Machine",
    visit: "Doorstep Visit",
    title: "Front-Load Washing Machine DirectDrive Motor & Drum Repair",
    desc: "Drum bearing replacement, vibration damper balancing, BLDC motor hall sensor reset, and drain pump impeller unclogging.",
    tech: { name: "David Kim", rating: "4.92 • 290 fixes", image: techDavid, verified: true },
    price: 30,
  },
  {
    id: "water-purifier-ro",
    category: "Water Purifier",
    visit: "Doorstep Visit",
    title: "Multi-Stage Commercial RO Water Purifier Membrane Overhaul",
    desc: "RO membrane permeability benchmark, booster pump PSI testing, sediment/carbon filter replacement, and digital TDS calibration.",
    tech: { name: "Zubair Mahmud", rating: "4.96 • 195 fixes", image: techZubair, verified: true },
    price: 25,
  },
  {
    id: "smartphone-oled",
    category: "Smartphone",
    visit: "Doorstep 30-Min Fix",
    title: "Flagship Smartphone OLED Assembly & Precision Sensor Repair",
    desc: "Original color-calibrated OLED display swap, TrueTone programming, ultrasonic fingerprint alignment, and IP68 waterproof reseal.",
    tech: { name: "Sarah Jenkins", rating: "4.97 • 510 fixes", image: techSarah, verified: true },
    price: 29,
  },
];

const transparencySteps = [
  {
    step: "01",
    label: "Step 01",
    title: "Find a Service",
    desc: "Search 22+ categories or snap a photo of the error code for instant AI triage and flat diagnostic estimate.",
    footer: "Under 30 seconds",
    icon: "🔍",
  },
  {
    step: "02",
    label: "Step 02",
    title: "Send a Repair Request",
    desc: "Lock in your preferred date, transparent upfront quote, and verified slot with live ETA proximity alerts.",
    footer: "Zero pre-charge",
    icon: "📅",
  },
  {
    step: "03",
    label: "Step 03",
    title: "Technician Completes Repair",
    desc: "ISO-certified field pro arrives with OEM components and calibrated toolset for clean, on-site resolution.",
    footer: "OEM Tested Spares",
    icon: "🔧",
  },
  {
    step: "04",
    label: "Step 04",
    title: "Pay After Completion",
    desc: "Test appliance thoroughly, approve work order, and tap-to-pay with 90-day parts and labor warranty locked.",
    footer: "90-Day Warranty Activated",
    icon: "✅",
    highlight: true,
  },
];

const trustPillars = [
  {
    title: "Verified & Background-Checked",
    desc: "100% rigorous criminal background clearance and multi-brand OEM skill laboratory testing before field deployment.",
    icon: "🪪",
  },
  {
    title: "Transparent Upfront Quotes",
    desc: "Zero hidden surcharges. Itemized parts & labor costs are presented and approved before any screwdriver touches your equipment.",
    icon: "🧾",
  },
  {
    title: "Live Trackable Telemetry",
    desc: "Live GPS engineer arrival updates, step-by-step digital diagnostic checklist, and complete PDF test reports.",
    icon: "📡",
  },
  {
    title: "Payment After Full Satisfaction",
    desc: "Funds remain in escrow. You only release payment once you inspect the device in operation. Covered by our 90-day warranty.",
    icon: "🛡️",
  },
];

const testimonials = [
  {
    rating: 5,
    quote: "Our Samsung French Door fridge stopped cooling on a Sunday morning with $400 of groceries inside. Marcus arrived in 32 minutes, replaced the inverter run capacitor, and saved everything.",
    workOrder: "#FX-8942",
    issue: "Inverter Capacitor Failure",
    time: "41 minutes total",
    customer: { name: "David K.", location: "San Francisco, CA", image: customerDavid },
  },
  {
    rating: 5,
    quote: "Apple Store quoted me $1,100 to replace the entire logic board for a coffee spill. Elena microsoldered the backlight power trace on my MacBook M2 for a fraction of that. Simply masterful work.",
    workOrder: "#FX-9104",
    issue: "Backlight Circuit Corroded Trace",
    time: "58 minutes",
    customer: { name: "Priya Mehta", location: "Austin, TX", image: customerPriya },
  },
  {
    rating: 5,
    quote: "My Daikin Inverter AC stopped blowing cold during a 100-degree heatwave. Farhan arrived with digital manifold telemetry gauges, flushed the evaporator lines, topped up refrigerant, and had it chilling instantly.",
    workOrder: "#FX-7833",
    issue: "Coil Microleak & Pressure Drop",
    time: "52 minutes",
    customer: { name: "Carlos Rivera", location: "Phoenix, AZ", image: customerCarlos },
  },
];

export default function HomePage() {
  return (
    <div className="bg-[#F7F7F8]">
      {/* ========== HERO SECTION ========== */}
      <section className="relative w-full">
        <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-orange-200/30 rounded-full blur-[140px]" />
          <div className="absolute top-28 right-1/4 w-[450px] h-[450px] bg-rose-200/25 rounded-full blur-[160px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-12 lg:gap-x-10 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 flex flex-col space-y-6">
              <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-white border border-[#E7E7E9] shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="font-mono text-xs text-[#171717] tracking-tight font-medium">
                  142 Certified Engineers Active Now <span className="text-gray-300">|</span> 90-Day Guarantee <span className="text-gray-300">|</span> ISO-9001 Certified
                </span>
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#171717] tracking-tight leading-[1.15]">
                Precision Appliance & Device Repair.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F26A36] via-orange-600 to-rose-600">
                  Certified Experts
                </span>{" "}
                At Your Doorstep.
              </h1>

              <p className="font-sans text-base sm:text-lg text-[#737373] max-w-2xl leading-relaxed">
                From high-efficiency refrigerators and inverter HVAC systems to MacBooks and smartphones. Book in under 60 seconds, track in real time, and pay only after complete verification.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button asChild size="lg" className="rounded-lg bg-[#F26A36] hover:bg-[#aa3700] text-white font-semibold shadow-md px-6 py-3.5 h-auto">
                  <Link href="/services">
                    Explore All Services <span className="ml-2">→</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-lg bg-white border border-[#E7E7E9] text-[#171717] hover:text-[#F26A36] shadow-sm font-semibold h-auto py-3.5 px-6">
                  <Link href="#how-it-works">▶ How It Works</Link>
                </Button>
              </div>

              {/* Instant Dispatch Triage Bar */}
              <CardContainer className="p-5 lg:p-6 space-y-3">
                <div className="flex items-center justify-between pb-1">
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#F26A36] flex items-center gap-1.5">
                    ⚡ Instant Dispatch Triage
                  </span>
                  <span className="font-mono text-[11px] text-[#737373]">Real-time GPS Proximity</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-5 relative">
                    <select className="w-full h-12 pl-10 pr-8 rounded-lg bg-[#F7F7F8] border border-[#E7E7E9] text-[#171717] text-sm focus:outline-none focus:ring-2 focus:ring-[#F26A36]">
                      <option disabled selected value="">
                        Select Appliance or Device
                      </option>
                      <option>Smart Refrigerator & Freezer</option>
                      <option>Inverter Split AC & HVAC</option>
                      <option>MacBook & Laptop Logic Board</option>
                      <option>Washing Machine</option>
                      <option>Flagship Smartphone</option>
                      <option>RO Water Purifier</option>
                      <option>OLED Television</option>
                      <option>Electrical Panel</option>
                    </select>
                  </div>
                  <div className="sm:col-span-4 relative">
                    <input
                      className="w-full h-12 pl-10 pr-3 rounded-lg bg-[#F7F7F8] border border-[#E7E7E9] text-[#171717] placeholder:text-[#737373] text-sm focus:outline-none focus:ring-2 focus:ring-[#F26A36]"
                      placeholder="ZIP or City (e.g. 94107)"
                      type="text"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <Button type="button" className="w-full h-12 rounded-lg bg-[#F26A36] hover:bg-[#aa3700] text-white font-semibold shadow-sm">
                      📡 Find Pro
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 font-mono text-xs text-[#737373]">
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                    ✅ Zero Diagnostic Fee with Repair
                  </span>
                  <span className="inline-flex items-center gap-1">
                    🛡️ $500k Property Insurance
                  </span>
                </div>
              </CardContainer>
            </div>

            {/* Right Visual Workbench */}
            <div className="lg:col-span-5 relative">
              <CardContainer className="relative rounded-2xl overflow-hidden p-0 shadow-lg">
                <div className="relative h-96 sm:h-[430px] w-full overflow-hidden bg-gray-100">
                  <Image
                    src={heroImage}
                    alt="High-tech futuristic clean hardware diagnostic workbench, robotic optical sensor hovering over circuit board with cyan and neon violet laser telemetry lines"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#171717]/80 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <div className="px-2.5 py-1 rounded bg-white/95 backdrop-blur-md flex items-center gap-2 border border-[#E7E7E9] shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="font-mono text-xs font-semibold text-emerald-700">CALIBRATION // NOMINAL</span>
                    </div>
                    <div className="px-2.5 py-1 rounded bg-white/95 backdrop-blur-md font-mono text-xs font-semibold border border-[#E7E7E9] shadow-sm">
                      PRO-GRID ACTIVE
                    </div>
                  </div>
                  <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-[#E7E7E9] shadow-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-[#ECFDF5] border border-green-200 flex items-center justify-center text-emerald-700">
                        ⚡
                      </div>
                      <div>
                        <div className="font-heading text-xl font-bold tracking-tight flex items-baseline gap-1">
                          99.4% <span className="text-emerald-700 font-mono text-xs font-semibold">Verified</span>
                        </div>
                        <div className="text-xs text-[#737373]">First-Visit Resolution Rate</div>
                      </div>
                    </div>
                    <div className="text-right pl-3">
                      <div className="font-heading text-xl font-bold text-[#F26A36]">28 min</div>
                      <div className="font-mono text-xs text-[#737373]">Avg Metro Arrival</div>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-[#F7F7F8] border-t border-[#E7E7E9] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Image src={techElena} alt="Elena Rostova" width={36} height={36} className="w-9 h-9 rounded-full object-cover border border-[#E7E7E9]" />
                    <div>
                      <div className="text-sm font-semibold">Elena Rostova</div>
                      <div className="font-mono text-xs text-[#737373]">Master Microsolder Tech • 620 fixes</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ECFDF5] border border-green-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-mono text-xs font-medium text-emerald-700">En Route (12m away)</span>
                  </div>
                </div>
              </CardContainer>

              <div className="hidden sm:flex absolute -bottom-5 -left-6 p-3.5 rounded-xl bg-white border border-[#E7E7E9] backdrop-blur-lg shadow-xl items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-[#F26A36]">🛡️</div>
                <div>
                  <div className="font-mono text-xs font-semibold uppercase">90-Day Warranty</div>
                  <div className="text-xs text-[#737373]">Parts & Labor Fully Escrowed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== COVERAGE ECOSYSTEM ========== */}
      <section className="w-full py-12 bg-white border-y border-[#E7E7E9]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="font-mono text-xs font-semibold text-[#F26A36] uppercase tracking-wider mb-2 flex items-center gap-2">
                📦 Coverage Ecosystem
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight">Browse by Appliance & Device Category</h2>
              <p className="text-sm sm:text-base text-[#737373] mt-1">Instant dispatch across all residential and workstation electronics.</p>
            </div>
            <Link href="/services" className="inline-flex items-center gap-1 text-[#F26A36] hover:text-[#aa3700] font-semibold text-sm">
              View all 22 categories →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.label}
                href="/services"
                className="p-5 rounded-xl bg-white border border-[#E7E7E9] hover:border-orange-300 hover:shadow-md transition-all shadow-sm group flex flex-col justify-between h-44"
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-lg bg-orange-50 group-hover:bg-[#F26A36] group-hover:text-white flex items-center justify-center text-[#F26A36] transition-colors text-2xl">
                    {cat.icon}
                  </div>
                  <span className="font-mono text-xs text-[#737373] group-hover:text-[#F26A36]">{cat.count} Techs</span>
                </div>
                <div>
                  <h3 className="font-heading text-base font-semibold group-hover:text-[#F26A36] transition-colors">{cat.label}</h3>
                  <p className="text-xs text-[#737373] mt-0.5 line-clamp-1">{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FEATURED REPAIR SERVICES ========== */}
      <section className="w-full py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-orange-100 text-[#F26A36] font-mono text-xs font-semibold uppercase tracking-wider mb-2">
                🔄 Pre-vetted Flat Rates
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight">Featured Repair Services</h2>
              <p className="text-sm sm:text-base text-[#737373] mt-1">Transparent baseline fees including on-site telemetry diagnostic verification.</p>
            </div>
            <div className="font-mono text-xs text-[#737373] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Guaranteed OEM Compatible Spares
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredServices.map((service) => (
              <div key={service.id} className="rounded-xl bg-white border border-[#E7E7E9] p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="bg-orange-50 text-[#F26A36] font-mono text-xs">
                      {service.category}
                    </Badge>
                    <span className="inline-flex items-center gap-1 font-mono text-xs text-[#737373]">📍 {service.visit}</span>
                  </div>
                  <h3 className="font-heading text-lg font-bold tracking-tight leading-tight">{service.title}</h3>
                  <p className="text-xs sm:text-sm text-[#737373] leading-relaxed line-clamp-3">{service.desc}</p>

                  <div className="p-3 rounded-lg bg-[#F7F7F8] border border-[#E7E7E9] flex items-center gap-3">
                    <Image src={service.tech.image} alt={service.tech.name} width={32} height={32} className="w-8 h-8 rounded-full object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold truncate">{service.tech.name}</div>
                      <div className="font-mono text-xs text-[#737373]">★ {service.tech.rating}</div>
                    </div>
                    <span className="text-emerald-600 text-lg">✔️</span>
                  </div>
                </div>

                <div className="pt-6 mt-6 flex items-center justify-between border-t border-[#E7E7E9]">
                  <div>
                    <span className="font-mono text-xs text-[#737373] block">Starting from</span>
                    <span className="font-heading text-2xl font-bold tracking-tight">${service.price}</span>
                  </div>
                  <Button asChild size="sm" className="rounded-lg bg-[#F26A36] hover:bg-[#aa3700] text-white font-semibold">
                    <Link href={`/services/${service.id}`}>View Details & Book</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 text-[10px] font-mono text-[#737373] text-center">Data will be fetched from backend server at /api/services when implemented — currently mock WebP dummy images from src/app/images/</p>
        </div>
      </section>

      {/* ========== TRANSPARENCY - 4 STEPS (1 row 4 col shadcn) ========== */}
      <section id="how-it-works" className="w-full py-12 bg-white border-y border-[#E7E7E9]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E7E7E9] text-[#F26A36] font-mono text-xs font-semibold mb-3 shadow-sm">
              🔄 4-Step Execution Protocol
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight">Engineered for Absolute Transparency</h2>
            <p className="text-sm sm:text-base text-[#737373] mt-2">From initial AI error code triage to doorstep sign-off, every stage is tracked, verified, and guaranteed.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {transparencySteps.map((step) => (
              <CardContainer key={step.step} className="p-6 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-all">
                <div className="absolute -top-1 -right-1 font-heading text-4xl font-black text-gray-100 select-none pointer-events-none group-hover:text-orange-100 transition-colors">
                  {step.step}
                </div>
                <div>
                  <div className="w-12 h-12 rounded-lg bg-orange-50 text-[#F26A36] flex items-center justify-center mb-6 text-2xl">{step.icon}</div>
                  <div className="font-mono text-xs font-semibold text-[#F26A36] uppercase mb-1">{step.label}</div>
                  <h3 className="font-heading text-lg font-bold mb-2">{step.title}</h3>
                  <p className="text-xs sm:text-sm text-[#737373] leading-relaxed">{step.desc}</p>
                </div>
                <div
                  className={`mt-6 pt-4 border-t border-[#E7E7E9] font-mono text-xs flex items-center gap-1 ${
                    step.highlight ? "text-emerald-700 font-medium" : "text-[#737373]"
                  }`}
                >
                  ✅ {step.footer}
                </div>
              </CardContainer>
            ))}
          </div>
        </div>
      </section>

      {/* ========== SERVICE PROTOCOL - Why FixMate (4 pillars) ========== */}
      <section className="w-full py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 lg:p-12 rounded-2xl bg-white border border-[#E7E7E9] shadow-md relative overflow-hidden">
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-orange-100/50 rounded-full blur-[100px] pointer-events-none" />
            <div className="max-w-2xl mb-10">
              <span className="font-mono text-xs font-semibold text-[#F26A36] uppercase tracking-wider block mb-2">Industrial Grade Standards</span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight">Why FixMate is the Preferred Service Protocol</h2>
              <p className="text-sm sm:text-base text-[#737373] mt-1">We combined lab-grade hardware diagnostics with frictionless consumer protections.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {trustPillars.map((pillar) => (
                <div key={pillar.title} className="p-5 rounded-xl bg-[#F7F7F8] border border-[#E7E7E9] space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 text-[#F26A36] flex items-center justify-center text-xl">{pillar.icon}</div>
                  <h3 className="font-heading text-base font-bold">{pillar.title}</h3>
                  <p className="text-xs sm:text-sm text-[#737373] leading-relaxed">{pillar.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== VERIFIED WORK ORDERS ========== */}
      <section className="w-full py-12 bg-white border-y border-[#E7E7E9]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="font-mono text-xs font-semibold text-[#F26A36] uppercase tracking-wider mb-2 flex items-center gap-2">📝 Verified Work Orders</div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight">Proof Logs from Real Residential Work Orders</h2>
            </div>
            <div className="font-mono text-xs font-medium flex items-center gap-1.5">
              <span className="text-emerald-700 font-bold">★ 4.97 Average Rating</span> across 14,800+ fixes
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div key={idx} className="p-6 rounded-xl bg-white border border-[#E7E7E9] flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex text-amber-500 text-sm">{"★".repeat(t.rating)}</div>
                    <span className="font-mono text-xs text-emerald-700 font-semibold flex items-center gap-1">✅ Verified Fix</span>
                  </div>
                  <p className="text-sm sm:text-base italic leading-relaxed">“{t.quote}”</p>
                  <div className="p-3 rounded-lg bg-[#F7F7F8] border border-[#E7E7E9] font-mono text-xs space-y-1">
                    <div className="text-[#737373]">
                      Work Order: <span className="text-[#171717] font-medium">{t.workOrder}</span>
                    </div>
                    <div className="text-[#737373]">
                      Issue: <span className="text-[#171717] font-medium">{t.issue}</span>
                    </div>
                    <div className="text-[#737373]">
                      Time Taken: <span className="text-[#F26A36] font-semibold">{t.time}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-[#E7E7E9] flex items-center gap-3">
                  <Image src={t.customer.image} alt={t.customer.name} width={40} height={40} className="w-10 h-10 rounded-full object-cover border border-[#E7E7E9]" />
                  <div>
                    <div className="text-sm font-semibold">{t.customer.name}</div>
                    <div className="text-xs text-[#737373]">{t.customer.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA READY TO RESTORE ========== */}
      <section className="w-full pt-6 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 lg:p-16 rounded-2xl bg-white border border-[#E7E7E9] shadow-md relative overflow-hidden flex flex-col items-center text-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(242,106,54,0.08),transparent_70%)] pointer-events-none" />
            <div className="relative z-10 max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F7F7F8] border border-[#E7E7E9] shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono text-xs font-semibold text-[#F26A36]">Live Dispatch Available Nationwide</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                Ready to Restore Your Equipment to
                <br className="hidden sm:inline" />
                Factory Performance?
              </h2>
              <p className="text-base sm:text-lg text-[#737373] max-w-xl mx-auto leading-relaxed">
                Book certified precision repair in under 60 seconds. Guaranteed OEM replacement parts, vetted diagnostics, and 90-day peace of mind.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <Button asChild size="lg" className="rounded-lg bg-[#F26A36] hover:bg-[#aa3700] text-white font-semibold shadow-md px-8 py-4 h-auto">
                  <Link href="/services">Explore All 22 Services →</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-lg bg-[#F7F7F8] border border-[#E7E7E9] text-[#171717] hover:text-[#F26A36] shadow-sm h-auto py-4 px-8">
                  <Link href="tel:18003496283">📞 Emergency Dispatch: 1-800-FIX-MATE</Link>
                </Button>
              </div>
              <div className="pt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 font-mono text-xs text-[#737373]">
                <span className="inline-flex items-center gap-1.5 text-emerald-700 font-medium">✅ ISO-9001 Certified Labs</span>
                <span className="inline-flex items-center gap-1.5 font-medium">🛡️ $500,000 Insured Protection</span>
                <span className="inline-flex items-center gap-1.5 font-medium">🔒 Pay Only After Approval</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
