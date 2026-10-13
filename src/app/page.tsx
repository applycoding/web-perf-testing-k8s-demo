import { Suspense } from "react";
import { HeroCopy, HeroFigure } from "@/components/Hero";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/products";
import { workshopNotes } from "@/lib/workshop";

export default function HomePage() {
  const featured = products.slice(0, 3);

  return (
    <main id="main" className="shell">
      <section className="hero" aria-labelledby="hero-title">
        <Suspense fallback={<div className="hero-copy" aria-hidden="true" />}>
          <HeroCopy />
        </Suspense>
        <HeroFigure />
      </section>
      <section aria-labelledby="featured-heading">
        <div className="section-heading">
          <h2 id="featured-heading">In the shop this week</h2>
        </div>
        <ul className="product-grid">
          {featured.map((product) => (
            <li key={product.slug}>
              <ProductCard product={product} headingLevel={3} />
            </li>
          ))}
        </ul>
      </section>
      <section className="workshop" aria-labelledby="workshop-heading">
        <div className="section-heading">
          <h2 id="workshop-heading">From the workshop</h2>
        </div>
        <ul className="workshop-list">
          {workshopNotes.map((note) => (
            <li key={note.id} className="workshop-note">
              <h3>{note.title}</h3>
              <p>{note.body}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
