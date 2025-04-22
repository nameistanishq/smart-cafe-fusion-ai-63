
import { Analytics } from "@/types";

// Helper function to generate dates
const daysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
};

export const analytics: Analytics = {
  dailySales: [
    { date: daysAgo(6), revenue: 5600, orders: 45, averageOrderValue: 124.44 },
    { date: daysAgo(5), revenue: 6200, orders: 52, averageOrderValue: 119.23 },
    { date: daysAgo(4), revenue: 5900, orders: 48, averageOrderValue: 122.92 },
    { date: daysAgo(3), revenue: 7100, orders: 60, averageOrderValue: 118.33 },
    { date: daysAgo(2), revenue: 6800, orders: 54, averageOrderValue: 125.93 },
    { date: daysAgo(1), revenue: 7500, orders: 63, averageOrderValue: 119.05 },
    { date: daysAgo(0), revenue: 4200, orders: 35, averageOrderValue: 120.00 }
  ],
  
  weeklySales: [
    { date: "Week 1", revenue: 35000, orders: 280, averageOrderValue: 125.00 },
    { date: "Week 2", revenue: 38500, orders: 310, averageOrderValue: 124.19 },
    { date: "Week 3", revenue: 41200, orders: 330, averageOrderValue: 124.85 },
    { date: "Week 4", revenue: 43800, orders: 360, averageOrderValue: 121.67 }
  ],
  
  monthlySales: [
    { date: "Jan", revenue: 145000, orders: 1250, averageOrderValue: 116.00 },
    { date: "Feb", revenue: 138000, orders: 1180, averageOrderValue: 116.95 },
    { date: "Mar", revenue: 156000, orders: 1320, averageOrderValue: 118.18 },
    { date: "Apr", revenue: 162000, orders: 1350, averageOrderValue: 120.00 },
    { date: "May", revenue: 175000, orders: 1450, averageOrderValue: 120.69 },
    { date: "Jun", revenue: 183000, orders: 1520, averageOrderValue: 120.39 }
  ],
  
  popularItems: [
    { id: "item-1", name: "Masala Dosa", totalSold: 1250, revenue: 100000 },
    { id: "item-2", name: "Idli Sambar", totalSold: 980, revenue: 58800 },
    { id: "item-6", name: "Vegetable Biryani", totalSold: 750, revenue: 90000 },
    { id: "item-21", name: "Filter Coffee", totalSold: 1800, revenue: 54000 },
    { id: "item-18", name: "Payasam", totalSold: 450, revenue: 29250 }
  ],
  
  totalRevenue: 43300,
  totalOrders: 357,
  averageOrderValue: 121.29
};
