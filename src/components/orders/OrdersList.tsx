
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useOrder } from "@/contexts/OrderContext";
import { Order, OrderStatus } from "@/types";
import { Clock, Package, ChefHat, ShieldAlert, Check, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const OrdersList: React.FC = () => {
  const { orders, isLoading } = useOrder();

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-cafe-primary" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <Card className="bg-cafe-surface border-cafe-primary/20">
        <CardContent className="p-6">
          <div className="text-center py-8">
            <Package className="h-12 w-12 mx-auto mb-3 text-cafe-primary/70" />
            <h3 className="text-lg font-medium text-cafe-text">No Orders Yet</h3>
            <p className="text-cafe-text/70 mt-1">Place your first order to get started</p>
            <Link to="/menu">
              <Button className="mt-4 bg-cafe-primary hover:bg-cafe-primary/90">
                Browse Menu
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-amber-500" />;
      case "confirmed":
        return <Check className="h-5 w-5 text-blue-500" />;
      case "preparing":
        return <ChefHat className="h-5 w-5 text-indigo-500" />;
      case "ready":
        return <Package className="h-5 w-5 text-green-500" />;
      case "delivered":
        return <Check className="h-5 w-5 text-green-600" />;
      case "cancelled":
        return <ShieldAlert className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "confirmed":
        return "Confirmed";
      case "preparing":
        return "Preparing";
      case "ready":
        return "Ready for Pickup";
      case "delivered":
        return "Delivered";
      case "cancelled":
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "bg-amber-500";
      case "confirmed":
        return "bg-blue-500";
      case "preparing":
        return "bg-indigo-500";
      case "ready":
        return "bg-green-500";
      case "delivered":
        return "bg-green-600";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("en-US", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  // Sort orders by date, newest first
  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-4">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-xl font-bold text-cafe-text">Your Orders</CardTitle>
      </CardHeader>
      
      {sortedOrders.map((order) => (
        <motion.div
          key={order.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-cafe-surface border-cafe-primary/20 overflow-hidden">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium text-cafe-text">Order #{order.orderNumber}</h3>
                  <p className="text-cafe-text/70 text-sm">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <Badge className={`${getStatusColor(order.status)} text-white`}>
                  <span className="mr-1">{getStatusIcon(order.status)}</span>
                  {getStatusLabel(order.status)}
                </Badge>
              </div>
              
              <div className="space-y-1 mb-3">
                {order.items.slice(0, 2).map((item) => (
                  <div key={item.menuItemId} className="flex justify-between text-sm text-cafe-text">
                    <span>
                      {item.quantity} x {item.name}
                    </span>
                    <span>₹{item.subtotal.toFixed(2)}</span>
                  </div>
                ))}
                
                {order.items.length > 2 && (
                  <div className="text-sm text-cafe-text/70">
                    +{order.items.length - 2} more items
                  </div>
                )}
              </div>
              
              <Separator className="mb-3 bg-cafe-primary/10" />
              
              <div className="flex justify-between items-center">
                <div className="text-cafe-text">
                  <span className="font-medium">Total: ₹{order.total.toFixed(2)}</span>
                </div>
                <Link to={`/order-status/${order.id}`}>
                  <Button variant="outline" size="sm" className="border-cafe-primary/20 text-cafe-primary hover:bg-cafe-primary/10">
                    View Details
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default OrdersList;
