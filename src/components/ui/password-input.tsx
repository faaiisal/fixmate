"use client";

import * as React from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

type PasswordInputProps = React.ComponentProps<typeof Input> & {
  placeholder?: string;
};

export function PasswordInput({ className, placeholder = "At least 8 characters", ...props }: PasswordInputProps) {
  const [show, setShow] = React.useState(false);

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8C9098]">
        <Lock className="w-[18px] h-[18px]" />
      </div>
      <Input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        className={cn("pl-10 pr-10 h-11 bg-[#F7F7F8] border-[#E5E0DF] focus-visible:ring-[#F26A36]", className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8C9098] hover:text-[#14121B] transition-colors"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
      </button>
    </div>
  );
}
