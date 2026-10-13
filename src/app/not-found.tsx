import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="shell">
      <h1>That page is not in the shop.</h1>
      <p className="lede">The link may be out of date. The catalog is a better place to start.</p>
      <Link href="/catalog" className="button">
        Back to the catalog
      </Link>
    </main>
  );
}
