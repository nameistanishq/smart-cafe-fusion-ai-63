
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useMenu } from "@/contexts/MenuContext";
import { useOrder } from "@/contexts/OrderContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  CreditCard,
  Wallet,
  DollarSign,
  BadgeIndianRupee,
  Printer,
  CheckCircle,
} from "lucide-react";
import { MenuItem } from "@/types";

const BillingPage: React.FC = () => {
  const { menuItems } = useMenu();
  const { createNewOrder } = useOrder();
  const { toast } = useToast();
  const printRef = useRef<HTMLDivElement>(null);

  const [selectedItems, setSelectedItems] = useState<
    {
      menuItem: MenuItem;
      quantity: number;
    }[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<
    "cash" | "card" | "wallet" | "upi"
  >("cash");
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  // Get available categories
  const categories = Array.from(
    new Set(menuItems.map((item) => item.category))
  ).sort();

  // Filter menu items based on search term
  const filteredItems = menuItems.filter(
    (item) =>
      item.isAvailable &&
      (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ))
  );

  // Subtotal calculation
  const subtotal = selectedItems.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  );

  // Tax calculation
  const taxRate = 0.05; // 5% tax
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;

  const handleAddItem = (menuItem: MenuItem) => {
    const existingItem = selectedItems.find(
      (item) => item.menuItem.id === menuItem.id
    );

    if (existingItem) {
      setSelectedItems(
        selectedItems.map((item) =>
          item.menuItem.id === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setSelectedItems([...selectedItems, { menuItem, quantity: 1 }]);
    }
  };

  const handleUpdateQuantity = (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(menuItemId);
      return;
    }

    setSelectedItems(
      selectedItems.map((item) =>
        item.menuItem.id === menuItemId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (menuItemId: string) => {
    setSelectedItems(
      selectedItems.filter((item) => item.menuItem.id !== menuItemId)
    );
  };

  const handleClearBill = () => {
    setSelectedItems([]);
  };

  const handleProcessOrder = async () => {
    try {
      setIsProcessing(true);

      if (selectedItems.length === 0) {
        toast({
          title: "No Items Selected",
          description: "Please add items to the bill before processing.",
          variant: "destructive",
        });
        return;
      }

      // Prepare order items
      const orderItems = selectedItems.map((item) => ({
        menuItemId: item.menuItem.id,
        name: item.menuItem.name,
        price: item.menuItem.price,
        quantity: item.quantity,
        subtotal: item.menuItem.price * item.quantity,
      }));

      // Create new order
      const newOrder = await createNewOrder({
        userId: "counter-sale",
        userName: "Counter Sale",
        items: orderItems,
        subtotal,
        tax: taxAmount,
        total,
        status: "delivered", // Counter sales are immediately delivered
        paymentMethod,
        paymentStatus: "completed", // Counter sales are immediately paid
      });

      // Save order details for receipt printing
      setCompletedOrder({
        ...newOrder,
        orderItems,
        subtotal,
        tax: taxAmount,
        total,
        paymentMethodDisplay: {
          cash: "Cash",
          card: "Card",
          wallet: "E-Wallet",
          upi: "UPI",
        }[paymentMethod],
      });

      // Show print dialog
      setIsPrintDialogOpen(true);

      toast({
        title: "Order Processed",
        description: `Order #${newOrder.orderNumber} has been processed successfully.`,
      });
    } catch (error) {
      console.error("Error processing order:", error);
      toast({
        title: "Processing Failed",
        description: "An error occurred while processing the order.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrintReceipt = () => {
    if (printRef.current) {
      // Create a new window for printing
      const printWindow = window.open("", "_blank", "width=800,height=600");

      if (printWindow) {
        const printContent = printRef.current.innerHTML;

        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Smart Cafeteria - Receipt</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  padding: 20px;
                  max-width: 300px;
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
                    width: 58mm; /* Standard thermal receipt width */
                  }
                }
              </style>
            </head>
            <body>
              ${printContent}
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

        // Reset the billing interface
        setSelectedItems([]);
        setIsPrintDialogOpen(false);
      }
    }
  };

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  return (
    <div className="pb-6">
      <h1 className="text-2xl font-bold mb-6 text-cafe-text">Billing System</h1>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Menu Section - Left Side */}
        <div className="md:col-span-7">
          <Card className="bg-cafe-surface border-cafe-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-cafe-text">Menu Items</CardTitle>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cafe-text/50" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for items..."
                  className="pl-10 bg-cafe-dark border-cafe-primary/20 text-cafe-text"
                />
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={categories[0]} className="w-full">
                <div className="mb-4 overflow-auto scrollbar-hide">
                  <TabsList className="bg-cafe-dark/50">
                    {categories.map((category) => (
                      <TabsTrigger
                        key={category}
                        value={category}
                        className="data-[state=active]:bg-cafe-primary data-[state=active]:text-white"
                      >
                        {category}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                {categories.map((category) => (
                  <TabsContent key={category} value={category}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-3">
                      {filteredItems
                        .filter((item) => item.category === category)
                        .map((item) => (
                          <Card
                            key={item.id}
                            className="cursor-pointer hover:bg-cafe-primary/5 transition-colors border-cafe-primary/20 bg-cafe-dark/20"
                            onClick={() => handleAddItem(item)}
                          >
                            <CardContent className="p-3 flex justify-between items-center">
                              <div>
                                <p className="font-medium text-cafe-text">
                                  {item.name}
                                </p>
                                <p className="text-sm text-cafe-text/70">
                                  ₹{item.price.toFixed(2)}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddItem(item);
                                }}
                                className="h-8 w-8 text-cafe-primary hover:bg-cafe-primary/10"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                    </div>

                    {filteredItems.filter((item) => item.category === category)
                      .length === 0 && (
                      <div className="text-center py-8 text-cafe-text/70">
                        No items available in this category
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Bill Section - Right Side */}
        <div className="md:col-span-5">
          <Card className="bg-cafe-surface border-cafe-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-cafe-text">
                <div className="flex items-center">
                  <ShoppingCart className="mr-2 h-5 w-5 text-cafe-primary" />
                  Current Bill
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearBill}
                  className="border-cafe-primary/20 text-cafe-primary hover:bg-cafe-primary/10"
                >
                  Clear Bill
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedItems.length === 0 ? (
                <div className="text-center py-8 text-cafe-text/70">
                  <ShoppingCart className="mx-auto h-12 w-12 text-cafe-text/20 mb-3" />
                  <p>No items added to the bill yet</p>
                </div>
              ) : (
                <>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {selectedItems.map((item) => (
                      <div
                        key={item.menuItem.id}
                        className="flex items-center justify-between py-2 border-b border-cafe-primary/10"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-cafe-text">
                            {item.menuItem.name}
                          </p>
                          <p className="text-sm text-cafe-text/70">
                            ₹{item.menuItem.price.toFixed(2)} x {item.quantity}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleUpdateQuantity(
                                item.menuItem.id,
                                item.quantity - 1
                              )
                            }
                            className="h-7 w-7 text-cafe-primary hover:bg-cafe-primary/10"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-5 text-center text-cafe-text">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleUpdateQuantity(
                                item.menuItem.id,
                                item.quantity + 1
                              )
                            }
                            className="h-7 w-7 text-cafe-primary hover:bg-cafe-primary/10"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveItem(item.menuItem.id)}
                            className="h-7 w-7 text-red-500 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="ml-2 w-20 text-right">
                          <p className="font-medium text-cafe-text">
                            ₹{(item.menuItem.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 space-y-2">
                    <div className="flex justify-between text-cafe-text">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-cafe-text">
                      <span>Tax (5%)</span>
                      <span>₹{taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg text-cafe-text pt-2 border-t border-cafe-primary/20">
                      <span>Total</span>
                      <span className="text-cafe-primary">
                        ₹{total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Label className="mb-2 block text-cafe-text">
                      Payment Method
                    </Label>
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={(value) =>
                        setPaymentMethod(value as typeof paymentMethod)
                      }
                      className="flex flex-wrap gap-2"
                    >
                      <div className="flex-1 min-w-[100px]">
                        <RadioGroup.Item
                          value="cash"
                          id="payment-cash"
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor="payment-cash"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-cafe-primary/20 bg-cafe-dark p-3 hover:bg-cafe-primary/5 hover:text-cafe-primary peer-data-[state=checked]:border-cafe-primary peer-data-[state=checked]:text-cafe-primary cursor-pointer"
                        >
                          <DollarSign className="mb-1 h-5 w-5" />
                          <span className="text-sm font-medium">Cash</span>
                        </Label>
                      </div>
                      <div className="flex-1 min-w-[100px]">
                        <RadioGroup.Item
                          value="card"
                          id="payment-card"
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor="payment-card"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-cafe-primary/20 bg-cafe-dark p-3 hover:bg-cafe-primary/5 hover:text-cafe-primary peer-data-[state=checked]:border-cafe-primary peer-data-[state=checked]:text-cafe-primary cursor-pointer"
                        >
                          <CreditCard className="mb-1 h-5 w-5" />
                          <span className="text-sm font-medium">Card</span>
                        </Label>
                      </div>
                      <div className="flex-1 min-w-[100px]">
                        <RadioGroup.Item
                          value="wallet"
                          id="payment-wallet"
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor="payment-wallet"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-cafe-primary/20 bg-cafe-dark p-3 hover:bg-cafe-primary/5 hover:text-cafe-primary peer-data-[state=checked]:border-cafe-primary peer-data-[state=checked]:text-cafe-primary cursor-pointer"
                        >
                          <Wallet className="mb-1 h-5 w-5" />
                          <span className="text-sm font-medium">E-Wallet</span>
                        </Label>
                      </div>
                      <div className="flex-1 min-w-[100px]">
                        <RadioGroup.Item
                          value="upi"
                          id="payment-upi"
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor="payment-upi"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-cafe-primary/20 bg-cafe-dark p-3 hover:bg-cafe-primary/5 hover:text-cafe-primary peer-data-[state=checked]:border-cafe-primary peer-data-[state=checked]:text-cafe-primary cursor-pointer"
                        >
                          <BadgeIndianRupee className="mb-1 h-5 w-5" />
                          <span className="text-sm font-medium">UPI</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Button
                    onClick={handleProcessOrder}
                    disabled={isProcessing || selectedItems.length === 0}
                    className="w-full mt-4 bg-cafe-primary hover:bg-cafe-primary/90 text-white h-11"
                  >
                    {isProcessing ? (
                      <>
                        <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>Process Payment</>
                    )}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Print Receipt Dialog */}
      <Dialog open={isPrintDialogOpen} onOpenChange={setIsPrintDialogOpen}>
        <DialogContent className="bg-cafe-surface border-cafe-primary/20 text-cafe-text">
          <DialogHeader>
            <DialogTitle className="flex items-center text-cafe-text">
              <Printer className="mr-2 h-5 w-5 text-cafe-primary" />
              Print Receipt
            </DialogTitle>
          </DialogHeader>

          <div className="flex items-center justify-center py-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white text-black p-6 rounded-md shadow-lg max-w-md"
            >
              <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-2" />
              <h3 className="text-lg font-medium text-center mb-4">
                Order Completed Successfully!
              </h3>
              <p className="text-center mb-6">
                Order #{completedOrder?.orderNumber} has been processed. Would
                you like to print a receipt?
              </p>

              {/* Hidden receipt for printing */}
              <div
                ref={printRef}
                className="hidden"
              >
                <div className="receipt-header">
                  <h2>Smart Cafeteria</h2>
                  <p>Campus Cafeteria, India</p>
                  <p>Tel: 1234567890</p>
                </div>

                <div className="separator"></div>

                <div className="order-info">
                  <div>
                    <span>Order #:</span>
                    <span>{completedOrder?.orderNumber}</span>
                  </div>
                  <div>
                    <span>Date:</span>
                    <span>
                      {completedOrder?.createdAt
                        ? formatDateTime(new Date(completedOrder.createdAt))
                        : ""}
                    </span>
                  </div>
                  <div>
                    <span>Payment:</span>
                    <span>{completedOrder?.paymentMethodDisplay}</span>
                  </div>
                </div>

                <div className="separator"></div>

                <div className="items">
                  {completedOrder?.items.map((item: any, index: number) => (
                    <div key={index} className="item">
                      <span>
                        {item.quantity} x {item.name}
                      </span>
                      <span>₹{item.subtotal.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="separator"></div>

                <div className="total-section">
                  <div>
                    <span>Subtotal:</span>
                    <span>₹{completedOrder?.subtotal.toFixed(2)}</span>
                  </div>
                  <div>
                    <span>Tax (5%):</span>
                    <span>₹{completedOrder?.tax.toFixed(2)}</span>
                  </div>
                  <div className="grand-total">
                    <span>Total:</span>
                    <span>₹{completedOrder?.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="separator"></div>

                <div className="footer">
                  <p>Thank you for your purchase!</p>
                  <p>Please come again</p>
                </div>
              </div>
            </motion.div>
          </div>

          <DialogFooter className="flex space-x-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsPrintDialogOpen(false)}
              className="border-cafe-primary/20 text-cafe-text hover:bg-cafe-primary/10"
            >
              No, Skip
            </Button>
            <Button
              onClick={handlePrintReceipt}
              className="bg-cafe-primary hover:bg-cafe-primary/90"
            >
              <Printer className="mr-2 h-4 w-4" />
              Print Receipt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BillingPage;
