"use client";

import { useEffect, useState } from "react";
import { CardContainer } from "@/components/ui/card-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { servicesApi, uploadApi } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";

export default function Page() {
  const { data: session } = useSession();
  const token = (session?.user as any)?.id || null;
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: "", category: "Refrigerator", description: "", basePrice: 100, image: "", serviceArea: "San Francisco", serviceMode: "doorstep" as const });
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const fetchMyServices = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await servicesApi.myServices(token, { limit: 50 });
      setServices(res.data as any[] || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch my services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMyServices(); }, [token]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large. Max 5MB");
      return;
    }
    if (!["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      toast.error("Invalid file type");
      return;
    }
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    if (!token) {
      toast.error("Please sign in");
      return;
    }
    setUploading(true);
    try {
      const res = await uploadApi.image(token, file);
      const url = (res.data as any)?.url || (res.data as any)?.displayUrl;
      if (url) {
        setForm({ ...form, image: url });
        toast.success("Image uploaded to ImgBB");
      }
    } catch (err: any) {
      toast.error(err.message || "Upload failed - paste URL manually");
    } finally {
      setUploading(false);
    }
  };

  const handleCreate = async () => {
    if (!token) return;
    if (!form.image) {
      toast.error("Please upload service image");
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
      toast.success("Service created with pending approval");
      setShowCreate(false);
      setForm({ title: "", category: "Refrigerator", description: "", basePrice: 100, image: "", serviceArea: "San Francisco", serviceMode: "doorstep" });
      setPreview(null);
      fetchMyServices();
    } catch (err: any) {
      toast.error(err.message || "Failed to create service");
    }
  };

  const handleToggle = async (id: string) => {
    if (!token) return;
    try {
      await servicesApi.toggleAvailability(token, id);
      toast.success("Availability toggled");
      fetchMyServices();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    if (!confirm("Delete this service?")) return;
    try {
      await servicesApi.delete(token, id);
      toast.success("Service deleted");
      fetchMyServices();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading">My Services</h1>
          <p className="text-sm text-[#55595F] mt-1">Manage availability toggle, edit resets approval to pending — integrated with backend /api/services/my-services</p>
        </div>
        <Button className="bg-[#F26A36]" onClick={() => setShowCreate(!showCreate)}>{showCreate ? "Cancel" : "Add Service"}</Button>
      </div>

      {showCreate && (
        <CardContainer className="p-6">
          <h3 className="font-semibold mb-4">Create New Service (will be pending approval)</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="border rounded px-3 py-2 text-sm">
              {["Smartphone", "Laptop & PC", "Air Conditioner", "Refrigerator", "Television", "Washing Machine", "Electrical Appliances"].map(c => <option key={c}>{c}</option>)}
            </select>
            <Input placeholder="Base Price" type="number" value={form.basePrice} onChange={(e) => setForm({ ...form, basePrice: Number(e.target.value) })} />
            <Input placeholder="Service Area" value={form.serviceArea} onChange={(e) => setForm({ ...form, serviceArea: e.target.value })} />
            <select value={form.serviceMode} onChange={(e) => setForm({ ...form, serviceMode: e.target.value as any })} className="border rounded px-3 py-2 text-sm">
              <option value="doorstep">Doorstep (Home Visit)</option>
              <option value="workshop">Workshop (Shop Drop-off)</option>
              <option value="both">Both</option>
            </select>
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-mono text-[#8C9098]">SERVICE IMAGE — File upload via ImgBB</label>
              <div className="flex gap-2 items-center">
                <Input type="file" accept="image/jpeg,image/jpg,image/png,image/webp,image/gif" onChange={handleFileUpload} className="flex-1" />
                {uploading && <span className="text-xs text-[#F26A36]">Uploading...</span>}
              </div>
              {(preview || form.image) && (
                <div className="mt-2 flex gap-4 items-start">
                  <div className="w-32 h-24 bg-[#F6F3F2] rounded border overflow-hidden">
                    <img src={form.image || preview || ""} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-mono text-[#8C9098] break-all">URL: {form.image || "Uploading..."}</p>
                    <Input placeholder="Or paste ImgBB URL https://i.ibb.co/..." value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="mt-2 text-xs" />
                  </div>
                </div>
              )}
            </div>
            <Textarea placeholder="Description min 10 chars" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="md:col-span-2" />
          </div>
          <Button className="mt-4 bg-[#F26A36]" onClick={handleCreate} disabled={uploading || !form.image}>Create Service</Button>
        </CardContainer>
      )}

      {loading ? (
        <CardContainer className="p-8 text-center text-sm text-[#8C9098]">Loading your services from backend...</CardContainer>
      ) : services.length === 0 ? (
        <CardContainer className="p-8 text-center text-[#8C9098]">No services yet. Create your first service — it will be pending approval per backend rules.</CardContainer>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s: any) => (
            <CardContainer key={s._id} className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono px-2 py-1 rounded-full bg-[#F6F3F2] border">{s.approvalStatus}</span>
                <span className={`text-xs px-2 py-1 rounded-full border ${s.isAvailable ? "bg-[#ECFDF5] border-[#A7F3D0] text-[#059669]" : "bg-[#FEF2F2] border-[#FECACA] text-[#DC2626]"}`}>
                  {s.isAvailable ? "Available" : "Unavailable"}
                </span>
              </div>
              {/* Image preview with reliable fallback preserving Unsplash */}
              <div className="w-full h-32 bg-[#F6F3F2] rounded border overflow-hidden mb-3 flex items-center justify-center">
                {s.image ? (
                  <img src={s.image} alt={s.title} className="w-full h-full object-cover" onError={(e) => {(e.target as HTMLImageElement).style.display="none"}} />
                ) : (
                  <span className="text-xs text-[#8C9098]">No image</span>
                )}
              </div>
              <h4 className="font-semibold line-clamp-1">{s.title}</h4>
              <p className="text-sm text-[#55595F] line-clamp-2 mt-1">{s.description}</p>
              <div className="mt-2 text-xs font-mono text-[#8C9098]">{s.category} • {s.serviceArea}</div>
              <div className="mt-3 font-bold">{formatCurrency(s.basePrice)}</div>
              <div className="mt-3 flex gap-2">
                <Button variant="outline" size="sm" className="text-xs" onClick={() => handleToggle(s._id)}>Toggle Avail</Button>
                <Button variant="outline" size="sm" className="text-xs text-[#ba1a1a]" onClick={() => handleDelete(s._id)}>Delete</Button>
              </div>
              <div className="mt-2 text-[10px] font-mono text-[#8C9098]">ID: {s._id.slice(-8)} • Created: {new Date(s.createdAt).toLocaleDateString()}</div>
            </CardContainer>
          ))}
        </div>
      )}
    </div>
  );
}
