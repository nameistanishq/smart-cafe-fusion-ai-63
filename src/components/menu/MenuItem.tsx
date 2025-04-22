
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  PlusCircle, 
  MinusCircle, 
  AlertCircle,
  Timer,
  Flame
} from "lucide-react";
import { MenuItem as MenuItemType } from "@/types";
import { useCart } from "@/contexts/CartContext";

interface MenuItemProps {
  item: MenuItemType;
}

const MenuItem: React.FC<MenuItemProps> = ({ item }) => {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    addItem(item, quantity);
    setQuantity(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="h-full"
    >
      <Card className="menu-item-card h-full flex flex-col">
        <CardContent className="p-3 flex flex-col h-full">
          <div className="relative h-40 mb-3 overflow-hidden rounded-md">
            <img
              src={item.image || "/assets/menu/placeholder.jpg"}
              alt={item.name}
              className="menu-item-image h-full w-full object-cover"
            />
            
            {!item.isAvailable && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <Badge variant="destructive" className="text-sm font-medium">
                  <AlertCircle className="h-3 w-3 mr-1" /> 
                  Currently Unavailable
                </Badge>
              </div>
            )}
            
            <div className="absolute top-2 right-2 flex flex-col gap-1">
              {item.isVegetarian && (
                <Badge className="bg-green-600 hover:bg-green-700">Veg</Badge>
              )}
              {item.isSpicy && (
                <Badge className="bg-red-600 hover:bg-red-700">
                  <Flame className="h-3 w-3 mr-1" /> Spicy
                </Badge>
              )}
            </div>
          </div>

          <div className="flex-grow">
            <h3 className="font-medium text-lg text-cafe-text mb-1">{item.name}</h3>
            <p className="text-cafe-text/70 text-sm mb-2 line-clamp-2">{item.description}</p>
            
            <div className="flex items-center mb-2">
              <Badge variant="outline" className="text-xs bg-cafe-surface border-cafe-primary/20">
                <Timer className="h-3 w-3 mr-1" /> 
                {item.prepTime} mins
              </Badge>
            </div>
            
            <div className="flex justify-between items-center mb-3">
              <span className="text-cafe-primary font-bold">₹{item.price}</span>
              {item.rating && (
                <Badge className="bg-cafe-secondary">
                  ★ {item.rating.toFixed(1)}
                </Badge>
              )}
            </div>
          </div>

          {item.isAvailable && (
            <div className="mt-auto">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center border border-cafe-primary/20 rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="h-8 w-8 text-cafe-primary"
                  >
                    <MinusCircle className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center text-cafe-text">{quantity}</span>
                  <Button
                    variant="ghost" 
                    size="icon"
                    onClick={incrementQuantity}
                    className="h-8 w-8 text-cafe-primary"
                  >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  onClick={handleAddToCart}
                  className="bg-cafe-primary hover:bg-cafe-primary/90 text-white"
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MenuItem;
