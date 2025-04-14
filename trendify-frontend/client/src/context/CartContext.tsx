import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

interface CartContextType {
  cartItemsCount: number;
  updateCartCount: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const { Backend_API, isLoggedIn, userData } = useAuth();

  const updateCartCount = async () => {
    if (!isLoggedIn || !userData) {
      setCartItemsCount(0);
      return;
    }

    try {
      const response = await axios.get(`${Backend_API}/api/cart/`, 
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setCartItemsCount(response.data.count);
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
      setCartItemsCount(0);
    }
  };

  useEffect(() => {
    updateCartCount();
  }, [isLoggedIn, userData]);

  const value = {
    cartItemsCount,
    updateCartCount
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
