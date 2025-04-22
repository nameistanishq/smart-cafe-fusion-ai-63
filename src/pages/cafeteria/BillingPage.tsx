
import React from "react";
import { motion } from "framer-motion";
import PageContainer from "@/components/shared/PageContainer";
import PageHeader from "@/components/shared/PageHeader";
import BillingSystem from "@/components/cafeteria/BillingSystem";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Menu } from "lucide-react";

const BillingPage: React.FC = () => {
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
            title="Billing System"
            description="Process orders and generate receipts"
            action={
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => navigate("/cafeteria/menu")}
                  className="border-cafe-primary/20 text-cafe-text hover:bg-cafe-primary/10"
                >
                  <Menu className="mr-2 h-4 w-4" />
                  Menu Manager
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
          <BillingSystem />
        </div>
      </PageContainer>
    </div>
  );
};

export default BillingPage;
