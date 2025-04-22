
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Trash2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";

const CartSummary: React.FC = () => {
  const { cart, removeItem, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const isCartEmpty = cart.items.length === 0;

  return (
    <Card className="bg-cafe-surface border-cafe-primary/20">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-cafe-text">
          <ShoppingCart className="mr-2 h-5 w-5" />
          Your Cart
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isCartEmpty ? (
          <div className="text-center py-8 text-cafe-text/70">
            <ShoppingCart className="mx-auto h-12 w-12 mb-3 opacity-50" />
            <p>Your cart is empty</p>
            <p className="text-sm mt-1">Add items from the menu to get started.</p>
          </div>
        ) : (
          <>
            {cart.items.map((item) => (
              <motion.div
                key={item.menuItem.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="flex justify-between items-start gap-4 py-2"
              >
                <div className="flex-grow">
                  <h4 className="font-medium text-cafe-text">{item.menuItem.name}</h4>
                  <div className="flex items-center mt-1">
                    <button
                      onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                      className="text-cafe-primary h-6 w-6 flex items-center justify-center rounded hover:bg-cafe-primary/10"
                    >
                      -
                    </button>
                    <span className="mx-2 text-sm text-cafe-text">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                      className="text-cafe-primary h-6 w-6 flex items-center justify-center rounded hover:bg-cafe-primary/10"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-cafe-text">₹{(item.menuItem.price * item.quantity).toFixed(2)}</div>
                  <button
                    onClick={() => removeItem(item.menuItem.id)}
                    className="text-cafe-primary/70 mt-1 text-xs hover:text-cafe-primary inline-flex items-center"
                  >
                    <Trash2 className="h-3 w-3 mr-1" /> Remove
                  </button>
                </div>
              </motion.div>
            ))}

            <Separator className="my-2 bg-cafe-primary/10" />

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
          </>
        )}
      </CardContent>
      {!isCartEmpty && (
        <CardFooter className="flex-col space-y-2">
          <Button
            onClick={handleCheckout}
            className="w-full bg-cafe-primary hover:bg-cafe-primary/90"
          >
            Proceed to Checkout
          </Button>
          <Button
            variant="outline"
            onClick={clearCart}
            className="w-full border-cafe-primary/20 text-cafe-primary hover:bg-cafe-primary/10"
          >
            Clear Cart
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default CartSummary;
