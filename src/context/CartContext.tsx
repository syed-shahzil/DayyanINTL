import { createContext, ReactNode, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

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
    const { data } = await supabase
      .from('cart_items')
      .select('*, product:products(*)')
      .eq('user_id', userId);

    if (data) {
      setItems(data as CartItem[]);
    }
    setLoading(false);
  }

  async function addItem(productId: string, quantity: number) {
    if (!userId) return;

    const existing = items.find((item) => item.product_id === productId);

    if (existing) {
      await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + quantity })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('cart_items')
        .insert({ user_id: userId, product_id: productId, quantity });
    }

    await fetchCart();
  }

  async function removeItem(cartItemId: string) {
    await supabase.from('cart_items').delete().eq('id', cartItemId);
    await fetchCart();
  }

  async function updateQuantity(cartItemId: string, quantity: number) {
    if (quantity <= 0) {
      await removeItem(cartItemId);
    } else {
      await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', cartItemId);
      await fetchCart();
    }
  }

  async function clearCart() {
    if (!userId) return;
    await supabase.from('cart_items').delete().eq('user_id', userId);
    setItems([]);
  }

  function getCartTotal() {
    return items.reduce((total, item) => {
      return total + (item.product?.price || 0) * item.quantity;
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
