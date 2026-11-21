/**
 * FixMate Frontend API Service Layer - FIXED for Failed to fetch resilience
 * Reusable layer to connect existing frontend UI to Express backend
 * Preserves all UI, Tailwind, layouts, navigation, forms
 * Uses NEXT_PUBLIC_API_URL env var (defaults to http://localhost:8000/api)
 * Auth: Uses BetterAuth session user.id as Bearer token for dev (backend supports both real session token and userId fallback)
 */

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

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
    ...headers,
  };

  // Only set Content-Type when body present (avoid preflight for GET public routes)
  if (body && method !== "GET") {
    finalHeaders["Content-Type"] = "application/json";
  }

  if (token) {
    finalHeaders["Authorization"] = `Bearer ${token}`;
  }

  const fetchOptions: RequestInit = {
    method,
    headers: finalHeaders,
    // For public GET without token, omit credentials to avoid extra preflight and extension issues
    // For authenticated requests, include credentials to allow cookie parsing (BetterAuth session)
    credentials: token ? "include" : "omit",
    cache: cache || "no-store",
    mode: "cors",
  };

  if (body && method !== "GET") {
    fetchOptions.body = JSON.stringify(body);
  }

  let response: Response;
  try {
    response = await fetch(url, fetchOptions);
  } catch (err: any) {
    // Handle TypeError: Failed to fetch — common causes: backend down, CORS, or Chrome extension intercepting fetch (e.g. frame_ant, ad-blockers)
    const isNetworkError =
      err instanceof TypeError &&
      (err.message.includes("Failed to fetch") || err.message.includes("NetworkError"));

    if (isNetworkError) {
      console.error(`[apiFetch] Network error fetching ${url}:`, err);
      throw {
        message: `Backend not reachable at ${url}. Please ensure backend server is running (cd fixmate-server && npm run build && node dist/server.js or npm run dev on port 8000). Also check CORS and disable Chrome extensions that block fetch (e.g. ad-blockers like frame_ant at chrome-extension://hoklmmgfnpapgjgcpechhaamimifchmp). Original: ${err.message}`,
        status: 0,
        error: err,
      } as ApiError;
    }

    // Unknown fetch error
    throw {
      message: `Fetch error for ${url}: ${err.message || "Unknown network error"}`,
      status: 0,
      error: err,
    } as ApiError;
  }

  // Handle non-JSON responses gracefully
  let data: ApiResponse<T>;
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch (parseErr: any) {
      throw {
        message: `Failed to parse JSON response from ${url}: ${response.statusText}. Got non-JSON.`,
        status: response.status,
        error: parseErr,
      } as ApiError;
    }
  } else {
    // If not JSON (e.g. HTML error page), try to read text
    try {
      const text = await response.text();
      // If response is actually JSON but content-type missing, try parse
      try {
        data = JSON.parse(text) as ApiResponse<T>;
      } catch {
        throw {
          message: `Non-JSON response from ${url}: ${response.status} ${response.statusText}. Body: ${text.slice(0, 200)}`,
          status: response.status,
        } as ApiError;
      }
    } catch (err: any) {
      if (err.status) throw err;
      throw {
        message: `Failed to read response from ${url}: ${response.statusText}`,
        status: response.status,
      } as ApiError;
    }
  }

  if (!response.ok) {
    throw {
      message: data.message || `API error ${response.status} from ${url}`,
      status: response.status,
      error: data.error || data,
    } as ApiError;
  }

  return data;
}

// Helper to get token from session hook
export function useAuthToken(session: any): string | null {
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
  details: (id: string, token?: string) => {
    // Public endpoint — token optional, avoid sending Content-Type to prevent preflight
    return apiFetch(`/services/${id}`, { token: token || undefined });
  },
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
    let response: Response;
    try {
      response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
        credentials: "include",
        mode: "cors",
      });
    } catch (err: any) {
      if (err instanceof TypeError && err.message.includes("Failed to fetch")) {
        throw {
          message: `Upload backend not reachable at ${url}. Ensure backend running on 8000 and disable extensions blocking fetch (frame_ant). Original: ${err.message}`,
          status: 0,
          error: err,
        } as ApiError;
      }
      throw err;
    }

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
