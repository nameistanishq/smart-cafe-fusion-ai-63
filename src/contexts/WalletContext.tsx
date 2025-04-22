
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WalletTransaction } from '@/types';
import { getWalletBalance, getWalletTransactions, addWalletTransaction } from '@/services/api';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

interface WalletContextProps {
  balance: number;
  transactions: WalletTransaction[];
  isLoading: boolean;
  error: string | null;
  refreshWallet: () => Promise<void>;
  addTransaction: (type: 'deposit' | 'withdrawal' | 'payment', amount: number, description: string, orderId?: string) => Promise<void>;
}

const WalletContext = createContext<WalletContextProps | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const { user, isAuthenticated } = useAuth();
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchWalletData = async () => {
    if (!isAuthenticated || !user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const [balanceData, transactionsData] = await Promise.all([
        getWalletBalance(user.id),
        getWalletTransactions(user.id)
      ]);
      
      setBalance(balanceData);
      setTransactions(transactionsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load wallet data';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Wallet Loading Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchWalletData();
    }
  }, [isAuthenticated, user]);

  const refreshWallet = async () => {
    await fetchWalletData();
  };

  const addTransaction = async (
    type: 'deposit' | 'withdrawal' | 'payment', 
    amount: number, 
    description: string,
    orderId?: string
  ) => {
    if (!isAuthenticated || !user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "You must be logged in to perform wallet transactions.",
      });
      return;
    }
    
    try {
      const transaction = await addWalletTransaction({
        userId: user.id,
        amount,
        type,
        description,
        orderId
      });
      
      // Update local state
      if (type === 'deposit') {
        setBalance(prev => prev + amount);
      } else {
        setBalance(prev => prev - amount);
      }
      
      setTransactions(prev => [transaction, ...prev]);
      
      const actionText = type === 'deposit' ? 'added to' : 'deducted from';
      
      toast({
        title: "Transaction Successful",
        description: `₹${amount} has been ${actionText} your wallet.`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Transaction failed';
      toast({
        variant: "destructive",
        title: "Transaction Failed",
        description: errorMessage,
      });
    }
  };

  return (
    <WalletContext.Provider
      value={{
        balance,
        transactions,
        isLoading,
        error,
        refreshWallet,
        addTransaction
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
