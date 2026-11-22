"use client";

import { useEffect, useState } from "react";
import { CardContainer } from "@/components/ui/card-container";
import { StatCard } from "@/components/modules/stat-card";
import { servicesApi, bookingsApi, paymentsApi, usersApi, useAuthToken } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { formatCurrency } from "@/lib/utils";

export default function Page() {
  const { data: session } = useSession();
  const token = useAuthToken(session);
  const [stats, setStats] = useState<any>({ users: null, services: 0, bookings: 0, payments: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    async function fetchStats() {
      try {
        setLoading(true);
        const [usersRes, servicesRes, bookingsRes, paymentsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/users/stats`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).catch(() => null),
          servicesApi.adminAll(token!, { limit: 1 }).catch(() => ({ meta: { total: 0 } })),
          bookingsApi.adminAll(token!, { limit: 1 }).catch(() => ({ meta: { total: 0 } })),
          paymentsApi.adminTransactions(token!, { limit: 1 }).catch(() => ({ data: { stats: { totalAmount: 0 } } })),
        ]);

        setStats({
          users: usersRes?.data || null,
          services: (servicesRes as any)?.meta?.total || 0,
          bookings: (bookingsRes as any)?.meta?.total || 0,
          payments: (paymentsRes as any)?.data?.stats || (paymentsRes as any)?.stats || null,
        });
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [token]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading">Admin Operations</h1>
        <p className="text-sm text-[#55595F] mt-1">System Operations & Platform Governance — backend integrated: /api/users/stats, /api/services/admin/all, /api/bookings, /api/payments/admin/transactions • API: {process.env.NEXT_PUBLIC_API_URL}</p>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={loading ? "..." : String(stats.users?.total || 0)} subtitle={`${stats.users?.customers || 0} customers, ${stats.users?.technicians || 0} techs`} trend="Live" trendType="positive" />
        <StatCard title="Services" value={loading ? "..." : String(stats.services)} subtitle="Total" trend="Approved + Pending" trendType="positive" />
        <StatCard title="Bookings" value={loading ? "..." : String(stats.bookings)} subtitle="All statuses" trend="Live" trendType="positive" />
        <StatCard title="Payments Volume" value={loading ? "..." : formatCurrency(stats.payments?.totalAmount || 0)} subtitle="Paid total" trend="GSV" trendType="positive" />
      </div>

      <CardContainer className="p-6">
        <h3 className="font-semibold mb-3">Platform Governance — Backend Integrated</h3>
        <div className="space-y-2 text-sm text-[#55595F]">
          <div>• Users: List and manage roles via /api/users (admin only) — prevents admin self-registration via role guard</div>
          <div>• Services: Approve/reject pending via /api/services/admin/pending and /:id/approval — new services pending per spec</div>
          <div>• Bookings: System-wide overview via /api/bookings with filters — admin can manage all bookings</div>
          <div>• Transactions: Escrow settlement monitor via /api/payments/admin/transactions — total paid volume</div>
          <div>• Auth: BetterAuth session verification via token & cookie, roleMiddleware enforces customer/technician/admin</div>
          <div>• Security: CORS restricted to {process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}, centralized error handling, ObjectId validation, ownership checks, duplicate prevention via unique indexes</div>
        </div>
      </CardContainer>
    </div>
  );
}
