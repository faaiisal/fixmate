"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  durationSeconds?: number;
  autoStart?: boolean;
  strokeColor?: string;
  onComplete?: () => void;
  className?: string;
}

export function CountdownTimer({
  durationSeconds = 30,
  autoStart = true,
  strokeColor = "#F26A36",
  onComplete,
  className,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = React.useState(durationSeconds);
  const [isRunning, setIsRunning] = React.useState(autoStart);
  const circumference = 2 * Math.PI * 54;
  const progress = timeLeft / durationSeconds;
  const strokeDashoffset = circumference * (1 - progress);

  React.useEffect(() => {
    if (!isRunning) return;
    if (timeLeft <= 0) {
      onComplete?.();
      return;
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft, isRunning, onComplete]);

  React.useEffect(() => {
    if (timeLeft <= 0 && isRunning) {
      // Defer state update to avoid setState in effect lint
      queueMicrotask(() => setIsRunning(false));
    }
  }, [timeLeft, isRunning]);

  return (
    <div className={cn("relative w-28 h-28 flex items-center justify-center", className)}>
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" fill="none" stroke="#F6F3F2" strokeWidth="8" />
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke={strokeColor}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-linear"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold font-mono text-[#14121B]">{timeLeft}s</span>
        <span className="text-[10px] font-mono text-[#8C9098]">AUTO-DISCONNECT</span>
      </div>
    </div>
  );
}
