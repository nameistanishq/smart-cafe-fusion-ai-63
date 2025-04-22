
import React, { createContext, useContext, useState, useEffect } from "react";
import { WasteRecord } from "@/types";
import { wasteRecords as initialWasteRecords } from "@/data/wasteRecords";

interface WasteContextType {
  wasteRecords: WasteRecord[];
  isLoading: boolean;
  error: string | null;
  addWasteRecord: (record: Omit<WasteRecord, "id">) => Promise<void>;
  getTotalWasteCost: () => number;
}

const WasteContext = createContext<WasteContextType>({
  wasteRecords: [],
  isLoading: true,
  error: null,
  addWasteRecord: async () => {},
  getTotalWasteCost: () => 0,
});

export const useWaste = () => useContext(WasteContext);

export const WasteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wasteRecords, setWasteRecords] = useState<WasteRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load waste records from API or localStorage in a real app
    const loadWasteRecords = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setWasteRecords(initialWasteRecords);
        setError(null);
      } catch (err) {
        setError("Failed to load waste records");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadWasteRecords();
  }, []);

  const addWasteRecord = async (record: Omit<WasteRecord, "id">) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, this would be done on the server
      const newRecord: WasteRecord = {
        ...record,
        id: `waste-${Date.now()}`,
      };
      
      setWasteRecords(prev => [...prev, newRecord]);
      return;
    } catch (err) {
      setError("Failed to add waste record");
      console.error(err);
      throw err;
    }
  };

  const getTotalWasteCost = () => {
    // Calculate total waste cost for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return wasteRecords
      .filter(record => new Date(record.date) >= thirtyDaysAgo)
      .reduce((total, record) => total + record.cost, 0);
  };

  return (
    <WasteContext.Provider
      value={{
        wasteRecords,
        isLoading,
        error,
        addWasteRecord,
        getTotalWasteCost,
      }}
    >
      {children}
    </WasteContext.Provider>
  );
};
