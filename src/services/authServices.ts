import api from "../api/axiosInstance";

interface LoginData {
  emai: string;
  password: string;
}

interface User {
  id: string;
  userName: string;
  email: string;
  role: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}

export const authServices = {
  login: async (credentials: LoginData): Promise<User> => {
    const response = await api.post<LoginResponse>(
      "/auth/login/web",
      credentials
    );

    return response.data.data.user;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },

  refreshToken: async (): Promise<void> => {
    await api.post("/auth/refresh-token");
  },
};
