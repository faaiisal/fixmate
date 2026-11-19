"use client";

import * as React from "react";

export function useCountdown(initialSeconds: number, autoStart = true) {
  const [timeLeft, setTimeLeft] = React.useState(initialSeconds);
  const [isRunning, setIsRunning] = React.useState(autoStart);

  React.useEffect(() => {
    if (!isRunning) return;
    if (timeLeft <= 0) return;
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft, isRunning]);

  React.useEffect(() => {
    if (timeLeft <= 0 && isRunning) {
      queueMicrotask(() => setIsRunning(false));
    }
  }, [timeLeft, isRunning]);

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = (seconds = initialSeconds) => {
    setTimeLeft(seconds);
    setIsRunning(autoStart);
  };

  return { timeLeft, isRunning, start, pause, reset };
}
