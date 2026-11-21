/**
 * FixMate Frontend API Service Layer
 * Reusable layer to connect existing frontend UI to Express backend
 * Preserves all UI, Tailwind, layouts, navigation, forms
 * Uses NEXT_PUBLIC_API_URL env var (defaults to http://localhost:5000/api)
 * Auth: Uses BetterAuth session user.id as Bearer token for dev (backend supports both real session token and userId fallback)
 * In production, should use real session token from BetterAuth cookie (backend supports cookie parsing)
 */

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  error?: unknown;
}

export interface ApiError {
  message: string;
  status: number;
  error?: unknown;
}

async function getAuthToken(): Promise<string | null> {
  // Try to get token from BetterAuth session
  // In browser, we can try to get session via authClient, but for simplicity we use localStorage or session object's user id
  // The backend authMiddleware supports Bearer <userId> as dev fallback (ObjectId string)
  // We will try to get user id from BetterAuth's session storage
  if (typeof window === "undefined") return null;

  try {
    // BetterAuth stores session in localStorage or cookie? We attempt to read from authClient
    // For now, we will rely on caller passing token explicitly via useSession hook
    return null;
  } catch {
    return null;
  }
}

export async function apiFetch<T>(
  path: string,
  options: {
    method?: string;
    body?: unknown;
    token?: string | null;
    headers?: Record<string, string>;
    cache?: RequestCache;
  } = {}
): Promise<ApiResponse<T>> {
  const { method = "GET", body, token, headers = {}, cache } = options;

  const url = path.startsWith("http") ? path : `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;

  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (token) {
    finalHeaders["Authorization"] = `Bearer ${token}`;
  }

  const fetchOptions: RequestInit = {
    method,
    headers: finalHeaders,
    credentials: "include", // Allow cookies for BetterAuth session
    cache,
  };

  if (body && method !== "GET") {
    fetchOptions.body = JSON.stringify(body);
  }

  const response = await fetch(url, fetchOptions);

  // Handle non-JSON responses gracefully
  let data: ApiResponse<T>;
  try {
    data = await response.json();
  } catch {
    throw {
      message: `Failed to parse response from ${url}: ${response.statusText}`,
      status: response.status,
    } as ApiError;
  }

  if (!response.ok) {
    throw {
      message: data.message || `API error ${response.status}`,
      status: response.status,
      error: data.error || data,
    } as ApiError;
  }

  return data;
}

// Helper to get token from session hook
export function useAuthToken(session: any): string | null {
  // session?.user?.id is ObjectId hex string from BetterAuth — backend dev fallback accepts this as Bearer token
  // In real production, we would need session token, but for integration we use user id
  return session?.user?.id || session?.user?._id || null;
}

// === Users API ===
export const usersApi = {
  me: (token: string) => apiFetch(`/users/me`, { token }),
  profile: (token: string) => apiFetch(`/users/profile`, { token }),
  updateProfile: (token: string, data: any) =>
    apiFetch(`/users/profile`, { method: "PUT", body: data, token }),
  list: (token: string, params?: Record<string, string | number>) => {
    const qs = params ? `?${new URLSearchParams(params as any).toString()}` : "";
    return apiFetch(`/users${qs}`, { token });
  },
  updateRole: (token: string, userId: string, role: string) =>
    apiFetch(`/users/${userId}/role`, { method: "PATCH", body: { role }, token }),
};

// === Services API ===
export const servicesApi = {
  public: (params?: Record<string, string | number>) => {
    const qs = params ? `?${new URLSearchParams(params as any).toString()}` : "";
    return apiFetch(`/services${qs}`);
  },
  details: (id: string, token?: string) => apiFetch(`/services/${id}`, { token: token || undefined }),
  myServices: (token: string, params?: Record<string, string | number>) => {
    const qs = params ? `?${new URLSearchParams(params as any).toString()}` : "";
    return apiFetch(`/services/my-services${qs}`, { token });
  },
  create: (token: string, data: any) =>
    apiFetch(`/services`, { method: "POST", body: data, token }),
  update: (token: string, id: string, data: any) =>
    apiFetch(`/services/${id}`, { method: "PUT", body: data, token }),
  delete: (token: string, id: string) =>
    apiFetch(`/services/${id}`, { method: "DELETE", token }),
  toggleAvailability: (token: string, id: string) =>
    apiFetch(`/services/${id}/availability`, { method: "PATCH", token }),
  adminPending: (token: string, params?: Record<string, string | number>) => {
    const qs = params ? `?${new URLSearchParams(params as any).toString()}` : "";
    return apiFetch(`/services/admin/pending${qs}`, { token });
  },
  adminAll: (token: string, params?: Record<string, string | number>) => {
    const qs = params ? `?${new URLSearchParams(params as any).toString()}` : "";
    return apiFetch(`/services/admin/all${qs}`, { token });
  },
  approve: (token: string, id: string, status: "approved" | "rejected") =>
    apiFetch(`/services/${id}/approval`, {
      method: "PATCH",
      body: { approvalStatus: status },
      token,
    }),
};

// === Bookings API ===
export const bookingsApi = {
  create: (token: string, data: any) =>
    apiFetch(`/bookings`, { method: "POST", body: data, token }),
  myBookings: (token: string, params?: Record<string, string | number>) => {
    const qs = params ? `?${new URLSearchParams(params as any).toString()}` : "";
    return apiFetch(`/bookings/my-bookings${qs}`, { token });
  },
  assigned: (token: string, params?: Record<string, string | number>) => {
    const qs = params ? `?${new URLSearchParams(params as any).toString()}` : "";
    return apiFetch(`/bookings/assigned${qs}`, { token });
  },
  adminAll: (token: string, params?: Record<string, string | number>) => {
    const qs = params ? `?${new URLSearchParams(params as any).toString()}` : "";
    return apiFetch(`/bookings${qs}`, { token });
  },
  getById: (token: string, id: string) => apiFetch(`/bookings/${id}`, { token }),
  cancel: (token: string, id: string) =>
    apiFetch(`/bookings/${id}/cancel`, { method: "PATCH", token }),
  accept: (token: string, id: string) =>
    apiFetch(`/bookings/${id}/accept`, { method: "PATCH", token }),
  reject: (token: string, id: string) =>
    apiFetch(`/bookings/${id}/reject`, { method: "PATCH", token }),
  start: (token: string, id: string) =>
    apiFetch(`/bookings/${id}/start`, { method: "PATCH", token }),
  complete: (token: string, id: string, finalAmount: number) =>
    apiFetch(`/bookings/${id}/complete`, {
      method: "PATCH",
      body: { finalAmount },
      token,
    }),
};

// === Upload API (ImgBB) ===
export const uploadApi = {
  image: async (token: string, file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    const url = `${API_BASE}/upload/image`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
      credentials: "include",
    });

    let data: ApiResponse<any>;
    try {
      data = await response.json();
    } catch {
      throw { message: `Upload failed: ${response.statusText}`, status: response.status } as ApiError;
    }

    if (!response.ok) {
      throw { message: data.message || `Upload error ${response.status}`, status: response.status, error: data.error } as ApiError;
    }

    return data;
  },
};

// === Payments API ===
export const paymentsApi = {
  createCheckout: (token: string, bookingId: string) =>
    apiFetch(`/payments/create-checkout-session`, {
      method: "POST",
      body: { bookingId },
      token,
    }),
  verify: (token: string, sessionId: string) =>
    apiFetch(`/payments/verify?session_id=${encodeURIComponent(sessionId)}`, {
      token,
    }),
  myHistory: (token: string, params?: Record<string, string | number>) => {
    const qs = params ? `?${new URLSearchParams(params as any).toString()}` : "";
    return apiFetch(`/payments/my-history${qs}`, { token });
  },
  adminTransactions: (token: string, params?: Record<string, string | number>) => {
    const qs = params ? `?${new URLSearchParams(params as any).toString()}` : "";
    return apiFetch(`/payments/admin/transactions${qs}`, { token });
  },
  byBooking: (token: string, bookingId: string) =>
    apiFetch(`/payments/booking/${bookingId}`, { token }),
};
