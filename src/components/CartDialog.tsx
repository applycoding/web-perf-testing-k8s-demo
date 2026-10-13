"use client";

import { formatPrice } from "@/lib/money";
import { useCart } from "./CartProvider";

export function CartDialog() {
  const { lines, dialogRef, remove } = useCart();
  const total = lines.reduce((sum, line) => sum + line.priceCents * line.quantity, 0);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="cart-title"
      onClick={(event) => {
        if (event.target === dialogRef.current) {
          dialogRef.current?.close();
        }
      }}
    >
      <h2 id="cart-title">Your pack</h2>
      {lines.length === 0 ? (
        <p>Your pack is empty.</p>
      ) : (
        <ul className="cart-lines">
          {lines.map((line) => (
            <li key={line.slug}>
              <span>
                {line.name} × {line.quantity}
              </span>
              <span>{formatPrice(line.priceCents * line.quantity)}</span>
              <button type="button" onClick={() => remove(line.slug)}>
                Remove {line.name}
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="cart-total">
        Total <strong>{formatPrice(total)}</strong>
      </p>
      <form method="dialog">
        <button type="submit" className="button">
          Close
        </button>
      </form>
    </dialog>
  );
}
