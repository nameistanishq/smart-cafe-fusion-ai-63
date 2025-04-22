
import React, { createContext, useContext, useState, useEffect } from "react";
import { InventoryItem } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface InventoryContextType {
  inventoryItems: InventoryItem[];
  isLoading: boolean;
  addItem: (item: Omit<InventoryItem, "id">) => Promise<InventoryItem>;
  updateItem: (id: string, updates: Partial<InventoryItem>) => Promise<InventoryItem>;
  getLowStockItems: () => InventoryItem[];
}

const InventoryContext = createContext<InventoryContextType>({
  inventoryItems: [],
  isLoading: true,
  addItem: async () => ({} as InventoryItem),
  updateItem: async () => ({} as InventoryItem),
  getLowStockItems: () => [],
});

export const useInventory = () => useContext(InventoryContext);

// Initial inventory data
const initialInventoryItems: InventoryItem[] = [
  {
    id: "i1",
    name: "Rice",
    unit: "kg",
    currentStock: 50,
    lowStockThreshold: 10,
    price: 60,
    lastRestocked: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
  },
  {
    id: "i2",
    name: "Urad Dal",
    unit: "kg",
    currentStock: 25,
    lowStockThreshold: 5,
    price: 120,
    lastRestocked: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
  },
  {
    id: "i3",
    name: "Potatoes",
    unit: "kg",
    currentStock: 30,
    lowStockThreshold: 8,
    price: 40,
    lastRestocked: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    id: "i4",
    name: "Tomatoes",
    unit: "kg",
    currentStock: 12,
    lowStockThreshold: 15,
    price: 80,
    lastRestocked: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
  },
  {
    id: "i5",
    name: "Milk",
    unit: "liter",
    currentStock: 40,
    lowStockThreshold: 10,
    price: 52,
    lastRestocked: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: "i6",
    name: "Ginger",
    unit: "kg",
    currentStock: 5,
    lowStockThreshold: 2,
    price: 120,
    lastRestocked: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
  },
  {
    id: "i7",
    name: "Cauliflower",
    unit: "kg",
    currentStock: 10,
    lowStockThreshold: 5,
    price: 70,
    lastRestocked: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    id: "i8",
    name: "Coconut",
    unit: "pieces",
    currentStock: 25,
    lowStockThreshold: 10,
    price: 25,
    lastRestocked: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
  },
  {
    id: "i9",
    name: "Mustard Seeds",
    unit: "kg",
    currentStock: 3,
    lowStockThreshold: 1,
    price: 240,
    lastRestocked: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
  },
  {
    id: "i10",
    name: "Green Chillies",
    unit: "kg",
    currentStock: 6,
    lowStockThreshold: 2,
    price: 90,
    lastRestocked: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
  },
];

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Load inventory from localStorage
  useEffect(() => {
    try {
      const storedItems = localStorage.getItem("smartCafeteriaInventory");
      if (storedItems) {
        const parsedItems = JSON.parse(storedItems).map((item: any) => ({
          ...item,
          lastRestocked: new Date(item.lastRestocked),
        }));
        setInventoryItems(parsedItems);
      } else {
        // Initialize with sample data
        const formattedItems = initialInventoryItems.map(item => ({
          ...item,
          lastRestocked: new Date(item.lastRestocked),
        }));
        setInventoryItems(formattedItems);
        localStorage.setItem("smartCafeteriaInventory", JSON.stringify(formattedItems));
      }
    } catch (error) {
      console.error("Failed to load inventory:", error);
      setInventoryItems(initialInventoryItems);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save inventory to localStorage when it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("smartCafeteriaInventory", JSON.stringify(inventoryItems));
    }
  }, [inventoryItems, isLoading]);

  const addItem = async (item: Omit<InventoryItem, "id">): Promise<InventoryItem> => {
    const newItem: InventoryItem = {
      ...item,
      id: `i${Date.now().toString(36)}`,
    };

    setInventoryItems((prevItems) => [...prevItems, newItem]);
    toast({
      title: "Inventory Updated",
      description: `${newItem.name} has been added to inventory.`,
    });
    return newItem;
  };

  const updateItem = async (
    id: string,
    updates: Partial<InventoryItem>
  ): Promise<InventoryItem> => {
    let updatedItem: InventoryItem | undefined;

    setInventoryItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          updatedItem = { ...item, ...updates };
          return updatedItem;
        }
        return item;
      })
    );

    if (!updatedItem) {
      throw new Error(`Inventory item with id ${id} not found`);
    }

    toast({
      title: "Inventory Updated",
      description: `${updatedItem.name} has been updated.`,
    });
    return updatedItem;
  };

  const getLowStockItems = (): InventoryItem[] => {
    return inventoryItems.filter(item => item.currentStock <= item.lowStockThreshold);
  };

  return (
    <InventoryContext.Provider
      value={{
        inventoryItems,
        isLoading,
        addItem,
        updateItem,
        getLowStockItems,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};
