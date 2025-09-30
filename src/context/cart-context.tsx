"use client";
import React, { createContext, useContext, useState, useMemo, useCallback } from "react";

export type CartItem = {
  slug: string;
  name: string;
  price: number;
  image: string;
  qty: number;
  phoneModel?: string; // selected phone model (iPhone 11, etc. or custom)
};

type CartContextValue = {
  items: CartItem[];
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (slug: string, phoneModel?: string) => void;
  clear: () => void;
  subtotal: number;
  open: boolean;
  setOpen: (v: boolean) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);

  const add: CartContextValue["add"] = useCallback((item, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.slug === item.slug && p.phoneModel === item.phoneModel);
      if (existing) {
        return prev.map((p) =>
          p.slug === item.slug && p.phoneModel === item.phoneModel ? { ...p, qty: p.qty + qty } : p
        );
      }
      return [...prev, { ...item, qty }];
    });
    setOpen(true);
  }, []);

  const remove: CartContextValue["remove"] = useCallback((slug, phoneModel) => {
    setItems((p) => p.filter((i) => !(i.slug === slug && (phoneModel ? i.phoneModel === phoneModel : true))));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.qty, 0),
    [items]
  );

  const value: CartContextValue = {
    items,
    add,
    remove,
    clear,
    subtotal,
    open,
    setOpen,
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
