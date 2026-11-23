"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContainer } from "@/components/ui/card-container";
import { EmptyState } from "@/components/modules/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { servicesApi } from "@/lib/api";
import { getCategoryImage } from "@/lib/category-image";
import { formatCurrency } from "@/lib/utils";

interface PublicService {
  _id?: string;
  id?: string;
  title?: string;
  description?: string;
  basePrice?: number;
  category?: string;
  image?: string;
  technicianName?: string;
  serviceMode?: string;
  serviceArea?: string;
  estimatedDuration?: string;
  approvalStatus?: string;
  isAvailable?: boolean;
}

interface FeaturedService {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  technicianName?: string;
  serviceMode?: string;
  serviceArea?: string;
  estimatedDuration?: string;
}

const VISIT_LABELS: Record<string, string> = {
  doorstep: "Doorstep Visit",
  workshop: "Shop Drop-off",
  both: "Doorstep or Workshop",
};

function toFeaturedService(service: PublicService): FeaturedService | null {
  const id = service._id || service.id;
  if (!id || !service.title || !service.basePrice) return null;

  return {
    id,
    title: service.title,
    description: service.description || "Verified repair service.",
    price: service.basePrice,
    category: service.category || "Repair",
    image: service.image,
    technicianName: service.technicianName,
    serviceMode: service.serviceMode,
    serviceArea: service.serviceArea,
    estimatedDuration: service.estimatedDuration,
  };
}

export function FeaturedServices() {
  const [services, setServices] = useState<FeaturedService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // The public endpoint already filters to approved + available services.
      // Request the six newest records using the existing sort/limit support.
      const res = await servicesApi.public({
        limit: 6,
        sortBy: "createdAt",
        sortOrder: "desc",
      });

      const records = (res.data || []) as PublicService[];
      const mapped = records
        // Defensive filter: never render a pending/rejected or unavailable service
        // even if the backend contract changes in the future.
        .filter((s) => s.approvalStatus === "approved" && s.isAvailable !== false)
        .map(toFeaturedService)
        .filter((s): s is FeaturedService => s !== null)
        .slice(0, 6);

      setServices(mapped);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unable to load featured services.";
      setError(message);
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-busy="true" aria-live="polite">
        {Array.from({ length: 6 }).map((_, index) => (
          <CardContainer key={index} className="p-0 overflow-hidden">
            <Skeleton className="h-40 w-full rounded-none" />
            <div className="p-6 space-y-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-4/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-12 w-full" />
            </div>
          </CardContainer>
        ))}
        <span className="sr-only">Loading featured services</span>
      </div>
    );
  }

  if (error) {
    return (
      <CardContainer className="p-8 text-center" role="alert">
        <h3 className="font-heading text-lg font-semibold">Featured services are temporarily unavailable</h3>
        <p className="mt-2 text-sm text-[#737373]">{error}</p>
        <Button type="button" className="mt-4 bg-[#F26A36] hover:bg-[#aa3700]" onClick={loadServices}>
          Retry
        </Button>
      </CardContainer>
    );
  }

  if (services.length === 0) {
    return (
      <CardContainer className="p-2">
        <EmptyState
          title="No approved services yet"
          description="New repair services appear here as soon as an administrator approves them. Browse the full catalog in the meantime."
          actionLabel="Browse Services"
          actionHref="/services"
        />
      </CardContainer>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => {
        const fallbackImage = getCategoryImage(service.category);
        const hasRemoteImage = Boolean(service.image && /^https?:\/\//.test(service.image) && !failedImages[service.id]);
        const visitLabel = VISIT_LABELS[service.serviceMode || ""] || "Service Visit";

        return (
          <CardContainer key={service.id} className="p-0 overflow-hidden flex flex-col group">
            <div className="relative h-40 bg-[#F6F3F2] overflow-hidden">
              {hasRemoteImage ? (
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  onError={() => setFailedImages((current) => ({ ...current, [service.id]: true }))}
                />
              ) : (
                <Image
                  src={fallbackImage}
                  alt={`${service.category} repair service`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              )}
              <div className="absolute top-3 left-3">
                <Badge variant="secondary" className="bg-white/95 text-[#F26A36] font-mono text-xs shadow-sm">
                  {service.category}
                </Badge>
              </div>
              <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 font-mono text-[10px] text-[#55595F] shadow-sm">
                📍 {visitLabel}
              </span>
            </div>

            <div className="p-6 flex-1 flex flex-col">
              <div className="flex-1 space-y-4">
                <h3 className="font-heading text-lg font-bold tracking-tight leading-tight line-clamp-2">{service.title}</h3>
                <p className="text-xs sm:text-sm text-[#737373] leading-relaxed line-clamp-3">{service.description}</p>

                <div className="p-3 rounded-lg bg-[#F7F7F8] border border-[#E7E7E9] flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white border border-[#E7E7E9] flex items-center justify-center text-xs font-semibold text-[#F26A36]">
                    {(service.technicianName || "T").charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold truncate">{service.technicianName || "Verified Technician"}</div>
                    <div className="font-mono text-xs text-[#737373]">
                      {service.estimatedDuration || "Certified professional"}
                      {service.serviceArea ? ` • ${service.serviceArea}` : ""}
                    </div>
                  </div>
                  <span className="text-emerald-600 text-lg" aria-label="Verified technician">✔️</span>
                </div>
              </div>

              <div className="pt-6 mt-6 flex items-center justify-between border-t border-[#E7E7E9]">
                <div>
                  <span className="font-mono text-xs text-[#737373] block">Starting from</span>
                  <span className="font-heading text-2xl font-bold tracking-tight">{formatCurrency(service.price)}</span>
                </div>
                <Button asChild size="sm" className="rounded-lg bg-[#F26A36] hover:bg-[#aa3700] text-white font-semibold">
                  <Link href={`/services/${service.id}`}>View Details &amp; Book</Link>
                </Button>
              </div>
            </div>
          </CardContainer>
        );
      })}
    </div>
  );
}
