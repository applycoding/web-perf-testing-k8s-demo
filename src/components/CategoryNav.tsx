import Link from "next/link";
import { CATEGORIES, categoryLabel, type Category } from "@/lib/products";

export function CategoryNav({ current }: { current?: Category }) {
  return (
    <nav aria-label="Categories">
      <ul className="category-list">
        <li>
          <Link href="/catalog" aria-current={current ? undefined : "page"}>
            All
          </Link>
        </li>
        {CATEGORIES.map((category) => (
          <li key={category}>
            <Link
              href={`/catalog/${category}`}
              aria-current={current === category ? "page" : undefined}
            >
              {categoryLabel(category)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
