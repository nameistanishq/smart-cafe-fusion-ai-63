
import React from "react";
import { motion } from "framer-motion";
import PageContainer from "@/components/shared/PageContainer";
import PageHeader from "@/components/shared/PageHeader";
import DashboardSummary from "@/components/admin/DashboardSummary";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Package, Trash2 } from "lucide-react";

const DashboardPage: React.FC = () => {
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
            title="Admin Dashboard"
            description="Analytics and insights for your cafeteria"
            action={
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => navigate("/admin/inventory")}
                  className="border-cafe-primary/20 text-cafe-text hover:bg-cafe-primary/10"
                >
                  <Package className="mr-2 h-4 w-4" />
                  Inventory
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/admin/waste")}
                  className="border-cafe-primary/20 text-cafe-text hover:bg-cafe-primary/10"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Waste Management
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
          <DashboardSummary />
        </div>
      </PageContainer>
    </div>
  );
};

export default DashboardPage;
