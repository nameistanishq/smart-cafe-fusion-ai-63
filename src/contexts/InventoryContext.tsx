
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { InventoryItem } from '@/types';
import { getInventoryItems, updateInventoryItem, addInventoryItem } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface InventoryContextProps {
  inventoryItems: InventoryItem[];
  isLoading: boolean;
  error: string | null;
  refreshInventory: () => Promise<void>;
  updateItem: (id: string, updates: Partial<InventoryItem>) => Promise<void>;
  addItem: (item: Omit<InventoryItem, "id">) => Promise<void>;
  getLowStockItems: () => InventoryItem[];
}

const InventoryContext = createContext<InventoryContextProps | undefined>(undefined);

interface InventoryProviderProps {
  children: ReactNode;
}

export const InventoryProvider = ({ children }: InventoryProviderProps) => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchInventory = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const itemsData = await getInventoryItems();
      setInventoryItems(itemsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load inventory data';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Inventory Loading Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const refreshInventory = async () => {
    await fetchInventory();
  };

  const updateItem = async (id: string, updates: Partial<InventoryItem>) => {
    try {
      const updatedItem = await updateInventoryItem(id, updates);
      
      // Update local state
      setInventoryItems(prevItems => 
        prevItems.map(item => 
          item.id === id ? { ...item, ...updates } : item
        )
      );
      
      toast({
        title: "Inventory Updated",
        description: `${updatedItem.name} has been updated.`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update inventory item';
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: errorMessage,
      });
    }
  };

  const addItem = async (item: Omit<InventoryItem, "id">) => {
    try {
      const newItem = await addInventoryItem(item);
      
      // Update local state
      setInventoryItems(prevItems => [...prevItems, newItem]);
      
      toast({
        title: "Inventory Item Added",
        description: `${newItem.name} has been added to inventory.`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add inventory item';
      toast({
        variant: "destructive",
        title: "Add Failed",
        description: errorMessage,
      });
    }
  };

  const getLowStockItems = () => {
    return inventoryItems.filter(item => item.currentStock <= item.lowStockThreshold);
  };

  return (
    <InventoryContext.Provider
      value={{
        inventoryItems,
        isLoading,
        error,
        refreshInventory,
        updateItem,
        addItem,
        getLowStockItems
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};
