
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useOrder } from "@/contexts/OrderContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ShoppingBag, Search, ChevronRight } from "lucide-react";

const OrdersPage: React.FC = () => {
  const { getUserOrders } = useOrder();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const orders = getUserOrders();

  // Filter orders based on search term
  const filteredOrders = orders.filter(
    (order) =>
      order.orderNumber.includes(searchTerm) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

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

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-cafe-text">Your Orders</h1>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cafe-text/50" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search orders by number or item..."
          className="pl-10 bg-cafe-surface border-cafe-primary/20 text-cafe-text"
        />
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <Card className="bg-cafe-surface border-cafe-primary/20">
          <CardContent className="text-center py-12">
            <ShoppingBag className="mx-auto h-16 w-16 text-cafe-text/30 mb-4" />
            <h3 className="text-lg font-medium mb-2 text-cafe-text">No orders found</h3>
            <p className="mb-4 text-cafe-text/70">
              {orders.length === 0
                ? "You haven't placed any orders yet."
                : "No orders match your search."}
            </p>
            <Button
              onClick={() => navigate("/menu")}
              className="bg-cafe-primary hover:bg-cafe-primary/90"
            >
              Browse Menu
            </Button>
          </CardContent>
        </Card>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {filteredOrders.map((order) => (
            <motion.div key={order.id} variants={item}>
              <Card className="bg-cafe-surface border-cafe-primary/20 hover:shadow-md transition-shadow duration-300">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-cafe-text">
                      Order #{order.orderNumber}
                    </CardTitle>
                    <Badge className={`${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-cafe-text/70">Order Date</p>
                      <p className="text-cafe-text">{formatDateTime(order.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-cafe-text/70">Total</p>
                      <p className="font-semibold text-cafe-text">
                        ₹{order.total.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-cafe-text/70">Items</p>
                      <p className="text-cafe-text">{order.items.length} items</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/order-status/${order.id}`)}
                      className="sm:self-center mt-2 sm:mt-0 border-cafe-primary/20 text-cafe-primary hover:bg-cafe-primary/10"
                    >
                      View Details
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default OrdersPage;
