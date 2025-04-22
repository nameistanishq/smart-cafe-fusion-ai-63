
import { 
  User, 
  MenuItem, 
  MenuCategory, 
  Order, 
  OrderStatus, 
  InventoryItem,
  WasteRecord,
  Analytics,
  WalletTransaction,
  AiSuggestion
} from "@/types";

// Mock data
import { users } from "@/data/users";
import { menuItems } from "@/data/menuItems";
import { menuCategories } from "@/data/menuCategories";
import { orders } from "@/data/orders";
import { inventoryItems } from "@/data/inventoryItems";
import { wasteRecords } from "@/data/wasteRecords";
import { analytics } from "@/data/analytics";
import { walletTransactions } from "@/data/walletTransactions";
import { aiSuggestions } from "@/data/aiSuggestions";

// Helper to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Auth API
export const loginUser = async (email: string, password: string): Promise<User> => {
  await delay(800);
  
  const user = users.find(u => u.email === email);
  
  if (!user) {
    throw new Error("Invalid email or password");
  }
  
  // In a real app, we would validate the password here
  
  return user;
};

export const logoutUser = async (): Promise<void> => {
  await delay(500);
  return;
};

// Menu API
export const getMenuItems = async (): Promise<MenuItem[]> => {
  await delay(700);
  return menuItems;
};

export const getMenuCategories = async (): Promise<MenuCategory[]> => {
  await delay(700);
  return menuCategories;
};

export const updateMenuItemAvailability = async (id: string, isAvailable: boolean): Promise<MenuItem> => {
  await delay(600);
  
  const menuItem = menuItems.find(item => item.id === id);
  
  if (!menuItem) {
    throw new Error("Menu item not found");
  }
  
  menuItem.isAvailable = isAvailable;
  return menuItem;
};

export const addMenuItem = async (newItem: Omit<MenuItem, "id">): Promise<MenuItem> => {
  await delay(800);
  
  const id = `item-${menuItems.length + 1}`;
  const menuItem: MenuItem = {
    id,
    ...newItem
  };
  
  menuItems.push(menuItem);
  
  // Find category and add item to it
  const category = menuCategories.find(cat => cat.id === newItem.category);
  if (category) {
    category.items.push(menuItem);
  }
  
  return menuItem;
};

// Order API
export const getOrders = async (): Promise<Order[]> => {
  await delay(700);
  return orders;
};

export const getOrderById = async (id: string): Promise<Order> => {
  await delay(500);
  
  const order = orders.find(o => o.id === id);
  
  if (!order) {
    throw new Error("Order not found");
  }
  
  return order;
};

export const createOrder = async (order: Omit<Order, "id" | "orderNumber" | "createdAt" | "estimatedDeliveryTime">): Promise<Order> => {
  await delay(1000);
  
  const id = `order-${orders.length + 1}`;
  const orderNumber = Math.floor(100000 + Math.random() * 900000).toString();
  const createdAt = new Date();
  const estimatedDeliveryTime = new Date(createdAt.getTime() + 15 * 60000); // 15 minutes from now
  
  const newOrder: Order = {
    id,
    orderNumber,
    createdAt,
    estimatedDeliveryTime,
    ...order
  };
  
  orders.unshift(newOrder);
  
  return newOrder;
};

export const updateOrderStatus = async (id: string, status: OrderStatus): Promise<Order> => {
  await delay(600);
  
  const order = orders.find(o => o.id === id);
  
  if (!order) {
    throw new Error("Order not found");
  }
  
  order.status = status;
  return order;
};

// Inventory API
export const getInventoryItems = async (): Promise<InventoryItem[]> => {
  await delay(700);
  return inventoryItems;
};

export const updateInventoryItem = async (id: string, updates: Partial<InventoryItem>): Promise<InventoryItem> => {
  await delay(600);
  
  const item = inventoryItems.find(i => i.id === id);
  
  if (!item) {
    throw new Error("Inventory item not found");
  }
  
  Object.assign(item, updates);
  return item;
};

export const addInventoryItem = async (newItem: Omit<InventoryItem, "id">): Promise<InventoryItem> => {
  await delay(800);
  
  const id = `inventory-${inventoryItems.length + 1}`;
  const inventoryItem: InventoryItem = {
    id,
    ...newItem
  };
  
  inventoryItems.push(inventoryItem);
  return inventoryItem;
};

