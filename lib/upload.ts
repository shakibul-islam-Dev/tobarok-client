/**
 * File upload client for the backend upload service.
 *
 * The backend exposes POST /api/uploads (single file in the "file" field) and
 * POST /api/uploads/multiple (files in the "files" field). Both require an
 * authenticated session (Better Auth cookie). We return the relative "/uploads/…"
 * path so images are served through the Next.js rewrite to the backend, keeping
 * <next/image> same-origin (no remotePatterns needed).
 */

const API_BASE = process.env.NEXT_PUBLIC_URL || "";

export interface UploadResult {
  url: string;
  filename: string;
  path: string;
  size: number;
  mimetype: string;
}

export interface UploadError {
  message: string;
}

async function parseError(res: Response): Promise<string> {
  try {
    const body = await res.json();
    return body?.message ?? `Upload failed (${res.status})`;
  } catch {
    return `Upload failed (${res.status})`;
  }
}

/** Uploads a single file to POST /api/uploads. */
export async function uploadFile(file: File): Promise<UploadResult> {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${API_BASE}/api/uploads`, {
    method: "POST",
    body: form,
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(await parseError(res));
  }

  const data = await res.json();
  return {
    url: data.url,
    filename: data.filename,
    path: `/uploads/${data.filename}`,
    size: data.size,
    mimetype: data.mimetype,
  };
}

/** Uploads multiple files to POST /api/uploads/multiple. */
export async function uploadFiles(files: File[]): Promise<UploadResult[]> {
  const form = new FormData();
  files.forEach((file) => form.append("files", file));

  const res = await fetch(`${API_BASE}/api/uploads/multiple`, {
    method: "POST",
    body: form,
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(await parseError(res));
  }

  const data = await res.json();
  const list: Array<{
    url?: string;
    filename?: string;
    size?: number;
    mimetype?: string;
  }> = Array.isArray(data.files) ? data.files : [];

  return list.map((f, i) => ({
    url: data.urls?.[i] ?? f.url ?? "",
    filename: f.filename ?? "",
    path: f.filename ? `/uploads/${f.filename}` : "",
    size: f.size ?? 0,
    mimetype: f.mimetype ?? "",
  }));
}

/** Acceptable image types for the backend upload service. */
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/avif",
  "image/svg+xml",
];

export function isAcceptedImage(file: File): boolean {
  return ACCEPTED_IMAGE_TYPES.includes(file.type);
}
