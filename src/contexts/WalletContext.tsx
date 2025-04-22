
import React, { createContext, useContext, useState, useEffect } from "react";
import { Transaction } from "@/types";
import { useAuth } from "./AuthContext";
import { transactions as initialTransactions } from "@/data/transactions";

interface WalletContextType {
  balance: number;
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  addTransaction: (type: "credit" | "debit" | "payment" | "deposit", amount: number, description: string) => Promise<void>;
  refreshWallet: () => void;
}

const WalletContext = createContext<WalletContextType>({
  balance: 0,
  transactions: [],
  isLoading: true,
  error: null,
  addTransaction: async () => {},
  refreshWallet: () => {},
});

export const useWallet = () => useContext(WalletContext);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadWalletData = async () => {
    if (!user) {
      setBalance(0);
      setTransactions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // In a real app, you'd fetch from an API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filter transactions for the current user
      const userTransactions = initialTransactions.filter(
        transaction => transaction.userId === user.id
      );
      
      setTransactions(userTransactions);
      
      // Calculate balance from transactions
      const userBalance = user.walletBalance || 0;
      setBalance(userBalance);
      
      setError(null);
    } catch (err) {
      setError("Failed to load wallet data");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load wallet data when user changes
  useEffect(() => {
    loadWalletData();
  }, [user]);

  const addTransaction = async (
    transactionType: "credit" | "debit" | "payment" | "deposit", 
    amount: number, 
    description: string
  ) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      // Validate amount
      if (amount <= 0) {
        throw new Error("Amount must be greater than zero");
      }

      // For debit/payment transactions, check if sufficient balance
      if ((transactionType === "debit" || transactionType === "payment") && amount > balance) {
        throw new Error("Insufficient balance");
      }

      // Map to the actual transaction type
      const actualType = transactionType === "payment" || transactionType === "debit" 
        ? "debit" 
        : "credit";

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, this would be done on the server
      const newTransaction: Transaction = {
        id: `transaction-${Date.now()}`,
        userId: user.id,
        type: actualType,
        amount,
        description,
        createdAt: new Date(),
        status: "completed",
      };
      
      // Update local state
      setTransactions(prev => [...prev, newTransaction]);
      setBalance(prev => 
        actualType === "credit" ? prev + amount : prev - amount
      );
      
      return;
    } catch (err) {
      setError("Transaction failed");
      console.error(err);
      throw err;
    }
  };

  const refreshWallet = () => {
    loadWalletData();
  };

  return (
    <WalletContext.Provider
      value={{
        balance,
        transactions,
        isLoading,
        error,
        addTransaction,
        refreshWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
