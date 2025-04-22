
import React from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import LoginForm from "@/components/auth/LoginForm";
import LoginOptions from "@/components/auth/LoginOptions";
import { UserRole } from "@/types";

const LoginPage: React.FC = () => {
  const { role } = useParams<{ role?: string }>();

  const renderContent = () => {
    if (!role) {
      return <LoginOptions />;
    }

    // Map URL parameter to user role type
    const userRole: UserRole = 
      role === "student" ? "student" :
      role === "cafeteria" ? "cafeteria" :
      role === "admin" ? "admin" :
      "staff";

    return <LoginForm role={userRole} />;
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-cafe-dark p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full"
      >
        {renderContent()}
      </motion.div>
    </div>
  );
};

export default LoginPage;
