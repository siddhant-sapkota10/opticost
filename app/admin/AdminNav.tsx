"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BriefcaseBusiness, FileText, Shield, Users } from "lucide-react";

const links = [
  { href: "/admin/jobs", label: "Job Listings", icon: BriefcaseBusiness },
  { href: "/admin/applications", label: "Applications", icon: FileText },
  { href: "/admin/people", label: "People", icon: Users },
  { href: "/admin/access", label: "Admin Access", icon: Shield },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-2">
      {links.map(({ href, label, icon: Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className="inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-semibold tracking-wide transition-all duration-200"
            style={
              active
                ? {
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(226,244,221,0.98) 100%)",
                    color: "#0A1628",
                    borderColor: "rgba(77,201,47,0.55)",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.18)",
                  }
                : {
                    color: "rgba(255,255,255,0.84)",
                    borderColor: "rgba(255,255,255,0.10)",
                    backgroundColor: "rgba(255,255,255,0.05)",
                  }
            }
          >
            <Icon size={16} strokeWidth={2.2} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
