
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: "credit" | "debit";
  description: string;
  createdAt: Date;
}

interface WalletContextType {
  balance: number;
  transactions: Transaction[];
  isLoading: boolean;
  addFunds: (amount: number) => Promise<void>;
  makePayment: (amount: number, description: string) => Promise<boolean>;
}

const WalletContext = createContext<WalletContextType>({
  balance: 0,
  transactions: [],
  isLoading: true,
  addFunds: async () => {},
  makePayment: async () => false,
});

export const useWallet = () => useContext(WalletContext);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load wallet data when user changes
  useEffect(() => {
    if (!user) {
      setBalance(0);
      setTransactions([]);
      setIsLoading(false);
      return;
    }

    try {
      // Set initial balance from user
      setBalance(user.walletBalance || 0);

      // Load transactions from localStorage
      const storedTransactions = localStorage.getItem(`smartCafeteria_wallet_tx_${user.id}`);
      if (storedTransactions) {
        const parsedTransactions = JSON.parse(storedTransactions).map((tx: any) => ({
          ...tx,
          createdAt: new Date(tx.createdAt),
        }));
        setTransactions(parsedTransactions);
      } else {
        // Initialize with an empty array
        setTransactions([]);
      }
    } catch (error) {
      console.error("Failed to load wallet data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Save transactions to localStorage when they change
  useEffect(() => {
    if (user && !isLoading) {
      localStorage.setItem(`smartCafeteria_wallet_tx_${user.id}`, JSON.stringify(transactions));
    }
  }, [transactions, user, isLoading]);

  const addFunds = async (amount: number): Promise<void> => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add funds to your wallet.",
        variant: "destructive",
      });
      throw new Error("Authentication required");
    }

    if (amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to add.",
        variant: "destructive",
      });
      throw new Error("Invalid amount");
    }

    // Create a new transaction
    const newTransaction: Transaction = {
      id: `tx_${Date.now()}`,
      userId: user.id,
      amount,
      type: "credit",
      description: "Added funds to wallet",
      createdAt: new Date(),
    };

    // Update balance and transactions
    setBalance((prev) => prev + amount);
    setTransactions((prev) => [newTransaction, ...prev]);

    // Update user wallet balance in localStorage
    const updatedUser = { ...user, walletBalance: user.walletBalance + amount };
    localStorage.setItem("smartCafeteriaUser", JSON.stringify(updatedUser));

    toast({
      title: "Funds Added",
      description: `₹${amount} has been added to your wallet.`,
    });
  };

  const makePayment = async (amount: number, description: string): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to make a payment.",
        variant: "destructive",
      });
      return false;
    }

    if (amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Payment amount must be greater than zero.",
        variant: "destructive",
      });
      return false;
    }

    if (balance < amount) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough funds in your wallet.",
        variant: "destructive",
      });
      return false;
    }

    // Create a new transaction
    const newTransaction: Transaction = {
      id: `tx_${Date.now()}`,
      userId: user.id,
      amount,
      type: "debit",
      description,
      createdAt: new Date(),
    };

    // Update balance and transactions
    setBalance((prev) => prev - amount);
    setTransactions((prev) => [newTransaction, ...prev]);

    // Update user wallet balance in localStorage
    const updatedUser = { ...user, walletBalance: user.walletBalance - amount };
    localStorage.setItem("smartCafeteriaUser", JSON.stringify(updatedUser));

    toast({
      title: "Payment Successful",
      description: `₹${amount} has been debited from your wallet.`,
    });

    return true;
  };

  return (
    <WalletContext.Provider
      value={{
        balance,
        transactions,
        isLoading,
        addFunds,
        makePayment,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
