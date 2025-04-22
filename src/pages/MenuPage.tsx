
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useMenu } from "@/contexts/MenuContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import ChatBot from "@/components/ai/ChatBot";
import {
  Search,
  Plus,
  Minus,
  ShoppingCart,
  ChevronRight,
  Bot,
} from "lucide-react";

const MenuPage: React.FC = () => {
  const { menuItems, isLoading } = useMenu();
  const { items: cartItems, addItem, updateQuantity } = useCart();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showChatbot, setShowChatbot] = useState(false);

  // Get available categories
  const categories = Array.from(
    new Set(menuItems.map((item) => item.category))
  ).sort();

  // Filtered menu items based on search
  const filteredItems = menuItems.filter(
    (item) =>
      item.isAvailable &&
      (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ))
  );

  // Group items by category
  const itemsByCategory = categories.map((category) => ({
    category,
    items: filteredItems.filter((item) => item.category === category),
  }));

  // Get quantity in cart for an item
  const getCartQuantity = (itemId: string) => {
    const cartItem = cartItems.find((item) => item.menuItem.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  // Add or update item in cart
  const handleAddToCart = (itemId: string) => {
    const item = menuItems.find((item) => item.id === itemId);
    if (!item) return;

    const currentQty = getCartQuantity(itemId);
    if (currentQty === 0) {
      addItem(item, 1);
    } else {
      updateQuantity(itemId, currentQty + 1);
    }
  };

  // Remove item from cart or decrease quantity
  const handleRemoveFromCart = (itemId: string) => {
    const currentQty = getCartQuantity(itemId);
    if (currentQty > 0) {
      updateQuantity(itemId, currentQty - 1);
    }
  };

  // Navigate to cart
  const handleViewCart = () => {
    navigate("/checkout");
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="pb-20">
      {/* Search and AI Assistant */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cafe-text/50" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for food, ingredients, or tags..."
            className="pl-10 bg-cafe-surface border-cafe-primary/20 text-cafe-text"
          />
        </div>

        <Button
          onClick={() => setShowChatbot(!showChatbot)}
          variant="outline"
          className="w-full border-cafe-primary/20 text-cafe-text hover:bg-cafe-primary/10"
        >
          <Bot className="mr-2 h-4 w-4 text-cafe-primary" />
          Ask our AI Food Assistant
        </Button>
      </div>

      {/* Chatbot */}
      {showChatbot && (
        <div className="mb-6">
          <ChatBot />
        </div>
      )}

      {/* Menu Tabs */}
      <Tabs defaultValue={categories[0]} className="w-full">
        <div className="mb-4 overflow-auto scrollbar-hide">
          <TabsList className="bg-cafe-surface">
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="data-[state=active]:bg-cafe-primary data-[state=active]:text-white"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Menu Content */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-10 w-10 border-4 border-cafe-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          categories.map((category) => (
            <TabsContent key={category} value={category}>
              <h2 className="text-xl font-semibold mb-4 text-cafe-text">
                {category}
              </h2>

              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {itemsByCategory
                  .find((c) => c.category === category)
                  ?.items.map((item) => (
                    <motion.div key={item.id} variants={item}>
                      <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 bg-cafe-surface border-cafe-primary/20">
                        <div className="relative h-40 bg-cafe-dark/30">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2 flex flex-wrap gap-1">
                            {item.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="bg-cafe-primary/80 text-white border-transparent text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium text-cafe-text">
                              {item.name}
                            </h3>
                            <span className="font-semibold text-cafe-primary">
                              ₹{item.price}
                            </span>
                          </div>
                          <p className="text-sm text-cafe-text/70 mb-4">
                            {item.description}
                          </p>

                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleRemoveFromCart(item.id)}
                                disabled={getCartQuantity(item.id) === 0}
                                className="h-8 w-8 border-cafe-primary/20 text-cafe-primary hover:bg-cafe-primary/10"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-6 text-center">
                                {getCartQuantity(item.id)}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleAddToCart(item.id)}
                                className="h-8 w-8 border-cafe-primary/20 text-cafe-primary hover:bg-cafe-primary/10"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAddToCart(item.id)}
                              className="text-cafe-primary hover:bg-cafe-primary/10"
                            >
                              Add to Cart
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
              </motion.div>

              {itemsByCategory.find((c) => c.category === category)?.items
                .length === 0 && (
                <div className="text-center py-8 text-cafe-text/70">
                  No items available in this category
                </div>
              )}
            </TabsContent>
          ))
        )}
      </Tabs>

      {/* Floating Cart Button */}
      {cartItems.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-20 left-0 right-0 mx-auto px-4 z-10 md:px-0 md:bottom-6 md:right-6 md:left-auto md:mx-0"
        >
          <Button
            onClick={handleViewCart}
            className="w-full md:w-auto bg-cafe-primary hover:bg-cafe-primary/90 text-white shadow-lg"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            <span className="mr-2">View Cart</span>
            <Badge variant="outline" className="bg-white text-cafe-primary border-transparent">
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)} items
            </Badge>
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default MenuPage;
