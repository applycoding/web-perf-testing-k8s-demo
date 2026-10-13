import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-inner">
        <p>Northline is a demo storefront for performance, accessibility, and delivery.</p>
        <nav aria-label="Footer">
          <ul className="nav-list">
            <li>
              <Link href="/catalog">Catalog</Link>
            </li>
            <li>
              <Link href="/signals">Signals</Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
