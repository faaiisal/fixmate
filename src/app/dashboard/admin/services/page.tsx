"use client";

import { useEffect, useState } from "react";
import { CardContainer } from "@/components/ui/card-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { servicesApi, useAuthToken } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";

export default function Page() {
  const { data: session } = useSession();
  const token = useAuthToken(session);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");

  const fetchServices = async () => {
    if (!token) return;
    try {
      setLoading(true);
      let res: any;
      if (filter === "pending") {
        res = await servicesApi.adminPending(token, { limit: 50 });
      } else if (filter === "approved") {
        res = await servicesApi.adminAll(token, { approvalStatus: "approved", limit: 50 });
      } else if (filter === "rejected") {
        res = await servicesApi.adminAll(token, { approvalStatus: "rejected", limit: 50 });
      } else {
        res = await servicesApi.adminAll(token, { limit: 50 });
      }
      setServices(res.data as any[] || []);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, [token, filter]);

  const handleApprove = async (id: string, status: "approved" | "rejected") => {
    if (!token) return;
    try {
      await servicesApi.approve(token, id, status);
      toast.success(`Service ${status}`);
      fetchServices();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading">Service Approvals</h1>
          <p className="text-sm text-[#55595F] mt-1">Approve/reject pending services, admin only — backend /api/services/admin/pending & /approval</p>
        </div>
        <div className="flex gap-2">
          {["pending", "approved", "rejected", "All"].map(s => (
            <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1 rounded-full text-xs border ${filter === s ? "bg-[#FFF1EC] border-[#FFD6C2] text-[#F26A36]" : "bg-white border-[#E5E0DF]"}`}>{s}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <CardContainer className="p-8 text-center text-sm text-[#8C9098]">Loading services...</CardContainer>
      ) : services.length === 0 ? (
        <CardContainer className="p-8 text-center text-[#8C9098]">No {filter} services</CardContainer>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {services.map((s: any) => (
            <CardContainer key={s._id} className="p-5">
              <div className="flex justify-between mb-2">
                <span className="text-xs font-mono px-2 py-1 rounded-full bg-[#F6F3F2] border">{s.approvalStatus}</span>
                <span className="text-xs">{s.category}</span>
              </div>
              <h4 className="font-semibold line-clamp-1">{s.title}</h4>
              <p className="text-sm text-[#55595F] line-clamp-2 mt-1">{s.description}</p>
              <div className="mt-2 text-xs text-[#8C9098]">Tech: {s.technicianId?.toString().slice(-6)} • {s.serviceArea} • {formatCurrency(s.basePrice)}</div>
              <div className="mt-3 flex gap-2">
                {s.approvalStatus === "pending" && (
                  <>
                    <Button size="sm" className="bg-[#10B981] text-xs" onClick={() => handleApprove(s._id, "approved")}>Approve</Button>
                    <Button variant="outline" size="sm" className="text-xs" onClick={() => handleApprove(s._id, "rejected")}>Reject</Button>
                  </>
                )}
                {s.approvalStatus !== "pending" && (
                  <>
                    <Button size="sm" variant="outline" className="text-xs" onClick={() => handleApprove(s._id, "approved")}>Mark Approved</Button>
                    <Button size="sm" variant="outline" className="text-xs" onClick={() => handleApprove(s._id, "rejected")}>Mark Rejected</Button>
                  </>
                )}
              </div>
            </CardContainer>
          ))}
        </div>
      )}
    </div>
  );
}
