
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MenuItem, MenuCategory } from '@/types';
import { getMenuItems, getMenuCategories, updateMenuItemAvailability, addMenuItem } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface MenuContextProps {
  menuItems: MenuItem[];
  menuCategories: MenuCategory[];
  isLoading: boolean;
  error: string | null;
  refreshMenu: () => Promise<void>;
  updateItemAvailability: (id: string, isAvailable: boolean) => Promise<void>;
  addNewMenuItem: (item: Omit<MenuItem, "id">) => Promise<void>;
}

const MenuContext = createContext<MenuContextProps | undefined>(undefined);

interface MenuProviderProps {
  children: ReactNode;
}

export const MenuProvider = ({ children }: MenuProviderProps) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchMenuData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [itemsData, categoriesData] = await Promise.all([
        getMenuItems(),
        getMenuCategories()
      ]);
      
      setMenuItems(itemsData);
      setMenuCategories(categoriesData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load menu data';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Menu Loading Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuData();
  }, []);

  const refreshMenu = async () => {
    await fetchMenuData();
  };

  const updateItemAvailability = async (id: string, isAvailable: boolean) => {
    try {
      const updatedItem = await updateMenuItemAvailability(id, isAvailable);
      
      // Update local state
      setMenuItems(prevItems => 
        prevItems.map(item => 
          item.id === id ? { ...item, isAvailable } : item
        )
      );
      
      // Update in categories
      setMenuCategories(prevCategories => 
        prevCategories.map(category => ({
          ...category,
          items: category.items.map(item => 
            item.id === id ? { ...item, isAvailable } : item
          )
        }))
      );
      
      toast({
        title: "Menu Updated",
        description: `${updatedItem.name} is now ${isAvailable ? 'available' : 'unavailable'}.`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update menu item';
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: errorMessage,
      });
    }
  };

  const addNewMenuItem = async (item: Omit<MenuItem, "id">) => {
    try {
      const newItem = await addMenuItem(item);
      
      // Update local state
      setMenuItems(prevItems => [...prevItems, newItem]);
      
      // Update in categories
      setMenuCategories(prevCategories => 
        prevCategories.map(category => 
          category.id === item.category 
            ? { ...category, items: [...category.items, newItem] } 
            : category
        )
      );
      
      toast({
        title: "Menu Item Added",
        description: `${newItem.name} has been added to the menu.`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add menu item';
      toast({
        variant: "destructive",
        title: "Add Failed",
        description: errorMessage,
      });
    }
  };

  return (
    <MenuContext.Provider
      value={{
        menuItems,
        menuCategories,
        isLoading,
        error,
        refreshMenu,
        updateItemAvailability,
        addNewMenuItem
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};
