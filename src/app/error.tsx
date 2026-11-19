"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CardContainer } from "@/components/ui/card-container";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 bg-[#FCF9F8]">
      <CardContainer className="max-w-md w-full p-8 text-center space-y-6">
        <div className="w-12 h-12 rounded-full bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-center mx-auto">
          <span className="text-[#EF4444] text-xl">⚠</span>
        </div>
        <div>
          <h2 className="text-xl font-bold font-heading text-[#14121B]">System Fault Detected</h2>
          <p className="mt-2 text-sm text-[#55595F]">
            Diagnostic routine encountered an unexpected rupture. Error ID: {error.digest || "UNKNOWN"}
          </p>
          <p className="mt-2 text-xs font-mono text-[#8C9098] break-all">{error.message}</p>
        </div>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => reset()} className="bg-[#F26A36] hover:bg-[#E05824]">Retry Diagnostic</Button>
          <Button variant="outline" onClick={() => router.push("/")}>Return Home</Button>
        </div>
      </CardContainer>
    </div>
  );
}
