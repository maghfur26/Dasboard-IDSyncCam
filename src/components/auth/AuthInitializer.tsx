// src/components/AuthInitializer.tsx
import { useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";
useAuthStore

export const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    // Check auth saat app load
    checkAuth();
  }, [checkAuth]);

  return <>{children}</>;
};
