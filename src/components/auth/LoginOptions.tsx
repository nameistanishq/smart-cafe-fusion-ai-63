
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const loginOptions = [
  {
    id: "student",
    title: "Student / Staff",
    description: "Order food and track deliveries",
    icon: "👨‍🎓",
    path: "/login/student",
    color: "from-blue-500 to-indigo-600",
  },
  {
    id: "cafeteria",
    title: "Cafeteria Staff",
    description: "Manage orders and menu",
    icon: "👨‍🍳",
    path: "/login/cafeteria",
    color: "from-orange-500 to-amber-600",
  },
  {
    id: "admin",
    title: "Admin",
    description: "Complete system management",
    icon: "👨‍💻",
    path: "/login/admin",
    color: "from-red-500 to-pink-600",
  },
  {
    id: "guest",
    title: "Scan & Order",
    description: "Order without login",
    icon: "📱",
    path: "/menu",
    color: "from-green-500 to-emerald-600",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const LoginOptions: React.FC = () => {
  return (
    <div className="py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-cafe-text mb-2">
          Smart Cafeteria
        </h1>
        <p className="text-cafe-text/70">Select your login option</p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto"
      >
        {loginOptions.map((option) => (
          <motion.div key={option.id} variants={item}>
            <Link to={option.path}>
              <Card className="bg-cafe-surface hover:bg-cafe-surface/90 border-cafe-primary/10 transition-all duration-300 hover:shadow-lg hover:shadow-cafe-primary/10 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`h-12 w-12 rounded-full bg-gradient-to-r ${option.color} flex items-center justify-center text-white text-xl`}>
                      {option.icon}
                    </div>
                    <div>
                      <h2 className="text-lg font-medium text-cafe-text">{option.title}</h2>
                      <p className="text-cafe-text/70 text-sm">{option.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default LoginOptions;
