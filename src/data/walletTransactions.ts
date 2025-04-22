
import { WalletTransaction } from "@/types";

export const walletTransactions: WalletTransaction[] = [
  {
    id: "transaction-1",
    userId: "user-1",
    amount: 200,
    type: "deposit",
    description: "Wallet recharge",
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10 days ago
  },
  {
    id: "transaction-2",
    userId: "user-1",
    amount: 150,
    type: "payment",
    description: "Payment for Order #SC123456",
    date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000), // 9 days ago
    orderId: "order-1"
  },
  {
    id: "transaction-3",
    userId: "user-1",
    amount: 300,
    type: "deposit",
    description: "Wallet recharge",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
  },
  {
    id: "transaction-4",
    userId: "user-1",
    amount: 120,
    type: "payment",
    description: "Payment for Order #SC123458",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    orderId: "order-3"
  },
  {
    id: "transaction-5",
    userId: "user-2",
    amount: 500,
    type: "deposit",
    description: "Wallet recharge",
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) // 15 days ago
  },
  {
    id: "transaction-6",
    userId: "user-2",
    amount: 200,
    type: "payment",
    description: "Payment for Order #SC123457",
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    orderId: "order-2"
  },
  {
    id: "transaction-7",
    userId: "user-2",
    amount: 300,
    type: "deposit",
    description: "Wallet recharge",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
  },
  {
    id: "transaction-8",
    userId: "user-2",
    amount: 150,
    type: "payment",
    description: "Payment for Order #SC123459",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    orderId: "order-4"
  }
];
