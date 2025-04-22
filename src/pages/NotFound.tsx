
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const getRedirectPath = () => {
    if (!user) return "/menu";
    
    switch (user.role) {
      case "admin":
        return "/admin/dashboard";
      case "cafeteria":
        return "/cafeteria/billing";
      case "student":
      case "staff":
      default:
        return "/menu";
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div className="text-9xl font-bold text-cafe-primary mb-6">404</div>
        <h1 className="text-3xl font-bold text-cafe-text mb-4">Page Not Found</h1>
        <p className="text-cafe-text/70 mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Button
          onClick={() => navigate(getRedirectPath())}
          className="bg-cafe-primary hover:bg-cafe-primary/90"
        >
          Return to Homepage
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFound;
