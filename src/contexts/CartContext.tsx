
import React, { createContext, useContext, useState, useEffect } from "react";
import { MenuItem } from "@/types";
import { useMenu } from "./MenuContext";
import { useAuth } from "./AuthContext";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (menuItem: MenuItem, quantity: number) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  count: number;
}

const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  total: 0,
  count: 0,
});

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  const { menuItems } = useMenu();

  // Load cart from localStorage when component mounts
  useEffect(() => {
    const userId = user?.id || "guest";
    const savedCart = localStorage.getItem(`smartCafeteria_cart_${userId}`);

    if (savedCart) {
      try {
        const parsedCart: CartItem[] = JSON.parse(savedCart);
        
        // Ensure we have the latest menu item data
        const validatedCart = parsedCart.filter(cartItem => {
          const menuItem = menuItems.find(item => item.id === cartItem.menuItem.id);
          return menuItem && menuItem.isAvailable;
        }).map(cartItem => {
          const menuItem = menuItems.find(item => item.id === cartItem.menuItem.id);
          return {
            ...cartItem,
            menuItem: menuItem || cartItem.menuItem
          };
        });
        
        setItems(validatedCart);
      } catch (e) {
        console.error("Failed to parse cart:", e);
      }
    }
  }, [user, menuItems]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    const userId = user?.id || "guest";
    localStorage.setItem(`smartCafeteria_cart_${userId}`, JSON.stringify(items));
  }, [items, user]);

  const addItem = (menuItem: MenuItem, quantity: number) => {
    if (!menuItem.isAvailable) {
      toast({
        title: "Item Unavailable",
        description: `${menuItem.name} is currently unavailable.`,
        variant: "destructive",
      });
      return;
    }

    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.menuItem.id === menuItem.id
      );

      if (existingItem) {
        return prevItems.map((item) =>
          item.menuItem.id === menuItem.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevItems, { menuItem, quantity }];
      }
    });

    toast({
      title: "Added to Cart",
      description: `${quantity} ${menuItem.name} added to your cart.`,
    });
  };

  const removeItem = (menuItemId: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.menuItem.id !== menuItemId)
    );
  };

  const updateQuantity = (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(menuItemId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.menuItem.id === menuItemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  );

  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        count,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
