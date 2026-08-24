import axios from "axios";

/**
 * Single axios instance for the CampusFix REST API.
 * Point it at your Express backend with VITE_API_BASE_URL (e.g. http://localhost:5000).
 */
export const API_BASE_URL = (import.meta.env["VITE_API_BASE_URL"] as string | undefined) ?? "";

/** When no backend URL is configured we serve realistic demo data locally. */
export const USE_MOCK_API = !API_BASE_URL;

export const TOKEN_KEY = "campusfix_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

const api = axios.create({
  baseURL: API_BASE_URL ? `${API_BASE_URL.replace(/\/$/, "")}/api` : "/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message =
      error?.response?.data?.message ?? error?.message ?? "Something went wrong. Please try again.";
    return Promise.reject(new Error(message));
  },
);

export default api;
