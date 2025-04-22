
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PageContainer from "@/components/shared/PageContainer";
import PageHeader from "@/components/shared/PageHeader";
import OrderStatusCard from "@/components/orders/OrderStatusCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const OrderStatusPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  if (!orderId) {
    navigate("/orders");
    return null;
  }

  return (
    <div className="bg-cafe-dark min-h-screen">
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <PageHeader
            title="Order Status"
            description="Track your order"
            action={
              <Button
                variant="outline"
                onClick={() => navigate("/orders")}
                className="border-cafe-primary/20 text-cafe-text hover:bg-cafe-primary/10"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Orders
              </Button>
            }
          />
        </motion.div>

        <div className="flex justify-center mt-6">
          <div className="w-full max-w-2xl">
            <OrderStatusCard orderId={orderId} />
          </div>
        </div>
      </PageContainer>
    </div>
  );
};

export default OrderStatusPage;
