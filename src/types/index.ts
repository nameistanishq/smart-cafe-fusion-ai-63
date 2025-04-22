
// User Types
export type UserRole = "student" | "staff" | "cafeteria" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  walletBalance: number;
  profileImage?: string;
}

// Menu Types
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  isAvailable: boolean;
  image: string;
  ingredients: string[];
}

// Order Types
export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  userName: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: "pending" | "preparing" | "ready" | "delivered" | "cancelled";
  paymentMethod: "cash" | "card" | "wallet" | "upi";
  paymentStatus: "pending" | "completed" | "failed";
  createdAt: Date;
  estimatedReadyTime?: Date;
  completedAt?: Date;
}

// Inventory Types
export interface InventoryItem {
  id: string;
  name: string;
  unit: string;
  currentStock: number;
  lowStockThreshold: number;
  price: number;
  lastRestocked: Date;
}

// Waste Management Types
export interface WasteRecord {
  id: string;
  itemName: string;
  quantity: number;
  reason: string;
  date: Date;
  cost: number;
}

// Analytics Types
export interface DailySales {
  date: string;
  revenue: number;
  orders: number;
}

export interface PopularItem {
  name: string;
  totalSold: number;
  revenue: number;
}

export interface Analytics {
  dailySales: DailySales[];
  popularItems: PopularItem[];
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
}

// AI Suggestion Types
export interface AiSuggestion {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
}

// Chat Message Types
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}
