import React, { createContext, useContext, useState, useEffect } from 'react';
import { OrderItem } from '../types';

interface CartContextType {
  items: OrderItem[];
  addToCart: (item: OrderItem) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotalInr: number;
  m2mSurchargeTotalInr: number;
  hasMadeToMeasure: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'kayaa_cart_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<OrderItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(CART_STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (newItem: OrderItem) => {
    setItems((prev) => {
      // If it's standard size with identical customization, we can merge quantity
      if (newItem.size !== 'made-to-measure' && !newItem.customNote) {
        const existingIdx = prev.findIndex(
          (i) => i.productId === newItem.productId && i.size === newItem.size && !i.customNote
        );
        if (existingIdx >= 0) {
          const updated = [...prev];
          const curr = updated[existingIdx];
          const newQty = curr.quantity + newItem.quantity;
          updated[existingIdx] = {
            ...curr,
            quantity: newQty,
            lineTotalInr: (curr.unitPriceInr + curr.m2mSurchargeInr) * newQty,
          };
          return updated;
        }
      }
      return [newItem, ...prev];
    });
  };

  const removeFromCart = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }
    setItems((prev) => {
      const updated = [...prev];
      const item = updated[index];
      if (!item) return prev;
      updated[index] = {
        ...item,
        quantity,
        lineTotalInr: (item.unitPriceInr + item.m2mSurchargeInr) * quantity,
      };
      return updated;
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalInr = items.reduce((sum, item) => sum + item.unitPriceInr * item.quantity, 0);
  const m2mSurchargeTotalInr = items.reduce((sum, item) => sum + item.m2mSurchargeInr * item.quantity, 0);
  const hasMadeToMeasure = items.some((item) => item.size === 'made-to-measure');

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        subtotalInr,
        m2mSurchargeTotalInr,
        hasMadeToMeasure,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
