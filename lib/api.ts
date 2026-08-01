/**
 * Backend API client for custom endpoints (products, cart, orders, etc.).
 * Auth is handled by Better Auth via cookies; credentials are included.
 */
// NEXT_PUBLIC_URL = backend base URL in this project's env convention
const API_BASE = process.env.NEXT_PUBLIC_URL || "";

export async function api(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  });
}

export async function apiJson<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await api(path, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(err.message || "Request failed");
  }
  return res.json() as Promise<T>;
}
