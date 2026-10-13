"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/products";
import { ProductCard } from "./ProductCard";

export function CatalogBrowser({
  products,
  headingLevel = 2,
}: {
  products: Product[];
  headingLevel?: 2 | 3;
}) {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();
  const visible = useMemo(
    () =>
      products.filter((product) => {
        if (normalized.length === 0) return true;
        return (
          product.name.toLowerCase().includes(normalized) ||
          product.summary.toLowerCase().includes(normalized)
        );
      }),
    [normalized, products],
  );

  return (
    <>
      <search className="catalog-search">
        <form
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <label htmlFor="catalog-search">Search this catalog</label>
          <input
            id="catalog-search"
            type="search"
            name="q"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            autoComplete="off"
          />
        </form>
      </search>
      <p aria-live="polite" className="result-count">
        {visible.length === 1 ? "1 product" : `${visible.length} products`}
      </p>
      {visible.length === 0 ? (
        <p>No products match that search.</p>
      ) : (
        <ul className="product-grid">
          {visible.map((product, index) => (
            <li key={product.slug}>
              <ProductCard
                product={product}
                headingLevel={headingLevel}
                priority={index === 0 && normalized.length === 0}
              />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
