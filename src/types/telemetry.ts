export interface GeoCoords {
  lat: number;
  lng: number;
}

export interface TelemetryEvent {
  bookingId: string;
  coords: GeoCoords;
  eta: number;
  speed: number;
  status: string;
  timestamp: string;
}

export type TechnicianStatus = "online" | "offline" | "en_route" | "in_progress";
