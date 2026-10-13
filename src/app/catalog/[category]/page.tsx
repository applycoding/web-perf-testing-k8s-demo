import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogBrowser } from "@/components/CatalogBrowser";
import { CategoryNav } from "@/components/CategoryNav";
import {
  CATEGORIES,
  categoryLabel,
  parseCategory,
  productsInCategory,
} from "@/lib/products";

export const revalidate = 60;
export const dynamicParams = false;

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: value } = await params;
  const category = parseCategory(value);
  if (!category) return { title: "Catalog" };
  const label = categoryLabel(category);
  return {
    title: label,
    description: `${label} from the Northline catalog.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: value } = await params;
  const category = parseCategory(value);
  if (!category) notFound();
  const label = categoryLabel(category);

  return (
    <main id="main" className="shell">
      <h1>{label}</h1>
      <p className="lede">A cached slice of the catalog. Search filters the list already on the page.</p>
      <CategoryNav current={category} />
      <CatalogBrowser products={productsInCategory(category)} />
    </main>
  );
}
