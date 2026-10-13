import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Image from "next/image";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/AddToCartButton";
import { ProductCard } from "@/components/ProductCard";
import { evaluateBooleanFlag, FIELD_NOTES_FLAG } from "@/lib/flags";
import { formatPrice } from "@/lib/money";
import {
  categoryLabel,
  getProduct,
  products,
  productsInCategory,
} from "@/lib/products";

const FieldNotes = dynamic(
  () => import("@/components/FieldNotes").then((mod) => mod.FieldNotes),
  {
    loading: () => <p role="status">Loading field notes…</p>,
  },
);

export const revalidate = 60;
export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Product" };
  return { title: product.name, description: product.summary };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const notes = evaluateBooleanFlag(FIELD_NOTES_FLAG);
  const related = productsInCategory(product.category)
    .filter((item) => item.slug !== product.slug)
    .slice(0, 2);

  return (
    <main id="main" className="shell">
      <article className="product-layout">
        <Image
          src={product.image}
          alt={product.imageAlt}
          width={800}
          height={800}
          priority
          fetchPriority="high"
          decoding="sync"
          sizes="(max-width: 800px) 100vw, 50vw"
        />
        <div>
          <p className="kicker">{categoryLabel(product.category)}</p>
          <h1>{product.name}</h1>
          <p className="lede">{product.description}</p>
          <dl className="specs">
            <dt>Price</dt>
            <dd>{formatPrice(product.priceCents)}</dd>
            <dt>Weight</dt>
            <dd>{product.weightGrams} g</dd>
          </dl>
          <AddToCartButton
            product={{
              slug: product.slug,
              name: product.name,
              priceCents: product.priceCents,
            }}
          />
        </div>
      </article>
      {notes.value ? (
        <section className="field-notes" aria-labelledby="notes-heading">
          <h2 id="notes-heading">Field notes</h2>
          <FieldNotes notes={product.notes} />
        </section>
      ) : (
        <p>Field notes are turned off for this deployment.</p>
      )}
      {related.length > 0 ? (
        <section aria-labelledby="related-heading">
          <div className="section-heading">
            <h2 id="related-heading">Also in {categoryLabel(product.category).toLowerCase()}</h2>
          </div>
          <ul className="product-grid">
            {related.map((item) => (
              <li key={item.slug}>
                <ProductCard product={item} headingLevel={3} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
