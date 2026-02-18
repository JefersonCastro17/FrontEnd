import { API_BASE_URL } from "../config/env";

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

const buildUrl = (path) => {
  if (/^https?:\/\//i.test(path)) return path;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

const parseJsonSafely = async (response) => {
  const raw = await response.text();

  if (!raw) return {};

  try {
    return JSON.parse(raw);
  } catch {
    return { message: raw };
  }
};

export const postJson = async (path, payload, options = {}) => {
  const response = await fetch(buildUrl(path), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    body: JSON.stringify(payload),
    signal: options.signal,
  });

  const data = await parseJsonSafely(response);

  if (!response.ok) {
    throw new ApiError(
      data.message || data.error || `Error HTTP ${response.status}`,
      response.status,
      data
    );
  }

  return data;
};
