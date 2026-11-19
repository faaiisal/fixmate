import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  padding?: "sm" | "md" | "lg" | "none";
}

const CardContainer = React.forwardRef<HTMLDivElement, CardContainerProps>(
  ({ className, hoverable, padding = "md", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-white rounded-xl border border-[#E5E0DF] shadow-[0_2px_8px_-2px_rgba(20,18,27,0.05),0_1px_3px_-1px_rgba(20,18,27,0.03)]",
          {
            "hover:shadow-[0_8px_24px_-4px_rgba(20,18,27,0.08),0_2px_6px_-1px_rgba(20,18,27,0.04)] hover:border-[#D5D5D8] transition-all cursor-pointer": hoverable,
            "p-4": padding === "sm",
            "p-6": padding === "md",
            "p-8": padding === "lg",
            "p-0": padding === "none",
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CardContainer.displayName = "CardContainer";

export { CardContainer };
