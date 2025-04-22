
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
  isVegetarian?: boolean;
  isSpicy?: boolean;
  prepTime?: number;
  rating?: number;
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  image?: string;
}

// Order Types
export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export type OrderStatus = "pending" | "confirmed" | "preparing" | "ready" | "delivered" | "cancelled";

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
  paymentMethod: "cash" | "card" | "wallet" | "upi";
  paymentStatus: "pending" | "completed" | "failed";
  createdAt: Date;
  estimatedReadyTime?: Date;
  estimatedDeliveryTime?: Date;
  completedAt?: Date;
  razorpayOrderId?: string;
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

// Transaction Types
export interface Transaction {
  id: string;
  userId: string;
  type: "credit" | "debit";
  amount: number;
  description: string;
  createdAt: Date;
  status: "completed" | "pending" | "failed";
}

// Analytics Types
export interface DailySales {
  date: string;
  revenue: number;
  orders: number;
  averageOrderValue?: number;
}

export interface PopularItem {
  id?: string;
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
  weeklySales?: any[];
  monthlySales?: any[];
}

// AI Suggestion Types
export interface AiSuggestion {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  type?: string;
  date?: Date;
}

// Chat Message Types
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// Context Types
export interface MenuContextType {
  menuItems: MenuItem[];
  menuCategories: MenuCategory[];
  isLoading: boolean;
  error: string | null;
  getMenuItemById: (id: string) => MenuItem | undefined;
  updateItemAvailability: (id: string, isAvailable: boolean) => Promise<void>;
  addNewMenuItem: (item: Omit<MenuItem, "id">) => Promise<void>;
  refreshMenu: () => void;
}

export interface CartContextType {
  items: { menuItem: MenuItem; quantity: number }[];
  cart: {
    items: { menuItem: MenuItem; quantity: number }[];
    subtotal: number;
    tax: number;
    total: number;
  };
  addItem: (item: MenuItem, quantity: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}

export interface OrderContextType {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  getOrderById: (id: string) => Order | undefined;
  getOrder: (id: string) => Promise<Order>;
  createNewOrder: (orderData: Partial<Order>) => Promise<Order>;
  updateStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  refreshOrders: () => void;
}

export interface WalletContextType {
  balance: number;
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  addTransaction: (type: "credit" | "debit" | "payment" | "deposit", amount: number, description: string) => Promise<void>;
  refreshWallet: () => void;
}
