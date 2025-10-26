import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import api from "../api/axiosInstance";

interface User {
  id: string;
  userName: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,

        login: async (email: string, password: string) => {
          set({ loading: true, error: null });
          try {
            const response = await api.post("/auth/login-web", {
              email,
              password,
            });
            const userData = response.data.data.user;

            // ⭐ TAMBAHKAN INI (BARIS BARU)
            const isAdmin =
              userData.role === "ADMIN" ||
              userData.role === "admin" ||
              userData.role === "Admin";

            if (!isAdmin) {
              try {
                await api.post("/auth/logout");
              } catch (e) {
                console.error("Logout error:", e);
              }

              set({
                user: null,
                isAuthenticated: false,
                loading: false,
                error:
                  "Akses ditolak. Hanya admin yang dapat login ke sistem ini.",
              });
              throw new Error("Unauthorized role");
            }

            set({
              user: userData,
              isAuthenticated: true,
              loading: false,
              error: null,
            });
          } catch (error: any) {
            // ⭐ UBAH INI
            const errorMessage =
              error.message === "Unauthorized role"
                ? "Akses ditolak. Hanya admin yang dapat login ke sistem ini."
                : error.response?.data?.message || "Login gagal";

            set({
              error: errorMessage, //
              loading: false,
              isAuthenticated: false,
              user: null,
            });
            throw error;
          }
        },

        logout: async () => {
          set({ loading: true });
          try {
            await api.post("/auth/logout");
          } catch (error: any) {
            console.error("Logout error:", error);
          } finally {
            set({
              user: null,
              isAuthenticated: false,
              loading: false,
              error: null,
            });
          }
        },

        clearError: () => set({ error: null }),
      }),
      {
        name: "auth-storage",
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    )
  )
);
