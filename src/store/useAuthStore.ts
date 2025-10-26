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

            set({
              user: userData,
              isAuthenticated: true,
              loading: false,
              error: null,
            });
          } catch (error: any) {
            set({
              error: error.response?.data?.message || "Login failed",
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
            // Clear state regardless of API result
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
        name: "auth-storage", // localStorage key
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    )
  )
);
