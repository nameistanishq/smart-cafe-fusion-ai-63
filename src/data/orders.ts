
import { Order } from "@/types";

export const orders: Order[] = [
  {
    id: "order-1",
    orderNumber: "SC123456",
    userId: "user-1",
    userName: "Raj Kumar",
    items: [
      {
        menuItemId: "item-1",
        name: "Masala Dosa",
        price: 80,
        quantity: 2,
        subtotal: 160
      },
      {
        menuItemId: "item-21",
        name: "Filter Coffee",
        price: 30,
        quantity: 2,
        subtotal: 60
      }
    ],
    subtotal: 220,
    tax: 11,
    total: 231,
    status: "delivered",
    paymentMethod: "wallet",
    paymentStatus: "completed",
    createdAt: new Date(Date.now() - 45 * 60000), // 45 minutes ago
    estimatedDeliveryTime: new Date(Date.now() - 30 * 60000) // 30 minutes ago
  },
  {
    id: "order-2",
    orderNumber: "SC123457",
    userId: "user-2",
    userName: "Priya Sharma",
    items: [
      {
        menuItemId: "item-6",
        name: "Vegetable Biryani",
        price: 120,
        quantity: 1,
        subtotal: 120
      },
      {
        menuItemId: "item-23",
        name: "Buttermilk",
        price: 20,
        quantity: 1,
        subtotal: 20
      }
    ],
    subtotal: 140,
    tax: 7,
    total: 147,
    status: "preparing",
    paymentMethod: "upi",
    paymentStatus: "completed",
    createdAt: new Date(Date.now() - 15 * 60000), // 15 minutes ago
    estimatedDeliveryTime: new Date(Date.now() + 5 * 60000) // 5 minutes from now
  },
  {
    id: "order-3",
    orderNumber: "SC123458",
    userId: "user-1",
    userName: "Raj Kumar",
    items: [
      {
        menuItemId: "item-2",
        name: "Idli Sambar",
        price: 60,
        quantity: 1,
        subtotal: 60
      },
      {
        menuItemId: "item-3",
        name: "Vada",
        price: 40,
        quantity: 2,
        subtotal: 80
      }
    ],
    subtotal: 140,
    tax: 7,
    total: 147,
    status: "confirmed",
    paymentMethod: "card",
    paymentStatus: "completed",
    createdAt: new Date(Date.now() - 5 * 60000), // 5 minutes ago
    estimatedDeliveryTime: new Date(Date.now() + 15 * 60000) // 15 minutes from now
  },
  {
    id: "order-4",
    orderNumber: "SC123459",
    userId: "user-2",
    userName: "Priya Sharma",
    items: [
      {
        menuItemId: "item-18",
        name: "Payasam",
        price: 65,
        quantity: 1,
        subtotal: 65
      }
    ],
    subtotal: 65,
    tax: 3.25,
    total: 68.25,
    status: "pending",
    paymentMethod: "cash",
    paymentStatus: "pending",
    createdAt: new Date(Date.now() - 2 * 60000), // 2 minutes ago
    estimatedDeliveryTime: new Date(Date.now() + 20 * 60000) // 20 minutes from now
  }
];
