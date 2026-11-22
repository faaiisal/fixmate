"use client";

import { useState } from "react";
import { CardContainer } from "@/components/ui/card-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { servicesApi, uploadApi } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Page() {
  const { data: session } = useSession();
  const token = (session?.user as any)?.id || null;
  const router = useRouter();
  const [form, setForm] = useState({ title: "", category: "Refrigerator", description: "", basePrice: 100, image: "", serviceArea: "San Francisco", serviceMode: "doorstep" as const });
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large. Max 5MB allowed");
      return;
    }
    if (!["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      toast.error("Invalid file type. Only JPEG, PNG, WebP, GIF allowed");
      return;
    }
    // Local preview
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    if (!token) {
      toast.error("Please sign in as technician");
      return;
    }

    setUploading(true);
    try {
      const res = await uploadApi.image(token, file);
      const url = (res.data as any)?.url || (res.data as any)?.displayUrl;
      if (url) {
        setForm({ ...form, image: url });
        toast.success("Image uploaded to ImgBB");
      } else {
        toast.error("Upload failed - no URL returned");
      }
    } catch (err: any) {
      // Preserve existing Unsplash working - if ImgBB key not configured, keep preview and allow URL fallback
      toast.error(err.message || "Upload failed - you can still paste ImgBB URL manually");
    } finally {
      setUploading(false);
    }
  };

  const handleCreate = async () => {
    if (!token) {
      toast.error("Please sign in as technician");
      return;
    }
    if (!form.image) {
      toast.error("Please upload a service image via ImgBB");
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
          <Input placeholder="Service Area" value={form.serviceArea} onChange={(e) => setForm({ ...form, serviceArea: e.target.value })} />
          <select value={form.serviceMode} onChange={(e) => setForm({ ...form, serviceMode: e.target.value as any })} className="border rounded px-3 py-2 text-sm">
            <option value="doorstep">Doorstep (Home Visit)</option>
            <option value="workshop">Workshop (Shop Drop-off)</option>
            <option value="both">Both</option>
          </select>
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-mono text-[#8C9098]">SERVICE IMAGE — Upload via ImgBB (file input, not URL field)</label>
            <div className="flex gap-2 items-center">
              <Input type="file" accept="image/jpeg,image/jpg,image/png,image/webp,image/gif" onChange={handleFileUpload} className="flex-1" />
              {uploading && <span className="text-xs text-[#F26A36]">Uploading...</span>}
            </div>
            {/* Preview + existing Unsplash working preserved */}
            {(preview || form.image) && (
              <div className="mt-2 flex gap-4 items-start">
                <div className="w-32 h-24 bg-[#F6F3F2] rounded border overflow-hidden flex items-center justify-center">
                  <img
                    src={form.image || preview || ""}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (preview && target.src !== preview) {
                        target.src = preview;
                      }
                    }}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-mono text-[#8C9098] break-all">URL: {form.image || "Uploading..."}</p>
                  <p className="text-[10px] text-[#55595F] mt-1">ImgBB URL saved to MongoDB. Existing Unsplash images keep working. Max 5MB, JPEG/PNG/WebP/GIF, magic number validated backend.</p>
                  <Input
                    placeholder="Or paste ImgBB URL manually (https://i.ibb.co/...)"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    className="mt-2 text-xs"
                  />
                </div>
              </div>
            )}
          </div>
          <Textarea placeholder="Description min 10 chars, max 2000" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="md:col-span-2" />
        </div>
        <Button className="mt-4 bg-[#F26A36]" onClick={handleCreate} disabled={uploading || !form.image}>Create Service — Pending Approval</Button>
        <div className="mt-4 text-[10px] font-mono text-[#8C9098]">Backend rule: newly created service must have pending approval status, only approved & available publicly visible, when technician edits, approval returns to pending, technicians manage only own services. Image uploaded via ImgBB file input.</div>
      </CardContainer>
    </div>
  );
}
