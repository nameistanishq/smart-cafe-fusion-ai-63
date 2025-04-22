
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useOrder } from "@/contexts/OrderContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Clock, Check, ShoppingBag, Calendar } from "lucide-react";

const OrderStatusPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrderById } = useOrder();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);

  const order = getOrderById(orderId || "");

  useEffect(() => {
    if (!order || !order.estimatedReadyTime) return;

    const updateTimer = () => {
      const now = new Date();
      const estimatedTime = new Date(order.estimatedReadyTime!);
      const createdTime = new Date(order.createdAt);
      
      // If order is already completed or cancelled, don't update timer
      if (order.status === "delivered" || order.status === "cancelled") {
        setTimeLeft("Order " + (order.status === "delivered" ? "completed" : "cancelled"));
        setProgress(100);
        return;
      }
      
      // If current time is past estimated time
      if (now > estimatedTime) {
        setTimeLeft("Order ready for pickup!");
        setProgress(100);
        return;
      }
      
      // Calculate time left
      const diffMs = estimatedTime.getTime() - now.getTime();
      const minutes = Math.floor(diffMs / 60000);
      const seconds = Math.floor((diffMs % 60000) / 1000);
      
      // Update timer text
      setTimeLeft(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
      
      // Calculate progress percentage
      const totalDuration = estimatedTime.getTime() - createdTime.getTime();
      const elapsed = now.getTime() - createdTime.getTime();
      const progressPercentage = Math.min(100, (elapsed / totalDuration) * 100);
      setProgress(progressPercentage);
    };

    // Update immediately and then every second
    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    
    return () => clearInterval(timer);
  }, [order]);

  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-4 text-cafe-text">Order not found</h2>
        <Button 
          onClick={() => navigate("/orders")}
          className="bg-cafe-primary hover:bg-cafe-primary/90"
        >
          View All Orders
        </Button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "preparing":
        return "bg-blue-500";
      case "ready":
        return "bg-green-500";
      case "delivered":
        return "bg-purple-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  return (
    <div>
      <Button
        variant="ghost"
        onClick={() => navigate("/orders")}
        className="mb-4 text-cafe-primary hover:bg-cafe-primary/10"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Orders
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="bg-cafe-surface border-cafe-primary/20">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center text-cafe-text">
                  <ShoppingBag className="mr-2 h-5 w-5 text-cafe-primary" />
                  Order #{order.orderNumber}
                </CardTitle>
                <Badge className={`${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <p className="text-sm text-cafe-text/70 flex items-center">
                    <Calendar className="mr-1 h-4 w-4" />
                    Order Date
                  </p>
                  <p className="text-cafe-text">{formatDateTime(order.createdAt)}</p>
                </div>
                {order.estimatedReadyTime && (
                  <div>
                    <p className="text-sm text-cafe-text/70 flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      Estimated Completion
                    </p>
                    <p className="text-cafe-text">{formatDateTime(order.estimatedReadyTime)}</p>
                  </div>
                )}
                {order.completedAt && (
                  <div>
                    <p className="text-sm text-cafe-text/70 flex items-center">
                      <Check className="mr-1 h-4 w-4" />
                      Completed
                    </p>
                    <p className="text-cafe-text">{formatDateTime(order.completedAt)}</p>
                  </div>
                )}
              </div>

              <Separator className="bg-cafe-primary/10" />

              {/* Order Progress */}
              {order.status !== "cancelled" && (
                <div className="py-4">
                  <h3 className="text-cafe-text font-medium mb-4">Order Progress</h3>
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-cafe-primary text-white">
                          {order.status === "delivered" 
                            ? "Completed" 
                            : order.status === "ready" 
                              ? "Ready for pickup"
                              : `${Math.round(progress)}%`}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-cafe-surface text-cafe-primary border border-cafe-primary/20">
                          {timeLeft}
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-cafe-dark/30">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-cafe-primary"
                      ></motion.div>
                    </div>
                    <div className="flex justify-between text-xs text-cafe-text/70">
                      <span>Order Placed</span>
                      <span>Preparing</span>
                      <span>Ready</span>
                      <span>Delivered</span>
                    </div>
                  </div>
                </div>
              )}

              <Separator className="bg-cafe-primary/10" />

              {/* Order Items */}
              <div>
                <h3 className="text-cafe-text font-medium mb-4">Order Items</h3>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between py-2 border-b border-cafe-primary/10">
                      <div>
                        <p className="text-cafe-text">{item.name}</p>
                        <p className="text-sm text-cafe-text/70">₹{item.price} x {item.quantity}</p>
                      </div>
                      <p className="font-medium text-cafe-text">₹{item.subtotal.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="bg-cafe-surface border-cafe-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-cafe-text">Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-1">
                <span className="text-cafe-text/70">Subtotal</span>
                <span className="text-cafe-text">₹{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-cafe-text/70">Tax</span>
                <span className="text-cafe-text">₹{order.tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-cafe-primary/10 pt-2 mt-2"></div>
              <div className="flex justify-between items-center py-1">
                <span className="font-semibold text-cafe-text">Total</span>
                <span className="font-semibold text-cafe-primary">₹{order.total.toFixed(2)}</span>
              </div>

              <div className="mt-4">
                <h3 className="font-medium mb-2 text-cafe-text">Payment Method</h3>
                <p className="text-cafe-text capitalize">{order.paymentMethod}</p>
                <Badge 
                  className={`mt-2 ${
                    order.paymentStatus === "completed" 
                      ? "bg-green-500" 
                      : order.paymentStatus === "failed" 
                      ? "bg-red-500" 
                      : "bg-yellow-500"
                  }`}
                >
                  {order.paymentStatus}
                </Badge>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => navigate("/menu")}
                className="w-full bg-cafe-primary hover:bg-cafe-primary/90"
              >
                Order More
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusPage;
