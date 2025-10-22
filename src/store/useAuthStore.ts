// src/store/authStore.ts
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
  checkAuth: () => Promise<void>;
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
            const response = await api.post("/login-web", { email, password });
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
            await api.post("/logout");
            set({
              user: null,
              isAuthenticated: false,
              loading: false,
              error: null,
            });
          } catch (error: any) {
            console.error("Logout error:", error);
            // Clear state meskipun error
            set({
              user: null,
              isAuthenticated: false,
              loading: false,
            });
          }
        },

        checkAuth: async () => {
          set({ loading: true });
          try {
            const response = await api.get("/me"); // Endpoint untuk get current user
            const userData = response.data.data.user;

            set({
              user: userData,
              isAuthenticated: true,
              loading: false,
            });
          } catch (error) {
            set({
              user: null,
              isAuthenticated: false,
              loading: false,
            });
          }
        },

        clearError: () => set({ error: null }),
      }),
      {
        name: "auth-storage", // Key di localStorage
        partialize: (state) => ({
          user: state.user, // Hanya simpan user info
          isAuthenticated: state.isAuthenticated,
        }),
      }
    )
  )
);
