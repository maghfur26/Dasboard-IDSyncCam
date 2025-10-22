import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

interface PublicRouteProps {
  children: React.ReactNode;
}

/**
 * PublicRoute - Untuk halaman yang hanya bisa diakses jika belum login
 * Contoh: Login page, Register page
 * Jika sudah login, redirect ke home
 */
const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuthStore();

  // Tampilkan loading saat check auth
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5C6BF0]" />
      </div>
    );
  }

  // Jika sudah authenticated, redirect ke home
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Jika belum authenticated, tampilkan children (login page)
  return <>{children}</>;
};

export default PublicRoute;
