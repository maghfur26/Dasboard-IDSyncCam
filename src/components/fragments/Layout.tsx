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

  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoggingOut(false);
    }
  };
  

  return (
    <div className="flex min-h-screen">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <main
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarOpen ? "pl-48" : "ml-20"
        }`}
      >
        <header className="relative shadow-sm">
          <Avatar onClick={() => setIsOpen(!open)} />

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