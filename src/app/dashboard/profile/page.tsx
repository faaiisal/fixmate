"use client";

import { useEffect, useState } from "react";
import { CardContainer } from "@/components/ui/card-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { usersApi, uploadApi } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";

export default function Page() {
  const { data: session } = useSession();
  const token = (session?.user as any)?.id || null;
  const sessionUser = session?.user as any;
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", phone: "", address: "", bio: "", profileImage: "" });
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await usersApi.profile(token);
      const data = res.data as any;
      setProfile(data);
      setForm({
        name: data.name || "",
        phone: data.phone || "",
        address: data.address || "",
        bio: data.bio || "",
        profileImage: data.profileImage || data.image || "",
      });
      if (data.profileImage || data.image) {
        setPreview(data.profileImage || data.image);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, [token]);

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
        setForm({ ...form, profileImage: url });
        toast.success("Profile image uploaded to ImgBB");
      }
    } catch (err: any) {
      toast.error(err.message || "Upload failed - paste URL manually");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async () => {
    if (!token) return;
    try {
      const res = await usersApi.updateProfile(token, form);
      toast.success("Profile updated");
      setProfile(res.data);
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    }
  };

  if (loading) {
    return <CardContainer className="p-8 text-center text-sm text-[#8C9098]">Loading profile from backend /api/users/profile...</CardContainer>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading">Profile & Settings</h1>
        <p className="text-sm text-[#55595F] mt-1">Manage profile, security, ledger credentials — backend integrated</p>
      </div>

      <CardContainer className="p-6">
        <div className="space-y-4 max-w-2xl">
          <div>
            <label className="text-xs font-mono text-[#8C9098]">FULL NAME</label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1" />
          </div>
          <div>
            <label className="text-xs font-mono text-[#8C9098]">EMAIL (from BetterAuth, not editable via this endpoint)</label>
            <Input value={profile?.email || sessionUser?.email || ""} disabled className="mt-1" />
          </div>
          <div>
            <label className="text-xs font-mono text-[#8C9098]">ROLE</label>
            <Input value={profile?.role || sessionUser?.role || ""} disabled className="mt-1" />
          </div>
          <div>
            <label className="text-xs font-mono text-[#8C9098]">PHONE</label>
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1" />
          </div>
          <div>
            <label className="text-xs font-mono text-[#8C9098]">ADDRESS</label>
            <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="mt-1" />
          </div>
          <div>
            <label className="text-xs font-mono text-[#8C9098]">BIO</label>
            <Textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="mt-1" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono text-[#8C9098]">PROFILE IMAGE — Upload via ImgBB (file input)</label>
            <div className="flex gap-2 items-center">
              <Input type="file" accept="image/jpeg,image/jpg,image/png,image/webp,image/gif" onChange={handleFileUpload} className="flex-1" />
              {uploading && <span className="text-xs text-[#F26A36]">Uploading...</span>}
            </div>
            {(preview || form.profileImage) && (
              <div className="mt-2 flex gap-4 items-start">
                <div className="w-24 h-24 bg-[#F6F3F2] rounded-full border overflow-hidden flex items-center justify-center">
                  <img src={form.profileImage || preview || ""} alt="Avatar preview" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-mono text-[#8C9098] break-all">URL: {form.profileImage || "Uploading..."}</p>
                  <Input placeholder="Or paste ImgBB URL https://i.ibb.co/..." value={form.profileImage} onChange={(e) => setForm({ ...form, profileImage: e.target.value })} className="mt-2 text-xs" />
                </div>
              </div>
            )}
          </div>
          <Button className="bg-[#F26A36]" onClick={handleUpdate} disabled={uploading}>Update Profile</Button>
          <div className="text-[10px] font-mono text-[#8C9098]">Backend: PUT /api/users/profile — preserves BetterAuth session, updates user collection with address, bio, profileImage, phone, name. Image upload via ImgBB file input.</div>
        </div>
      </CardContainer>

      <CardContainer className="p-5">
        <h3 className="font-semibold mb-2">Current Session Info</h3>
        <div className="text-xs bg-[#F6F3F2] p-3 rounded">
          <div className="space-y-1">
            <div>
              <span className="font-mono text-[#8C9098]">Email:</span>{" "}
              {sessionUser?.email || "N/A"}
            </div>
            <div>
              <span className="font-mono text-[#8C9098]">Role:</span>{" "}
              {sessionUser?.role || profile?.role || "N/A"}
            </div>
            <div>
              <span className="font-mono text-[#8C9098]">Status:</span> Authenticated via
              BetterAuth session cookie
            </div>
          </div>
        </div>
      </CardContainer>
    </div>
  );
}
