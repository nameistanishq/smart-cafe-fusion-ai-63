
import React, { createContext, useContext, useState, useEffect } from "react";
import { WasteRecord } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface WasteContextType {
  wasteRecords: WasteRecord[];
  isLoading: boolean;
  addRecord: (record: Omit<WasteRecord, "id">) => Promise<WasteRecord>;
  getRecordById: (id: string) => WasteRecord | undefined;
  getRecordsByDate: (date: Date) => WasteRecord[];
  getTotalWasteCost: () => number;
}

const WasteContext = createContext<WasteContextType>({
  wasteRecords: [],
  isLoading: true,
  addRecord: async () => ({} as WasteRecord),
  getRecordById: () => undefined,
  getRecordsByDate: () => [],
  getTotalWasteCost: () => 0,
});

export const useWaste = () => useContext(WasteContext);

// Initial waste records
const initialWasteRecords: WasteRecord[] = [
  {
    id: "w1",
    itemName: "Rice",
    quantity: 2,
    reason: "End of day leftovers",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Yesterday
    cost: 120,
  },
  {
    id: "w2",
    itemName: "Sambar",
    quantity: 3.5,
    reason: "Spoiled batch",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    cost: 175,
  },
  {
    id: "w3",
    itemName: "Idli Batter",
    quantity: 1.5,
    reason: "Fermentation issues",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    cost: 90,
  },
  {
    id: "w4",
    itemName: "Vegetable Curry",
    quantity: 2.2,
    reason: "Low demand",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Yesterday
    cost: 220,
  },
  {
    id: "w5",
    itemName: "Chicken Curry",
    quantity: 1.8,
    reason: "Overproduction",
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    cost: 360,
  },
  {
    id: "w6",
    itemName: "Coconut Chutney",
    quantity: 0.8,
    reason: "End of day leftovers",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    cost: 40,
  },
  {
    id: "w7",
    itemName: "Potato Masala",
    quantity: 1.2,
    reason: "Quality issues",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    cost: 65,
  }
];

export const WasteProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [wasteRecords, setWasteRecords] = useState<WasteRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Load waste records from localStorage
  useEffect(() => {
    try {
      const storedRecords = localStorage.getItem("smartCafeteriaWaste");
      if (storedRecords) {
        const parsedRecords = JSON.parse(storedRecords).map((record: any) => ({
          ...record,
          date: new Date(record.date),
        }));
        setWasteRecords(parsedRecords);
      } else {
        const formattedRecords = initialWasteRecords.map(record => ({
          ...record,
          date: new Date(record.date),
        }));
        setWasteRecords(formattedRecords);
        localStorage.setItem("smartCafeteriaWaste", JSON.stringify(formattedRecords));
      }
    } catch (error) {
      console.error("Failed to load waste records:", error);
      setWasteRecords(initialWasteRecords);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save waste records to localStorage when they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("smartCafeteriaWaste", JSON.stringify(wasteRecords));
    }
  }, [wasteRecords, isLoading]);

  const addRecord = async (record: Omit<WasteRecord, "id">): Promise<WasteRecord> => {
    const newRecord: WasteRecord = {
      ...record,
      id: `w${Date.now().toString(36)}`,
    };

    setWasteRecords((prevRecords) => [...prevRecords, newRecord]);
    
    toast({
      title: "Waste Record Added",
      description: `${newRecord.quantity} ${newRecord.itemName} recorded as waste.`,
    });
    
    return newRecord;
  };

  const getRecordById = (id: string): WasteRecord | undefined => {
    return wasteRecords.find((record) => record.id === id);
  };

  const getRecordsByDate = (date: Date): WasteRecord[] => {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    
    return wasteRecords.filter((record) => {
      const recordDate = new Date(record.date);
      recordDate.setHours(0, 0, 0, 0);
      return recordDate.getTime() === targetDate.getTime();
    });
  };

  const getTotalWasteCost = (): number => {
    // Calculate total waste cost for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    return wasteRecords
      .filter(record => record.date >= sevenDaysAgo)
      .reduce((total, record) => total + record.cost, 0);
  };

  return (
    <WasteContext.Provider
      value={{
        wasteRecords,
        isLoading,
        addRecord,
        getRecordById,
        getRecordsByDate,
        getTotalWasteCost,
      }}
    >
      {children}
    </WasteContext.Provider>
  );
};
