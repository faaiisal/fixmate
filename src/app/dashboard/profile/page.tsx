"use client";

import { useEffect, useState } from "react";
import { CardContainer } from "@/components/ui/card-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { usersApi } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";

export default function Page() {
  const { data: session } = useSession();
  const token = (session?.user as any)?.id || null;
  const sessionUser = session?.user as any;
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", phone: "", address: "", bio: "", profileImage: "" });

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
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, [token]);

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
          <div>
            <label className="text-xs font-mono text-[#8C9098]">PROFILE IMAGE URL (ImgBB)</label>
            <Input value={form.profileImage} onChange={(e) => setForm({ ...form, profileImage: e.target.value })} className="mt-1" placeholder="https://i.ibb.co/.../image.jpg" />
          </div>
          <Button className="bg-[#F26A36]" onClick={handleUpdate}>Update Profile</Button>
          <div className="text-[10px] font-mono text-[#8C9098]">Backend: PUT /api/users/profile — preserves BetterAuth session, updates user collection with address, bio, profileImage, phone, name</div>
        </div>
      </CardContainer>

      <CardContainer className="p-5">
        <h3 className="font-semibold mb-2">Current Session Info</h3>
        <pre className="text-xs bg-[#F6F3F2] p-3 rounded overflow-auto">{JSON.stringify({ sessionUser, token, profile: profile ? { _id: profile._id, name: profile.name, email: profile.email, role: profile.role, phone: profile.phone, address: profile.address } : null }, null, 2)}</pre>
      </CardContainer>
    </div>
  );
}
