import { TelemetryBadge, TelemetryType } from "@/components/ui/telemetry-badge";

const statusMap: Record<string, TelemetryType> = {
  requested: "warning",
  accepted: "info",
  "in-progress": "info",
  completed: "success",
  rejected: "error",
  cancelled: "neutral",
  pending: "warning",
  approved: "success",
  available: "success",
  unavailable: "neutral",
};

export function StatusBadge({ status }: { status: string }) {
  const type = statusMap[status.toLowerCase()] || "neutral";
  return <TelemetryBadge type={type} label={status.toUpperCase()} mono pulse={["requested", "accepted", "in-progress"].includes(status.toLowerCase())} />;
}
