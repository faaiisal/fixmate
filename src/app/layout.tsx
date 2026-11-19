import type { Metadata } from "next";
import { Sora, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "FixMate - Smart Device & Home Appliance Repair Platform",
    template: "%s | FixMate",
  },
  description:
    "FixMate is a smart device & home appliance repair service platform connecting customers with verified technicians. Real-time tracking, escrow protection, and warranty guarantee.",
  keywords: ["appliance repair", "device repair", "technician", "FixMate", "smart escrow"],
  authors: [{ name: "FixMate" }],
  openGraph: {
    title: "FixMate - Precision Repair Platform",
    description: "Smart Device & Home Appliance Repair with Real-time Telemetry & Escrow",
    type: "website",
    locale: "en_US",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[#FCF9F8] text-[#14121B]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
