"use client";

import { useState } from "react";
import { CardContainer } from "@/components/ui/card-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { servicesApi } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Page() {
  const { data: session } = useSession();
  const token = (session?.user as any)?.id || null;
  const router = useRouter();
  const [form, setForm] = useState({ title: "", category: "Refrigerator", description: "", basePrice: 100, image: "https://example.com/service.jpg", serviceArea: "San Francisco", serviceMode: "doorstep" as const });

  const handleCreate = async () => {
    if (!token) {
      toast.error("Please sign in as technician");
      return;
    }
    try {
      await servicesApi.create(token, {
        title: form.title,
        category: form.category,
        description: form.description,
        basePrice: Number(form.basePrice),
        image: form.image,
        serviceArea: form.serviceArea,
        serviceMode: form.serviceMode,
      });
      toast.success("Service created with pending approval — redirecting to My Services");
      router.push("/dashboard/technician/my-services");
    } catch (err: any) {
      toast.error(err.message || "Failed to create service");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading">Add Custom Service</h1>
        <p className="text-sm text-[#55595F] mt-1">Create new service with pending approval workflow — backend POST /api/services (technician only, pending approval per spec)</p>
      </div>
      <CardContainer className="p-6">
        <div className="grid md:grid-cols-2 gap-4">
          <Input placeholder="Title min 3 chars" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="border rounded px-3 py-2 text-sm">
            {["Smartphone", "Laptop & PC", "Air Conditioner", "Refrigerator", "Television", "Washing Machine", "Electrical Appliances"].map(c => <option key={c}>{c}</option>)}
          </select>
          <Input placeholder="Base Price positive" type="number" value={form.basePrice} onChange={(e) => setForm({ ...form, basePrice: Number(e.target.value) })} />
          <Input placeholder="Image URL (ImgBB)" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
          <Input placeholder="Service Area" value={form.serviceArea} onChange={(e) => setForm({ ...form, serviceArea: e.target.value })} />
          <select value={form.serviceMode} onChange={(e) => setForm({ ...form, serviceMode: e.target.value as any })} className="border rounded px-3 py-2 text-sm">
            <option value="doorstep">Doorstep</option>
            <option value="workshop">Workshop</option>
            <option value="both">Both</option>
          </select>
          <Textarea placeholder="Description min 10 chars, max 2000" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="md:col-span-2" />
        </div>
        <Button className="mt-4 bg-[#F26A36]" onClick={handleCreate}>Create Service — Pending Approval</Button>
        <div className="mt-4 text-[10px] font-mono text-[#8C9098]">Backend rule: newly created service must have pending approval status, only approved & available publicly visible, when technician edits, approval returns to pending, technicians manage only own services.</div>
      </CardContainer>
    </div>
  );
}
