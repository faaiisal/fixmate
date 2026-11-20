"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CardContainer } from "@/components/ui/card-container";
import { TelemetryBadge } from "@/components/ui/telemetry-badge";
import * as React from "react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FCF9F8] relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#F26A36]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#00C4D6]/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle, #14121B 1px, transparent 1px)`,
          backgroundSize: `20px 20px`
        }} />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-[#E5E0DF] z-50 flex items-center justify-between px-6 lg:px-12">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#F26A36] flex items-center justify-center text-white font-bold">F</div>
          <span className="font-heading font-bold text-[#14121B]">FixMate</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#F6F3F2] border border-[#E5E0DF] text-[#8C9098]">v2.4 TELEMETRY</span>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/">Return Home</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/services">Support Terminal</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-12">
        <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-12 gap-8 items-start">
          {/* Left - Hero */}
          <div className="lg:col-span-7 space-y-6">
            {/* Telemetry strip */}
            <div className="flex flex-wrap gap-2 text-[10px] font-mono">
              <TelemetryBadge type="error" pulse mono label="ERR_ROUTE_NOT_RECOGNISED" />
              <span className="px-2.5 py-1 rounded-full bg-white border border-[#E5E0DF] text-[#8C9098]">PROBE_TARGET /SYS/TELEMETRY/NULL_VECTOR</span>
              <span className="px-2.5 py-1 rounded-full bg-white border border-[#E5E0DF] text-[#8C9098]">LATENCY 12ms</span>
              <span className="px-2.5 py-1 rounded-full bg-white border border-[#E5E0DF] text-[#8C9098]">NODE CLUSTER-US-WEST-2B</span>
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] text-xs font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-pulse" />
                DIAGNOSTIC_SIGNAL_VOID //404
              </div>
              <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight text-[#14121B] font-heading">
                Telemetry <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F26A36] to-[#E05824]">Disconnected</span>
              </h1>
              <p className="mt-4 text-[#55595F] max-w-xl">
                The requested route probe returned null vector. Signal integrity compromised. 
                Initiate automatic reconnection protocol or reroute via verified service channels.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-[#F26A36] hover:bg-[#E05824] text-white glow-primary">
                <Link href="/">Back Home</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/services">Search Services</Link>
              </Button>
              <Button variant="ghost" size="lg">Terminate Session</Button>
            </div>

            {/* Oscilloscope mock */}
            <CardContainer className="p-6 mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-mono text-xs text-[#8C9098]">BUS_LINE_09 - IMPEDANCE ∞Ω</h3>
                <span className="text-[10px] font-mono px-2 py-1 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">CHANNEL ACTIVE - RE-SYNC</span>
              </div>
              <div className="h-32 bg-[#FCF9F8] rounded-lg border border-[#E5E0DF] relative overflow-hidden flex items-center justify-center">
                {/* Simple waveform */}
                <svg viewBox="0 0 400 80" className="w-full h-full">
                  <defs>
                    <linearGradient id="trace" x1="0" x2="1">
                      <stop offset="0%" stopColor="#F26A36" stopOpacity="0.2" />
                      <stop offset="50%" stopColor="#F26A36" stopOpacity="1" />
                      <stop offset="100%" stopColor="#F26A36" stopOpacity="0.2" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,40 Q50,10 100,40 T200,40 T300,40 T400,40"
                    fill="none"
                    stroke="url(#trace)"
                    strokeWidth="2"
                  />
                  <circle cx="200" cy="40" r="4" fill="#F26A36" className="animate-ping" />
                </svg>
              </div>
            </CardContainer>
          </div>

          {/* Right - Triage */}
          <div className="lg:col-span-5 space-y-4">
            <CardContainer className="p-6">
              <h3 className="font-heading font-semibold text-[#14121B] mb-4">Instant Triage Routes</h3>
              <div className="space-y-3">
                {[
                  { icon: "🧠", title: "Memory Scan", desc: "Clear cache & retry", route: "/services" },
                  { icon: "🔧", title: "Appliance Dispatch", desc: "Get Started", route: "/services" },
                  { icon: "🛡️", title: "Warranty Check", desc: "Verify coverage", route: "/about" },
                ].map((item) => (
                  <Link key={item.title} href={item.route} className="flex items-center gap-3 p-3 rounded-xl border border-[#E5E0DF] hover:border-[#F26A36]/50 hover:bg-[#FFF1EC] transition-colors group">
                    <div className="w-10 h-10 rounded-lg bg-[#F6F3F2] group-hover:bg-white flex items-center justify-center">{item.icon}</div>
                    <div className="flex-1">
                      <div className="font-medium text-sm text-[#14121B]">{item.title}</div>
                      <div className="text-xs text-[#8C9098]">{item.desc}</div>
                    </div>
                    <span className="text-[#C4C0C0] group-hover:text-[#F26A36]">→</span>
                  </Link>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-[#E5E0DF]">
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-[#8C9098]">PACKET_DROPPED</span>
                  <span className="text-[#EF4444]">100%</span>
                </div>
                <div className="w-full h-1.5 bg-[#F6F3F2] rounded-full overflow-hidden">
                  <div className="h-full w-full bg-[#EF4444]" />
                </div>
                <div className="mt-4 flex items-center justify-between text-[10px] font-mono text-[#8C9098]">
                  <span>0 RECORDS</span>
                  <button className="underline hover:text-[#14121B]">View Terminal Log</button>
                </div>
              </div>
            </CardContainer>

            <div className="bg-[#14121B] text-[#E5E0DF] rounded-xl p-4 font-mono text-xs">
              <div className="text-[#8C9098] mb-2">SYS_LOG :: CORE_TRACE</div>
              <div>GET /SYS/TELEMETRY/NULL_VECTOR → 404</div>
              <div className="text-[#EF4444]">ROUTE NOT RECOGNISED</div>
              <ClientTimestamp />
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-[#E5E0DF] bg-white/50 backdrop-blur px-6 lg:px-12 py-4 flex items-center justify-between text-[10px] font-mono text-[#8C9098]">
        <span>SECURE CONNECTION TLS_1.3</span>
        <span className="hidden sm:inline">HASH: 0x8F2A...991C</span>
        <span>FixMate © 2024</span>
      </footer>
    </div>
  );
}

function ClientTimestamp() {
  const [ts] = React.useState<string>(() => new Date().toISOString());
  return <div className="text-[#8C9098]">Timestamp: {ts}</div>;
}
