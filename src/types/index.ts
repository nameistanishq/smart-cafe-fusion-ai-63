
// User related types
export type UserRole = 'student' | 'staff' | 'cafeteria' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  walletBalance?: number;
  profileImage?: string;
  createdAt: Date;
}

// Auth related types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Menu related types
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isAvailable: boolean;
  isVegetarian: boolean;
  isSpicy?: boolean;
  containsAllergens?: string[];
  prepTime: number; // in minutes
  ingredients?: string[];
  rating?: number;
  tags?: string[];
}

export interface MenuCategory {
  id: string;
  name: string;
  image?: string;
  description?: string;
  items: MenuItem[];
}

// Order related types
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

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
  status: OrderStatus;
  paymentMethod: 'cash' | 'card' | 'wallet' | 'upi';
  paymentStatus: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  estimatedDeliveryTime: Date;
}

// Inventory related types
export interface InventoryItem {
  id: string;
  name: string;
  unit: string;
  currentStock: number;
  lowStockThreshold: number;
  price: number;
  lastRestocked: Date;
}

// Waste management types
export interface WasteRecord {
  id: string;
  itemName: string;
  quantity: number;
  reason: string;
  date: Date;
  cost: number;
}

// Analytics types
export interface SalesData {
  date: string;
  revenue: number;
  orders: number;
  averageOrderValue: number;
}

export interface PopularItem {
  id: string;
  name: string;
  totalSold: number;
  revenue: number;
}

export interface Analytics {
  dailySales: SalesData[];
  weeklySales: SalesData[];
  monthlySales: SalesData[];
  popularItems: PopularItem[];
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
}

// Wallet related types
export interface WalletTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'payment';
  description: string;
  date: Date;
  orderId?: string;
}

export interface WalletState {
  balance: number;
  transactions: WalletTransaction[];
  isLoading: boolean;
  error: string | null;
}

// Cart related types
export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
}

// AI Assistant related types
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AiSuggestion {
  title: string;
  description: string;
  type: 'inventory' | 'sales' | 'waste' | 'menu';
  priority: 'low' | 'medium' | 'high';
  date: Date;
}
