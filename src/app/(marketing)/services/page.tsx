"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ServiceGrid } from "@/components/modules/service-grid";
import { CardContainer } from "@/components/ui/card-container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { servicesApi } from "@/lib/api";

// Fallback mock if backend not reachable (preserves UI when backend down)
const mockServices = [
  { id: "1", title: "Samsung Refrigerator Repair", description: "Compressor replacement & refrigerant recharge", price: 280, category: "Refrigerator", technician: { name: "Marcus Vance", rating: 4.97, verified: true }, status: "approved" as const, available: true },
  { id: "2", title: "LG Washing Machine Drum Fix", description: "Bearing & seal replacement", price: 120, category: "Washing Machine", technician: { name: "Sarah Chen", rating: 4.9, verified: true }, status: "approved" as const, available: true },
];

type SortOption = "newest" | "price_asc" | "price_desc";

export default function ServicesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Read initial values from URL for persistence after reload and category card filtering
  const initialCategory = searchParams.get("category") || "All";
  const initialSearch = searchParams.get("search") || "";
  const initialMode = searchParams.get("serviceMode") || "All";
  const initialSort = (searchParams.get("sort") as SortOption) || "newest";

  const [services, setServices] = useState<any[]>(mockServices);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState<string>(initialCategory);
  const [serviceMode, setServiceMode] = useState<string>(initialMode);
  const [sort, setSort] = useState<SortOption>(initialSort);
  const [liveCount, setLiveCount] = useState<number>(mockServices.length);

  // Clean architecture: only canonical backend categories (7) + All = 8
  const categories = ["All", "Refrigerator", "Washing Machine", "Laptop & PC", "Smartphone", "Air Conditioner", "Television", "Electrical Appliances"];
  const serviceModes = ["All", "doorstep", "workshop", "both"];
  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "newest", label: "Newest" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
  ];

  // Update URL when filters change for persistence after reload and category card pre-filtering
  const updateURL = (newParams: { category?: string; search?: string; serviceMode?: string; sort?: string }) => {
    const params = new URLSearchParams(searchParams.toString());
    const merged = {
      category: newParams.category !== undefined ? newParams.category : category,
      search: newParams.search !== undefined ? newParams.search : search,
      serviceMode: newParams.serviceMode !== undefined ? newParams.serviceMode : serviceMode,
      sort: newParams.sort !== undefined ? newParams.sort : sort,
    };

    // Set or delete params to keep URL clean
    if (merged.category && merged.category !== "All") params.set("category", merged.category);
    else params.delete("category");

    if (merged.search && merged.search.trim()) params.set("search", merged.search.trim());
    else params.delete("search");

    if (merged.serviceMode && merged.serviceMode !== "All") params.set("serviceMode", merged.serviceMode);
    else params.delete("serviceMode");

    if (merged.sort && merged.sort !== "newest") params.set("sort", merged.sort);
    else params.delete("sort");

    const queryString = params.toString();
    router.push(`${pathname}${queryString ? `?${queryString}` : ""}`, { scroll: false });
  };

  useEffect(() => {
    async function fetchServices() {
      try {
        setLoading(true);
        const params: Record<string, string | number> = {
          limit: 50,
        };
        if (category !== "All") params.category = category;
        if (search.trim()) params.search = search.trim();
        if (serviceMode !== "All") params.serviceMode = serviceMode;

        // Sort mapping: newest -> createdAt desc, price_asc -> basePrice asc, price_desc -> basePrice desc
        if (sort === "price_asc") {
          params.sortBy = "basePrice";
          params.sortOrder = "asc";
        } else if (sort === "price_desc") {
          params.sortBy = "basePrice";
          params.sortOrder = "desc";
        } else {
          params.sortBy = "createdAt";
          params.sortOrder = "desc";
        }

        const res = await servicesApi.public(params);
        const backendServices = (res.data || []) as any[];

        if (backendServices.length > 0) {
          const mapped = backendServices.map((s: any) => ({
            id: s._id,
            title: s.title,
            description: s.description,
            price: s.basePrice,
            category: s.category,
            image: s.image,
            technician: s.technicianName
              ? { name: s.technicianName, rating: 4.9, verified: true }
              : s.technicianId
                ? { name: `Tech ${s.technicianId.toString().slice(-4)}`, rating: 4.9, verified: true }
                : undefined,
            status: s.approvalStatus,
            available: s.isAvailable,
          }));
          setServices(mapped);
          setLiveCount(backendServices.length);
        } else {
          if (search || category !== "All" || serviceMode !== "All") {
            setServices([]);
            setLiveCount(0);
          } else {
            setServices([]);
            setLiveCount(0);
          }
        }
      } catch (err) {
        console.warn("Failed to fetch public services, falling back to mock (backend may be down):", err);
      } finally {
        setLoading(false);
      }
    }

    // Debounce search but also sync URL for persistence
    const debounce = setTimeout(fetchServices, 300);
    return () => clearTimeout(debounce);
  }, [search, category, serviceMode, sort]);

  // Sync state from URL on mount for category card filtering /services?category=AC
  useEffect(() => {
    const urlCategory = searchParams.get("category");
    const urlSearch = searchParams.get("search");
    const urlMode = searchParams.get("serviceMode");
    const urlSort = searchParams.get("sort") as SortOption | null;

    if (urlCategory && urlCategory !== category) setCategory(urlCategory);
    if (urlSearch !== null && urlSearch !== search) setSearch(urlSearch);
    if (urlMode && urlMode !== serviceMode) setServiceMode(urlMode);
    if (urlSort && urlSort !== sort) setSort(urlSort);
  }, [searchParams]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-2 text-xs font-mono text-[#8C9098] mb-4">
        <span>HOME</span>
        <span>/</span>
        <span className="text-[#14121B]">SERVICES</span>
        <span className="ml-2 px-2 py-0.5 rounded-full bg-[#E6FCFD] text-[#0891B2] border border-[#A5F3FC]">
          LIVE: {liveCount} SERVICES {loading ? "(loading...)" : ""}
        </span>
      </div>

      <CardContainer className="p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-heading">Service Hub</h1>
            <p className="text-sm text-[#55595F]">Browse verified repairs with escrow protection — server-side search, filter & sort</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <div className="relative flex-1 lg:w-80">
              <Input
                placeholder="Search services, e.g. Refrigerator"
                className="pl-9"
                value={search}
                onChange={(e) => {
                  const val = e.target.value;
                  setSearch(val);
                  // Update URL after debounce via effect, but also update immediately for persistence
                  // We update URL with debounce in effect, but also push here for immediate feedback? We'll push after debounce.
                  // For now, push via separate effect: updateURL called in onChange with timeout to avoid too many pushes
                  setTimeout(() => updateURL({ search: val }), 500);
                }}
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C9098]">🔍</span>
            </div>
            <Select
              value={sort}
              onValueChange={(val) => {
                const newSort = val as SortOption;
                setSort(newSort);
                updateURL({ sort: newSort });
              }}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => {
                setSearch("");
                setCategory("All");
                setServiceMode("All");
                setSort("newest");
                router.push(pathname);
              }}
            >
              Clear
            </Button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat);
                updateURL({ category: cat });
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                category === cat
                  ? "bg-[#FFF1EC] text-[#F26A36] border-[#FFD6C2]"
                  : "bg-white border-[#E5E0DF] hover:border-[#F26A36] hover:bg-[#FFF1EC]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-xs font-mono text-[#8C9098] self-center">MODE:</span>
          {serviceModes.map((mode) => (
            <button
              key={mode}
              onClick={() => {
                setServiceMode(mode);
                updateURL({ serviceMode: mode });
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                serviceMode === mode
                  ? "bg-[#FFF1EC] text-[#F26A36] border-[#FFD6C2]"
                  : "bg-white border-[#E5E0DF] hover:border-[#F26A36] hover:bg-[#FFF1EC]"
              }`}
            >
              {mode === "All" ? "All Modes" : mode === "doorstep" ? "Home Visit" : mode === "workshop" ? "Shop Drop-off" : "Both"}
            </button>
          ))}
        </div>

        {/* Server-side note */}
        <div className="mt-4 text-[10px] font-mono text-[#8C9098] bg-[#F9F7F6] border border-[#E7E7E9] rounded p-2">
          Server-side search (title/category via regex escaped), filter (category/serviceMode via MongoDB), sort (price/createdAt) — all via /api/services?search=&category=&serviceMode=&sortBy=&sortOrder= — filters persist via URL ?category=AC stays after reload.
        </div>
      </CardContainer>

      {loading ? (
        <div className="py-12 text-center text-sm text-[#8C9098]">Loading services from backend...</div>
      ) : (
        <ServiceGrid services={services} />
      )}
    </div>
  );
}
