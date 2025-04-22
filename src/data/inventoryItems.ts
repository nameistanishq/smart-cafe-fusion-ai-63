
import { InventoryItem } from "@/types";

export const inventoryItems: InventoryItem[] = [
  {
    id: "inventory-1",
    name: "Rice",
    unit: "kg",
    currentStock: 25,
    lowStockThreshold: 5,
    price: 50,
    lastRestocked: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
  },
  {
    id: "inventory-2",
    name: "Urad Dal",
    unit: "kg",
    currentStock: 10,
    lowStockThreshold: 3,
    price: 120,
    lastRestocked: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
  },
  {
    id: "inventory-3",
    name: "Toor Dal",
    unit: "kg",
    currentStock: 8,
    lowStockThreshold: 2,
    price: 110,
    lastRestocked: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10 days ago
  },
  {
    id: "inventory-4",
    name: "Potatoes",
    unit: "kg",
    currentStock: 15,
    lowStockThreshold: 5,
    price: 30,
    lastRestocked: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
  },
  {
    id: "inventory-5",
    name: "Onions",
    unit: "kg",
    currentStock: 20,
    lowStockThreshold: 5,
    price: 40,
    lastRestocked: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
  },
  {
    id: "inventory-6",
    name: "Tomatoes",
    unit: "kg",
    currentStock: 10,
    lowStockThreshold: 4,
    price: 50,
    lastRestocked: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
  },
  {
    id: "inventory-7",
    name: "Milk",
    unit: "liter",
    currentStock: 30,
    lowStockThreshold: 10,
    price: 60,
    lastRestocked: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
  },
  {
    id: "inventory-8",
    name: "Coffee Powder",
    unit: "kg",
    currentStock: 5,
    lowStockThreshold: 1,
    price: 400,
    lastRestocked: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) // 15 days ago
  },
  {
    id: "inventory-9",
    name: "Sugar",
    unit: "kg",
    currentStock: 12,
    lowStockThreshold: 3,
    price: 45,
    lastRestocked: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000) // 8 days ago
  },
  {
    id: "inventory-10",
    name: "Coconut",
    unit: "piece",
    currentStock: 15,
    lowStockThreshold: 5,
    price: 30,
    lastRestocked: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) // 4 days ago
  },
  {
    id: "inventory-11",
    name: "Ghee",
    unit: "kg",
    currentStock: 4,
    lowStockThreshold: 1,
    price: 500,
    lastRestocked: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000) // 12 days ago
  },
  {
    id: "inventory-12",
    name: "Oil",
    unit: "liter",
    currentStock: 18,
    lowStockThreshold: 5,
    price: 120,
    lastRestocked: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) // 6 days ago
  },
  {
    id: "inventory-13",
    name: "Yogurt",
    unit: "kg",
    currentStock: 8,
    lowStockThreshold: 3,
    price: 80,
    lastRestocked: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
  },
  {
    id: "inventory-14",
    name: "Semolina",
    unit: "kg",
    currentStock: 6,
    lowStockThreshold: 2,
    price: 60,
    lastRestocked: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000) // 9 days ago
  },
  {
    id: "inventory-15",
    name: "Jaggery",
    unit: "kg",
    currentStock: 3,
    lowStockThreshold: 1,
    price: 70,
    lastRestocked: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000) // 11 days ago
  },
  {
    id: "inventory-16",
    name: "Cashews",
    unit: "kg",
    currentStock: 2,
    lowStockThreshold: 0.5,
    price: 800,
    lastRestocked: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) // 14 days ago
  },
  {
    id: "inventory-17",
    name: "Cardamom",
    unit: "kg",
    currentStock: 0.4,
    lowStockThreshold: 0.1,
    price: 1200,
    lastRestocked: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000) // 20 days ago
  },
  {
    id: "inventory-18",
    name: "Green Chilies",
    unit: "kg",
    currentStock: 2,
    lowStockThreshold: 0.5,
    price: 60,
    lastRestocked: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
  },
  {
    id: "inventory-19",
    name: "Curry Leaves",
    unit: "bunch",
    currentStock: 5,
    lowStockThreshold: 2,
    price: 10,
    lastRestocked: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
  },
  {
    id: "inventory-20",
    name: "Gram Flour",
    unit: "kg",
    currentStock: 7,
    lowStockThreshold: 2,
    price: 90,
    lastRestocked: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000) // 8 days ago
  }
];
