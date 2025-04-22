
import React, { createContext, useContext, useState, useEffect } from "react";
import { MenuItem, MenuCategory } from "@/types";
import { menuItems as initialMenuItems } from "@/data/menuItems";
import { menuCategories as initialMenuCategories } from "@/data/menuCategories";

export interface MenuContextType {
  menuItems: MenuItem[];
  menuCategories: MenuCategory[];
  isLoading: boolean;
  error: string | null;
  getMenuItemById: (id: string) => MenuItem | undefined;
  updateItemAvailability: (id: string, isAvailable: boolean) => Promise<void>;
  addNewMenuItem: (item: Omit<MenuItem, "id">) => Promise<void>;
  refreshMenu: () => void;
}

const MenuContext = createContext<MenuContextType>({
  menuItems: [],
  menuCategories: [],
  isLoading: true,
  error: null,
  getMenuItemById: () => undefined,
  updateItemAvailability: async () => {},
  addNewMenuItem: async () => {},
  refreshMenu: () => {},
});

export const useMenu = () => useContext(MenuContext);

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadMenuData = async () => {
    setIsLoading(true);
    try {
      // In a real app, you'd fetch from an API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setMenuItems(initialMenuItems);
      setMenuCategories(initialMenuCategories);
      setError(null);
    } catch (err) {
      setError("Failed to load menu data");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadMenuData();
  }, []);

  const getMenuItemById = (id: string) => {
    return menuItems.find(item => item.id === id);
  };

  const updateItemAvailability = async (id: string, isAvailable: boolean) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state
      setMenuItems(prevItems => 
        prevItems.map(item => 
          item.id === id ? { ...item, isAvailable } : item
        )
      );
    } catch (err) {
      setError("Failed to update item availability");
      console.error(err);
      throw err;
    }
  };

  const addNewMenuItem = async (item: Omit<MenuItem, "id">) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, the ID would be generated on the server
      const newItem: MenuItem = {
        ...item,
        id: `item-${Date.now()}`,
      };
      
      setMenuItems(prevItems => [...prevItems, newItem]);
    } catch (err) {
      setError("Failed to add new menu item");
      console.error(err);
      throw err;
    }
  };

  const refreshMenu = () => {
    loadMenuData();
  };

  return (
    <MenuContext.Provider
      value={{
        menuItems,
        menuCategories,
        isLoading,
        error,
        getMenuItemById,
        updateItemAvailability,
        addNewMenuItem,
        refreshMenu,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};
