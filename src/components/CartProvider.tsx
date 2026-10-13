"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";

export interface CartLine {
  slug: string;
  name: string;
  priceCents: number;
  quantity: number;
}

interface CartItemInput {
  slug: string;
  name: string;
  priceCents: number;
}

interface CartContextValue {
  lines: CartLine[];
  count: number;
  add: (item: CartItemInput) => void;
  remove: (slug: string) => void;
  dialogRef: RefObject<HTMLDialogElement | null>;
  open: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const add = useCallback((item: CartItemInput) => {
    setLines((current) => {
      const existing = current.find((line) => line.slug === item.slug);
      if (!existing) return [...current, { ...item, quantity: 1 }];
      return current.map((line) =>
        line.slug === item.slug ? { ...line, quantity: line.quantity + 1 } : line,
      );
    });
  }, []);

  const remove = useCallback((slug: string) => {
    setLines((current) => current.filter((line) => line.slug !== slug));
  }, []);

  const open = useCallback(() => {
    dialogRef.current?.showModal();
  }, []);

  const count = lines.reduce((sum, line) => sum + line.quantity, 0);
  const value = useMemo(
    () => ({ lines, count, add, remove, dialogRef, open }),
    [lines, count, add, remove, open],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const value = useContext(CartContext);
  if (!value) {
    throw new Error("useCart must be used within CartProvider");
  }
  return value;
}
