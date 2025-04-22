
import { WasteRecord } from "@/types";

export const wasteRecords: WasteRecord[] = [
  {
    id: "waste-1",
    itemName: "Masala Dosa",
    quantity: 5,
    reason: "End of day leftovers",
    date: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    cost: 400
  },
  {
    id: "waste-2",
    itemName: "Idli",
    quantity: 10,
    reason: "Quality issues",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    cost: 300
  },
  {
    id: "waste-3",
    itemName: "Vegetable Biryani",
    quantity: 2,
    reason: "Customer return",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    cost: 240
  },
  {
    id: "waste-4",
    itemName: "Tomatoes",
    quantity: 3,
    reason: "Spoilage",
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    cost: 150
  },
  {
    id: "waste-5",
    itemName: "Milk",
    quantity: 2,
    reason: "Expired",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    cost: 120
  },
  {
    id: "waste-6",
    itemName: "Filter Coffee",
    quantity: 8,
    reason: "End of day leftovers",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    cost: 240
  },
  {
    id: "waste-7",
    itemName: "Sambar",
    quantity: 4,
    reason: "End of day leftovers",
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
    cost: 200
  },
  {
    id: "waste-8",
    itemName: "Coconut Chutney",
    quantity: 2,
    reason: "End of day leftovers",
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
    cost: 100
  },
  {
    id: "waste-9",
    itemName: "Yogurt",
    quantity: 1.5,
    reason: "Expired",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    cost: 120
  },
  {
    id: "waste-10",
    itemName: "Payasam",
    quantity: 1,
    reason: "Quality issues",
    date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
    cost: 65
  }
];
