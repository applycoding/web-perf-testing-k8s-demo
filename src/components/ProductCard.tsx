import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/money";
import { categoryLabel, type Product } from "@/lib/products";

export function ProductCard({
  product,
  priority = false,
  headingLevel = 2,
}: {
  product: Product;
  priority?: boolean;
  headingLevel?: 2 | 3;
}) {
  const Title = headingLevel === 3 ? "h3" : "h2";
  return (
    <article className="card">
      <Link href={`/products/${product.slug}`} className="card-link">
        <Image
          src={product.image}
          alt=""
          width={800}
          height={800}
          sizes="(max-width: 720px) 100vw, 30vw"
          priority={priority}
          fetchPriority={priority ? "high" : undefined}
          decoding={priority ? "sync" : "async"}
        />
        <Title>{product.name}</Title>
      </Link>
      <p className="card-meta">
        <span>{categoryLabel(product.category)}</span>
        <span className="price">{formatPrice(product.priceCents)}</span>
      </p>
      <p className="card-summary">{product.summary}</p>
    </article>
  );
}
