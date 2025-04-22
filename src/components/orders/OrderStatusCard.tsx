
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useOrder } from "@/contexts/OrderContext";
import { Order, OrderStatus } from "@/types";
import { Check, Clock, Loader2, Package, ChefHat, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";

interface OrderStatusCardProps {
  orderId: string;
}

const OrderStatusCard: React.FC<OrderStatusCardProps> = ({ orderId }) => {
  const { getOrder } = useOrder();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(0);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData = await getOrder(orderId);
        setOrder(orderData);
        
        // Calculate remaining time in minutes
        if (orderData.status !== "delivered" && orderData.status !== "cancelled") {
          const now = new Date();
          const estimatedTime = new Date(orderData.estimatedDeliveryTime);
          const diffMs = estimatedTime.getTime() - now.getTime();
          const diffMinutes = Math.max(0, Math.floor(diffMs / 60000));
          setRemainingTime(diffMinutes);
        }
      } catch (err) {
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
    
    // Update remaining time every minute
    const timer = setInterval(() => {
      setRemainingTime(prev => Math.max(0, prev - 1));
    }, 60000);
    
    return () => clearInterval(timer);
  }, [orderId, getOrder]);

  if (loading) {
    return (
      <Card className="bg-cafe-surface border-cafe-primary/20">
        <CardContent className="p-6 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-cafe-primary" />
        </CardContent>
      </Card>
    );
  }

  if (error || !order) {
    return (
      <Card className="bg-cafe-surface border-cafe-primary/20">
        <CardContent className="p-6">
          <div className="text-center text-cafe-text/70">
            <ShieldAlert className="h-12 w-12 mx-auto mb-2 text-cafe-primary/70" />
            <h3 className="text-lg font-medium text-cafe-text">Error Loading Order</h3>
            <p className="mt-1">{error || "Order not found"}</p>
            <Link to="/orders">
              <Button className="mt-4 bg-cafe-primary hover:bg-cafe-primary/90">
                View All Orders
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusInfo = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return {
          icon: <Clock className="h-6 w-6 text-amber-500" />,
          label: "Pending Confirmation",
          color: "bg-amber-500",
          description: "Your order is waiting to be confirmed by the cafeteria staff.",
          progress: 20,
        };
      case "confirmed":
        return {
          icon: <Check className="h-6 w-6 text-blue-500" />,
          label: "Order Confirmed",
          color: "bg-blue-500",
          description: "Your order has been confirmed and will be prepared soon.",
          progress: 40,
        };
      case "preparing":
        return {
          icon: <ChefHat className="h-6 w-6 text-indigo-500" />,
          label: "Preparing Your Order",
          color: "bg-indigo-500",
          description: "Our chefs are preparing your delicious food.",
          progress: 60,
        };
      case "ready":
        return {
          icon: <Package className="h-6 w-6 text-green-500" />,
          label: "Ready for Pickup",
          color: "bg-green-500",
          description: "Your order is ready! Please collect it from the counter.",
          progress: 80,
        };
      case "delivered":
        return {
          icon: <Check className="h-6 w-6 text-green-600" />,
          label: "Order Delivered",
          color: "bg-green-600",
          description: "Your order has been delivered. Enjoy your meal!",
          progress: 100,
        };
      case "cancelled":
        return {
          icon: <ShieldAlert className="h-6 w-6 text-red-500" />,
          label: "Order Cancelled",
          color: "bg-red-500",
          description: "This order has been cancelled.",
          progress: 0,
        };
      default:
        return {
          icon: <Clock className="h-6 w-6 text-gray-500" />,
          label: "Unknown Status",
          color: "bg-gray-500",
          description: "The status of this order is unknown.",
          progress: 0,
        };
    }
  };

  const statusInfo = getStatusInfo(order.status);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-cafe-surface border-cafe-primary/20">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-cafe-text">Order #{order.orderNumber}</CardTitle>
              <p className="text-cafe-text/70 text-sm mt-1">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            <Badge 
              className={`${statusInfo.color} text-white`}
            >
              {statusInfo.label}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Status Progress */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              {statusInfo.icon}
              <h3 className="text-lg font-medium text-cafe-text">{statusInfo.label}</h3>
            </div>
            <p className="text-cafe-text/70">{statusInfo.description}</p>
            <Progress value={statusInfo.progress} className="mt-2 h-2 bg-cafe-primary/20" />
          </div>
          
          {/* Estimated Time */}
          {order.status !== "delivered" && order.status !== "cancelled" && (
            <div className="flex items-center justify-between bg-cafe-primary/10 p-3 rounded-md">
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-cafe-primary" />
                <span className="text-cafe-text">Estimated Time</span>
              </div>
              <div className="text-cafe-text font-medium">
                {remainingTime > 0 
                  ? `${remainingTime} minutes` 
                  : "Any moment now!"
                }
              </div>
            </div>
          )}
          
          {/* Order Items */}
          <div>
            <h3 className="text-lg font-medium mb-3 text-cafe-text">Order Items</h3>
            <div className="space-y-2">
              {order.items.map(item => (
                <div key={item.menuItemId} className="flex justify-between text-cafe-text">
                  <span>
                    {item.quantity} x {item.name}
                  </span>
                  <span>₹{item.subtotal.toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <Separator className="my-3 bg-cafe-primary/10" />
            
            <div className="space-y-1 text-cafe-text">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>₹{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>₹{order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium pt-1">
                <span>Total</span>
                <span>₹{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {/* Payment Information */}
          <div>
            <h3 className="text-lg font-medium mb-2 text-cafe-text">Payment Information</h3>
            <div className="grid grid-cols-2 gap-2 text-cafe-text">
              <div>
                <p className="text-cafe-text/70 text-sm">Method</p>
                <p className="capitalize">{order.paymentMethod}</p>
              </div>
              <div>
                <p className="text-cafe-text/70 text-sm">Status</p>
                <Badge variant={order.paymentStatus === "completed" ? "default" : "outline"}>
                  {order.paymentStatus === "completed" ? "Paid" : "Pending"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <div className="w-full space-y-2">
            <Link to="/menu">
              <Button 
                variant="outline" 
                className="w-full border-cafe-primary/20 text-cafe-primary hover:bg-cafe-primary/10"
              >
                Order More
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default OrderStatusCard;