// Waste Management API
export const getWasteRecords = async (): Promise<WasteRecord[]> => {
  await delay(700);
  return wasteRecords;
};

export const addWasteRecord = async (record: Omit<WasteRecord, "id">): Promise<WasteRecord> => {
  await delay(600);
  
  const id = `waste-${wasteRecords.length + 1}`;
  const wasteRecord: WasteRecord = {
    id,
    ...record
  };
  
  wasteRecords.push(wasteRecord);
  return wasteRecord;
};

// Analytics API
export const getAnalytics = async (): Promise<Analytics> => {
  await delay(1000);
  return analytics;
};

// Wallet API
export const getWalletBalance = async (userId: string): Promise<number> => {
  await delay(500);
  
  const user = users.find(u => u.id === userId);
  
  if (!user || typeof user.walletBalance === 'undefined') {
    throw new Error("User wallet not found");
  }
  
  return user.walletBalance;
};

export const getWalletTransactions = async (userId: string): Promise<WalletTransaction[]> => {
  await delay(700);
  return walletTransactions.filter(t => t.userId === userId);
};

export const addWalletTransaction = async (transaction: Omit<WalletTransaction, "id" | "date">): Promise<WalletTransaction> => {
  await delay(800);
  
  const id = `transaction-${walletTransactions.length + 1}`;
  const date = new Date();
  
  const newTransaction: WalletTransaction = {
    id,
    date,
    ...transaction
  };
  
  walletTransactions.push(newTransaction);
  
  // Update user balance
  const user = users.find(u => u.id === transaction.userId);
  
  if (user && typeof user.walletBalance !== 'undefined') {
    if (transaction.type === 'deposit') {
      user.walletBalance += transaction.amount;
    } else if (transaction.type === 'withdrawal' || transaction.type === 'payment') {
      user.walletBalance -= transaction.amount;
    }
  }
  
  return newTransaction;
};

// AI Suggestions API
export const getAiSuggestions = async (): Promise<AiSuggestion[]> => {
  await delay(800);
  return aiSuggestions;
};

// Chat API
export const getChatResponse = async (userMessage: string, menuContext: MenuItem[]): Promise<string> => {
  await delay(1000);
  
  const lowerMessage = userMessage.toLowerCase();
  
  // Simple response logic
  if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest')) {
    const availableItems = menuItems.filter(item => item.isAvailable);
    const randomItem = availableItems[Math.floor(Math.random() * availableItems.length)];
    return `I recommend trying our ${randomItem.name}. It's one of our most popular dishes! Would you like to order it?`;
  }
  
  if (lowerMessage.includes('diabetes') || lowerMessage.includes('diabetic')) {
    const lowSugarItems = menuItems.filter(item => 
      item.isAvailable && 
      item.tags?.includes('low-sugar')
    );
    
    if (lowSugarItems.length > 0) {
      const suggestions = lowSugarItems.slice(0, 3).map(item => item.name).join(', ');
      return `For diabetic-friendly options, I'd recommend: ${suggestions}. These items are low in sugar and suitable for people managing diabetes.`;
    } else {
      return `I recommend plain dosa, idli with sambar (no sugar), or vegetable upma as they're generally lower in sugar content. Please inform the cafeteria staff about your dietary requirements for personalized suggestions.`;
    }
  }
  
  // Order handling
  const orderMatch = lowerMessage.match(/order\s+(.+)/i);
  if (orderMatch) {
    const itemName = orderMatch[1].toLowerCase();
    const matchedItem = menuItems.find(item => 
      item.name.toLowerCase().includes(itemName) && item.isAvailable
    );
    
    if (matchedItem) {
      return `I've added ${matchedItem.name} to your cart. Would you like to add anything else or proceed to checkout?`;
    } else {
      return `I couldn't find ${itemName} in our available menu items. Would you like me to suggest something similar?`;
    }
  }
  
  // Default response
  return `How can I assist you with your order today? I can recommend dishes, provide information about menu items, or help you place an order.`;
};

// Razorpay API
export const createRazorpayOrder = async (amount: number): Promise<{id: string, amount: number}> => {
  await delay(800);
  
  return {
    id: `rzp_order_${Math.random().toString(36).substring(7)}`,
    amount: amount
  };
};

export const verifyRazorpayPayment = async (
  paymentId: string, 
  orderId: string, 
  signature: string
): Promise<boolean> => {
  await delay(800);
  // In a real app, we would verify the signature here
  return true;
};
