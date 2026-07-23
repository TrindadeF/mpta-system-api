export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export function resolvePhotoUrl(photoUrl: string | null | undefined): string | null {
  return photoUrl ? `${API_URL}${photoUrl}` : null;
}

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, body: unknown) {
    super(typeof body === "object" && body && "error" in body ? String((body as { error: unknown }).error) : "Erro na requisição");
    this.status = status;
    this.body = body;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  auth?: boolean;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(response.status, data);
  }

  return data as T;
}

function authHeaders(auth: boolean): Record<string, string> {
  if (!auth) return {};
  const token = localStorage.getItem("mpta_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, auth = true } = options;

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(auth),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  return handleResponse<T>(response);
}

/**
 * For multipart submissions (file uploads). Do not set Content-Type manually —
 * the browser fills in the multipart boundary automatically.
 */
export async function apiUpload<T>(
  path: string,
  formData: FormData,
  options: { method?: "POST" | "PATCH"; auth?: boolean } = {},
): Promise<T> {
  const { method = "POST", auth = true } = options;

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: authHeaders(auth),
    body: formData,
  });

  return handleResponse<T>(response);
}
