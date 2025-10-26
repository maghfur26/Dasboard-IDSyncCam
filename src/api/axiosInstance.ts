import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Endpoint yang tidak memerlukan autentikasi
const PUBLIC_ENDPOINTS = ["/auth/login", "/auth/login-web", "/auth/register"];

// State untuk mengelola refresh token
let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

// Fungsi untuk logout user
const logoutUser = () => {
  localStorage.removeItem("auth-storage");
  
  // Reset auth store
  useAuthStore.setState({
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  });

  // Redirect ke login jika belum di halaman login
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};

// Fungsi untuk refresh token
const refreshAccessToken = async (): Promise<void> => {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = api.post("/auth/refresh-token").then(() => {
    isRefreshing = false;
    refreshPromise = null;
  }).catch((error) => {
    isRefreshing = false;
    refreshPromise = null;
    throw error;
  });

  return refreshPromise;
};

// Cek apakah endpoint adalah public
const isPublicEndpoint = (url: string): boolean => {
  return PUBLIC_ENDPOINTS.some((endpoint) => url?.includes(endpoint));
};

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Jangan handle jika:
    // 1. Bukan error 401
    // 2. Sudah pernah di-retry
    // 3. Public endpoint
    // 4. Request refresh token sendiri
    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      isPublicEndpoint(originalRequest.url) ||
      originalRequest.url?.includes("/refresh-token")
    ) {
      return Promise.reject(error);
    }

    // Tandai request sudah di-retry
    originalRequest._retry = true;

    try {
      // Tunggu refresh token selesai
      await refreshAccessToken();
      
      // Retry request original
      return api(originalRequest);
    } catch (refreshError) {
      // Jika refresh token gagal, logout user
      if (typeof window !== "undefined") {
        logoutUser();
      }
      return Promise.reject(refreshError);
    }
  }
);

export default api;