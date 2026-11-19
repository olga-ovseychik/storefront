import { ApiError } from "./api-error.ts";

export async function api<T>(url: string, init?: RequestInit): Promise<T> {
  let res: Response;

  try {
    res = await fetch(url, init);
  } catch {
    throw new ApiError(0, "NETWORK");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(res.status, body?.code, body?.message, body);
  }

  return res.json();
}
