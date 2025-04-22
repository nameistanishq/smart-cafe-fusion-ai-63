
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { CartState, MenuItem, CartItem } from '@/types';
import { useToast } from '@/hooks/use-toast';

// Define actions
type CartAction =
  | { type: 'ADD_ITEM'; payload: { menuItem: MenuItem; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { menuItemId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { menuItemId: string; quantity: number } }
  | { type: 'CLEAR_CART' };

// Initial state
const initialState: CartState = {
  items: [],
  subtotal: 0,
  tax: 0,
  total: 0
};

// Reducer function
const calculateTotals = (items: CartItem[]) => {
  const subtotal = items.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
  const tax = subtotal * 0.05; // 5% tax rate
  const total = subtotal + tax;
  
  return { subtotal, tax, total };
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { menuItem, quantity } = action.payload;
      
      // Check if item already exists in cart
      const existingItemIndex = state.items.findIndex(item => item.menuItem.id === menuItem.id);
      
      let newItems;
      
      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        newItems = [...state.items];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity
        };
      } else {
        // Add new item
        newItems = [...state.items, { menuItem, quantity }];
      }
      
      return {
        ...state,
        items: newItems,
        ...calculateTotals(newItems)
      };
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.menuItem.id !== action.payload.menuItemId);
      
      return {
        ...state,
        items: newItems,
        ...calculateTotals(newItems)
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const { menuItemId, quantity } = action.payload;
      
      // If quantity is 0 or less, remove the item
      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: { menuItemId } });
      }
      
      const newItems = state.items.map(item => 
        item.menuItem.id === menuItemId 
          ? { ...item, quantity } 
          : item
      );
      
      return {
        ...state,
        items: newItems,
        ...calculateTotals(newItems)
      };
    }
    
    case 'CLEAR_CART':
      return initialState;
      
    default:
      return state;
  }
};

// Create context
interface CartContextProps {
  cart: CartState;
  addItem: (menuItem: MenuItem, quantity: number) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

// Provider component
interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, dispatch] = useReducer(cartReducer, initialState);
  const { toast } = useToast();

  const addItem = (menuItem: MenuItem, quantity: number) => {
    dispatch({ type: 'ADD_ITEM', payload: { menuItem, quantity } });
    toast({
      title: "Added to cart",
      description: `${quantity} x ${menuItem.name} added to your cart`,
    });
  };

  const removeItem = (menuItemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { menuItemId } });
    toast({
      title: "Removed from cart",
      description: "Item removed from your cart",
    });
  };

  const updateQuantity = (menuItemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { menuItemId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    toast({
      title: "Cart cleared",
      description: "Your cart has been cleared",
    });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
