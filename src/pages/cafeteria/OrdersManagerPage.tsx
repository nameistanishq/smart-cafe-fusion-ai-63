
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useOrder } from "@/contexts/OrderContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Clock,
  CheckCircle,
  Printer,
  XCircle,
  ShoppingBag,
  CalendarClock,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Order } from "@/types";

const OrdersManagerPage: React.FC = () => {
  const { orders, updateOrderStatus, cancelOrder } = useOrder();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<string>("active");
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Auto refresh active orders every 30 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (autoRefresh && activeTab === 'active') {
      timer = setInterval(() => {
        console.log('Auto-refreshing orders...');
        // In a real app, this would fetch new data from the backend
      }, 30000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [autoRefresh, activeTab]);

  // Filter orders based on search term, filter status, and tab
  const filteredOrders = orders
    .filter(
      (order) =>
        (searchTerm === "" ||
          order.orderNumber.includes(searchTerm) ||
          order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.items.some((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
          )) &&
        (filterStatus === "all" || order.status === filterStatus) &&
        (activeTab === "active"
          ? ["pending", "preparing", "ready"].includes(order.status)
          : ["delivered", "cancelled"].includes(order.status))
    )
    .sort((a, b) => {
      // Sort by most recent first
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const handleUpdateStatus = async (orderId: string, status: Order["status"]) => {
    setIsProcessing(true);
    
    try {
      await updateOrderStatus(orderId, status);
      
      toast({
        title: "Status Updated",
        description: `Order status has been updated to ${status}.`,
      });
      
      // Close dialog if open
      if (isDetailDialogOpen) {
        setIsDetailDialogOpen(false);
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    setIsProcessing(true);
    
    try {
      await cancelOrder(orderId);
      
      toast({
        title: "Order Cancelled",
        description: "The order has been cancelled successfully.",
      });
      
      // Close dialog if open
      if (isDetailDialogOpen) {
        setIsDetailDialogOpen(false);
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast({
        title: "Cancellation Failed",
        description: "Failed to cancel the order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailDialogOpen(true);
  };

  const printOrderReceipt = (order: Order) => {
    // Create a new window for printing
    const printWindow = window.open("", "_blank", "width=800,height=600");
    
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Order Receipt - #${order.orderNumber}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                padding: 20px;
                max-width: 400px;
                margin: 0 auto;
              }
              .receipt-header {
                text-align: center;
                margin-bottom: 15px;
              }
              .receipt-header h2 {
                margin: 0;
                font-size: 18px;
              }
              .receipt-header p {
                margin: 5px 0;
                font-size: 12px;
                color: #666;
              }
              .order-info {
                margin-bottom: 15px;
                font-size: 12px;
              }
              .order-info div {
                display: flex;
                justify-content: space-between;
                margin-bottom: 5px;
              }
              .items {
                margin-bottom: 15px;
              }
              .item {
                display: flex;
                justify-content: space-between;
                margin-bottom: 5px;
                font-size: 12px;
              }
              .separator {
                border-top: 1px dashed #ccc;
                margin: 10px 0;
              }
              .total-section div {
                display: flex;
                justify-content: space-between;
                margin-bottom: 5px;
                font-size: 12px;
              }
              .grand-total {
                font-weight: bold;
                font-size: 14px;
              }
              .footer {
                text-align: center;
                margin-top: 20px;
                font-size: 12px;
                color: #666;
              }
              @media print {
                body {
                  width: 58mm;
                }
              }
            </style>
          </head>
          <body>
            <div class="receipt-header">
              <h2>Smart Cafeteria</h2>
              <p>Campus Cafeteria, India</p>
              <p>Tel: 1234567890</p>
            </div>
            
            <div class="separator"></div>
            
            <div class="order-info">
              <div>
                <span>Order #:</span>
                <span>${order.orderNumber}</span>
              </div>
              <div>
                <span>Date:</span>
                <span>${formatDateTime(order.createdAt)}</span>
              </div>
              <div>
                <span>Customer:</span>
                <span>${order.userName}</span>
              </div>
              <div>
                <span>Status:</span>
                <span>${order.status.toUpperCase()}</span>
              </div>
              <div>
                <span>Payment:</span>
                <span>${order.paymentMethod.toUpperCase()}</span>
              </div>
            </div>
            
            <div class="separator"></div>
            
            <div class="items">
              ${order.items.map(item => `
                <div class="item">
                  <span>${item.quantity} x ${item.name}</span>
                  <span>₹${item.subtotal.toFixed(2)}</span>
                </div>
              `).join("")}
            </div>
            
            <div class="separator"></div>
            
            <div class="total-section">
              <div>
                <span>Subtotal:</span>
                <span>₹${order.subtotal.toFixed(2)}</span>
              </div>
              <div>
                <span>Tax:</span>
                <span>₹${order.tax.toFixed(2)}</span>
              </div>
              <div class="grand-total">
                <span>Total:</span>
                <span>₹${order.total.toFixed(2)}</span>
              </div>
            </div>
            
            <div class="separator"></div>
            
            <div class="footer">
              <p>Thank you!</p>
            </div>

            <script>
              window.onload = function() {
                window.print();
                window.setTimeout(function() {
                  window.close();
                }, 500);
              };
            </script>
          </body>
        </html>
      `);
    }
  };

  const getStatusBadgeColor = (status: string) => {
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
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  return (
    <div className="pb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-cafe-text">Orders Management</h1>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`border-cafe-primary/20 ${autoRefresh ? 'text-cafe-primary bg-cafe-primary/10' : 'text-cafe-text/70'}`}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${autoRefresh ? 'animate-spin-slow' : ''}`} />
            Auto Refresh
          </Button>
          <div className="text-cafe-text/70 text-sm">
            {filteredOrders.length} order{filteredOrders.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
        <div className="md:col-span-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cafe-text/50" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by order #, customer name or item..."
            className="pl-10 bg-cafe-surface border-cafe-primary/20 text-cafe-text"
          />
        </div>

        <div className="md:col-span-6 flex items-center space-x-4">
          <Select
            value={filterStatus}
            onValueChange={setFilterStatus}
          >
            <SelectTrigger className="bg-cafe-surface border-cafe-primary/20 text-cafe-text">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-cafe-surface border-cafe-primary/20 text-cafe-text">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="preparing">Preparing</SelectItem>
              <SelectItem value="ready">Ready</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="active" onValueChange={setActiveTab}>
        <TabsList className="bg-cafe-surface mb-6">
          <TabsTrigger 
            value="active"
            className="data-[state=active]:bg-cafe-primary data-[state=active]:text-white"
          >
            Active Orders
          </TabsTrigger>
          <TabsTrigger 
            value="completed"
            className="data-[state=active]:bg-cafe-primary data-[state=active]:text-white"
          >
            Completed & Cancelled
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <Card className="bg-cafe-surface border-cafe-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-cafe-text">Active Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredOrders.length === 0 ? (
                <div className="text-center py-8 text-cafe-text/70">
                  <ShoppingBag className="mx-auto h-12 w-12 text-cafe-text/30 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No active orders found</h3>
                  <p className="text-cafe-text/70">
                    {searchTerm || filterStatus !== "all"
                      ? "Try adjusting your search or filter."
                      : "All orders have been completed or cancelled."}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="text-cafe-text/70">Order #</TableHead>
                        <TableHead className="text-cafe-text/70">Time</TableHead>
                        <TableHead className="text-cafe-text/70">Customer</TableHead>
                        <TableHead className="text-cafe-text/70">Items</TableHead>
                        <TableHead className="text-right text-cafe-text/70">Total</TableHead>
                        <TableHead className="text-cafe-text/70">Status</TableHead>
                        <TableHead className="text-right text-cafe-text/70">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order) => (
                        <TableRow key={order.id} className="border-b border-cafe-primary/10 hover:bg-cafe-primary/5">
                          <TableCell className="font-medium text-cafe-text">
                            {order.orderNumber}
                          </TableCell>
                          <TableCell className="text-cafe-text/70">
                            {new Date(order.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </TableCell>
                          <TableCell>{order.userName}</TableCell>
                          <TableCell>
                            {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            ₹{order.total.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusBadgeColor(order.status)}>
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => viewOrderDetails(order)}
                                className="h-8 px-2 text-cafe-primary hover:bg-cafe-primary/10"
                              >
                                Details
                              </Button>
                              
                              {order.status === "pending" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleUpdateStatus(order.id, "preparing")}
                                  className="h-8 px-2 border-cafe-primary/20 text-cafe-primary hover:bg-cafe-primary/10"
                                >
                                  Prepare
                                </Button>
                              )}
                              
                              {order.status === "preparing" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleUpdateStatus(order.id, "ready")}
                                  className="h-8 px-2 border-cafe-primary/20 text-cafe-primary hover:bg-cafe-primary/10"
                                >
                                  Ready
                                </Button>
                              )}
                              
                              {order.status === "ready" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleUpdateStatus(order.id, "delivered")}
                                  className="h-8 px-2 border-green-500/20 text-green-500 hover:bg-green-500/10"
                                >
                                  Complete
                                </Button>
                              )}
                              
                              {(order.status === "pending" || order.status === "preparing") && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleCancelOrder(order.id)}
                                  className="h-8 px-2 border-red-500/20 text-red-500 hover:bg-red-500/10"
                                >
                                  Cancel
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card className="bg-cafe-surface border-cafe-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-cafe-text">Completed & Cancelled Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredOrders.length === 0 ? (
                <div className="text-center py-8 text-cafe-text/70">
                  <CalendarClock className="mx-auto h-12 w-12 text-cafe-text/30 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No completed orders found</h3>
                  <p className="text-cafe-text/70">
                    {searchTerm || filterStatus !== "all"
                      ? "Try adjusting your search or filter."
                      : "No orders have been completed or cancelled yet."}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="text-cafe-text/70">Order #</TableHead>
                        <TableHead className="text-cafe-text/70">Date & Time</TableHead>
                        <TableHead className="text-cafe-text/70">Customer</TableHead>
                        <TableHead className="text-cafe-text/70">Items</TableHead>
                        <TableHead className="text-right text-cafe-text/70">Total</TableHead>
                        <TableHead className="text-cafe-text/70">Status</TableHead>
                        <TableHead className="text-right text-cafe-text/70">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order) => (
                        <TableRow key={order.id} className="border-b border-cafe-primary/10 hover:bg-cafe-primary/5">
                          <TableCell className="font-medium text-cafe-text">
                            {order.orderNumber}
                          </TableCell>
                          <TableCell className="text-cafe-text/70">
                            {formatDateTime(order.createdAt)}
                          </TableCell>
                          <TableCell>{order.userName}</TableCell>
                          <TableCell>
                            {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            ₹{order.total.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusBadgeColor(order.status)}>
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => viewOrderDetails(order)}
                                className="h-8 px-2 text-cafe-primary hover:bg-cafe-primary/10"
                              >
                                Details
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => printOrderReceipt(order)}
                                className="h-8 px-2 border-cafe-primary/20 text-cafe-primary hover:bg-cafe-primary/10"
                              >
                                <Printer className="h-3 w-3 mr-1" />
                                Print
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Order Details Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        {selectedOrder && (
          <DialogContent className="bg-cafe-surface border-cafe-primary/20 text-cafe-text sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Order #{selectedOrder.orderNumber}</span>
                <Badge className={getStatusBadgeColor(selectedOrder.status)}>
                  {selectedOrder.status}
                </Badge>
              </DialogTitle>
              <DialogDescription className="text-cafe-text/70">
                Placed on {formatDateTime(selectedOrder.createdAt)}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="flex justify-between border-b border-cafe-primary/10 pb-2">
                <span className="text-cafe-text">Customer</span>
                <span className="font-medium text-cafe-text">{selectedOrder.userName}</span>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-cafe-text">Order Items</h3>
                <div className="rounded-md border border-cafe-primary/20 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent bg-cafe-dark/30">
                        <TableHead className="text-cafe-text/70">Item</TableHead>
                        <TableHead className="text-center text-cafe-text/70">Qty</TableHead>
                        <TableHead className="text-right text-cafe-text/70">Price</TableHead>
                        <TableHead className="text-right text-cafe-text/70">Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items.map((item, index) => (
                        <TableRow key={index} className="border-b border-cafe-primary/10 hover:bg-cafe-primary/5">
                          <TableCell className="text-cafe-text">{item.name}</TableCell>
                          <TableCell className="text-center">{item.quantity}</TableCell>
                          <TableCell className="text-right">₹{item.price.toFixed(2)}</TableCell>
                          <TableCell className="text-right font-medium">
                            ₹{item.subtotal.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-cafe-text/70">Subtotal</span>
                  <span className="text-cafe-text">₹{selectedOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cafe-text/70">Tax</span>
                  <span className="text-cafe-text">₹{selectedOrder.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-cafe-primary/10 pt-2">
                  <span className="font-medium text-cafe-text">Total</span>
                  <span className="font-medium text-cafe-primary">
                    ₹{selectedOrder.total.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between border-t border-cafe-primary/10 pt-2">
                <span className="text-cafe-text">Payment Method</span>
                <span className="capitalize text-cafe-text">
                  {selectedOrder.paymentMethod}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-cafe-text">Payment Status</span>
                <Badge className={selectedOrder.paymentStatus === "completed" ? "bg-green-500" : "bg-yellow-500"}>
                  {selectedOrder.paymentStatus}
                </Badge>
              </div>
            </div>

            <DialogFooter>
              {selectedOrder.status === "pending" && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => handleCancelOrder(selectedOrder.id)}
                    disabled={isProcessing}
                    className="border-red-500/20 text-red-500 hover:bg-red-500/10"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Cancel Order
                  </Button>
                  <Button
                    onClick={() => handleUpdateStatus(selectedOrder.id, "preparing")}
                    disabled={isProcessing}
                    className="bg-cafe-primary hover:bg-cafe-primary/90"
                  >
                    {isProcessing ? (
                      <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin mr-2" />
                    ) : (
                      <Clock className="mr-2 h-4 w-4" />
                    )}
                    Start Preparing
                  </Button>
                </>
              )}

              {selectedOrder.status === "preparing" && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => handleCancelOrder(selectedOrder.id)}
                    disabled={isProcessing}
                    className="border-red-500/20 text-red-500 hover:bg-red-500/10"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Cancel Order
                  </Button>
                  <Button
                    onClick={() => handleUpdateStatus(selectedOrder.id, "ready")}
                    disabled={isProcessing}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    {isProcessing ? (
                      <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin mr-2" />
                    ) : (
                      <CheckCircle className="mr-2 h-4 w-4" />
                    )}
                    Mark as Ready
                  </Button>
                </>
              )}

              {selectedOrder.status === "ready" && (
                <Button
                  onClick={() => handleUpdateStatus(selectedOrder.id, "delivered")}
                  disabled={isProcessing}
                  className="bg-green-500 hover:bg-green-600"
                >
                  {isProcessing ? (
                    <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin mr-2" />
                  ) : (
                    <CheckCircle className="mr-2 h-4 w-4" />
                  )}
                  Mark as Delivered
                </Button>
              )}

              {(selectedOrder.status === "delivered" || selectedOrder.status === "cancelled") && (
                <Button
                  variant="outline"
                  onClick={() => printOrderReceipt(selectedOrder)}
                  className="border-cafe-primary/20 text-cafe-primary hover:bg-cafe-primary/10"
                >
                  <Printer className="mr-2 h-4 w-4" />
                  Print Receipt
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default OrdersManagerPage;
