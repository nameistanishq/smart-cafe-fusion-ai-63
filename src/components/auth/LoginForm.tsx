
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";

interface LoginFormProps {
  role: UserRole;
}

const LoginForm: React.FC<LoginFormProps> = ({ role }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  // Role-specific defaults for demo purposes
  React.useEffect(() => {
    switch (role) {
      case "student":
        setEmail("student@example.com");
        setPassword("password");
        break;
      case "staff":
        setEmail("staff@example.com");
        setPassword("password");
        break;
      case "cafeteria":
        setEmail("cafeteria@example.com");
        setPassword("password");
        break;
      case "admin":
        setEmail("admin@example.com");
        setPassword("password");
        break;
    }
  }, [role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
    
    // Navigate based on role
    switch (role) {
      case "student":
      case "staff":
        navigate("/menu");
        break;
      case "cafeteria":
        navigate("/cafeteria/billing");
        break;
      case "admin":
        navigate("/admin/dashboard");
        break;
    }
  };

  const roleDetails = {
    student: {
      title: "Student Login",
      description: "Access your meal account, order food, and track your orders.",
      color: "from-blue-500 to-indigo-600",
      icon: "👨‍🎓",
    },
    staff: {
      title: "Staff Login",
      description: "Order meals, access staff discounts, and manage your account.",
      color: "from-indigo-500 to-purple-600",
      icon: "👨‍💼",
    },
    cafeteria: {
      title: "Cafeteria Staff Login",
      description: "Manage orders, update menu items, and process payments.",
      color: "from-orange-500 to-amber-600",
      icon: "👨‍🍳",
    },
    admin: {
      title: "Admin Login",
      description: "Access complete system management, analytics, and settings.",
      color: "from-red-500 to-pink-600",
      icon: "👨‍💻",
    },
  };

  const details = roleDetails[role];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-md mx-auto bg-cafe-surface border-cafe-primary/20">
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <span className="text-4xl mb-2 block">{details.icon}</span>
            <h1 className="text-2xl font-bold text-cafe-text mb-2">
              {details.title}
            </h1>
            <p className="text-cafe-text/70 text-sm">
              {details.description}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-cafe-text"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="bg-cafe-dark border-cafe-primary/20 text-cafe-text"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-cafe-text"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="bg-cafe-dark border-cafe-primary/20 text-cafe-text"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-gradient-to-r ${details.color} hover:opacity-90 transition-opacity`}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LoginForm;
