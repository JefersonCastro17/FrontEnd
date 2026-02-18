const DEFAULT_API_URL = "http://localhost:4000";

const sanitizeBaseUrl = (url) => String(url || DEFAULT_API_URL).replace(/\/+$/, "");

export const API_BASE_URL = sanitizeBaseUrl(import.meta.env.VITE_API_URL || DEFAULT_API_URL);

export const AUTH_ENDPOINTS = Object.freeze({
  login: "/api/auth/login",
  register: "/api/auth/register",
  verifyEmail: "/api/auth/verify-email",
  resendVerification: "/api/auth/resend-verification",
  requestPasswordReset: "/api/auth/request-password-reset",
  resetPassword: "/api/auth/reset-password",
});

export const ROLE_SECURITY_CODES = Object.freeze({
  "1": "123",
  "2": "456",
});
