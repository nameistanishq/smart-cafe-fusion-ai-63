
import React, { createContext, useContext, useState, useEffect } from "react";
import { ChatMessage, AiSuggestion, MenuItem } from "@/types";
import { useMenu } from "./MenuContext";
import { useCart } from "./CartContext";
import { useToast } from "@/hooks/use-toast";

interface AiContextType {
  messages: ChatMessage[];
  isLoading: boolean;
  sendMessage: (content: string) => Promise<void>;
  aiSuggestions: AiSuggestion[];
}

const AiContext = createContext<AiContextType>({
  messages: [],
  isLoading: false,
  sendMessage: async () => {},
  aiSuggestions: [],
});

export const useAi = () => useContext(AiContext);

// Initial AI suggestions
const initialAiSuggestions: AiSuggestion[] = [
  {
    title: "Menu Recommendation",
    description: "Consider offering a 'Breakfast Combo' of Idli and Dosa to increase morning sales.",
    priority: "medium",
  },
  {
    title: "Inventory Alert",
    description: "Tomato stock is below threshold. Order soon to maintain menu availability.",
    priority: "high",
  },
  {
    title: "Waste Reduction",
    description: "Rice waste is trending upward. Consider reducing batch sizes by 15% for evening service.",
    priority: "medium",
  },
  {
    title: "Peak Hours Analysis",
    description: "Customer traffic peaks between 12:30-1:30 PM. Schedule additional staff during this period.",
    priority: "low",
  },
];

export const AiProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [aiSuggestions, setAiSuggestions] = useState<AiSuggestion[]>(initialAiSuggestions);
  const { menuItems, getAvailableMenuItems } = useMenu();
  const { addItem } = useCart();
  const { toast } = useToast();

  // Load chat history from localStorage
  useEffect(() => {
    try {
      const storedMessages = localStorage.getItem("smartCafeteriaChat");
      if (storedMessages) {
        setMessages(
          JSON.parse(storedMessages).map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }))
        );
      }
    } catch (error) {
      console.error("Failed to load chat history:", error);
    }
  }, []);

  // Save chat history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("smartCafeteriaChat", JSON.stringify(messages));
    }
  }, [messages]);

  const processMessage = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    // Recommend menu items based on dietary requirements
    if (lowerMessage.includes("diabetes") || lowerMessage.includes("diabetic")) {
      return "For diabetic individuals, I recommend our Vegetable Soup (low in carbs) or the Steamed Idli without chutney. You could also try our Rasam which has minimal sugar content and is flavorful with spices.";
    }
    
    // Handle general recommendations
    if (lowerMessage.includes("recommend") || lowerMessage.includes("suggestion")) {
      return "I'd recommend our popular Masala Dosa or Vegetable Biriyani! Both are customer favorites. If you'd prefer something lighter, our Idli with Sambar is a nutritious choice.";
    }
    
    // Respond to query about available items
    if (lowerMessage.includes("what's available") || lowerMessage.includes("what is available") || lowerMessage.includes("today's specials")) {
      const availableItems = getAvailableMenuItems().slice(0, 3);
      
      if (availableItems.length === 0) {
        return "I'm checking our menu, but it seems we're experiencing some issues. Please check the menu tab directly.";
      }
      
      return `Today's specials include ${availableItems.map(item => item.name).join(', ')}. Would you like to order any of these?`;
    }
    
    // Handle order requests
    if (lowerMessage.includes("order") || lowerMessage.includes("get me") || lowerMessage.includes("i want") || lowerMessage.includes("i'd like")) {
      // Try to identify the requested item from the message
      const availableItems = getAvailableMenuItems();
      const requestedItem = availableItems.find(item => 
        lowerMessage.includes(item.name.toLowerCase())
      );
      
      if (requestedItem) {
        addItem(requestedItem, 1);
        return `I've added ${requestedItem.name} to your cart. Would you like anything else?`;
      } else {
        return "I'd be happy to help you order. Could you specify which menu item you'd like?";
      }
    }
    
    // Default response
    return "I'm your food assistant. I can help you with menu recommendations, information about our dishes, or placing an order. What would you like to know?";
  };

  const sendMessage = async (content: string): Promise<void> => {
    // Add user message
    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}_user`,
      role: "user",
      content,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Simulate AI processing delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Process the message and generate a response
      const responseContent = processMessage(content);
      
      // Add AI response
      const aiMessage: ChatMessage = {
        id: `msg_${Date.now()}_ai`,
        role: "assistant",
        content: responseContent,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error processing message:", error);
      toast({
        title: "Message Error",
        description: "Failed to process your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AiContext.Provider
      value={{
        messages,
        isLoading,
        sendMessage,
        aiSuggestions,
      }}
    >
      {children}
    </AiContext.Provider>
  );
};
