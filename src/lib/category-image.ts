import type { StaticImageData } from "next/image";

// Local WebP category images from src/app/images/ (canonical backend categories)
import refrigeratorImg from "@/app/images/refrigerator.webp";
import washingMachineImg from "@/app/images/washing-machine.webp";
import laptopImg from "@/app/images/laptop.webp";
import smartphoneImg from "@/app/images/smartphone.webp";
import acImg from "@/app/images/ac.webp";
import tvImg from "@/app/images/tv.webp";
import electricalImg from "@/app/images/electrical-appliances.webp";
import toolsImg from "@/app/images/tools.webp";

const categoryImageMap: Record<string, StaticImageData> = {
  refrigerator: refrigeratorImg,
  "washing machine": washingMachineImg,
  "laptop & pc": laptopImg,
  smartphone: smartphoneImg,
  "air conditioner": acImg,
  television: tvImg,
  "electrical appliances": electricalImg,
};

/**
 * Resolve a local WebP fallback image for a service category.
 * The backend exposes canonical category names, but partial matches keep
 * legacy category values rendering safely.
 */
export function getCategoryImage(category?: string): StaticImageData {
  const key = (category || "").trim().toLowerCase();
  if (categoryImageMap[key]) return categoryImageMap[key];

  if (key.includes("refrigerator")) return refrigeratorImg;
  if (key.includes("washing")) return washingMachineImg;
  if (key.includes("laptop") || key.includes("desktop") || key.includes("pc")) return laptopImg;
  if (key.includes("smartphone") || key.includes("phone")) return smartphoneImg;
  if (key.includes("air conditioner") || key === "ac") return acImg;
  if (key.includes("television") || key === "tv") return tvImg;
  if (key.includes("electrical")) return electricalImg;
  return toolsImg;
}
