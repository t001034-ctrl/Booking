"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: "▦" },
  { href: "/admin/add-car", label: "Add New Car", icon: "+" },
  { href: "/admin/orders", label: "Orders", icon: "≡" },
  { href: "/", label: "User View", icon: "↗" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 border-r border-gray-200 bg-white md:block">
      <div className="sticky top-0 flex h-screen flex-col">
        <div className="border-b border-gray-200 px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Booking
          </p>
          <h2 className="mt-1 text-lg font-semibold text-gray-900">Admin</h2>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="w-5 text-center text-base text-gray-400">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
