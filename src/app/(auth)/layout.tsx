import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FCF9F8] relative overflow-hidden flex flex-col">
      {/* Ambient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#F26A36]/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(circle, #14121B 1px, transparent 1px)`, backgroundSize: `20px 20px` }} />
      </div>
      <header className="h-16 flex items-center justify-between px-6 lg:px-12 border-b border-[#E5E0DF]/50 bg-white/50 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#F26A36] flex items-center justify-center text-white font-bold">F</div>
          <span className="font-heading font-bold">FixMate</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#F6F3F2] border border-[#E5E0DF]">v2.4 LUMINOUS</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Link href="/" className="px-3 py-1.5 rounded-full border border-[#E5E0DF] bg-white">Return Home</Link>
          <span className="px-3 py-1.5 rounded-full bg-[#F6F3F2] border border-[#E5E0DF]">Support Terminal</span>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">{children}</main>
      <footer className="h-12 border-t border-[#E5E0DF]/50 bg-white/50 backdrop-blur flex items-center justify-between px-6 lg:px-12 text-[10px] font-mono text-[#8C9098]">
        <span>TLS 1.3 // NODE: US-WEST-2B // SECURE CONNECTION</span>
        <span>FixVault $2M bonded</span>
      </footer>
    </div>
  );
}
