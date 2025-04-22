
import { Transaction } from "@/types";

export const transactions: Transaction[] = [
  {
    id: "transaction-1",
    userId: "s1",
    type: "credit",
    amount: 500,
    description: "Wallet topup via UPI",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    status: "completed"
  },
  {
    id: "transaction-2",
    userId: "s1",
    type: "debit",
    amount: 231,
    description: "Payment for order #ORD123456",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    status: "completed"
  },
  {
    id: "transaction-3",
    userId: "s2",
    type: "credit",
    amount: 1000,
    description: "Wallet topup via Card",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    status: "completed"
  },
  {
    id: "transaction-4",
    userId: "s2",
    type: "debit",
    amount: 126,
    description: "Payment for order #ORD345678",
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    status: "completed"
  },
  {
    id: "transaction-5",
    userId: "s1",
    type: "credit",
    amount: 200,
    description: "Wallet topup via UPI",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    status: "completed"
  }
];
