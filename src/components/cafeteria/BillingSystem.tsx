
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMenu } from "@/contexts/MenuContext";
import { useOrder } from "@/contexts/OrderContext";
import { MenuItem, OrderItem } from "@/types";
import { Printer, Search, Plus, Minus, Trash2, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BillingSystem: React.FC = () => {
  const { menuItems, isLoading: isMenuLoading } = useMenu();
  const { createNewOrder } = useOrder();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState<
    { menuItem: MenuItem; quantity: number }[]
  >([]);
  const [paymentMethod, setPaymentMethod] = useState<
    "cash" | "card" | "wallet" | "upi"
  >("cash");
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  const addItemToOrder = (menuItem: MenuItem) => {
    const existingItemIndex = selectedItems.findIndex(
      (item) => item.menuItem.id === menuItem.id
    );

    if (existingItemIndex >= 0) {
      // Increase quantity of existing item
      const updatedItems = [...selectedItems];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + 1,
      };
      setSelectedItems(updatedItems);
    } else {
      // Add new item
      setSelectedItems([...selectedItems, { menuItem, quantity: 1 }]);
    }
  };

  const updateQuantity = (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(menuItemId);
      return;
    }

    const updatedItems = selectedItems.map((item) =>
      item.menuItem.id === menuItemId ? { ...item, quantity } : item
    );
    setSelectedItems(updatedItems);
  };

  const removeItem = (menuItemId: string) => {
    const updatedItems = selectedItems.filter(
      (item) => item.menuItem.id !== menuItemId
    );
    setSelectedItems(updatedItems);
  };

  const handlePlaceOrder = async () => {
    if (selectedItems.length === 0) {
      toast({
        variant: "destructive",
        title: "No Items Selected",
        description: "Please add items to the order before proceeding.",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Calculate totals
      const subtotal = selectedItems.reduce(
        (sum, item) => sum + item.menuItem.price * item.quantity,
        0
      );
      const tax = subtotal * 0.05; // 5% tax
      const total = subtotal + tax;

      // Prepare order items
      const orderItems: OrderItem[] = selectedItems.map((item) => ({
        menuItemId: item.menuItem.id,
        name: item.menuItem.name,
        price: item.menuItem.price,
        quantity: item.quantity,
        subtotal: item.menuItem.price * item.quantity,
      }));

      // Create order
      const newOrder = await createNewOrder({
        userId: "counter-sale",
        userName: "Counter Sale",
        items: orderItems,
        subtotal,
        tax,
        total,
        status: "delivered", // Counter sales are immediately delivered
        paymentMethod,
        paymentStatus: "completed", // Counter sales are immediately paid
      });

      // Save the completed order for printing
      setCompletedOrder({
        ...newOrder,
        orderItems,
        subtotal,
        tax,
        total,
      });

      // Show print dialog
      setIsPrintDialogOpen(true);

      // Reset form
      setSelectedItems([]);
      setPaymentMethod("cash");

      toast({
        title: "Order Completed",
        description: `Order #${newOrder.orderNumber} has been processed successfully.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process order. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrintReceipt = () => {
    // In a real implementation, this would trigger actual printing
    // For now, we'll just simulate the printing with a timeout
    setTimeout(() => {
      toast({
        title: "Receipt Printed",
        description: "The receipt has been sent to the printer.",
      });
      setIsPrintDialogOpen(false);
    }, 1000);
  };

  // Filter menu items based on search term
  const filteredItems = menuItems.filter(
    (item) =>
      item.isAvailable &&
      (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Calculate order totals
  const subtotal = selectedItems.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  );
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + tax;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Menu Items Section */}
      <div className="lg:col-span-2">
        <Card className="bg-cafe-surface border-cafe-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-cafe-text">Menu Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cafe-text/50" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search menu items..."
                className="pl-10 bg-cafe-dark border-cafe-primary/20 text-cafe-text"
              />
            </div>

            {isMenuLoading ? (
              <div className="flex justify-center py-8">
                <div className="spinner w-8 h-8"></div>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-8 text-cafe-text/70">
                No menu items found matching your search.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-2">
                {filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.02 }}
                    className="flex bg-cafe-dark rounded-lg overflow-hidden"
                  >
                    <div
                      className="w-16 h-16 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${item.image || "/assets/menu/placeholder.jpg"})`,
                      }}
                    ></div>
                    <div className="flex-1 p-2">
                      <h3 className="font-medium text-cafe-text">{item.name}</h3>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-cafe-primary font-bold">₹{item.price}</span>
                        <Button
                          size="sm"
                          onClick={() => addItemToOrder(item)}
                          className="h-8 w-8 p-0 bg-cafe-primary hover:bg-cafe-primary/90"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order Summary Section */}
      <div>
        <Card className="bg-cafe-surface border-cafe-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-cafe-text">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Current Order
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedItems.length === 0 ? (
              <div className="text-center py-8 text-cafe-text/70">
                <ShoppingCart className="mx-auto h-12 w-12 mb-3 opacity-50" />
                <p>No items added yet</p>
                <p className="text-sm mt-1">
                  Search and add items from the menu
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="max-h-[300px] overflow-y-auto pr-2">
                  {selectedItems.map((item) => (
                    <motion.div
                      key={item.menuItem.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex justify-between items-center gap-2 py-2"
                    >
                      <div className="flex-grow">
                        <h4 className="font-medium text-cafe-text">
                          {item.menuItem.name}
                        </h4>
                        <div className="flex items-center mt-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              updateQuantity(
                                item.menuItem.id,
                                item.quantity - 1
                              )
                            }
                            className="h-6 w-6 p-0 text-cafe-primary"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="mx-2 text-sm text-cafe-text">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              updateQuantity(
                                item.menuItem.id,
                                item.quantity + 1
                              )
                            }
                            className="h-6 w-6 p-0 text-cafe-primary"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-cafe-text">
                          ₹{(item.menuItem.price * item.quantity).toFixed(2)}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.menuItem.id)}
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-600 hover:bg-red-500/10 mt-1"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <Separator className="my-2 bg-cafe-primary/10" />

                <div className="space-y-1 text-cafe-text">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (5%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium pt-1">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-3">
                  <div>
                    <Label
                      htmlFor="payment-method"
                      className="text-cafe-text mb-2 block"
                    >
                      Payment Method
                    </Label>
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={(value) =>
                        setPaymentMethod(
                          value as "cash" | "card" | "wallet" | "upi"
                        )
                      }
                      className="flex flex-wrap gap-2"
                    >
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem
                          value="cash"
                          id="cash"
                          className="border-cafe-primary/50 text-cafe-primary"
                        />
                        <Label htmlFor="cash" className="text-cafe-text">
                          Cash
                        </Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem
                          value="card"
                          id="card"
                          className="border-cafe-primary/50 text-cafe-primary"
                        />
                        <Label htmlFor="card" className="text-cafe-text">
                          Card
                        </Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem
                          value="upi"
                          id="upi"
                          className="border-cafe-primary/50 text-cafe-primary"
                        />
                        <Label htmlFor="upi" className="text-cafe-text">
                          UPI
                        </Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem
                          value="wallet"
                          id="wallet"
                          className="border-cafe-primary/50 text-cafe-primary"
                        />
                        <Label htmlFor="wallet" className="text-cafe-text">
                          Wallet
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              onClick={handlePlaceOrder}
              disabled={
                selectedItems.length === 0 || isProcessing
              }
              className="w-full bg-cafe-primary hover:bg-cafe-primary/90"
            >
              {isProcessing ? (
                <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin mr-2" />
              ) : null}
              {isProcessing
                ? "Processing..."
                : `Checkout (₹${total.toFixed(2)})`}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Print Receipt Dialog */}
      <Dialog open={isPrintDialogOpen} onOpenChange={setIsPrintDialogOpen}>
        <DialogContent className="bg-cafe-surface border-cafe-primary/20 text-cafe-text">
          <DialogHeader>
            <DialogTitle>Print Receipt</DialogTitle>
            <DialogDescription className="text-cafe-text/70">
              Review the order details before printing.
            </DialogDescription>
          </DialogHeader>

          {completedOrder && (
            <div className="py-3 max-h-[400px] overflow-y-auto">
              <div className="text-center mb-3">
                <h2 className="font-bold text-xl text-cafe-text">
                  Smart Cafeteria
                </h2>
                <p className="text-cafe-text/70 text-sm">Receipt</p>
              </div>

              <div className="flex justify-between text-sm mb-2">
                <span className="text-cafe-text/70">Order #:</span>
                <span className="font-medium text-cafe-text">
                  {completedOrder.orderNumber}
                </span>
              </div>

              <div className="flex justify-between text-sm mb-3">
                <span className="text-cafe-text/70">Date:</span>
                <span className="text-cafe-text">
                  {new Date(completedOrder.createdAt).toLocaleString()}
                </span>
              </div>

              <Separator className="my-2 bg-cafe-primary/10" />

              <div className="space-y-2 mb-3">
                {completedOrder.items.map((item: OrderItem) => (
                  <div
                    key={item.menuItemId}
                    className="flex justify-between text-cafe-text"
                  >
                    <span>
                      {item.quantity} x {item.name}
                    </span>
                    <span>₹{item.subtotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <Separator className="my-2 bg-cafe-primary/10" />

              <div className="space-y-1 text-cafe-text">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹{completedOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax (5%)</span>
                  <span>₹{completedOrder.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium pt-1">
                  <span>Total</span>
                  <span>₹{completedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-3 text-center">
                <div className="text-cafe-text mb-1">
                  Payment Method:{" "}
                  <span className="capitalize">
                    {completedOrder.paymentMethod}
                  </span>
                </div>
                <p className="text-cafe-text/70 text-sm">
                  Thank you for dining with us!
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPrintDialogOpen(false)}
              className="border-cafe-primary/20 text-cafe-primary hover:bg-cafe-primary/10"
            >
              Close
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

export default BillingSystem;
