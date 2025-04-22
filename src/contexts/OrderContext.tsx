
import React, { createContext, useContext, useState, useEffect } from "react";
import { Order, OrderItem } from "@/types";
import { useAuth } from "./AuthContext";

interface OrderContextType {
  orders: Order[];
  isLoading: boolean;
  createNewOrder: (orderData: Omit<Order, "id" | "orderNumber" | "createdAt">) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: Order["status"]) => Promise<Order>;
  cancelOrder: (orderId: string) => Promise<void>;
  getOrderById: (orderId: string) => Order | undefined;
  getUserOrders: () => Order[];
}

const OrderContext = createContext<OrderContextType>({
  orders: [],
  isLoading: true,
  createNewOrder: async () => ({} as Order),
  updateOrderStatus: async () => ({} as Order),
  cancelOrder: async () => {},
  getOrderById: () => undefined,
  getUserOrders: () => [],
});

export const useOrder = () => useContext(OrderContext);

// Generate a 6-digit random order number
const generateOrderNumber = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();

  // Load orders from localStorage
  useEffect(() => {
    try {
      const storedOrders = localStorage.getItem("smartCafeteriaOrders");
      if (storedOrders) {
        const parsedOrders = JSON.parse(storedOrders).map((order: any) => ({
          ...order,
          createdAt: new Date(order.createdAt),
          estimatedReadyTime: order.estimatedReadyTime ? new Date(order.estimatedReadyTime) : undefined,
          completedAt: order.completedAt ? new Date(order.completedAt) : undefined,
        }));
        setOrders(parsedOrders);
      }
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save orders to localStorage when they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("smartCafeteriaOrders", JSON.stringify(orders));
    }
  }, [orders, isLoading]);

  const createNewOrder = async (
    orderData: Omit<Order, "id" | "orderNumber" | "createdAt">
  ): Promise<Order> => {
    const newOrder: Order = {
      ...orderData,
      id: `order_${Date.now()}`,
      orderNumber: generateOrderNumber(),
      createdAt: new Date(),
      estimatedReadyTime: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
    };

    setOrders((prevOrders) => [...prevOrders, newOrder]);
    return newOrder;
  };

  const updateOrderStatus = async (
    orderId: string,
    status: Order["status"]
  ): Promise<Order> => {
    let updatedOrder: Order | undefined;

    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id === orderId) {
          const updates: Partial<Order> = { status };
          
          if (status === "delivered" || status === "cancelled") {
            updates.completedAt = new Date();
          }
          
          updatedOrder = { ...order, ...updates };
          return updatedOrder;
        }
        return order;
      })
    );

    if (!updatedOrder) {
      throw new Error(`Order with id ${orderId} not found`);
    }

    return updatedOrder;
  };

  const cancelOrder = async (orderId: string): Promise<void> => {
    await updateOrderStatus(orderId, "cancelled");
  };

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find((order) => order.id === orderId);
  };

  const getUserOrders = (): Order[] => {
    if (!user) return [];
    return orders
      .filter((order) => order.userId === user.id)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        isLoading,
        createNewOrder,
        updateOrderStatus,
        cancelOrder,
        getOrderById,
        getUserOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
