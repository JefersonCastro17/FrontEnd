import { postJson } from "../api/httpClient";
import { AUTH_ENDPOINTS } from "../config/env";

export const authService = {
  login: (payload) => postJson(AUTH_ENDPOINTS.login, payload),
  register: (payload) => postJson(AUTH_ENDPOINTS.register, payload),
  verifyEmail: (payload) => postJson(AUTH_ENDPOINTS.verifyEmail, payload),
  resendVerification: (payload) => postJson(AUTH_ENDPOINTS.resendVerification, payload),
  requestPasswordReset: (payload) => postJson(AUTH_ENDPOINTS.requestPasswordReset, payload),
  resetPassword: (payload) => postJson(AUTH_ENDPOINTS.resetPassword, payload),
};
