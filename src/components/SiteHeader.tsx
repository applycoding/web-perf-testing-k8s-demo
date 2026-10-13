import Link from "next/link";
import { CartButton } from "./CartButton";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link href="/" className="wordmark">
          Northline
        </Link>
        <nav aria-label="Primary">
          <ul className="nav-list">
            <li>
              <Link href="/catalog">Catalog</Link>
            </li>
            <li>
              <Link href="/signals">Signals</Link>
            </li>
          </ul>
        </nav>
        <CartButton />
      </div>
    </header>
  );
}
