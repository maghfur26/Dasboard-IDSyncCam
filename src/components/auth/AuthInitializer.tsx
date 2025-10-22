import { useAuthStore } from "../../store/useAuthStore";

export const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // ✅ Tidak perlu checkAuth jika tidak ada endpoint /auth/me
  // Zustand persist sudah otomatis restore state dari localStorage

  return <>{children}</>;
};
