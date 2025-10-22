import Avatar from "../elements/Avatar";
import Sidebar from "../elements/Sidebar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { IoIosLogOut } from "react-icons/io";
import api from "../../api/axiosInstance";
import { useAuthStore } from "../../store/useAuthStore";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [open, setIsOpen] = useState<boolean>(false);
  const [loggingOut, setLoggingOut] = useState<boolean>(false);

  const { isAuthenticated, clearAuth, setIsAuthenticated } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);
    try {
      await api.post("/auth/logout");
    } catch (error: any) {
      console.error("Logout error:", error);
    } finally {
      clearAuth();
      localStorage.removeItem("auth-storage");
      setIsAuthenticated(false);

      navigate("/login", { replace: true });
      setLoggingOut(false);
    }
  };

  const handleToggle = () => {
    setIsOpen(!open);
  };

  useEffect(() => {
    if (open) {
      setIsOpen(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    const checkAuth = () => {
      const state = useAuthStore.getState();

      if (!state.isAuthenticated || !state.token) {
        navigate("/login", { replace: true });
      }
    };

    checkAuth();
  }, [navigate]);

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Cek apakah klik di luar avatar DAN dropdown
      if (open && !target.closest('.avatar-container') && !target.closest('.dropdown-menu')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5C6BF0]" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <main
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarOpen ? "pl-48" : "ml-20"
        }`}
      >
        <header className="relative shadow-sm">
          <Avatar onClick={handleToggle} />

          {/* Ganti class dari avatar-dropdown ke dropdown-menu */}
          <div
            className={`dropdown-menu absolute top-14 right-0 shadow-xl bg-white w-[180px] rounded-bl-md flex items-center px-4 py-2 cursor-pointer hover:text-[#515ECB] transition-all ease-in-out duration-300 transform ${
              open
                ? "opacity-100 translate-x-0 pointer-events-auto z-50"
                : "opacity-0 -translate-x-2 pointer-events-none"
            }`}
            onClick={handleLogout}
          >
            {loggingOut ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#515ECB]" />
                <span className="font-poppins font-extralight px-4">
                  Loading...
                </span>
              </>
            ) : (
              <>
                <IoIosLogOut className="text-2xl" />
                <span className="font-poppins font-extralight px-4">
                  Logout
                </span>
              </>
            )}
          </div>
        </header>

        <div className="flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;