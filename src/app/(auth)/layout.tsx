import Link from "next/link";
import Image from "next/image";
import { Footer } from "react-day-picker";
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FCF9F8] relative overflow-hidden flex flex-col">
      {/* Ambient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#F26A36]/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(circle, #14121B 1px, transparent 1px)`, backgroundSize: `20px 20px` }} />
      </div>
      <header className="h-16 flex items-center justify-between px-6 lg:px-12 border-b border-[#E5E0DF]/50 bg-white/50 backdrop-blur">
        <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2 shrink-0 group" aria-label="FixMate Home">
              <Image
                src="/fixmate-logo.png"
                alt="FixMate"
                width={120}
                height={64}
                className="w-[120px] h-auto object-contain"
                priority
              />
            </Link>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Link href="/" className="px-3 py-1.5 rounded-full border border-[#E5E0DF] bg-white">Return Home</Link>
          <span className="px-3 py-1.5 rounded-full bg-[#F6F3F2] border border-[#E5E0DF]">Support Terminal</span>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">{children}</main>
      <Footer/>
    </div>
  );
}
