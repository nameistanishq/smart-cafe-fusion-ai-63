
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { MenuCategory } from "@/types";

interface CategoryFilterProps {
  categories: MenuCategory[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex space-x-2 p-1">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => onSelectCategory(null)}
            className={`
              ${
                selectedCategory === null
                  ? "bg-cafe-primary text-white"
                  : "bg-cafe-surface border-cafe-primary/20 text-cafe-text hover:bg-cafe-primary/10"
              }
            `}
          >
            All Items
          </Button>
        </motion.div>

        {categories.map((category) => (
          <motion.div
            key={category.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => onSelectCategory(category.id)}
              className={`
                ${
                  selectedCategory === category.id
                    ? "bg-cafe-primary text-white"
                    : "bg-cafe-surface border-cafe-primary/20 text-cafe-text hover:bg-cafe-primary/10"
                }
              `}
            >
              {category.name}
            </Button>
          </motion.div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default CategoryFilter;
