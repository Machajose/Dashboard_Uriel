import Link from "next/link";

const NAV_LINKS = [
  { label: "Product", href: "#" },
  { label: "Projects", href: "#" },
  { label: "About", href: "#" },
  { label: "Contact", href: "#" },
];

export default function Navbar() {
  return (
    <nav className="relative z-20 flex items-center justify-between px-8 py-5 max-w-6xl mx-auto">
      <Link href="/" className="flex items-center gap-2 font-semibold text-lg text-neutral-900">
        <span className="text-xl">⚡</span>
        Joseph
      </Link>

      <div className="hidden md:flex items-center gap-8 text-sm text-neutral-600">
        {NAV_LINKS.map((link) => (
          <a key={link.label} href={link.href} className="hover:text-neutral-900 transition">
            {link.label}
          </a>
        ))}
      </div>

      <Link
        href="/dashboard"
        className="text-sm px-4 py-2 rounded-lg bg-neutral-900 text-white hover:bg-neutral-700 transition"
      >
        Open Dashboard
      </Link>
    </nav>
  );
}