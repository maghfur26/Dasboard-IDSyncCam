import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect, useState } from "react";

interface PublicRouteProps {
  children: React.ReactNode;
}

/**
 * PublicRoute - Untuk halaman yang hanya bisa diakses jika belum login
 * Contoh: Login page, Register page
 * Jika sudah login, redirect ke home
 */
const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
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

  // ✅ Redirect jika sudah authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // ✅ Render public content (login page)
  return <>{children}</>;
};

export default PublicRoute;
