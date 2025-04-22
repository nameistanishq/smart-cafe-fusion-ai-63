
import { Order } from "@/types";

export const orders: Order[] = [
  {
    id: "order-1",
    orderNumber: "ORD123456",
    userId: "s1",
    userName: "Alex Student",
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
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    estimatedReadyTime: new Date(Date.now() - 23.5 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 23.4 * 60 * 60 * 1000)
  },
  {
    id: "order-2",
    orderNumber: "ORD234567",
    userId: "s1",
    userName: "Alex Student",
    items: [
      {
        menuItemId: "item-2",
        name: "Idli Sambar",
        price: 60,
        quantity: 1,
        subtotal: 60
      },
      {
        menuItemId: "item-22",
        name: "Masala Chai",
        price: 25,
        quantity: 1,
        subtotal: 25
      }
    ],
    subtotal: 85,
    tax: 4.25,
    total: 89.25,
    status: "delivered",
    paymentMethod: "card",
    paymentStatus: "completed",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    estimatedReadyTime: new Date(Date.now() - 1.95 * 24 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 1.9 * 24 * 60 * 60 * 1000)
  },
  {
    id: "order-3",
    orderNumber: "ORD345678",
    userId: "s2",
    userName: "Taylor Staff",
    items: [
      {
        menuItemId: "item-6",
        name: "Vegetable Biryani",
        price: 120,
        quantity: 1,
        subtotal: 120
      }
    ],
    subtotal: 120,
    tax: 6,
    total: 126,
    status: "ready",
    paymentMethod: "wallet",
    paymentStatus: "completed",
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    estimatedReadyTime: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now
  },
  {
    id: "order-4",
    orderNumber: "ORD456789",
    userId: "s2",
    userName: "Taylor Staff",
    items: [
      {
        menuItemId: "item-8",
        name: "Vada Sambar",
        price: 50,
        quantity: 2,
        subtotal: 100
      },
      {
        menuItemId: "item-21",
        name: "Filter Coffee",
        price: 30,
        quantity: 1,
        subtotal: 30
      }
    ],
    subtotal: 130,
    tax: 6.5,
    total: 136.5,
    status: "preparing",
    paymentMethod: "cash",
    paymentStatus: "completed",
    createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    estimatedReadyTime: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes from now
  },
  {
    id: "order-5",
    orderNumber: "ORD567890",
    userId: "guest-user",
    userName: "Guest User",
    items: [
      {
        menuItemId: "item-5",
        name: "Bisi Bele Bath",
        price: 90,
        quantity: 1,
        subtotal: 90
      }
    ],
    subtotal: 90,
    tax: 4.5,
    total: 94.5,
    status: "confirmed",
    paymentMethod: "upi",
    paymentStatus: "completed",
    createdAt: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    estimatedReadyTime: new Date(Date.now() + 20 * 60 * 1000) // 20 minutes from now
  }
];
