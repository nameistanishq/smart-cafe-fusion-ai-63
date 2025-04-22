
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { createRazorpayOrder, verifyRazorpayPayment } from '@/services/api';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/contexts/WalletContext';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayCheckoutProps {
  amount: number;
  onSuccess: (orderId: string) => void;
  onFailure: (error: string) => void;
}

const RazorpayCheckout: React.FC<RazorpayCheckoutProps> = ({ amount, onSuccess, onFailure }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { clearCart } = useCart();
  const { addTransaction } = useWallet();

  const handlePayment = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "You must be logged in to complete this payment.",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create order data for Razorpay
      const orderData = await createRazorpayOrder(amount);
      
      // Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        await loadRazorpayScript();
      }

      // Configure Razorpay options
      const options = {
        key: 'rzp_test_POq2XFKRJtQMNr', // Test key ID
        amount: amount * 100, // Amount in paisa
        currency: "INR",
        name: "Smart Cafeteria",
        description: "Food Order Payment",
        order_id: orderData.id,
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#7c3aed", // Primary color
        },
        handler: function (response: any) {
          handlePaymentSuccess(response, orderData.id);
        },
      };

      // Initialize Razorpay
      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      setIsLoading(false);
      const errorMessage = error instanceof Error ? error.message : 'Payment initialization failed';
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: errorMessage,
      });
      onFailure(errorMessage);
    }
  };

  const loadRazorpayScript = (): Promise<void> => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve();
      document.body.appendChild(script);
    });
  };

  const handlePaymentSuccess = async (response: any, orderId: string) => {
    try {
      // Verify payment with backend
      const isVerified = await verifyRazorpayPayment(
        response.razorpay_payment_id,
        response.razorpay_order_id,
        response.razorpay_signature
      );

      if (isVerified) {
        toast({
          title: "Payment Successful",
          description: "Your order has been placed successfully!",
        });
        
        // Update wallet transaction
        await addTransaction('payment', amount, `Payment for Order #${orderId.slice(0, 8)}`, orderId);
        
        // Clear cart after successful payment
        clearCart();
        
        // Call onSuccess callback
        onSuccess(orderId);
      } else {
        throw new Error("Payment verification failed");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment verification failed';
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: errorMessage,
      });
      onFailure(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handlePayment} 
      disabled={isLoading}
      className="w-full bg-cafe-primary hover:bg-cafe-primary/90 text-white"
    >
      {isLoading ? (
        <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin mr-2" />
      ) : null}
      {isLoading ? "Processing..." : "Pay with Razorpay"}
    </Button>
  );
};

export default RazorpayCheckout;
