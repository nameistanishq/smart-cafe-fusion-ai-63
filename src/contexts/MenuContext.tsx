
import React, { createContext, useContext, useState, useEffect } from "react";
import { MenuItem } from "@/types";

interface MenuContextType {
  menuItems: MenuItem[];
  isLoading: boolean;
  addMenuItem: (item: Omit<MenuItem, "id">) => Promise<MenuItem>;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => Promise<MenuItem>;
  toggleItemAvailability: (id: string, isAvailable: boolean) => Promise<void>;
  getMenuItemById: (id: string) => MenuItem | undefined;
  getMenuItemsByCategory: (category: string) => MenuItem[];
  getMenuItemsByIngredient: (ingredient: string) => MenuItem[];
  getAvailableMenuItems: () => MenuItem[];
}

const MenuContext = createContext<MenuContextType>({
  menuItems: [],
  isLoading: true,
  addMenuItem: async () => ({} as MenuItem),
  updateMenuItem: async () => ({} as MenuItem),
  toggleItemAvailability: async () => {},
  getMenuItemById: () => undefined,
  getMenuItemsByCategory: () => [],
  getMenuItemsByIngredient: () => [],
  getAvailableMenuItems: () => [],
});

export const useMenu = () => useContext(MenuContext);

// Initial menu data
const initialMenuItems: MenuItem[] = [
  {
    id: "m1",
    name: "Masala Dosa",
    description: "Crispy rice pancake with spiced potato filling and chutneys",
    price: 70,
    category: "Breakfast",
    tags: ["vegetarian", "popular", "spicy"],
    isAvailable: true,
    image: "/assets/menu/placeholder.jpg",
    ingredients: ["rice", "potato", "spices"]
  },
  {
    id: "m2",
    name: "Plain Idli (2 pcs)",
    description: "Soft steamed rice cakes served with sambar and chutney",
    price: 40,
    category: "Breakfast",
    tags: ["vegetarian", "healthy", "gluten-free"],
    isAvailable: true,
    image: "/assets/menu/placeholder.jpg",
    ingredients: ["rice", "urad dal"]
  },
  {
    id: "m3",
    name: "Sambar Vada",
    description: "Crisp fried lentil doughnut soaked in spicy sambar",
    price: 50,
    category: "Breakfast",
    tags: ["vegetarian", "spicy"],
    isAvailable: true,
    image: "/assets/menu/placeholder.jpg",
    ingredients: ["urad dal", "spices", "vegetables"]
  },
  {
    id: "m4",
    name: "Mysore Bonda",
    description: "Deep-fried spicy potato dumplings",
    price: 45,
    category: "Snacks",
    tags: ["vegetarian", "spicy", "fried"],
    isAvailable: true,
    image: "/assets/menu/placeholder.jpg",
    ingredients: ["potato", "chickpea flour", "spices"]
  },
  {
    id: "m5",
    name: "Parotta",
    description: "Layered flatbread made with refined flour",
    price: 35,
    category: "Dinner",
    tags: ["vegetarian"],
    isAvailable: true,
    image: "/assets/menu/placeholder.jpg",
    ingredients: ["flour", "oil"]
  },
  {
    id: "m6",
    name: "Curd Rice",
    description: "Soft rice mixed with yogurt, tempered with mustard seeds and curry leaves",
    price: 60,
    category: "Lunch",
    tags: ["vegetarian", "healthy", "cooling"],
    isAvailable: true,
    image: "/assets/menu/placeholder.jpg",
    ingredients: ["rice", "yogurt", "spices"]
  },
  {
    id: "m7",
    name: "Vegetable Biriyani",
    description: "Aromatic rice dish with mixed vegetables and spices",
    price: 120,
    category: "Lunch",
    tags: ["vegetarian", "spicy", "popular"],
    isAvailable: true,
    image: "/assets/menu/placeholder.jpg",
    ingredients: ["basmati rice", "vegetables", "spices"]
  },
  {
    id: "m8",
    name: "Malabar Parotta with Chicken Curry",
    description: "Layered flatbread served with spicy chicken curry",
    price: 150,
    category: "Dinner",
    tags: ["non-vegetarian", "spicy", "popular"],
    isAvailable: true,
    image: "/assets/menu/placeholder.jpg",
    ingredients: ["flour", "chicken", "spices"]
  },
  {
    id: "m9",
    name: "Filter Coffee",
    description: "Traditional South Indian coffee made with chicory",
    price: 25,
    category: "Beverages",
    tags: ["vegetarian", "hot"],
    isAvailable: true,
    image: "/assets/menu/placeholder.jpg",
    ingredients: ["coffee beans", "milk"]
  },
  {
    id: "m10",
    name: "Mango Lassi",
    description: "Sweet yogurt drink with mango pulp",
    price: 55,
    category: "Beverages",
    tags: ["vegetarian", "sweet", "cold"],
    isAvailable: true,
    image: "/assets/menu/placeholder.jpg",
    ingredients: ["yogurt", "mango", "sugar"]
  },
  {
    id: "m11",
    name: "Gobi Manchurian",
    description: "Crispy cauliflower tossed in spicy sauce",
    price: 100,
    category: "Snacks",
    tags: ["vegetarian", "spicy", "indo-chinese"],
    isAvailable: true,
    image: "/assets/menu/placeholder.jpg",
    ingredients: ["cauliflower", "soy sauce", "spices"]
  },
  {
    id: "m12",
    name: "Rasam",
    description: "Tangy tamarind soup with spices",
    price: 40,
    category: "Soup",
    tags: ["vegetarian", "healthy", "hot"],
    isAvailable: true,
    image: "/assets/menu/placeholder.jpg",
    ingredients: ["tamarind", "tomato", "spices"]
  }
];

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load menu items from localStorage or use initial data
  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        const storedItems = localStorage.getItem("smartCafeteriaMenu");
        if (storedItems) {
          setMenuItems(JSON.parse(storedItems));
        } else {
          setMenuItems(initialMenuItems);
          localStorage.setItem("smartCafeteriaMenu", JSON.stringify(initialMenuItems));
        }
      } catch (error) {
        console.error("Failed to load menu items:", error);
        setMenuItems(initialMenuItems);
      } finally {
        setIsLoading(false);
      }
    };

    loadMenuItems();
  }, []);

  // Save menu items to localStorage whenever they change
  useEffect(() => {
    if (menuItems.length > 0 && !isLoading) {
      localStorage.setItem("smartCafeteriaMenu", JSON.stringify(menuItems));
    }
  }, [menuItems, isLoading]);

  const addMenuItem = async (item: Omit<MenuItem, "id">): Promise<MenuItem> => {
    const newItem: MenuItem = {
      ...item,
      id: `m${Date.now().toString(36)}`,
    };
    setMenuItems((prevItems) => [...prevItems, newItem]);
    return newItem;
  };

  const updateMenuItem = async (
    id: string,
    updates: Partial<MenuItem>
  ): Promise<MenuItem> => {
    let updatedItem: MenuItem | undefined;
    setMenuItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          updatedItem = { ...item, ...updates };
          return updatedItem;
        }
        return item;
      })
    );
    if (!updatedItem) throw new Error(`Menu item with id ${id} not found`);
    return updatedItem;
  };

  const toggleItemAvailability = async (id: string, isAvailable: boolean) => {
    await updateMenuItem(id, { isAvailable });
  };

  const getMenuItemById = (id: string) => {
    return menuItems.find((item) => item.id === id);
  };

  const getMenuItemsByCategory = (category: string) => {
    return menuItems.filter((item) => item.category === category);
  };

  const getMenuItemsByIngredient = (ingredient: string) => {
    return menuItems.filter((item) =>
      item.ingredients.includes(ingredient.toLowerCase())
    );
  };

  const getAvailableMenuItems = () => {
    return menuItems.filter((item) => item.isAvailable);
  };

  return (
    <MenuContext.Provider
      value={{
        menuItems,
        isLoading,
        addMenuItem,
        updateMenuItem,
        toggleItemAvailability,
        getMenuItemById,
        getMenuItemsByCategory,
        getMenuItemsByIngredient,
        getAvailableMenuItems,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};
