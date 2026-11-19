import { cn } from "@/lib/utils";

interface CategoryCardProps {
  icon: string;
  label: string;
  count: number;
  className?: string;
  onClick?: () => void;
}

export function CategoryCard({ icon, label, count, className, onClick }: CategoryCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "p-5 rounded-xl bg-white border border-[#E5E0DF] shadow-[0_2px_8px_-2px_rgba(20,18,27,0.05)] hover:shadow-[0_8px_24px_-4px_rgba(20,18,27,0.08)] hover:border-[#D5D5D8] transition-all cursor-pointer group",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-lg bg-[#F6F3F2] group-hover:bg-[#FFF1EC] flex items-center justify-center text-lg transition-colors">{icon}</div>
        <span className="text-[10px] font-mono px-2 py-1 rounded-full bg-[#F6F3F2] border border-[#E5E0DF] text-[#8C9098]">{count} techs</span>
      </div>
      <div className="mt-4 font-semibold text-[#14121B] text-sm">{label}</div>
      <div className="mt-1 text-xs text-[#8C9098]">Verified specialists</div>
    </div>
  );
}
