import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, user, logout } = useAuthStore(); // ⭐ TAMBAH logout
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // ⭐ TAMBAHKAN useEffect INI (BARU)
  useEffect(() => {
    if (isHydrated && isAuthenticated && user) {
      const isAdmin =
        user.role === "ADMIN" || user.role === "admin" || user.role === "Admin";

      if (!isAdmin) {
        logout();
      }
    }
  }, [isHydrated, isAuthenticated, user, logout]);

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5C6BF0]" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // ⭐ TAMBAHKAN VALIDASI INI (BARU)
  const isAdmin =
    user.role === "ADMIN" || user.role === "admin" || user.role === "Admin";

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
