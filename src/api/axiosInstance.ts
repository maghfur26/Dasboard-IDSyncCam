import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Daftar endpoint yang TIDAK perlu retry refresh token
const PUBLIC_ENDPOINTS = ["/auth/login", "/auth/login-web", "/auth/register"];

// Track refresh token request to prevent multiple simultaneous calls
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};


// Interceptor untuk handle refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ❌ JANGAN retry jika:
    // 1. Bukan 401
    // 2. Sudah pernah retry
    // 3. Request ke public endpoint (login, register)
    // 4. Request ke refresh token endpoint itu sendiri
    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      PUBLIC_ENDPOINTS.some((endpoint) =>
        originalRequest.url?.includes(endpoint)
      ) ||
      originalRequest.url?.includes("/refresh-token")
    ) {
      return Promise.reject(error);
    }

    // ✅ Queue multiple requests while refreshing
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => api(originalRequest))
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // ✅ Coba refresh token (cookies akan auto di-update oleh backend)
      await api.post("/auth/refresh-token");

      processQueue(null);

      // ✅ Retry request yang gagal
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);

      // ✅ Jika refresh gagal, clear auth dan redirect ke login
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth-storage");

        // Import useAuthStore di sini untuk clear state
        import("../store/useAuthStore").then(({ useAuthStore }) => {
          useAuthStore.getState().logout();
        });

        window.location.href = "/login";
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
