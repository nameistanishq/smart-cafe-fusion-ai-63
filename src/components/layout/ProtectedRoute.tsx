
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole | UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // Show loading state while checking authentication
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  // If no specific role is required, just being authenticated is enough
  if (!requiredRole) {
    return <>{children}</>;
  }

  // Check if user has the required role
  const hasRequiredRole = Array.isArray(requiredRole)
    ? requiredRole.includes(user!.role)
    : user!.role === requiredRole;

  if (!hasRequiredRole) {
    // Redirect based on user's role
    switch (user!.role) {
      case "admin":
        return <Navigate to="/admin/dashboard" replace />;
      case "cafeteria":
        return <Navigate to="/cafeteria/billing" replace />;
      case "student":
      case "staff":
      default:
        return <Navigate to="/menu" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
