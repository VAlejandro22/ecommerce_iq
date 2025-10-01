"use client";
import React, { createContext, useContext, useState, useMemo, useCallback } from "react";

export type CartItem = {
  slug: string;
  name: string;
  price: number; // base unit price (original)
  image: string;
  qty: number;
  phoneModel?: string; // selected phone model (iPhone 11, etc. or custom)
};

export type PricedCartItem = CartItem & {
  effectiveUnitPrice: number; // after promo (may be 1)
  lineBaseTotal: number;      // price * qty (no promo)
  lineEffectiveTotal: number; // sum of each unit after promo
  promoUnits: number;         // how many units in this line discounted (0 or more)
};

type CartContextValue = {
  items: CartItem[];
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (slug: string, phoneModel?: string) => void;
  clear: () => void;
  subtotal: number;            // base subtotal (sin promos)
  promoSubtotal: number;       // subtotal después de aplicar promos
  totalDiscount: number;       // subtotal - promoSubtotal
  pricedItems: PricedCartItem[]; // items enriquecidos para UI
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

  const { subtotal, pricedItems, promoSubtotal, totalDiscount } = useMemo(() => {
    const baseSubtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    // Expand each unit to linear order to know which indices are discounted.
    // Rule: every 3rd unit (indices 2,5,8...) becomes $1, and ALWAYS the most recently added unit qualifies.
    // Implementation: we derive a chronological flat list of references preserving line order.
    const flat: { ref: CartItem; lineIndex: number }[] = [];
    items.forEach((line, lineIdx) => {
      for (let u = 0; u < line.qty; u++) flat.push({ ref: line, lineIndex: lineIdx });
    });
    // Determine discounted unit positions:
    const discountedPositions = new Set<number>();
    for (let idx = 2; idx < flat.length; idx += 3) {
      discountedPositions.add(idx);
    }
    // Count how many promo units per line & adjusted totals.
    const linePromoUnits: Record<number, number> = {};
    flat.forEach((unit, idx) => {
      if (discountedPositions.has(idx)) {
        linePromoUnits[unit.lineIndex] = (linePromoUnits[unit.lineIndex] || 0) + 1;
      }
    });
    const enriched: PricedCartItem[] = items.map((line, idx) => {
      const promoUnits = linePromoUnits[idx] || 0;
      const fullUnits = line.qty - promoUnits;
      const lineBaseTotal = line.price * line.qty;
      const lineEffectiveTotal = fullUnits * line.price + promoUnits * 1; // $1 promo
      // effectiveUnitPrice shown: if mixed (some discounted), we keep base for clarity OR could show min; choose base for consistency.
      const effectiveUnitPrice = promoUnits === line.qty ? 1 : line.price;
      return {
        ...line,
        effectiveUnitPrice,
        lineBaseTotal,
        lineEffectiveTotal,
        promoUnits,
      };
    });
    const promoSubtotal = enriched.reduce((s, l) => s + l.lineEffectiveTotal, 0);
    const totalDiscount = baseSubtotal - promoSubtotal;
    return { subtotal: baseSubtotal, pricedItems: enriched, promoSubtotal, totalDiscount };
  }, [items]);

  const value: CartContextValue = {
    items,
    add,
    remove,
    clear,
    subtotal,
    promoSubtotal,
    totalDiscount,
    pricedItems,
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
