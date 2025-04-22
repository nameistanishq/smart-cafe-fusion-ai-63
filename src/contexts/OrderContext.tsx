
import React, { createContext, useContext, useState, useEffect } from "react";
import { Order, OrderStatus } from "@/types";
import { orders as initialOrders } from "@/data/orders";

interface OrderContextType {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  getOrderById: (id: string) => Order | undefined;
  getOrder: (id: string) => Promise<Order>;
  createNewOrder: (orderData: Partial<Order>) => Promise<Order>;
  updateStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  refreshOrders: () => void;
}

const OrderContext = createContext<OrderContextType>({
  orders: [],
  isLoading: true,
  error: null,
  getOrderById: () => undefined,
  getOrder: async () => ({ 
    id: "", 
    orderNumber: "", 
    userId: "", 
    userName: "", 
    items: [], 
    subtotal: 0, 
    tax: 0, 
    total: 0, 
    status: "pending", 
    paymentMethod: "cash", 
    paymentStatus: "pending", 
    createdAt: new Date() 
  }),
  createNewOrder: async () => ({ 
    id: "", 
    orderNumber: "", 
    userId: "", 
    userName: "", 
    items: [], 
    subtotal: 0, 
    tax: 0, 
    total: 0, 
    status: "pending", 
    paymentMethod: "cash", 
    paymentStatus: "pending", 
    createdAt: new Date() 
  }),
  updateStatus: async () => {},
  refreshOrders: () => {},
});

export const useOrder = () => useContext(OrderContext);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      // In a real app, you'd fetch from an API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setOrders(initialOrders);
      setError(null);
    } catch (err) {
      setError("Failed to load orders");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadOrders();
  }, []);

  const getOrderById = (id: string) => {
    return orders.find(order => order.id === id);
  };

  const getOrder = async (id: string): Promise<Order> => {
    const order = orders.find(order => order.id === id);
    if (!order) {
      throw new Error(`Order with ID ${id} not found`);
    }
    return order;
  };

  const createNewOrder = async (orderData: Partial<Order>): Promise<Order> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate order number
      const orderNumber = `ORD${Math.floor(100000 + Math.random() * 900000)}`;
      
      // In a real app, the ID would be generated on the server
      const newOrder: Order = {
        id: `order-${Date.now()}`,
        orderNumber,
        userId: orderData.userId || "guest",
        userName: orderData.userName || "Guest User",
        items: orderData.items || [],
        subtotal: orderData.subtotal || 0,
        tax: orderData.tax || 0,
        total: orderData.total || 0,
        status: orderData.status || "pending",
        paymentMethod: orderData.paymentMethod || "cash",
        paymentStatus: orderData.paymentStatus || "pending",
        createdAt: new Date(),
        estimatedReadyTime: new Date(Date.now() + 20 * 60 * 1000), // 20 minutes from now
        razorpayOrderId: orderData.razorpayOrderId,
      };
      
      setOrders(prevOrders => [...prevOrders, newOrder]);
      return newOrder;
    } catch (err) {
      setError("Failed to create new order");
      console.error(err);
      throw err;
    }
  };

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status } : order
        )
      );
    } catch (err) {
      setError("Failed to update order status");
      console.error(err);
      throw err;
    }
  };

  const refreshOrders = () => {
    loadOrders();
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        isLoading,
        error,
        getOrderById,
        getOrder,
        createNewOrder,
        updateStatus,
        refreshOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
