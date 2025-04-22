
import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { UserRole } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import LoginOptions from "@/components/auth/LoginOptions";
import LoginForm from "@/components/auth/LoginForm";

const LoginPage: React.FC = () => {
  const { role } = useParams<{ role?: string }>();
  const { isAuthenticated, user } = useAuth();

  // If already authenticated, redirect based on role
  if (isAuthenticated && user) {
    switch (user.role) {
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

  // Validate role parameter
  const validRoles: UserRole[] = ["student", "staff", "cafeteria", "admin"];
  const validatedRole = validRoles.includes(role as UserRole) ? (role as UserRole) : undefined;

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {validatedRole ? <LoginForm role={validatedRole} /> : <LoginOptions />}
    </div>
  );
};

export default LoginPage;
