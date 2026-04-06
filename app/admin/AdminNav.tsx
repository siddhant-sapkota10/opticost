"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin/jobs", label: "Job Listings" },
  { href: "/admin/applications", label: "Applications" },
  { href: "/admin/people", label: "People" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1">
      {links.map(({ href, label }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className="rounded-lg px-3 py-1.5 text-xs font-bold tracking-wide transition-all"
            style={
              active
                ? {
                    backgroundColor: "#ffffff",
                    color: "#0A1628",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                  }
                : {
                    color: "rgba(255,255,255,0.45)",
                  }
            }
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
