
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Order, OrderStatus } from '@/types';
import { getOrders, createOrder, updateOrderStatus, getOrderById } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface OrderContextProps {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  refreshOrders: () => Promise<void>;
  createNewOrder: (order: Omit<Order, "id" | "orderNumber" | "createdAt" | "estimatedDeliveryTime">) => Promise<Order>;
  updateStatus: (id: string, status: OrderStatus) => Promise<void>;
  getOrder: (id: string) => Promise<Order>;
}

const OrderContext = createContext<OrderContextProps | undefined>(undefined);

interface OrderProviderProps {
  children: ReactNode;
}

export const OrderProvider = ({ children }: OrderProviderProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const ordersData = await getOrders();
      setOrders(ordersData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load orders';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Orders Loading Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const refreshOrders = async () => {
    await fetchOrders();
  };

  const createNewOrder = async (orderData: Omit<Order, "id" | "orderNumber" | "createdAt" | "estimatedDeliveryTime">) => {
    try {
      const newOrder = await createOrder(orderData);
      
      // Update local state
      setOrders(prevOrders => [newOrder, ...prevOrders]);
      
      toast({
        title: "Order Created",
        description: `Order #${newOrder.orderNumber} has been created successfully.`,
      });
      
      return newOrder;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create order';
      toast({
        variant: "destructive",
        title: "Order Creation Failed",
        description: errorMessage,
      });
      throw err;
    }
  };

  const updateStatus = async (id: string, status: OrderStatus) => {
    try {
      const updatedOrder = await updateOrderStatus(id, status);
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === id ? { ...order, status } : order
        )
      );
      
      toast({
        title: "Order Updated",
        description: `Order #${updatedOrder.orderNumber} status changed to ${status}.`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update order status';
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: errorMessage,
      });
    }
  };

  const getOrder = async (id: string) => {
    try {
      return await getOrderById(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch order';
      toast({
        variant: "destructive",
        title: "Order Fetch Failed",
        description: errorMessage,
      });
      throw err;
    }
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        isLoading,
        error,
        refreshOrders,
        createNewOrder,
        updateStatus,
        getOrder
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
