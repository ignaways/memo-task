import { tokenStorage } from "../utils/tokenStorage";

const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:4000").replace(/\/+$/, "");

export class ApiError extends Error {
  constructor(message, { status = 0, code = "UNKNOWN", details = [] } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }

  fieldErrors() {
    return Object.fromEntries(this.details.map((detail) => [detail.field, detail.message]));
  }
}

let unauthorizedHandler = null;

export const setUnauthorizedHandler = (handler) => {
  unauthorizedHandler = handler;
};

const request = async (path, { method = "GET", body, auth = true } = {}) => {
  const token = auth ? tokenStorage.get() : null;
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${BASE_URL}/api${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("Tidak dapat terhubung ke server. Periksa koneksi internet kamu.", { code: "NETWORK_ERROR" });
  }

  if (response.status === 204) return null;

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const error = payload?.error ?? {};
    if (response.status === 401 && token) unauthorizedHandler?.();
    throw new ApiError(error.message ?? "Terjadi kesalahan pada server.", {
      status: response.status,
      code: error.code,
      details: error.details ?? [],
    });
  }

  return payload?.data ?? null;
};

export const api = {
  get: (path, options) => request(path, options),
  post: (path, body, options) => request(path, { ...options, method: "POST", body }),
  patch: (path, body, options) => request(path, { ...options, method: "PATCH", body }),
  delete: (path, options) => request(path, { ...options, method: "DELETE" }),
};
