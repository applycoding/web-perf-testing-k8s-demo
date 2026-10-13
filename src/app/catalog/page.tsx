import type { Metadata } from "next";
import { CatalogBrowser } from "@/components/CatalogBrowser";
import { CategoryNav } from "@/components/CategoryNav";
import { products } from "@/lib/products";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Catalog",
  description: "Jackets, packs, and camp kit from Northline.",
};

export default function CatalogPage() {
  return (
    <main id="main" className="shell">
      <h1>Catalog</h1>
      <p className="lede">Everything currently in the shop. Category pages are cached and revalidated.</p>
      <CategoryNav />
      <CatalogBrowser products={products} />
    </main>
  );
}
