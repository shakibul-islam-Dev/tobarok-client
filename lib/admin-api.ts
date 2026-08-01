import { api } from "./api";

// ---------------------------------------------------------------------------
// Types mirroring the backend Mongoose schemas (models/Product.ts, Category.ts)
// ---------------------------------------------------------------------------

export interface ApiProductColor {
  name: string;
  hex?: string;
}

export interface ApiProduct {
  _id: string;
  title: string;
  slug: string;
  sku?: string;
  description?: string;
  shortDescription?: string;
  image: string;
  images?: string[];
  price: number;
  originalPrice?: number;
  costPrice?: number;
  badge?: string;
  category: string;
  categoryRef?: string;
  collections?: string[];
  signatureSeries?: string[];
  tags?: string[];
  sizes?: string[];
  colors?: ApiProductColor[];
  stockQuantity: number;
  inStock: boolean;
  isActive: boolean;
  weight?: number;
  pointsReward?: number;
  rating?: number;
  reviewCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiCategory {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  image?: string;
  parent?: string;
  type: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiHeroSlide {
  _id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: string;
  link: string;
  image: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiOutlet {
  _id: string;
  name: string;
  area: string;
  hours: string;
  phone?: string;
  coordinates?: { lat: number; lng: number };
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/** Payload accepted by POST/PUT /api/products (matches schemas.productCreate). */
export interface ProductInput {
  title: string;
  slug?: string;
  sku?: string;
  description?: string;
  shortDescription?: string;
  image: string;
  images?: string[];
  price: number;
  originalPrice?: number;
  costPrice?: number;
  badge?: string;
  category?: string;
  categoryRef?: string;
  collections?: string[];
  signatureSeries?: string[];
  tags?: string[];
  sizes?: string[];
  colors?: ApiProductColor[];
  stockQuantity?: number;
  inStock?: boolean;
  isActive?: boolean;
  weight?: number;
  pointsReward?: number;
}

interface ApiList<T> {
  data?: T;
  products?: T;
  pagination?: { page: number; pages: number; total: number };
}

/** Formats backend errors (ZodValidation errors, ApiError, network) into a readable string. */
export async function toApiError(res: Response): Promise<string> {
  try {
    const body = await res.json();
    if (body && Array.isArray(body.errors)) {
      return body.errors
        .map((e: { path?: string[]; message?: string }) => {
          const field = Array.isArray(e.path) && e.path.length
            ? `${e.path.join(".")}: `
            : "";
          return `${field}${e.message ?? "Invalid value"}`;
        })
        .join("\n");
    }
    return body?.message ?? `Request failed (${res.status})`;
  } catch {
    return `Request failed (${res.status})`;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await api(path, init);
  if (!res.ok) {
    throw new Error(await toApiError(res));
  }
  return res.json() as Promise<T>;
}

export async function fetchProducts(
  params: Record<string, string> = {}
): Promise<{
  products: ApiProduct[];
  pagination: { page: number; pages: number; total: number };
}> {
  const qs = new URLSearchParams(params).toString();
  const data = await request<ApiList<ApiProduct[]>>(
    `/api/products${qs ? `?${qs}` : ""}`
  );
  return {
    products: data.products ?? data.data ?? [],
    pagination: data.pagination ?? { page: 1, pages: 0, total: 0 },
  };
}

export async function createProduct(input: ProductInput): Promise<ApiProduct> {
  return request<ApiProduct>("/api/products", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateProduct(
  id: string,
  input: ProductInput
): Promise<ApiProduct> {
  return request<ApiProduct>(`/api/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export async function deleteProduct(id: string): Promise<{ message: string }> {
  return request<{ message: string }>(`/api/products/${id}`, {
    method: "DELETE",
  });
}

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

export interface CategoryInput {
  title: string;
  slug?: string;
  description?: string;
  image?: string;
  parent?: string;
  type?: string;
  order?: number;
  isActive?: boolean;
}

export async function fetchCategories(
  params: Record<string, string> = {}
): Promise<ApiCategory[]> {
  const qs = new URLSearchParams(params).toString();
  return request<ApiCategory[]>(`/api/categories${qs ? `?${qs}` : ""}`);
}

export async function createCategory(
  input: CategoryInput
): Promise<ApiCategory> {
  return request<ApiCategory>("/api/categories", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateCategory(
  id: string,
  input: CategoryInput
): Promise<ApiCategory> {
  return request<ApiCategory>(`/api/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export async function deleteCategory(id: string): Promise<{ message: string }> {
  return request<{ message: string }>(`/api/categories/${id}`, {
    method: "DELETE",
  });
}

// ---------------------------------------------------------------------------
// Hero slides
// ---------------------------------------------------------------------------

export interface HeroSlideInput {
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: string;
  link: string;
  image: string;
  order?: number;
  isActive?: boolean;
}

export async function fetchHeroSlides(): Promise<ApiHeroSlide[]> {
  return request<ApiHeroSlide[]>("/api/hero-slides");
}

export async function createHeroSlide(
  input: HeroSlideInput
): Promise<ApiHeroSlide> {
  return request<ApiHeroSlide>("/api/hero-slides", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateHeroSlide(
  id: string,
  input: HeroSlideInput
): Promise<ApiHeroSlide> {
  return request<ApiHeroSlide>(`/api/hero-slides/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export async function deleteHeroSlide(
  id: string
): Promise<{ message: string }> {
  return request<{ message: string }>(`/api/hero-slides/${id}`, {
    method: "DELETE",
  });
}

// ---------------------------------------------------------------------------
// Outlets
// ---------------------------------------------------------------------------

export interface OutletInput {
  name: string;
  area: string;
  hours: string;
  phone?: string;
  coordinates?: { lat: number; lng: number };
  isActive?: boolean;
}

export async function fetchOutlets(): Promise<ApiOutlet[]> {
  return request<ApiOutlet[]>("/api/outlets");
}

export async function createOutlet(input: OutletInput): Promise<ApiOutlet> {
  return request<ApiOutlet>("/api/outlets", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateOutlet(
  id: string,
  input: OutletInput
): Promise<ApiOutlet> {
  return request<ApiOutlet>(`/api/outlets/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export async function deleteOutlet(id: string): Promise<{ message: string }> {
  return request<{ message: string }>(`/api/outlets/${id}`, {
    method: "DELETE",
  });
}

// ---------------------------------------------------------------------------
// Orders (admin)
// ---------------------------------------------------------------------------

export interface ApiOrderAdmin {
  _id: string;
  orderNumber?: string;
  user?: { _id: string; name?: string; email?: string };
  items?: Array<{
    product?: string;
    title?: string;
    qty?: number;
    price?: number;
    size?: string;
    color?: string;
  }>;
  status: string;
  paymentStatus?: string;
  total?: number;
  createdAt?: string;
}

export async function fetchAdminOrders(
  params: Record<string, string> = {}
): Promise<{ orders: ApiOrderAdmin[]; pagination: { page: number; pages: number; total: number } }> {
  const qs = new URLSearchParams(params).toString();
  return request<{
    orders: ApiOrderAdmin[];
    pagination: { page: number; pages: number; total: number };
  }>(`/api/orders/admin/all${qs ? `?${qs}` : ""}`);
}
