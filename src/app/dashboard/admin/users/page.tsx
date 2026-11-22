"use client";

import { useEffect, useState } from "react";
import { CardContainer } from "@/components/ui/card-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usersApi, useAuthToken } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";

export default function Page() {
  const { data: session } = useSession();
  const token = useAuthToken(session);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [stats, setStats] = useState<any>(null);

  const fetchUsers = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const params: Record<string, any> = { limit: 50 };
      if (search) params.search = search;
      if (roleFilter !== "All") params.role = roleFilter;
      const res = await usersApi.list(token, params);
      setUsers(res.data as any[] || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/users/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(r => r.json());
      if (res.success) setStats(res.data);
    } catch {}
  };

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [token, roleFilter]);

  useEffect(() => {
    const debounce = setTimeout(fetchUsers, 400);
    return () => clearTimeout(debounce);
  }, [search]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!token) return;
    if (!confirm(`Change role to ${newRole}?`)) return;
    try {
      await usersApi.updateRole(token, userId, newRole);
      toast.success(`Role updated to ${newRole}`);
      fetchUsers();
      fetchStats();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading">User Management</h1>
        <p className="text-sm text-[#55595F] mt-1">Manage customers, technicians, admins - role based — backend /api/users (admin only)</p>
        {stats && (
          <div className="mt-3 flex gap-2 text-xs">
            <span className="px-2 py-1 rounded-full bg-white border">Total: {stats.total}</span>
            <span className="px-2 py-1 rounded-full bg-[#ECFDF5] border">Customers: {stats.customers}</span>
            <span className="px-2 py-1 rounded-full bg-[#E6FCFD] border">Technicians: {stats.technicians}</span>
            <span className="px-2 py-1 rounded-full bg-[#FFF1EC] border">Admins: {stats.admins}</span>
          </div>
        )}
      </div>

      <CardContainer className="p-4">
        <div className="flex gap-2">
          <Input placeholder="Search name or email" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="border rounded px-3 py-2 text-sm">
            <option>All</option>
            <option>customer</option>
            <option>technician</option>
            <option>admin</option>
          </select>
        </div>
      </CardContainer>

      {loading ? (
        <CardContainer className="p-8 text-center text-sm text-[#8C9098]">Loading users from backend...</CardContainer>
      ) : (
        <div className="space-y-2">
          {users.map((u: any) => (
            <CardContainer key={u._id} className="p-4 flex items-center justify-between">
              <div>
                <div className="font-medium">{u.name} <span className="text-xs font-mono text-[#8C9098]">• {u._id.slice(-6)}</span></div>
                <div className="text-xs text-[#55595F]">{u.email} • {u.phone || "No phone"} • Role: {u.role}</div>
                <div className="text-[10px] font-mono text-[#8C9098]">Created: {new Date(u.createdAt).toLocaleDateString()}</div>
              </div>
              <div className="flex gap-1">
                {["customer", "technician", "admin"].map(role => (
                  <Button key={role} variant={u.role === role ? "default" : "outline"} size="sm" className={`text-[10px] h-7 px-2 rounded-full ${u.role === role ? "bg-[#F26A36]" : ""}`} onClick={() => handleRoleChange(u._id, role)}>
                    {role}
                  </Button>
                ))}
              </div>
            </CardContainer>
          ))}
        </div>
      )}
    </div>
  );
}
