
import React from "react";
import { motion } from "framer-motion";
import PageContainer from "@/components/shared/PageContainer";
import PageHeader from "@/components/shared/PageHeader";
import MenuManager from "@/components/cafeteria/MenuManager";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, CreditCard } from "lucide-react";

const MenuManagerPage: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="bg-cafe-dark min-h-screen">
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <PageHeader
            title="Menu Manager"
            description="Manage menu items and availability"
            action={
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => navigate("/cafeteria/billing")}
                  className="border-cafe-primary/20 text-cafe-text hover:bg-cafe-primary/10"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Billing
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/cafeteria/orders")}
                  className="border-cafe-primary/20 text-cafe-text hover:bg-cafe-primary/10"
                >
                  Orders
                </Button>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="border-cafe-primary/20 text-red-500 hover:bg-red-500/10"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            }
          />
        </motion.div>

        <div className="mt-6">
          <MenuManager />
        </div>
      </PageContainer>
    </div>
  );
};

export default MenuManagerPage;
