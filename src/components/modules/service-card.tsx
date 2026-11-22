import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import { CardContainer } from "@/components/ui/card-container";
import { TelemetryBadge } from "@/components/ui/telemetry-badge";
import { formatCurrency } from "@/lib/utils";

// Local WebP category images from src/app/images/ (all .webp per requirement)
// Clean: only canonical backend categories (7) + fallback
import refrigeratorImg from "@/app/images/refrigerator.webp";
import washingMachineImg from "@/app/images/washing-machine.webp";
import laptopImg from "@/app/images/laptop.webp";
import smartphoneImg from "@/app/images/smartphone.webp";
import acImg from "@/app/images/ac.webp";
import tvImg from "@/app/images/tv.webp";
import electricalImg from "@/app/images/electrical-appliances.webp";
import toolsImg from "@/app/images/tools.webp";

interface ServiceCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  technician?: { name: string; rating: number; verified?: boolean };
  status?: "pending" | "approved" | "rejected";
  available?: boolean;
}

// Category → local WebP image mapping (canonical only - clean architecture)
// Backend canonical categories: Refrigerator, Washing Machine, Laptop & PC, Smartphone, Air Conditioner, Television, Electrical Appliances
// Removed duplicates: Laptop (→ Laptop & PC), AC (→ Air Conditioner), TV (→ Television) — 0 data when clicked
const categoryImageMap: Record<string, StaticImageData> = {
  refrigerator: refrigeratorImg,
  "washing machine": washingMachineImg,
  "laptop & pc": laptopImg,
  smartphone: smartphoneImg,
  "air conditioner": acImg,
  television: tvImg,
  "electrical appliances": electricalImg,
};

function getCategoryImage(category: string): StaticImageData {
  const key = category.trim().toLowerCase();
  // Direct canonical match
  if (categoryImageMap[key]) return categoryImageMap[key];
  // Fallback partial match for robustness
  if (key.includes("refrigerator")) return refrigeratorImg;
  if (key.includes("washing")) return washingMachineImg;
  if (key.includes("laptop") || key.includes("desktop") || key.includes("pc")) return laptopImg;
  if (key.includes("smartphone") || key.includes("phone")) return smartphoneImg;
  if (key.includes("air conditioner") || key.includes("ac")) return acImg;
  if (key.includes("television") || key.includes("tv")) return tvImg;
  if (key.includes("electrical")) return electricalImg;
  // Ultimate fallback
  return toolsImg;
}

export function ServiceCard({ id, title, description, price, category, image, technician, status, available = true }: ServiceCardProps) {
  const isRemoteImage = image && (image.startsWith("http://") || image.startsWith("https://"));
  const localFallbackImage = getCategoryImage(category);

  return (
    <Link href={`/services/${id}`} className="h-full">
      <CardContainer hoverable className="overflow-hidden p-0 h-full flex flex-col group">
        {/* Image Section - 48 height, now with real WebP */}
        <div className="h-48 bg-[#F6F3F2] relative overflow-hidden">
          {isRemoteImage ? (
            // Remote backend image (ImgBB) - use img tag with unoptimized to avoid next.config remotePatterns
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            // Local category WebP from src/app/images/
            <Image
              src={localFallbackImage}
              alt={`${category} repair - ${title}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}

          {/* Category + status badges over image */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur text-[10px] font-mono border border-[#E5E0DF] shadow-sm">
              {category}
            </span>
            {status && <TelemetryBadge type={status === "approved" ? "success" : status === "pending" ? "warning" : "error"} label={status.toUpperCase()} mono />}
          </div>

          {/* Unavailable overlay */}
          {!available && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
              <span className="px-3 py-1 rounded-full bg-[#FEF2F2] text-[#DC2626] text-xs font-medium border border-[#FECACA]">Unavailable</span>
            </div>
          )}

          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>

        <div className="p-5 flex-1 flex flex-col">
          <h3 className="font-heading font-semibold text-[#14121B] line-clamp-1 group-hover:text-[#F26A36] transition-colors">{title}</h3>
          <p className="mt-1 text-sm text-[#55595F] line-clamp-2 flex-1">{description}</p>
          {technician && (
            <div className="mt-3 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#F6F3F2] border border-[#E5E0DF] flex items-center justify-center text-[10px] font-medium">
                {technician.name[0]}
              </div>
              <span className="text-xs text-[#55595F]">{technician.name}</span>
              {technician.verified && <span className="w-3 h-3 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[8px]">✓</span>}
              <span className="text-xs font-mono text-[#8C9098]">★ {technician.rating}</span>
            </div>
          )}
          <div className="mt-4 flex items-center justify-between">
            <span className="font-bold text-[#14121B]">{formatCurrency(price)}</span>
            <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#FFF1EC] text-[#F26A36] border border-[#FFD6C2] group-hover:bg-[#F26A36] group-hover:text-white transition-colors">
              BOOK NOW →
            </span>
          </div>
        </div>
      </CardContainer>
    </Link>
  );
}
