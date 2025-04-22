
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useOrder } from "@/contexts/OrderContext";
import { Order, OrderStatus } from "@/types";
import {
  Clock,
  Package,
  ChefHat,
  Check,
  XCircle,
  AlertCircle,
  Printer,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const OrderManager: React.FC = () => {
  const { orders, refreshOrders, updateStatus } = useOrder();
  const { toast } = useToast();

  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [pastOrders, setPastOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Refresh orders every 30 seconds
  useEffect(() => {
    refreshOrders();
    const interval = setInterval(() => {
      refreshOrders();
    }, 30000);
    return () => clearInterval(interval);
  }, [refreshOrders]);

  // Sort and filter orders
  useEffect(() => {
    const active: Order[] = [];
    const past: Order[] = [];

    orders.forEach((order) => {
      if (
        order.status === "pending" ||
        order.status === "confirmed" ||
        order.status === "preparing" ||
        order.status === "ready"
      ) {
        active.push(order);
      } else {
        past.push(order);
      }
    });

    // Sort active orders by creation date, newest first
    active.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Sort past orders by creation date, newest first
    past.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    setActiveOrders(active);
    setPastOrders(past);
  }, [orders]);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setIsUpdatingStatus(true);
    try {
      await updateStatus(orderId, newStatus);
      
      // Update the selected order if it's the one being changed
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({
          ...selectedOrder,
          status: newStatus
        });
      }
      
      toast({
        title: "Status Updated",
        description: `Order status has been updated to ${newStatus}.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Failed to update order status. Please try again.",
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getNextStatusOptions = (currentStatus: OrderStatus): OrderStatus[] => {
    switch (currentStatus) {
      case "pending":
        return ["confirmed", "cancelled"];
      case "confirmed":
        return ["preparing", "cancelled"];
      case "preparing":
        return ["ready", "cancelled"];
      case "ready":
        return ["delivered", "cancelled"];
      default:
        return [];
    }
  };

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
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
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

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const handlePrintReceipt = () => {
    // Simulate printing with a toast
    toast({
      title: "Receipt Printed",
      description: "The receipt has been sent to the printer.",
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto bg-cafe-surface">
          <TabsTrigger value="active" className="data-[state=active]:bg-cafe-primary data-[state=active]:text-white">
            Active Orders
            {activeOrders.length > 0 && (
              <Badge className="ml-2 bg-cafe-secondary">{activeOrders.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="past" className="data-[state=active]:bg-cafe-primary data-[state=active]:text-white">
            Past Orders
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-4">
          {activeOrders.length === 0 ? (
            <div className="text-center py-8">
              <Check className="h-12 w-12 mx-auto mb-3 text-cafe-primary/70" />
              <h3 className="text-lg font-medium text-cafe-text">No Active Orders</h3>
              <p className="text-cafe-text/70 mt-1">All orders have been completed</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeOrders.map((order) => (
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
                            {formatTime(order.createdAt)} · {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <Badge className={`${getStatusColor(order.status)} text-white`}>
                          <span className="mr-1">{getStatusIcon(order.status)}</span>
                          {getStatusLabel(order.status)}
                        </Badge>
                      </div>

                      <div className="space-y-1 mb-3">
                        <div className="flex justify-between text-sm text-cafe-text">
                          <span>Items:</span>
                          <span>{order.items.length}</span>
                        </div>
                        <div className="flex justify-between text-sm text-cafe-text">
                          <span>Customer:</span>
                          <span>{order.userName}</span>
                        </div>
                        <div className="flex justify-between text-sm text-cafe-text">
                          <span>Total:</span>
                          <span className="font-medium">₹{order.total.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          onClick={() => viewOrderDetails(order)}
                          className="flex-1 bg-cafe-primary hover:bg-cafe-primary/90"
                        >
                          View Details
                        </Button>

                        {getNextStatusOptions(order.status).length > 0 && (
                          <Select
                            onValueChange={(value) => 
                              handleStatusChange(order.id, value as OrderStatus)
                            }
                            disabled={isUpdatingStatus}
                          >
                            <SelectTrigger className="flex-1 bg-cafe-surface border-cafe-primary/20 text-cafe-text h-9">
                              <SelectValue placeholder="Update Status" />
                            </SelectTrigger>
                            <SelectContent className="bg-cafe-surface border-cafe-primary/20 text-cafe-text">
                              {getNextStatusOptions(order.status).map((status) => (
                                <SelectItem key={status} value={status}>
                                  {getStatusLabel(status)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-4">
          {pastOrders.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 mx-auto mb-3 text-cafe-primary/70" />
              <h3 className="text-lg font-medium text-cafe-text">No Past Orders</h3>
              <p className="text-cafe-text/70 mt-1">
                Completed orders will appear here
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pastOrders.slice(0, 12).map((order) => (
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
                          <h3 className="font-medium text-cafe-text">
                            Order #{order.orderNumber}
                          </h3>
                          <p className="text-cafe-text/70 text-sm">
                            {formatTime(order.createdAt)} · {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <Badge
                          className={`${getStatusColor(order.status)} text-white`}
                        >
                          <span className="mr-1">{getStatusIcon(order.status)}</span>
                          {getStatusLabel(order.status)}
                        </Badge>
                      </div>

                      <div className="space-y-1 mb-3">
                        <div className="flex justify-between text-sm text-cafe-text">
                          <span>Customer:</span>
                          <span>{order.userName}</span>
                        </div>
                        <div className="flex justify-between text-sm text-cafe-text">
                          <span>Total:</span>
                          <span className="font-medium">₹{order.total.toFixed(2)}</span>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        onClick={() => viewOrderDetails(order)}
                        className="w-full bg-cafe-primary hover:bg-cafe-primary/90"
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Order Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="bg-cafe-surface border-cafe-primary/20 text-cafe-text">
          <DialogHeader>
            <DialogTitle>Order #{selectedOrder?.orderNumber}</DialogTitle>
            <DialogDescription className="text-cafe-text/70">
              View complete order details and manage status.
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="py-3 max-h-[60vh] overflow-y-auto pr-2">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-cafe-text/70 text-sm">Order Placed</div>
                  <div className="text-cafe-text">
                    {formatDate(selectedOrder.createdAt)} at{" "}
                    {formatTime(selectedOrder.createdAt)}
                  </div>
                </div>
                <Badge className={`${getStatusColor(selectedOrder.status)} text-white`}>
                  <span className="mr-1">{getStatusIcon(selectedOrder.status)}</span>
                  {getStatusLabel(selectedOrder.status)}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-cafe-text/70 text-sm">Customer</div>
                  <div className="text-cafe-text">{selectedOrder.userName}</div>
                </div>
                <div>
                  <div className="text-cafe-text/70 text-sm">Payment Method</div>
                  <div className="text-cafe-text capitalize">
                    {selectedOrder.paymentMethod}
                  </div>
                </div>
                <div>
                  <div className="text-cafe-text/70 text-sm">Payment Status</div>
                  <Badge
                    variant={
                      selectedOrder.paymentStatus === "completed"
                        ? "default"
                        : "outline"
                    }
                    className={
                      selectedOrder.paymentStatus === "completed"
                        ? "bg-green-600"
                        : ""
                    }
                  >
                    {selectedOrder.paymentStatus === "completed"
                      ? "Paid"
                      : "Pending"}
                  </Badge>
                </div>
                <div>
                  <div className="text-cafe-text/70 text-sm">Estimated Delivery</div>
                  <div className="text-cafe-text">
                    {formatTime(selectedOrder.estimatedDeliveryTime)}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-cafe-text/70 text-sm mb-2">Order Items</div>
                <div className="space-y-2">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.menuItemId}
                      className="flex justify-between text-cafe-text bg-cafe-dark p-2 rounded-md"
                    >
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-cafe-text/70 mx-2">×</span>
                        <span>{item.quantity}</span>
                      </div>
                      <span>₹{item.subtotal.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1 mb-4">
                <div className="flex justify-between text-sm text-cafe-text">
                  <span>Subtotal</span>
                  <span>₹{selectedOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-cafe-text">
                  <span>Tax</span>
                  <span>₹{selectedOrder.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium text-cafe-text pt-1">
                  <span>Total</span>
                  <span>₹{selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              {getNextStatusOptions(selectedOrder.status).length > 0 && (
                <div className="mb-4">
                  <div className="text-cafe-text/70 text-sm mb-2">Update Status</div>
                  <div className="flex gap-2">
                    {getNextStatusOptions(selectedOrder.status).map((status) => (
                      <Button
                        key={status}
                        size="sm"
                        variant={status === "cancelled" ? "destructive" : "default"}
                        className={
                          status !== "cancelled"
                            ? "bg-cafe-primary hover:bg-cafe-primary/90"
                            : ""
                        }
                        onClick={() => handleStatusChange(selectedOrder.id, status)}
                        disabled={isUpdatingStatus}
                      >
                        {status === "cancelled" ? (
                          <XCircle className="h-4 w-4 mr-1" />
                        ) : (
                          getStatusIcon(status)
                        )}
                        {getStatusLabel(status)}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDetailsOpen(false)}
              className="border-cafe-primary/20 text-cafe-primary hover:bg-cafe-primary/10"
            >
              Close
            </Button>
            <Button onClick={handlePrintReceipt} className="bg-cafe-primary hover:bg-cafe-primary/90">
              <Printer className="mr-2 h-4 w-4" />
              Print Receipt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderManager;
