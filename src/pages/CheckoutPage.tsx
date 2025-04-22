
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PageContainer from "@/components/shared/PageContainer";
import PageHeader from "@/components/shared/PageHeader";
import CheckoutForm from "@/components/cart/CheckoutForm";
import CartSummary from "@/components/cart/CartSummary";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart } = useCart();

  // Redirect if cart is empty
  React.useEffect(() => {
    if (cart.items.length === 0) {
      navigate("/menu");
    }
  }, [cart.items.length, navigate]);

  return (
    <div className="bg-cafe-dark min-h-screen">
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <PageHeader
            title="Checkout"
            description="Complete your order"
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <CheckoutForm />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <CartSummary />
          </motion.div>
        </div>
      </PageContainer>
    </div>
  );
};

export default CheckoutPage;
