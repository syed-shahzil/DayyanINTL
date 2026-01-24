import { createContext, ReactNode, useEffect, useState } from 'react';
import { api } from '../lib/api';

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product?: {
    id: string;
    name: string;
    price: number;
    image_url: string;
    stock_quantity: number;
  };
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addItem: (productId: string, quantity: number) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
}

export const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children, userId }: { children: ReactNode; userId?: string }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchCart();
    } else {
      setItems([]);
    }
  }, [userId]);

  async function fetchCart() {
    setLoading(true);
    try {
      const data = await api.cart.get();
      // Backend returns generic product structure, map if necessary but likely compatible
      setItems(data as any as CartItem[]);
    } catch (e) {
      console.error("Failed to fetch cart", e);
    }
    setLoading(false);
  }

  async function addItem(productId: string, quantity: number) {
    if (!userId) return;
    try {
      await api.cart.add(productId, quantity);
      await fetchCart();
    } catch (e) {
      console.error("Failed to add item", e);
    }
  }

  async function removeItem(cartItemId: string) {
    await api.cart.remove(cartItemId);
    await fetchCart();
  }

  async function updateQuantity(cartItemId: string, quantity: number) {
    if (quantity <= 0) {
      await removeItem(cartItemId);
    } else {
      await api.cart.update(cartItemId, quantity);
      await fetchCart();
    }
  }

  async function clearCart() {
    if (!userId) return;
    await api.cart.clear();
    setItems([]);
  }

  function getCartTotal() {
    return items.reduce((total, item) => {
      // Ensure product exists and price is number
      const price = typeof item.product?.price === 'string' ? parseFloat(item.product.price) : (item.product?.price || 0);
      return total + price * item.quantity;
    }, 0);
  }

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
