import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Gates the authenticated area. `roles` optionally restricts to specific
// LabRole codes (e.g. ["A1"] for super-admin-only routes).
const ProtectedRoute = ({ roles }) => {
  const { isAuthenticated, roleID } = useAuth();

  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (roles && !roles.includes(roleID)) return <Navigate to="/home" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
