
import React, { createContext, useContext, useState, useEffect } from "react";
import { Analytics, DailySales, PopularItem } from "@/types";
import { useMenu } from "./MenuContext";
import { useOrder } from "./OrderContext";

interface AnalyticsContextType {
  analytics: Analytics | null;
  isLoading: boolean;
  refreshAnalytics: () => void;
}

const AnalyticsContext = createContext<AnalyticsContextType>({
  analytics: null,
  isLoading: true,
  refreshAnalytics: () => {},
});

export const useAnalytics = () => useContext(AnalyticsContext);

// Generate sample analytics data
const generateSampleDailySales = (): DailySales[] => {
  const result: DailySales[] = [];
  const today = new Date();
  
  // Generate data for the last 14 days
  for (let i = 13; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Generate some fluctuating numbers for realism
    // Base revenue between 5000-15000 with some day-of-week patterns
    const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    const baseRevenue = isWeekend ? 
      Math.floor(10000 + Math.random() * 5000) : // Higher on weekends
      Math.floor(5000 + Math.random() * 5000);   // Lower on weekdays
    
    // Apply a general upward trend
    const trendFactor = 1 + (0.05 * (14 - i) / 14); // 5% growth over period
    
    const revenue = Math.floor(baseRevenue * trendFactor);
    // Each order averages around 200-300 rupees
    const orders = Math.floor(revenue / (200 + Math.random() * 100));
    
    result.push({
      date: dateStr,
      revenue,
      orders
    });
  }
  
  return result;
};

const generateSamplePopularItems = (menuItems: any[]): PopularItem[] => {
  return menuItems.map(item => ({
    name: item.name,
    totalSold: Math.floor(20 + Math.random() * 100), // Between 20-120 units
    revenue: Math.floor((20 + Math.random() * 100) * item.price)
  })).sort((a, b) => b.totalSold - a.totalSold);
};

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { menuItems } = useMenu();
  const { orders } = useOrder();

  const refreshAnalytics = () => {
    setIsLoading(true);
    
    try {
      // In a real app, this would call an API to get real-time analytics
      // For now, we'll generate sample data based on our existing data
      
      const dailySales = generateSampleDailySales();
      const popularItems = generateSamplePopularItems(menuItems);
      
      // Calculate total revenue
      const totalRevenue = dailySales.reduce((sum, day) => sum + day.revenue, 0);
      
      // Calculate total orders
      const totalOrders = dailySales.reduce((sum, day) => sum + day.orders, 0);
      
      // Calculate average order value
      const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
      
      setAnalytics({
        dailySales,
        popularItems,
        totalRevenue,
        totalOrders,
        averageOrderValue
      });
    } catch (error) {
      console.error("Failed to refresh analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial analytics load
  useEffect(() => {
    refreshAnalytics();
  }, [menuItems, orders]);

  return (
    <AnalyticsContext.Provider
      value={{
        analytics,
        isLoading,
        refreshAnalytics,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
};
