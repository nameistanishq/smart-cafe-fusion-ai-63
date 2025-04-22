
import React, { useState } from "react";
import { motion } from "framer-motion";
import PageContainer from "@/components/shared/PageContainer";
import PageHeader from "@/components/shared/PageHeader";
import CategoryFilter from "@/components/menu/CategoryFilter";
import SearchFilter from "@/components/menu/SearchFilter";
import MenuGrid from "@/components/menu/MenuGrid";
import CartSummary from "@/components/cart/CartSummary";
import ChatBot from "@/components/ai/ChatBot";
import { Button } from "@/components/ui/button";
import { useMenu } from "@/contexts/MenuContext";
import { MessageSquare, ShoppingCart, X } from "lucide-react";

const MenuPage: React.FC = () => {
  const { menuCategories, isLoading } = useMenu();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-cafe-dark">
        <div className="spinner w-12 h-12"></div>
      </div>
    );
  }

  return (
    <div className="bg-cafe-dark min-h-screen">
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <PageHeader
            title="Smart Cafeteria Menu"
            description="Browse our delicious South Indian food items"
            action={
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowChatbot(!showChatbot);
                    setShowCart(false);
                  }}
                  className={`border-cafe-primary/20 ${
                    showChatbot
                      ? "bg-cafe-primary/20 text-cafe-primary"
                      : "text-cafe-text hover:bg-cafe-primary/10"
                  }`}
                >
                  {showChatbot ? (
                    <X className="mr-2 h-4 w-4" />
                  ) : (
                    <MessageSquare className="mr-2 h-4 w-4" />
                  )}
                  {showChatbot ? "Hide Assistant" : "Food Assistant"}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCart(!showCart);
                    setShowChatbot(false);
                  }}
                  className={`border-cafe-primary/20 ${
                    showCart
                      ? "bg-cafe-primary/20 text-cafe-primary"
                      : "text-cafe-text hover:bg-cafe-primary/10"
                  } sm:hidden`}
                >
                  {showCart ? (
                    <X className="mr-2 h-4 w-4" />
                  ) : (
                    <ShoppingCart className="mr-2 h-4 w-4" />
                  )}
                  {showCart ? "Hide Cart" : "View Cart"}
                </Button>
              </div>
            }
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="mb-6 space-y-4">
              <CategoryFilter
                categories={menuCategories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
              <SearchFilter
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />
            </div>

            {showChatbot && (
              <div className="mb-6 lg:hidden">
                <ChatBot />
              </div>
            )}

            {showCart && (
              <div className="mb-6 lg:hidden">
                <CartSummary />
              </div>
            )}

            <MenuGrid
              items={menuCategories.flatMap((cat) => cat.items)}
              searchTerm={searchTerm}
              categoryFilter={selectedCategory}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6 hidden lg:block"
          >
            <CartSummary />
            <ChatBot />
          </motion.div>
        </div>
      </PageContainer>
    </div>
  );
};

export default MenuPage;
