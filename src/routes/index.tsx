import { createBrowserRouter, Navigate } from "react-router-dom";
import HomePages from "../pages/HomePages";
import Layout from "../components/fragments/Layout";
import LoginPages from "../pages/LoginPages";
import UserPages from "../pages/UserPages";
import SpreedshetPages from "../pages/SpreedshetPages";
import { ProtectedRoute } from "../components/ProtectRoute";
import PublicRoute from "../components/PublicRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <HomePages />,
      },
      {
        path: "users",
        element: <UserPages />,
      },
      {
        path: "sheets",
        element: <SpreedshetPages />,
      },
    ],
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <LoginPages />
      </PublicRoute>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export default router;
