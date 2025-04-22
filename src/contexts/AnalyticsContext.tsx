
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Analytics } from '@/types';
import { getAnalytics } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface AnalyticsContextProps {
  analytics: Analytics | null;
  isLoading: boolean;
  error: string | null;
  refreshAnalytics: () => Promise<void>;
}

const AnalyticsContext = createContext<AnalyticsContextProps | undefined>(undefined);

interface AnalyticsProviderProps {
  children: ReactNode;
}

export const AnalyticsProvider = ({ children }: AnalyticsProviderProps) => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAnalytics = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const analyticsData = await getAnalytics();
      setAnalytics(analyticsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load analytics data';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Analytics Loading Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const refreshAnalytics = async () => {
    await fetchAnalytics();
  };

  return (
    <AnalyticsContext.Provider
      value={{
        analytics,
        isLoading,
        error,
        refreshAnalytics
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};
