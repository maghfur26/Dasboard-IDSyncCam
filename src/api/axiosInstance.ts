import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const PUBLIC_ENDPOINTS = ["/auth/login", "/auth/login-web", "/auth/register"];

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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

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
      await api.post("/auth/refresh-token");
      processQueue(null);
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);

      // Di bagian catch refreshError (sekitar baris 79-84)
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth-storage");

        // ⭐ GANTI INI
        import("../store/useAuthStore").then(({ useAuthStore }) => {
          useAuthStore.setState({
            user: null,
            isAuthenticated: false,
            loading: false,
            error: null,
          });
        });

        // ⭐ TAMBAHKAN CEK PATH
        const currentPath = window.location.pathname;
        if (currentPath !== "/login") {
          window.location.href = "/login";
        }
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
