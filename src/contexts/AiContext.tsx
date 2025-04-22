
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Message, AiSuggestion, MenuItem } from '@/types';
import { getChatResponse, getAiSuggestions } from '@/services/api';
import { useMenu } from './MenuContext';
import { useToast } from '@/hooks/use-toast';

interface AiContextProps {
  messages: Message[];
  aiSuggestions: AiSuggestion[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  refreshSuggestions: () => Promise<void>;
}

const AiContext = createContext<AiContextProps | undefined>(undefined);

interface AiProviderProps {
  children: ReactNode;
}

export const AiProvider = ({ children }: AiProviderProps) => {
  const { menuItems } = useMenu();
  const [messages, setMessages] = useState<Message[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<AiSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSuggestions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const suggestionsData = await getAiSuggestions();
      setAiSuggestions(suggestionsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load AI suggestions';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "AI Suggestions Loading Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const refreshSuggestions = async () => {
    await fetchSuggestions();
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content,
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsLoading(true);
    
    try {
      const response = await getChatResponse(content, menuItems);
      
      const assistantMessage: Message = {
        id: `msg-${Date.now()}-assistant`,
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get response from assistant';
      toast({
        variant: "destructive",
        title: "Chat Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <AiContext.Provider
      value={{
        messages,
        aiSuggestions,
        isLoading,
        error,
        sendMessage,
        clearMessages,
        refreshSuggestions
      }}
    >
      {children}
    </AiContext.Provider>
  );
};

export const useAi = () => {
  const context = useContext(AiContext);
  if (context === undefined) {
    throw new Error('useAi must be used within an AiProvider');
  }
  return context;
};
