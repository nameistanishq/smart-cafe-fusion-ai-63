
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAi } from "@/contexts/AiContext";
import { useCart } from "@/contexts/CartContext";
import { useMenu } from "@/contexts/MenuContext";
import { Send, Bot, User, Sparkles, ShoppingCart } from "lucide-react";

const ChatBot: React.FC = () => {
  const { messages, sendMessage, isLoading } = useAi();
  const { menuItems } = useMenu();
  const { addItem } = useCart();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage(input);
      setInput("");
    }
  };

  // Function to handle quick suggestions
  const handleQuickSuggestion = (suggestion: string) => {
    sendMessage(suggestion);
  };

  // Function to add mentioned item to cart
  const findAndAddToCart = (message: string) => {
    // Extract item name from message like "I've added X to your cart"
    const regex = /added\s+(.+?)\s+to/i;
    const match = message.match(regex);
    
    if (match && match[1]) {
      const itemName = match[1].toLowerCase();
      
      // Find the menu item
      const menuItem = menuItems.find(
        item => item.name.toLowerCase().includes(itemName) && item.isAvailable
      );
      
      if (menuItem) {
        addItem(menuItem, 1);
      }
    }
  };

  // Check bot messages for cart additions
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'assistant' && 
        lastMessage.content.toLowerCase().includes('added') && 
        lastMessage.content.toLowerCase().includes('to your cart')) {
      findAndAddToCart(lastMessage.content);
    }
  }, [messages, menuItems, addItem]);

  // Quick suggestions
  const quickSuggestions = [
    "Recommend something for me",
    "What's popular today?",
    "I have diabetes, what should I eat?",
    "Order Masala Dosa",
    "Tell me about today's specials"
  ];

  return (
    <Card className="bg-cafe-surface border-cafe-primary/20 flex flex-col h-[600px]">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-cafe-text">
          <Bot className="mr-2 h-5 w-5 text-cafe-primary" />
          AI Food Assistant
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-grow overflow-y-auto scrollbar-thin p-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <Sparkles className="h-12 w-12 text-cafe-primary mb-4" />
            <h3 className="text-lg font-medium text-cafe-text mb-2">
              Smart Food Assistant
            </h3>
            <p className="text-cafe-text/70 mb-6">
              Ask me anything about our menu, get recommendations, or place an order directly!
            </p>
            <div className="grid grid-cols-1 gap-2 w-full max-w-md">
              {quickSuggestions.map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  onClick={() => handleQuickSuggestion(suggestion)}
                  className="justify-start border-cafe-primary/20 text-cafe-text hover:bg-cafe-primary/10"
                >
                  <span className="truncate">{suggestion}</span>
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex max-w-[80%] ${
                      message.role === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        message.role === "user"
                          ? "bg-cafe-primary ml-2"
                          : "bg-cafe-secondary mr-2"
                      }`}
                    >
                      {message.role === "user" ? (
                        <User className="h-4 w-4 text-white" />
                      ) : (
                        <Bot className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div
                      className={`rounded-lg p-3 ${
                        message.role === "user"
                          ? "bg-cafe-primary text-white"
                          : "bg-cafe-surface border border-cafe-primary/20 text-cafe-text"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      {message.role === "assistant" && 
                       message.content.toLowerCase().includes('added') && 
                       message.content.toLowerCase().includes('to your cart') && (
                        <div className="mt-2">
                          <Badge className="bg-cafe-primary flex items-center gap-1">
                            <ShoppingCart className="h-3 w-3" />
                            Added to Cart
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        )}
      </CardContent>
      
      <Separator className="bg-cafe-primary/10" />
      
      <CardFooter className="p-3">
        <form onSubmit={handleSend} className="flex w-full space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about menu or place an order..."
            disabled={isLoading}
            className="flex-grow bg-cafe-dark border-cafe-primary/20 text-cafe-text"
          />
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-cafe-primary hover:bg-cafe-primary/90"
          >
            {isLoading ? (
              <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default ChatBot;
