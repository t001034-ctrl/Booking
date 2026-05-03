"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/my-bookings", label: "My Bookings" },
];

export function UserNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-sm font-bold text-white">
            B
          </span>
          <span className="text-base font-semibold text-gray-900">Booking</span>
        </Link>

        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/admin"
            className="ml-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
