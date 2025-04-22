
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useOrder } from "@/contexts/OrderContext";
import { useWallet } from "@/contexts/WalletContext";
import RazorpayCheckout from "@/components/payment/RazorpayCheckout";
import { useToast } from "@/hooks/use-toast";

const CheckoutForm: React.FC = () => {
  const { cart, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { createNewOrder } = useOrder();
  const { balance, addTransaction } = useWallet();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "wallet" | "upi">("wallet");
  const [note, setNote] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleWalletPayment = async () => {
    if (cart.items.length === 0) {
      toast({
        variant: "destructive",
        title: "Empty Cart",
        description: "Your cart is empty. Add items before checkout.",
      });
      return;
    }
    
    if (balance < cart.total) {
      toast({
        variant: "destructive",
        title: "Insufficient Balance",
        description: "Your wallet doesn't have enough balance for this transaction.",
      });
      return;
    }
    
    setProcessing(true);
    
    try {
      // Process wallet payment
      await addTransaction("payment", cart.total, "Payment for food order");
      
      // Create order items
      const orderItems = cart.items.map(item => ({
        menuItemId: item.menuItem.id,
        name: item.menuItem.name,
        price: item.menuItem.price,
        quantity: item.quantity,
        subtotal: item.menuItem.price * item.quantity
      }));
      
      const order = await createNewOrder({
        userId: user?.id || "guest-user",
        userName: user?.name || "Guest User",
        items: orderItems,
        subtotal: cart.subtotal,
        tax: cart.tax,
        total: cart.total,
        status: "confirmed",
        paymentMethod: "wallet",
        paymentStatus: "completed",
      });
      
      // Clear cart and navigate to order success
      clearCart();
      navigate(`/order-status/${order.id}`);
      
      toast({
        title: "Order Placed Successfully",
        description: `Your order #${order.orderNumber} has been placed.`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Checkout failed";
      toast({
        variant: "destructive",
        title: "Checkout Failed",
        description: errorMessage,
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleCashPayment = async () => {
    if (cart.items.length === 0) {
      toast({
        variant: "destructive",
        title: "Empty Cart",
        description: "Your cart is empty. Add items before checkout.",
      });
      return;
    }
    
    setProcessing(true);
    
    try {
      // Create order items
      const orderItems = cart.items.map(item => ({
        menuItemId: item.menuItem.id,
        name: item.menuItem.name,
        price: item.menuItem.price,
        quantity: item.quantity,
        subtotal: item.menuItem.price * item.quantity
      }));
      
      const order = await createNewOrder({
        userId: user?.id || "guest-user",
        userName: user?.name || "Guest User",
        items: orderItems,
        subtotal: cart.subtotal,
        tax: cart.tax,
        total: cart.total,
        status: "confirmed",
        paymentMethod: "cash",
        paymentStatus: "pending", // To be paid at counter
      });
      
      // Clear cart and navigate to order success
      clearCart();
      navigate(`/order-status/${order.id}`);
      
      toast({
        title: "Order Placed Successfully",
        description: `Your order #${order.orderNumber} has been placed. Please pay at the counter.`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Checkout failed";
      toast({
        variant: "destructive",
        title: "Checkout Failed",
        description: errorMessage,
      });
    } finally {
      setProcessing(false);
    }
  };
  
  const handlePaymentSuccess = async (orderId: string) => {
    try {
      // Create order items
      const orderItems = cart.items.map(item => ({
        menuItemId: item.menuItem.id,
        name: item.menuItem.name,
        price: item.menuItem.price,
        quantity: item.quantity,
        subtotal: item.menuItem.price * item.quantity
      }));
      
      const order = await createNewOrder({
        userId: user?.id || "guest-user",
        userName: user?.name || "Guest User",
        items: orderItems,
        subtotal: cart.subtotal,
        tax: cart.tax,
        total: cart.total,
        status: "confirmed",
        paymentMethod: paymentMethod,
        paymentStatus: "completed",
        razorpayOrderId: orderId
      });
      
      // Clear cart and navigate to order success
      clearCart();
      navigate(`/order-status/${order.id}`);
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };
  
  const handlePaymentFailure = (error: string) => {
    toast({
      variant: "destructive",
      title: "Payment Failed",
      description: error,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (paymentMethod === "wallet") {
      handleWalletPayment();
    } else if (paymentMethod === "cash") {
      handleCashPayment();
    }
    // For card and UPI, RazorpayCheckout will handle the payment
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-cafe-surface border-cafe-primary/20">
        <CardHeader>
          <CardTitle className="text-cafe-text">Checkout</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Cart Summary */}
            <div>
              <h3 className="text-lg font-medium mb-3 text-cafe-text">Order Summary</h3>
              <div className="space-y-3">
                {cart.items.map(item => (
                  <div key={item.menuItem.id} className="flex justify-between text-cafe-text">
                    <span>
                      {item.quantity} x {item.menuItem.name}
                    </span>
                    <span>₹{(item.menuItem.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <Separator className="my-3 bg-cafe-primary/10" />
              
              <div className="space-y-1 text-cafe-text">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹{cart.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax (5%)</span>
                  <span>₹{cart.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium pt-1">
                  <span>Total</span>
                  <span>₹{cart.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            {/* Payment Method */}
            <div>
              <h3 className="text-lg font-medium mb-3 text-cafe-text">Payment Method</h3>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value) => 
                  setPaymentMethod(value as "cash" | "card" | "wallet" | "upi")
                }
                className="space-y-2"
              >
                {isAuthenticated && (
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem 
                      value="wallet" 
                      id="wallet" 
                      className="border-cafe-primary/50 text-cafe-primary"
                    />
                    <Label htmlFor="wallet" className="text-cafe-text">
                      Wallet Balance (₹{balance.toFixed(2)})
                    </Label>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value="upi" 
                    id="upi" 
                    className="border-cafe-primary/50 text-cafe-primary"
                  />
                  <Label htmlFor="upi" className="text-cafe-text">UPI / Online Payment</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value="card" 
                    id="card" 
                    className="border-cafe-primary/50 text-cafe-primary"
                  />
                  <Label htmlFor="card" className="text-cafe-text">Credit / Debit Card</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value="cash" 
                    id="cash" 
                    className="border-cafe-primary/50 text-cafe-primary"
                  />
                  <Label htmlFor="cash" className="text-cafe-text">Pay at Counter</Label>
                </div>
              </RadioGroup>
            </div>
            
            {/* Optional Note */}
            <div>
              <Label htmlFor="note" className="text-cafe-text">Special Instructions (Optional)</Label>
              <Input
                id="note"
                placeholder="Any special requests or instructions..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="mt-1 bg-cafe-dark border-cafe-primary/20 text-cafe-text"
              />
            </div>
            
            {/* Submit Button */}
            {(paymentMethod === "wallet" || paymentMethod === "cash") ? (
              <Button
                type="submit"
                disabled={processing || cart.items.length === 0}
                className="w-full bg-cafe-primary hover:bg-cafe-primary/90"
              >
                {processing ? (
                  <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin mr-2" />
                ) : null}
                {processing ? "Processing..." : "Place Order"}
              </Button>
            ) : (
              <RazorpayCheckout 
                amount={cart.total} 
                onSuccess={handlePaymentSuccess}
                onFailure={handlePaymentFailure}
              />
            )}
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CheckoutForm;
