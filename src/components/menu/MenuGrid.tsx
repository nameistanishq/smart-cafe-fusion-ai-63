
import React from "react";
import { motion } from "framer-motion";
import { MenuItem as MenuItemType } from "@/types";
import MenuItem from "./MenuItem";

interface MenuGridProps {
  items: MenuItemType[];
  searchTerm: string;
  categoryFilter: string | null;
}

const MenuGrid: React.FC<MenuGridProps> = ({ 
  items, 
  searchTerm, 
  categoryFilter 
}) => {
  const filteredItems = items.filter(item => {
    // Apply search filter
    const matchesSearch = searchTerm === "" || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply category filter
    const matchesCategory = categoryFilter === null || 
      item.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  if (filteredItems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-8"
      >
        <p className="text-cafe-text/70 text-lg">No menu items found matching your criteria.</p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {filteredItems.map(item => (
        <MenuItem key={item.id} item={item} />
      ))}
    </div>
  );
};

export default MenuGrid;
