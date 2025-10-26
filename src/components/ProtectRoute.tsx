import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute - Untuk halaman yang hanya bisa diakses jika sudah login
 * Jika belum login, redirect ke login page
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);

  // ✅ Wait for Zustand to hydrate from localStorage
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // ✅ Show loading while hydrating
  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5C6BF0]" />
      </div>
    );
  }

  // ✅ Redirect jika belum authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Render protected content
  return <>{children}</>;
};

export default ProtectedRoute;
