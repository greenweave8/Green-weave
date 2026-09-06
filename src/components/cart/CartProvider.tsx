"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export interface CartLine {
  key: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  size: string;
  qty: number;
}

interface AddItemInput {
  productId: string;
  name: string;
  image: string;
  price: number;
  size: string;
}

interface CartContextValue {
  items: CartLine[];
  count: number;
  subtotal: number;
  addItem: (input: AddItemInput, qty?: number) => void;
  updateQty: (key: string, qty: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
  toast: string | null;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "greenweave_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as CartLine[];
    } catch {
      // ignore storage errors
    }
    return [];
  });
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore storage errors
    }
  }, [items]);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2400);
  }, []);

  const addItem = useCallback(
    (input: AddItemInput, qty = 1) => {
      const key = `${input.productId}__${input.size}`;
      setItems((prev) => {
        const existing = prev.find((line) => line.key === key);
        if (existing) {
          return prev.map((line) =>
            line.key === key ? { ...line, qty: line.qty + qty } : line
          );
        }
        return [...prev, { ...input, key, qty }];
      });
      showToast(`${input.name} added to cart`);
    },
    [showToast]
  );

  const updateQty = useCallback((key: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((line) => line.key !== key)
        : prev.map((line) => (line.key === key ? { ...line, qty } : line))
    );
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((line) => line.key !== key));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, line) => sum + line.qty, 0);
    const subtotal = items.reduce(
      (sum, line) => sum + line.price * line.qty,
      0
    );
    return {
      items,
      count,
      subtotal,
      addItem,
      updateQty,
      removeItem,
      clearCart,
      toast,
    };
  }, [items, toast, addItem, updateQty, removeItem, clearCart]);

  return (
    <CartContext.Provider value={value}>
      {children}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}