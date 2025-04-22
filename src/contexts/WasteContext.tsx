
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WasteRecord } from '@/types';
import { getWasteRecords, addWasteRecord } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface WasteContextProps {
  wasteRecords: WasteRecord[];
  isLoading: boolean;
  error: string | null;
  refreshWasteRecords: () => Promise<void>;
  addRecord: (record: Omit<WasteRecord, "id">) => Promise<void>;
  getTotalWasteCost: () => number;
  getRecordsByDate: (startDate: Date, endDate: Date) => WasteRecord[];
}

const WasteContext = createContext<WasteContextProps | undefined>(undefined);

interface WasteProviderProps {
  children: ReactNode;
}

export const WasteProvider = ({ children }: WasteProviderProps) => {
  const [wasteRecords, setWasteRecords] = useState<WasteRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchWasteRecords = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const recordsData = await getWasteRecords();
      setWasteRecords(recordsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load waste records';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Waste Records Loading Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWasteRecords();
  }, []);

  const refreshWasteRecords = async () => {
    await fetchWasteRecords();
  };

  const addRecord = async (record: Omit<WasteRecord, "id">) => {
    try {
      const newRecord = await addWasteRecord(record);
      
      // Update local state
      setWasteRecords(prevRecords => [newRecord, ...prevRecords]);
      
      toast({
        title: "Waste Record Added",
        description: `A waste record for ${newRecord.itemName} has been added.`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add waste record';
      toast({
        variant: "destructive",
        title: "Add Failed",
        description: errorMessage,
      });
    }
  };

  const getTotalWasteCost = () => {
    return wasteRecords.reduce((total, record) => total + record.cost, 0);
  };

  const getRecordsByDate = (startDate: Date, endDate: Date) => {
    return wasteRecords.filter(
      record => record.date >= startDate && record.date <= endDate
    );
  };

  return (
    <WasteContext.Provider
      value={{
        wasteRecords,
        isLoading,
        error,
        refreshWasteRecords,
        addRecord,
        getTotalWasteCost,
        getRecordsByDate
      }}
    >
      {children}
    </WasteContext.Provider>
  );
};

export const useWaste = () => {
  const context = useContext(WasteContext);
  if (context === undefined) {
    throw new Error('useWaste must be used within a WasteProvider');
  }
  return context;
};
