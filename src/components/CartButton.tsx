"use client";

import { useCart } from "./CartProvider";

export function CartButton() {
  const { count, open } = useCart();
  const label = count === 1 ? "Pack, 1 item" : `Pack, ${count} items`;
  return (
    <button type="button" className="button button-quiet cart-button" onClick={open} aria-haspopup="dialog">
      {label}
    </button>
  );
}
