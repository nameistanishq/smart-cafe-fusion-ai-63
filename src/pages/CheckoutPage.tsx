
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useWallet } from "@/contexts/WalletContext";
import { useOrder } from "@/contexts/OrderContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  Wallet,
  CreditCard,
  DollarSign,
  BadgeIndianRupee,
} from "lucide-react";

const CheckoutPage: React.FC = () => {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { balance, makePayment } = useWallet();
  const { createNewOrder } = useOrder();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState<
    "wallet" | "card" | "cash" | "upi"
  >("wallet");
  const [isProcessing, setIsProcessing] = useState(false);

  // Tax calculation
  const taxRate = 0.05; // 5% tax
  const taxAmount = total * taxRate;
  const grandTotal = total + taxAmount;

  // Check if cart is empty
  const isEmptyCart = items.length === 0;

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      setIsProcessing(true);

      if (isEmptyCart) {
        toast({
          title: "Empty Cart",
          description: "Your cart is empty. Add some items before checking out.",
          variant: "destructive",
        });
        return;
      }

      if (!isAuthenticated && paymentMethod !== "cash") {
        toast({
          title: "Authentication Required",
          description: "Please log in to use online payment methods.",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      // Process payment based on method
      let paymentStatus = "pending";

      if (paymentMethod === "wallet") {
        if (balance < grandTotal) {
          toast({
            title: "Insufficient Balance",
            description: "You don't have enough money in your wallet.",
            variant: "destructive",
          });
          return;
        }

        // Process wallet payment
        const paymentSuccess = await makePayment(
          grandTotal,
          "Order payment"
        );

        if (!paymentSuccess) {
          toast({
            title: "Payment Failed",
            description: "Failed to process wallet payment.",
            variant: "destructive",
          });
          return;
        }

        paymentStatus = "completed";
      } else if (paymentMethod === "card" || paymentMethod === "upi") {
        // For demo purposes, we're auto-completing card and UPI payments
        // In a real app, this would redirect to a payment gateway
        await new Promise((resolve) => setTimeout(resolve, 1500));
        paymentStatus = "completed";

        toast({
          title: "Payment Processed",
          description: `Your ${
            paymentMethod === "card" ? "card" : "UPI"
          } payment was successful.`,
        });
      }

      // Create order
      const orderItems = items.map((item) => ({
        menuItemId: item.menuItem.id,
        name: item.menuItem.name,
        price: item.menuItem.price,
        quantity: item.quantity,
        subtotal: item.menuItem.price * item.quantity,
      }));

      const newOrder = await createNewOrder({
        userId: user?.id || "guest",
        userName: user?.name || "Guest User",
        items: orderItems,
        subtotal: total,
        tax: taxAmount,
        total: grandTotal,
        status: "pending",
        paymentMethod,
        paymentStatus,
      });

      // Clear cart after successful order
      clearCart();

      toast({
        title: "Order Placed Successfully",
        description: `Your order #${newOrder.orderNumber} has been placed.`,
      });

      // Redirect to order status page if user is logged in
      if (isAuthenticated) {
        navigate(`/order-status/${newOrder.id}`);
      } else {
        navigate("/menu");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast({
        title: "Order Failed",
        description: "An error occurred while placing your order.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="pb-20">
      <Button
        variant="ghost"
        onClick={() => navigate("/menu")}
        className="mb-4 text-cafe-primary hover:bg-cafe-primary/10"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Menu
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="md:col-span-2">
          <Card className="bg-cafe-surface border-cafe-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-cafe-text">
                <ShoppingCart className="mr-2 h-5 w-5 text-cafe-primary" />
                Your Cart
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEmptyCart ? (
                <div className="text-center py-8 text-cafe-text/70">
                  <ShoppingCart className="mx-auto h-16 w-16 text-cafe-text/30 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
                  <p className="mb-4">Add some delicious items to get started</p>
                  <Button
                    onClick={() => navigate("/menu")}
                    className="bg-cafe-primary hover:bg-cafe-primary/90"
                  >
                    Browse Menu
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.menuItem.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center py-2 border-b border-cafe-primary/10"
                    >
                      <div className="flex flex-1 gap-4">
                        <div className="h-16 w-16 rounded overflow-hidden bg-cafe-dark/30">
                          <img
                            src={item.menuItem.image}
                            alt={item.menuItem.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-cafe-text">
                            {item.menuItem.name}
                          </h3>
                          <p className="text-sm text-cafe-text/70">
                            ₹{item.menuItem.price} per item
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            handleQuantityChange(
                              item.menuItem.id,
                              item.quantity - 1
                            )
                          }
                          className="h-8 w-8 border-cafe-primary/20 text-cafe-primary hover:bg-cafe-primary/10"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(
                              item.menuItem.id,
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="w-14 h-8 bg-cafe-dark border-cafe-primary/20 text-cafe-text text-center"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            handleQuantityChange(
                              item.menuItem.id,
                              item.quantity + 1
                            )
                          }
                          className="h-8 w-8 border-cafe-primary/20 text-cafe-primary hover:bg-cafe-primary/10"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.menuItem.id)}
                          className="h-8 w-8 text-red-500 hover:bg-red-500/10 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="ml-4 w-24 text-right">
                        <p className="font-semibold text-cafe-text">
                          ₹{(item.menuItem.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="bg-cafe-surface border-cafe-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-cafe-text">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-1">
                <span className="text-cafe-text/70">Subtotal</span>
                <span className="text-cafe-text">₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-cafe-text/70">Tax (5%)</span>
                <span className="text-cafe-text">₹{taxAmount.toFixed(2)}</span>
              </div>
              <div className="border-t border-cafe-primary/10 pt-2 mt-2"></div>
              <div className="flex justify-between items-center py-1">
                <span className="font-semibold text-cafe-text">Grand Total</span>
                <span className="font-semibold text-cafe-primary">
                  ₹{grandTotal.toFixed(2)}
                </span>
              </div>

              {/* Payment Method Section */}
              <div className="mt-6">
                <h3 className="font-medium mb-2 text-cafe-text">Payment Method</h3>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(value) =>
                    setPaymentMethod(value as typeof paymentMethod)
                  }
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="wallet"
                      id="payment-wallet"
                      className="text-cafe-primary"
                    />
                    <Label
                      htmlFor="payment-wallet"
                      className="flex items-center cursor-pointer"
                    >
                      <Wallet className="mr-2 h-4 w-4 text-cafe-primary" />
                      Wallet {isAuthenticated && `(₹${balance.toFixed(2)})`}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="card"
                      id="payment-card"
                      className="text-cafe-primary"
                    />
                    <Label
                      htmlFor="payment-card"
                      className="flex items-center cursor-pointer"
                    >
                      <CreditCard className="mr-2 h-4 w-4 text-cafe-primary" />
                      Credit/Debit Card
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="cash"
                      id="payment-cash"
                      className="text-cafe-primary"
                    />
                    <Label
                      htmlFor="payment-cash"
                      className="flex items-center cursor-pointer"
                    >
                      <DollarSign className="mr-2 h-4 w-4 text-cafe-primary" />
                      Cash
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="upi"
                      id="payment-upi"
                      className="text-cafe-primary"
                    />
                    <Label
                      htmlFor="payment-upi"
                      className="flex items-center cursor-pointer"
                    >
                      <BadgeIndianRupee className="mr-2 h-4 w-4 text-cafe-primary" />
                      UPI
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handlePlaceOrder}
                disabled={isEmptyCart || isProcessing}
                className="w-full bg-cafe-primary hover:bg-cafe-primary/90 text-white"
              >
                {isProcessing ? (
                  <>
                    <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                    Processing...
                  </>
                ) : (
                  "Place Order"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
