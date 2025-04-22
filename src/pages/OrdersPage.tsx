
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PageContainer from "@/components/shared/PageContainer";
import PageHeader from "@/components/shared/PageHeader";
import OrdersList from "@/components/orders/OrdersList";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-cafe-dark min-h-screen">
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <PageHeader
            title="Your Orders"
            description="View and track your orders"
            action={
              <Button
                variant="outline"
                onClick={() => navigate("/menu")}
                className="border-cafe-primary/20 text-cafe-text hover:bg-cafe-primary/10"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Menu
              </Button>
            }
          />
        </motion.div>

        <div className="mt-6">
          <OrdersList />
        </div>
      </PageContainer>
    </div>
  );
};

export default OrdersPage;
