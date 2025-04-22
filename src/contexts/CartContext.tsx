
import React, { createContext, useContext, useState, useEffect } from "react";
import { MenuItem, CartContextType } from "@/types";

const CartContext = createContext<CartContextType>({
  items: [],
  cart: { items: [], subtotal: 0, tax: 0, total: 0 },
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
});

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<{ menuItem: MenuItem; quantity: number }[]>([]);
  const [cart, setCart] = useState<{
    items: { menuItem: MenuItem; quantity: number }[];
    subtotal: number;
    tax: number;
    total: number;
  }>({
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0,
  });

  // Calculate cart totals whenever items change
  useEffect(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.menuItem.price * item.quantity,
      0
    );
    const tax = subtotal * 0.05; // 5% tax
    const total = subtotal + tax;

    setCart({
      items,
      subtotal,
      tax,
      total,
    });
  }, [items]);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("smartCafeteriaCart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse saved cart:", e);
        localStorage.removeItem("smartCafeteriaCart");
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("smartCafeteriaCart", JSON.stringify(items));
  }, [items]);

  const addItem = (menuItem: MenuItem, quantity: number) => {
    const existingItemIndex = items.findIndex(
      (item) => item.menuItem.id === menuItem.id
    );

    if (existingItemIndex >= 0) {
      // Item already exists, update quantity
      const updatedItems = [...items];
      updatedItems[existingItemIndex].quantity += quantity;
      setItems(updatedItems);
    } else {
      // Item doesn't exist, add new item
      setItems([...items, { menuItem, quantity }]);
    }
  };

  const removeItem = (itemId: string) => {
    setItems(items.filter((item) => item.menuItem.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    setItems(
      items.map((item) =>
        item.menuItem.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        cart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
